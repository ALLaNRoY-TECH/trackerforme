const path = require('path');
const fs = require('fs');

const usePostgres = !!process.env.DATABASE_URL;
const isVercel = !!process.env.VERCEL;

let db;
let pool;
let isPostgresActive = usePostgres;

if (usePostgres) {
  console.log("Configuring PostgreSQL database connection...");
  const { Pool } = require('pg');
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    },
    connectionTimeoutMillis: 15000 // Allow up to 15s for Neon Postgres cold-start
  });
} else if (!isVercel) {
  console.log("Configuring SQLite database connection...");
  const sqlite3 = require('sqlite3').verbose();
  const dbPath = path.join(__dirname, 'db.sqlite');
  db = new sqlite3.Database(dbPath);
} else {
  console.log("Running on Vercel without DATABASE_URL. SQLite fallback is disabled.");
}

// Convert SQLite parameter placeholders (?) to PostgreSQL ($1, $2...)
function queryParams(sql, params) {
  if (!isPostgresActive) return { sql, params };
  let index = 1;
  const pgSql = sql.replace(/\?/g, () => `$${index++}`);
  return { sql: pgSql, params };
}

const run = async (sql, params = []) => {
  if (isPostgresActive) {
    const pg = queryParams(sql, params);
    let cleanSql = pg.sql;
    
    // For inserts, return ID to match SQLite behaviour
    const upperSql = cleanSql.trim().toUpperCase();
    if ((upperSql.startsWith('INSERT INTO USERS') || upperSql.startsWith('INSERT INTO STUDY_SESSIONS')) && !upperSql.includes('RETURNING')) {
      cleanSql += ' RETURNING id';
    }
    
    const res = await pool.query(cleanSql, pg.params);
    const lastID = res.rows[0] ? res.rows[0].id : null;
    return { id: lastID, changes: res.rowCount };
  } else {
    return new Promise((resolve, reject) => {
      db.run(sql, params, function(err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, changes: this.changes });
      });
    });
  }
};

const get = async (sql, params = []) => {
  if (isPostgresActive) {
    const pg = queryParams(sql, params);
    const res = await pool.query(pg.sql, pg.params);
    return res.rows[0] || null;
  } else {
    return new Promise((resolve, reject) => {
      db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }
};

const all = async (sql, params = []) => {
  if (isPostgresActive) {
    const pg = queryParams(sql, params);
    const res = await pool.query(pg.sql, pg.params);
    return res.rows;
  } else {
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }
};

const exec = async (sql) => {
  if (isPostgresActive) {
    // Postgres compatible schema migrations
    let cleanSql = sql
      .replace(/INTEGER PRIMARY KEY AUTOINCREMENT/g, 'SERIAL PRIMARY KEY')
      .replace(/REAL/g, 'DOUBLE PRECISION')
      .replace(/DATETIME/g, 'TIMESTAMP')
      .replace(/VARCHAR/g, 'TEXT');
    await pool.query(cleanSql);
  } else {
    return new Promise((resolve, reject) => {
      db.exec(sql, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
};

async function initDb() {
  if (isVercel && !usePostgres) {
    throw new Error("DATABASE_URL environment variable is not configured. Please set it in your Vercel project settings.");
  }

  if (isPostgresActive) {
    try {
      console.log("Verifying PostgreSQL connectivity...");
      // Run quick query to test connection
      await pool.query("SELECT 1");
      console.log("PostgreSQL connection verified successfully.");
    } catch (pgErr) {
      console.warn("PostgreSQL connection failed to establish:", pgErr.message);
      if (isVercel) {
        throw new Error("PostgreSQL connection failed: " + pgErr.message);
      }
      console.warn("Falling back to local SQLite database...");
      isPostgresActive = false;
      
      // Initialize SQLite instead
      const sqlite3 = require('sqlite3').verbose();
      const dbPath = path.join(__dirname, 'db.sqlite');
      db = new sqlite3.Database(dbPath);
    }
  }

  try {
    if (!isPostgresActive) {
      // Enable foreign keys in SQLite
      await run("PRAGMA foreign_keys = ON;");
    }

    // Create tables
    await exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        current_day INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS curriculum_days (
        day_number INTEGER PRIMARY KEY,
        dsa_topic TEXT NOT NULL,
        dsa_tasks TEXT NOT NULL,
        dsa_resource TEXT NOT NULL,
        cyber_topic TEXT NOT NULL,
        cyber_tasks TEXT NOT NULL,
        cyber_resource TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS user_day_progress (
        user_id INTEGER,
        day_number INTEGER,
        dsa_tasks_completed TEXT DEFAULT '[]',
        cyber_tasks_completed TEXT DEFAULT '[]',
        dsa_completed INTEGER DEFAULT 0,
        cyber_completed INTEGER DEFAULT 0,
        day_completed_at TIMESTAMP,
        PRIMARY KEY (user_id, day_number),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS study_sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        check_in_time TIMESTAMP NOT NULL,
        check_out_time TIMESTAMP,
        duration_minutes REAL DEFAULT 0,
        associated_day_number INTEGER,
        track TEXT DEFAULT 'both',
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS daily_log (
        user_id INTEGER,
        date TEXT,
        total_minutes_studied REAL DEFAULT 0,
        day_number_covered INTEGER,
        PRIMARY KEY (user_id, date),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    console.log("Database tables initialized.");

    // Seed curriculum if empty
    const countRow = await get("SELECT COUNT(*) AS cnt FROM curriculum_days");
    const count = parseInt(countRow ? (countRow.cnt || countRow.count) : 0, 10) || 0;
    
    if (count === 0) {
      console.log("Seeding curriculum days...");
      const curriculumPath = path.join(__dirname, 'data', 'curriculum.json');
      if (fs.existsSync(curriculumPath)) {
        const curriculumData = JSON.parse(fs.readFileSync(curriculumPath, 'utf8'));
        
        if (isPostgresActive) {
          console.log("Running Postgres bulk insert...");
          for (const day of curriculumData) {
            await run(
              `INSERT INTO curriculum_days (
                day_number, dsa_topic, dsa_tasks, dsa_resource,
                cyber_topic, cyber_tasks, cyber_resource
              ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
              [
                day.day_number,
                day.dsa_topic,
                JSON.stringify(day.dsa_tasks),
                day.dsa_resource,
                day.cyber_topic,
                JSON.stringify(day.cyber_tasks),
                day.cyber_resource
              ]
            );
          }
          console.log(`Seeded ${curriculumData.length} curriculum days to Postgres successfully.`);
        } else {
          // Use SQLite transaction for fast inserts
          await run("BEGIN TRANSACTION;");
          try {
            for (const day of curriculumData) {
              await run(
                `INSERT INTO curriculum_days (
                  day_number, dsa_topic, dsa_tasks, dsa_resource,
                  cyber_topic, cyber_tasks, cyber_resource
                ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
                  day.day_number,
                  day.dsa_topic,
                  JSON.stringify(day.dsa_tasks),
                  day.dsa_resource,
                  day.cyber_topic,
                  JSON.stringify(day.cyber_tasks),
                  day.cyber_resource
                ]
              );
            }
            await run("COMMIT;");
            console.log(`Seeded ${curriculumData.length} curriculum days to SQLite successfully.`);
          } catch (seedErr) {
            await run("ROLLBACK;");
            console.error("Error seeding transaction, rolled back:", seedErr);
          }
        }
      } else {
        console.error("Error: Seed curriculum.json file not found at " + curriculumPath);
      }
    } else {
      console.log(`Curriculum already seeded (${count} entries).`);
    }
  } catch (err) {
    console.error("Failed to initialize database:", err);
    throw err;
  }
}

module.exports = {
  db,
  run,
  get,
  all,
  exec,
  initDb
};

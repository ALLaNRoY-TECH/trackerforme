const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'db.sqlite');
const db = new sqlite3.Database(dbPath);

const run = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
};

const get = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const all = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

const exec = (sql) => {
  return new Promise((resolve, reject) => {
    db.exec(sql, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};

async function initDb() {
  try {
    // Enable foreign keys
    await run("PRAGMA foreign_keys = ON;");

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
    if (countRow.cnt === 0) {
      console.log("Seeding curriculum days...");
      const curriculumPath = path.join(__dirname, 'data', 'curriculum.json');
      if (fs.existsSync(curriculumPath)) {
        const curriculumData = JSON.parse(fs.readFileSync(curriculumPath, 'utf8'));
        
        // Use a transaction for fast inserts
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
          console.log(`Seeded ${curriculumData.length} curriculum days successfully.`);
        } catch (seedErr) {
          await run("ROLLBACK;");
          console.error("Error seeding transaction, rolled back:", seedErr);
        }
      } else {
        console.error("Error: Seed curriculum.json file not found at " + curriculumPath);
      }
    } else {
      console.log(`Curriculum already seeded (${countRow.cnt} entries).`);
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

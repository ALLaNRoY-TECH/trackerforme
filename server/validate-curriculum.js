const fs = require('fs');
const path = require('path');

const curriculumPath = path.join(__dirname, 'data', 'curriculum.json');

function validate() {
  if (!fs.existsSync(curriculumPath)) {
    console.error(`Error: Curriculum file not found at ${curriculumPath}`);
    process.exit(1);
  }

  let curriculum;
  try {
    const rawData = fs.readFileSync(curriculumPath, 'utf8');
    curriculum = JSON.parse(rawData);
  } catch (err) {
    console.error('Error parsing curriculum JSON:', err.message);
    process.exit(1);
  }

  if (!Array.isArray(curriculum)) {
    console.error('Error: Curriculum must be a JSON array of days');
    process.exit(1);
  }

  console.log(`Checking curriculum file: ${curriculum.length} entries found.`);

  const dayNumbers = curriculum.map(d => d.day_number);
  const maxDay = Math.max(...dayNumbers, -1);
  console.log(`Max day number in curriculum: Day ${maxDay}`);

  // Check for missing days
  const missingDays = [];
  for (let i = 0; i <= maxDay; i++) {
    if (!dayNumbers.includes(i)) {
      missingDays.push(i);
    }
  }

  if (missingDays.length > 0) {
    console.error(`Error: Missing days in curriculum sequence: ${missingDays.join(', ')}`);
  }

  const dsaTopics = new Map();
  const cyberTopics = new Map();

  let errors = 0;
  let warnings = 0;

  curriculum.forEach(day => {
    const dn = day.day_number;
    const prefix = `[Day ${dn}]`;

    // 1. Check basic structure
    if (typeof dn !== 'number' || dn < 0) {
      console.error(`${prefix} Error: Invalid day_number`);
      errors++;
    }

    if (!day.dsa_topic || typeof day.dsa_topic !== 'string') {
      console.error(`${prefix} Error: Missing or invalid dsa_topic`);
      errors++;
    }

    if (!Array.isArray(day.dsa_tasks) || day.dsa_tasks.length < 3) {
      console.error(`${prefix} Error: dsa_tasks must be an array with at least 3 items (found ${day.dsa_tasks ? day.dsa_tasks.length : 0})`);
      errors++;
    }

    if (!day.dsa_resource || typeof day.dsa_resource !== 'string') {
      console.error(`${prefix} Error: Missing or invalid dsa_resource`);
      errors++;
    }

    if (!day.cyber_topic || typeof day.cyber_topic !== 'string') {
      console.error(`${prefix} Error: Missing or invalid cyber_topic`);
      errors++;
    }

    if (!Array.isArray(day.cyber_tasks) || day.cyber_tasks.length < 3) {
      console.error(`${prefix} Error: cyber_tasks must be an array with at least 3 items (found ${day.cyber_tasks ? day.cyber_tasks.length : 0})`);
      errors++;
    }

    if (!day.cyber_resource || typeof day.cyber_resource !== 'string') {
      console.error(`${prefix} Error: Missing or invalid cyber_resource`);
      errors++;
    }

    // Check tasks content
    if (Array.isArray(day.dsa_tasks)) {
      day.dsa_tasks.forEach((t, i) => {
        if (!t || typeof t !== 'string' || t.trim() === '') {
          console.error(`${prefix} Error: Empty DSA task at index ${i}`);
          errors++;
        }
      });
    }

    if (Array.isArray(day.cyber_tasks)) {
      day.cyber_tasks.forEach((t, i) => {
        if (!t || typeof t !== 'string' || t.trim() === '') {
          console.error(`${prefix} Error: Empty Cyber task at index ${i}`);
          errors++;
        }
      });
    }

    // 2. Check duplicates (unless it's an intentional weekly check-in or review day)
    const isReviewDay = 
      dn % 7 === 0 || 
      (day.dsa_topic && day.dsa_topic.toLowerCase().includes('review')) ||
      (day.dsa_topic && day.dsa_topic.toLowerCase().includes('check-in')) ||
      (day.dsa_topic && day.dsa_topic.toLowerCase().includes('checkpoint')) ||
      (day.cyber_topic && day.cyber_topic.toLowerCase().includes('review')) ||
      (day.cyber_topic && day.cyber_topic.toLowerCase().includes('check-in')) ||
      (day.cyber_topic && day.cyber_topic.toLowerCase().includes('checkpoint'));

    if (!isReviewDay) {
      if (day.dsa_topic) {
        const normalizedDsa = day.dsa_topic.trim().toLowerCase();
        if (dsaTopics.has(normalizedDsa)) {
          console.error(`${prefix} Error: Duplicate DSA Topic "${day.dsa_topic}" (also on Day ${dsaTopics.get(normalizedDsa)})`);
          errors++;
        } else {
          dsaTopics.set(normalizedDsa, dn);
        }
      }

      if (day.cyber_topic) {
        const normalizedCyber = day.cyber_topic.trim().toLowerCase();
        if (cyberTopics.has(normalizedCyber)) {
          console.error(`${prefix} Error: Duplicate Cyber Topic "${day.cyber_topic}" (also on Day ${cyberTopics.get(normalizedCyber)})`);
          errors++;
        } else {
          cyberTopics.set(normalizedCyber, dn);
        }
      }
    }
  });

  console.log(`\nValidation complete:`);
  console.log(`- Errors: ${errors}`);
  console.log(`- Warnings: ${warnings}`);

  if (missingDays.length > 0 || errors > 0) {
    console.error('\nResult: FAILED validation.');
    process.exit(1);
  } else {
    console.log('\nResult: PASSED validation.');
  }
}

validate();

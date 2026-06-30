// mock-db.js
// Practice CRUD with Promises (no framework)

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.resolve(__dirname, "mock-db.json");

// Helper to initialize the database JSON file
async function initDB() {
  try {
    await fs.access(DB_FILE);
  } catch {
    // If file doesn't exist, initialize with a default dataset of people
    const initialData = [
      { id: 1, name: "Ram", age: 30 },
      { id: 2, name: "Hari", age: 25 },
      { id: 3, name: "Bob", age: 35 }
    ];
    await fs.writeFile(DB_FILE, JSON.stringify(initialData, null, 2));
  }
}

// CREATE
export async function createPerson(name, age) {
  await initDB();
  const data = await fs.readFile(DB_FILE, "utf-8");
  const people = JSON.parse(data);
  
  const newPerson = {
    id: people.length > 0 ? Math.max(...people.map(p => p.id)) + 1 : 1,
    name,
    age
  };
  
  people.push(newPerson);
  await fs.writeFile(DB_FILE, JSON.stringify(people, null, 2));
  return newPerson;
}

// READ ALL
export async function getPeople() {
  await initDB();
  const data = await fs.readFile(DB_FILE, "utf-8");
  return JSON.parse(data);
}

// READ ONE
export async function getPersonById(id) {
  await initDB();
  const data = await fs.readFile(DB_FILE, "utf-8");
  const people = JSON.parse(data);
  return people.find(p => p.id === Number(id)) || null;
}

// UPDATE
export async function updatePerson(id, updates) {
  await initDB();
  const data = await fs.readFile(DB_FILE, "utf-8");
  const people = JSON.parse(data);
  const index = people.findIndex(p => p.id === Number(id));
  
  if (index === -1) {
    throw new Error(`Person with ID ${id} not found`);
  }
  
  people[index] = { ...people[index], ...updates };
  await fs.writeFile(DB_FILE, JSON.stringify(people, null, 2));
  return people[index];
}

// DELETE
export async function deletePerson(id) {
  await initDB();
  const data = await fs.readFile(DB_FILE, "utf-8");
  const people = JSON.parse(data);
  const index = people.findIndex(p => p.id === Number(id));
  
  if (index === -1) {
    throw new Error(`Person with ID ${id} not found`);
  }
  
  const deletedPerson = people.splice(index, 1)[0];
  await fs.writeFile(DB_FILE, JSON.stringify(people, null, 2));
  return deletedPerson;
}

// Self-executable demonstration when run directly
const isDirectRun = process.argv[1] && (
  process.argv[1].endsWith("mock-db.js") || 
  process.argv[1].endsWith("mock-db.ts")
);

if (isDirectRun) {
  console.log("--- Starting mock-db CRUD Practice Demonstration ---");
  
  (async () => {
    try {
      // 1. Reset/Init DB
      await fs.unlink(DB_FILE).catch(() => {});
      console.log("Database initialized.");

      // 2. Read initial data
      let list = await getPeople();
      console.log("Initial list of people:", list);

      // 3. Create a person
      const newPerson = await createPerson("Alice", 28);
      console.log("Created Alice:", newPerson);

      // 4. Read single person
      const found = await getPersonById(newPerson.id);
      console.log(`Fetched person with ID ${newPerson.id}:`, found);

      // 5. Update person
      const updated = await updatePerson(newPerson.id, { age: 29 });
      console.log("Updated Alice age to 29:", updated);

      // 6. Delete person
      const deleted = await deletePerson(newPerson.id);
      console.log("Deleted Alice:", deleted);

      // 7. Read final list
      list = await getPeople();
      console.log("Final list of people:", list);
      
    } catch (error) {
      console.error("Error during mock-db CRUD execution:", error);
    }
  })();
}

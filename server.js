const express = require('express');
const Database = require('better-sqlite3');

const app = express();
app.use(express.json());

// ---------- Database ----------
const db = new Database('students.db');
db.exec(`
  CREATE TABLE IF NOT EXISTS students (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT NOT NULL,
    rollNo     TEXT NOT NULL UNIQUE,
    department TEXT NOT NULL,
    semester   INTEGER NOT NULL
  )
`);

// ---------- Validation ----------
function validate(body) {
  const { name, rollNo, department, semester } = body || {};
  if (!name || !rollNo || !department || semester === undefined)
    return 'name, rollNo, department and semester are required';
  if (typeof name !== 'string' || typeof rollNo !== 'string' || typeof department !== 'string')
    return 'name, rollNo and department must be strings';
  if (!Number.isInteger(semester) || semester < 1 || semester > 8)
    return 'semester must be an integer between 1 and 8';
  return null;
}

const getById = (id) => db.prepare('SELECT * FROM students WHERE id = ?').get(id);

// ---------- Routes ----------
// CREATE
app.post('/api/students', (req, res) => {
  const error = validate(req.body);
  if (error) return res.status(400).json({ error });
  const { name, rollNo, department, semester } = req.body;
  try {
    const info = db
      .prepare('INSERT INTO students (name, rollNo, department, semester) VALUES (?, ?, ?, ?)')
      .run(name, rollNo, department, semester);
    res.status(201).json(getById(info.lastInsertRowid));
  } catch (e) {
    if (e.code === 'SQLITE_CONSTRAINT_UNIQUE')
      return res.status(409).json({ error: 'rollNo already exists' });
    res.status(500).json({ error: 'Internal server error' });
  }
});

// READ all
app.get('/api/students', (req, res) => {
  res.status(200).json(db.prepare('SELECT * FROM students').all());
});

// READ one
app.get('/api/students/:id', (req, res) => {
  const student = getById(req.params.id);
  if (!student) return res.status(404).json({ error: 'Student not found' });
  res.status(200).json(student);
});

// UPDATE
app.put('/api/students/:id', (req, res) => {
  if (!getById(req.params.id)) return res.status(404).json({ error: 'Student not found' });
  const error = validate(req.body);
  if (error) return res.status(400).json({ error });
  const { name, rollNo, department, semester } = req.body;
  try {
    db.prepare('UPDATE students SET name=?, rollNo=?, department=?, semester=? WHERE id=?')
      .run(name, rollNo, department, semester, req.params.id);
    res.status(200).json(getById(req.params.id));
  } catch (e) {
    if (e.code === 'SQLITE_CONSTRAINT_UNIQUE')
      return res.status(409).json({ error: 'rollNo already exists' });
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE
app.delete('/api/students/:id', (req, res) => {
  if (!getById(req.params.id)) return res.status(404).json({ error: 'Student not found' });
  db.prepare('DELETE FROM students WHERE id = ?').run(req.params.id);
  res.status(200).json({ message: 'Student deleted successfully' });
});

// Bad JSON handler
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed')
    return res.status(400).json({ error: 'Invalid JSON' });
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));

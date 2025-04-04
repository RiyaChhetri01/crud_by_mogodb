const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const PORT = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/crudDB')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define Schema and Model
const Student = mongoose.model('Student', new mongoose.Schema({
  name: String,
  sapId: Number,
  course: String
}));

// Middleware 
app.use(bodyParser.urlencoded({ extended: true }));




// Home Page (Student List)RECORD TABLE 
app.get('/', async (req, res) => {
  const students = await Student.find();
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Student Management</title>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    </head>
    <body class="container mt-4">
      <h2 class="text-center">Student Records</h2>
      
      <div class="table-responsive">
        <table class="table table-bordered table-hover">
          <thead class="table-dark">
            <tr>
              <th>Name</th>
              <th>SAP ID</th>
              <th>Course</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${students.map(student => `
              <tr>
                <td>${student.name}</td>
                <td>${student.sapId}</td>
                <td>${student.course}</td>
                <td>
                  <a href="/update?id=${student._id}" class="btn btn-warning btn-sm">Update</a>
                  <a href="/students/delete/${student._id}" class="btn btn-danger btn-sm">Delete</a>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div class="text-center mt-3">
        <a href="/add" class="btn btn-success">Add New Student</a>
      </div>

      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    </body>
    </html>
  `);
});

// Add Student Form
app.get('/add', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Add Student</title>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    </head>
    <body class="container mt-4">
      <h2 class="text-center">Add New Student</h2>

      <form action="/students/add" method="POST" class="card p-4 shadow">
        <div class="mb-3">
          <label class="form-label">Name</label>
          <input type="text" name="name" class="form-control" required>
        </div>
        <div class="mb-3">
          <label class="form-label">SAP ID</label>
          <input type="number" name="sapId" class="form-control" required>
        </div>
        <div class="mb-3">
          <label class="form-label">Course</label>
          <input type="text" name="course" class="form-control" required>
        </div>
        <button type="submit" class="btn btn-success">Submit</button>
        <a href="/" class="btn btn-secondary">Back to Records</a>
      </form>
    </body>
    </html>
  `);
});

// Update Student Form
app.get('/update', async (req, res) => {
  const student = await Student.findById(req.query.id);
  if (!student) return res.redirect('/');

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Update Student</title>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    </head>
    <body class="container mt-4">
      <h2 class="text-center">Update Student Details</h2>

      <form action="/students/update/${student._id}" method="POST" class="card p-4 shadow">
        <div class="mb-3">
          <label class="form-label">Name</label>
          <input type="text" name="name" class="form-control" value="${student.name}" required>
        </div>
        <div class="mb-3">
          <label class="form-label">SAP ID</label>
          <input type="number" name="sapId" class="form-control" value="${student.sapId}" required>
        </div>
        <div class="mb-3">
          <label class="form-label">Course</label>
          <input type="text" name="course" class="form-control" value="${student.course}" required>
        </div>
        <button type="submit" class="btn btn-primary">Update</button>
        <a href="/" class="btn btn-secondary">Back to Records</a>
      </form>
    </body>
    </html>
  `);
});

// Create Student
app.post('/students/add', async (req, res) => {
  await Student.create({ name: req.body.name, sapId: parseInt(req.body.sapId), course: req.body.course });
  res.redirect('/');
});

// Update Student
app.post('/students/update/:id', async (req, res) => {
  await Student.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    sapId: parseInt(req.body.sapId),
    course: req.body.course
  });
  res.redirect('/');
});

// Delete Student
app.get('/students/delete/:id', async (req, res) => {
  await Student.findByIdAndDelete(req.params.id);
  res.redirect('/');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});



import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API = "http://localhost:5000/api/students";

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    course: ""
  });
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const loadStudents = async () => {
    try {
      const res = await axios.get(API);
      setStudents(res.data);
      setError("");
    } catch {
      setError("Backend ya MongoDB connect nahi hai. Backend terminal check karo.");
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`${API}/${editId}`, form);
      } else {
        await axios.post(API, form);
      }

      setForm({ name: "", email: "", phone: "", course: "" });
      setEditId(null);
      setError("");
      await loadStudents();
    } catch (err) {
      setError(err.response?.data?.message || "Student save nahi hua.");
    }
  };

  const handleEdit = (student) => {
    setForm({
      name: student.name,
      email: student.email,
      phone: student.phone,
      course: student.course
    });
    setEditId(student._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Kya tum is student ko delete karna chahte ho?")) return;
    try {
      await axios.delete(`${API}/${id}`);
      await loadStudents();
    } catch {
      setError("Student delete nahi hua.");
    }
  };

  const filteredStudents = students.filter((student) =>
    `${student.name} ${student.email} ${student.course}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="app">
      <header className="header">
        <h1>Student Management System</h1>
        <p>Manage your student records easily</p>
      </header>

      <main className="container">
        {error && <p className="error">{error}</p>}

        <section className="card">
          <h2>{editId ? "Edit Student" : "Add New Student"}</h2>

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <input
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                required
              />
              <input
                name="email"
                type="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                required
              />
              <input
                name="phone"
                placeholder="Phone Number"
                value={form.phone}
                onChange={handleChange}
                required
              />
              <input
                name="course"
                placeholder="Course (e.g. MCA)"
                value={form.course}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit">
              {editId ? "Update Student" : "Add Student"}
            </button>

            {editId && (
              <button
                type="button"
                className="cancel"
                onClick={() => {
                  setEditId(null);
                  setForm({ name: "", email: "", phone: "", course: "" });
                }}
              >
                Cancel
              </button>
            )}
          </form>
        </section>

        <section className="card">
          <div className="list-header">
            <h2>Student Records ({students.length})</h2>
            <input
              placeholder="Search students..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Course</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student._id}>
                    <td>{student.name}</td>
                    <td>{student.email}</td>
                    <td>{student.phone}</td>
                    <td>{student.course}</td>
                    <td>
                      <button onClick={() => handleEdit(student)}>Edit</button>
                      <button
                        className="delete"
                        onClick={() => handleDelete(student._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredStudents.length === 0 && (
                  <tr>
                    <td colSpan="5">No students found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;

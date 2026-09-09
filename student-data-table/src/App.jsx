import { useMemo, useState } from "react";
import "./App.css";

const courses = [
  "Computer Engineering",
  "Information Technology",
  "Electronics & Communication",
  "Mechanical Engineering",
  "Civil Engineering",
  "Electrical Engineering",
];

function App() {
  const [students, setStudents] = useState([]);

  const [grId, setGrId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [course, setCourse] = useState("");

  const [search, setSearch] = useState("");
  const [genderFilter, setGenderFilter] = useState("All");
  const [courseFilter, setCourseFilter] = useState("All");

  const [nameSort, setNameSort] = useState("default");
  const [ageSort, setAgeSort] = useState("default");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!grId || !name || !email || !gender || !age || !course) {
      alert("Please fill all fields.");
      return;
    }

    const duplicate = students.some(
      (student) =>
        student.grId.toLowerCase() === grId.trim().toLowerCase()
    );

    if (duplicate) {
      alert("A student with this GR ID already exists.");
      return;
    }

    const newStudent = {
      id: Date.now(),
      grId: grId.trim(),
      name: name.trim(),
      email: email.trim(),
      gender,
      age: Number(age),
      course,
    };

    setStudents((prev) => [...prev, newStudent]);

    setGrId("");
    setName("");
    setEmail("");
    setGender("");
    setAge("");
    setCourse("");
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmed) return;

    setStudents((prev) =>
      prev.filter((student) => student.id !== id)
    );
  };

  const resetFilters = () => {
    setSearch("");
    setGenderFilter("All");
    setCourseFilter("All");
    setNameSort("default");
    setAgeSort("default");
  };

  const filteredStudents = useMemo(() => {
    let result = students.filter((student) => {
      const searchValue = search.toLowerCase().trim();

      const matchesSearch =
        !searchValue ||
        student.grId.toLowerCase().includes(searchValue) ||
        student.name.toLowerCase().includes(searchValue) ||
        student.email.toLowerCase().includes(searchValue) ||
        student.gender.toLowerCase().includes(searchValue) ||
        String(student.age).includes(searchValue) ||
        student.course.toLowerCase().includes(searchValue);

      const matchesGender =
        genderFilter === "All" ||
        student.gender === genderFilter;

      const matchesCourse =
        courseFilter === "All" ||
        student.course === courseFilter;

      return (
        matchesSearch &&
        matchesGender &&
        matchesCourse
      );
    });

    // Name is the primary sort.
    // Age is used as the secondary sort when names are equal.
    result.sort((a, b) => {
      if (nameSort !== "default") {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();

        if (nameA < nameB) {
          return nameSort === "az" ? -1 : 1;
        }

        if (nameA > nameB) {
          return nameSort === "az" ? 1 : -1;
        }
      }

      if (ageSort !== "default") {
        if (a.age < b.age) {
          return ageSort === "low" ? -1 : 1;
        }

        if (a.age > b.age) {
          return ageSort === "low" ? 1 : -1;
        }
      }

      return 0;
    });

    return result;
  }, [
    students,
    search,
    genderFilter,
    courseFilter,
    nameSort,
    ageSort,
  ]);

  const hasActiveFilters =
    search.trim() !== "" ||
    genderFilter !== "All" ||
    courseFilter !== "All" ||
    nameSort !== "default" ||
    ageSort !== "default";

  return (
    <div className="app">
      <header className="page-header">
        <div>
          <p className="eyebrow">STUDENT DATA MANAGEMENT</p>

          <h1>
            Student <span>Records</span>
          </h1>

          <p className="subtitle">
            Add, search, filter and organize student records
            easily.
          </p>
        </div>

        <div className="record-count">
          <strong>{students.length}</strong>
          <span>Total Students</span>
        </div>
      </header>

      <section className="entry-section">
        <div className="section-title">
          <h2>Add Student</h2>
        </div>

        <form className="student-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label>GR ID</label>

            <input
              type="text"
              placeholder="GR002"
              value={grId}
              onChange={(e) => setGrId(e.target.value)}
            />
          </div>

          <div className="form-field">
            <label>Name</label>

            <input
              type="text"
              placeholder="Student name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-field">
            <label>Email</label>

            <input
              type="email"
              placeholder="student@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-field">
            <label>Gender</label>

            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div className="form-field">
            <label>Age</label>

            <input
              type="number"
              min="1"
              max="100"
              placeholder="21"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </div>

          <div className="form-field">
            <label>Course</label>

            <select
              value={course}
              onChange={(e) => setCourse(e.target.value)}
            >
              <option value="">Select course</option>

              {courses.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <button className="add-button" type="submit">
            + Add Student
          </button>
        </form>
      </section>

      <section className="records-section">
        <div className="records-heading">
          <h2>Student Records</h2>

          <span className="result-count">
            Showing {filteredStudents.length} of {students.length}
          </span>
        </div>

        <div className="controls">
          <div className="search-box">
            <span>⌕</span>

            <input
              type="text"
              placeholder="Search GR ID, name, email, course..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="filter">
            <label>Gender</label>

            <select
              value={genderFilter}
              onChange={(e) =>
                setGenderFilter(e.target.value)
              }
            >
              <option value="All">All</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div className="filter">
            <label>Course</label>

            <select
              value={courseFilter}
              onChange={(e) =>
                setCourseFilter(e.target.value)
              }
            >
              <option value="All">All Courses</option>

              {courses.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="filter">
            <label>Sort by Name</label>

            <select
              value={nameSort}
              onChange={(e) => setNameSort(e.target.value)}
            >
              <option value="default">Default</option>
              <option value="az">A → Z</option>
              <option value="za">Z → A</option>
            </select>
          </div>

          <div className="filter">
            <label>Sort by Age</label>

            <select
              value={ageSort}
              onChange={(e) => setAgeSort(e.target.value)}
            >
              <option value="default">Default</option>
              <option value="low">Low → High</option>
              <option value="high">High → Low</option>
            </select>
          </div>

          <button
            className="reset-button"
            type="button"
            onClick={resetFilters}
            disabled={!hasActiveFilters}
          >
            Reset
          </button>
        </div>

        {hasActiveFilters && (
          <div className="active-filter-bar">
            <span className="active-filter-title">
              Active
            </span>

            {search.trim() && (
              <span className="filter-chip">
                Search: {search}
              </span>
            )}

            {genderFilter !== "All" && (
              <span className="filter-chip">
                Gender: {genderFilter}
              </span>
            )}

            {courseFilter !== "All" && (
              <span className="filter-chip">
                Course: {courseFilter}
              </span>
            )}

            {nameSort === "az" && (
              <span className="filter-chip">
                Name A → Z
              </span>
            )}

            {nameSort === "za" && (
              <span className="filter-chip">
                Name Z → A
              </span>
            )}

            {ageSort === "low" && (
              <span className="filter-chip">
                Age Low → High
              </span>
            )}

            {ageSort === "high" && (
              <span className="filter-chip">
                Age High → Low
              </span>
            )}
          </div>
        )}

        <div className="table-wrapper">
          {students.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">+</div>

              <h3>No students yet</h3>

              <p>
                Add your first student using the form above.
              </p>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="no-results">
              <strong>No matching students found.</strong>

              <span>
                Try changing your search or filters.
              </span>

              <button
                type="button"
                onClick={resetFilters}
              >
                Reset filters
              </button>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>GR ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Gender</th>
                  <th>Age</th>
                  <th>Course</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id}>
                    <td>
                      <span className="gr-id">
                        {student.grId}
                      </span>
                    </td>

                    <td>
                      <span className="student-name">
                        {student.name}
                      </span>
                    </td>

                    <td>
                      <span className="email">
                        {student.email}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`gender ${student.gender.toLowerCase()}`}
                      >
                        {student.gender}
                      </span>
                    </td>

                    <td>{student.age}</td>

                    <td>{student.course}</td>

                    <td>
                      <button
                        className="delete-button"
                        type="button"
                        onClick={() =>
                          handleDelete(student.id)
                        }
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <p className="table-hint">
          Name is the primary sort and Age is the secondary sort.
        </p>
      </section>

      <footer>
        Student Data Management System
      </footer>
    </div>
  );
}

export default App;
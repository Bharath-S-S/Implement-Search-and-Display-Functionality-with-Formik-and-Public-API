import React, { useState, useEffect } from "react";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "./styles.css";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async (searchQuery = "") => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/todos"
      );
      const data = response.data;
      setTodos(data);
      if (searchQuery) {
        const filtered = data.filter((todo) =>
          todo.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredTodos(filtered);
      } else {
        setFilteredTodos(data);
      }
    } catch (err) {
      setError("Failed to fetch todos. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const validationSchema = Yup.object().shape({
    search: Yup.string().required("Search query is required"),
  });

  const handleSubmit = (values, { setSubmitting }) => {
    fetchTodos(values.search);
    setSubmitting(false);
  };

  return (
    <div className="App">
      <h1>Todo Search</h1>
      <Formik
        initialValues={{ search: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <Field
              type="text"
              name="search"
              placeholder="Search todos..."
              className="search-input"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="search-button"
            >
              Search
            </button>
            <ErrorMessage name="search" component="div" className="error" />
          </Form>
        )}
      </Formik>

      {isLoading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      {!isLoading &&
        !error &&
        (filteredTodos.length > 0 ? (
          <ul>
            {filteredTodos.map((todo) => (
              <li key={todo.id} className={todo.completed ? "completed" : ""}>
                {todo.title}
              </li>
            ))}
          </ul>
        ) : (
          <p>No results found.</p>
        ))}
    </div>
  );
}

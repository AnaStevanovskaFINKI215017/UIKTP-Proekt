import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./LoginPage.css";
import axios from "axios";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
//axios.defaults.withCredentials = true;
import aiImage from "../assets/books.png";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear any previous errors

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    try {
      setIsLoading(true);

      const response = await axios.post("http://localhost:8080/auth/login", {
        email,
        password,
      });

      if (response.status === 200) {
        const { token, email, name, id } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("email", email);
        localStorage.setItem("name", name);
        localStorage.setItem("userId", id);
        navigate("/"); // Redirect after successful login
      }
    } catch (err) {
      console.error(err);

      if (err.response) {
        // Check status codes and show backend error message
        if (err.response.status === 401) {
          setError(
            err.response.data || "Invalid email or password. Please try again."
          );
        } else if (err.response.status === 500) {
          setError("An error occurred. Please try again later.");
        } else {
          setError("An unexpected error occurred. Please try again.");
        }
      } else {
        // Handle cases where there is no response from the server (e.g., network error)
        setError(
          "Unable to reach the server. Please check your network and try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container fluid className="p-0 m-0">
      <Row className="g-0" style={{ height: "100vh" }}>
        <Col
          md={6}
          className="d-flex align-items-center justify-content-center"
        >
          <img
            src={aiImage}
            alt="AI helping students"
            className="img-fluid w-100 h-100 object-fit-cover"
          />
        </Col>

        <Col
          md={6}
          className="d-flex align-items-center justify-content-center"
        >
          <Card className="p-4 shadow-sm login-card w-75">
            <Card.Body>
              <h2 className="text-center mb-4">Log In</h2>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formEmail" className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="formPassword" className="mb-4">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                <div className="d-grid gap-2 login-button-align">
                  <Button
                    variant="primary"
                    type="submit"
                    style={{
                      border: "none",
                      background: "linear-gradient(135deg, #800000, #3c0101)",
                    }}
                  >
                    Sign In
                  </Button>
                  <div className="text-center mt-3 login-link">
                    New User? <Link to="/register">Register Now</Link>
                  </div>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;

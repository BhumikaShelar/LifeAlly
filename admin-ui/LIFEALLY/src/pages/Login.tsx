import React from "react";
import { Card, Form, Button, Container, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import client from "../api/client";

export default function Login() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await client.post("/auth/login", { email, password });

      if (response.data?.user_id) {
        const userIdStr = response.data.user_id.toString();
        sessionStorage.setItem("adminUserId", userIdStr);
        if (response.data.role) sessionStorage.setItem("userRole", response.data.role);
        sessionStorage.setItem("userEmail", email);

        // Set default header for subsequent API calls
        client.defaults.headers.common["User-Id"] = userIdStr;

        // Notify components that the active admin changed
        try {
          window.dispatchEvent(new CustomEvent("adminChange", { detail: { adminUserId: userIdStr } }));
        } catch (e) {
          // fallback generic Event
          window.dispatchEvent(new Event("adminChange"));
        }

        if (response.data.role === "admin") {
          navigate("/dashboard");
        } else {
          setError("Admin access required");
        }
      } else {
        setError("Invalid server response");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      const errorMessage = err.response?.data?.error || err.message || "Login failed";
      setError(`Login failed: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center min-vh-100">
      <Card style={{ width: "100%", maxWidth: "400px" }}>
        <Card.Body className="p-4">
          <h2 className="text-center mb-4">Admin Login</h2>
          <p className="text-center text-muted mb-4">Enter your credentials to continue</p>

          {error && (
            <Alert variant="danger" className="mb-4">
              {error}
            </Alert>
          )}

          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                autoFocus
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100 mb-3" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
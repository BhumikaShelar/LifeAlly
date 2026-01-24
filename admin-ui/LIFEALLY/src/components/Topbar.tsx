import React from "react";
import { Navbar, Container, Nav, Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import client from "../api/client";

export default function Topbar() {
  const navigate = useNavigate();

  function goProfile() {
    navigate("/profile");
  }

  function logout() {
    sessionStorage.removeItem("adminUserId");
    sessionStorage.removeItem("userRole");
    sessionStorage.removeItem("userEmail");
    try {
      delete client.defaults.headers.common["User-Id"];
    } catch (err) {}

    try {
      window.dispatchEvent(new CustomEvent("adminChange", { detail: { adminUserId: null } }));
    } catch (e) {
      window.dispatchEvent(new Event("adminChange"));
    }

    navigate("/login");
    setTimeout(() => window.location.reload(), 50);
  }

  return (
    <Navbar bg="light" expand="lg" className="shadow-sm">
      <Container fluid>
        <Navbar.Brand href="/">LifeAlly Admin</Navbar.Brand>
        <Nav className="ms-auto">
          <Dropdown align="end">
            <Dropdown.Toggle variant="light" id="dropdown-admin">
              LifeAlly Admin
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={goProfile}>Profile</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={logout}>Logout</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Nav>
      </Container>
    </Navbar>
  );
}
import React from "react";
import { Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <div>
      <div className="mb-4 brand">LifeAlly Admin</div>

      <Nav className="flex-column">
        <Nav.Item>
          <NavLink className="nav-link fw-bold" to="/dashboard">
            Dashboard
          </NavLink>
        </Nav.Item>

        <Nav.Item>
          <NavLink className="nav-link" to="/users">
            Users
          </NavLink>
        </Nav.Item>

        <Nav.Item>
          <NavLink className="nav-link" to="/queries">
            Queries &amp; Logs
          </NavLink>
        </Nav.Item>
      </Nav>
    </div>
  );
}
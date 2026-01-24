import React from "react";
import { Card, Form, Button } from "react-bootstrap";

export default function Settings() {
  const [perPage, setPerPage] = React.useState<number>(() => {
    const v = Number(localStorage.getItem("admin_per_page") || 50);
    return v || 50;
  });
  const [notify, setNotify] = React.useState<boolean>(() => {
    return localStorage.getItem("admin_notify") === "1";
  });

  function saveSettings(e?: React.FormEvent) {
    if (e) e.preventDefault();
    localStorage.setItem("admin_per_page", String(perPage));
    localStorage.setItem("admin_notify", notify ? "1" : "0");
    alert("Settings saved");
  }

  function resetSettings() {
    localStorage.removeItem("admin_per_page");
    localStorage.removeItem("admin_notify");
    setPerPage(50);
    setNotify(false);
    alert("Settings reset to defaults");
  }

  return (
    <div>
      <h3 className="mb-4">Settings</h3>
      <Card className="p-3">
        <Form onSubmit={saveSettings}>
          <Form.Group className="mb-3">
            <Form.Label>Queries per page (pagination)</Form.Label>
            <Form.Control
              type="number"
              min={10}
              max={500}
              value={perPage}
              onChange={(e) => setPerPage(Number(e.target.value || 50))}
            />
            <Form.Text className="text-muted">Controls how many items are requested/shown by admin lists.</Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="Enable admin notifications (UI only)"
              checked={notify}
              onChange={(e) => setNotify(e.target.checked)}
            />
            <Form.Text className="text-muted">This toggles client-side notification behavior (placeholder).</Form.Text>
          </Form.Group>

          <div className="d-flex gap-2">
            <Button type="submit" variant="primary">Save</Button>
            <Button variant="outline-secondary" onClick={resetSettings}>Reset</Button>
          </div>
        </Form>
      </Card>
    </div>
  );
}
import React from "react";
import { Table, Button, Modal, Alert } from "react-bootstrap";
import client from "../api/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

type User = {
  id: number;
  email: string;
  name?: string;
  role?: string;
  is_active?: boolean;
  created_at?: string;
};

function DeleteConfirmModal({
  show,
  onClose,
  onConfirm,
  user,
}: {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
  user?: User | null;
}) {
  if (!user) return null;

  const isAdmin = user.role === "admin";

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Delete user</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isAdmin ? (
          <>
            <Alert variant="danger">
              This account ({user.email}) is an admin account and cannot be deleted through the UI.
            </Alert>
            <p className="text-muted">
              To remove admin access, demote the user first using a safe flow.
            </p>
          </>
        ) : (
          <>
            <p>Are you sure you want to delete the user <strong>{user.email}</strong>?</p>
            <Alert variant="warning">This action cannot be undone.</Alert>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant="danger" disabled={isAdmin} onClick={onConfirm}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default function Users() {
  const qc = useQueryClient();
  const [selected, setSelected] = React.useState<User | null>(null);
  const [showDelete, setShowDelete] = React.useState(false);
  const navigate = useNavigate();

  const { data: users, isLoading } = useQuery({
    queryKey: ["usersList"],
    queryFn: async () => {
      const r = await client.get("/admin/users");
      return r.data?.items ?? [];
    },
  });

  async function handleDeleteConfirm() {
    if (!selected) return;
    try {
      await client.delete(`/admin/user/${selected.id}`);
      qc.invalidateQueries(["usersList"]);
      setShowDelete(false);
      setSelected(null);
    } catch (err: any) {
      const msg = err?.response?.data?.error || err.message || "Delete failed";
      alert(`Delete failed: ${msg}`);
    }
  }

  if (isLoading) return <div>Loading…</div>;

  return (
    <div>
      <h3 className="mb-3">Users</h3>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Email</th>
            <th>Role</th>
            <th>Active</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {(users || []).map((u: User) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.email}</td>
              <td>{u.role ?? "user"}</td>
              <td>{u.is_active ? "Yes" : "No"}</td>
              <td className="d-flex gap-2">
                <Button size="sm" variant="outline-primary" onClick={() => navigate(`/users/${u.id}`)}>View</Button>
                <Button
                  size="sm"
                  variant="outline-danger"
                  onClick={() => {
                    setSelected(u);
                    setShowDelete(true);
                  }}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <DeleteConfirmModal
        show={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDeleteConfirm}
        user={selected}
      />
    </div>
  );
}
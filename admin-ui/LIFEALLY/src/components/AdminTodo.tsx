import React from "react";
import { Card, Form, Button, ListGroup, InputGroup, Badge } from "react-bootstrap";
import { FaTrash, FaCheck, FaPlus } from "react-icons/fa";

type Todo = {
  id: string;
  text: string;
  done: boolean;
  createdAt: string;
};

type Props = {
  adminId: number | null;
};

const STORAGE_KEY_PREFIX = "admin_todos_";

function storageKey(adminId: number | null) {
  // Always stringify to avoid mismatch between "9" and 9
  return `${STORAGE_KEY_PREFIX}${String(adminId ?? "anon")}`;
}

export default function AdminTodo({ adminId }: Props) {
  const [todos, setTodos] = React.useState<Todo[]>([]);
  const [text, setText] = React.useState("");
  const [filter, setFilter] = React.useState<"all" | "active" | "done">("all");

  // Safe parse helper
  const safeParse = (raw: string | null) => {
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : null;
    } catch {
      return null;
    }
  };

  // Load todos for the given admin id
  const loadTodos = React.useCallback((id: number | null) => {
    try {
      const raw = localStorage.getItem(storageKey(id));
      const parsed = safeParse(raw);
      setTodos(parsed ?? []);
    } catch {
      setTodos([]);
    }
  }, []);

  // On mount and whenever adminId changes load that admin's todos
  React.useEffect(() => {
    loadTodos(adminId);
  }, [adminId, loadTodos]);

  // Persist todos for the active admin
  React.useEffect(() => {
    try {
      localStorage.setItem(storageKey(adminId), JSON.stringify(todos));
    } catch {
      // ignore localStorage errors
    }
  }, [todos, adminId]);

  // Listen for storage events and custom adminChange events so multiple tabs / user switches keep in sync
  React.useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (!e.key) return;
      if (e.key === storageKey(adminId)) {
        loadTodos(adminId);
      }
    }

    function onAdminChange(e: Event) {
      // custom event detail may contain adminUserId; otherwise read from sessionStorage
      try {
        const detail = (e as CustomEvent)?.detail;
        const detailId = detail && detail.adminUserId != null ? String(detail.adminUserId) : null;
        const newIdStr = detailId ?? sessionStorage.getItem("adminUserId");
        const newId = newIdStr ? Number(newIdStr) : null;
        loadTodos(Number.isFinite(newId) ? newId : null);
      } catch {
        const newId = sessionStorage.getItem("adminUserId");
        loadTodos(newId ? Number(newId) : null);
      }
    }

    window.addEventListener("storage", onStorage);
    window.addEventListener("adminChange", onAdminChange as EventListener);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("adminChange", onAdminChange as EventListener);
    };
  }, [adminId, loadTodos]);

  function addTodo(e?: React.FormEvent) {
    if (e) e.preventDefault();
    const v = text.trim();
    if (!v) return;
    const t: Todo = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      text: v,
      done: false,
      createdAt: new Date().toISOString(),
    };
    setTodos((s) => [t, ...s]);
    setText("");
  }

  function toggleDone(id: string) {
    setTodos((s) => s.map((it) => (it.id === id ? { ...it, done: !it.done } : it)));
  }

  function removeTodo(id: string) {
    setTodos((s) => s.filter((it) => it.id !== id));
  }

  const filtered = todos.filter((t) => (filter === "all" ? true : filter === "active" ? !t.done : t.done));
  const remaining = todos.filter((t) => !t.done).length;

  return (
    <Card className="p-3">
      <div className="d-flex align-items-center justify-content-between mb-2">
        <h5 className="mb-0">Admin Todos</h5>
        <Badge pill bg="secondary">{remaining} open</Badge>
      </div>

      <Form onSubmit={addTodo}>
        <InputGroup className="mb-2">
          <Form.Control
            placeholder="Add a new task..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            aria-label="New todo"
          />
          <Button variant="primary" onClick={() => addTodo()}>
            <FaPlus /> <span className="ms-1">Add</span>
          </Button>
        </InputGroup>
      </Form>

      <div className="mb-2">
        <Button size="sm" variant={filter === "all" ? "primary" : "outline-primary"} onClick={() => setFilter("all")}>All</Button>{" "}
        <Button size="sm" variant={filter === "active" ? "primary" : "outline-primary"} onClick={() => setFilter("active")}>Active</Button>{" "}
        <Button size="sm" variant={filter === "done" ? "primary" : "outline-primary"} onClick={() => setFilter("done")}>Done</Button>
      </div>

      <ListGroup variant="flush" className="todo-list">
        {filtered.length === 0 ? (
          <ListGroup.Item className="text-muted">No tasks</ListGroup.Item>
        ) : (
          filtered.map((t) => (
            <ListGroup.Item key={t.id} className="d-flex align-items-start justify-content-between">
              <div style={{ maxWidth: "85%" }}>
                <div style={{ textDecoration: t.done ? "line-through" : "none", wordBreak: "break-word" }}>{t.text}</div>
                <small className="text-muted">{new Date(t.createdAt).toLocaleString()}</small>
              </div>

              <div className="d-flex align-items-center gap-2">
                <Button size="sm" variant={t.done ? "success" : "outline-success"} onClick={() => toggleDone(t.id)}>
                  <FaCheck />
                </Button>
                <Button size="sm" variant="outline-danger" onClick={() => removeTodo(t.id)}>
                  <FaTrash />
                </Button>
              </div>
            </ListGroup.Item>
          ))
        )}
      </ListGroup>
    </Card>
  );
}
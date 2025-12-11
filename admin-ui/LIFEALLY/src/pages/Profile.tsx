import React from "react";
import { Card, Row, Col, Table, Spinner, Button } from "react-bootstrap";
import { useQuery } from "@tanstack/react-query";
import client from "../api/client";
import DomainChart from "../components/DomainChart";
import dayjs from "dayjs";
import AdminTodo from "../components/AdminTodo";

type User = {
  id: number;
  name?: string;
  email: string;
  role: string;
  is_active?: boolean;
  created_at?: string;
};

type QueryItem = {
  id: number;
  domain?: string;
  query_text?: string;
  latest_result?: string;
  created_at?: string;
};

async function fetchUsersMeta() {
  const r = await client.get("/admin/users");
  return r.data?.items ?? [];
}

async function fetchUserQueries(userId: number) {
  const r = await client.get("/admin/queries", { params: { user_id: userId, per_page: 200 } });
  return r.data?.items ?? [];
}

export default function Profile() {
  // Use state so UI updates when admin changes during the session
  const [adminUserId, setAdminUserId] = React.useState<number | null>(() => {
    const v = sessionStorage.getItem("adminUserId");
    return v ? Number(v) : null;
  });

  // react to custom adminChange event and storage changes
  React.useEffect(() => {
    function onAdminChange(e: Event) {
      try {
        const detail = (e as CustomEvent)?.detail;
        const id = detail && detail.adminUserId != null ? Number(detail.adminUserId) : Number(sessionStorage.getItem("adminUserId") || 0);
        setAdminUserId(Number.isFinite(id) && id > 0 ? id : null);
      } catch {
        const id = Number(sessionStorage.getItem("adminUserId") || 0);
        setAdminUserId(Number.isFinite(id) && id > 0 ? id : null);
      }
    }
    function onStorage(e: StorageEvent) {
      if (e.key === "adminUserId") {
        const id = Number(sessionStorage.getItem("adminUserId") || 0);
        setAdminUserId(Number.isFinite(id) && id > 0 ? id : null);
      }
    }
    window.addEventListener("adminChange", onAdminChange as EventListener);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("adminChange", onAdminChange as EventListener);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const { data: users, isLoading: usersLoading } = useQuery<User[]>({
    queryKey: ["allUsersForProfile"],
    queryFn: fetchUsersMeta,
  });

  const { data: queries, isLoading: queriesLoading } = useQuery<QueryItem[]>({
    queryKey: ["profileQueries", adminUserId],
    queryFn: () => fetchUserQueries(adminUserId ?? 0),
    enabled: !!adminUserId,
  });

  const currentUser: User | undefined = (users ?? []).find((u) => u.id === adminUserId);

  // aggregate domains for the chart
  const domainCounts: Record<string, number> = {};
  (queries ?? []).forEach((q: QueryItem) => {
    const d = (q.domain || "unknown").toLowerCase();
    domainCounts[d] = (domainCounts[d] || 0) + 1;
  });

  if (usersLoading || queriesLoading) {
    return <div className="text-center py-5"><Spinner animation="border" /></div>;
  }

  if (!currentUser) {
    return <div className="text-center py-5">No admin user found. Please login.</div>;
  }

  return (
    <div>
      <h3 className="mb-4">Profile</h3>
      <Row className="g-3">
        <Col lg={6}>
          <Card className="p-3 mb-3">
            <h5>{currentUser.name ?? currentUser.email}</h5>
            <p><strong>Email:</strong> {currentUser.email}</p>
            <p><strong>Role:</strong> {currentUser.role}</p>
            <p><strong>Active:</strong> {currentUser.is_active ? "Yes" : "No"}</p>
            <p><strong>Created:</strong> {currentUser.created_at ? dayjs(currentUser.created_at).format("YYYY-MM-DD") : "—"}</p>
            <div className="mt-3">
              <Button size="sm" variant="outline-primary" onClick={() => window.location.reload()}>
                Refresh
              </Button>
            </div>
          </Card>

          {/* pass the dynamic admin id so AdminTodo shows that admin's todos */}
          <AdminTodo adminId={adminUserId} />
        </Col>

        <Col lg={6}>
          <Card className="p-3 mb-3">
            <h6>Domain usage (your queries)</h6>
            <div style={{ maxWidth: 480 }}>
              <DomainChart counts={domainCounts} type="pie" />
            </div>
          </Card>

          <Card className="p-3">
            <h5>Recent queries ({(queries ?? []).length})</h5>
            <div className="user-queries-scroll border rounded">
              <Table striped bordered hover responsive size="sm" className="mb-0">
                <thead>
                  <tr>
                    <th>ID</th><th>Domain</th><th>Preview</th><th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {(queries ?? []).map((q) => (
                    <tr key={q.id}>
                      <td>{q.id}</td>
                      <td>{q.domain || "—"}</td>
                      <td style={{ maxWidth: 700, whiteSpace: "normal" }}>{q.latest_result ?? q.query_text ?? "—"}</td>
                      <td>{q.created_at ? dayjs(q.created_at).format("YYYY-MM-DD HH:mm") : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
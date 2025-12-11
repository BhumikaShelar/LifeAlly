import React from "react";
import { useParams } from "react-router-dom";
import { Card, Spinner, Table } from "react-bootstrap";
import client from "../api/client";
import DomainChart from "../components/DomainChart";
import dayjs from "dayjs";

type User = {
  id: number;
  name?: string;
  email: string;
  role?: string;
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

export default function UserView() {
  const { id } = useParams<{ id: string }>();
  const userId = Number(id);

  const [user, setUser] = React.useState<User | null>(null);
  const [queries, setQueries] = React.useState<QueryItem[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const uRes = await client.get("/admin/users", { params: { page: 1, per_page: 1000 } });
        const items = uRes.data?.items ?? [];
        const found = items.find((it: any) => Number(it.id) === userId);
        if (mounted) setUser(found ?? null);

        const qRes = await client.get("/admin/queries", { params: { user_id: userId, per_page: 500 } });
        if (mounted) setQueries(qRes.data?.items ?? []);
      } catch (e) {
        console.error("Error loading user view:", e);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [userId]);

  if (loading) return <div className="text-center py-5"><Spinner animation="border" /></div>;
  if (!user) return <div className="text-center py-5">User not found</div>;

  // build domain counts for chart
  const domainCounts: Record<string, number> = {};
  (queries || []).forEach((q) => {
    const d = (q.domain || "unknown").toLowerCase();
    domainCounts[d] = (domainCounts[d] || 0) + 1;
  });

  return (
    <div>
      <h3 className="mb-4">User Details</h3>
      <div className="row g-3">
        <div className="col-md-6">
          <Card className="p-3 mb-3">
            <h5>{user.name ?? user.email}</h5>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role ?? "user"}</p>
            <p><strong>Active:</strong> {user.is_active ? "Yes" : "No"}</p>
            <p><strong>Created:</strong> {user.created_at ? dayjs(user.created_at).format("YYYY-MM-DD") : "—"}</p>
          </Card>
        </div>

        <div className="col-md-6">
          <Card className="p-3 mb-3">
            <h6>Domain usage (user queries)</h6>
            <div style={{ maxWidth: 480 }}>
              <DomainChart counts={domainCounts} type="pie" />
            </div>
          </Card>
        </div>
      </div>

      <Card className="p-3">
        <h5>User's recent queries ({queries.length})</h5>
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
    </div>
  );
}
import React from "react";
import { Table, Badge, Spinner } from "react-bootstrap";
import { useQuery } from "@tanstack/react-query";
import client from "../api/client";
import QueryDetailModal from "../components/QueryDetailModal";

interface QueryItem {
  id: number;
  user_id?: number;
  user_email?: string;
  domain?: string;
  query_text?: string;
  latest_result?: string;
  status?: string;
  created_at?: string;
}

async function fetchQueries(): Promise<QueryItem[]> {
  const r = await client.get("/admin/queries");
  return r.data?.items ?? [];
}

export default function Queries() {
  const [selected, setSelected] = React.useState<QueryItem | null>(null);
  const { data, isLoading, isError } = useQuery<QueryItem[]>({
    queryKey: ["queries"],
    queryFn: fetchQueries,
  });

  if (isLoading) {
    return <div className="text-center py-5"><Spinner animation="border" /></div>;
  }

  if (isError) {
    return <div className="text-danger">Failed to load queries</div>;
  }

  const items = data ?? [];

  return (
    <div>
      <h3 className="mb-3">Queries & Logs</h3>
      <Table hover responsive>
        <thead>
          <tr>
            <th>ID</th><th>User</th><th>Domain</th><th>Status / Preview</th><th>Created</th>
          </tr>
        </thead>
        <tbody>
          {items.map((q) => (
            <tr key={q.id}>
              <td>{q.id}</td>
              <td>{q.user_email || q.user_id || "—"}</td>
              <td>{q.domain || "—"}</td>
              <td style={{ maxWidth: 600 }}>
                <div className="mb-2">
                  <Badge bg={q.status === "error" ? "danger" : "success"}>{q.status || "pending"}</Badge>
                </div>
                <div style={{ cursor: "pointer", whiteSpace: "pre-wrap" }} onClick={() => setSelected(q)}>
                  {q.latest_result ? (q.latest_result.length > 300 ? q.latest_result.substring(0, 300) + "… (click to read more)" : q.latest_result) : (q.query_text ? (q.query_text.length > 300 ? q.query_text.substring(0, 300) + "… (click to read more)" : q.query_text) : "—")}
                </div>
              </td>
              <td>{q.created_at || "—"}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <QueryDetailModal show={!!selected} onHide={() => setSelected(null)} item={selected ?? undefined} />
    </div>
  );
}
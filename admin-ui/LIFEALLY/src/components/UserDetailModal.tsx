import React from "react";
import { Modal, Button, Table, Spinner } from "react-bootstrap";
import client from "../api/client";
import { useQuery } from "@tanstack/react-query";
import DomainChart from "./DomainChart";
import dayjs from "dayjs";
import QueryDetailModal from "./QueryDetailModal";

type Props = {
  userId: number;
  show: boolean;
  onHide: () => void;
};

type QueryItem = {
  id: number;
  domain?: string;
  query_text?: string;
  latest_result?: string;
  created_at?: string;
  user_email?: string;
};

async function fetchUserQueries(userId: number): Promise<QueryItem[]> {
  const r = await client.get("/admin/queries", { params: { user_id: userId, per_page: 200 } });
  return r.data?.items ?? [];
}

export default function UserDetailModal({ userId, show, onHide }: Props) {
  const { data, isLoading } = useQuery({
    queryKey: ["userQueries", userId],
    queryFn: () => fetchUserQueries(userId),
    enabled: show && !!userId,
  });

  const [selectedQuery, setSelectedQuery] = React.useState<QueryItem | null>(null);

  React.useEffect(() => {
    if (!show) {
      setSelectedQuery(null);
    }
  }, [show]);

  const queries = data ?? [];

  // aggregate domains
  const domainCounts: Record<string, number> = {};
  queries.forEach((q) => {
    const d = (q.domain || "unknown").toLowerCase();
    domainCounts[d] = (domainCounts[d] || 0) + 1;
  });

  return (
    <>
      <Modal show={show} onHide={onHide} size="xl" centered dialogClassName="modal-xxl">
        <Modal.Header closeButton>
          <Modal.Title>User details — id {userId}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isLoading ? (
            <div className="text-center py-4"><Spinner animation="border" /></div>
          ) : (
            <>
              <h6>Domain usage</h6>
              <div style={{ maxWidth: 600, marginBottom: 16 }}>
                <DomainChart counts={domainCounts} type="pie" />
              </div>

              <h6 className="mt-3">Recent queries ({queries.length})</h6>

              {/* Scrollable queries area */}
              <div className="user-queries-scroll border rounded">
                <Table striped bordered hover responsive size="sm" className="mb-0">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Domain</th>
                      <th>Preview</th>
                      <th>Created</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {queries.map((q) => (
                      <tr key={q.id}>
                        <td style={{ verticalAlign: "top" }}>{q.id}</td>
                        <td style={{ verticalAlign: "top" }}>{q.domain || "—"}</td>
                        <td style={{ maxWidth: 600, whiteSpace: "normal", verticalAlign: "top" }}>
                          {/* clickable preview that opens full chat modal */}
                          <div
                            style={{ cursor: "pointer" }}
                            onClick={() => setSelectedQuery(q)}
                            title="Click to view full chat"
                          >
                            {q.latest_result
                              ? q.latest_result.length > 300
                                ? q.latest_result.substring(0, 300) + "… (click to read more)"
                                : q.latest_result
                              : q.query_text
                              ? q.query_text.length > 300
                                ? q.query_text.substring(0, 300) + "… (click to read more)"
                                : q.query_text
                              : "—"}
                          </div>
                        </td>
                        <td style={{ verticalAlign: "top" }}>{q.created_at ? dayjs(q.created_at).format("YYYY-MM-DD HH:mm") : "—"}</td>
                        <td style={{ verticalAlign: "top" }}>
                          <Button size="sm" variant="outline-primary" onClick={() => setSelectedQuery(q)}>
                            View Chat
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>Close</Button>
        </Modal.Footer>
      </Modal>

      {/* Query detail modal for the selected query */}
      {selectedQuery && (
        <QueryDetailModal show={!!selectedQuery} onHide={() => setSelectedQuery(null)} item={selectedQuery} />
      )}
    </>
  );
}
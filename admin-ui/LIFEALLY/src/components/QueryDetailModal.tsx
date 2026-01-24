import React from "react";
import { Modal, Button } from "react-bootstrap";
import dayjs from "dayjs";

type Props = {
  show: boolean;
  onHide: () => void;
  item?: {
    id: number;
    user_id?: number;
    user_email?: string;
    domain?: string;
    query_text?: string;
    latest_result?: string;
    created_at?: string;
  };
};

export default function QueryDetailModal({ show, onHide, item }: Props) {
  if (!item) return null;

  // Choose the best content to display: latest_result (preferred), else query_text
  const content = item.latest_result ?? item.query_text ?? "—";

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="xl"         // larger modal on desktop
      centered
      aria-labelledby={`query-${item.id}-title`}
    >
      <Modal.Header closeButton>
        <Modal.Title id={`query-${item.id}-title`}>Query #{item.id} details</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p><strong>User:</strong> {item.user_email ?? item.user_id ?? "—"}</p>
        <p><strong>Domain:</strong> {item.domain ?? "—"}</p>
        <p>
          <strong>Created:</strong>{" "}
          {item.created_at ? dayjs(item.created_at).format("YYYY-MM-DD HH:mm") : "—"}
        </p>

        <hr />

        <h6>Full Result / Response</h6>

        {/* Bigger scrollable result area so entire chat / summary is readable */}
        <div
          className="modal-result-scroll p-3 border rounded"
          role="region"
          aria-label="Full result"
        >
          {/* pre-wrap preserves newlines from server; wordBreak avoids overflow */}
          <div style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
            {content}
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
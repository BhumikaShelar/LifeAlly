import React from "react";
import { Card, Row, Col, Spinner } from "react-bootstrap";
import { useQuery } from "@tanstack/react-query";
import client from "../api/client";
import DomainChart from "../components/DomainChart";

async function fetchUsersMeta() {
  const r = await client.get("/admin/users");
  return { total: r.data?.total ?? 0, items: r.data?.items ?? [] };
}

async function fetchQueriesMeta() {
  const r = await client.get("/admin/queries", { params: { per_page: 200 } });
  return { total: r.data?.total ?? 0, items: r.data?.items ?? [] };
}

export default function Dashboard() {
  const { data: usersData, isLoading: usersLoading } = useQuery({ queryKey: ["dashboardUsers"], queryFn: fetchUsersMeta });
  const { data: queriesData, isLoading: queriesLoading } = useQuery({ queryKey: ["dashboardQueries"], queryFn: fetchQueriesMeta });

  if (usersLoading || queriesLoading) {
    return <div className="text-center py-5"><Spinner animation="border" /></div>;
  }

  const totalUsers = usersData?.total ?? 0;
  const totalQueries = queriesData?.total ?? 0;

  // Build domain counts from queries sample
  const domainCounts: Record<string, number> = {};
  (queriesData?.items ?? []).forEach((q: any) => {
    const d = (q.domain || "unknown").toLowerCase();
    domainCounts[d] = (domainCounts[d] || 0) + 1;
  });

  return (
    <div>
      <h3 className="mb-4">Admin Dashboard</h3>
      <Row className="g-3 mb-3">
        <Col md={4}><Card className="p-3"><h6>Active Users</h6><h2>{totalUsers.toLocaleString()}</h2><small className="text-muted">Total users</small></Card></Col>
        <Col md={4}><Card className="p-3"><h6>Queries</h6><h2>{totalQueries.toLocaleString()}</h2><small className="text-muted">Total queries (sample)</small></Card></Col>
        <Col md={4}><Card className="p-3"><h6>Domains</h6><h2>{Object.keys(domainCounts).length}</h2><small className="text-muted">Different domains</small></Card></Col>
      </Row>

      <Row className="g-3">
        <Col md={6}><Card className="p-3"><h5>Domain distribution (sample)</h5><DomainChart counts={domainCounts} type="bar" /></Card></Col>
        <Col md={6}><Card className="p-3"><h5>Top domains (pie)</h5><div style={{ maxWidth: 400 }}><DomainChart counts={domainCounts} type="pie" /></div></Card></Col>
      </Row>

      <section className="mt-4">
        <Card className="p-3">
          <h5>Recent activity</h5>
          <ul>
            <li>New users and queries appear here (data from server)</li>
            <li>Use Users → View to inspect per-user query breakdowns</li>
            <li>Click a query preview in Queries & Logs to read the full response</li>
          </ul>
        </Card>
      </section>
    </div>
  );
}
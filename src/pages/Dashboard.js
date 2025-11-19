import React, { useEffect, useState, useCallback } from "react";
import { getFlaggedClaims, markReview } from "../api/claims";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Slider,
  Paper,
  Typography
} from "@mui/material";

export default function Dashboard() {
  const [threshold, setThreshold] = useState(70);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(false);

  // Ensures function identity does not change (fixes React warnings)
  const fetchClaims = useCallback(() => {
    setLoading(true);
    getFlaggedClaims(threshold)
      .then((res) => setClaims(res.data))
      .catch((err) => console.error("Error loading claims:", err))
      .finally(() => setLoading(false));
  }, [threshold]);

  useEffect(() => {
    fetchClaims();
  }, [fetchClaims]);

  const updateStatus = (id, status) => {
    markReview(id, status)
      .then(() => fetchClaims())
      .catch((err) => console.error("Review update failed:", err));
  };

  return (
    <div style={{ padding: 40 }}>
      <Typography variant="h4" gutterBottom>
        Fraud Auditor Dashboard
      </Typography>

      <Typography variant="subtitle1">
        Fraud Score Threshold: <strong>{threshold}</strong>
      </Typography>

      <Slider
        value={threshold}
        min={0}
        max={100}
        step={1}
        onChange={(e, val) => setThreshold(val)}
        style={{ width: 300, marginTop: 10 }}
      />

      <br />

      {loading && <p>Loading flagged claims...</p>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Claim ID</strong></TableCell>
              <TableCell><strong>Provider</strong></TableCell>
              <TableCell><strong>Amount</strong></TableCell>
              <TableCell><strong>Score</strong></TableCell>
              <TableCell><strong>Duplicate</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {claims.map((c) => (
              <TableRow key={c.claimId}>
                <TableCell>{c.claimId}</TableCell>
                <TableCell>{c.providerId}</TableCell>
                <TableCell>{c.claimAmount}</TableCell>
                <TableCell>{c.fraudScore}</TableCell>
                <TableCell>{c.duplicateFlag}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    onClick={() => updateStatus(c.claimId, "FRAUD")}
                    style={{ marginRight: 8 }}
                  >
                    Fraud
                  </Button>

                  <Button
                    variant="contained"
                    color="success"
                    size="small"
                    onClick={() => updateStatus(c.claimId, "NOT_FRAUD")}
                    style={{ marginRight: 8 }}
                  >
                    Not Fraud
                  </Button>

                  <Button
                    variant="contained"
                    color="warning"
                    size="small"
                    onClick={() => updateStatus(c.claimId, "REVIEW")}
                  >
                    Needs Review
                  </Button>
                </TableCell>
              </TableRow>
            ))}

            {claims.length === 0 && !loading && (
              <TableRow>
                <TableCell colSpan={6} style={{ textAlign: "center" }}>
                  No claims match this threshold.
                </TableCell>
              </TableRow>
            )}
          </TableBody>

        </Table>
      </TableContainer>
    </div>
  );
}
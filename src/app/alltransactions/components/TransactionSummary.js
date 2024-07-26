// components/TransactionSummary.js
import React from "react";
import { Paper, Typography, Grid } from "@mui/material";

const TransactionSummary = ({ totals }) => (
  <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
    <Typography variant="h6" gutterBottom>Total हिसाब</Typography>
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6} md={2.4}>
        <Typography>कुल इतना माल बिका : {totals.quantity.toFixed(2)} Kg</Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={2.4}>
        <Typography>आज कुल इतने का माल बिका : ₹{totals.total.toFixed(2)}</Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={2.4}>
        <Typography>आज की कुल नगदी : ₹{totals.cash.toFixed(2)}</Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={2.4}>
        <Typography>आज इतनी उधारी आइ : ₹{totals.old.toFixed(2)}</Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={2.4}>
        <Typography>आज की कुल उधारी : ₹{totals.remaining.toFixed(2)}</Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={2.4}>
        <Typography>Total रुपे आए : ₹{(totals.cash + totals.old).toFixed(2)}</Typography>
      </Grid>
    </Grid>
  </Paper>
);

export default TransactionSummary;

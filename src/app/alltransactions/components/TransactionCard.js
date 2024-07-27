// components/TransactionCard.js
import React from "react";
import { Card, CardContent, CardActions, Typography, Button } from "@mui/material";

const TransactionCard = ({ transaction, handleDelete }) => (
  <Card sx={{ border: `2px solid ${transaction.remaining === 0 ? "green" : "red"}` }}>
    <CardContent>
      <Typography variant="h6">{transaction.shop_name}</Typography>
      <Typography color="textSecondary" gutterBottom>{transaction.village_name}</Typography>
      <Typography>मात्रा : {transaction.quantity} Kg</Typography>
      <Typography>कुल रुपए : ₹{transaction.total.toFixed(2)}</Typography>
      <Typography>नगदी : ₹{transaction.cash.toFixed(2)}</Typography>
      <Typography>पुराने जमा : ₹{transaction.old.toFixed(2)}</Typography>
      <Typography>आज के बाक़ी : ₹{transaction.remaining.toFixed(2)}</Typography>
    </CardContent>
    <CardActions>
      <Button size="small" color="secondary" onClick={() => handleDelete(transaction.id)}>Delete</Button>
    </CardActions>
  </Card>
);

export default TransactionCard;

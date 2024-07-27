"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert,
  TextField,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import supabaseClient from "../../utils/supabaseClient";

const supabase = supabaseClient;

const date = new Date().toLocaleDateString("en-IN", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export default function AllTransactions() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [transactions, setTransactions] = useState([]);
  const [totals, setTotals] = useState({
    quantity: 0,
    total: 0,
    cash: 0,
    old: 0,
    remaining: 0,
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const router = useRouter();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    fetchTransactions(new Date());
  }, []);

  const fetchTransactions = async (date = new Date()) => {
    const dateObj = date instanceof Date ? date : new Date(date);
    const formattedDate = dateObj.toISOString().split("T")[0];

    const monthNames = [
      "january",
      "february",
      "march",
      "april",
      "may",
      "june",
      "july",
      "august",
      "september",
      "october",
      "november",
      "december",
    ];
    const monthName = monthNames[dateObj.getMonth()];
    const year = dateObj.getFullYear();
    const tableName = `daily_transactions_${monthName}_${year}`;

    const { data, error } = await supabase
      .from(tableName)
      .select("*")
      .eq("created_at", formattedDate)
      .order("created_at", { ascending: false });

    // ... rest of the function remains the same
    if (error) {
      console.error("Error fetching transactions:", error);
      setSnackbarMessage("Error fetching transactions. Please try again.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    } else {
      setTransactions(data);
      calculateTotals(data);
      setSnackbarMessage(`Transactions fetched for ${formattedDate}`);
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
    }
  };

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };

  const handleFetchData = () => {
    // Ensure the date is in the correct format (YYYY-MM-DD)
    const formattedDate = selectedDate.toISOString().split("T")[0];
    fetchTransactions(new Date(formattedDate));
  };

  const calculateTotals = (data) => {
    const newTotals = data.reduce(
      (acc, transaction) => ({
        quantity: acc.quantity + transaction.quantity,
        total: acc.total + transaction.total,
        cash: acc.cash + transaction.cash,
        old: acc.old + transaction.old,
        remaining: acc.remaining + transaction.remaining,
      }),
      { quantity: 0, total: 0, cash: 0, old: 0, remaining: 0 }
    );

    setTotals(newTotals);
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setOpenDialog(true);
  };
  
  

  const handleDeleteTransaction = async (transactionId) => {
    try {
      const dateObj = selectedDate;
      const monthNames = [
        "january", "february", "march", "april", "may", "june", "july",
        "august", "september", "october", "november", "december"
      ];
      const monthName = monthNames[dateObj.getMonth()];
      const year = dateObj.getFullYear();
      const tableName = `daily_transactions_${monthName}_${year}`;
  
      // Fetch the transaction details
      const { data: transactionData, error: fetchTransactionError } = await supabase
        .from(tableName)
        .select('*')
        .eq('id', transactionId)
        .single();
  
      if (fetchTransactionError) {
        throw new Error(`Error fetching transaction: ${fetchTransactionError.message}`);
      }
  
      // Fetch current shop data
      const { data: shopData, error: fetchShopError } = await supabase
        .from("Shops Table")
        .select("*")
        .eq("id", transactionData.shop_id)
        .single();
  
      if (fetchShopError) {
        throw new Error(`Failed to fetch shop data: ${fetchShopError.message}`);
      }
  
      // Calculate new totals
      const newTotalQuantity = (shopData.total_quantity || 0) - (parseFloat(transactionData.quantity) || 0);
      const newTotal = (shopData.total || 0) - transactionData.total;
      const newTotalCash = (shopData.total_cash || 0) - transactionData.cash;
      const newTotalOld = (shopData.total_old || 0) - transactionData.old;
  
      // Update Shops Table
      const { error: updateShopError } = await supabase
        .from("Shops Table")
        .update({
          total_quantity: newTotalQuantity,
          total: newTotal,
          total_cash: newTotalCash,
          total_old: newTotalOld,
        })
        .eq("id", transactionData.shop_id);
  
      if (updateShopError) {
        throw new Error(`Failed to update shop totals: ${updateShopError.message}`);
      }
  
      // Delete the transaction
      const { error: deleteError } = await supabase
        .from(tableName)
        .delete()
        .eq("id", transactionId);
  
      if (deleteError) {
        throw new Error(`Error deleting transaction: ${deleteError.message}`);
      }
  
      // If everything is successful
      setSnackbarMessage("Transaction deleted and shop data updated successfully.");
      setSnackbarSeverity("success");
      // Fetch transactions for the currently selected date
      fetchTransactions(selectedDate);
    } catch (error) {
      console.error("Error in delete process:", error);
      setSnackbarMessage(`Error: ${error.message}`);
      setSnackbarSeverity("error");
    } finally {
      setOpenDialog(false);
      setOpenSnackbar(true);
    }
  };

  const confirmDelete = () => {
    handleDeleteTransaction(deleteId);
  };



  const sendTotalToTelegram = async () => {
    const telegramToken = "7240758563:AAHc_bUtGSBHWNPRAXuNxSZ4c4zEWH6Lcz0";
    const chatId = "-4209186125";
    const telegramURL = `https://api.telegram.org/bot${telegramToken}/sendMessage`;

    const message = `
दिनांक: ${date} का कुल हिसाब:\n
कुल माल बिका : ${totals.quantity.toFixed(2)} Kg
इतने का माल बिका : ₹${totals.total.toFixed(2)}
नगदी आइ : ₹${totals.cash.toFixed(2)}
उधारी आइ : ₹${totals.old.toFixed(2)}
उधारी दी : ₹${totals.remaining.toFixed(2)}
कुल रुपे आए : ₹${(totals.cash + totals.old).toFixed(2)}
    `;

    try {
      const response = await fetch(telegramURL, {
        method: "POST",
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: "HTML",
        }),
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        setSnackbarMessage("हिसाब सफलतापूर्वक टेलीग्राम पर भेजा गया!");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
      } else {
        throw new Error("Failed to send totals to Telegram");
      }
    } catch (error) {
      console.error("Error sending totals to Telegram:", error);
      setSnackbarMessage("हिसाब भेजने में समस्या आई। कृपया पुनः प्रयास करें।");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <Container sx={{ mt: 4, mb: 6 }}>
      {/* ... (keep all other JSX as it is) */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mb: 3,
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Select Date"
            value={selectedDate}
            onChange={handleDateChange}
            renderInput={(params) => <TextField {...params} />}
            // minDate={
            //   new Date(new Date().getFullYear(), new Date().getMonth(), 1)
            // }
            minDate={new Date(2024, 0, 1)}
            maxDate={new Date()}
          />
        </LocalizationProvider>
        <Button
          variant="contained"
          color="primary"
          onClick={handleFetchData}
          sx={{ ml: 2 }}
        >
          हिसाब देखे
        </Button>
      </Box>

      <Typography variant="h6" gutterBottom sx={{ textAlign: "center" }}>
        {selectedDate.toLocaleDateString("en-IN", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}{" "}
        का कुल हिसाब{" "}
      </Typography>

      <Paper elevation={7} sx={{ p: 3, mb: 4, borderRadius: "16px" }}>
        <Typography variant="h6" gutterBottom>
          Total हिसाब
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={2.4}>
            <Typography>
              कुल इतना माल बिका : {totals.quantity.toFixed(2)} Kg
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Typography>
              आज कुल इतने का माल बिका : ₹{totals.total.toFixed(2)}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Typography>आज की कुल नगदी : ₹{totals.cash.toFixed(2)}</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Typography>आज इतनी उधारी आइ : ₹{totals.old.toFixed(2)}</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Typography>
              आज की कुल उधारी : ₹{totals.remaining.toFixed(2)}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Typography>
              Total रुपे आए : ₹{(totals.cash + totals.old).toFixed(2)}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <Box
        sx={{ mb: 2, mt: 4, display: "flex", justifyContent: "space-between" }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={() => router.push("/")}
        >
          Main पेज
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={sendTotalToTelegram}
        >
          telegram पर भेजें
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mt: 1 }}>
        {transactions.map((transaction) => (
          <Grid item xs={12} sm={6} md={4} key={transaction.id}>
            <Card
              sx={{
                border: `2px solid ${
                  transaction.remaining === 0 ? "green" : "red"
                }`,
                borderRadius: "16px", // Adjust the value for more or less roundness
                boxShadow:
                  "0 4px 8px rgba(0, 0, 0, 0.1), 0 6px 20px rgba(0, 0, 0, 0.1)", // Add shadow effect
              }}
            >
              <CardContent>
                <Typography variant="h6">{transaction.shop_name}</Typography>
                <Typography color="textSecondary" gutterBottom>
                  {transaction.village_name}
                </Typography>
                <Typography>मात्रा : {transaction.quantity} Kg</Typography>
                <Typography>
                  कुल रुपए : ₹{transaction.total.toFixed(2)}
                </Typography>
                <Typography>नगदी : ₹{transaction.cash.toFixed(2)}</Typography>
                <Typography>
                  पुराने जमा : ₹{transaction.old.toFixed(2)}
                </Typography>
                <Typography>
                  आज के बाक़ी : ₹{transaction.remaining.toFixed(2)}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  color="secondary"
                  onClick={() => handleDelete(transaction.id)}
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            क्या आप वाकई इस हिसाब को Delete करना चाहते हैं? डिलीट करने के बाद
            हिसाब वापस नहीं लाया जा सकता है
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="secondary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}

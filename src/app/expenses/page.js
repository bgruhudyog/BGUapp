"use client";
import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Box,
  Snackbar,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { Checkbox, FormControlLabel } from "@mui/material";

import supabaseClient from "../../utils/supabaseClient";
const supabase = supabaseClient;

export default function ExpenseTracker() {
  const initialExpenses = {
    dailyExpense: 200,
    gasExpense: "",
    petrolExpense: "",
    tollTaxExpense: "",
    servicingExpense: "",
    packingExpense: "",
    stickerExpense: "",
    carryingExpense: "",
    salaryYogendra: "",
    salaryBharat: "",
    salaryRajyavardhan: "",
    otherExpense: "",
    otherExpenseDetails: "",
  };

  const [expenses, setExpenses] = useState(initialExpenses);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setExpenses((prevExpenses) => ({
      ...prevExpenses,
      [name]: type === 'checkbox' ? (checked ? 200 : 0) : value,
    }));
  };

  const handleSubmit = () => {
    setOpenConfirmDialog(true);
  };

  const resetExpenses = () => {
    setExpenses(initialExpenses);
  };

  const handleConfirmSubmit = async () => {
    setOpenConfirmDialog(false);
    const filledExpenses = Object.entries(expenses).reduce(
      (acc, [key, value]) => {
        if (value !== "" && value !== 0) {
          acc[key] = value;
        }
        return acc;
      },
      {}
    );

    try {
      await sendToTelegram(filledExpenses);
      await sendToSupabase(filledExpenses);
      setSnackbarMessage("Expenses sent to Telegram and Supabase successfully!");
      setSnackbarSeverity("success");
      resetExpenses(); // Reset all field values after successful submission
    } catch (error) {
      console.error("Error sending expenses:", error);
      setSnackbarMessage("Error sending expenses");
      setSnackbarSeverity("error");
    }
    setOpenSnackbar(true);
  };

  const sendToTelegram = async (expenses) => {
    const telegramToken = "7240758563:AAHc_bUtGSBHWNPRAXuNxSZ4c4zEWH6Lcz0";
    const chatId = "-4209186125";
    const telegramURL = `https://api.telegram.org/bot${telegramToken}/sendMessage`;

    const message = formatExpensesMessage(expenses);

    const response = await fetch(telegramURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to send message to Telegram");
    }
  };

  const sendToSupabase = async (expenses) => {
    const { data, error } = await supabase
      .from('Expense_Table')
      .insert({
        chai_pani: expenses.dailyExpense, // New column for daily expense
        gas_expense: expenses.gasExpense,
        petrol_expense: expenses.petrolExpense,
        toll_expense: expenses.tollTaxExpense,
        servicing_expense: expenses.servicingExpense,
        packing_expense: expenses.packingExpense,
        stickerandpoly_expense: expenses.stickerExpense,
        carrying_expense: expenses.carryingExpense,
        yogendra_salary_expense: expenses.salaryYogendra,
        bharat_salary_expense: expenses.salaryBharat,
        raj_salary: expenses.salaryRajyavardhan,
        other_expenses: expenses.otherExpense,
        o_e_reason: expenses.otherExpenseDetails,
      });
  
    if (error) throw error;
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleCloseDialog = () => {
    setOpenConfirmDialog(false);
  };

  const formatExpensesMessage = (expenses) => {
    const currentDate = new Date().toLocaleDateString('en-IN');
    let message = `Expense Report for ${currentDate}\n\n`;
    let total = 0;

    for (const [key, value] of Object.entries(expenses)) {
      if (value !== '' && value !== 0 && key !== 'otherExpenseDetails') {
        message += `${key}: ₹${value}\n`;
        total += Number(value);
      }
    }

    if (expenses.otherExpenseDetails) {
      message += `Other Expense Details: ${expenses.otherExpenseDetails}\n`;
    }

    message += `\nTotal Expense: ₹${total}`;
    return message;
  };


  return (
    <Container maxWidth="md">
      <Typography variant="h4" align="center" gutterBottom>
        दैनिक खर्च हिसाब 
      </Typography>

      <Paper elevation={4} sx={{ p: 3, mb: 3,borderRadius: 3 }}>
        <Typography variant="h6" gutterBottom>
          चाई सूट्टा 
        </Typography>
        <FormControlLabel
          control={
            <Checkbox
              checked={expenses.dailyExpense === 200} // Checkbox state
              onChange={handleChange}
              name="dailyExpense" // Name for Checkbox
            />
          }
          label={expenses.dailyExpense === 200 ? "200 rs" : "0 rs"} // Display based on state
        />
      </Paper>

      <Paper elevation={4} sx={{ p: 3, mb: 3,borderRadius: 3 }}>
        <Typography variant="h6" gutterBottom>
          गाड़ी सम्बंधित खर्च 
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="गैस का खर्च "
              name="gasExpense" // Match name with state key
              value={expenses.gasExpense}
              onChange={handleChange}
              margin="normal"
              type="number"
              inputProps={{ min: 0 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="पेट्रोल का खर्च "
              name="petrolExpense" // Match name with state key
              value={expenses.petrolExpense}
              onChange={handleChange}
              margin="normal"
              type="number"
              inputProps={{ min: 0 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="टोल टैक्स का खर्च "
              name="tollTaxExpense" // Match name with state key
              value={expenses.tollTaxExpense}
              onChange={handleChange}
              margin="normal"
              type="number"
              inputProps={{ min: 0 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="सर्विसिंग का खर्च "
              name="servicingExpense" // Match name with state key
              value={expenses.servicingExpense}
              onChange={handleChange}
              margin="normal"
              type="number"
              inputProps={{ min: 0 }}
            />
          </Grid>
        </Grid>
      </Paper>

      <Paper elevation={4} sx={{ p: 3, mb: 3,borderRadius: 3 }}>
        <Typography variant="h6" gutterBottom>
          मिर्ची संबंधित खर्च
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="पैकिंग का खर्च "
              name="packingExpense" // Match name with state key
              value={expenses.packingExpense}
              onChange={handleChange}
              margin="normal"
              type="number"
              inputProps={{ min: 0 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="स्टिकर एवं पन्नी का खर्च "
              name="stickerExpense" // Match name with state key
              value={expenses.stickerExpense}
              onChange={handleChange}
              margin="normal"
              type="number"
              inputProps={{ min: 0 }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="हम्मलि का खर्च "
              name="carryingExpense" // Match name with state key
              value={expenses.carryingExpense}
              onChange={handleChange}
              margin="normal"
              type="number"
              inputProps={{ min: 0 }}
            />
          </Grid>
        </Grid>
      </Paper>

      <Paper elevation={4} sx={{ p: 3, mb: 3,borderRadius: 3 }}>
        <Typography variant="h6" gutterBottom>
          सैलरी का खर्च 
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="योगेन्द्र सिंह जी की सैलरी का खर्च "
              name="salaryYogendra" // Match name with state key
              value={expenses.salaryYogendra}
              onChange={handleChange}
              margin="normal"
              type="number"
              inputProps={{ min: 0 }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="भारत गुर्जर जी की सैलरी का खर्च "
              name="salaryBharat" // Match name with state key
              value={expenses.salaryBharat}
              onChange={handleChange}
              margin="normal"
              type="number"
              inputProps={{ min: 0 }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="राज्यवर्धन जी की सैलरी का खर्च "
              name="salaryRajyavardhan" // Match name with state key
              value={expenses.salaryRajyavardhan}
              onChange={handleChange}
              margin="normal"
              type="number"
              inputProps={{ min: 0 }}
            />
          </Grid>
        </Grid>
      </Paper>

      <Paper elevation={4} sx={{ p: 3, mb: 3,borderRadius: 3 }}>
        <Typography variant="h6" gutterBottom>
          अन्य खर्च 
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="अन्य खर्च की राशि"
              name="otherExpense"
              value={expenses.otherExpense}
              onChange={handleChange}
              margin="normal"
              type="number"
              inputProps={{ min: 0 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="अन्य खर्च का विवरण"
              name="otherExpenseDetails"
              value={expenses.otherExpenseDetails}
              onChange={handleChange}
              margin="normal"
            />
          </Grid>
        </Grid>
      </Paper>

  

      <Box
        sx={{
          position: "sticky",
          bottom: 16,
          textAlign: "center",
          zIndex: 1,
          display: "flex",
          justifyContent: "center",
          gap: 2,
        }}
      >
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleSubmit}
        >
          Submit
        </Button>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          onClick={() => {
            // This is where you'll add the routing logic when the component is ready
            console.log("View Expenses button clicked");
          }}
        >
          View Expenses
        </Button>
      </Box>

      <Dialog
        open={openConfirmDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirm Expense Submission"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            कृपया हिसाब एक बार पुनः जाँच ले 
          </DialogContentText>
          <Typography
            variant="body1"
            component="pre"
            style={{ whiteSpace: "pre-wrap" }}
          >
            {formatExpensesMessage(expenses)}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            हिसाब EDIT करे 
          </Button>
          <Button onClick={handleConfirmSubmit} color="primary" autoFocus>
            हिसाब भेजे 
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000} // Changed to 5000ms (5 seconds)
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
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

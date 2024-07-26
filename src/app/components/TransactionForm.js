"use client";
import supabaseClient from "../../utils/supabaseClient";
const supabase = supabaseClient;

import { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert,
} from "@mui/material";

export default function TransactionForm({
  villageName,
  routeId,
  shopName,
  quantity,
  setQuantity,
  rate,
  setRate,
  cash,
  setCash,
  old,
  setOld,
  total,
  remaining,
  handleSubmit,
}) {
  const [isRateFocused, setIsRateFocused] = useState(false);
  const [isCashFocused, setIsCashFocused] = useState(false);
  const [isOldFocused, setIsOldFocused] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const quantityValue = parseFloat(quantity) || 0;
  const rateValue = parseFloat(rate) || 230;
  const cashValue = parseFloat(cash) || 0;
  const oldValue = parseFloat(old) || 0;

  const totalValue = quantityValue * rateValue;
  const remainingValue = totalValue - cashValue;

  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const isFormValid =
    (quantity !== "" && parseFloat(quantity) !== 0) ||
    (old !== "" && parseFloat(old) !== 0);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleConfirmSubmit = () => {
    setOpenConfirmDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenConfirmDialog(false);
  };

  const handleConfirm = () => {
    handleCloseDialog();
    handleTelegramSubmit();
  };

  const resetForm = () => {
    setQuantity("");
    setRate("230");
    setCash("");
    setOld("");
  };
  async function insertTransaction(transactionData) {
    const tableName = getCurrentTableName();
    const tableExists = await ensureTableExists(supabase, tableName);

    if (!tableExists) {
      console.error("Failed to ensure table exists");
      return { error: "Failed to ensure table exists" };
    }

    const { data, error } = await supabase
      .from(tableName)
      .insert([transactionData]);

    if (error) {
      console.error("Error inserting transaction:", error);
      return { error };
    }

    return { data };
  }

  function getCurrentTableName() {
    const now = new Date();
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
    const monthName = monthNames[now.getMonth()];
    const year = now.getFullYear();
    return `daily_transactions_${monthName}_${year}`;
  }

  async function ensureTableExists(supabase, tableName) {
    const { data, error } = await supabase.rpc("table_exists", {
      table_name: tableName,
    });

    if (error) {
      console.error("Error checking if table exists:", error);
      return false;
    }

    if (!data) {
      // Table doesn't exist, create it
      const { error: createError } = await supabase.rpc(
        "create_monthly_table",
        { table_name: tableName }
      );
      if (createError) {
        console.error("Error creating table:", createError);
        return false;
      }
    }

    return true;
  }

  const handleTelegramSubmit = async () => {
    try {
      console.log("handleTelegramSubmit function called");

      const telegramToken = "7240758563:AAHc_bUtGSBHWNPRAXuNxSZ4c4zEWH6Lcz0";
      const chatId = "-4209186125";
      const telegramURL = `https://api.telegram.org/bot${telegramToken}/sendMessage`;

      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are zero-based
      const day = String(currentDate.getDate()).padStart(2, "0");

      const formattedDateForSupaBase = `${year}-${month}-${day}`;
      const formattedDateForTelegram = `${day}/${month}/${year}`;

      console.log("Preparing to insert data into Supabase");
      console.log("Data to be inserted:", {
        created_at: formattedDateForSupaBase,
        shop_name: shopName,
        village_name: villageName,
        route_id: routeId,
        quantity: parseFloat(quantity) || 0,
        total: totalValue,
        cash: cashValue,
        old: oldValue,
        remaining: remainingValue,
      });
      const transactionData = {
        created_at: formattedDateForSupaBase,
        shop_name: shopName,
        village_name: villageName,
        route_id: routeId,
        quantity: parseFloat(quantity) || 0,
        total: totalValue,
        cash: cashValue,
        old: oldValue,
        remaining: remainingValue,
      };

      const { data, error } = await insertTransaction(transactionData);
      if (error) {
        throw new Error(`Failed to insert transaction: ${error.message}`);
      }

      let message;
      if (totalValue === 0) {
        message = `
  दिनांक: ${formattedDateForTelegram}\n
  रूट: ${routeId}\n
  दुकान का नाम: ${shopName}, ${villageName}\n
  पुराने जमा: ₹${oldValue.toFixed(2)}\n
        `;
      } else {
        message = `
  दिनांक: ${formattedDateForTelegram}\n
  रूट: ${routeId}\n
  दुकान का नाम: ${shopName}, ${villageName}\n
  मात्रा: ${quantity} Kg\n
  रेट: ₹${rateValue}\n
  कुल: ₹${totalValue.toFixed(2)}\n
  नगदी: ₹${cash}\n
  आज के बाक़ी: ₹${remainingValue.toFixed(2)}\n
  पुराने जमा: ₹${oldValue.toFixed(2)}\n
            `;
      }

      console.log("Sending message to Telegram");

      // Send message to Telegram
      const response = await fetch(telegramURL, {
        method: "POST",
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: "HTML",
        }),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Telegram API response was not ok.");
      }

      console.log("Message sent to Telegram successfully");
      setSnackbarMessage("हिसाब सफलतापूर्वक जमा किया गया!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true); // Show the Snackbar
      setTimeout(() => {
        resetForm(); // Reset the form after a brief delay
      }, 1000);
    } catch (error) {
      console.error("Error in handleTelegramSubmit:", error.message);
      setSnackbarMessage("Error occurred while submitting. Please try again.");
      setSnackbarSeverity("error");
      // Handle the error appropriately (e.g., show an error message to the user)
      setOpenSnackbar(true);
    }
  };

  return (
    <Box mt={2}>
      <Typography variant="h6" gutterBottom>
        नया हिसाब जोड़े
      </Typography>
      <Box display="flex" gap={2}>
        <TextField
          id="quantity"
          label="Kg"
          type="number"
          placeholder="कितने किलो माल लिया "
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          id="rate"
          label="रेट"
          type="number"
          placeholder="रेट"
          list="rate-options"
          value={isRateFocused ? rate : rate || "230"}
          onChange={(e) => setRate(e.target.value)}
          onFocus={() => setIsRateFocused(true)}
          onBlur={() => setIsRateFocused(false)}
          fullWidth
          margin="normal"
          step="5"
        />
      </Box>
      <Box display="flex" gap={2}>
        <TextField
          id="cash"
          label="नगदी"
          type="number"
          placeholder="नगदी "
          value={isCashFocused ? cash : cash || "0"}
          onChange={(e) => setCash(e.target.value)}
          onFocus={() => setIsCashFocused(true)}
          onBlur={() => setIsCashFocused(false)}
          fullWidth
          margin="normal"
          disabled={totalValue === 0}
        />
        <TextField
          id="old"
          label="पुराने जमा"
          type="number"
          placeholder="पुराने जमा "
          value={isOldFocused ? old : old || "0"}
          onChange={(e) => setOld(e.target.value || "0")}
          onFocus={() => setIsOldFocused(true)}
          onBlur={() => setIsOldFocused(false)}
          fullWidth
          margin="normal"
        />
      </Box>
      <Box mt={2} display="flex" justifyContent="space-between">
        <Typography id="total" variant="subtitle1">
          कुल मूल्य: {totalValue.toFixed(2)}
        </Typography>
        <Typography id="remaining" variant="subtitle1">
          आज के बाक़ी: {remainingValue.toFixed(2)}
        </Typography>
      </Box>
      <Box mt={2} display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          color="primary"
          onClick={handleConfirmSubmit}
          disabled={!isFormValid}
        >
          जमा करे
        </Button>
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
      </Box>

      <Dialog
        open={openConfirmDialog}
        onClose={handleCloseDialog}
        style={{ borderRadius: "20px", textAlign: "center" }}
      >
        <DialogTitle>हिसाब पुनः जाँच लें </DialogTitle>
        <DialogContent>
          <DialogContentText
            style={{ borderRadius: "20px", textAlign: "left" }}
          >
            <br />
            दुकान: {shopName}, {villageName}
            <br />
            {totalValue === 0 ? (
              <>पुराने जमा: ₹{oldValue.toFixed(2)}</>
            ) : (
              <>
                मात्रा: {quantity} Kg
                <br />
                रेट: ₹{rateValue}
                <br />
                कुल: ₹{totalValue.toFixed(2)}
                <br />
                नगदी: ₹{cash}
                <br />
                आज के बाक़ी: ₹{remainingValue.toFixed(2)}
                <br />
                पुराने जमा: ₹{oldValue.toFixed(2)}
              </>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "16px 24px",
          }}
        >
          <Button
            onClick={handleCloseDialog}
            color="secondary"
            variant="outlined"
          >
            हिसाब Edit करें
          </Button>
          <Button
            onClick={handleConfirm}
            color="primary"
            variant="contained"
            autoFocus
          >
            हिसाब जमा करें
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

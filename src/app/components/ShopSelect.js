"use client";
import { Autocomplete, TextField } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import { Box, Button, Typography } from "@mui/material";
import supabaseClient from "../../utils/supabaseClient";
import TransactionForm from "./TransactionForm";
import Grid from "@mui/material/Grid";
export default function ShopSelect({
  shops,
  villageId,
  villageName,
  setShops,
  routeId,
}) {
  const [selectedShopId, setSelectedShopId] = useState("");
  const [selectedShopName, setSelectedShopName] = useState("");
  const [newShopName, setNewShopName] = useState("");
  const [newShopMobile, setNewShopMobile] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [quantity, setQuantity] = useState("");
  const [rate, setRate] = useState("");
  const [cash, setCash] = useState("");
  const [old, setOld] = useState("");
  const [total, setTotal] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [calculatedResult, setCalculatedResult] = useState(null);
  const [mobileNumber, setMobileNumber] = useState(null);
  const [showMobileInput, setShowMobileInput] = useState(true);
  const [originalMobileNumber, setOriginalMobileNumber] = useState(null);
  const mobileInputRef = useRef(null);
  const quantityInputRef = useRef(null);

  const isValidMobileNumber = (number) => {
    return number === "" || (number.length === 10 && /^\d+$/.test(number));
  };

  useEffect(() => {
    setSelectedShopId("");
    setSelectedShopName("");
    setShowTransactionForm(false);
    setCalculatedResult(null);
  }, [villageId, routeId]);

  const fetchShops = async () => {
    const { data, error } = await supabaseClient
      .from("Shops Table")
      .select("*")
      .eq("village_id", villageId);
    if (error) {
      console.error("Error fetching shops:", error);
      return null;
    } else {
      setShops(data); // Update the state here
      return data;
    }
  };

  const addShop = async () => {
    if (newShopMobile && !isValidMobileNumber(newShopMobile)) {
      alert("मोबाइल नंबर 10 अंकों का होना चाहिए");
      return;
    }

    const mobileNumber = newShopMobile ? parseInt(newShopMobile, 10) : null;

    const newShopData = {
      shop_name: newShopName,
      village_id: villageId,
      route_id: null,
      total_quantity: null,
      total: null,
      total_cash: null,
      total_old: null,
      village_name: null,
      mob_number: mobileNumber,
    };
    console.log(newShopData);

    const { data, error } = await supabaseClient
      .from("Shops Table")
      .insert([newShopData]);

    if (error) {
      console.error("Error adding shop:", error);
    } else {
      await fetchShops();
    }
    setNewShopName("");
    setNewShopMobile("");
    setShowForm(false);
  };

  const handleSubmit = async () => {
    if (!quantity || !rate || !cash || !old) {
      alert("Please fill out all fields");
      return;
    }

    try {
      // Submit the transaction
      const { data, error } = await supabaseClient.from("Transactions").insert([
        {
          shop_id: selectedShopId,
          quantity,
          rate,
          cash,
          old,
          created_at: new Date().toISOString(),
          village_name: villageName,
        },
      ]);

      if (error) throw error;

      console.log("Transaction submitted successfully");

      // Wait for the shop data to be updated
      await updateShopData();

      console.log("Shop data updated, UI should refresh now");

      // Reset form fields
      setQuantity("");
      setRate("");
      setCash("");
      setOld("");
      setShowTransactionForm(false);
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      alert("An error occurred while submitting the transaction.");
    }
  };

  const updateShopData = async () => {
    try {
      console.log("Updating shop data...");
      const { data, error } = await supabaseClient
        .from("Shops Table")
        .select("*")
        .eq("id", selectedShopId)
        .single();

      if (error) throw error;

      console.log("Updated shop data:", data);

      // Update the shops state
      setShops((prevShops) => {
        const updatedShops = prevShops.map((shop) =>
          shop.id === selectedShopId ? data : shop
        );
        console.log("Updated shops state:", updatedShops);
        return updatedShops;
      });

      // Recalculate the result
      const newResult = calculateShopResult(data);
      console.log("New calculated result:", newResult);
      setCalculatedResult(newResult);
    } catch (error) {
      console.error("Error updating shop data:", error);
    }
  };

  useEffect(() => {
    const quantityValue = parseFloat(quantity) || 0;
    const rateValue = parseFloat(rate) || 0;
    const cashValue = parseFloat(cash) || 0;
    const totalValue = quantityValue * rateValue;
    setTotal(totalValue);
    setRemaining(totalValue - cashValue);
  }, [quantity, rate, cash]);

  const calculateShopResult = (shop) => {
    const totalValue = parseFloat(shop?.total) || 0;
    const totalCash = parseFloat(shop?.total_cash) || 0;
    const totalOld = parseFloat(shop?.total_old) || 0;
    const result = totalValue - (totalCash + totalOld);
    console.log("Calculating result for shop:", shop.shop_name);
    console.log(
      "Total:",
      totalValue,
      "Cash:",
      totalCash,
      "Old:",
      totalOld,
      "Result:",
      result
    );
    return result;
  };

  // Sort shops alphabetically
  const sortedShops = [...shops].sort((a, b) =>
    a.shop_name.localeCompare(b.shop_name)
  );
  const capitalizeFirstLetters = (text) => {
    return text
      .split(" ")
      .map((word, index) =>
        index < 2 ? word.charAt(0).toUpperCase() + word.slice(1) : word
      )
      .join(" ");
  };
  const handleChange = (e) => {
    const inputValue = e.target.value;
    const capitalizedValue = capitalizeFirstLetters(inputValue);
    setNewShopName(capitalizedValue);
  };
  const handleShopSelect = async (event, newValue) => {

    
    if (newValue) {
      setSelectedShopId(newValue.id);
      setSelectedShopName(newValue.shop_name);
      setShowTransactionForm(true);
      const result = calculateShopResult(newValue);
      console.log("Initial calculated result:", result);
      setCalculatedResult(result);
  
      // Store the original mobile number
      setOriginalMobileNumber(newValue.mob_number);
  
      if (newValue.mob_number === null) {
        setShowMobileInput(true);
        setMobileNumber(null);
      } else {
        setShowMobileInput(false);
        setMobileNumber(newValue.mob_number.toString());
      }

      setTimeout(() => {
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: "smooth",
        });
      // setTimeout(() => {
      //   const scrollAmount = 50; // Adjust this value to control how much it scrolls
      //   window.scrollTo({
      //     top: window.scrollY + scrollAmount,
      //     behavior: "smooth",
      //   });

        // Focus on the appropriate input field after scrolling
        setTimeout(() => {
          if (newValue.mob_number === null && mobileInputRef.current) {
            mobileInputRef.current.focus();
          } else if (quantityInputRef.current) {
            quantityInputRef.current.focus();
          }
        }, 100);
      }, 100);
    } else {
      // ... (rest of the else block remains unchanged)
    }
  };

  return (
    <Box mb={2} mt={2}>
      {showForm ? (
        <>
          <TextField
            label="नई दुकान का नाम लिखे"
            value={newShopName}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="मोबाइल नंबर "
            value={newShopMobile}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "").slice(0, 10);
              setNewShopMobile(value);
            }}
            fullWidth
            margin="normal"
            type="tel"
            inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={addShop}
            disabled={
              !newShopName ||
              (newShopMobile && !isValidMobileNumber(newShopMobile))
            }
          >
            दुकान जोड़े
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => setShowForm(false)}
            style={{ marginLeft: 8 }}
          >
            Cancel / रद्द करे
          </Button>
        </>
      ) : (
        <>
          <Autocomplete
            options={sortedShops}
            getOptionLabel={(option) =>
              capitalizeFirstLetters(option.shop_name)
            }
            renderInput={(params) => (
              <TextField {...params} label="दुकान खोजें" />
            )}
            onChange={handleShopSelect}
            fullWidth
          />
          {showMobileInput && (
            <TextField
              label="मोबाइल नंबर"
              value={mobileNumber}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                setMobileNumber(value === "" ? null : value);
              }}
              fullWidth
              margin="normal"
              type="tel"
              inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
              inputRef={mobileInputRef} // Add this line
            />
          )}
          <Box mt={2}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={4} sm="auto">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setShowForm(true)}
                  // disabled={!villageId}
                  fullWidth
                >
                  नई दुकान जोड़े
                </Button>
              </Grid>
              <Grid item xs={8} sm="auto">
                {calculatedResult !== null && (
                  <Typography
                    variant="h6"
                    sx={{
                      color: "red",
                      textAlign: { xs: "center", sm: "left" },
                      mt: { xs: 1, sm: 0 },
                    }}
                  >
                    कुल उधारी : ₹{calculatedResult.toFixed(2)}
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Box>
        </>
      )}

      {showTransactionForm && (
        <TransactionForm
          shopId={selectedShopId}
          villageName={villageName}
          routeId={routeId}
          shopName={selectedShopName}
          quantity={quantity}
          setQuantity={setQuantity}
          rate={rate}
          setRate={setRate}
          cash={cash}
          setCash={setCash}
          old={old}
          setOld={setOld}
          total={total}
          remaining={remaining}
          handleSubmit={handleSubmit}
          onTransactionComplete={updateShopData}
          setMobileNumber={setMobileNumber}
          mobileNumber={mobileNumber}
          originalMobileNumber={originalMobileNumber}
          quantityInputRef={quantityInputRef} // Add this line
        />
      )}
    </Box>
  );
}

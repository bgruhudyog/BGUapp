"use client";
import { Autocomplete, TextField } from "@mui/material";
import { useState, useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";
import supabaseClient from "../../utils/supabaseClient";
import TransactionForm from "./TransactionForm";

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
        },
      ]);
  
      if (error) throw error;
  
      console.log("Transaction submitted successfully");
  
      // Fetch the updated shop data
      await updateShopData();
  
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
      console.log("Waiting for database to update...");
      await new Promise(resolve => setTimeout(resolve, 2000)); // 2-second delay
  
      console.log("Fetching updated shop data...");
      const { data, error } = await supabaseClient
        .from("Shops Table")
        .select("*")
        .eq("id", selectedShopId)
        .single();
  
      if (error) throw error;
  
      console.log("Updated shop data:", data);
  
      // Update the shops state
      setShops(prevShops => prevShops.map(shop => 
        shop.id === selectedShopId ? data : shop
      ));
  
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
    console.log('Calculating result for shop:', shop.shop_name);
    console.log('Total:', totalValue, 'Cash:', totalCash, 'Old:', totalOld, 'Result:', result);
    return result;
  };

  // Sort shops alphabetically
  const sortedShops = [...shops].sort((a, b) =>
    a.shop_name.localeCompare(b.shop_name)
  );

  return (
    <Box mb={2} mt={2}>
      {showForm ? (
        <>
          <TextField
            label="नई दुकान का नाम लिखे"
            value={newShopName}
            onChange={(e) => setNewShopName(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="मोबाइल नंबर "
            value={newShopMobile}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
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
            disabled={!newShopName || !villageId}
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
            getOptionLabel={(option) => option.shop_name}
            renderInput={(params) => (
              <TextField {...params} label="दुकान खोजें" />
            )}
            onChange={(event, newValue) => {
              if (newValue) {
                setSelectedShopId(newValue.id);
                setSelectedShopName(newValue.shop_name);
                setShowTransactionForm(true);
                const result = calculateShopResult(newValue);
                console.log("Initial calculated result:", result);
                setCalculatedResult(result);
                setTimeout(() => {
                  window.scrollTo({
                    top: document.documentElement.scrollHeight,
                    behavior: "smooth",
                  });
                }, 100);
              } else {
                setSelectedShopId("");
                setSelectedShopName("");
                setShowTransactionForm(false);
                setCalculatedResult(null);
              }
            }}
            fullWidth
          />
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mt={2}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={() => setShowForm(true)}
              disabled={!villageId}
            >
              नई दुकान जोड़े
            </Button>
            {calculatedResult !== null && (
              <Typography variant="h6">
                बकाया: ₹{calculatedResult.toFixed(2)}
              </Typography>
            )}
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
        />
      )}
    </Box>
  );
}


// "use client";

// import { useState, useEffect } from "react";
// import {
//   Box,
//   Select,
//   MenuItem,
//   InputLabel,
//   FormControl,
//   Button,
//   TextField,
//   Typography,
// } from "@mui/material";
// import supabaseClient from "../../utils/supabaseClient";
// import TransactionForm from "./TransactionForm";

// export default function ShopSelect({
//   shops,
//   villageId,
//   villageName,
//   setShops,
//   routeId,
// }) {
//   const [selectedShopId, setSelectedShopId] = useState("");
//   const [selectedShopName, setSelectedShopName] = useState("");
//   const [newShopName, setNewShopName] = useState("");
//   const [newShopMobile, setNewShopMobile] = useState("");
//   const [showForm, setShowForm] = useState(false);
//   const [showTransactionForm, setShowTransactionForm] = useState(false);
//   const [quantity, setQuantity] = useState("");
//   const [rate, setRate] = useState("");
//   const [cash, setCash] = useState("");
//   const [old, setOld] = useState("");
//   const [total, setTotal] = useState(0);
//   const [remaining, setRemaining] = useState(0);

//   useEffect(() => {
//     setSelectedShopId("");
//     setSelectedShopName("");
//     setShowTransactionForm(false);
//   }, [villageId, routeId]);

//   const fetchShops = async () => {
//     const { data, error } = await supabaseClient
//       .from("Shops Table")
//       .select("*")
//       .eq("village_id", villageId);
//     if (error) {
//       console.error("Error fetching shops:", error);
//     } else {
//       setShops(data);
//     }
//   };

//   const addShop = async () => {
//     const mobileNumber = newShopMobile ? parseInt(newShopMobile, 10) : null;
    
//     const newShopData = {
//       shop_name: newShopName,
//       village_id: villageId,
//       route_id: null,
//       total_quantity: null,
//       total: null,
//       total_cash: null,
//       total_old: null,
//       village_name: null, // You might want to fill this if you have the village name
//       mob_number: mobileNumber
//     };
//      console.log(newShopData);

//     const { data, error } = await supabaseClient
//       .from('Shops Table')
//       .insert([newShopData]);
    
//     if (error) {
//       console.error('Error adding shop:', error);
//     } else {
//       await fetchShops();
//     }
//     setNewShopName('');
//     setNewShopMobile('');
//     setShowForm(false);
//   };

//   // ... (rest of the code remains the same)
//   const handleShopChange = (event) => {
//     const selectedShop = shops.find((shop) => shop.id === event.target.value);
//     setSelectedShopId(event.target.value);
//     setSelectedShopName(selectedShop.shop_name);
//     setShowTransactionForm(true);

//     // Scroll to bottom of the page
//     setTimeout(() => {
//       window.scrollTo({
//         top: document.documentElement.scrollHeight,
//         behavior: "smooth",
//       });
//     }, 100);
//   };

//   const handleSubmit = async () => {
//     if (!quantity || !rate || !cash || !old) {
//       alert("Please fill out all fields");
//       return;
//     }

//     const { data, error } = await supabaseClient.from("Transactions").insert([
//       {
//         shop_id: selectedShopId,
//         quantity,
//         rate,
//         cash,
//         old,
//         created_at: new Date().toISOString(),
//       },
//     ]);

//     if (error) {
//       console.error("Error submitting transaction:", error);
//     } else {
//       alert("Transaction submitted successfully");
//       setSelectedShopId("");
//       setQuantity("");
//       setRate("");
//       setCash("");
//       setOld("");
//       setShowTransactionForm(false);
//     }
//   };

//   useEffect(() => {
//     const quantityValue = parseFloat(quantity) || 0;
//     const rateValue = parseFloat(rate) || 0;
//     const cashValue = parseFloat(cash) || 0;
//     const totalValue = quantityValue * rateValue;
//     setTotal(totalValue);
//     setRemaining(totalValue - cashValue);
//   }, [quantity, rate, cash]);

//   // Sort shops alphabetically
//   const sortedShops = [...shops].sort((a, b) =>
//     a.shop_name.localeCompare(b.shop_name)
//   );

//   return (
//     <Box mb={2} mt={2}>
//       {showForm ? (
//         <>
//           <TextField
//             label="नई दुकान का नाम लिखे"
//             value={newShopName}
//             onChange={(e) => setNewShopName(e.target.value)}
//             fullWidth
//             margin="normal"
//             required
//           />
//           <TextField
//             label="मोबाइल नंबर "
//             value={newShopMobile}
//             onChange={(e) => {
//               const value = e.target.value.replace(/\D/g, ""); // Remove non-digit characters
//               setNewShopMobile(value);
//             }}
//             fullWidth
//             margin="normal"
//             type="tel" // This suggests a telephone number input to browsers
//             inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }} // These make the mobile keyboard numeric
//           />
//           <Button
//             variant="contained"
//             color="primary"
//             onClick={addShop}
//             disabled={!newShopName || !villageId}
//           >
//             दुकान जोड़े
//           </Button>
//           <Button
//             variant="outlined"
//             color="secondary"
//             onClick={() => setShowForm(false)}
//             style={{ marginLeft: 8 }}
//           >
//             Cancel / रद्द करे
//           </Button>
//         </>
//       ) : (
//         <>
//           <FormControl fullWidth>
//             <InputLabel id="shop-select-label">दुकान का नाम चुने</InputLabel>
//             <Select
//               labelId="shop-select-label"
//               value={selectedShopId}
//               onChange={handleShopChange}
//             >
//               {sortedShops.map((shop) => (
//                 <MenuItem key={shop.id} value={shop.id}>
//                   {shop.shop_name}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//           <Button
//             variant="contained"
//             color="primary"
//             onClick={() => setShowForm(true)}
//             style={{ marginTop: 8 }}
//             disabled={!villageId}
//           >
//             नई दुकान जोड़े
//           </Button>
//         </>
//       )}

//       {showTransactionForm && (
//         <TransactionForm
//           shopId={selectedShopId}
//           villageName={villageName}
//           routeId={routeId}
//           shopName={selectedShopName}
//           quantity={quantity}
//           setQuantity={setQuantity}
//           rate={rate}
//           setRate={setRate}
//           cash={cash}
//           setCash={setCash}
//           old={old}
//           setOld={setOld}
//           total={total}
//           remaining={remaining}
//           handleSubmit={handleSubmit}
//         />
//       )}
//     </Box>
//   );
// }

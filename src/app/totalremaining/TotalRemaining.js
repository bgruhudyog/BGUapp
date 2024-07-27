"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Select,
  MenuItem,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import supabaseClient from "../../utils/supabaseClient";

export default function TotalRemaining() {
  const [routes, setRoutes] = useState([]);
  const [selectedRouteId, setSelectedRouteId] = useState("");
  const [shopData, setShopData] = useState([]);

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    const { data, error } = await supabaseClient
      .from("Routes Table")
      .select("*");
    if (error) console.error("Error fetching routes:", error);
    else setRoutes(data);
  };

  const handleRouteChange = async (event) => {
    const routeId = event.target.value;
    setSelectedRouteId(routeId);
    fetchShopData(routeId);
  };

  const fetchShopData = async (routeId) => {
    const { data, error } = await supabaseClient
      .from("Shops Table")
      .select(
        "id, shop_name, village_name, total_quantity, total, total_cash, total_old"
      )
      .eq("route_id", routeId);

    if (error) console.error("Error fetching shop data:", error);
    else {
      const sortedData = data.sort((a, b) => {
        const remainingA = calculateTotalRemaining(
          a.total,
          a.total_cash,
          a.total_old
        );
        const remainingB = calculateTotalRemaining(
          b.total,
          b.total_cash,
          b.total_old
        );
        return remainingB - remainingA;
      });
      setShopData(sortedData);
    }
  };

  const calculateTotalRemaining = (total, totalCash, totalOld) => {
    return (total || 0) - ((totalCash || 0) + (totalOld || 0));
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h6" gutterBottom align="center" sx={{ mb: 3 }}>
        Total Remaining by Route
      </Typography>
      <Box mb={2} sx={{ mx: 2 }}>
        <Select
          value={selectedRouteId}
          onChange={handleRouteChange}
          displayEmpty
          fullWidth
        >
          <MenuItem value="" disabled>
            Select a route
          </MenuItem>
          {routes.map((route) => (
            <MenuItem key={route.id} value={route.id}>
              {route.id}. {route.route_name}
            </MenuItem>
          ))}
        </Select>
      </Box>
      {shopData.length > 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>दुकान का नाम</TableCell>
                <TableCell align="right">कुल उधारी</TableCell>
                <TableCell align="right">कुल माल लिया</TableCell>
                <TableCell align="right">कुल बिक्री मूल्य</TableCell>
                <TableCell align="right">नदगी</TableCell>
                <TableCell align="right">उधारी जमा</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {shopData.map((shop) => {
                const totalRemaining = calculateTotalRemaining(
                  shop.total,
                  shop.total_cash,
                  shop.total_old
                );
                return (
                  <TableRow
                    key={shop.id}
                    sx={{
                      ...(totalRemaining === 0
                        ? {
                            "& > *": { borderColor: "green" },
                            "& td": { borderBottom: "2px solid green" },
                          }
                        : {
                            "& > *": { borderColor: "red" },
                            "& td": { borderBottom: "3px solid red" },
                          }),
                    }}
                  >
                    <TableCell>
                      {shop.shop_name}
                      <br />
                      <Typography variant="caption">
                        {shop.village_name}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      ₹{totalRemaining.toFixed(2)}
                    </TableCell>
                    <TableCell align="right">
                      {shop.total_quantity?.toFixed(2) || "0.00"} Kg
                    </TableCell>
                    <TableCell align="right">
                      ₹{shop.total?.toFixed(2) || "0.00"}
                    </TableCell>
                    <TableCell align="right">
                      ₹{shop.total_cash?.toFixed(2) || "0.00"}
                    </TableCell>
                    <TableCell align="right">
                      ₹{shop.total_old?.toFixed(2) || "0.00"}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}



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
  IconButton,
} from "@mui/material";
import PhoneIcon from '@mui/icons-material/Phone';
import supabaseClient from "../../utils/supabaseClient";
import { useMediaQuery, useTheme, Card, CardContent, Collapse } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';





export default function TotalRemainingPage() {
  const [routes, setRoutes] = useState([]);
  const [selectedRouteId, setSelectedRouteId] = useState("");
  const [shopData, setShopData] = useState([]);

  const theme = useTheme();
const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
const [expandedRow, setExpandedRow] = useState(null);
const toggleRow = (shopId) => {
  setExpandedRow(expandedRow === shopId ? null : shopId);
};
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
        "id, shop_name, village_name, total_quantity, total, total_cash, total_old, mob_number"
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

  const handleCall = (phoneNumber) => {
    window.open(`tel:${phoneNumber}`, '_self');
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
        isMobile ? (
          // Mobile view
          shopData.map((shop) => {
            const totalRemaining = calculateTotalRemaining(
              shop.total,
              shop.total_cash,
              shop.total_old
            );
            return (
              <Card key={shop.id} sx={{ mb: 2, borderColor: totalRemaining === 0 ? 'green' : 'red', borderWidth: 2, borderStyle: 'solid' }}>
                <CardContent>
                  <Typography variant="subtitle1">{shop.shop_name}</Typography>
                  <Typography variant="caption">{shop.village_name}</Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                    <Typography variant="body2">कुल उधारी: ₹{totalRemaining.toFixed(2)}</Typography>
                    {shop.mob_number && (
                      <IconButton
                        color="primary"
                        onClick={() => handleCall(shop.mob_number)}
                        aria-label={`Call ${shop.shop_name}`}
                      >
                        <PhoneIcon />
                      </IconButton>
                    )}
                  </Box>
                  <IconButton onClick={() => toggleRow(shop.id)} size="small">
                    {expandedRow === shop.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </IconButton>
                </CardContent>
                <Collapse in={expandedRow === shop.id}>
                  <CardContent>
                    <Typography variant="body2">कुल माल लिया: {shop.total_quantity?.toFixed(2) || "0.00"} Kg</Typography>
                    <Typography variant="body2">कुल बिक्री मूल्य: ₹{shop.total?.toFixed(2) || "0.00"}</Typography>
                    <Typography variant="body2">नदगी: ₹{shop.total_cash?.toFixed(2) || "0.00"}</Typography>
                    <Typography variant="body2">उधारी जमा: ₹{shop.total_old?.toFixed(2) || "0.00"}</Typography>
                  </CardContent>
                </Collapse>
              </Card>
            );
          })
        ) : (
          // Desktop view
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>दुकान का नाम</TableCell>
                  <TableCell align="right">कुल उधारी</TableCell>
                  <TableCell align="right">कॉल करें</TableCell>
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
                        {shop.mob_number && (
                          <IconButton
                            color="primary"
                            onClick={() => handleCall(shop.mob_number)}
                            aria-label={`Call ${shop.shop_name}`}
                          >
                            <PhoneIcon />
                          </IconButton>
                        )}
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
        )
      )}
    </Box>
  );
}

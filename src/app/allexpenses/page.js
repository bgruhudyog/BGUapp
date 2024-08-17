"use client";
import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Grid, Select, MenuItem, Box, Button } from '@mui/material';
import supabaseClient from "../../utils/supabaseClient";

const supabase = supabaseClient;

export default function AllExpenses() {
  const [viewType, setViewType] = useState('daily');
  const [timeFrame, setTimeFrame] = useState(new Date().toISOString().slice(0, 7));
  const [expenses, setExpenses] = useState([]);
  const [totalExpenses, setTotalExpenses] = useState(0);

  useEffect(() => {
    fetchExpenses();
  }, [viewType, timeFrame]);

  const fetchExpenses = async () => {
    let startDate, endDate;
    if (viewType === 'daily') {
      startDate = `${timeFrame}-01`;
      endDate = `${timeFrame}-31`;
    } else {
      const now = new Date();
      startDate = `${now.getFullYear()}-01-01`;
      endDate = `${now.getFullYear()}-12-31`;
    }

    try {
      let { data, error } = await supabase
        .from('Expense_Table')
        .select('*')
        .gte('created_at', startDate)
        .lte('created_at', endDate)
        .order('created_at', { ascending: true });

      if (error) throw error;

      processData(data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  const processData = (data) => {
    const groupedExpenses = data.reduce((acc, expense) => {
      const date = expense.created_at ? new Date(expense.created_at).toISOString().split('T')[0] : 'Unknown Date';
      const key = viewType === 'daily' ? date : date.slice(0, 7);

      if (!acc[key]) {
        acc[key] = { expenses: {}, otherExpenses: [], total: 0 };
      }

      Object.entries(expense).forEach(([expenseKey, value]) => {
        if (['created_at', 'id', 'o_e_reason'].includes(expenseKey)) return;

        if (expenseKey === 'other_expenses') {
          acc[key].otherExpenses.push({
            amount: Number(value) || 0,
            reason: expense.o_e_reason || 'No reason provided'
          });
        } else {
          acc[key].expenses[expenseKey] = (acc[key].expenses[expenseKey] || 0) + (Number(value) || 0);
        }
      });

      acc[key].total = Object.values(acc[key].expenses).reduce((sum, val) => sum + val, 0) +
                       acc[key].otherExpenses.reduce((sum, { amount }) => sum + amount, 0);

      return acc;
    }, {});

    const formattedExpenses = Object.entries(groupedExpenses).map(([key, data]) => ({
      date: key,
      ...data
    }));

    setExpenses(formattedExpenses);
    setTotalExpenses(formattedExpenses.reduce((sum, item) => sum + item.total, 0));
  };

  const handleDelete = async (date) => {
    try {
      const { error } = await supabase
        .from('Expense_Table')
        .delete()
        .eq('created_at', date);

      if (error) throw error;

      fetchExpenses(); // Refresh the data
    } catch (error) {
      console.error('Error deleting expenses:', error);
    }
  };

  const expenseLabels = {
    chai_pani: "Chai Pani",
    gas_expense: "Gas",
    petrol_expense: "Petrol",
    toll_expense: "Toll Tax",
    servicing_expense: "Servicing",
    packing_expense: "Packing",
    stickerandpoly_expense: "Sticker & Poly",
    carrying_expense: "Carrying",
    yogendra_salary_expense: "Yogendra Salary",
    bharat_salary_expense: "Bharat Salary",
    raj_salary: "Rajyavardhan Salary"
  };

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

  const formatDate = (dateString) => {
    const [year, month] = dateString.split('-');
    return `${monthNames[parseInt(month) - 1]}-${year}`;
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" align="center" gutterBottom>
       कुल हिसाब
      </Typography>
      <Box sx={{ mb: 2 }}>
        <Select
          value={viewType}
          onChange={(e) => setViewType(e.target.value)}
          sx={{ mr: 2 }}
        >
          <MenuItem value="daily">दैनिक </MenuItem>
          <MenuItem value="monthly">मासिक </MenuItem>
        </Select>
        {viewType === 'daily' && (
          <Select
            value={timeFrame}
            onChange={(e) => setTimeFrame(e.target.value)}
          >
            {[...Array(12)].map((_, i) => {
              const d = new Date();
              d.setMonth(d.getMonth() - i);
              const value = d.toISOString().slice(0, 7);
              return <MenuItem key={i} value={value}>{monthNames[d.getMonth()]} {d.getFullYear()}</MenuItem>;
            })}
          </Select>
        )}
      </Box>

      <Paper elevation={4} sx={{ p: 3, mb: 3,borderRadius: 3 }}>
        <Typography variant="h6">
           {viewType === 'daily' ? formatDate(timeFrame) : 'Year'}: ₹{totalExpenses.toFixed(2)} का कुल खर्च 
        </Typography>
      </Paper>

      <Grid container spacing={2}>
        {expenses.map((expenseItem, index) => (
          <Grid item xs={12} key={index}>
            <Paper elevation={4} sx={{ p: 3, mb: 3,borderRadius: 3 }}>
              <Typography variant="h6">
                {viewType === 'daily' 
                  ? `Date: ${expenseItem.date === 'Unknown Date' ? expenseItem.date : new Date(expenseItem.date).toLocaleDateString()}`
                  : `Month: ${formatDate(expenseItem.date)}`
                }
              </Typography>
              <Grid container spacing={1}>
                {Object.entries(expenseItem.expenses).map(([key, value]) => (
                  value > 0 && (
                    <Grid item xs={6} sm={4} md={3} key={key}>
                      <Typography>
                        {expenseLabels[key] || key}: ₹{value.toFixed(2)}
                      </Typography>
                    </Grid>
                  )
                ))}
                {expenseItem.otherExpenses.map((otherExpense, idx) => (
                  <Grid item xs={12} key={`other-${idx}`}>
                    <Typography>
                    अन्य खर्च : ₹{otherExpense.amount.toFixed(2)} - {otherExpense.reason}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
              <Typography sx={{ mt: 1 }}>
                <strong>कुल: ₹{expenseItem.total.toFixed(2)}</strong>
              </Typography>
              {viewType === 'daily' && expenseItem.date !== 'Unknown Date' && (
                <Button 
                  variant="contained" 
                  color="secondary" 
                  sx={{ mt: 1 }}
                  onClick={() => handleDelete(expenseItem.date)}
                >
                  Delete करे 
                </Button>
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

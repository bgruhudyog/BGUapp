// "use client";
// import React, { useState, useEffect } from 'react';
// import { Container, Typography, Paper, Grid, Select, MenuItem, Box, Button } from '@mui/material';
// import supabaseClient from "../../utils/supabaseClient";
// import { PieChart } from '@mui/x-charts';
// const supabase = supabaseClient;


// export default function AllExpenses() {
//     const [showPieChart, setShowPieChart] = useState(false);
//   const [viewType, setViewType] = useState('daily');
//   const [timeFrame, setTimeFrame] = useState(new Date().toISOString().slice(0, 7));
//   const [expenses, setExpenses] = useState([]);
//   const [totalExpenses, setTotalExpenses] = useState(0);
//   const [pieChartData, setPieChartData] = useState([]);

//   const formatDateDMY = (dateString) => {
//     const date = new Date(dateString);
//     const day = date.getDate().toString().padStart(2, '0');
//     const month = (date.getMonth() + 1).toString().padStart(2, '0'); // getMonth() is zero-indexed
//     const year = date.getFullYear();
//     return `${day}/${month}/${year}`;
//   };
//   useEffect(() => {
//     fetchExpenses();
//   }, [viewType, timeFrame]);

//   const fetchExpenses = async () => {
//     let startDate, endDate;
//     if (viewType === 'daily') {
//       startDate = `${timeFrame}-01`;
//       endDate = `${timeFrame}-31`;
//     } else {
//       const now = new Date();
//       startDate = `${now.getFullYear()}-01-01`;
//       endDate = `${now.getFullYear()}-12-31`;
//     }
  
//     try {
//       console.log('Fetching expenses...'); // Add this line
//       console.log('Start date:', startDate, 'End date:', endDate); // Add this line
//       let { data, error } = await supabase
//         .from('Expense_Table')
//         .select('*')
//         .gte('created_at', startDate)
//         .lte('created_at', endDate)
//         .order('created_at', { ascending: true });
  
//       if (error) {
//         console.error('Supabase error:', error); // Add this line
//         throw error;
//       }
  
//       console.log('Fetched data:', data); // Add this line
//       processData(data);
//     } catch (error) {
//       console.error('Error fetching expenses:', error);
//       // You might want to set an error state here to display to the user
//       setExpenses([]);
//       setTotalExpenses(0);
//     }
//   };
//   const processData = (data) => {
//     const groupedExpenses = data.reduce((acc, expense) => {
//         const date = expense.created_at ? new Date(expense.created_at).toISOString().split('T')[0] : 'Unknown Date';
//         const key = viewType === 'daily' ? date : date.slice(0, 7);
    
//         if (!acc[key]) {
//             acc[key] = { 
//               expenses: {},
//               otherExpenses: [],
//               total: 0,
//               carExpenses: 0,
//               mirchExpenses: 0,
//               salaryExpenses: 0,
//               otherExpensesTotal: 0,
//               chaiPaaniExpenses: 0  // Add this line
//             };
//         }
    
//         Object.entries(expense).forEach(([expenseKey, value]) => {
//           if (['created_at', 'id', 'o_e_reason'].includes(expenseKey)) return;
    
//           const numValue = Number(value) || 0;
    
//           if (expenseKey === 'other_expenses') {
//             acc[key].otherExpenses.push({
//               amount: numValue,
//               reason: expense.o_e_reason || 'No reason provided'
//             });
//             acc[key].otherExpensesTotal += numValue;
//           } else {
//             acc[key].expenses[expenseKey] = (acc[key].expenses[expenseKey] || 0) + numValue;
    
//             // Categorize expenses
//             if (['gas_expense', 'petrol_expense', 'toll_expense', 'servicing_expense'].includes(expenseKey)) {
//               acc[key].carExpenses += numValue;
//             } else if (['packing_expense', 'stickerandpoly_expense', 'carrying_expense'].includes(expenseKey)) {
//               acc[key].mirchExpenses += numValue;
//             } else if (['yogendra_salary_expense', 'bharat_salary_expense', 'raj_salary'].includes(expenseKey)) {
//               acc[key].salaryExpenses += numValue;
//             } else if (expenseKey === 'chai_pani') {  // Add this condition
//                 acc[key].chaiPaaniExpenses += numValue;
//               }
//           }
//         });
    
//         acc[key].total = Object.values(acc[key].expenses).reduce((sum, val) => sum + val, 0) +
//                          acc[key].otherExpensesTotal;
    
//         return acc;
//       }, {});

//       const formattedExpenses = Object.entries(groupedExpenses).map(([key, data]) => ({
//         date: key,
//         ...data
//     }));

//     // Sort the expenses in reverse chronological order
//   formattedExpenses.sort((a, b) => new Date(b.date) - new Date(a.date));

//   setExpenses(formattedExpenses);
//   setTotalExpenses(formattedExpenses.reduce((sum, item) => sum + item.total, 0));

//     // Calculate totals for pie chart
//     const totalCarExpenses = formattedExpenses.reduce((sum, item) => sum + item.carExpenses, 0);
//     const totalMirchExpenses = formattedExpenses.reduce((sum, item) => sum + item.mirchExpenses, 0);
//     const totalSalaryExpenses = formattedExpenses.reduce((sum, item) => sum + item.salaryExpenses, 0);
//     const totalOtherExpenses = formattedExpenses.reduce((sum, item) => sum + item.otherExpensesTotal, 0);
//     const totalChaiPaaniExpenses = formattedExpenses.reduce((sum, item) => sum + item.chaiPaaniExpenses, 0);

//     setPieChartData([
//       { id: 0, value: totalCarExpenses, label: 'Car' },
//       { id: 1, value: totalMirchExpenses, label: 'Mirch' },
//       { id: 2, value: totalSalaryExpenses, label: 'Salary' },
//       { id: 3, value: totalOtherExpenses, label: 'Other' },
//       { id: 4, value: totalChaiPaaniExpenses, label: 'Chai Paani' },
//     ]);
//   };

//   const handleDelete = async (date) => {
//     try {
//       const { error } = await supabase
//         .from('Expense_Table')
//         .delete()
//         .eq('created_at', date);

//       if (error) throw error;

//       fetchExpenses(); // Refresh the data
//     } catch (error) {
//       console.error('Error deleting expenses:', error);
//     }
//   };

//   const expenseLabels = {
//     chai_pani: "Chai Pani",
//     gas_expense: "Gas",
//     petrol_expense: "Petrol",
//     toll_expense: "Toll Tax",
//     servicing_expense: "Servicing",
//     packing_expense: "Packing",
//     stickerandpoly_expense: "Sticker & Poly",
//     carrying_expense: "Carrying",
//     yogendra_salary_expense: "Yogendra Salary",
//     bharat_salary_expense: "Bharat Salary",
//     raj_salary: "Rajyavardhan Salary"
//   };

//   const monthNames = ["January", "February", "March", "April", "May", "June",
//     "July", "August", "September", "October", "November", "December"];

//   const formatDate = (dateString) => {
//     const [year, month] = dateString.split('-');
//     return `${monthNames[parseInt(month) - 1]}-${year}`;
//   };

//   return (
//     <Container maxWidth="lg">
//       <Typography variant="h4" align="center" gutterBottom>
//        कुल हिसाब
//       </Typography>
//       <Box sx={{ mb: 2 }}>
//         <Select
//           value={viewType}
//           onChange={(e) => setViewType(e.target.value)}
//           sx={{ mr: 2 }}
//         >
//           <MenuItem value="daily">दैनिक </MenuItem>
//           <MenuItem value="monthly">मासिक </MenuItem>
//         </Select>
//         {viewType === 'daily' && (
//           <Select
//             value={timeFrame}
//             onChange={(e) => setTimeFrame(e.target.value)}
//           >
//             {[...Array(12)].map((_, i) => {
//               const d = new Date();
//               d.setMonth(d.getMonth() - i);
//               const value = d.toISOString().slice(0, 7);
//               return <MenuItem key={i} value={value}>{monthNames[d.getMonth()]} {d.getFullYear()}</MenuItem>;
//             })}
//           </Select>
//         )}
//       </Box>

      
//       <Paper elevation={4} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
//         <Typography variant="h5" gutterBottom>
//           {viewType === 'daily' ? formatDate(timeFrame) : 'Year'}: ₹{totalExpenses.toFixed(2)} का कुल खर्च 
//         </Typography>
//         {(viewType === 'monthly' || viewType === 'daily') && expenses.length > 0 && (
//           <>
//             <Grid container spacing={2} sx={{ mt: 2 }}>
//               <Grid item xs={12} sm={6}>
//                 <Typography variant="body1">
//                   Chai Paani expenses: ₹{pieChartData.find(item => item.label === 'Chai Paani').value.toFixed(2)}
//                 </Typography>
//                 <Typography variant="body1">
//                   Car related expenses: ₹{pieChartData.find(item => item.label === 'Car').value.toFixed(2)}
//                 </Typography>
//                 <Typography variant="body1">
//                   Mirch related expenses: ₹{pieChartData.find(item => item.label === 'Mirch').value.toFixed(2)}
//                 </Typography>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <Typography variant="body1">
//                   Salary related expenses: ₹{pieChartData.find(item => item.label === 'Salary').value.toFixed(2)}
//                 </Typography>
//                 <Typography variant="body1">
//                   Other expenses: ₹{pieChartData.find(item => item.label === 'Other').value.toFixed(2)}
//                 </Typography>
//               </Grid>
//             </Grid>
//             <Button onClick={() => setShowPieChart(!showPieChart)} sx={{ mt: 2 }}>
//               {showPieChart ? 'Hide' : 'Show'} Pie Chart
//             </Button>
//             {showPieChart && (
//               <Box sx={{ height: 300, width: '100%', mt: 2 }}>
//                 <PieChart
//                   series={[
//                     {
//                       data: pieChartData,
//                     },
//                   ]}
//                 />
//               </Box>
//             )}
//           </>
//         )}
//       </Paper>

//     <Grid container spacing={2}>
//       {expenses.map((expenseItem, index) => (
//         <Grid item xs={12} key={index}>
//           <Paper elevation={4} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
//           <Typography variant="h6" gutterBottom>
//   {viewType === 'daily' 
//     ? `Date: ${expenseItem.date === 'Unknown Date' ? expenseItem.date : formatDateDMY(expenseItem.date)}`
//     : `Month: ${formatDate(expenseItem.date)}`
//   }
// </Typography>
//             <Grid container spacing={2}>
//               {Object.entries(expenseItem.expenses).map(([key, value]) => (
//                 value > 0 && (
//                   <Grid item xs={6} sm={4} md={3} key={key}>
//                     <Typography variant="body2">
//                       <strong>{expenseLabels[key] || key}:</strong> ₹{value.toFixed(2)}
//                     </Typography>
//                   </Grid>
//                 )
//               ))}
//             </Grid>
//             {expenseItem.otherExpenses.length > 0 && (
//               <Box sx={{ mt: 2 }}>
//                 <Typography variant="subtitle1" gutterBottom>Other Expenses:</Typography>
//                 {expenseItem.otherExpenses.map((otherExpense, idx) => (
//                   <Typography variant="body2" key={`other-${idx}`}>
//                     ₹{otherExpense.amount.toFixed(2)} - {otherExpense.reason}
//                   </Typography>
//                 ))}
//               </Box>
//             )}
//             <Typography variant="h6" sx={{ mt: 2 }}>
//               कुल: ₹{expenseItem.total.toFixed(2)}
//             </Typography>
//             {viewType === 'daily' && expenseItem.date !== 'Unknown Date' && (
//               <Button 
//                 variant="contained" 
//                 color="secondary" 
//                 sx={{ mt: 2 }}
//                 onClick={() => handleDelete(expenseItem.date)}
//               >
//                 Delete करे 
//               </Button>
//             )}
//           </Paper>
//         </Grid>
//       ))}
//     </Grid>
//   </Container>
//   );
// }


"use client";
import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Grid, Select, MenuItem, Box, Button } from '@mui/material';
import supabaseClient from "../../utils/supabaseClient";
import { PieChart } from '@mui/x-charts';
const supabase = supabaseClient;

export default function AllExpenses() {
    const [showPieChart, setShowPieChart] = useState(false);
    const [viewType, setViewType] = useState('daily');
    const [timeFrame, setTimeFrame] = useState(new Date().toISOString().slice(0, 7));
    const [expenses, setExpenses] = useState([]);
    const [totalExpenses, setTotalExpenses] = useState(0);
    const [pieChartData, setPieChartData] = useState([]);

    const formatDateDMY = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // getMonth() is zero-indexed
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };
    
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
            console.log('खर्च लाना...'); // Add this line
            console.log('प्रारंभ तिथि:', startDate, 'समाप्ति तिथि:', endDate); // Add this line
            let { data, error } = await supabase
                .from('Expense_Table')
                .select('*')
                .gte('created_at', startDate)
                .lte('created_at', endDate)
                .order('created_at', { ascending: true });
    
            if (error) {
                console.error('Supabase त्रुटि:', error); // Add this line
                throw error;
            }
    
            console.log('लाए गए डेटा:', data); // Add this line
            processData(data);
        } catch (error) {
            console.error('खर्च लाने में त्रुटि:', error);
            // You might want to set an error state here to display to the user
            setExpenses([]);
            setTotalExpenses(0);
        }
    };
    
    const processData = (data) => {
        const groupedExpenses = data.reduce((acc, expense) => {
            const date = expense.created_at ? new Date(expense.created_at).toISOString().split('T')[0] : 'अज्ञात तिथि';
            const key = viewType === 'daily' ? date : date.slice(0, 7);
    
            if (!acc[key]) {
                acc[key] = { 
                    expenses: {},
                    otherExpenses: [],
                    total: 0,
                    carExpenses: 0,
                    mirchExpenses: 0,
                    salaryExpenses: 0,
                    otherExpensesTotal: 0,
                    chaiPaaniExpenses: 0  // Add this line
                };
            }
    
            Object.entries(expense).forEach(([expenseKey, value]) => {
                if (['created_at', 'id', 'o_e_reason'].includes(expenseKey)) return;
    
                const numValue = Number(value) || 0;
    
                if (expenseKey === 'other_expenses') {
                    acc[key].otherExpenses.push({
                        amount: numValue,
                        reason: expense.o_e_reason || 'कोई कारण नहीं बताया गया'
                    });
                    acc[key].otherExpensesTotal += numValue;
                } else {
                    acc[key].expenses[expenseKey] = (acc[key].expenses[expenseKey] || 0) + numValue;
    
                    // Categorize expenses
                    if (['gas_expense', 'petrol_expense', 'toll_expense', 'servicing_expense'].includes(expenseKey)) {
                        acc[key].carExpenses += numValue;
                    } else if (['packing_expense', 'stickerandpoly_expense', 'carrying_expense'].includes(expenseKey)) {
                        acc[key].mirchExpenses += numValue;
                    } else if (['yogendra_salary_expense', 'bharat_salary_expense', 'raj_salary'].includes(expenseKey)) {
                        acc[key].salaryExpenses += numValue;
                    } else if (expenseKey === 'chai_pani') {  // Add this condition
                        acc[key].chaiPaaniExpenses += numValue;
                    }
                }
            });
    
            acc[key].total = Object.values(acc[key].expenses).reduce((sum, val) => sum + val, 0) +
                             acc[key].otherExpensesTotal;
    
            return acc;
        }, {});
    
        const formattedExpenses = Object.entries(groupedExpenses).map(([key, data]) => ({
            date: key,
            ...data
        }));
    
        // Sort the expenses in reverse chronological order
        formattedExpenses.sort((a, b) => new Date(b.date) - new Date(a.date));
    
        setExpenses(formattedExpenses);
        setTotalExpenses(formattedExpenses.reduce((sum, item) => sum + item.total, 0));
    
        // Calculate totals for pie chart
        const totalCarExpenses = formattedExpenses.reduce((sum, item) => sum + item.carExpenses, 0);
        const totalMirchExpenses = formattedExpenses.reduce((sum, item) => sum + item.mirchExpenses, 0);
        const totalSalaryExpenses = formattedExpenses.reduce((sum, item) => sum + item.salaryExpenses, 0);
        const totalOtherExpenses = formattedExpenses.reduce((sum, item) => sum + item.otherExpensesTotal, 0);
        const totalChaiPaaniExpenses = formattedExpenses.reduce((sum, item) => sum + item.chaiPaaniExpenses, 0);
    
        setPieChartData([
            { id: 0, value: totalCarExpenses, label: 'कार' },
            { id: 1, value: totalMirchExpenses, label: 'मिर्च' },
            { id: 2, value: totalSalaryExpenses, label: 'वेतन' },
            { id: 3, value: totalOtherExpenses, label: 'अन्य' },
            { id: 4, value: totalChaiPaaniExpenses, label: 'चाय पानी' },
        ]);
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
            console.error('खर्च हटाने में त्रुटि:', error);
        }
    };

    const expenseLabels = {
        chai_pani: "चाय पानी",
        gas_expense: "गैस",
        petrol_expense: "पेट्रोल",
        toll_expense: "टोल टैक्स",
        servicing_expense: "सर्विसिंग",
        packing_expense: "पैकिंग",
        stickerandpoly_expense: "स्टिकर और पॉली",
        carrying_expense: "कैरींग",
        yogendra_salary_expense: "योगेंद्र वेतन",
        bharat_salary_expense: "भारत वेतन",
        raj_salary: "राजवर्धन वेतन"
    };

    const monthNames = ["जनवरी", "फरवरी", "मार्च", "अप्रैल", "मई", "जून",
        "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर"];

    const formatDate = (dateString) => {
        const [year, month] = dateString.split('-');
        return `${monthNames[parseInt(month) - 1]}-${year}`;
    };

    return (
        <Container maxWidth="lg">
            <Typography variant="h4" align="center" gutterBottom>
                कुल खर्च
            </Typography>
            <Box sx={{ mb: 2 }}>
                <Select
                    value={viewType}
                    onChange={(e) => setViewType(e.target.value)}
                    sx={{ mr: 2 }}
                >
                    <MenuItem value="daily">दैनिक</MenuItem>
                    <MenuItem value="monthly">मासिक</MenuItem>
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

            <Paper elevation={4} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
                <Typography variant="h5" gutterBottom>
                    {viewType === 'daily' ? formatDate(timeFrame) : 'वर्ष'}: ₹{totalExpenses.toFixed(2)} का कुल खर्च 
                </Typography>
                {(viewType === 'monthly' || viewType === 'daily') && expenses.length > 0 && (
                    <>
                        <Grid container spacing={2} sx={{ mt: 2 }}>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="body1">
                                    चाय पानी खर्च: ₹{pieChartData.find(item => item.label === 'चाय पानी').value.toFixed(2)}
                                </Typography>
                                <Typography variant="body1">
                                    कार संबंधित खर्च: ₹{pieChartData.find(item => item.label === 'कार').value.toFixed(2)}
                                </Typography>
                                <Typography variant="body1">
                                    मिर्च संबंधित खर्च: ₹{pieChartData.find(item => item.label === 'मिर्च').value.toFixed(2)}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="body1">
                                    वेतन संबंधित खर्च: ₹{pieChartData.find(item => item.label === 'वेतन').value.toFixed(2)}
                                </Typography>
                                <Typography variant="body1">
                                    अन्य खर्च: ₹{pieChartData.find(item => item.label === 'अन्य').value.toFixed(2)}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Button onClick={() => setShowPieChart(!showPieChart)} sx={{ mt: 2 }}>
                            {showPieChart ? 'छुपाएँ' : 'दिखाएँ'} पाई चार्ट
                        </Button>
                        {showPieChart && (
                            <Box sx={{ height: 300, width: '100%', mt: 2 }}>
                                <PieChart
                                    series={[
                                        {
                                            data: pieChartData,
                                        },
                                    ]}
                                />
                            </Box>
                        )}
                    </>
                )}
            </Paper>

            <Grid container spacing={2}>
                {expenses.map((expenseItem, index) => (
                    <Grid item xs={12} key={index}>
                        <Paper elevation={4} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                {viewType === 'daily' 
                                    ? `तारीख: ${expenseItem.date === 'अज्ञात तिथि' ? expenseItem.date : formatDateDMY(expenseItem.date)}`
                                    : `महीना: ${formatDate(expenseItem.date)}`
                                }
                            </Typography>
                            <Grid container spacing={2}>
                                {Object.entries(expenseItem.expenses).map(([key, value]) => (
                                    value > 0 && (
                                        <Grid item xs={6} sm={4} md={3} key={key}>
                                            <Typography variant="body2">
                                                <strong>{expenseLabels[key] || key}:</strong> ₹{value.toFixed(2)}
                                            </Typography>
                                        </Grid>
                                    )
                                ))}
                            </Grid>
                            {expenseItem.otherExpenses.length > 0 && (
                                <Box sx={{ mt: 2 }}>
                                    <Typography variant="subtitle1" gutterBottom>अन्य खर्च:</Typography>
                                    {expenseItem.otherExpenses.map((otherExpense, idx) => (
                                        <Typography variant="body2" key={`other-${idx}`}>
                                            ₹{otherExpense.amount.toFixed(2)} - {otherExpense.reason}
                                        </Typography>
                                    ))}
                                </Box>
                            )}
                            <Typography variant="h6" sx={{ mt: 2 }}>
                                कुल: ₹{expenseItem.total.toFixed(2)}
                            </Typography>
                            {viewType === 'daily' && expenseItem.date !== 'अज्ञात तिथि' && (
                                <Button 
                                    variant="contained" 
                                    color="secondary" 
                                    sx={{ mt: 2 }}
                                    onClick={() => handleDelete(expenseItem.date)}
                                >
                                    हटाएँ
                                </Button>
                            )}
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}

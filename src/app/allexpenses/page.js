

// "use client";
// import React, { useState, useEffect } from 'react';
// import { Container, Typography, Paper, Grid, Select, MenuItem, Box, Button, Card, CardContent, IconButton, Collapse } from '@mui/material';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import ExpandLessIcon from '@mui/icons-material/ExpandLess';
// import supabaseClient from "../../utils/supabaseClient";
// import { PieChart } from '@mui/x-charts';
// const supabase = supabaseClient;

// export default function AllExpenses() {
//     const [showPieChart, setShowPieChart] = useState(false);
//     const [viewType, setViewType] = useState('daily');
//     const [timeFrame, setTimeFrame] = useState(new Date().toISOString().slice(0, 7));
//     const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
//     const [expenses, setExpenses] = useState([]);
//     const [totalExpenses, setTotalExpenses] = useState(0);
//     const [pieChartData, setPieChartData] = useState([]);
//     const [expandedRow, setExpandedRow] = useState(null);

//     const formatDateDMY = (dateString) => {
//         const date = new Date(dateString);
//         const day = date.getDate().toString().padStart(2, '0');
//         const month = (date.getMonth() + 1).toString().padStart(2, '0');
//         const year = date.getFullYear();
//         return `${day}/${month}/${year}`;
//     };

//     useEffect(() => {
//         fetchExpenses();
//     }, [viewType, timeFrame, selectedYear]);

//     const fetchExpenses = async () => {
//         let startDate, endDate;
//         if (viewType === 'daily') {
//             startDate = `${timeFrame}-01`;
//             endDate = `${timeFrame}-31`;
//         } else {
//             startDate = `${selectedYear}-01-01`;
//             endDate = `${selectedYear}-12-31`;
//         }
    
//         try {
//             console.log('खर्च लाना...');
//             console.log('प्रारंभ तिथि:', startDate, 'समाप्ति तिथि:', endDate);
//             let { data, error } = await supabase
//                 .from('Expense_Table')
//                 .select('*')
//                 .gte('created_at', startDate)
//                 .lte('created_at', endDate)
//                 .order('created_at', { ascending: true });
    
//             if (error) {
//                 console.error('Supabase त्रुटि:', error);
//                 throw error;
//             }
    
//             console.log('लाए गए डेटा:', data);
//             processData(data);
//         } catch (error) {
//             console.error('खर्च लाने में त्रुटि:', error);
//             setExpenses([]);
//             setTotalExpenses(0);
//         }
//     };
    
//     const processData = (data) => {
//         const groupedExpenses = data.reduce((acc, expense) => {
//             const date = expense.created_at ? new Date(expense.created_at).toISOString().split('T')[0] : 'अज्ञात तिथि';
//             const key = viewType === 'daily' ? date : date.slice(0, 7);
    
//             if (!acc[key]) {
//                 acc[key] = { 
//                     expenses: {},
//                     otherExpenses: [],
//                     total: 0,
//                     carExpenses: 0,
//                     mirchExpenses: 0,
//                     salaryExpenses: 0,
//                     otherExpensesTotal: 0,
//                     chaiPaaniExpenses: 0  // Add this line
//                 };
//             }
    
//             Object.entries(expense).forEach(([expenseKey, value]) => {
//                 if (['created_at', 'id', 'o_e_reason'].includes(expenseKey)) return;
    
//                 const numValue = Number(value) || 0;
    
//                 if (expenseKey === 'other_expenses') {
//                     acc[key].otherExpenses.push({
//                         amount: numValue,
//                         reason: expense.o_e_reason || 'कोई कारण नहीं बताया गया'
//                     });
//                     acc[key].otherExpensesTotal += numValue;
//                 } else {
//                     acc[key].expenses[expenseKey] = (acc[key].expenses[expenseKey] || 0) + numValue;
    
//                     // Categorize expenses
//                     if (['gas_expense', 'petrol_expense', 'toll_expense', 'servicing_expense'].includes(expenseKey)) {
//                         acc[key].carExpenses += numValue;
//                     } else if (['packing_expense', 'stickerandpoly_expense', 'carrying_expense'].includes(expenseKey)) {
//                         acc[key].mirchExpenses += numValue;
//                     } else if (['yogendra_salary_expense', 'bharat_salary_expense', 'raj_salary'].includes(expenseKey)) {
//                         acc[key].salaryExpenses += numValue;
//                     } else if (expenseKey === 'chai_pani') {  // Add this condition
//                         acc[key].chaiPaaniExpenses += numValue;
//                     }
//                 }
//             });
    
//             acc[key].total = Object.values(acc[key].expenses).reduce((sum, val) => sum + val, 0) +
//                              acc[key].otherExpensesTotal;
    
//             return acc;
//         }, {});
    
//         const formattedExpenses = Object.entries(groupedExpenses).map(([key, data]) => ({
//             date: key,
//             ...data
//         }));
    
//         // Sort the expenses in reverse chronological order
//         formattedExpenses.sort((a, b) => new Date(b.date) - new Date(a.date));
    
//         setExpenses(formattedExpenses);
//         setTotalExpenses(formattedExpenses.reduce((sum, item) => sum + item.total, 0));
    
//         // Calculate totals for pie chart
//         const totalCarExpenses = formattedExpenses.reduce((sum, item) => sum + item.carExpenses, 0);
//         const totalMirchExpenses = formattedExpenses.reduce((sum, item) => sum + item.mirchExpenses, 0);
//         const totalSalaryExpenses = formattedExpenses.reduce((sum, item) => sum + item.salaryExpenses, 0);
//         const totalOtherExpenses = formattedExpenses.reduce((sum, item) => sum + item.otherExpensesTotal, 0);
//         const totalChaiPaaniExpenses = formattedExpenses.reduce((sum, item) => sum + item.chaiPaaniExpenses, 0);
    
//         setPieChartData([
//             { id: 0, value: totalCarExpenses, label: 'कार' },
//             { id: 1, value: totalMirchExpenses, label: 'मिर्च' },
//             { id: 2, value: totalSalaryExpenses, label: 'वेतन' },
//             { id: 3, value: totalOtherExpenses, label: 'अन्य' },
//             { id: 4, value: totalChaiPaaniExpenses, label: 'चाय पानी' },
//         ]);
//     };

//     const handleDelete = async (date) => {
//         try {
//             const { error } = await supabase
//                 .from('Expense_Table')
//                 .delete()
//                 .eq('created_at', date);
    
//             if (error) throw error;
    
//             fetchExpenses(); // Refresh the data
//         } catch (error) {
//             console.error('खर्च हटाने में त्रुटि:', error);
//         }
//     };

//     const expenseLabels = {
//         chai_pani: "चाय पानी",
//         gas_expense: "गैस",
//         petrol_expense: "पेट्रोल",
//         toll_expense: "टोल टैक्स",
//         servicing_expense: "सर्विसिंग",
//         packing_expense: "पैकिंग",
//         stickerandpoly_expense: "स्टिकर और पॉली",
//         carrying_expense: "कैरींग",
//         yogendra_salary_expense: "योगेंद्र वेतन",
//         bharat_salary_expense: "भारत वेतन",
//         raj_salary: "राजवर्धन वेतन"
//     };

//     const monthNames = ["जनवरी", "फरवरी", "मार्च", "अप्रैल", "मई", "जून",
//         "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर"];

//     const formatDate = (dateString) => {
//         const [year, month] = dateString.split('-');
//         return `${monthNames[parseInt(month) - 1]}-${year}`;
//     };

//     const toggleRow = (id) => {
//         setExpandedRow(expandedRow === id ? null : id);
//     };

//     return (
//         <Container maxWidth="lg">
//             <Typography variant="h4" align="center" gutterBottom>
//                 कुल खर्च
//             </Typography>
//             <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
//                 <Select
//                     value={viewType}
//                     onChange={(e) => setViewType(e.target.value)}
//                     sx={{ mr: 2 }}
//                 >
//                     <MenuItem value="daily">दैनिक</MenuItem>
//                     <MenuItem value="monthly">मासिक</MenuItem>
//                 </Select>
//                 {viewType === 'daily' ? (
//                     <Select
//                         value={timeFrame}
//                         onChange={(e) => setTimeFrame(e.target.value)}
//                     >
//                         {[...Array(12)].map((_, i) => {
//                             const d = new Date();
//                             d.setMonth(d.getMonth() - i);
//                             const value = d.toISOString().slice(0, 7);
//                             return <MenuItem key={i} value={value}>{monthNames[d.getMonth()]} {d.getFullYear()}</MenuItem>;
//                         })}
//                     </Select>
//                 ) : (
//                     <Select
//                         value={selectedYear}
//                         onChange={(e) => setSelectedYear(e.target.value)}
//                     >
//                         {[...Array(5)].map((_, i) => {
//                             const year = new Date().getFullYear() - i;
//                             return <MenuItem key={year} value={year}>{year}</MenuItem>;
//                         })}
//                     </Select>
//                 )}
//             </Box>

//             <Paper elevation={4} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
//                 <Typography variant="h5" gutterBottom>
//                     {viewType === 'daily' ? formatDate(timeFrame) : `वर्ष ${selectedYear}`}: ₹{totalExpenses.toFixed(2)} का कुल खर्च  
//                 </Typography>
//                 {(viewType === 'monthly' || viewType === 'daily') && expenses.length > 0 && (
//                     <>
//                         <Grid container spacing={2} sx={{ mt: 2 }}>
//                             <Grid item xs={12} sm={6}>
//                                 <Typography variant="body1">
//                                     चाय पानी खर्च: ₹{pieChartData.find(item => item.label === 'चाय पानी').value.toFixed(2)}
//                                 </Typography>
//                                 <Typography variant="body1">
//                                     कार संबंधित खर्च: ₹{pieChartData.find(item => item.label === 'कार').value.toFixed(2)}
//                                 </Typography>
//                                 <Typography variant="body1">
//                                     मिर्च संबंधित खर्च: ₹{pieChartData.find(item => item.label === 'मिर्च').value.toFixed(2)}
//                                 </Typography>
//                             </Grid>
//                             <Grid item xs={12} sm={6}>
//                                 <Typography variant="body1">
//                                     वेतन संबंधित खर्च: ₹{pieChartData.find(item => item.label === 'वेतन').value.toFixed(2)}
//                                 </Typography>
//                                 <Typography variant="body1">
//                                     अन्य खर्च: ₹{pieChartData.find(item => item.label === 'अन्य').value.toFixed(2)}
//                                 </Typography>
//                             </Grid>
//                         </Grid>
//                         <Button onClick={() => setShowPieChart(!showPieChart)} sx={{ mt: 2 }}>
//                              पाई चार्ट {showPieChart ? 'छुपाएँ' : 'दिखाएँ'}
//                         </Button>
//                         {showPieChart && (
//     <Box sx={{ height: 300, width: '100%', mt: 2 }}>
//         <PieChart
//             series={[
//                 {
//                     data: pieChartData,
//                     highlightScope: { faded: 'global', highlighted: 'item' },
//                     faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
//                 },
//             ]}
//             height={200}
//         />
//     </Box>
// )}
//                     </>
//                 )}
//             </Paper>

//             <Grid container spacing={2}>
//             {expenses.map((expenseItem, index) => (
//                     <Grid item xs={12} key={index}>
//                         <Card sx={{ mb: 2, position: 'relative', pb: 5 }}>
//                             <CardContent>
//                                 <Typography variant="subtitle1">
//                                     {viewType === 'daily' 
//                                         ? `तारीख: ${expenseItem.date === 'अज्ञात तिथि' ? expenseItem.date : formatDateDMY(expenseItem.date)}`
//                                         : `महीना: ${formatDate(expenseItem.date)}`
//                                     }
//                                 </Typography>
//                                 <Typography variant="h6">
//                                     कुल: ₹{expenseItem.total.toFixed(2)}
//                                 </Typography>
//                             </CardContent>
//                             <Collapse in={expandedRow === index}>
//                                 <CardContent>
//                                     <Grid container spacing={2}>
//                                         {Object.entries(expenseItem.expenses).map(([key, value]) => (
//                                             value > 0 && (
//                                                 <Grid item xs={6} sm={4} md={3} key={key}>
//                                                     <Typography variant="body2">
//                                                         <strong>{expenseLabels[key] || key}:</strong> ₹{value.toFixed(2)}
//                                                     </Typography>
//                                                 </Grid>
//                                             )
//                                         ))}
//                                     </Grid>
//                                     {expenseItem.otherExpenses.length > 0 && expenseItem.otherExpenses.some(expense => expense.amount > 0) && (
//                                         <Box sx={{ mt: 2 }}>
//                                             <Typography variant="subtitle1" gutterBottom>अन्य खर्च:</Typography>
//                                             {expenseItem.otherExpenses.map((otherExpense, idx) => (
//                                                 otherExpense.amount > 0 && (
//                                                     <Typography variant="body2" key={`other-${idx}`}>
//                                                         ₹{otherExpense.amount.toFixed(2)} - {otherExpense.reason}
//                                                     </Typography>
//                                                 )
//                                             ))}
//                                         </Box>
//                                     )}
//                                     {viewType === 'daily' && expenseItem.date !== 'अज्ञात तिथि' && (
//                                         <Button 
//                                             variant="contained" 
//                                             color="secondary" 
//                                             sx={{ mt: 2 }}
//                                             onClick={() => handleDelete(expenseItem.date)}
//                                         >
//                                             हटाएँ
//                                         </Button>
//                                     )}
//                                 </CardContent>
//                             </Collapse>
//                             <Box sx={{
//                                 position: 'absolute',
//                                 bottom: 0,
//                                 left: '50%',
//                                 transform: 'translateX(-50%)',
//                                 mb: 1
//                             }}>
//                                 <IconButton 
//                                     onClick={() => toggleRow(index)} 
//                                     size="small"
//                                     sx={{
//                                         backgroundColor: 'rgba(0, 0, 0, 0.04)',
//                                         '&:hover': {
//                                             backgroundColor: 'rgba(0, 0, 0, 0.08)',
//                                         }
//                                     }}
//                                 >
//                                     {expandedRow === index ? <ExpandLessIcon /> : <ExpandMoreIcon />}
//                                 </IconButton>
//                             </Box>
//                         </Card>
//                     </Grid>
//                 ))}
//             </Grid>
//         </Container>
//     );
// }

"use client";
import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Grid, Select, MenuItem, Box, Button, Card, CardContent, IconButton, Collapse } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import supabaseClient from "../../utils/supabaseClient";
import { PieChart } from '@mui/x-charts';
const supabase = supabaseClient;

export default function AllExpenses() {
    const [showPieChart, setShowPieChart] = useState(false);
    const [viewType, setViewType] = useState('daily');
    const [timeFrame, setTimeFrame] = useState(new Date().toISOString().slice(0, 7));
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [expenses, setExpenses] = useState([]);
    const [totalExpenses, setTotalExpenses] = useState(0);
    const [pieChartData, setPieChartData] = useState([]);
    const [expandedRow, setExpandedRow] = useState(null);

    const formatDateDMY = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };
 
    const getLastDayOfMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate();
    };

    useEffect(() => {
        fetchExpenses();
    }, [viewType, timeFrame, selectedYear]);

    const fetchExpenses = async () => {
        let startDate, endDate;
        if (viewType === 'daily') {
            const [year, month] = timeFrame.split('-');
            startDate = `${timeFrame}-01`;
            const lastDay = getLastDayOfMonth(parseInt(year), parseInt(month) - 1);
            endDate = `${timeFrame}-${lastDay}`;
        } else {
            startDate = `${selectedYear}-01-01`;
            endDate = `${selectedYear}-12-31`;
        }
    
        try {
            console.log('खर्च लाना...');
            console.log('प्रारंभ तिथि:', startDate, 'समाप्ति तिथि:', endDate);
            let { data, error } = await supabase
                .from('Expense_Table')
                .select('*')
                .gte('created_at', startDate)
                .lte('created_at', endDate)
                .order('created_at', { ascending: true });
    
            if (error) {
                console.error('Supabase त्रुटि:', error);
                throw error;
            }
    
            console.log('लाए गए डेटा:', data);
            processData(data);
        } catch (error) {
            console.error('खर्च लाने में त्रुटि:', error);
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

    const toggleRow = (id) => {
        setExpandedRow(expandedRow === id ? null : id);
    };

    return (
        <Container maxWidth="lg">
            <Typography variant="h4" align="center" gutterBottom>
                कुल खर्च
            </Typography>
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <Select
                    value={viewType}
                    onChange={(e) => setViewType(e.target.value)}
                    sx={{ mr: 2 }}
                >
                    <MenuItem value="daily">दैनिक</MenuItem>
                    <MenuItem value="monthly">मासिक</MenuItem>
                </Select>
                {viewType === 'daily' ? (
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
                ) : (
                    <Select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                    >
                        {[...Array(5)].map((_, i) => {
                            const year = new Date().getFullYear() - i;
                            return <MenuItem key={year} value={year}>{year}</MenuItem>;
                        })}
                    </Select>
                )}
            </Box>

            <Paper elevation={4} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
                <Typography variant="h5" gutterBottom>
                    {viewType === 'daily' ? formatDate(timeFrame) : `वर्ष ${selectedYear}`}: ₹{totalExpenses.toFixed(2)} का कुल खर्च  
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
                             पाई चार्ट {showPieChart ? 'छुपाएँ' : 'दिखाएँ'}
                        </Button>
                        {showPieChart && (
    <Box sx={{ height: 300, width: '100%', mt: 2 }}>
        <PieChart
            series={[
                {
                    data: pieChartData,
                    highlightScope: { faded: 'global', highlighted: 'item' },
                    faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                },
            ]}
            height={200}
        />
    </Box>
)}
                    </>
                )}
            </Paper>

            <Grid container spacing={2}>
            {expenses.map((expenseItem, index) => (
                    <Grid item xs={12} key={index}>
                        <Card sx={{ mb: 2, position: 'relative', pb: 5 }}>
                            <CardContent>
                                <Typography variant="subtitle1">
                                    {viewType === 'daily' 
                                        ? `तारीख: ${expenseItem.date === 'अज्ञात तिथि' ? expenseItem.date : formatDateDMY(expenseItem.date)}`
                                        : `महीना: ${formatDate(expenseItem.date)}`
                                    }
                                </Typography>
                                <Typography variant="h6">
                                    कुल: ₹{expenseItem.total.toFixed(2)}
                                </Typography>
                            </CardContent>
                            <Collapse in={expandedRow === index}>
                                <CardContent>
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
                                    {expenseItem.otherExpenses.length > 0 && expenseItem.otherExpenses.some(expense => expense.amount > 0) && (
                                        <Box sx={{ mt: 2 }}>
                                            <Typography variant="subtitle1" gutterBottom>अन्य खर्च:</Typography>
                                            {expenseItem.otherExpenses.map((otherExpense, idx) => (
                                                otherExpense.amount > 0 && (
                                                    <Typography variant="body2" key={`other-${idx}`}>
                                                        ₹{otherExpense.amount.toFixed(2)} - {otherExpense.reason}
                                                    </Typography>
                                                )
                                            ))}
                                        </Box>
                                    )}
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
                                </CardContent>
                            </Collapse>
                            <Box sx={{
                                position: 'absolute',
                                bottom: 0,
                                left: '50%',
                                transform: 'translateX(-50%)',
                                mb: 1
                            }}>
                                <IconButton 
                                    onClick={() => toggleRow(index)} 
                                    size="small"
                                    sx={{
                                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                        '&:hover': {
                                            backgroundColor: 'rgba(0, 0, 0, 0.08)',
                                        }
                                    }}
                                >
                                    {expandedRow === index ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                </IconButton>
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}

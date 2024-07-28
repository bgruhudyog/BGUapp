// "use client";
// // import { createTheme } from '@mui/material/styles';
// import { useState } from "react";
// import {
//   AppBar,
//   Toolbar,
//   IconButton,
//   Drawer as MuiDrawer,
//   List,
//   ListItem,
//   ListItemIcon,
//   ListItemText,
//   Box,
//   Typography,
//   CssBaseline,
//   Divider
// } from "@mui/material";
// import { ThemeProvider, createTheme } from '@mui/material/styles';
// import { styled } from '@mui/system';
// import MenuIcon from "@mui/icons-material/Menu";
// import CloseIcon from "@mui/icons-material/Close";
// import HomeIcon from "@mui/icons-material/Home";
// import CalculateIcon from "@mui/icons-material/Calculate";
// import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
// import Image from "next/image";
// import Link from "next/link";
// import { useRouter } from "next/navigation";

// // Create a theme
// const theme = createTheme({
//   palette: {
//     primary: {
//       main: '#FFA500', // Orange color, representing energy and enthusiasm
//       light: '#FFD700', // Light orange
//       dark: '#FF8C00', // Dark orange
//       contrastText: '#FFFFFF',
//     },
//     secondary: {
//       main: '#4CAF50', // Green color, representing growth and prosperity
//       light: '#81C784',
//       dark: '#388E3C',
//       contrastText: '#FFFFFF',
//     },
//     background: {
//       default: '#F5F5F5',
//       paper: '#FFFFFF',
//     },
//     text: {
//       primary: '#333333',
//       secondary: '#666666',
//     },
//   },
//   typography: {
//     fontFamily: 'Roboto, "Noto Sans Devanagari", Arial, sans-serif',
//     h1: {
//       fontSize: '2.5rem',
//       fontWeight: 500,
//     },
//     h2: {
//       fontSize: '2rem',
//       fontWeight: 500,
//     },
//     h3: {
//       fontSize: '1.8rem',
//       fontWeight: 500,
//     },
//     h4: {
//       fontSize: '1.6rem',
//       fontWeight: 500,
//     },
//     h5: {
//       fontSize: '1.4rem',
//       fontWeight: 500,
//     },
//     h6: {
//       fontSize: '1.2rem',
//       fontWeight: 500,
//     },
//     body1: {
//       fontSize: '1rem',
//     },
//     body2: {
//       fontSize: '0.875rem',
//     },
//   },
//   components: {
//     MuiAppBar: {
//       styleOverrides: {
//         root: {
//           backgroundColor: 'rgba(255, 255, 255, 0.8)',
//           boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
//         },
//       },
//     },
//     MuiDrawer: {
//       styleOverrides: {
//         paper: {
//           backgroundColor: '#FFFFFF',
//           boxShadow: '0 0 15px rgba(0,0,0,0.1)',
//         },
//       },
//     },
//     MuiButton: {
//       styleOverrides: {
//         root: {
//           borderRadius: '8px',
//           textTransform: 'none',
//           fontWeight: 500,
//         },
//       },
//     },
//     MuiCard: {
//       styleOverrides: {
//         root: {
//           borderRadius: '12px',
//           boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
//         },
//       },
//     },
//   },
// });

// // export default theme;
// // ... StyledDrawer, DrawerHeader, StyledListItem, drawerItems, and DrawerComponent definitions ...
// const StyledDrawer = styled(Box)(({ theme }) => ({
//   width: 280,
//   backgroundColor: theme.palette.background.paper,
//   height: '100%',
//   display: 'flex',
//   flexDirection: 'column',
//   boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.1)',
// }));

// const DrawerHeader = styled(Box)(({ theme }) => ({
//   display: 'flex',
//   justifyContent: 'space-between',
//   alignItems: 'center',
//   padding: theme.spacing(2),
//   backgroundColor: theme.palette.primary.main,
//   color: theme.palette.primary.contrastText,
// }));

// const StyledListItem = styled(ListItem)(({ theme }) => ({
//   margin: theme.spacing(0.5, 1),
//   borderRadius: theme.shape.borderRadius,
//   transition: 'background-color 0.3s, transform 0.2s',
//   '&:hover': {
//     backgroundColor: theme.palette.action.hover,
//     transform: 'translateX(5px)',
//   },
// }));

// const drawerItems = [
//   { text: 'Home', icon: <HomeIcon />, path: '/' },
//   { text: 'Calculator', icon: <CalculateIcon />, path: '/calculator' },
//   { text: 'उधारी रूट अनुसार', icon: <CurrencyRupeeIcon />, path: '/totalremaining' },
//   { text: 'दैनिक खर्च', icon: <CurrencyRupeeIcon />, path: '/expenses' },
// ];

// const DrawerComponent = ({ toggleDrawer }) => (
//   <StyledDrawer role="presentation">
//     <DrawerHeader>
//       <Typography variant="h6" sx={{ textAlign: 'center', fontWeight: 'bold' }}>
//         MENU
//       </Typography>
//       <IconButton onClick={toggleDrawer(false)} sx={{ color: 'inherit' }}>
//         <CloseIcon />
//       </IconButton>
//     </DrawerHeader>
//     <Divider />
//     <List sx={{ flexGrow: 1, overflowY: 'auto', py: 2 }}>
//       {drawerItems.map((item) => (
//         <Link
//           href={item.path}
//           key={item.text}
//           passHref
//           style={{ textDecoration: 'none', color: 'inherit' }}
//         >
//           <StyledListItem button onClick={toggleDrawer(false)}>
//             <ListItemIcon sx={{ color: 'primary.main', minWidth: 40 }}>{item.icon}</ListItemIcon>
//             <ListItemText
//               primary={item.text}
//               primaryTypographyProps={{
//                 fontSize: '0.9rem',
//                 fontWeight: 'medium',
//               }}
//             />
//           </StyledListItem>
//         </Link>
//       ))}
//     </List>
//     <Divider />
//     <Box sx={{ p: 2, textAlign: 'center' }}>
//       <Typography variant="body2" color="text.secondary">
//         © 2024 Balaji Gruh Udyog
//       </Typography>
//     </Box>
//   </StyledDrawer>
// );
// export default function RootLayout({ children }) {
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const router = useRouter();

//   const toggleDrawer = (open) => (event) => {
//     if (
//       event.type === "keydown" &&
//       (event.key === "Tab" || event.key === "Shift")
//     ) {
//       return;
//     }
//     setDrawerOpen(open);
//   };

//   const getCurrentDate = () => {
//     const options = {
//       weekday: "long",
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     };
//     const dateInEnglish = new Date().toLocaleDateString("en-US", options);
//     const dateInHindi = new Date().toLocaleDateString("hi-IN", options);

//     const dayInHindi = dateInHindi.split(",")[0];
//     const restOfDate = dateInEnglish.split(",").slice(1).join(",");

//     return `${dayInHindi},${restOfDate}`;
//   };

//   const handleLogoClick = () => {
//     router.push("/");
//   };

//   return (
//     <html lang="en">
//       <head>
//         <title>बालाजी गृह उद्योग</title>
//         <meta name="viewport" content="width=device-width, initial-scale=1" />
//         <link rel="icon" href="/favicon.ico" sizes="any" />
//         <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
//       </head>
//       <body>
//         <ThemeProvider theme={theme}>
//           <CssBaseline />
//           <AppBar
//             position="fixed"
//             sx={{
//               color: "black",
//               background:
//                 "linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0))",
//               backdropFilter: "blur(10px)",
//               WebkitBackdropFilter: "blur(10px)",
//             }}
//           >
//             <Toolbar sx={{ justifyContent: "space-between" }}>
//             <IconButton
//               size="large"
//               edge="start"
//               color="inherit"
//               aria-label="menu"
//               onClick={toggleDrawer(true)}
//             >
//               <MenuIcon />
//             </IconButton>
//             <Box
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 cursor: "pointer",
//               }}
//               onClick={handleLogoClick}
//             >
//               <Image
//                 src="/logo.jpg"
//                 alt="Balaji Gruh Udyog Logo"
//                 width={40}
//                 height={40}
//                 style={{ borderRadius: "20%" }}
//               />
//               <Box
//                 sx={{
//                   ml: 2,
//                   display: "flex",
//                   flexDirection: "column",
//                   alignItems: "center",
//                 }}
//               >
//                 <Typography variant="h6" component="div">
//                   बालाजी गृह उद्योग
//                 </Typography>
//                 <Typography variant="subtitle2" component="div">
//                   {getCurrentDate()}
//                 </Typography>
//               </Box>
//             </Box>
//             <Box sx={{ width: 48 }} />
//           </Toolbar>
//           </AppBar>
//           <MuiDrawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
//             <DrawerComponent toggleDrawer={toggleDrawer} />
//           </MuiDrawer>
//           <Box sx={{ marginTop: "64px" }}>{children}</Box>
//         </ThemeProvider>
//       </body>
//     </html>
//   );
// }

"use client";
import { useState, useMemo } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Drawer as MuiDrawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  CssBaseline,
  Divider,
  Switch,
  useMediaQuery,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { styled } from "@mui/system";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import HomeIcon from "@mui/icons-material/Home";
import CalculateIcon from "@mui/icons-material/Calculate";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Create a theme
const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === "light"
      ? {
          // Light mode
          primary: {
            main: "#3f51b5",
            light: "#757de8",
            dark: "#002984",
            contrastText: "#ffffff",
          },
          secondary: {
            main: "#f50057",
            light: "#ff4081",
            dark: "#c51162",
            contrastText: "#ffffff",
          },
          background: {
            default: "#f5f5f5",
            paper: "#ffffff",
          },
        }
      : {
          // Dark mode
          primary: {
            main: "#90caf9",
            light: "#e3f2fd",
            dark: "#42a5f5",
            contrastText: "#000000",
          },
          secondary: {
            main: "#f48fb1",
            light: "#ffc1e3",
            dark: "#bf5f82",
            contrastText: "#000000",
          },
          background: {
            default: "#303030",
            paper: "#424242",
          },
        }),
  },
  typography: {
    fontFamily: 'Roboto, "Noto Sans Devanagari", Arial, sans-serif',
    h1: {
      fontSize: "2.5rem",
      fontWeight: 500,
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 500,
    },
    h3: {
      fontSize: "1.8rem",
      fontWeight: 500,
    },
    h4: {
      fontSize: "1.6rem",
      fontWeight: 500,
    },
    h5: {
      fontSize: "1.4rem",
      fontWeight: 500,
    },
    h6: {
      fontSize: "1.2rem",
      fontWeight: 500,
    },
    body1: {
      fontSize: "1rem",
    },
    body2: {
      fontSize: "0.875rem",
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#FFFFFF",
          boxShadow: "0 0 15px rgba(0,0,0,0.1)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          textTransform: "none",
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        },
      },
    },
  },
});

// ... (keep the rest of the styled components and drawer items as is)
const StyledDrawer = styled(Box)(({ theme }) => ({
  width: 280,
  backgroundColor: theme.palette.background.paper,
  height: "100%",
  display: "flex",
  flexDirection: "column",
  boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.1)",
}));

const DrawerHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: theme.spacing(2),
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  margin: theme.spacing(0.5, 1),
  borderRadius: theme.shape.borderRadius,
  transition: "background-color 0.3s, transform 0.2s",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
    transform: "translateX(5px)",
  },
}));

const drawerItems = [
  { text: "Home", icon: <HomeIcon />, path: "/" },
  { text: "Calculator", icon: <CalculateIcon />, path: "/calculator" },
  {
    text: "उधारी रूट अनुसार",
    icon: <CurrencyRupeeIcon />,
    path: "/totalremaining",
  },
  { text: "दैनिक खर्च", icon: <CurrencyRupeeIcon />, path: "/expenses" },
];

const DrawerComponent = ({ toggleDrawer, mode, toggleColorMode }) => (
  <StyledDrawer role="presentation">
    <DrawerHeader>
      <Typography variant="h6" sx={{ textAlign: "center", fontWeight: "bold" }}>
        MENU
      </Typography>
      <IconButton onClick={toggleDrawer(false)} sx={{ color: "inherit" }}>
        <CloseIcon />
      </IconButton>
    </DrawerHeader>
    <Divider />
    <List sx={{ flexGrow: 1, overflowY: "auto", py: 2 }}>
      {drawerItems.map((item) => (
        <Link
          href={item.path}
          key={item.text}
          passHref
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <StyledListItem button onClick={toggleDrawer(false)}>
            <ListItemIcon sx={{ color: "primary.main", minWidth: 40 }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.text}
              primaryTypographyProps={{
                fontSize: "0.9rem",
                fontWeight: "medium",
              }}
            />
          </StyledListItem>
        </Link>
      ))}
      <StyledListItem>
        <ListItemIcon sx={{ color: "primary.main", minWidth: 40 }}>
          {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
        </ListItemIcon>
        <ListItemText primary="Dark Mode" />
        <Switch
          checked={mode === "dark"}
          onChange={toggleColorMode}
          color="primary"
        />
      </StyledListItem>
    </List>
    <Divider />
    <Box sx={{ p: 2, textAlign: "center" }}>
      <Typography variant="body2" color="text.secondary">
        © 2024 Balaji Gruh Udyog
      </Typography>
    </Box>
  </StyledDrawer>
);

export default function RootLayout({ children }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const router = useRouter();
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [mode, setMode] = useState(prefersDarkMode ? "dark" : "light");

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    []
  );

  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  // ... (keep the rest of the functions as is)

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const getCurrentDate = () => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const dateInEnglish = new Date().toLocaleDateString("en-US", options);
    const dateInHindi = new Date().toLocaleDateString("hi-IN", options);

    const dayInHindi = dateInHindi.split(",")[0];
    const restOfDate = dateInEnglish.split(",").slice(1).join(",");

    return `${dayInHindi},${restOfDate}`;
  };

  const handleLogoClick = () => {
    router.push("/");
  };

  return (
    <html lang="en">
      <head>
        <title>बालाजी गृह उद्योग</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AppBar
            position="fixed"
            sx={(theme) => ({
              color: theme.palette.mode === "dark" ? "white" : "black",
              background:
                theme.palette.mode === "dark"
                  ? "linear-gradient(135deg, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.9))"
                  : "linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0))",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
            })}
          >
            <Toolbar sx={{ justifyContent: "space-between" }}>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={toggleDrawer(true)}
              >
                <MenuIcon />
              </IconButton>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
                onClick={handleLogoClick}
              >
                <Image
                  src="/logo.jpg"
                  alt="Balaji Gruh Udyog Logo"
                  width={40}
                  height={40}
                  style={{ borderRadius: "20%" }}
                />
                <Box
                  sx={{
                    ml: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="h6" component="div">
                    बालाजी गृह उद्योग
                  </Typography>
                  <Typography variant="subtitle2" component="div">
                    {getCurrentDate()}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ width: 48 }} />
            </Toolbar>
          </AppBar>
          <MuiDrawer
            anchor="left"
            open={drawerOpen}
            onClose={toggleDrawer(false)}
          >
            <DrawerComponent
              toggleDrawer={toggleDrawer}
              mode={mode}
              toggleColorMode={colorMode.toggleColorMode}
            />
          </MuiDrawer>
          <Box sx={{ marginTop: "64px" }}>{children}</Box>
        </ThemeProvider>
      </body>
    </html>
  );
}

"use client";
// import { createTheme } from '@mui/material/styles';
import { useState } from "react";
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
  Divider 
} from "@mui/material";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { styled } from '@mui/system';
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import HomeIcon from "@mui/icons-material/Home";
import CalculateIcon from "@mui/icons-material/Calculate";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Create a theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#FFA500', // Orange color, representing energy and enthusiasm
      light: '#FFD700', // Light orange
      dark: '#FF8C00', // Dark orange
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#4CAF50', // Green color, representing growth and prosperity
      light: '#81C784',
      dark: '#388E3C',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F5F5F5',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
    },
  },
  typography: {
    fontFamily: 'Roboto, "Noto Sans Devanagari", Arial, sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    h3: {
      fontSize: '1.8rem',
      fontWeight: 500,
    },
    h4: {
      fontSize: '1.6rem',
      fontWeight: 500,
    },
    h5: {
      fontSize: '1.4rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '1.2rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
    },
    body2: {
      fontSize: '0.875rem',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#FFFFFF',
          boxShadow: '0 0 15px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

// export default theme;
// ... StyledDrawer, DrawerHeader, StyledListItem, drawerItems, and DrawerComponent definitions ...
const StyledDrawer = styled(Box)(({ theme }) => ({
  width: 280,
  backgroundColor: theme.palette.background.paper,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.1)',
}));

const DrawerHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(2),
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  margin: theme.spacing(0.5, 1),
  borderRadius: theme.shape.borderRadius,
  transition: 'background-color 0.3s, transform 0.2s',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    transform: 'translateX(5px)',
  },
}));

const drawerItems = [
  { text: 'Home', icon: <HomeIcon />, path: '/' },
  { text: 'Calculator', icon: <CalculateIcon />, path: '/calculator' },
  { text: 'उधारी रूट अनुसार', icon: <CurrencyRupeeIcon />, path: '/totalremaining' },
  { text: 'दैनिक खर्च', icon: <CurrencyRupeeIcon />, path: '/expenses' },
];

const DrawerComponent = ({ toggleDrawer }) => (
  <StyledDrawer role="presentation">
    <DrawerHeader>
      <Typography variant="h6" sx={{ textAlign: 'center', fontWeight: 'bold' }}>
        MENU
      </Typography>
      <IconButton onClick={toggleDrawer(false)} sx={{ color: 'inherit' }}>
        <CloseIcon />
      </IconButton>
    </DrawerHeader>
    <Divider />
    <List sx={{ flexGrow: 1, overflowY: 'auto', py: 2 }}>
      {drawerItems.map((item) => (
        <Link
          href={item.path}
          key={item.text}
          passHref
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <StyledListItem button onClick={toggleDrawer(false)}>
            <ListItemIcon sx={{ color: 'primary.main', minWidth: 40 }}>{item.icon}</ListItemIcon>
            <ListItemText
              primary={item.text}
              primaryTypographyProps={{
                fontSize: '0.9rem',
                fontWeight: 'medium',
              }}
            />
          </StyledListItem>
        </Link>
      ))}
    </List>
    <Divider />
    <Box sx={{ p: 2, textAlign: 'center' }}>
      <Typography variant="body2" color="text.secondary">
        © 2024 Balaji Gruh Udyog
      </Typography>
    </Box>
  </StyledDrawer>
);
export default function RootLayout({ children }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const router = useRouter();

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
            sx={{
              color: "black",
              background:
                "linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0))",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
            }}
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
          <MuiDrawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
            <DrawerComponent toggleDrawer={toggleDrawer} />
          </MuiDrawer>
          <Box sx={{ marginTop: "64px" }}>{children}</Box>
        </ThemeProvider>
      </body>
    </html>
  );
}

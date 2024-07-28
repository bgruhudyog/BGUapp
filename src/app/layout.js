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
// import { styled } from '@mui/material/styles';
// import Switch from '@mui/material/Switch';
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
const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  "& .MuiSwitch-switchBase": {
    margin: 1,
    padding: 0,
    transform: "translateX(6px)",
    "&.Mui-checked": {
      color: "#fff",
      transform: "translateX(22px)",
      "& .MuiSwitch-thumb:before": {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          "#fff"
        )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
      },
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
      },
    },
  },
  "& .MuiSwitch-thumb": {
    backgroundColor: theme.palette.mode === "dark" ? "#003892" : "#001e3c",
    width: 32,
    height: 32,
    "&::before": {
      content: "''",
      position: "absolute",
      width: "100%",
      height: "100%",
      left: 0,
      top: 0,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        "#fff"
      )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
    },
  },
  "& .MuiSwitch-track": {
    opacity: 1,
    backgroundColor: theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
    borderRadius: 20 / 2,
  },
}));
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
        <MaterialUISwitch
          checked={mode === "dark"}
          onChange={toggleColorMode}
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
                  ? "linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0))"
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

"use client";
// import { ThemeProvider } from '@mui/material/styles';
// import CssBaseline from '@mui/material/CssBaseline';
// import theme from './theme';

// export default function RootLayout({ children }) {
//   return (
    // <html lang="en">
    //   <head>
    //     <title>बालाजी गृह उद्योग </title>
    //     <meta name="viewport" content="width=device-width, initial-scale=1" />
    //     <link rel="icon" href="/favicon.ico" sizes="any" />
    //     {/* <link rel="icon" href="/favicon-16x16.png" type="image/png" sizes="16x16" />
    //     <link rel="icon" href="/favicon-32x32.png" type="image/png" sizes="32x32" /> */}
    //     <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    //   </head>
//       <body>
//         <ThemeProvider theme={theme}>
//           <CssBaseline />
//           {children}
//         </ThemeProvider>
//       </body>
//     </html>
//   );
// }


import { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  CssBaseline,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import CalculateIcon from '@mui/icons-material/Calculate';
import Image from "next/image";
import Link from "next/link";

export default function RootLayout({ children }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const drawerItems = [
    { text: "Home", icon: <HomeIcon />, path: "/" },
    { text: "Calculator", icon: <CalculateIcon />, path: "/calculator" },
  ];

  const drawer = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {drawerItems.map((item) => (
          <Link href={item.path} key={item.text} passHref style={{ textDecoration: 'none', color: 'inherit' }}>
            <ListItem button>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          </Link>
        ))}
      </List>
    </Box>
  );

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

  return (
    <html lang="en">
    <head>
      <title>बालाजी गृह उद्योग </title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" sizes="any" />
      {/* <link rel="icon" href="/favicon-16x16.png" type="image/png" sizes="16x16" />
      <link rel="icon" href="/favicon-32x32.png" type="image/png" sizes="32x32" /> */}
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    </head>
      <body>
        <CssBaseline />
        <AppBar position="static" sx={{ bgcolor: "black" }}>
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Image
                src="/logo.jpg"
                alt="Balaji Gruh Udyog Logo"
                width={40}
                height={40}
                style={{ borderRadius: "20%" }}
              />
              <Box sx={{ ml: 2, display: "flex", flexDirection: "column" }}>
                <Typography
                  variant="h6"
                  component="div"
                  sx={{ textAlign: "left" }}
                >
                  बालाजी गृह उद्योग
                </Typography>
                <Typography
                  variant="subtitle2"
                  component="div"
                  sx={{ textAlign: "left" }}
                >
                  {getCurrentDate()}
                </Typography>
              </Box>
            </Box>
          </Toolbar>
        </AppBar>
        <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
          {drawer}
        </Drawer>
        {children}
      </body>
    </html>
  );
}
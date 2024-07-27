// "use client";

// import { useState } from "react";
// import {
//   AppBar,
//   Toolbar,
//   IconButton,
//   Drawer,
//   List,
//   ListItem,
//   ListItemIcon,
//   ListItemText,
//   Box,
//   Typography,
//   CssBaseline,
// } from "@mui/material";
// import MenuIcon from "@mui/icons-material/Menu";
// import HomeIcon from "@mui/icons-material/Home";
// import CalculateIcon from "@mui/icons-material/Calculate";
// import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
// import Image from "next/image";
// import Link from "next/link";
// import { useRouter } from "next/navigation";

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

//   const drawerItems = [
//     { text: "Home", icon: <HomeIcon />, path: "/" },
//     { text: "Calculator", icon: <CalculateIcon />, path: "/calculator" },
//     {
//       text: "उधारी रूट अनुसार",
//       icon: <CurrencyRupeeIcon />,
//       path: "/totalremaining",
//     },
//   ];

//   const drawer = (
//     <Box
//       sx={{ width: 250 }}
//       role="presentation"
//       onClick={toggleDrawer(false)}
//       onKeyDown={toggleDrawer(false)}
//     >
//       <List>
//         {drawerItems.map((item) => (
//           <Link
//             href={item.path}
//             key={item.text}
//             passHref
//             style={{ textDecoration: "none", color: "inherit" }}
//           >
//             <ListItem button>
//               <ListItemIcon>{item.icon}</ListItemIcon>
//               <ListItemText primary={item.text} />
//             </ListItem>
//           </Link>
//         ))}
//       </List>
//     </Box>
//   );

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
//         <title>बालाजी गृह उद्योग </title>
//         <meta name="viewport" content="width=device-width, initial-scale=1" />
//         <link rel="icon" href="/favicon.ico" sizes="any" />
//         <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
//       </head>
//       <body>
//         <CssBaseline />
// <AppBar
//   position="fixed"
//   sx={{
//     // bgcolor: "black",
//     color:"black",
//     background:
//       "linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0))",
//     backdropFilter: "blur(10px)",
//     WebkitBackdropFilter: "blur(10px)",

//   }}
// >
//           <Toolbar sx={{ justifyContent: "space-between" }}>
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
//             <Box sx={{ width: 48 }} />{" "}
//             {/* This empty Box is for balancing the AppBar */}
//           </Toolbar>
//         </AppBar>
//         <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
//           {drawer}
//         </Drawer>
//         <Box sx={{ marginTop: "64px" }}>
//           {" "}
//           {/* Add top margin to account for fixed AppBar */}
//           {children}
//         </Box>
//       </body>
//     </html>
//   );
// }

"use client";

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
import CloseIcon from "@mui/icons-material/Close";
import HomeIcon from "@mui/icons-material/Home";
import CalculateIcon from "@mui/icons-material/Calculate";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

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

  const drawerItems = [
    { text: "Home", icon: <HomeIcon />, path: "/" },
    { text: "Calculator", icon: <CalculateIcon />, path: "/calculator" },
    {
      text: "उधारी रूट अनुसार",
      icon: <CurrencyRupeeIcon />,
      path: "/totalremaining",
    },
  ];

  const drawer = (
    <Box sx={{ width: 250 }} role="presentation">
      <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
        <IconButton onClick={toggleDrawer(false)}>
          <CloseIcon />
        </IconButton>
      </Box>
      <List>
        {drawerItems.map((item) => (
          <Link
            href={item.path}
            key={item.text}
            passHref
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <ListItem button onClick={toggleDrawer(false)}>
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

  const handleLogoClick = () => {
    router.push("/");
  };

  return (
    <html lang="en">
      <head>
        <title>बालाजी गृह उद्योग </title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body>
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{
            // bgcolor: "black",
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
        <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
          {drawer}
        </Drawer>
        <Box sx={{ marginTop: "64px" }}>{children}</Box>
      </body>
    </html>
  );
}

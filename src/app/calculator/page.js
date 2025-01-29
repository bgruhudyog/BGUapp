// // Calculator.js
// "use client";

// import { Container, Typography } from "@mui/material";
// import "../../styles/globals.css";
// import React, { useState } from "react";

// export default function Calculator() {
//   const [result, setResult] = useState("");

//   const handleClick = (value) => {
//     if (value === "=") {
//       try {
//         setResult(eval(result) || "");
//       } catch (error) {
//         setResult("Error");
//       }
//     } else if (value === "C") {
//       setResult("");
//     } else if (value === "CE") {
//       setResult(result.slice(0, -1));
//     } else {
//       setResult(result + value);
//     }
//   };
//   return (
//     <Container sx={{ mt: 2 }}>
//       <Typography
//         variant="h4"
//         sx={{ textAlign: "center" }}
        
//       >
//         कैल्क्युलेटर
//       </Typography>

//       {/* Add your calculator component here */}
//       <div className="calculator">
//         <input
//           type="text"
//           className="form-control mb-3"
//           value={result}
//           readOnly
//         />
//         <div className="buttons">
//           <button onClick={() => handleClick("7")}>7</button>
//           <button onClick={() => handleClick("8")}>8</button>
//           <button onClick={() => handleClick("9")}>9</button>
//           <button className="operator" onClick={() => handleClick("CE")}>
//             CE
//           </button>

//           <button onClick={() => handleClick("4")}>4</button>
//           <button onClick={() => handleClick("5")}>5</button>
//           <button onClick={() => handleClick("6")}>6</button>
//           <button className="operator" onClick={() => handleClick("/")}>
//             /
//           </button>

//           <button onClick={() => handleClick("1")}>1</button>
//           <button onClick={() => handleClick("2")}>2</button>
//           <button onClick={() => handleClick("3")}>3</button>
//           <button className="operator" onClick={() => handleClick("*")}>
//             *
//           </button>

//           <button onClick={() => handleClick("0")}>0</button>
//           <button onClick={() => handleClick(".")}>.</button>
//           <button onClick={() => handleClick("00")}>00</button>

//           <button className="operator" onClick={() => handleClick("-")}>
//             -
//           </button>
//           <button
//             className="operator wide"
//             id="clear"
//             onClick={() => handleClick("C")}
//           >
//             C
//           </button>

//           <button className="operator" onClick={() => handleClick("=")}>
//             =
//           </button>

//           <button className="operator" onClick={() => handleClick("+")}>
//             +
//           </button>
//         </div>
//       </div>
//     </Container>
//   );
// }


"use client";

import { Container, Typography, useTheme } from "@mui/material";
import "../../styles/globals.css";
import React, { useState } from "react";

export default function Calculator() {
  const [result, setResult] = useState("");
  const theme = useTheme();

  const handleClick = (value) => {
    if (value === "=") {
      try {
        // Convert the result to string before storing
        const evaluatedResult = eval(result);
        setResult(String(evaluatedResult || ""));
      } catch (error) {
        setResult("Error");
      }
    } else if (value === "C") {
      setResult("");
    } else if (value === "CE") {
      // Ensure we're working with a string before using slice
      setResult(String(result).slice(0, -1));
    } else {
      // Convert to string when concatenating
      setResult(String(result) + value);
    }
  };

  return (
    <Container sx={{ mt: 2 }}>
      <Typography variant="h4" sx={{ textAlign: "center" , pt: 3 , mb:3}}>
        कैल्क्युलेटर
      </Typography>

      {/* Calculator Component */}
      <div
        className="calculator"
        style={{
          backgroundColor: theme.palette.background.paper,
          padding: "20px",
          borderRadius: "10px",
          boxShadow: theme.shadows[3],
        }}
      >
        <input
          type="text"
          className="form-control mb-3"
          value={result}
          readOnly
          style={{
            backgroundColor: theme.palette.background.default,
            color: theme.palette.text.primary,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: "8px",
            padding: "10px",
            width: "100%",
            textAlign: "right",
            fontSize: "1.5rem",
          }}
        />
        <div 
          className="buttons"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "10px"
          }}
        >
          {[
            "7", "8", "9", "CE",
            "4", "5", "6", "/",
            "1", "2", "3", "*",
            "0", ".", "00", "-",
            "C", "=", "+", ""
          ].map((value, index) => (
            value && (
              <button
                key={value}
                onClick={() => handleClick(value)}
                style={{
                  backgroundColor:
                    value === "C" || value === "CE" || value === "=" || value === "/" || value === "*" || value === "-" || value === "+"
                      ? theme.palette.primary.main
                      : theme.palette.background.paper,
                  color:
                    value === "C" || value === "CE" || value === "=" || value === "/" || value === "*" || value === "-" || value === "+"
                      ? theme.palette.primary.contrastText
                      : theme.palette.text.primary,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: "8px",
                  padding: "15px",
                  fontSize: "1.2rem",
                  cursor: "pointer",
                  transition: "background-color 0.3s",
                  gridColumn: value === "C" ? "span 2" : "span 1",
                  "&:hover": {
                    backgroundColor: 
                      value === "C" || value === "CE" || value === "=" || value === "/" || value === "*" || value === "-" || value === "+"
                        ? theme.palette.primary.dark
                        : theme.palette.action.hover,
                  },
                }}
              >
                {value}
              </button>
            )
          ))}
        </div>
      </div>
    </Container>
  );
}
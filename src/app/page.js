

"use client";

// export default function Home() {
//   return <div>Welcome to the home page</div>
// }
import { useState } from "react";
import { Container, Box, Button } from "@mui/material";
import { useRouter } from 'next/navigation';
import BaseSelection from "./components/BaseSelect";
import ShopSelect from "./components/ShopSelect";
import "./glass.css";

export default function Home() {
  const [shops, setShops] = useState([]);
  const [routeId, setRouteId] = useState(null);
  const [villageInfo, setVillageInfo] = useState({
    villageId: null,
    villageName: "",
  });
  const router = useRouter();

  return (
    <Container sx={{ mt: 2, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Box className="glass">
        <BaseSelection
          setShops={setShops}
          setRouteId={setRouteId}
          setVillageInfo={setVillageInfo}
        />
      </Box>
      <Box className="glass">
        <ShopSelect
          shops={shops}
          villageId={villageInfo.villageId}
          villageName={villageInfo.villageName}
          setShops={setShops}
          routeId={routeId}
        />
      </Box>
      <Box sx={{ mt: 'auto', mb: 4, display: 'flex', justifyContent: 'center' }}>
        <Button 
          variant="contained" 
          color="primary" 
          size="large"
          onClick={() => router.push('/alltransactions')}
        >
          आज का पूरा हिसाब देखे 
        </Button>
      </Box>
    </Container>
  );
}


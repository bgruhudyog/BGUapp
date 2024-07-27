// "use client";

// import { useEffect, useState } from 'react';
// import { Box, Select, MenuItem, InputLabel, FormControl, Button, TextField, Typography } from '@mui/material';
// import supabaseClient from '../../utils/supabaseClient';

// export default function BaseSelection({ setShops, setRouteId, setVillageInfo }) {
//   const [routes, setRoutes] = useState([]);
//   const [villages, setVillages] = useState([]);
//   const [selectedRouteId, setSelectedRouteId] = useState(null);
//   const [newRouteName, setNewRouteName] = useState('');
//   const [newVillageName, setNewVillageName] = useState('');
//   const [addingRoute, setAddingRoute] = useState(false);
//   const [addingVillage, setAddingVillage] = useState(false);
//   const newrouteButton = false;
//   useEffect(() => {
//     fetchRoutes();
//   }, []);

//   const fetchRoutes = async () => {
//     const { data, error } = await supabaseClient.from('Routes Table').select('*');
//     if (error) console.error('Error fetching routes:', error);
//     else setRoutes(data);
//   };

//   const handleRouteChange = async (event) => {
//     const routeId = event.target.value;
//     setSelectedRouteId(routeId);
//     setRouteId(routeId);
//     const { data, error } = await supabaseClient.from('Villages Table').select('*').eq('route_id', routeId);
//     if (error) console.error('Error fetching villages:', error);
//     else setVillages(data);
//   };

//   const handleVillageChange = async (event) => {
//     const villageId = event.target.value;
//     const selectedVillage = villages.find(village => village.id === villageId);
//     const villageName = selectedVillage ? selectedVillage.village_name : '';
//     setVillageInfo({ villageId, villageName });
    
//     const { data, error } = await supabaseClient.from('Shops Table').select('*').eq('village_id', villageId);
//     if (error) console.error('Error fetching shops:', error);
//     else setShops(data);
//   };

//   const addRoute = async () => {
//     const { data, error } = await supabaseClient.from('Routes Table').insert([{ route_name: newRouteName }]);
//     if (error) console.error('Error adding route:', error);
//     else fetchRoutes();
//     setNewRouteName('');
//     setAddingRoute(false);
//   };

//   const addVillage = async () => {
//     const { data, error } = await supabaseClient.from('Villages Table').insert([{ village_name: newVillageName, route_id: selectedRouteId }]);
//     if (error) console.error('Error adding village:', error);
//     else {
//       const { data: updatedVillages } = await supabaseClient.from('Villages Table').select('*').eq('route_id', selectedRouteId);
//       setVillages(updatedVillages);
//     }
//     setNewVillageName('');
//     setAddingVillage(false);
//   };

//   return (
//     <Box mb={4}>
//       <Typography variant="h6" gutterBottom>रूट और गाँव चुनें</Typography>
//       <Box mb={2}>
//         {addingRoute ? (
//           <>
//             <TextField
//               label="नए रूट का नाम लिखे"
//               value={newRouteName}
//               onChange={(e) => setNewRouteName(e.target.value)}
//               fullWidth
//               margin="normal"
//             />
//             <Button variant="contained" color="primary" onClick={addRoute} disabled={!newRouteName}>
//               रूट जमा करे
//             </Button>
//             <Button variant="outlined" color="secondary" onClick={() => setAddingRoute(false)} style={{ marginLeft: 8 }}>
//               रद्द करे
//             </Button>
//           </>
//         ) : (
//           <>
//             <FormControl fullWidth margin="normal">
//               <InputLabel id="route-select-label">रूट चुने</InputLabel>
//               <Select labelId="route-select-label" onChange={handleRouteChange}>
//                 {routes.map((route) => (
//                   <MenuItem key={route.id} value={route.id}>
//                     {route.id}.{route.route_name}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//             <Button variant="contained" color="primary" onClick={() => setAddingRoute(true)} disabled={true} style={{ marginTop: 8 }}>
//               नया रूट जोड़े
//             </Button>
//           </>
//         )}
//       </Box>
//       <Box mb={2}>
//         {addingVillage ? (
//           <>
//             <TextField
//               label="नए गाँव का नाम लिखे"
//               value={newVillageName}
//               onChange={(e) => setNewVillageName(e.target.value)}
//               fullWidth
//               margin="normal"
//             />
//             <Button variant="contained" color="primary" onClick={addVillage} disabled={!newVillageName || !selectedRouteId}>
//               गाँव जमा करे
//             </Button>
//             <Button variant="outlined" color="secondary" onClick={() => setAddingVillage(false)} style={{ marginLeft: 8 }}>
//               रद्द करे
//             </Button>
//           </>
//         ) : (
//           <>
//             <FormControl fullWidth margin="normal">
//               <InputLabel id="village-select-label">गाँव या शहर का नाम चुनें</InputLabel>
//               <Select labelId="village-select-label" onChange={handleVillageChange}>
//                 {villages.map((village) => (
//                   <MenuItem key={village.id} value={village.id}>
//                     {village.village_name}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//             <Button variant="contained" color="primary" onClick={() => setAddingVillage(true)} style={{ marginTop: 8 }} disabled={!selectedRouteId}>
//               नया गाँव या शहर जोड़े
//             </Button>
//           </>
//         )}
//       </Box>
//     </Box>
//   );
// }

"use client";

import { useEffect, useState } from 'react';
import { Box, Select, MenuItem, InputLabel, FormControl, Button, TextField, Typography } from '@mui/material';
import supabaseClient from '../../utils/supabaseClient';

export default function BaseSelection({ setShops, setRouteId, setVillageInfo }) {
  const [routes, setRoutes] = useState([]);
  const [villages, setVillages] = useState([]);
  const [selectedRouteId, setSelectedRouteId] = useState(() => {
    // Initialize from localStorage or null if not present
    return localStorage.getItem('selectedRouteId') || null;
  });
  const [selectedVillageId, setSelectedVillageId] = useState(() => {
    // Initialize from localStorage or null if not present
    return localStorage.getItem('selectedVillageId') || null;
  });
  const [newRouteName, setNewRouteName] = useState('');
  const [newVillageName, setNewVillageName] = useState('');
  const [addingRoute, setAddingRoute] = useState(false);
  const [addingVillage, setAddingVillage] = useState(false);
  const newrouteButton = false;

  useEffect(() => {
    fetchRoutes();
  }, []);

  useEffect(() => {
    if (selectedRouteId) {
      fetchVillages(selectedRouteId);
      setRouteId(selectedRouteId);
    }
  }, [selectedRouteId]);

  useEffect(() => {
    if (selectedVillageId) {
      fetchShops(selectedVillageId);
    }
  }, [selectedVillageId]);

  const fetchRoutes = async () => {
    const { data, error } = await supabaseClient.from('Routes Table').select('*');
    if (error) console.error('Error fetching routes:', error);
    else setRoutes(data);
  };

  const fetchVillages = async (routeId) => {
    const { data, error } = await supabaseClient.from('Villages Table').select('*').eq('route_id', routeId);
    if (error) console.error('Error fetching villages:', error);
    else setVillages(data);
  };

  const fetchShops = async (villageId) => {
    const { data, error } = await supabaseClient.from('Shops Table').select('*').eq('village_id', villageId);
    if (error) console.error('Error fetching shops:', error);
    else setShops(data);
  };

  const handleRouteChange = (event) => {
    const routeId = event.target.value;
    setSelectedRouteId(routeId);
    localStorage.setItem('selectedRouteId', routeId);
    setRouteId(routeId);
    setSelectedVillageId(null);
    localStorage.removeItem('selectedVillageId');
  };

  const handleVillageChange = (event) => {
    const villageId = event.target.value;
    setSelectedVillageId(villageId);
    localStorage.setItem('selectedVillageId', villageId);
    const selectedVillage = villages.find(village => village.id === villageId);
    const villageName = selectedVillage ? selectedVillage.village_name : '';
    setVillageInfo({ villageId, villageName });
  };

  const addRoute = async () => {
    const { data, error } = await supabaseClient.from('Routes Table').insert([{ route_name: newRouteName }]);
    if (error) console.error('Error adding route:', error);
    else fetchRoutes();
    setNewRouteName('');
    setAddingRoute(false);
  };

  const addVillage = async () => {
    const { data, error } = await supabaseClient.from('Villages Table').insert([{ village_name: newVillageName, route_id: selectedRouteId }]);
    if (error) console.error('Error adding village:', error);
    else {
      fetchVillages(selectedRouteId);
    }
    setNewVillageName('');
    setAddingVillage(false);
  };

  return (
    <Box mb={4}>
      <Typography variant="h6" gutterBottom>रूट और गाँव चुनें</Typography>
      <Box mb={2}>
        {addingRoute ? (
          <>
            <TextField
              label="नए रूट का नाम लिखे"
              value={newRouteName}
              onChange={(e) => setNewRouteName(e.target.value)}
              fullWidth
              margin="normal"
            />
            <Button variant="contained" color="primary" onClick={addRoute} disabled={!newRouteName}>
              रूट जमा करे
            </Button>
            <Button variant="outlined" color="secondary" onClick={() => setAddingRoute(false)} style={{ marginLeft: 8 }}>
              रद्द करे
            </Button>
          </>
        ) : (
          <>
            <FormControl fullWidth margin="normal">
              <InputLabel id="route-select-label">रूट चुने</InputLabel>
              <Select 
                labelId="route-select-label" 
                onChange={handleRouteChange}
                value={selectedRouteId || ''}
              >
                {routes.map((route) => (
                  <MenuItem key={route.id} value={route.id}>
                    {route.id}.{route.route_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button variant="contained" color="primary" onClick={() => setAddingRoute(true)} disabled={true} style={{ marginTop: 8 }}>
              नया रूट जोड़े
            </Button>
          </>
        )}
      </Box>
      <Box mb={2}>
        {addingVillage ? (
          <>
            <TextField
              label="नए गाँव का नाम लिखे"
              value={newVillageName}
              onChange={(e) => setNewVillageName(e.target.value)}
              fullWidth
              margin="normal"
            />
            <Button variant="contained" color="primary" onClick={addVillage} disabled={!newVillageName || !selectedRouteId}>
              गाँव जमा करे
            </Button>
            <Button variant="outlined" color="secondary" onClick={() => setAddingVillage(false)} style={{ marginLeft: 8 }}>
              रद्द करे
            </Button>
          </>
        ) : (
          <>
            <FormControl fullWidth margin="normal">
              <InputLabel id="village-select-label">गाँव या शहर का नाम चुनें</InputLabel>
              <Select 
                labelId="village-select-label" 
                onChange={handleVillageChange}
                value={selectedVillageId || ''}
              >
                {villages.map((village) => (
                  <MenuItem key={village.id} value={village.id}>
                    {village.village_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button variant="contained" color="primary" onClick={() => setAddingVillage(true)} style={{ marginTop: 8 }} disabled={!selectedRouteId}>
              नया गाँव या शहर जोड़े
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
}
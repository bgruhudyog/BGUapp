// Fetch current shop data
const { data: shopData, error: fetchError } = await supabase
.from("Shops Table")
.select("*")
.eq("id", shopId)
.single();

if (fetchError) {
throw new Error(`Failed to fetch shop data: ${fetchError.message}`);
}

// Calculate new totals
const newTotalQuantity =
(shopData.total_quantity || 0) + (parseFloat(quantity) || 0);
const newTotal = (shopData.total || 0) + totalValue;
const newTotalCash = (shopData.total_cash || 0) + cashValue;
const newTotalOld = (shopData.total_old || 0) + oldValue;

// Update Shops Table
const { data: updateData, error: updateError } = await supabase
.from("Shops Table")
.update({
  route_id: routeId,
  total_quantity: newTotalQuantity,
  total: newTotal,
  total_cash: newTotalCash,
  total_old: newTotalOld,
  
  village_name: villageName,
})
.eq("id", shopId);

if (updateError) {
throw new Error(`Failed to update shop totals: ${updateError.message}`);
}
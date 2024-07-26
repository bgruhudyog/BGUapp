// utils/sendTelegram.js
export const sendTotalToTelegram = async (totals, date) => {
    const telegramToken = "7240758563:AAHc_bUtGSBHWNPRAXuNxSZ4c4zEWH6Lcz0";
    const chatId = "-4209186125";
    const telegramURL = `https://api.telegram.org/bot${telegramToken}/sendMessage`;
  
    const message = `
  दिनांक: ${date} का कुल हिसाब:\n
  कुल माल बिका : ${totals.quantity.toFixed(2)} Kg
  इतने का माल बिका : ₹${totals.total.toFixed(2)}
  नगदी आइ : ₹${totals.cash.toFixed(2)}
  उधारी आइ : ₹${totals.old.toFixed(2)}
  उधारी दी : ₹${totals.remaining.toFixed(2)}
  कुल रुपे आए : ₹${(totals.cash + totals.old).toFixed(2)}
    `;
  
    const response = await fetch(telegramURL, {
      method: "POST",
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "HTML",
      }),
      headers: { "Content-Type": "application/json" },
    });
  
    if (!response.ok) {
      throw new Error("Failed to send totals to Telegram");
    }
  
    return response;
  };
  
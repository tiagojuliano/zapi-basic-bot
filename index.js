const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// **********************
// CONFIG DA INSTÂNCIA
// **********************
const INSTANCE = "3EA9E26D9B54A1959179B2694663CF7D";
const API_TOKEN = "389FF465021471C494497363";        // TOKEN DO URL
const CLIENT_TOKEN = "Fb71ea501d4bd403e931a9077f4677a35S"; // TOKEN DO HEADER — OBRIGATÓRIO

// **********************
// API CLIENT
// **********************
const API = axios.create({
  baseURL: `https://api.z-api.io/instances/${INSTANCE}/token/${API_TOKEN}`,
  headers: {
    "Content-Type": "application/json",
    "client-token": CLIENT_TOKEN
  }
});

// **********************
// ENVIO DE TEXTO
// **********************
async function sendText(phone, message) {
  try {
    const r = await API.post("/send-text", { phone, message });
    console.log("Mensagem enviada:", r.data);
  } catch (e) {
    console.log("Erro:", e.response?.data || e.message);
  }
}

// **********************
// WEBHOOK
// **********************
app.post("/webhook", async (req, res) => {
  console.log("Webhook recebido:", JSON.stringify(req.body, null, 2));

  const msg = req.body;

  if (msg.phone && msg.text?.message) {
    const phone = msg.phone;
    const text = msg.text.message.toLowerCase();

    if (text === "oi") {
      await sendText(phone, "Olá! Bot Ameclin aqui 😄 Como posso ajudar?");
    } else {
      await sendText(phone, "Desculpe, não entendi.");
    }
  }

  res.sendStatus(200);
});

// **********************
// SERVIDOR RAILWAY
// **********************
const PORT = process.env.PORT || 8080;
app.listen(PORT, () =>
  console.log(`🚀 Servidor rodando na porta ${PORT}`)
);

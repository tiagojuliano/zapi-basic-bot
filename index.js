const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// ================================
// VARIÁVEIS
// ================================
const INSTANCE = "3EA9E26D9B54A1959179B2694663CF7D";
const ZAPI_TOKEN = "BFA60483E1977233B370D94A";

// ================================
// API DA Z-API (SEM BARRA NO FINAL!)
// ================================
const API = axios.create({
  baseURL: `https://api.z-api.io/instances/${INSTANCE}/token/${ZAPI_TOKEN}`,
  headers: {
    "Content-Type": "application/json",
    "client-token": ZAPI_TOKEN
  }
});

// ================================
// ENVIAR TEXTO
// ================================
async function sendText(phone, message) {
  try {
    const response = await API.post("/send-text", {
      phone,
      message
    });
    console.log("📤 Enviado OK:", response.data);
  } catch (error) {
    console.error("❌ Erro ao enviar:", error?.response?.data || error.message);
  }
}

// ================================
// WEBHOOK
// ================================
app.post("/webhook", async (req, res) => {
  console.log("📩 Webhook recebido:", JSON.stringify(req.body, null, 2));

  const msg = req.body;

  if (msg?.phone && msg?.text?.message) {
    const phone = msg.phone;
    const text = msg.text.message.trim().toLowerCase();

    if (text === "oi" || text === "olá") {
      await sendText(phone, "Olá! Eu sou o bot da Ameclin 😄 Como posso ajudar?");
    } else {
      await sendText(phone, "Desculpe, não entendi. Pode repetir?");
    }
  }

  return res.sendStatus(200);
});

// ================================
// INICIAR SERVIDOR
// ================================
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});

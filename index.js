const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// ================================
// VARIÁVEIS DO RAILWAY
// ================================
const INSTANCE = process.env.INSTANCE;
const ZAPI_TOKEN = process.env.ZAPI_TOKEN;
const CLIENT_TOKEN = process.env.CLIENT_TOKEN;

console.log("===============================");
console.log("🔧 INSTANCE:", INSTANCE);
console.log("🔧 ZAPI_TOKEN:", ZAPI_TOKEN);
console.log("🔧 CLIENT_TOKEN:", CLIENT_TOKEN);
console.log("===============================");

// Verifica se as variáveis existem
if (!INSTANCE || !ZAPI_TOKEN || !CLIENT_TOKEN) {
  console.error("❌ ERRO: Variáveis de ambiente não configuradas no Railway!");
}

// ================================
// CLIENTE API Z-API
// ================================
const API = axios.create({
  baseURL: `https://api.z-api.io/instances/${INSTANCE}/token/${ZAPI_TOKEN}/`,
  headers: {
    "Content-Type": "application/json",
    "client-token": CLIENT_TOKEN
  }
});

// ================================
// FUNÇÃO PARA ENVIAR MENSAGEM
// ================================
async function sendText(phone, message) {
  try {
    const response = await API.post("send-text", {
      phone,
      message
    });

    console.log("📤 Mensagem enviada:", response.data);
  } catch (error) {
    console.error("❌ Erro ao enviar mensagem:", error.response?.data || error.message);
  }
}

// ================================
// WEBHOOK
// ================================
app.post("/webhook", async (req, res) => {
  console.log("📩 Webhook recebido:", JSON.stringify(req.body, null, 2));

  try {
    const msg = req.body;

    if (msg?.phone && msg?.text?.message) {
      const phone = msg.phone;
      const text = msg.text.message.trim().toLowerCase();

      console.log(`📥 Mensagem recebida de ${phone}: ${text}`);

      if (text === "oi" || text === "olá") {
        await sendText(phone, "Olá! Eu sou o bot da Ameclin 😄 Como posso ajudar?");
      } else {
        await sendText(phone, "Desculpe, não entendi. Pode repetir?");
      }
    }

    return res.sendStatus(200);

  } catch (error) {
    console.error("❌ Erro no webhook:", error.message);
    return res.sendStatus(500);
  }
});

// ================================
// INICIA SERVIDOR
// ================================
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});

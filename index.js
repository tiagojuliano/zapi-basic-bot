const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// ================================
// CONFIGURAÇÕES DA SUA INSTÂNCIA
// ================================
const INSTANCE = "3EA9E26D9B54A1959179B2694663CF7D";
const ZAPI_TOKEN = "389FF465021471C494497363"; // token da URL
const CLIENT_TOKEN = "Fb71ea501d4bd403e931a9077f4677a35S"; // token do header

// ================================
// CONEXÃO COM A API DA Z-API
// ================================
const API = axios.create({
  baseURL: `https://api.z-api.io/instances/${INSTANCE}/token/${ZAPI_TOKEN}/`,
  headers: {
    "Content-Type": "application/json",
    "client-token": CLIENT_TOKEN
  }
});

// ================================
// ENVIAR MENSAGEM
// ================================
async function sendText(phone, message) {
  try {
    const resp = await API.post("send-text", {
      phone,
      message
    });

    console.log("📤 Mensagem enviada:", resp.data);
  } catch (err) {
    console.error("❌ Erro ao enviar:", err.response?.data || err.message);
  }
}

// ================================
// WEBHOOK
// ================================
app.post("/webhook", async (req, res) => {
  console.log("📩 Webhook recebido:", JSON.stringify(req.body, null, 2));

  const msg = req.body;

  const phone = msg.phone;
  const text = msg.text?.message;

  if (phone && text) {
    const t = text.toLowerCase();

    if (t === "oi" || t === "olá") {
      await sendText(phone, "Olá! Eu sou o bot da Ameclin 😄 Como posso ajudar?");
    } else {
      await sendText(phone, "Desculpe, não entendi. Pode repetir?");
    }
  }

  return res.sendStatus(200);
});

// ================================
// SERVIDOR
// ================================
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));

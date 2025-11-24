const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// DADOS DA Z-API (SEM CLIENT-TOKEN)
const INSTANCE = "3EA9E26D9B54A1959179B2694663CF7D";
const ZAPI_TOKEN = "389FF465021471C494497363";

// API BASE CORRETA
const API = axios.create({
  baseURL: `https://api.z-api.io/instances/${INSTANCE}/token/${ZAPI_TOKEN}`,
  headers: {
    "Content-Type": "application/json",
    "client-token": ZAPI_TOKEN
  }
});

// FUNÇÃO PARA ENVIAR MENSAGEM DE TEXTO
async function sendText(phone, message) {
  try {
    const response = await API.post("/send-text", { phone, message });
    console.log("📤 Mensagem enviada:", response.data);
  } catch (error) {
    console.error("❌ Erro ao enviar mensagem:", error.response?.data || error.message);
  }
}

// Webhook Z-API
app.post("/webhook", async (req, res) => {
  console.log("📩 Webhook recebido:", JSON.stringify(req.body, null, 2));

  try {
    const msg = req.body;

    // TELEFONE PODE VIR EM 2 LUGARES
    const phone = msg.phone || msg.text?.phone;
    const text = msg.text?.message;

    if (phone && text) {
      const t = text.trim().toLowerCase();

      if (t === "oi" || t === "olá") {
        await sendText(phone, "Olá! Eu sou o bot da Ameclin 😄 como posso ajudar?");
      } else {
        await sendText(phone, "Desculpe, não entendi. Pode repetir?");
      }
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("❌ Erro no webhook:", error.message);
    res.sendStatus(500);
  }
});

// Servidor Railway
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));

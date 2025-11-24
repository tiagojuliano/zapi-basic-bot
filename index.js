const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// CONFIGS ATUAIS DA SUA INSTÂNCIA
const INSTANCE = "3EA9E26D9B54A1959179B2694663CF7D";
const ZAPI_TOKEN = "389FF465021471C494497363"; // token novo

// API format antiga que a sua instância exige
const API = axios.create({
  baseURL: `https://api.z-api.io/instances/${INSTANCE}/token/${ZAPI_TOKEN}/`,
  headers: {
    "Content-Type": "application/json",
    "client-token": ZAPI_TOKEN // obrigatório na sua instância
  }
});

// ENVIAR TEXTO (API antiga)
async function sendText(phone, message) {
  try {
    const r = await API.post("send-text", {
      phone,
      message
    });
    console.log("📤 Enviado OK:", r.data);
  } catch (err) {
    console.error("❌ Erro ao enviar:", err?.response?.data || err.message);
  }
}

// WEBHOOK
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

  res.sendStatus(200);
});

// SERVIDOR
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 Rodando na porta ${PORT}`));

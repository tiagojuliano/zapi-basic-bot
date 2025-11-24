const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// ================================
// CONFIG CORRETA — USANDO SEUS DADOS
// ================================

const INSTANCE = "3EA9E26D9B54A1959179B2694663CF7D";
const TOKEN = "389FF465021471C494497363";
const CLIENT_TOKEN = "Fb71ea501d4bd403e931a9077f4677a35S"; // ESTE É O MAIS IMPORTANTE!!!

// ================================
// CLIENT AXIOS CORRETAMENTE MONTADO
// ================================

const API = axios.create({
  baseURL: `https://api.z-api.io/instances/${INSTANCE}/token/${TOKEN}/`,
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

    console.log("📤 Enviado:", response.data);

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

      if (text === "oi") {
        await sendText(phone, "Olá! 🤖 Estou funcionando!");
      } else {
        await sendText(phone, "Não entendi, pode repetir?");
      }
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("❌ Erro no webhook:", error);
    res.sendStatus(500);
  }
});

// ================================
// SERVER RAILWAY
// ================================
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});

const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(express.json());

// =====================
// LOGS DAS VARIÁVEIS
// =====================
console.log("🔧 INSTANCE_ID:", process.env.INSTANCE_ID);
console.log("🔧 ZAPI_TOKEN:", process.env.ZAPI_TOKEN);
console.log("🔧 CLIENT_TOKEN:", process.env.CLIENT_TOKEN);

// =====================
// CONFIG Z-API
// =====================
const INSTANCE_ID = process.env.INSTANCE_ID;
const ZAPI_TOKEN = process.env.ZAPI_TOKEN;
const CLIENT_TOKEN = process.env.CLIENT_TOKEN;

const API = axios.create({
  baseURL: `https://api.z-api.io/instances/${INSTANCE_ID}/token/${ZAPI_TOKEN}`,
  headers: {
    "Content-Type": "application/json",
    "client-token": CLIENT_TOKEN,
  },
});

// =====================
// Rota principal
// =====================
app.get("/", (req, res) => {
  res.send("API Z-API está funcionando! 🚀");
});

// =====================
// Enviar mensagem
// =====================
app.post("/send-message", async (req, res) => {
  const { phone, message } = req.body;

  if (!phone || !message) {
    return res.status(400).json({ error: "Número e mensagem são obrigatórios." });
  }

  try {
    const response = await API.post("/send-text", { phone, message });

    res.status(200).json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    console.error("❌ Erro ao enviar mensagem:", error.response?.data || error.message);
    res.status(500).json({
      error: "Erro ao enviar mensagem",
      details: error.response?.data || error.message,
    });
  }
});

// =====================
// Webhook — receber mensagens da Z-API
// =====================
app.post("/webhook", async (req, res) => {
  console.log("📩 Webhook recebido:", JSON.stringify(req.body, null, 2));

  try {
    const message = req.body?.data?.message;
    const phone = req.body?.data?.phone;

    if (!message || !phone) {
      console.log("⚠️ Ignorando webhook: sem número ou mensagem.");
      return res.sendStatus(200);
    }

    // Resposta automática
    await API.post("/send-text", {
      phone: phone,
      message: `Recebi sua mensagem: "${message}" 👌`,
    });

    res.sendStatus(200);
  } catch (error) {
    console.error("❌ Erro no webhook:", error.response?.data || error.message);
    res.sendStatus(500);
  }
});

// =====================
// Start server
// =====================
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});

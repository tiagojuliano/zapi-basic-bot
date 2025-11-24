const express = require("express");
const axios = require("axios");
require("dotenv").config(); // Carrega variáveis de ambiente

const app = express();
app.use(express.json());

// Logs para verificar se as variáveis estão sendo carregadas
console.log("🔧 INSTANCE_ID:", process.env.INSTANCE_ID);
console.log("🔧 ZAPI_TOKEN:", process.env.ZAPI_TOKEN);
console.log("🔧 CLIENT_TOKEN:", process.env.CLIENT_TOKEN);

// Configurações da Z-API
const INSTANCE_ID = process.env.INSTANCE_ID;
const ZAPI_TOKEN = process.env.ZAPI_TOKEN;
const CLIENT_TOKEN = process.env.CLIENT_TOKEN;

// Base URL da API
const API = axios.create({
  baseURL: `https://api.z-api.io/instances/${INSTANCE_ID}/token/${ZAPI_TOKEN}`,
  headers: {
    "Content-Type": "application/json",
    "client-token": CLIENT_TOKEN,
  },
});

/* ============================================================
   ROTA PARA ENVIAR MENSAGEM
============================================================ */
app.post("/send-message", async (req, res) => {
  const { phone, message } = req.body;

  if (!phone || !message) {
    return res.status(400).json({ error: "Número e mensagem são obrigatórios!" });
  }

  try {
    const response = await API.post("/send-text", { phone, message });
    res.status(200).json({ success: true, data: response.data });
  } catch (error) {
    console.error("❌ Erro ao enviar mensagem:", error.response?.data || error.message);
    res.status(500).json({
      error: "Erro ao enviar mensagem",
      details: error.response?.data || error.message
    });
  }
});

/* ============================================================
   WEBHOOK PARA RECEBER MENSAGENS DA Z-API
============================================================ */
app.post("/webhook", async (req, res) => {
  const body = req.body;

  console.log("📩 Mensagem recebida:", JSON.stringify(body, null, 2));

  try {
    const message = body?.data?.message;
    const phone = body?.data?.phone;

    if (!message || !phone) {
      return res.sendStatus(200);
    }

    // Resposta automática
    await API.post("/send-text", {
      phone: phone,
      message: `Recebi sua mensagem: "${message}" 👌`
    });

    res.sendStatus(200);
  } catch (err) {
    console.error("❌ Erro no webhook:", err);
    res.sendStatus(500);
  }
});

/* ============================================================
   ROTA DE TESTE
============================================================ */
app.get("/", (req, res) => {
  res.send("API Z-API está funcionando! 🚀");
});

/* ============================================================
   INICIAR SERVIDOR
============================================================ */
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});

const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

// Logs
console.log("INSTANCE_ID:", process.env.INSTANCE_ID);
console.log("ZAPI_TOKEN:", process.env.ZAPI_TOKEN);
console.log("CLIENT_TOKEN:", process.env.CLIENT_TOKEN);

// Config Z-API
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

// Teste
app.get("/", (req, res) => {
  res.send("API rodando no Railway! 🚀");
});

// Webhook
app.post("/webhook", async (req, res) => {
  console.log("📩 Webhook recebido:", req.body);

  const mensagem = req.body?.data?.message;
  const telefone = req.body?.data?.phone;

  if (!mensagem || !telefone) {
    return res.sendStatus(200);
  }

  try {
    await API.post("/send-text", {
      phone: telefone,
      message: `Recebi sua mensagem: ${mensagem}`,
    });

    res.sendStatus(200);
  } catch (err) {
    console.log("Erro ao responder:", err.response?.data || err.message);
    res.sendStatus(500);
  }
});

// Porta dinâmica
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor iniciado na porta ${PORT}`);
});

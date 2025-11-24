const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const INSTANCE = "3EA9E26D9B54A1959179B2694663CF7D";
const ZAPI_TOKEN = "BFA60483E1977233B370D94A";

const API = axios.create({
  baseURL: "https://gateway.z-api.io",
  headers: {
    "client-token": ZAPI_TOKEN,
    "Content-Type": "application/json"
  }
});

async function sendText(phone, message) {
  try {
    const response = await API.post("/messages", {
      instanceId: INSTANCE,
      phone,
      message: {
        text: message
      }
    });

    console.log("📤 Enviado OK:", response.data);
  } catch (err) {
    console.log("❌ Erro ao enviar:", err?.response?.data || err.message);
  }
}

app.post("/webhook", async (req, res) => {
  console.log("📩 Webhook recebido:", JSON.stringify(req.body, null, 2));

  if (req.body?.text?.message && req.body?.phone) {
    const phone = req.body.phone;
    const text = req.body.text.message.toLowerCase();

    if (text === "oi") {
      await sendText(phone, "Olá! Eu sou o bot da Ameclin 😄 Como posso ajudar?");
    } else {
      await sendText(phone, "Desculpe, não entendi. Pode repetir?");
    }
  }

  res.sendStatus(200);
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log("🚀 Servidor rodando na porta", PORT));

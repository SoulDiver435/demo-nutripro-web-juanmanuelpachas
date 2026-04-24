require("dotenv").config();

const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// middlewares base
app.use(express.json());
app.use(require("cors")());

// rutas API
const stripeRoutes = require("./routes/stripe");
app.use(stripeRoutes);

// endpoint config
app.get("/config", (req, res) => {
  res.json({ STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY });
});

// servir frontend
app.use(express.static(path.join(__dirname, "../public")));

// fallback 
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

// levantar servidor
app.listen(PORT, () => {
  console.log(`Server en puerto ${PORT}`);
});

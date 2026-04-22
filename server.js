require("dotenv").config();

const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const productosDataBase = require("./data/productos-data.json");

const app = express();

app.use(express.json());
app.use(require("cors")());

app.post("/create-payment-intent", async (req, res) => {
  const { carrito } = req.body;

  const total = carrito.reduce((sum, item) => {
    const productoBase = productosDataBase.find((p) => p.id === item.id);
    return sum + productoBase.precio * item.cantidad;
  }, 0);

  let envio = 10;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: total * 100 + envio,
      currency: "pen",
      automatic_payment_methods: { enabled: true },
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});

app.listen(3000, () => console.log("Server en puerto 3000"));

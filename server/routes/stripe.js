const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const productosDataBase = require("../../public/data/productos-data.json");

router.post("/create-payment-intent", async (req, res) => {
  const { carrito } = req.body;

  const total = carrito.reduce((sum, item) => {
    const productoBase = productosDataBase.find((p) => p.id === item.id);

    if (!productoBase) return sum; // ← id inválido, lo ignora

    const cantidad =
      Number.isInteger(item.cantidad) &&
      item.cantidad > 0 &&
      item.cantidad <= 99
        ? item.cantidad
        : 1; // si es inválida, usa 1 por defecto o lanza error

    return sum + productoBase.precio * cantidad;
  }, 0);

  let envio = 10;

  if (total === 0) {
    return res
      .status(400)
      .send({ error: "El carrito no tiene productos válidos" });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: (total + envio) * 100,
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

module.exports = router;

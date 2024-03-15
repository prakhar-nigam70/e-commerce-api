const Order = require("../models/Order");

const stripe = require("stripe")(process.env.STRIPE_KEY);

const stripeWebhookCtrl = (request, response) => {
  const sig = request.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      request.body,
      sig,
      process.env.WEBHOOK_SECRET_KEY
    );
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    updatePaymentStatus(session);
  } else {
    return;
  }

  response.send();
};

const updatePaymentStatus = async (session) => {
  const { orderId } = session.metadata;
  const paymentStatus = session.payment_status;
  const totalAmount = session.amount_total;
  const paymentMethod = session.payment_method_types[0];
  const currency = session.currency;

  await Order.findByIdAndUpdate(JSON.parse(orderId), {
    paymentStatus,
    totalPrice: totalAmount / 100,
    paymentMethod,
    currency,
  });
};

module.exports = stripeWebhookCtrl;

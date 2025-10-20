import Stripe from "stripe";

const handleStripeWebhookPayment = async (event: Stripe.Event) => {
  switch (event.type) {
    case "checkout.session.completed":
      {
        const session = event.data.object as any;
        const paymentIntentId = session.metadata?.appointmentId;
        const appointmentId = session.payment_intent;
        const email = session.customer_email;

        console.log("payment successful");
        console.log("appointment Id", appointmentId);
        console.log("payment intent", paymentIntentId);
        console.log("customer Email", email);
      }

      break;
    case "payment_intent.payment_failed": {
      const intent = event.data.object as any;
      console.log("payment failed", intent.id);
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }
};

export const paymentService = {
  handleStripeWebhookPayment,
};

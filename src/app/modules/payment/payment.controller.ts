import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { paymentService } from "./payment.service";
import sendResponse from "../../shared/sendResponse";
import { stripe } from "../../helper/stripe";

const handleStripeWebhookPayment = catchAsync(
  async (req: Request, res: Response) => {
    const sig = req.headers["stripe-signature"] as string;
    const webhookSecret =
      "whsec_7aa0e876564d7172ed1ebbda82f18cd6c740ac93ff44efecbf654c0d71bf3f1c";

    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err: any) {
      console.error("⚠️ Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    const result = await paymentService.handleStripeWebhookPayment(event);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Webhook request successfully!",
      data: result,
    });
  }
);

export const paymentController = {
  handleStripeWebhookPayment,
};

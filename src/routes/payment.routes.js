import { Router } from "express";
import { 
    createOrder,
    captureOrder,
    cancelPayment,
    createOrderMP,
    receiveWebhook,
 } from "../controllers/payment.controller.js"
 import { createSession } from "../controllers/payment.controller.js";
 const router = Router();
 
router.post("/create-order", createOrder);
router.get("/capture-order",captureOrder);
router.get("/cancel-payment",cancelPayment);

router.post("/create-checkout-session", createSession);
router.get("/succes", (req, res) => res.redirect("/payed.html"));
router.get("/cancel", (req, res) => res.redirect("/"));

router.post("/create-order-mp", createOrderMP);
router.get("/success-mp", (req, res) => res.redirect("/payed.html"));
router.get("/failure", (req, res) => res.send("failure"));
router.get("/pending", (req, res) => res.send("pending"));
router.post("/webhook", receiveWebhook);

export default router;




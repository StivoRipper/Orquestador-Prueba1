import { HOST, PAYPAL_API, PAY_PAL_S, PAY_PAL_C } from "../config.js";
import axios from "axios";
import mercadopago from "mercadopago";


//---------------------------------------------PAYPAL-------------------------------------------------------
export const createOrder = async (req, res) => {
  const params = new URLSearchParams();
  params.append("grant_type", "client_credentials");

  const tokenResponse = await axios.post(
    `${PAYPAL_API}/v1/oauth2/token`,
    params,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      auth: {
        username: PAY_PAL_C,
        password: PAY_PAL_S,
      },
    }
  );

  const accessToken = tokenResponse.data.access_token;

  const order = {
    intent: "CAPTURE",
    purchase_units: [
      {
        items: [
          {
            name: "T-Shirt",
            description: "Green XL",
            quantity: "1",
            unit_amount: {
              currency_code: "USD",
              value: "10.00",
            },
          },
        ],
        amount: {
          currency_code: "USD",
          value: "10.00",
          breakdown: {
            item_total: {
              currency_code: "USD",
              value: "10.00",
            },
          },
        },
      },
    ],
    application_context: {
      return_url: `http://localhost:5000/capture-order`,
      cancel_url: "http://localhost:5000/cancel-payment",
    },
  };

  const orderResponse = await axios.post(
    `${PAYPAL_API}/v2/checkout/orders`,
    order,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return res.json(orderResponse.data);
};

export const captureOrder = async (req, res) => {
  const { token } = req.query;
  const response = await axios.post(
    `${PAYPAL_API}/v2/checkout/orders/${token}/capture`,
    {},
    {
      auth: {
        username: PAY_PAL_C,
        password: PAY_PAL_S,
      },
    }
  );
  console.log(response.data);
  return res.redirect("/payed.html");
};
export const cancelPayment = (req, res) => res.redirect("/");
//--------------------------------------Stripe---------------------------------------------------------------------
import Stripe from "stripe";
const stripe = new Stripe(
  "sk_test_51O6QsWJGdC53RqzMKrr5WmubTo6oAGEk05LQN2PgQRZCne8XDI1FpeWbhApsHkEG2MgCHRpEuvPxPpaPUmlnakrX00mgHBPWpo"
);

export const createSession = async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          product_data: {
            name: "Xbox one s",
            description: "Consola",
          },
          unit_amount: 1000,
          currency: "usd",
        },
        quantity: 3,
      },
      {
        price_data: {
          product_data: {
            name: "Laptop ",
            description: "Gaming Laptop",
          },
          unit_amount: 1000,
          currency: "usd",
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: "http://localhost:5000/succes",
    cancel_url: "http://localhost:5000/cancel",
  });
  return res.json(session);
};

//---------------------------------------------MERCADOPAGO-------------------------------------------------
export const createOrderMP = async (req, res) => {
  mercadopago.configure({
    access_token: "TEST-5491748687659483-111102-b435148bcf6f3d08e24a9cc92dfb3adc-1545343380",
  });

  const result = await mercadopago.preferences.create({
    items: [
      {
        title: "Laptop Lenovo",
        unit_price: 500,
        currency_id: "MXN",
        quantity: 1,
      },
    ],
    back_urls: {
      success: `${HOST}/payed.html`,
      failure: `${HOST}/`,
      pending: `${HOST}/pending`,
    },
    notification_url:
      "https://28b6-2806-106e-5-2df5-90f0-f7ed-65fd-f1d1.ngrok.io/webhook",
  });

  console.log(result);

  res.send(result.body);
};

export const receiveWebhook = async (req, res) => {
  console.log(req.query);
   const payment = req.query;

   try {
     if (payment.type == "payment") {
       const data = await mercadopago.payment.findById(payment["data.id"]);
       console.log(data);
       //storage in database
     }

     res.sendStatus(204);
   } catch (error) {
     console.log(error);
     return res.sendStatus(500).json({ error: error.message });
   }
};
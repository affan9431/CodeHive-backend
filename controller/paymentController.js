const axios = require("axios");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const jwt = require("jsonwebtoken"); // Make sure to require jwt
const User = require("./../model/userModel");
const Purchase = require("./../model/coursePurchase");

exports.getCheckoutSession = async (req, res, next) => {
  const item = req.body;
  console.log(item);

  // Retrieve the token from the Authorization header
  const token = req.headers.authorization.split(" ")[1];

  console.log("Request Headers:", req.headers.authorization.split(" ")[1]);
  if (!token) {
    return res
      .status(401)
      .json({ message: "No token provided. Unauthorized." });
  }

  try {
    // Decode the token and get user details
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Now you can use the decoded token data to fetch user details (like email)
    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if the user changed their password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return res
        .status(401)
        .json({ message: "Password changed. Please log in again." });
    }

    // Create line items for Stripe checkout session
    const lineItems = [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
          },
          unit_amount: item.price, // Convert price to cents
        },
        quantity: 1,
      },
    ];

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],

      // :title/:id/learn/lecture
      success_url: `https://code-hives.netlify.app/app/${encodeURIComponent(
        item.name
      )}/${item.id}/learn/lecture/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `https://code-hives.netlify.app`,
      customer_email: currentUser.email, // Use currentUser's email from decoded JWT
      mode: "payment",
      line_items: lineItems,
      metadata: {
        purchasedBy: item.purchasedBy,
        instructor: item.instructor,
        course: item.course,
        status: item.status,
      },
    });

    // Send the session ID back to the frontend
    res.status(200).json({
      status: "success",
      session,
    });
  } catch (error) {
    console.error("Error creating Stripe session:", error);
    res.status(500).json({
      status: "failure",
      error: "Failed to create payment session.",
    });
  }
};

exports.getCheckoutSession1 = async (req, res, next) => {
  const item = req.body; // Single item instead of an array
  console.log(item);

  // Retrieve the token from the Authorization header
  const token = req.headers.authorization.split(" ")[1];

  console.log("Request Headers:", req.headers.authorization.split(" ")[1]);
  if (!token) {
    return res
      .status(401)
      .json({ message: "No token provided. Unauthorized." });
  }

  try {
    // Decode the token and get user details
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Now you can use the decoded token data to fetch user details (like email)
    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if the user changed their password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return res
        .status(401)
        .json({ message: "Password changed. Please log in again." });
    }

    // Create line items for Stripe checkout session
    const lineItems = [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
          },
          unit_amount: item.price, // Convert price to cents
        },
        quantity: 1,
      },
    ];

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      success_url: item.URL,
      cancel_url: `http://localhost:5173/app`,
      customer_email: currentUser.email, // Use currentUser's email from decoded JWT
      mode: "payment",
      line_items: lineItems,
    });

    // Send the session ID back to the frontend
    res.status(200).json({
      status: "success",
      session,
    });
  } catch (error) {
    console.error("Error creating Stripe session:", error);
    res.status(500).json({
      status: "failure",
      error: "Failed to create payment session.",
    });
  }
};

exports.verifyPayment = async (req, res) => {
  const { sessionId } = req.body;

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      // Save purchase details to the database
      const purchase = await Purchase.create({
        purchasedBy: session.metadata.purchasedBy,
        instructor: session.metadata.instructor,
        course: session.metadata.course,
        status: session.metadata.status,
      });

      return res.status(200).json({
        status: "success",
        message: "Payment verified and purchase recorded.",
        purchase,
      });
    } else {
      return res.status(400).json({
        status: "failure",
        message: "Payment not completed.",
      });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({
      status: "failure",
      message: "Error verifying payment.",
    });
  }
};

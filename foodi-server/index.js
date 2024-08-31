const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;

const jwt = require('jsonwebtoken');

// middleware
app.use(cors());
app.use(express.json());
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zetg2g9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
   )
  .then(console.log("Mongodb connected successfully!"))
  .catch((error) => console.log("Error connecting to MongoDB: " + error));

  const stripe = require("stripe")(process.env.PAYMENT_SECRET_KEY);
// jwt authentication
// jwt related api
app.post("/jwt", async (req, res) => {
  const user = req.body;
  // console.log(user)
  const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1h",
  });
  res.send({ token });
});

// import routes
const menuRoutes = require("./api/routes/menuRoutes");
const cartsRoutes = require("./api/routes/cartRoutes");
const usersRoutes = require("./api/routes/userRoutes");
const paymentRoutes = require("./api/routes/paymentRoutes");
const adminStats =  require('./api/routes/adminStats'); //future phase implementation
 const orderStats = require('./api/routes/orderStats'); //future phase implementation
app.use("/menu", menuRoutes);
app.use("/carts", cartsRoutes);
app.use("/users", usersRoutes);
app.use("/payment", paymentRoutes);
app.use('/admin-stats', adminStats);
app.use('/order-stats', orderStats);


// payment methods routes
const verifyToken = require('./api/middlewares/verifyToken')

app.post("/create-payment-intent",verifyToken, async (req, res) => {
  const { price } = req.body;
  const amount = price;
  // console.log(amount);

  // Create a PaymentIntent 
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: "inr",
    payment_method_types: ["card"],
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

app.get("/", (req, res) => {
  res.send("Food Express Server is Running!");
});

app.listen(port, () => {
  console.log(`Food Express app listening on port ${port}`);
});

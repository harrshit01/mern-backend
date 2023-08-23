
import dotenv from "dotenv";
dotenv.config();
//enabling __dirname
import * as url from 'url';
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
//for enabling require

import { createRequire } from "module";
const require = createRequire(import.meta.url);

//express server
import express from "express";
const server = express();

//cors
import cors from "cors";

//database connection
import mongoose from "mongoose";

//routes
import productRouter from "./routes/Product.js";
import brandRouter from "./routes/Brand.js";
import categoryRouter from "./routes/Category.js";
import userRouter from "./routes/User.js";
import authRouter from "./routes/Auth.js";
import cartRouter from "./routes/Cart.js";
import orderRouter from "./routes/Order.js";

//models
import { User } from "./model/User.js";

//passport authentication
import session from "express-session";
import passport from "passport";
const LocalStrategy = require('passport-local').Strategy;

//jwt authentication
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

//jsonwebtoken authentication
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
//password encryption
import crypto from "crypto";

//functions
import { cookieExtractor, sanitizeUser } from "./common.js";
server.use(cookieParser());

//path
import path from "path";
server.use(express.static(path.resolve(__dirname,'build')));

//webhook
const endpointSecret =process.env.ENDPOINT_SECRET;
server.post('/webhook', express.raw({type: 'application/json'}), (request, response) => {
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntentSucceeded = event.data.object;
      // Then define and call a function to handle the event payment_intent.succeeded
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
});


const opts = {}
opts.jwtFromRequest = cookieExtractor;
// opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET_KEY;
passport.use(
    'jwt',
    new JwtStrategy(opts, async function (jwt_payload, done) {
        console.log({ jwt_payload });
        try {
            const user = await User.findById(jwt_payload.id);
            if (!user) {
                return done(null, false);
            } else {
                return done(null, sanitizeUser(user)); // this calls serializer
            }
        } catch (err) {
            console.log(err);
            return done(err, false);
        }
    })
);
//middlewares
// server.use(express.raw({type: 'application/json'}));
server.use(
    session({
        secret: process.env.SESSION_KEY,
        resave: false, // don't save session if unmodified
        saveUninitialized: false, // don't create session until something stored
    })
);
server.use(passport.authenticate('session'));
server.use(cors({
    exposedHeaders: ['X-Total-Count']
}))
server.use(express.static('build'));
server.use(express.json());
server.use("/products", passport.authenticate('jwt'), productRouter);
server.use("/brands", passport.authenticate('jwt'), brandRouter);
server.use("/category", passport.authenticate('jwt'), categoryRouter);
server.use("/user", passport.authenticate('jwt'), userRouter);
server.use("/auth", authRouter);
server.use("/cart", passport.authenticate('jwt'), cartRouter);
server.use("/orders", passport.authenticate('jwt'), orderRouter);

//jwt authentication


//passport authentication
passport.use('local', new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' },
    async function (email, password, done) {
        try {
            const user = await User.findOne({ email: email }).exec();
            if (!user) {
                return done(null, false, { message: 'no such user email' });
            }
            crypto.pbkdf2(password, user.salt, 310000, 32, 'sha256',
                async function (err, hashedPassword) {
                    if (err) { return done(err); }
                    if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
                        return done(null, false, { message: 'Incorrect username or password.' });
                    }
                    const token = jwt.sign(sanitizeUser(user), process.env.JWT_SECRET_KEY);
                    return done(null, { id: user.id, token: token, role: user.role });
                })
        } catch (err) {
            console.log(err);
            return done(err)
        }
    }
));
passport.serializeUser(function (user, cb) {
    console.log('serialize', user);
    process.nextTick(function () {
        return cb(null, { id: user.id, role: user.role });
    });
});

// this changes session variable req.user when called from authorized request

passport.deserializeUser(function (user, cb) {
    process.nextTick(function () {
        return cb(null, user);
    });
});

//Payment intent
const stripe = require("stripe")(process.env.STRIPE_SERVER_KEY);

server.post("/create-payment-intent", async (req, res) => {
    const { totalamount } = req.body;

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
        amount: totalamount*100,
        currency: "inr",
        automatic_payment_methods: {
            enabled: true,
        },
    });

    res.send({
        clientSecret: paymentIntent.client_secret,
    });
});

//database connection
async function main() {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
        console.log("db connected")
    } catch (error) {
        console.log(error);
    }
    
}
main();


server.listen(process.env.PORT, () => {
    console.log("Server is running");
});

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
import { cookieExtractor, isAuthenticated, sanitizeUser } from "./common.js";
server.use(cookieParser());

const opts = {}
opts.jwtFromRequest = cookieExtractor;
// opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'SECRET_KEY';

//middlewares
server.use(
    session({
        secret: 'secret',
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
server.use("/products", isAuthenticated, productRouter);
server.use("/brands", isAuthenticated, brandRouter);
server.use("/category", isAuthenticated, categoryRouter);
server.use("/user",isAuthenticated, userRouter);
server.use("/auth", authRouter);
server.use("/cart",isAuthenticated,cartRouter);
server.use("/orders",isAuthenticated, orderRouter);

const SECRET_KEY = 'SECRET_KEY';
//jwt authentication

passport.use(
    'jwt',
    new JwtStrategy(opts, async function (jwt_payload, done) {
console.log({jwt_payload});
      try {
        const user = await User.findById( jwt_payload.id );
        console.log(user);
        if (user) {
          return done(null, sanitizeUser(user)); // this calls serializer
        } else {
          return done(null, false);
        }
      } catch (err) {
        console.log(err);
        return done(err, false);
      }
    })
  );
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
                    const token = jwt.sign(sanitizeUser(user), SECRET_KEY);
                    return done(null, {id: user.id, token: token,role: user.role});
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


//database connection
async function main() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/e-commerce');
        // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
        console.log("db connected")
    } catch (error) {
        console.log(error);
    }
}
main();


server.listen(8080, () => {
    console.log("Server is running");
});
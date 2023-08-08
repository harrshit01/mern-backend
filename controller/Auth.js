//for enabling require
import { createRequire } from "module";
const require = createRequire(import.meta.url);

import { User } from "../model/User.js"
import crypto from "crypto";
import { sanitizeUser } from "../common.js";
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'SECRET_KEY';

export const createUser = async (req, res) => {
    const user = new User(req.body);
    try {
        const salt = crypto.randomBytes(16);

        crypto.pbkdf2(req.body.password, salt, 310000, 32, 'sha256',
            async function (err, hashedPassword) {
                const user = new User({ ...req.body, password: hashedPassword, salt: salt });
                const doc = await user.save()
                req.login(sanitizeUser(user), (err) => {
                    if (err) {
                        res.status(400).json(err);
                    } else {
                        const token = jwt.sign(sanitizeUser(user), SECRET_KEY);
                        res.cookie('jwt', token,
                            {
                                expires: new Date(Date.now() + 3600000),
                                httpOnly: true
                            })
                            .status(201).json(token);
                    }
                })
            })
    } catch (error) {
        res.status(400).json(error);
    }
}
// export const loginUser = async (req, res) => {
//     try {
//         const user = await User.findOne(
//           { email: req.body.email },
//         ).exec();
//         // TODO: this is just temporary, we will use strong password auth
//         console.log({user})
//         if (!user) {
//           res.status(401).json({ message: 'no such user email' });
//         } else if (user.password === req.body.password) {
//             // TODO: We will make addresses independent of login
//           res.status(200).json({id:user.id, role:user.role});
//         } else {
//           res.status(401).json({ message: 'invalid credentials' });
//         }
//       } catch (err) {
//         res.status(400).json(err);
//       }

// };

export const loginUser = async (req, res) => {
    res.cookie('jwt', req.user.token,
                            {
                                expires: new Date(Date.now() + 3600000),
                                httpOnly: true
                            })
                            .status(201).json(req.user.token);
}
export const checkUser = async (req, res) => {
    res.json(req.user);

};
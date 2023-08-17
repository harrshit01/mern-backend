import passport from "passport";
import nodemailer from "nodemailer";

export const sanitizeUser = (user) => {
    return {
        id: user.id,
        role: user.role,
    }

}
export const cookieExtractor = (req) => {
    // let token = null;
    // console.log(req.cookies);
    // if (req && req.cookies) {
    //   token = req.cookies['jwt'];
    // }
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0ZDQ4ZDEzY2M1OTAwMTI4ZjJkNjI2MSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjkxNjUxMzgzfQ.xKbaykJq7uGcLSDQs20tG4P62dPAkqgDJUOHhN5JZ0w"
    return token;
};


const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: 'hrsttyagi@gmail.com', // gmail
    pass: 'rohoafbgrueqdglp'
}});
export const sendMail = async function ({to, subject, text, html}){
    let info = await transporter.sendMail({
        from: '"E-commerce" <hrsttyagi@gmail.com>', // sender address
        to,
        subject,
        text,
        html
      });
    return info;  
}
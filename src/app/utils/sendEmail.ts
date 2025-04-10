
import nodemailer from "nodemailer" ;
import config from "../config";

export const sendEmail = async (to : string , html : string) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: config.nodeEnv === "production",
        auth: {
          user: "kazirihatul@gmail.com",
          pass: "ygxv iwhk gkyo rugb",
        },
    });

    await transporter.sendMail({
        from: 'kazirihatul@gmail.com', 
        to, 
        subject: "Reset your password within 10 mins !", 
        text: "", 
        html, 
    });
}

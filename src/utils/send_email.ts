import nodemailer from "nodemailer"
import "dotenv/config"
import { changeUserPassword } from "../services/user_service.js";

const sendEmail = async (options) => {
    // create transport (service responsible for sending email like gmail)
    const transportOptions = {
        host: process.env.MAIL_HOST, port: Number(process.env.MAIL_PORT), secure: false, auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD
        }
    }
    const transport = nodemailer.createTransport(transportOptions);

    const emailOptions = {
        from: `${process.env.APP_NAME} Team <${process.env.MAIL_USER}>`,
        to: options.to,
        subject: options.subject,
        text: options.message
    }

    await transport.sendMail(emailOptions);

}

export default sendEmail
import User from "../models/user_model.js"
import jwt from "jsonwebtoken"
import "dotenv/config"
import type { StringValue } from "ms"
import bcrypt from "bcrypt"
import AppError from "../errors/AppError.js"
import { randomInt } from "node:crypto"
import sendEmail from "../utils/send_email.js"
import { getUser, getUserByEmail, userSignup } from "./user_service.js"

export const signup = async (body) => {
    //create user
    const user = await userSignup(body);
    //generate token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: process.env.JWT_EXPIRE_DATE! as StringValue })

    return { user, token };
}

export const signin = async (body) => {
    //find user
    const user = await User.findOne({ email: body.email });
    //check if email or password is incorrect
    if (!user || !(await bcrypt.compare(body.password, user.password))) {
        throw new AppError(401, "invalid email or password");
    }
    //create token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: process.env.JWT_EXPIRE_DATE! as StringValue })

    //return user and token;
    return { user, token };
}
export const protect = async (req) => {
    //check if token exist, if so get it.
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
        token = req.headers.authorization.split(" ")[1];
    } else {
        throw new AppError(400, "you are not logged in please log in");
    }
    // check if token is not valid or expired.
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload;
    //check if user exist
    const user = await getUser(decoded.id);
    if (!user) {
        throw new AppError(404, "user is no longer exist");
    }
    if(!user.active){
        throw new AppError(403, "user is deactivated. please contact support team");
    }
    //check if user changed password after token created
    if (user.passwordChangedAt) {
        const passwordChangedAtTimeStamp = Math.trunc(user.passwordChangedAt!.getTime() / 1000);
        if (passwordChangedAtTimeStamp > decoded.iat!) {
            throw new AppError(401, "password changed after token is generated. please login agian")
        }
    }
    return user;
}

export const forgetPassword = async (body) => {
    // get user from the data base with email
    const { email } = body
    const user = await User.findOne({ email });
    if (!user) {
        throw new AppError(404, `there is no user with this email ${email}`);
    }

    // generate 6 digits code and hash it
    const code = randomInt(100000, 1000000).toString();
    const hashedCode = await bcrypt.hash(code, 12);

    // save the hashed password to data base
    user.passwordResetCode = hashedCode;
    user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);
    user.passwordResetVerified = false;
    await user.save();

    //send email
    try {
        const emailOptions = {
            to: email,
            subject: `Password reset code for ${process.env.APP_NAME} account`,
            message: `Hi ${user.name},\nWe received a request to reset the password for your ${process.env.APP_NAME} account.
        \nYour one-time verification code is: ${code}
        \n• This code will expire in [10 minutes].\n• If you did not request this password reset, please ignore this message or contact our support team immediately at ${process.env.MAIL_USER}.
        \nBest regards,\nThe ${process.env.APP_NAME} Team"`,
        }
        await sendEmail(emailOptions);
    }
    catch (err) {
        user.set("passwordResetCode", undefined);
        user.set("passwordResetExpires", undefined);
        user.set("passwordResetVerified", undefined);
        await user.save();
        throw new AppError(500, "cannot send password reset code email");
    }
}

export const verifyResetCode = async (req) => {
    const { email, resetCode } = req.body;
    const user = await getUserByEmail(email);
    if (!user) {
        throw new AppError(404, `there is no user with this email ${email}`)
    }
    const isValidResetCode = await bcrypt.compare(resetCode, user.passwordResetCode!);
    if (!isValidResetCode || (user.passwordResetExpires!.getTime() < Date.now())) {
        throw new AppError(400, `reset code is invalid or expired`)
    }
    user.passwordResetVerified = true;
    console.log(true)
    await user.save();
}

export const resetPassword = async (req) => {
    const { email, password } = req.body;
    const user = await getUserByEmail(email);
    if (!user) {
        throw new AppError(404, `there is no user with this email ${email}`)
    }
    let token;
    if (user.passwordResetVerified) {
        user.password = password
        user.set("passwordResetCode", undefined);
        user.set("passwordResetExpires", undefined);
        user.set("passwordResetVerified", undefined);
        await user.save();
        token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: process.env.JWT_EXPIRE_DATE! as StringValue })
    }
    return token;
}
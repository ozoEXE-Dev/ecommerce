import AppError from "../errors/AppError.js";
import * as authService from "../services/auth_service.js";
import "dotenv/config"



// @desc sign up a user
// @route post /api/v1/auth/signup
// @access public
export const signup = async (req, res, next) => {
    const userAndToken = await authService.signup(req.body);
    if (!userAndToken.user) {
        throw new AppError(404, "user not created");
    }
    if (!userAndToken.token) {
        throw new AppError(500, "token is not created");
    }
    res.status(201).send({ data: userAndToken.user, token: userAndToken.token })
}

// @desc sign in a user
// @route post /api/v1/auth/signin
// @access public
export const signin = async (req, res, next) => {
    const userAndToken = await authService.signin(req.body);
    if (!userAndToken.token) {
        throw new AppError(500, "token is not created");
    }

    res.status(200).send({ data: userAndToken.user, token: userAndToken.token });
}

// @desc protect routes using authentication
// @route middleware for protected routes
// @access private
export const protect = async (req, res, next) => {
    console.log(req.headers)
    req.user = await authService.protect(req);
    next();
}

// @desc restrict access to specified user roles
// @route middleware for role-restricted routes
// @access private
export const allowedFor = (...roles) => async (req, res, next) => {
    const userRole = req.user.role;
    if (!roles.includes(userRole)) {
        throw new AppError(403, "you are not permitted to access this route");
    }
    next();
}

// @desc send a password reset code
// @route post /api/v1/auth/forgetPassword
// @access public
export const forgetPassword = async (req, res, next) => {
    await authService.forgetPassword(req.body);
    res.status(200).json({ success: true, message: "password reset code email has been sent" })
}

// @desc verify a password reset code
// @route post /api/v1/auth/verifyResetCode
// @access public
export const verifyResetCode = async (req, res, next) => {
    await authService.verifyResetCode(req);
    res.status(200).json({ status: "success", message: "reset code verified" });
}

// @desc reset a user's password
// @route patch /api/v1/auth/resetPassword
// @access public
export const resetPassword = async (req, res, next) => {
    const token = await authService.resetPassword(req);
    if (token) {
        res.status(200).json({ token })
    }else{
        res.status(400).json({status:"failed", message: "couldn't reset your password make sure you verified the reset code"})
    }
}


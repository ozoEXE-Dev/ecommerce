import { validationResult, } from "express-validator";
import type { Request, Response } from "express";
const validatorMiddleware = (req: Request, res: Response, next) => {
    const validationResults = validationResult(req);
    if (!validationResults.isEmpty()) {
        return res.status(400).json({errors: validationResults.array()});
    }
    next();
}
export default validatorMiddleware;
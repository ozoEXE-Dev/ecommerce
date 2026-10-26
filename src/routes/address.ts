import { protect, allowedFor } from "../controllers/auth_controller.js";
import { Router } from "express";
import * as addressValidator from "../utils/validators/address_validator.js"
import * as addressController from "../controllers/address_controller.js"
const addressesRouter = Router();

addressesRouter.post("/api/v1/addresses", protect, allowedFor("user"), addressValidator.createAddressValidator, addressController.addAddress);
addressesRouter.delete("/api/v1/addresses/:id", protect, allowedFor("user"), addressValidator.deleteAddressValidator, addressController.deleteAddress);
addressesRouter.get("/api/v1/addresses/me", protect, allowedFor("user"), addressController.getMyaddress)
addressesRouter.patch("/api/v1/addresses/:id", protect, allowedFor("user"), addressValidator.updateAddressValidator, addressController.updateAddress)

export default addressesRouter;
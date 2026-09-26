import type { Request, Response } from "express";
import AppError from "../errors/AppError.js";

export const deleteOne = (service) => async (req: Request<{ id: string }>, res: Response) => {
    const id = req.params.id;
    const deletedDocument = await service(id);
    if (!deletedDocument) {
        throw new AppError(404, "there is no document with this id: " + id);
    }
    res.status(200).send({ data: deletedDocument });
}

export const updateOne = (service) => async (req: Request<{ id: string }>, res: Response) => {
    const id = req.params.id;
    const body = req.body;
    const updatedDocument = await service(id, body);
    if (!updatedDocument) {
        throw new AppError(404, "there is no document with this id: " + id);
    }
    res.status(200).send({ data: updatedDocument });
}

export const createOne = (service) => async (req: Request, res: Response) => {
    const { body } = req
    const createdDocument = await service(body);
    return res.status(201).send({ data: createdDocument });
}

export const getOne = (service) => async (req: Request<{ id: string }>, res: Response) => {
    const id = req.params.id!;
    const document = await service(id);
    if (!document) {
        throw new AppError(404, "document not found");
    }
    return res.status(200).json({ data: document });
}

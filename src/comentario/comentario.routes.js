import { Router } from "express";
import { comentarioPost, comentarioPut, comentarioDelete } from "./comentario.controller.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router();

// Ruta para crear un comentario
router.post(
    "/",
    validarJWT,
    comentarioPost
);

// Ruta para actualizar un comentario
router.put("/:id", validarJWT, comentarioPut);

// Ruta para eliminar un comentario
router.delete("/:id", validarJWT, comentarioDelete);

export default router;

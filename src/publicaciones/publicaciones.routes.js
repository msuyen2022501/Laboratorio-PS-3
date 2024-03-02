import { Router } from "express";
import { check } from "express-validator";
import { publicacionesGet, publicacionesPost, publicacionPut, publicacionDelete } from "./publicaciones.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router();

router.get("/", publicacionesGet);

router.post(
  "/",
  validarJWT,
  [
    check("titulo", "El nombre es obligatorio").not().isEmpty(),
    check("categoria", "La categoria es obligatoria").not().isEmpty(),
    check("texto", "El texto es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  publicacionesPost
);

router.put("/:id", validarJWT, publicacionPut);

router.delete("/:id", validarJWT, publicacionDelete); 

export default router;

import { body, param } from "express-validator";
import { commentExist } from "../helpers/db-validators.js";
import { validarCampos } from "./validate-fields.js";
import { handleErrors } from "./handle-errors.js";
import { validateJWT } from "./validate-jwt.js";
import { hasRoles } from "./validate-roles.js";


export const createValidator = [
    validateJWT,
    //Utilizamos el metodo para validar o permitir varios roles.
    hasRoles("USER_ROLE"),
    body("content").notEmpty().withMessage("El Contenido es requerido"),
    validarCampos,
    handleErrors
]

export const getCommentValidator = [
    validateJWT,
    //Utilizamos el metodo para validar o permitir varios roles.
    hasRoles("USER_ROLE"),
    validarCampos,
    handleErrors
]

export const deleteCommentValidator = [
    validateJWT,
    //Utilizamos el metodo para validar o permitir varios roles.
    hasRoles("USER_ROLE"),
    param("id").isMongoId().withMessage("No es un ID válido de MongoDB"),
    param("id").custom(commentExist),
    validarCampos,
    handleErrors
]


export const updateCommentValidator = [
    validateJWT,
    //Utilizamos el metodo para validar o permitir varios roles.
    hasRoles("USER_ROLE"),
    param("id", "No es un ID válido").isMongoId(),
    param("id").custom(commentExist),
    validarCampos,
    handleErrors
]




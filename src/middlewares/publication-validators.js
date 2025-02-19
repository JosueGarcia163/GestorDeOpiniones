import { body, param } from "express-validator";
import { publicationExist, namePublicationExists } from "../helpers/db-validators.js";
import { validarCampos } from "./validate-fields.js";
import { deleteFileOnError } from "./delete-file-on-error.js";
import { handleErrors } from "./handle-errors.js";
import { validateJWT } from "./validate-jwt.js";
import { hasRoles } from "./validate-roles.js";

export const createValidator = [
    validateJWT,
    //Utilizamos el metodo para validar o permitir varios roles.
    hasRoles("USER_ROLE"),
    body("title").notEmpty().withMessage("El titulo es requerido"),
    body("title").custom(namePublicationExists),
    body("text").notEmpty().withMessage("El texto es requerido"),
    validarCampos,
    deleteFileOnError,
    handleErrors
]

export const getPublicationValidator = [
    validateJWT,
    //Utilizamos el metodo para validar o permitir varios roles.
    hasRoles("USER_ROLE"),
    validarCampos,
    handleErrors
]

export const deletePublicationValidator = [
    validateJWT,
    //Utilizamos el metodo para validar o permitir varios roles.
    hasRoles("USER_ROLE"),
    param("id").isMongoId().withMessage("No es un ID válido de MongoDB"),
    param("id").custom(publicationExist),
    validarCampos,
    handleErrors
]


export const updatePublicationValidator = [
    validateJWT,
    //Utilizamos el metodo para validar o permitir varios roles.
    hasRoles("USER_ROLE"),
    param("id", "No es un ID válido").isMongoId(),
    param("id").custom(publicationExist),
    validarCampos,
    handleErrors
]



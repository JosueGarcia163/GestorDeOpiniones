import { Router } from "express"
import {getCategories, createCategories, deleteCategory, updateCategory } from "./category.controller.js"
import { createValidator, getCategoriesValidator, deleteCategoriesValidator, updateCategoriesValidator } from "../middlewares/category-validators.js"

const router = Router()

/**
* @swagger
* /categories/createCategories:
*   post:
*     summary: Crea una nueva categoría
*     tags: [Categories]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               name:
*                 type: string
*                 description: Nombre de la categoría
*     responses:
*       201:
*         description: Categoría creada exitosamente
*       400:
*         description: Error en la solicitud
*       403:
*         description: No autorizado para crear categorías
*       500:
*         description: Error en el servidor
*/

router.post("/createCategories", createValidator, createCategories)

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Obtiene todas las categorías
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Lista de categorías obtenida con éxito
 *       500:
 *         description: Error al obtener las categorías
 */


router.get("/", getCategoriesValidator, getCategories)


/**
 * @swagger
 * /categories/update:
 *   put:
 *     summary: Actualiza una categoría existente
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Categoría actualizada con éxito
 *       400:
 *         description: Datos inválidos para la actualización
 *       500:
 *         description: Error al actualizar la categoría
 */

router.put("/updateCategories/:id", updateCategoriesValidator, updateCategory)

/**
 * @swagger
 * /categories/delete:
 *   delete:
 *     summary: Elimina una categoría
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Categoría eliminada con éxito
 *       400:
 *         description: Datos inválidos para la eliminación
 *       500:
 *         description: Error al eliminar la categoría
 */

router.delete("/deleteCategories/:id", deleteCategoriesValidator, deleteCategory)



export default router
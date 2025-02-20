import { Router } from "express"
import { getPublication, createPublication, updatePublication, deletePublication } from "./publication.controller.js"
import { createValidator, getPublicationValidator, deletePublicationValidator, updatePublicationValidator } from "../middlewares/publication-validators.js"

const router = Router()


/**
 * @swagger
 * /createPublication:
 *   post:
 *     summary: Crea una nueva publicación
 *     tags: [Publication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Nueva Publicación"
 *               text:
 *                 type: string
 *                 example: "Contenido de la publicación"
 *               category:
 *                 type: string
 *                 example: "60d0fe4f5311236168a109f1"  # ID de una categoría existente
 *     responses:
 *       201:
 *         description: Publicación creada exitosamente
 *       400:
 *         description: Datos inválidos o falta información
 *       500:
 *         description: Error interno del servidor
 */



router.post("/createPublication", createValidator, createPublication)

/**
 * @swagger
 * /:
 *   get:
 *     summary: Obtiene una lista de todas las publicaciones
 *     tags: [Publication]
 *     parameters:
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           example: 10
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Publicaciones obtenidas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "60d0fe4f5311236168a109f1"
 *                   title:
 *                     type: string
 *                     example: "Título de la publicación"
 *                   text:
 *                     type: string
 *                     example: "Contenido de la publicación"
 *                   category:
 *                     type: string
 *                     example: "60d0fe4f5311236168a109f1"  # ID de una categoría
 *                   createdBy:
 *                     type: string
 *                     example: "60d0fe4f5311236168a109f2"  # ID de un usuario
 *                   status:
 *                     type: boolean
 *                     example: true
 *       500:
 *         description: Error interno del servidor
 */


router.get("/", getPublicationValidator, getPublication)

/**
 * @swagger
 * /updatePublication/{id}:
 *   put:
 *     summary: Actualiza una publicación existente por ID
 *     tags: [Publication]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "60d0fe4f5311236168a109f1"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Título actualizado"
 *               text:
 *                 type: string
 *                 example: "Contenido actualizado"
 *               category:
 *                 type: string
 *                 example: "60d0fe4f5311236168a109f1"  # ID de una categoría existente
 *               status:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Publicación actualizada exitosamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Publicación no encontrada
 *       500:
 *         description: Error interno del servidor
 */


router.put("/updatePublication/:id", updatePublicationValidator, updatePublication)

/**
 * @swagger
 * /deletePublication/{id}:
 *   delete:
 *     summary: Elimina una publicación por ID
 *     tags: [Publication]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "60d0fe4f5311236168a109f1"
 *     responses:
 *       200:
 *         description: Publicación eliminada exitosamente
 *       404:
 *         description: Publicación no encontrada
 *       500:
 *         description: Error interno del servidor
 */



router.delete("/deletePublication/:id", deletePublicationValidator, deletePublication)



export default router
import { Router } from "express"
import { createComment, getComment, updateComment, deleteComment } from "./comment.controller.js"
import { createValidator, getCommentValidator, deleteCommentValidator, updateCommentValidator } from "../middlewares/comment-validators.js"

const router = Router()



/**
 * @swagger
 * /createComment:
 *   post:
 *     summary: Crea un nuevo comentario en una publicación
 *     tags: [Comment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 maxLength: 75
 *                 example: "Este es un comentario de prueba"
 *               publication:
 *                 type: string
 *                 example: "publicacion1"  # nombre de la publicación donde se agregará el comentario
 *     responses:
 *       201:
 *         description: Comentario creado exitosamente
 *       400:
 *         description: Datos inválidos o falta información
 *       403:
 *         description: No autorizado para crear comentarios
 *       500:
 *         description: Error interno del servidor
 */
router.post("/createComment", createValidator, createComment)

/**
 * @swagger
 * /comments:
 *   get:
 *     summary: Obtiene todos los comentarios disponibles
 *     tags: [Comment]
 *     responses:
 *       200:
 *         description: Lista de comentarios obtenida correctamente
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
 *                   content:
 *                     type: string
 *                     example: "Este es un comentario"
 *                   createdBy:
 *                     type: string
 *                     description: ID del usuario que creó el comentario
 *                     example: "nombreUser"
 *                   publication:
 *                     type: string
 *                     description: ID de la publicación a la que pertenece el comentario
 *                     example: "Publicacion1"
 *                   status:
 *                     type: boolean
 *                     description: Estado del comentario (activo/inactivo)
 *                     example: true
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-02-21T00:00:00Z"
 *       400:
 *         description: Error en la solicitud
 *       500:
 *         description: Error interno del servidor
 */



router.get("/", getCommentValidator, getComment)

/**
 * @swagger
 * /updateComment/{id}:
 *   put:
 *     summary: Actualiza un comentario existente
 *     tags: [Comment]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del comentario a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 maxLength: 75
 *                 example: "Este comentario ha sido actualizado"
 *     responses:
 *       200:
 *         description: Comentario actualizado exitosamente
 *       400:
 *         description: Datos inválidos o error en la solicitud
 *       404:
 *         description: Comentario no encontrado
 *       500:
 *         description: Error interno del servidor
 */

router.put("/updateComment/:id", updateCommentValidator, updateComment)

/**
 * @swagger
 * /deleteComment/{id}:
 *   delete:
 *     summary: Elimina un comentario por su ID
 *     tags: [Comment]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del comentario a eliminar
 *     responses:
 *       200:
 *         description: Comentario eliminado exitosamente
 *       400:
 *         description: Error en la solicitud
 *       404:
 *         description: Comentario no encontrado
 *       500:
 *         description: Error interno del servidor
 */

router.delete("/deleteComment/:id", deleteCommentValidator, deleteComment)



export default router
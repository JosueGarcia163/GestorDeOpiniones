import { Router } from "express"
import { createComment, getComment, updateComment, deleteComment} from "./comment.controller.js"
import { createValidator, getCommentValidator, deleteCommentValidator, updateCommentValidator } from "../middlewares/comment-validators.js"

const router = Router()

router.post("/createComment", createValidator, createComment)


router.get("/", getCommentValidator, getComment)


router.put("/updateComment/:id", updateCommentValidator, updateComment)


router.delete("/deleteComment/:id", deleteCommentValidator, deleteComment)






export default router
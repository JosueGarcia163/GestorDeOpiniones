import { Router } from "express"
import {getPublication, createPublication, updatePublication, deletePublication } from "./publication.controller.js"
import { createValidator, getPublicationValidator, deletePublicationValidator, updatePublicationValidator } from "../middlewares/publication-validators.js"

const router = Router()


router.post("/createPublication", createValidator, createPublication)



router.get("/", getPublicationValidator, getPublication)



router.put("/updatePublication/:id", updatePublicationValidator, updatePublication)



router.delete("/deletePublication/:id", deletePublicationValidator, deletePublication)



export default router
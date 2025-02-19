import { hash, verify } from "argon2";
import User from "../user/user.model.js"
import Category from "../category/category.model.js";
import Publication from "./publication.model.js";
import fs from "fs/promises"
import { join, dirname } from "path"
import { fileURLToPath } from "url"


export const createPublication = async (req, res) => {
    try {
        
        //desestructuramos los objetos del req.body de publicacion.
        const { title, text, category } = req.body;
        const user = req.usuario
        

        const existingCategory = await Category.findOne({ name: category })
        if (!existingCategory) {
            return res.status(404).json({ message: "No se encontro categoria en la db" });
        }

        const publication = new Publication({
            title,
            text,
            createdBy: user._id,
            category: existingCategory._id
        });

        // validacion para confirmar que el rol del usuario para crear publicaciones sea unicamente el user.
        if (user.role !== 'USER_ROLE') {
            return res.status(403).json({ message: 'Las publicaciones las pueden hacer unicamente los usuarios' });
        }

        await publication.save();

        res.status(200).json({
            success: true,
            publication
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear la publicacion.', error: error.message });
    }
};

export const getPublication = async (req, res) => {
    try {
        const query = { status: true };
        const publicacion = await Publication.find(query)
        //Buscamos el atributo name y surname por medio del campo que hace referenca a user dentro de publicacion
        .populate("createdBy", "name surname")
        //Buscamos el atributo name y description por medio del campo que hace referenca a categorias dentro de publicacion
        .populate("category", "name description")
        return res.status(200).json({
            success: true,
            publicacion
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al obtener los usuarios",
            error: err.message
        })
    }
}






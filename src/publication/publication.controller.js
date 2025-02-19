import User from "../user/user.model.js"
import Category from "../category/category.model.js";
import Publication from "./publication.model.js";


export const createPublication = async (req, res) => {
    try {

        //desestructuramos los objetos del req.body de publicacion.
        const { title, text, category } = req.body;
        const user = req.usuario

        // validacion para confirmar que el rol del usuario para crear publicaciones sea unicamente el user.
        if (user.role !== 'USER_ROLE') {
            return res.status(403).json({ message: 'Las publicaciones las pueden hacer unicamente los usuarios' });
        }

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

export const updatePublication = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, text, category } = req.body;
        const user = req.usuario

        const publicacion = await Publication.findById(id)
        
        if (!publicacion) {
            return res.status(404).json({
                success: false,
                msg: "Publicacion no encontrada",
            });
        }

        const existingCategory = await Category.findOne({ name: category })
        if (!existingCategory) {
            return res.status(404).json({ message: "No se encontro categoria en la db" });
        }

        if (publicacion.createdBy.toString() !== user.id) {
            return res.status(403).json({
                message: 'Las publicaciones las pueden hacer unicamente los usuarios que las crearon'
            });
        }

        publicacion.title = title || publicacion.title;
        publicacion.text = text || publicacion.text;
        publicacion.category = existingCategory._id;

        await publicacion.save();

        res.status(200).json({
            success: true,
            msg: 'Publicacion Actualizada',
            publicacion,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error al actualizar la publicacion",
            error,
        });
    }
}







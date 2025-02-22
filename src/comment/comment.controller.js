import Publication from "../publication/publication.model.js";
import Comment from "./comment.model.js";


export const createComment = async (req, res) => {
    try {

        //desestructuramos los objetos del req.body de comment.
        const { content, publication } = req.body;
        const user = req.usuario

        // validacion para confirmar que el rol del usuario para crear comentarios sea unicamente el user.
        if (user.role !== 'USER_ROLE') {
            return res.status(403).json({ message: 'Los comentarios las pueden hacer unicamente los usuarios' });
        }

        const existingPublication = await Publication.findOne({ title: publication })
        if (!existingPublication) {
            return res.status(404).json({ message: "No se encontro publicacion en la db" });
        }

        const comment = new Comment({
            content,
            createdBy: user._id,
            publication: existingPublication._id
        });


        await comment.save();


        await Publication.findByIdAndUpdate(
            existingPublication._id,
            { $push: { comments: comment._id } },
            { new: true }
        );

        res.status(200).json({
            success: true,
            comment
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el comentario.', error: error.message });
    }
};


export const getComment = async (req, res) => {
    try {
        const query = { status: true };
        const comment = await Comment.find(query)
            //Buscamos el atributo name y surname por medio del campo que hace referenca a user dentro de comentarios
            .populate("createdBy", "name surname")
            //Buscamos el atributo title y text por medio del campo que hace referenca a publicacion dentro de comentarios
            .populate("publication", "title text")
        return res.status(200).json({
            success: true,
            comment
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al obtener los Comentarios",
            error: err.message
        })
    }
}


export const updateComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;
        const user = req.usuario

        const comment = await Comment.findById(id)

        if (!comment) {
            return res.status(404).json({
                success: false,
                msg: "comentario no encontrado",
            });
        }

        /*Esta validacion la hago para buscar por medio del campo de usuario dentro de comentario sea igual al
        id de usuario que se esta validando en el token.
        */
        if (comment.createdBy.toString() !== user.id) {
            return res.status(403).json({
                message: 'Los comentarios las pueden editar unicamente los usuarios que las crearon'
            });
        }

        comment.content = content || comment.content;


        await comment.save();

        res.status(200).json({
            success: true,
            msg: 'Comentario Actualizado',
            comment,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error al actualizar el comentario.",
            error,
        });
    }
}


export const deleteComment = async (req, res) => {
    try {
        const { id } = req.params
        const user = req.usuario

        const comment = await Comment.findById(id)

        //validamos que el comentario no venga vacio.
        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "comentario no encontrado"
            });
        }

        //Validamos para ver si el comentario ya esta eliminada.
        if (comment.status == "false") {
            return res.status(400).json({
                success: false,
                message: "El comentario ya ha sido eliminada previamente."
            })
        }

        if (comment.createdBy.toString() !== user.id) {
            return res.status(403).json({
                message: 'Los comentarios solo las puede eliminar el usuario que las creo.'
            });
        }


        const updateComment = await Comment.findByIdAndUpdate(
            id,
            { status: false },
            { new: true }
        )

        //Saco del arreglo de publicaciones el comentario que elimine.
        await Publication.updateMany(
            { comments: id },
            { $pull: { comments: id } }
        );

        return res.status(200).json({
            success: true,
            message: "Comentario eliminado.",
            comment: updateComment
        })


    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error al eliminar el comentario.",
            error,
        });
    }
}











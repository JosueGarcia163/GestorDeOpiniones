import { hash, verify } from "argon2";
import User from "./user.model.js"
import fs from "fs/promises"
import { join, dirname } from "path"
import { fileURLToPath } from "url"


const __dirname = dirname(fileURLToPath(import.meta.url))

export const getUserById = async (req, res) => {
    try {
        const { _id } = req.usuario
        const user = await User.findById(_id)
        

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado"
            })
        }

        /*Miramos que el usuario que esta intentando listar sea ADMIN_ROLE y que si quiere listar a otro ADMIN_ROLE
        que no sea a si mismo, no pueda hacerlo.
        */
        if (req.usuario.role === "ADMIN_ROLE" && user.role === "ADMIN_ROLE" && req.usuario._id !== _id) {
            return res.status(403).json({
                success: false,
                message: "No tienes permisos para ver este usuario"
            });
        }

        return res.status(200).json({
            success: true,
            user
        })

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al obtener el usuario",
            error: err.message
        })
    }
}

export const getUsers = async (req, res) => {
    try {
        const { limite = 5, desde = 0 } = req.query
        const query = { status: true }

        const [total, users] = await Promise.all([
            User.countDocuments(query),
            User.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
        ])

        return res.status(200).json({
            success: true,
            total,
            users
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al obtener los usuarios",
            error: err.message
        })
    }
}


export const updatePassword = async (req, res) => {
    try {
        const { _id } = req.usuario
        const { beforePassword, newPassword } = req.body

        const user = await User.findById(_id)

        if(!user){
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado"
            });
        }

        if (req.usuario.role === "USER_ROLE" && req.usuario._id !== _id) {
            return res.status(403).json({
                success: false,
                message: "No tienes permisos para cambiar la contraseña a otro usuario que no sea el tuyo."
            });
        }

        /*Miramos que el usuario que esta intentando actualizar sea ADMIN_ROLE y que si quiere actualizar a otro ADMIN_ROLE
        que no sea a si mismo, no pueda hacerlo.
        */
        if (req.usuario.role === "ADMIN_ROLE" && user.role === "ADMIN_ROLE" && req.usuario._id !== _id) {
            return res.status(403).json({
                success: false,
                message: "No tienes permisos para cambiar la contraseña a otro admin"
            });
        }

        if(!beforePassword){
            return res.status(404).json({
                success: false,
                message: "debes de colocar la password anterior."
            });

        }

        //Verificar la password anterior colocada en el body, con la password de la db.
        const VerifybeforePassword = await verify(user.password, beforePassword);
        if(!VerifybeforePassword){
            return res.status(400).json({
                success: false,
                message: "La contraseña actual es incorrecta"
            });
        }


        const matchOldAndNewPassword = await verify(user.password, newPassword)

        if (matchOldAndNewPassword) {
            return res.status(400).json({
                success: false,
                message: "La nueva contraseña no puede ser igual a la anterior"
            })
        }

        const encryptedPassword = await hash(newPassword)

        await User.findByIdAndUpdate(_id, { password: encryptedPassword }, { new: true })

        return res.status(200).json({
            success: true,
            message: "Contraseña actualizada",
        })

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al actualizar contraseña",
            error: err.message
        })
    }
}

export const updateUser = async (req, res) => {
    try {
        const { _id } = req.usuario
        const userToUpdate = await User.findById(_id)

        if (!userToUpdate) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado"
            });
        }

        if (req.usuario.role === "ADMIN_ROLE") {
            return res.status(403).json({
                success: false,
                message: "EL ADMIN no se puede modificar."
            });
        }

        if (req.usuario.role === "USER_ROLE" && req.usuario._id !== _id) {
            return res.status(403).json({
                success: false,
                message: "No tienes permisos para cambiar datos de otro usuario que no sea el tuyo."
            });
        }

        const data = req.body;
     
        /*Miramos que el usuario que esta intentando actualizar sea ADMIN_ROLE y que si quiere actualizar a otro ADMIN_ROLE
        que no sea a si mismo, no pueda hacerlo.
        */
        if (req.usuario.role === "ADMIN_ROLE" && userToUpdate.role === "ADMIN_ROLE" && req.usuario._id !== _id) {
            return res.status(403).json({
                success: false,
                message: "No tienes permisos para actualizar a otro admin."
            });
        }

        /*Aqui valido de que si el usuario se pone como admin o otro rol distinto a user_role
        no le deje cambiarselo, unicamente user.*/ 
        if(data.role && data.role !== "USER_ROLE"){
            return res.status(400).json({
                message: "Tu solamente te puedes ser: USER_ROLE"
            });
        }

        const user = await User.findByIdAndUpdate(_id, data, { new: true });

        res.status(200).json({
            success: true,
            msg: 'Usuario Actualizado',
            user,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            msg: 'Error al actualizar usuario',
            error: err.message
        });
    }
}

//Agregamos metodo para actualizar imagen
export const updateProfilePicture = async (req, res) => {
    try {
        const { _id } = req.usuario
        const userToUpdate = await User.findById(_id)

        if (!userToUpdate) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado"
            });
        }

        if (req.usuario.role === "USER_ROLE" && req.usuario._id !== _id) {
            return res.status(403).json({
                success: false,
                message: "No tienes permisos para cambiar datos de otro usuario que no sea el tuyo."
            });
        }

         /*Miramos que el usuario que esta intentando actualizar sea ADMIN_ROLE y que si quiere actualizar a otro ADMIN_ROLE
        que no sea a si mismo, no pueda hacerlo.
        */
        if (req.usuario.role === "ADMIN_ROLE" && userToUpdate.role === "ADMIN_ROLE" && req.usuario._id !== _id) {
            return res.status(403).json({
                success: false,
                message: "No tienes permisos para actualizar otro usuario ADMIN"
            });
        }
        let newProfilePicture = req.file ? req.file.filename : null
        if (!newProfilePicture) {
            return res.status(400).json({
                success: false,
                message: "No hay archivo en la petición"
            })
        }
        const user = await User.findById(_id)
        if (user.profilePicture) {
            const oldProfilePicture = join(__dirname, "../../public/uploads/profile-pictures", user.profilePicture)
            await fs.unlink(oldProfilePicture)
        }
        user.profilePicture = newProfilePicture
        await user.save()
        return res.status(200).json({
            success: true,
            message: "Foto actualizada",
            profilePicture: user.profilePicture,
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al actualizar la foto",
            error: err.message
        })
    }
}

/*Funcion para crear usuario por default*/ 
export const createDefaultUser = async () => {
    try {
        /*Agregamos la constante de email por default antes 
        debido a que necesitamos este email para buscar si ya existe.
        */
        const defaultEmail = "admin@example.com";

        /*Aqui en este apartado buscamos si existe el usuario en la base de datos
        por medio de defaultEmail.
        */ 
        const existingUser = await User.findOne({ email: defaultEmail });
        //Si ya existe tira esta validacion y no hara nada.
        if (existingUser) {
            console.log("El usuario administrador ya existe. No se creará nuevamente.");
            return;
        }

        //Si no esta el usuario creado encriptara esta password con argon.
        const hashedPassword = await hash("Admin1234#/SFDS=)");

        /*Definimos los valores por default del usuario.*/ 
        const defaultUser = new User({
            name: "Admin",
            surname: "User",
            username: "admin",
            email: defaultEmail,
            password: hashedPassword,
            phone: "12345678",
            role: "ADMIN_ROLE",
            status: true,
        });

        //Lo guardamos en la base de datos.
        await defaultUser.save();

        //Mandamos un console log en consola para dar a entender de que se creo perfectamente.
        console.log("Usuario administrador creado exitosamente.");
    } catch (error) {
        console.error("Error al crear el usuario administrador:", error.message);
    }
};
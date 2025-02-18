import { hash, verify } from "argon2";
import Categories from "./category.model.js"
import User from "../user/user.model.js"
import fs from "fs/promises"
import { join, dirname } from "path"
import { fileURLToPath } from "url"


const __dirname = dirname(fileURLToPath(import.meta.url))

export const createCategories = async (req, res) => {
    try {

        const data = req.body;
        const user = req.usuario
        console.log(user._id)
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Propietario no encontrado'
            });
        }

        const categories = new Categories({
            ...data,
            createdBy: user._id,
        });


        //Validacion por si no encontramos el usuario.
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // validacion para confirmar que el rol del usuario para crear cursos sea unicamente el admin.
        if (user.role !== 'ADMIN_ROLE') {
            return res.status(403).json({ message: 'No tienes permiso para crear categorias' });
        }

        await categories.save();

        res.status(200).json({
            success: true,
            categories
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear la categoria', error: error.message });
    }
};

export const getCategories = async (req, res) => {
    try {
        const categories = await Categories.find().populate("createdBy", "name surname")

        return res.status(200).json({
            success: true,
            categories
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al obtener los usuarios",
            error: err.message
        })
    }
}

//Funcion para editar category
export const updateCategory = async (req, res) => {
    try {
      const { id } = req.params;
      const data = req.body;

      const category = await Categories.findById(id)
        if(!category){
            return res.status(404).json({
                success: false,
                msg: "Cita no encontrada",
              });
        }

      //Validamos que el usuario exista en la base de datos.
      const user =  await User.findById(data.createdBy);
      if (!user) {
        return res.status(404).json({
          success: false,
          msg: "Usuario no encontrado",
        });
      }
  
      const updatedCategory = await Categories.findByIdAndUpdate(id, data, { new: true });
  
      return res.status(200).json({
        success: true,
        msg: "Categoria actualizada correctamente",
        category: updatedCategory,
      });
  
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        msg: "Error al actualizar la cita",
        error,
      });
    }
  };


  //Funcion para eliminar la category.
  export const deleteCategory = async (req, res) => {
    try {
      const { id } = req.params
  
      const category = await Categories.findById(id)
  
      //si la categoria esta vacia
      if (!category){
        return res.status(404).json({
          success: false,
          message:"categoria no encontrada"
        });
      }
  
      //validacion para ver si la categoria ya esta eliminada.
      if(category.status == "false"){
        return res.status(400).json({
          success: false,
          message: "La categoria ya ha sido eliminada previamente"
  
        });
      }
  
      //despues de las validaciones hacemos que actualize el estado de la categoria.
      const updateCategory = await Categories.findByIdAndUpdate(  
        id,
        { status: false},
        {new: true}
      )
      return res.status(200).json({
        success: true,
        message: "Categoria eliminada.",
        category: updateCategory
      })
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Error al eliminar la categoria.",
        error: err.message
      })
    }
  }

/*Funcion para crear usuario por default*/ 
export const createDefaultCategory = async () => {
    try {
        /*Agregamos la constante de name por default antes 
        debido a que necesitamos este name para buscar si ya existe.
        */
        const defaultName = "CATEGORY_DEFAULT";

        /*Aqui en este apartado buscamos si existe la categoria en la base de datos
        por medio de defaultEmail.
        */ 
        const existingCategory = await Categories.findOne({ name: defaultName });
        //Si ya existe tira esta validacion y no hara nada.
        if (existingCategory) {
            console.log("La categoria ya existe. No se creará nuevamente.");
            return;
        }

        const defaultUser = await User.findOne({username: "admin"})
        if(!defaultUser){
            return res.status(404).json({
                success: false,
                message:"El usuario default no fue encontrado."
              });
        }

        /*Definimos los valores por default del usuario.*/ 
        const defaultCategory = new Categories({
            name: "CATEGORY_DEFAULT",
            description: "Esta es una categoria predeterminada.",
            createdBy: defaultUser._id,
            status: true
        });
        

        //Lo guardamos en la base de datos.
        await defaultCategory.save();

        //Mandamos un console log en consola para dar a entender de que se creo perfectamente.
        console.log("La Categoria default fue creada exitosamente.");
    } catch (error) {
        console.error("Error al crear la categoria default:", error.message);
    }
};






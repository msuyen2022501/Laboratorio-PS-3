import Comentario from "./comentario.model.js";
import Publicacion from "../publicaciones/publicaciones.model.js"; 


export const comentarioPost = async (req, res) => {
    const { contenido } = req.body;
    const { idPublicacion } = req.params;
    const usuarioId = req.user.id; 

    try {
      if (!contenido) {
        return res.status(400).json({ error: "El contenido del comentario es requerido" });
      }

      const publicacion = await Publicacion.findById(idPublicacion);

      if (!publicacion) {
        return res.status(404).json({ error: "La publicación no fue encontrada" });
      }

      const comentario = new Comentario({
        contenido,
        usuario: usuarioId,
        publicacion: idPublicacion
      });

      await comentario.save();

      res.status(200).json({ 
        publicacion: {
          _id: publicacion._id,
          titulo: publicacion.titulo,
          contenido: publicacion.contenido,
        },
        comentario: {
          _id: comentario._id,
          contenido: comentario.contenido,
        },
        mensaje: "Comentario agregado correctamente" 
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al agregar el comentario" });
    }
};



export const comentarioPut = async (req, res) => {
  const { id, idComentario } = req.params; 
  const { contenido } = req.body;
  const usuarioId = req.user.id; 

  try {
    const comentario = await Comentario.findById(idComentario);

    if (!comentario) {
      return res.status(404).json({ error: "Comentario no encontrado" });
    }

    if (comentario.usuario.toString() !== usuarioId) {
      return res.status(403).json({ error: "No tienes permiso para editar este comentario" });
    }

    comentario.contenido = contenido;
    await comentario.save();

    res.status(200).json({ comentario });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar el comentario" });
  }
};

export const comentarioDelete = async (req, res) => {
  const { id, idComentario } = req.params; 
  const usuarioId = req.user.id;

  try {
    const comentario = await Comentario.findById(idComentario);

    if (!comentario) {
      return res.status(404).json({ error: "Comentario no encontrado" });
    }

    if (comentario.usuario.toString() !== usuarioId) {
      return res.status(403).json({ error: "No tienes permiso para eliminar este comentario" });
    }

    await Comentario.findByIdAndDelete(idComentario);

    res.status(200).json({ mensaje: "Comentario eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar el comentario" });
  }
};

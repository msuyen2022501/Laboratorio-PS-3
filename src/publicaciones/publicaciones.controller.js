import { response, request } from "express";
import Publicaciones from "./publicaciones.model.js";

export const publicacionesGet = async (req = request, res = response) => {
  const { limite, desde } = req.query;
  const query = { estado: true };

  try {
    const [total, publicaciones] = await Promise.all([
      Publicaciones.countDocuments(query),
      Publicaciones.find(query)
        .populate("usuario")
        .skip(Number(desde))
        .limit(Number(limite)),
    ]);

    const publicacionesFormateadas = publicaciones.map((publicacion) => ({
      _id_publicacion: publicacion._id,
      titulo: publicacion.titulo,
      categoria: publicacion.categoria,
      texto: publicacion.texto,
      usuario: publicacion.usuario
        ? {
            _id_usuario: publicacion.usuario._id,
            nombre: publicacion.usuario.nombre,
          }
        : null,
      estado: publicacion.estado,
      google: publicacion.google,
    }));

    res.status(200).json({
      total,
      publicaciones: publicacionesFormateadas,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener las publicaciones" });
  }
};

export const publicacionesPost = async (req = request, res = response) => {
  const { titulo, categoria, texto } = req.body;

  const usuario = req.user;

  try {
    const publicacion = new Publicaciones({
      titulo,
      categoria,
      texto,
      usuario: usuario._id,
    });

    await publicacion.save();

    res.status(200).json({
      publicacion: {
        _id_publicacion: publicacion._id, 
        titulo: publicacion.titulo,
        categoria: publicacion.categoria,
        texto: publicacion.texto,
        usuario: {
          _id_usuario: usuario._id,
          nombre: usuario.nombre,
        },
        estado: publicacion.estado,
        google: publicacion.google,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al guardar la publicación" });
  }
};

export const publicacionPut = async (req, res) => {
  const { id } = req.params;
  const { titulo, categoria, texto } = req.body;

  try {
    const publicacion = await Publicaciones.findById(id);

    if (!publicacion) {
      return res.status(404).json({ error: "Publicación no encontrada" });
    }

    const updatedPublicacion = await Publicaciones.findByIdAndUpdate(
      id,
      { titulo, categoria, texto },
      { new: true }
    );

    res.status(200).json({ publicacion: updatedPublicacion });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar la publicación" });
  }
};


export const publicacionDelete = async (req, res) => {
  const { id } = req.params;

  try {
    const publicacion = await Publicaciones.findByIdAndDelete(id);

    if (!publicacion) {
      return res.status(404).json({ error: "Publicación no encontrada" });
    }

    res.status(200).json({ mensaje: "Publicación eliminada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar la publicación" });
  }
};

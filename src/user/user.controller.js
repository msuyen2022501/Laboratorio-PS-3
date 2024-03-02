import { response, request } from "express";
import bcryptjs from "bcryptjs";
import User from "./user.model.js";

export const userGet = async (req = request, res = response) => {
  const { limite, desde } = req.query;
  const query = { estado: true };

  const [total, users] = await Promise.all([
    User.countDocuments(query),
    User.find(query).skip(Number(desde)).limit(Number(limite)),
  ]);

  res.status(200).json({
    total,
    users,
  });
};

export const userPost = async (req, res) => {
  const { nombre, correo, password } = req.body;
  const user = new User({ nombre, correo, password });

  const salt = bcryptjs.genSaltSync();
  user.password = bcryptjs.hashSync(password, salt);

  await user.save();

  res.status(200).json({
    user,
  });
};

export const userPut = async (req, res) => {
  const { id } = req.params;
  const { nombre, contraseñaAnterior, nuevaContraseña } = req.body;

  try {
    if (!id || (!nombre && !contraseñaAnterior && !nuevaContraseña)) {
      return res
        .status(400)
        .json({
          error:
            "Se requiere el ID del usuario y al menos uno de los campos para actualizar",
        });
    }

    const usuario = await User.findById(id);

    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    if (contraseñaAnterior) {
      const contraseñaValida = bcryptjs.compareSync(
        contraseñaAnterior,
        usuario.password
      );
      if (!contraseñaValida) {
        return res
          .status(400)
          .json({
            error:
              "La contraseña anterior no es válida o no estas actualizando el id",
          });
      }
    } else {
      return res
        .status(400)
        .json({
          error:
            "Se requiere la contraseña anterior para actualizar la contraseña",
        });
    }

    if (nuevaContraseña && nuevaContraseña.length < 6) {
      return res
        .status(400)
        .json({
          error: "La nueva contraseña debe tener al menos 6 caracteres",
        });
    }

    const camposActualizados = { nombre };
    let respuesta = { usuario: null, contraseñaAnterior, nuevaContraseña };

    if (nuevaContraseña) {
      const hashedPassword = bcryptjs.hashSync(
        nuevaContraseña,
        bcryptjs.genSaltSync()
      );
      camposActualizados.password = hashedPassword;
    }

    const usuarioActualizado = await User.findByIdAndUpdate(
      id,
      camposActualizados,
      { new: true }
    );
    respuesta.usuario = usuarioActualizado;

    res.status(200).json(respuesta);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar el usuario" });
  }
};

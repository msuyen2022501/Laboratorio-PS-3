import mongoose from 'mongoose';

const comentarioSchema = new mongoose.Schema({
  contenido: {
    type: String,
    required: true
  },
  publicacion: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Publicaciones', 
    required: true
  },
  estado: {
    type: Boolean,
    default: true,
  },
  google: {
    type: Boolean,
    default: true,
  },
});

comentarioSchema.methods.toJSON = function () {
  const { __v, _id, ...comentarios } = this.toObject();
  return comentarios;
};

const Comentario = mongoose.model('Comentario', comentarioSchema);

export default Comentario;

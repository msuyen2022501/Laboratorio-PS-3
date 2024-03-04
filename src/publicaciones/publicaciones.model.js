import mongoose from 'mongoose';

const publicacionesSchema = mongoose.Schema({
  titulo: {
    type: String,
    required: [true, "El título es obligatorio"],
  },
  categoria: {
    type: String,
    required: [true, "La categoría es obligatoria"],
  },
  texto: {
    type: String,
    required: [true, "El texto es obligatorio"],
  },
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' 
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

publicacionesSchema.methods.toJSON = function () {
    const { __v, _id, ...publicaciones } = this.toObject();
    return publicaciones;
  };
  

export default mongoose.model('Publicaciones', publicacionesSchema);

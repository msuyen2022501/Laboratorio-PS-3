import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
  nombre: {
    type: String,
    required: [true, "El nombre es obligatorio"],
  },
  correo: {
    type: String,
    required: [true, "El correo es obligatorio"],
    unique: true,
  },
  password: {
    type: String,
  },
  img: {
    type: String,
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

userSchema.methods.toJSON = function () {
  const { __v, password, _id, ...user } = this.toObject();
  user.uid = _id;
  return user;
};

export default mongoose.model('User', userSchema);
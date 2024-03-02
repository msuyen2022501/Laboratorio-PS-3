import User from '../user/user.model.js';

export const existenteEmail = async (correo = '') => {
    const existeEmail = await User.findOne({ correo });

    if (existeEmail) {
        throw new Error(`El email ${correo} ya fue registrado`);
    }
}
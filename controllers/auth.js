const { response, json } = require("express");
const bcryptjs = require("bcryptjs");
const Usuario = require("../models/usuario");
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");

const login = async (req, res = response) => {
  const { correo, password } = req.body;
  try {
    //verificar si el correo exite

    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      return res.status(400).json({
        msg: "Usuario/Password no son correcto-correo ",
      });
    }

    // si el usuario esta activo

    if (!usuario.estado) {
      return res.status(400).json({
        msg: "Usuario/Password no son correctos - estado:false",
      });
    }

    //verificar la contraseña

    const validPassword = bcryptjs.compareSync(password, usuario.password);

    //comparesSync: compara si la contraseña introducida coincide con la contraseña que se encuentra en la BD
    if (!validPassword) {
      return res.status(400).json({
        msg: "Usuario/Password no son correctos - password",
      });
    }

    // generar el JWT

    const token = await generarJWT(usuario.id);

    res.json({
      usuario,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Hable con el administrador",
    });
  }
};

const googleSignin = async (req, res = response) => {
  const { id_token } = req.body;
  try {
    const { correo, nombre, img } = await googleVerify(id_token);

    let usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      //tengo que crearlo
      const data = {
        nombre,
        correo,
        //rol: DefaultTransporter, //le asigna un rol por default
                                // rol: "ADMIN_ROLE, USER_ROLE"
        password: ':P',
        img,
        google: true
    };
    usuario = new Usuario(data);
    await usuario.save();
    }
    //si el usuario en DB
    if (!usuario.estado) {
      return res.status(401).json({
        msg: "Hable con el administrador, usuario bloqueado",
      });
    }

    // generar el JWT

    const token = await generarJWT(usuario.id);

    res.json({
      // msg:'Todo bien',
      // id_token,
      // googleUser
      usuario,
      token,
    });
  } catch (error) {
    res.status(400).json({
      // ok:false,
      msg: "El token no se pudo verficar",
    });
  }
};

module.exports = {
  login,
  googleSignin,
};

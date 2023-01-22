const { response } = require("express");
const bcryptjs = require("bcryptjs"); //encripta contraseñas
const Usuario = require("../models/usuario");
const usuariosGet = async (req, res = response) => {
  // const { q, nombre = "luis", apikey } = req.query;
  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true };
  // const usuarios = await Usuario.find(query)
  //   .skip(Number(desde))
  //   .limit(Number(limite));
  //limite cantidaad maxima de usuarios
  //skip desde donde va a empezar a mostrar
  // const total = await Usuario.countDocuments(query);
  const [total, usuarios] = await Promise.all([
    Usuario.countDocuments(query),
    Usuario.find(query).skip(Number(desde)).limit(Number(limite)),
  ]);
  res.json({
    total,
    usuarios,
  });
};
const usuariosPut = async (req, res = response) => {
  const { id } = req.params;
  const { _id, password, google, correo, ...resto } = req.body;
  //todo validar contra base de datos
  if (password) {
    const salt = bcryptjs.genSaltSync();
    resto.password = bcryptjs.hashSync(password, salt);
  }
  const usuario = await Usuario.findByIdAndUpdate(id, resto); //encuentre y lo actualiza
  res.json(usuario);
};
const usuariosPost = async (req, res = response) => {
  const { nombre, correo, password, rol } = req.body;
  const usuario = new Usuario({ nombre, correo, password, rol });

  //encriptar la contraseña
  const salt = bcryptjs.genSaltSync();
  usuario.password = bcryptjs.hashSync(password, salt);

  //guardae en bd
  await usuario.save();
  res.json({
    // msg: "post api-controlador",
    usuario,
  });
};
//////
const usuariosDelete = async (req, res = response) => {
  const { id } = req.params;
  //fisicamente lo borramos
  // const usuario = await Usuario.findByIdAndDelete(id);
const usuario=await Usuario.findByIdAndUpdate(id,{estado:false})

  res.json({
    usuario,
    id,
    msg: "delete api-controlador",
  });
};
const usuariosPatch = (req, res = response) => {
  res.json({
    msg: "patch api-controlador",
  });
};

module.exports = {
  usuariosGet,
  usuariosPut,
  usuariosDelete,
  usuariosPatch,
  usuariosPost,
};

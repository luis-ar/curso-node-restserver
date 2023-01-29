const { Categoria } = require("../models");
const Role = require("../models/role");
const Usuario = require("../models/usuario");

const Producto = require("../models/producto");

const esRolValido = async (rol = "") => {
  const existeRol = await Role.findOne({ rol });
  if (!existeRol) {
    throw new Error(`El rol ${rol} no esta registrado en la BD`);
  }
};

const emailExiste = async (correo = "") => {
  //verificar correo existente
  const existeEmail = await Usuario.findOne({ correo });
  if (existeEmail) {
    throw new Error(`El correo: ${correo}, ya existe en la BD`);
  }
};

const existeUsuarioPorId = async (id) => {
  //verificar correo existente
  const existeUsuario = await Usuario.findById(id);
  if (!existeUsuario) {
    throw new Error(`El id no existe : ${id}`);
  }
};

const existeCategoriaPorId = async (id) => {
  //verificar id existente
  const existeCategoria = await Categoria.findById(id);
  if (!existeCategoria) {
    throw new Error(`El id no existe : ${id}`);
  }
};

const existeProductoPorId = async (id) => {
  //verificar id existente
  const existeProducto = await Producto.findById(id);
  if (!existeProducto) {
    throw new Error(`El id no existe : ${id}`);
  }
};

const coleccionesPermintidas = (coleccion = "", colecciones = []) => {
  const incluida = colecciones.includes(coleccion);
  if (!incluida) {
    throw new Error(
      `La coleccion ${coleccion} no esta permitida, ${colecciones}`
    );
  }
  return true;
};

module.exports = {
  esRolValido,
  emailExiste,
  existeUsuarioPorId,
  existeCategoriaPorId,
  existeProductoPorId,
  coleccionesPermintidas,
};

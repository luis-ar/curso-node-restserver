const { response } = require("express");
const { Categoria } = require("../models");
//obtenerCategoria-pagina-total-populate

const obtenerCategoria = async (req, res = response) => {
  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true };
  const [total, categorias] = await Promise.all([
    Categoria.countDocuments(query),
    Categoria.find(query)
      .populate("usuario", "nombre")
      .skip(Number(desde))
      .limit(Number(limite)),
  ]);
  res.json({
    total,
    categorias,
  });
};
////
//obtener categoria por id-publico
const obtenerCategoriaId = async (req, res = response) => {
  const { id } = req.params;
  const categoria = await Categoria.findById(id).populate("usuario", "nombre");
  res.json(categoria);
};
/////////
//crear categoria
const crearCategoria = async (req, res = response) => {
  const nombre = req.body.nombre.toUpperCase();
  const categoriaDB = await Categoria.findOne({ nombre });
  if (categoriaDB) {
    return res.status(400).json({
      mgs: `La categoria ${categoriaDB.nombre}, ya existe`,
    });
  }

  //generar la data a guardar

  const data = {
    nombre,
    usuario: req.usuario._id,
  };
  const categoria = new Categoria(data);
  //Guardar en DB
  await categoria.save();
  res.status(201).json(categoria);
};

/////////////
//actualizar categorias

const actualizarCategoria = async (req, res = response) => {
  const { id } = req.params;
  const { _id, estado, usuario, ...data } = req.body;
  //todo validar contra base de datos
  data.nombre = data.nombre.toUpperCase();
  data.usuario = req.usuario._id;
  const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true }); //encuentre y lo actualiza
  res.json(categoria);
};
//borrar categoria estado :false

const categoriaDelete = async (req, res = response) => {
  const { id } = req.params;

  const categoria = await Categoria.findByIdAndUpdate(id, { estado: false },{new:true});

  res.json({
    categoria,
  });
};
module.exports = {
  crearCategoria,
  obtenerCategoria,
  obtenerCategoriaId,
  actualizarCategoria,
  categoriaDelete,
};

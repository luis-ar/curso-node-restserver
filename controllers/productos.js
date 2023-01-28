const { response } = require("express");
const { Producto } = require("../models");
//obtenerProducto-pagina-total-populate

const obtenerProducto = async (req, res = response) => {
  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true };
  const [total, productos] = await Promise.all([
    Producto.countDocuments(query),
    Producto.find(query)
      .populate("usuario", "nombre")
      .populate("categoria", "nombre")
      .skip(Number(desde))
      .limit(Number(limite)),
  ]);
  res.json({
    total,
    productos,
  });
};
////
//obtener producto por id-publico
const obtenerProductoId = async (req, res = response) => {
  const { id } = req.params;
  const producto = await Producto.findById(id)
    .populate("usuario", "nombre")
    .populate("categoria", "nombre");
  res.json(producto);
};
/////////
//crear producto
const crearProducto = async (req, res = response) => {
  const { estado, usuario, ...body } = req.body;
  const productoDB = await Producto.findOne({ nombre:body.nombre });
  if (productoDB) {
    return res.status(400).json({
      mgs: `El producto ${productoDB.nombre}, ya existe`,
    });
  }

  //generar la data a guardar

  const data = {
    ...body,
    nombre: body.nombre.toUpperCase(),
    usuario: req.usuario._id,
  };
  const producto = new Producto(data);
  //Guardar en DB
  await producto.save();
  res.status(201).json(producto);
};

/////////////
//actualizar productos

const actualizarProducto = async (req, res = response) => {
  const { id } = req.params;
  const { _id, estado, usuario, ...data } = req.body;
  //todo validar contra base de datos
  if (data.nombre) {
    data.nombre = data.nombre.toUpperCase();
  }
  data.usuario = req.usuario._id;
  const producto = await Producto.findByIdAndUpdate(id, data, { new: true }); //encuentre y lo actualiza
  res.json(producto);
};
//borrar categoria estado :false

const productoDelete = async (req, res = response) => {
  const { id } = req.params;

  const producto = await Producto.findByIdAndUpdate(
    id,
    { estado: false },
    { new: true }
  );

  res.json({
    producto,
  });
};
module.exports = {
  crearProducto,
  obtenerProducto,
  obtenerProductoId,
  actualizarProducto,
  productoDelete,
};

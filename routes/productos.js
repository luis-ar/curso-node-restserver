const { Router } = require("express");
const { check } = require("express-validator");
const {
  obtenerProducto,
  obtenerProductoId,
  crearProducto,
  actualizarProducto,
  productoDelete,
} = require("../controllers/productos");
const {
  existeProductoPorId,
  existeCategoriaPorId,
} = require("../helpers/db-validators");
const { validarCampos, validarJWT, esAdminRole } = require("../middlewares");

const router = Router();

//Obtener todas las categorias
router.get("/", obtenerProducto);

//Obtener una categoria por id-publico
router.get(
  "/:id",
  [
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom(existeProductoPorId),
    validarCampos,
  ],
  obtenerProductoId
);

//crear categoria -privado-cualquier persona con un token valido
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("categoria", "No es un id de mongo").isMongoId(),
    check("categoria").custom(existeCategoriaPorId),

    validarCampos,
  ],
  crearProducto
);

//actualizar -privado-cualquiera con token valido
router.put(
  "/:id",
  [
    validarJWT,
    // check("categoria", "No es un id de mongo").isMongoId(),
    // check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("id").custom(existeProductoPorId),
    validarCampos,
  ],
  actualizarProducto
);

//borrar una categoria-admin
router.delete(
  "/:id",
  [
    validarJWT,
    esAdminRole,
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom(existeProductoPorId),
    validarCampos,
  ],
  productoDelete
);

module.exports = router;

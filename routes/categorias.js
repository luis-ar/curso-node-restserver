const { Router } = require("express");
const { check } = require("express-validator");
const {
  crearCategoria,
  obtenerCategoria,
  obtenerCategoriaId,
  actualizarCategoria,
  categoriaDelete,
} = require("../controllers/categorias");
const { existeCategoriaPorId } = require("../helpers/db-validators");
const {
  validarJWT,
  validarCampos,
  tieneRole,
  esAdminRole,
} = require("../middlewares");
const router = Router();

//Obtener todas las categorias
router.get("/", obtenerCategoria);

//Obtener una categoria por id-publico
router.get(
  "/:id",
  [
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom(existeCategoriaPorId),
    validarCampos,
  ],
  obtenerCategoriaId
);

//crear categoria -privado-cualquier persona con un token valido
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  crearCategoria
);

//actualizar -privado-cualquiera con token valido
router.put(
  "/:id",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("id").custom(existeCategoriaPorId),
    validarCampos,
  ],
  actualizarCategoria
);

//borrar una categoria-admin
router.delete(
  "/:id",
  [
    validarJWT,
    esAdminRole,
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom(existeCategoriaPorId),
    validarCampos,
  ],
  categoriaDelete
);

module.exports = router;

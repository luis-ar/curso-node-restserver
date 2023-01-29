const { Router } = require("express");
const { check } = require("express-validator");
const {
  cargarArchivo,
  actualizarImagen,
  mostrarImagen,
  actualizarImagenClaudinary,
} = require("../controllers/uploads");
const { coleccionesPermintidas } = require("../helpers");
const { validarArchivoSubir, validarCampos } = require("../middlewares");
const router = Router();
router.post("/", validarArchivoSubir, cargarArchivo);
router.get(
  "/:coleccion/:id",
  [
    check("id", "El id debe ser de mongo").isMongoId(),
    check("coleccion").custom((c) =>
      coleccionesPermintidas(c, ["usuarios", "productos"])
    ),
    validarCampos,
  ],
  mostrarImagen
);
router.put(
  "/:coleccion/:id",
  [
    validarArchivoSubir,
    check("id", "El id debe ser de mongo").isMongoId(),
    check("coleccion").custom((c) =>
      coleccionesPermintidas(c, ["usuarios", "productos"])
    ),
    validarCampos,
  ],actualizarImagenClaudinary
  );
//   actualizarImagen
// );

module.exports = router;

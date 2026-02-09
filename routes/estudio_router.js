const express = require("express");
const estudiosController = require("../controller/estudios_controller.js");

const estudioRouter = express.Router();

estudioRouter.get("/", estudiosController.getAllEstudios);
estudioRouter.get("/admin", estudiosController.getAllEstudiosAdmin);
estudioRouter.get("/:id", estudiosController.getEstudioById);
estudioRouter.get(
  "/cliente/:clienteId",
  estudiosController.getEstudiosByCliente,
);
estudioRouter.patch("/:id/estado", estudiosController.updateEstadoEstudio);

estudioRouter.post("/add_estudio", estudiosController.addEstudio);
estudioRouter.put("/update_estudio/:id", estudiosController.updateEstudio);
estudioRouter.delete("/delete_estudio/:id", estudiosController.deleteEstudio);

module.exports = estudioRouter;

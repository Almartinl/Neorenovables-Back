const express = require("express");
const presupuestosController = require("../controller/presupuestos_controller.js");

const presupuestosRouter = express.Router();

presupuestosRouter.get("/", presupuestosController.getPresupuestos);
presupuestosRouter.get(
  "/user/:id",
  presupuestosController.getPresupuestosByUser
);
presupuestosRouter.post(
  "/add_presupuesto",
  presupuestosController.addPresupuesto
);
// Ruta para eliminar un presupuesto
presupuestosRouter.delete(
  "/delete/:id",
  presupuestosController.deletePresupuesto
);

presupuestosRouter.patch(
  "/update/:id",
  presupuestosController.updatePresupuesto
);

module.exports = presupuestosRouter;

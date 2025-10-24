const express = require("express");
const colaboradoresController = require("../controller/colaboradores_controller.js");

const colaboradorRouter = express.Router();

colaboradorRouter.get("/", colaboradoresController.getColaboradores);
colaboradorRouter.post(
  "/add_colaborador",
  colaboradoresController.addColaborador
);
colaboradorRouter.patch(
  "/update_colaborador/:id",
  colaboradoresController.updateColaborador
);
colaboradorRouter.delete(
  "/delete_colaborador/:id",
  colaboradoresController.deleteColaborador
);

module.exports = colaboradorRouter;

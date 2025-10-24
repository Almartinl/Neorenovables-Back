// import express from "express";
// import bungalowsController from "../controller/bungalows_controller.js";

const express = require("express");
const bungalowsController = require("../controller/bungalows_controller.js")


const bungalowsRouter = express.Router();

bungalowsRouter.post("/save", bungalowsController.addBungalow);
bungalowsRouter.post("/", bungalowsController.getAllBungalow);
bungalowsRouter.delete("/delete", bungalowsController.deleteBungalowById);
bungalowsRouter.post("/addpresupuesto", bungalowsController.addPresupuesto);
bungalowsRouter.get(
  "/getallpresupuesto",
  bungalowsController.getAllPresupuesto
);
bungalowsRouter.delete(
  "/deletepresupuesto",
  bungalowsController.deletePresupuestoById
);

bungalowsRouter.get(
  "/count/presupuestos",
  bungalowsController.getCountPresupuesto
);

module.exports = bungalowsRouter;

// export default bungalowsRouter;

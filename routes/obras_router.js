// import express from "express";
// import obrasController from "../controller/obras_controller.js";

const express = require("express");
const obrasController = require("../controller/obras_controller.js");

const obrasRouter = express.Router();

obrasRouter.get("/", obrasController.getAllObrasPublic);

obrasRouter.get("/all", obrasController.getAllObras);

obrasRouter.get("/count", obrasController.getCountObras);

obrasRouter.post("/add", obrasController.addObra);

obrasRouter.patch("/update/:id", obrasController.updateObra);

module.exports = obrasRouter;

// export default obrasRouter;

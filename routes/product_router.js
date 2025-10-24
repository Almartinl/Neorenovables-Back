// import express from "express";
// import productController from "../controller/product_controller.js";

const express = require("express");
const productController = require("../controller/product_controller.js");

const productRouter = express.Router();

// ===== Categorías =====
productRouter.get("/categorias", productController.getCategorias);
productRouter.post("/categorias", productController.addCategoria);
productRouter.get("/categorias/:id", productController.getCategoriaById);
productRouter.delete("/categorias/:id", productController.deleteCategoria);

// ===== Productos =====
productRouter.get(
  "/categorias/:id/productos",
  productController.getProductosByCategoria
);
productRouter.post("/productos", productController.addProducto);
productRouter.get("/productos/:id", productController.getProductoById);
productRouter.patch("/productos/:id", productController.updateProducto);
productRouter.delete("/productos/:id", productController.deleteProducto);

// // ===== Categorías =====
// productRouter.get("/categorias", productController.getCategorias);
// productRouter.post("/categorias", productController.addCategoria);
// productRouter.get("/categorias/:id", productController.getCategoriaById);
// productRouter.delete("/categorias/:id", productController.deleteCategoria);

// // ===== Productos =====
// productRouter.get(
//   "/categorias/:id/productos",
//   productController.getProductosByCategoria
// );
// productRouter.post("/productos", productController.addProducto);
// productRouter.get("/productos/:id", productController.getProductoById);
// productRouter.patch("/productos/:id", productController.updateProducto);
// productRouter.delete("/productos/:id", productController.deleteProducto);

// // ===== Paneles, Inversores y Baterías =====
// productRouter.get("/paneles", productController.getPaneles);

// // Modificar un panel por su id
// productRouter.patch("/paneles/:id", productController.updatePaneles);

// productRouter.post("/add_panel", productController.addPanel);

// productRouter.delete("/delete/paneles/:id", productController.deletePanelById);

// productRouter.get("/inversores", productController.getInversores);

// // Modificar un inversor por su id
// productRouter.patch("/inversores/:id", productController.updateInversores);

// productRouter.post("/add_inversor", productController.addInversor);

// productRouter.delete(
//   "/delete/inversores/:id",
//   productController.deleteInversorById
// );

// productRouter.get("/baterias", productController.getBaterias);

// // Modificar una bateria por su id
// productRouter.patch("/baterias/:id", productController.updateBaterias);

// productRouter.post("/add_bateria", productController.addBateria);

// productRouter.delete(
//   "/delete/baterias/:id",
//   productController.deleteBateriaById
// );

module.exports = productRouter;

// export default productRouter;

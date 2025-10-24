const express = require("express");
const agendaController = require("../controller/agenda_controller.js");

const agendaRouter = express.Router();

// Obtener todas las citas
agendaRouter.get("/", agendaController.getAgenda);

// Obtener citas por presupuesto (opcional)
agendaRouter.get("/presupuesto/:id", agendaController.getAgendaByPresupuesto);

// Crear nueva cita
agendaRouter.post("/add_cita", agendaController.addCita);

// Eliminar cita
agendaRouter.delete("/delete/:id", agendaController.deleteCita);

// Actualizar cita
agendaRouter.patch("/update/:id", agendaController.updateCita);

module.exports = agendaRouter;

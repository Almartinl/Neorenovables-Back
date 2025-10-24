const dirInfo = require("../index.js");
const dao = require("../services/dao.js");

const controller = {};

controller.getPresupuestos = async (req, res) => {
  try {
    const presupuesto = await dao.getPresupuestos();
    console.log(presupuesto);
    // Si no existe devolvemos un 404 (not found)
    if (presupuesto.length <= 0) return res.status(404).send([]);

    return res.send(presupuesto);
  } catch (e) {
    console.log(e.message);
    return res.status(400).send(e.message);
  }
};

controller.getPresupuestosByUser = async (req, res) => {
  const { id } = req.params;

  try {
    const presupuesto = await dao.getPresupuestosByUser(id);
    console.log(presupuesto);
    // Si no existe devolvemos un 404 (not found)
    if (presupuesto.length <= 0) return res.status(404).send([]);

    return res.send(presupuesto);
  } catch (e) {
    console.log(e.message);
    return res.status(400).send(e.message);
  }
};

controller.addPresupuesto = async (req, res) => {
  try {
    const { presupuesto, items } = req.body;

    // Insertamos el presupuesto y obtenemos su ID
    const idPresupuesto = await dao.addPresupuesto(presupuesto);

    console.log("ID del presupuesto:", idPresupuesto); // ✅ Aquí debe aparecer el número real

    if (items && items.length > 0) {
      for (const item of items) {
        await dao.addPresupuestoItem(item, idPresupuesto);
      }
    }

    return res.status(200).json({
      message: "Presupuesto creado correctamente",
      id: idPresupuesto,
    });
  } catch (e) {
    console.error("Error:", e.message);
    return res.status(400).send(e.message);
  }
};

controller.deletePresupuesto = async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(id)) {
    return res.status(400).send("ID del presupuesto no válido");
  }

  try {
    await dao.deletePresupuesto(id);

    return res.status(200).json({
      message: `Presupuesto con ID ${id} y sus items han sido eliminados`,
    });
  } catch (e) {
    console.error("Error al eliminar el presupuesto:", e.message);
    return res.status(500).send(e.message);
  }
};

controller.updatePresupuesto = async (req, res) => {
  try {
    const { presupuesto, items } = req.body;

    // 1. Actualizar datos del presupuesto principal (solo los campos modificados)
    if (presupuesto && Object.keys(presupuesto).length > 0) {
      await dao.updatePresupuesto(presupuesto);
    }

    // 2. Procesamos los items
    const itemIds = items.map((i) => i.id).filter(Boolean); // Filtramos los que tienen ID

    // 2.1. Borrar los que ya no están en la lista
    await dao.deleteItemsNotInList(presupuesto.id, itemIds);

    // 2.2. Actualizar o insertar cada item
    if (items && items.length > 0) {
      for (const item of items) {
        await dao.addPresupuestoItem(item, presupuesto.id);
      }
    }

    return res.status(200).json({
      message: "Presupuesto y/o items actualizados correctamente",
    });
  } catch (e) {
    console.error("Error al editar el presupuesto:", e.message);
    return res.status(400).send(e.message);
  }
};

module.exports = controller;

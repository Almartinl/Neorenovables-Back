const utils = require("../../utils/utils.js");
const db = require("../mysql.js");

const presupuestosQueries = {};

presupuestosQueries.getPresupuestos = async () => {
  let conn = null;
  try {
    conn = await db.createConnection();
    return await db.query(
      "SELECT c.*, u.nombre AS nombre_usuario, p.*, IFNULL(JSON_ARRAYAGG(JSON_OBJECT('id', pi.id, 'presupuesto_id', pi.presupuesto_id, 'tipo_producto', pi.tipo_producto, 'producto_id', pi.producto_id, 'nombre', pi.nombre, 'descripcion', pi.descripcion, 'cantidad', pi.cantidad, 'precio_unitario', pi.precio_unitario, 'total', pi.total, 'descuento', pi.descuento, 'descuento_porcentaje', pi.descuento_porcentaje)), JSON_ARRAY()) AS items FROM presupuestos p INNER JOIN clientes c ON c.id = p.cliente_id LEFT JOIN users u ON u.id = p.usuario_id LEFT JOIN presupuesto_items pi ON p.id = pi.presupuesto_id GROUP BY p.id;",
      [],
      "select",
      conn
    );
  } catch (e) {
    throw new Error(e);
  } finally {
    conn && (await conn.end());
  }
};

presupuestosQueries.getPresupuestosByUser = async (id) => {
  let conn = null;
  try {
    conn = await db.createConnection();
    return await db.query(
      "SELECT c.*, u.nombre AS nombre_usuario, p.*, IFNULL(JSON_ARRAYAGG(JSON_OBJECT('id', pi.id, 'presupuesto_id', pi.presupuesto_id, 'tipo_producto', pi.tipo_producto, 'producto_id', pi.producto_id, 'nombre', pi.nombre, 'descripcion', pi.descripcion, 'cantidad', pi.cantidad, 'precio_unitario', pi.precio_unitario, 'total', pi.total, 'descuento', pi.descuento, 'descuento_porcentaje', pi.descuento_porcentaje)), JSON_ARRAY()) AS items FROM clientes c INNER JOIN presupuestos p ON c.id = p.cliente_id LEFT JOIN users u ON u.id = p.usuario_id LEFT JOIN presupuesto_items pi ON p.id = pi.presupuesto_id WHERE p.usuario_id = ? GROUP BY p.id",
      [id],
      "select",
      conn
    );
  } catch (e) {
    throw new Error(e);
  } finally {
    conn && (await conn.end());
  }
};

presupuestosQueries.addPresupuesto = async (presupuestoData) => {
  let conn = null;

  try {
    conn = await db.createConnection();

    // Creamos el objeto presupuesto con los campos necesarios
    let presupuestoObj = {
      cliente_id: presupuestoData.cliente_id,
      usuario_id: presupuestoData.usuario_id,
      fecha: presupuestoData.fecha || new Date(),
      total: presupuestoData.total || 0,
      num_presupuesto: presupuestoData.num_presupuesto,
      direccion_instalacion: presupuestoData.direccion_instalacion,
      poblacion_instalacion: presupuestoData.poblacion_instalacion,
      tel_contacto: presupuestoData.tel_contacto,
      titulo_presupuesto: presupuestoData.titulo_presupuesto,
      codigo_postal: presupuestoData.codigo_postal,
      iva_porcentaje: presupuestoData.iva_porcentaje,
      iva: presupuestoData.iva,
      total_bruto: presupuestoData.total_bruto,
      colaborador: presupuestoData.colaborador,
      logo_colaborador: presupuestoData.logo_colaborador,
    };

    // Insertamos el presupuesto
    const result = await db.query(
      "INSERT INTO presupuestos SET ?",
      presupuestoObj,
      "insert",
      conn
    );

    return result;
  } catch (e) {
    throw new Error(e);
  } finally {
    conn && (await conn.end());
  }
};

presupuestosQueries.addPresupuestoItem = async (itemData, idPresupuesto) => {
  let conn = null;

  try {
    conn = await db.createConnection();
    console.log("presupuesto id", idPresupuesto);
    let itemObj = {
      presupuesto_id: idPresupuesto,
      tipo_producto: itemData.tipo_producto,
      producto_id: itemData.producto_id,
      nombre: itemData.nombre,
      descripcion: itemData.descripcion,
      cantidad: itemData.cantidad,
      precio_unitario: itemData.precio_unitario,
      total: itemData.total,
      descuento: itemData.descuento,
      descuento_porcentaje: itemData.descuento_porcentaje,
    };

    await db.query(
      "INSERT INTO presupuesto_items SET ?",
      itemObj,
      "insert",
      conn
    );
  } catch (e) {
    throw new Error(e);
  } finally {
    conn && (await conn.end());
  }
};

presupuestosQueries.deletePresupuesto = async (presupuestoId) => {
  let conn = null;

  try {
    conn = await db.createConnection();

    // 1. Eliminar los items asociados al presupuesto
    await db.query(
      "DELETE FROM presupuesto_items WHERE presupuesto_id = ?",
      [presupuestoId],
      "delete",
      conn
    );

    // 2. Eliminar el presupuesto principal
    await db.query(
      "DELETE FROM presupuestos WHERE id = ?",
      [presupuestoId],
      "delete",
      conn
    );
  } catch (error) {
    throw new Error("Error al eliminar el presupuesto: " + error.message);
  } finally {
    if (conn) await conn.end();
  }
};

presupuestosQueries.updatePresupuesto = async (presupuestoData) => {
  let conn = null;

  try {
    conn = await db.createConnection();

    // Eliminamos campos indefinidos antes de hacer la actualización
    const cleanPresupuesto = await utils.removeUndefinedKeys(presupuestoData);

    // Solo actualizamos si hay datos
    if (Object.keys(cleanPresupuesto).length > 0) {
      await db.query(
        "UPDATE presupuestos SET ? WHERE id = ?",
        [cleanPresupuesto, presupuestoData.id],
        "update",
        conn
      );
    }

    return true;
  } catch (error) {
    throw new Error("Error al actualizar el presupuesto: " + error.message);
  } finally {
    conn && (await conn.end());
  }
};

presupuestosQueries.updatePresupuestoItem = async (itemData) => {
  let conn = null;

  try {
    conn = await db.createConnection();

    const cleanItem = await utils.removeUndefinedKeys(itemData);

    // Si ya existe itemData.id → actualizamos
    if (itemData.id) {
      await db.query(
        "UPDATE presupuesto_items SET ? WHERE id = ?",
        [cleanItem, itemData.id],
        "update",
        conn
      );
    } else {
      // Si no tiene ID → es un nuevo item
      await db.query(
        "INSERT INTO presupuesto_items SET ?",
        cleanItem,
        "insert",
        conn
      );
    }

    return true;
  } catch (error) {
    throw new Error("Error al actualizar item: " + error.message);
  } finally {
    conn && (await conn.end());
  }
};

presupuestosQueries.deleteItemsNotInList = async (presupuesto_id, itemIds) => {
  let conn = null;

  try {
    conn = await db.createConnection();

    // Si no hay items, borramos todo
    if (!itemIds.length) {
      return await db.query(
        "DELETE FROM presupuesto_items WHERE presupuesto_id = ?",
        [presupuesto_id],
        "delete",
        conn
      );
    }

    // Borra los items cuyo id NO esté en la lista recibida
    const query = `
      DELETE FROM presupuesto_items
      WHERE presupuesto_id = ?
      AND id NOT IN (?)
    `;

    await db.query(query, [presupuesto_id, itemIds], "delete", conn);
  } catch (error) {
    throw new Error("Error al eliminar items antiguos: " + error.message);
  } finally {
    conn && (await conn.end());
  }
};

module.exports = presupuestosQueries;

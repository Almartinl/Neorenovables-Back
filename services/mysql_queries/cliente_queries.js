const utils = require("../../utils/utils.js");
const db = require("../mysql.js");

const clienteQueries = {};

clienteQueries.getClientes = async () => {
  let conn = null;
  try {
    conn = await db.createConnection();
    return await db.query("SELECT * FROM Clientes", [], "select", conn);
  } catch (e) {
    throw new Error(e);
  } finally {
    conn && (await conn.end());
  }
};

clienteQueries.addCliente = async (clienteData) => {
  let conn = null;
  try {
    conn = await db.createConnection();

    let clienteObj = {
      nombre: clienteData.nombre,
      apellidos: clienteData.apellidos,
      email: clienteData.email,
      direccion: clienteData.direccion,
      telefono: clienteData.telefono,
    };
    return await db.query(
      "INSERT INTO clientes SET ?",
      clienteObj,
      "insert",
      conn
    );
  } catch (e) {
    throw new Error(e);
  } finally {
    conn && (await conn.end());
  }
};

clienteQueries.deleteCliente = async (id) => {
  let conn = null;
  try {
    conn = await db.createConnection();
    return await db.query(
      "DELETE FROM clientes WHERE id = ?",
      [id],
      "delete",
      conn
    );
  } catch (e) {
    throw new Error(e);
  } finally {
    conn && (await conn.end());
  }
};

clienteQueries.updateCliente = async (id, bateriaData) => {
  let conn = null;
  try {
    conn = await db.createConnection();
    let clienteObj = {
      nombre: bateriaData.nombre,
      apellidos: bateriaData.apellidos,
      telefono: bateriaData.telefono,
      email: bateriaData.email,
      direccion: bateriaData.direccion,
    };
    // Eliminamos los campos que no se van a modificar (no llegan por el body)
    clienteObj = await utils.removeUndefinedKeys(clienteObj);

    return await db.query(
      "UPDATE clientes SET ? WHERE id = ?",
      [clienteObj, id],
      "update",
      conn
    );
  } catch (e) {
    throw new Error(e);
  } finally {
    conn && (await conn.end());
  }
};

module.exports = clienteQueries;

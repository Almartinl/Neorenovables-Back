// import db from "../mysql.js ";
// import moment from "moment/moment.js";
// import md5 from "md5";
// import utils from "../../utils/utils.js";

const db = require("../mysql.js");
const md5 = require("md5");
const utils = require("../../utils/utils.js");

const userQueries = {};

userQueries.getUsers = async () => {
  let conn = null;
  try {
    conn = await db.createConnection();
    return await db.query("SELECT * FROM users", [], "select", conn);
  } catch (e) {
    throw new Error(e);
  } finally {
    conn && (await conn.end());
  }
};

userQueries.getUserByEmail = async (email) => {
  let conn = null;
  try {
    conn = await db.createConnection();
    return await db.query(
      "SELECT * FROM users WHERE email = ?",
      email,
      "select",
      conn,
    );
  } catch (e) {
    throw new Error(e);
  } finally {
    conn && (await conn.end());
  }
};

userQueries.addUser = async (userData) => {
  let conn = null;
  try {
    conn = await db.createConnection();
    console.log(userData);
    let userObj = {
      nombre: userData.nombre,
      apellido: userData.apellido,
      email: userData.email,
      password: md5(userData.password),
      telefono: userData.telefono,
      rol: userData.rol,
    };
    return await db.query("INSERT INTO users SET ?", userObj, "insert", conn);
  } catch (e) {
    throw new Error(e);
  } finally {
    conn && (await conn.end());
  }
};

userQueries.getUserById = async (id) => {
  let conn = null;
  try {
    conn = await db.createConnection();
    return await db.query(
      "SELECT * FROM users WHERE id = ?",
      id,
      "select",
      conn,
    );
  } catch (e) {
    throw new Error(e);
  } finally {
    conn && (await conn.end());
  }
};

userQueries.deleteUser = async (id) => {
  let conn = null;
  try {
    conn = await db.createConnection();
    return await db.query(
      "UPDATE users SET activo = 0 WHERE id = ?",
      id,
      "update",
      conn,
    );
  } catch (e) {
    throw new Error(e);
  } finally {
    conn && (await conn.end());
  }
};

// Modificar un usuario por su id
userQueries.updateUser = async (id, userData) => {
  // Conectamos con la base de datos y añadimos el usuario.
  let conn = null;
  try {
    conn = await db.createConnection();
    // Creamos un objeto con los datos que nos puede llegar del usuario a modificar en la base de datos.
    // Encriptamos la password con md5 si nos llega por el body, sino la declaramos como undefined
    // y usamos la libreria momentjs para actualizar la fecha.
    let userObj = {
      nombre: userData.nombre,
      apellido: userData.apellido,
      email: userData.email,
      password: userData.password ? md5(userData.password) : undefined,
      rol: userData.rol,
      telefono: userData.telefono,
      activo: userData.activo,
      //update_date: moment().format("YYYY-MM-DD HH:mm:ss"),
    };
    // Eliminamos los campos que no se van a modificar (no llegan por el body)
    userObj = await utils.removeUndefinedKeys(userObj);

    return await db.query(
      "UPDATE users SET ? WHERE id = ?",
      [userObj, id],
      "update",
      conn,
    );
  } catch (e) {
    throw new Error(e);
  } finally {
    conn && (await conn.end());
  }
};

userQueries.getCountUser = async () => {
  let conn = null;
  try {
    conn = await db.createConnection();
    return await db.query(
      "SELECT COUNT(*) as usuarios FROM usuarios",
      [],
      "select",
      conn,
    );
  } catch (e) {
    throw new Error(e);
  } finally {
    conn && (await conn.end());
  }
};

userQueries.addContact = async (contactData) => {
  let conn = null;
  try {
    conn = await db.createConnection();
    console.log(contactData);
    let userObj = {
      nombre: contactData.nombre,
      apellidos: contactData.apellidos,
      email: contactData.email,
      //direccion: contactData.direccion,
      telefono: contactData.telefono,
      descripcion: contactData.descripcion,
      //pais: contactData.pais,
      //ciudad: contactData.ciudad,
    };
    return await db.query(
      "INSERT INTO contacto SET ?",
      userObj,
      "insert",
      conn,
    );
  } catch (e) {
    throw new Error(e);
  } finally {
    conn && (await conn.end());
  }
};

userQueries.getCountContact = async () => {
  let conn = null;
  try {
    conn = await db.createConnection();
    return await db.query(
      "SELECT COUNT(*) as contactos FROM contacto",
      [],
      "select",
      conn,
    );
  } catch (e) {
    throw new Error(e);
  } finally {
    conn && (await conn.end());
  }
};

userQueries.getAllContact = async () => {
  let conn = null;
  try {
    conn = await db.createConnection();
    return await db.query("SELECT * FROM contacto", [], "select", conn);
  } catch (e) {
    throw new Error(e);
  } finally {
    conn && (await conn.end());
  }
};

userQueries.deleteContactById = async (id) => {
  let conn = null;
  try {
    conn = await db.createConnection();
    return await db.query(
      "DELETE FROM contacto WHERE id =?",
      [id],
      "delete",
      conn,
    );
  } catch (e) {
    throw new Error(e);
  } finally {
    conn && (await conn.end());
  }
};

userQueries.getVerify = async (id) => {
  let conn = null;
  try {
    conn = await db.createConnection();
    return await db.query(
      "UPDATE usuarios SET activo = 1 WHERE id = ?",
      id,
      "update",
      conn,
    );
  } catch (e) {
    throw new Error(e);
  } finally {
    conn && (await conn.end());
  }
};

module.exports = userQueries;

// export default userQueries;

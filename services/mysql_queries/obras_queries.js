// import db from "../mysql.js";

const db = require("../mysql.js");

const obrasQueries = {};

obrasQueries.getAllObras = async () => {
  let conn = null;
  try {
    conn = await db.createConnection();
    return await db.query(
      "SELECT obras.id, obras.nombre, obras.imagen, JSON_ARRAYAGG(imagenesobras.path) as imagenes, obras.public, obras.position FROM obras join imagenesobras on imagenesobras.obra = obras.id group by obras.id",
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

obrasQueries.getAllObrasPublic = async () => {
  let conn = null;
  try {
    conn = await db.createConnection();
    return await db.query(
      "SELECT obras.id, obras.nombre, obras.imagen, JSON_ARRAYAGG(imagenesobras.path) as imagenes, obras.public, obras.position FROM obras join imagenesobras on imagenesobras.obra = obras.id where obras.public = 1 group by obras.id",
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

obrasQueries.getCountObras = async () => {
  let conn = null;
  try {
    conn = await db.createConnection();
    return await db.query(
      "SELECT count(*) as obras FROM obras ",
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

obrasQueries.addObra = async (obraData, image) => {
  let conn = null;

  try {
    conn = await db.createConnection();

    let obraObj = {
      nombre: obraData.nombre,
      imagen: image,
    };
    return await db.query("INSERT INTO obras SET ? ", obraObj, "insert", conn);
  } catch (e) {
    throw new Error(e);
  } finally {
    conn && (await conn.end());
  }
};

obrasQueries.addObraImage = async (imageData) => {
  // Conectamos con la base de datos y añadimos el usuario.
  let conn = null;
  try {
    conn = await db.createConnection();
    // Creamos un objeto con los datos de la imagen a guardar en la base de datos.
    // Usamos la libreria momentjs para registrar la fecha actual
    let imageObj = {
      id: null,
      obra: imageData.idObra,
      path: imageData.path,
    };
    return await db.query(
      "INSERT INTO `imagenesobras` SET ?",
      imageObj,
      "insert",
      conn
    );
  } catch (e) {
    throw new Error(e);
  } finally {
    conn && (await conn.end());
  }
};

obrasQueries.updateObra = async (id, obraData) => {
  let conn = null;
  try {
    conn = await db.createConnection();
    let userObj = {
      public: obraData.public,
    };
    return await db.query(
      "UPDATE obras SET ? WHERE id = ?",
      [userObj, id],
      "update",
      conn
    );
  } catch (e) {
    throw new Error(e);
  } finally {
    conn && (await conn.end());
  }
};

module.exports = obrasQueries;

// export default obrasQueries;

// import db from "../mysql.js";

const utils = require("../../utils/utils.js");
const db = require("../mysql.js");

const productQueries = {};

// ===== Categorías =====
productQueries.getCategorias = async () => {
  const conn = await db.createConnection();
  const res = await db.query("SELECT * FROM categorias", [], "select", conn);
  await conn.end();
  return res;
};

productQueries.addCategoria = async (data) => {
  const conn = await db.createConnection();
  const categoria = {
    nombre: data.nombre,
    descripcion: data.descripcion || null,
    img: data.img || null,
  };
  const res = await db.query(
    "INSERT INTO categorias SET ?",
    categoria,
    "insert",
    conn
  );
  await conn.end();
  return res;
};

productQueries.deleteCategoria = async (id) => {
  const conn = await db.createConnection();
  await db.query("DELETE FROM categorias WHERE id = ?", [id], "delete", conn);
  await conn.end();
};

productQueries.getCategoriaById = async (id) => {
  const conn = await db.createConnection();
  const [res] = await db.query(
    "SELECT * FROM categorias WHERE id = ?",
    [id],
    "select",
    conn
  );
  await conn.end();
  return res;
};

productQueries.addAtributoCategoria = async (categoriaId, nombre, tipo) => {
  const conn = await db.createConnection();
  const res = await db.query(
    "INSERT INTO atributoscategoria (categoria_id, nombre, tipo) VALUES (?, ?, ?)",
    [categoriaId, nombre, tipo],
    "insert",
    conn
  );
  await conn.end();
  return res;
};

productQueries.getAtributosByCategoria = async (id) => {
  const conn = await db.createConnection();
  const res = await db.query(
    "SELECT * FROM atributoscategoria WHERE categoria_id = ?",
    [id],
    "select",
    conn
  );
  await conn.end();
  return res;
};

// ===== Productos =====
productQueries.getProductosByCategoria = async (id) => {
  const conn = await db.createConnection();
  const res = await db.query(
    "SELECT * FROM productos WHERE categoria_id = ?",
    [id],
    "select",
    conn
  );
  await conn.end();
  return res;
};

productQueries.addProducto = async (data) => {
  const conn = await db.createConnection();
  const res = await db.query(
    "INSERT INTO productos SET ?",
    data,
    "insert",
    conn
  );
  await conn.end();
  return res;
};

productQueries.getProductoById = async (id) => {
  const conn = await db.createConnection();
  const [res] = await db.query(
    "SELECT * FROM productos WHERE id = ?",
    [id],
    "select",
    conn
  );
  await conn.end();
  return res;
};

productQueries.updateProducto = async (id, data) => {
  const conn = await db.createConnection();
  const cleaned = await utils.removeUndefinedKeys(data);
  const res = await db.query(
    "UPDATE productos SET ? WHERE id = ?",
    [cleaned, id],
    "update",
    conn
  );
  await conn.end();
  return res;
};

productQueries.deleteProducto = async (id) => {
  const conn = await db.createConnection();
  await db.query("DELETE FROM productos WHERE id = ?", [id], "delete", conn);
  await conn.end();
};

// ===== Valores =====
productQueries.addValorProducto = async (
  productoId,
  atributocategoria_id,
  valor
) => {
  const conn = await db.createConnection();
  const res = await db.query(
    "INSERT INTO valoresproducto (producto_id, atributocategoria_id, valor) VALUES (?, ?, ?)",
    [productoId, atributocategoria_id, valor],
    "insert",
    conn
  );
  await conn.end();
  return res;
};

productQueries.getValoresByProducto = async (id) => {
  const conn = await db.createConnection();
  const res = await db.query(
    `SELECT v.id, v.valor, a.nombre, a.tipo 
     FROM valoresproducto v
     INNER JOIN atributoscategoria a ON v.atributocategoria_id = a.id
     WHERE v.producto_id = ?`,
    [id],
    "select",
    conn
  );
  await conn.end();
  return res;
};

productQueries.deleteValoresByProducto = async (id) => {
  const conn = await db.createConnection();
  await db.query(
    "DELETE FROM valoresproducto WHERE producto_id = ?",
    [id],
    "delete",
    conn
  );
  await conn.end();
};

// // ===== Categorías =====
// productQueries.getCategorias = async () => {
//   const conn = await db.createConnection();
//   const res = await db.query("SELECT * FROM categorias", [], "select", conn);
//   await conn.end();
//   return res;
// };

// productQueries.addCategoria = async (data) => {
//   let conn = null;
//   try {
//     conn = await db.createConnection();
//     const categoria = {
//       nombre: data.nombre,
//       descripcion: data.descripcion || null,
//       img: data.img || null, // aquí guardamos la ruta relativa de la imagen
//     };
//     const res = await db.query(
//       "INSERT INTO categorias SET ?",
//       categoria,
//       "insert",
//       conn
//     );
//     return res;
//   } catch (e) {
//     throw new Error(e);
//   } finally {
//     conn && (await conn.end());
//   }
// };

// productQueries.deleteCategoria = async (id) => {
//   const conn = await db.createConnection();
//   await db.query("DELETE FROM categorias WHERE id = ?", [id], "delete", conn);
//   await conn.end();
// };

// productQueries.getCategoriaById = async (id) => {
//   const conn = await db.createConnection();
//   const [res] = await db.query(
//     "SELECT * FROM categorias WHERE id = ?",
//     [id],
//     "select",
//     conn
//   );
//   await conn.end();
//   return res;
// };

// // ===== Productos =====
// productQueries.getProductosByCategoria = async (id) => {
//   let conn = null;
//   try {
//     conn = await db.createConnection();

//     // Obtener productos
//     const productos = await db.query(
//       "SELECT * FROM productos WHERE categoria_id = ?",
//       [id],
//       "select",
//       conn
//     );

//     // Obtener atributos de cada producto
//     for (let p of productos) {
//       const atributos = await db.query(
//         "SELECT atributo AS nombre, valor FROM atributosproducto WHERE producto_id = ?",
//         [p.id],
//         "select",
//         conn
//       );
//       p.atributos = atributos || [];
//     }

//     return productos;
//   } finally {
//     conn && (await conn.end());
//   }
// };

// productQueries.addProducto = async (data, ficha) => {
//   const conn = await db.createConnection();
//   const producto = {
//     categoria_id: data.categoria_id,
//     nombre: data.nombre,
//     proveedor: data.proveedor,
//     precio_compra: data.precio_compra,
//     precio_venta: data.precio_venta,
//     marca: data.marca,
//     descripcion: data.descripcion,
//     ficha: ficha || null,
//   };
//   const res = await db.query(
//     "INSERT INTO productos SET ?",
//     producto,
//     "insert",
//     conn
//   );
//   await conn.end();
//   return res;
// };

// productQueries.getProductoById = async (id) => {
//   const conn = await db.createConnection();
//   const [res] = await db.query(
//     "SELECT * FROM productos WHERE id = ?",
//     [id],
//     "select",
//     conn
//   );
//   await conn.end();
//   return res;
// };

// productQueries.updateProducto = async (id, productoData) => {
//   const conn = await db.createConnection();
//   try {
//     // Limpiamos campos vacíos antes de actualizar
//     const data = await utils.removeUndefinedKeys(productoData);

//     return await db.query(
//       "UPDATE productos SET ? WHERE id = ?",
//       [data, id],
//       "update",
//       conn
//     );
//   } finally {
//     conn && (await conn.end());
//   }
// };

// productQueries.deleteProducto = async (id) => {
//   const conn = await db.createConnection();
//   await db.query("DELETE FROM productos WHERE id = ?", [id], "delete", conn);
//   await conn.end();
// };

// // ===== Atributos =====
// productQueries.addAtributo = async (productoId, clave, valor) => {
//   const conn = await db.createConnection();
//   const atributo = { producto_id: productoId, atributo: clave, valor };
//   const res = await db.query(
//     "INSERT INTO atributosproducto SET ?",
//     atributo,
//     "insert",
//     conn
//   );
//   await conn.end();
//   return res;
// };

// productQueries.updateAtributo = async (id, nombre, valor) => {
//   const conn = await db.createConnection();
//   try {
//     return await db.query(
//       "UPDATE atributosproducto SET atributo = ?, valor = ? WHERE id = ?",
//       [nombre, valor, id],
//       "update",
//       conn
//     );
//   } finally {
//     conn && (await conn.end());
//   }
// };

// productQueries.deleteAtributo = async (id) => {
//   const conn = await db.createConnection();
//   try {
//     return await db.query(
//       "DELETE FROM atributosproducto WHERE id = ?",
//       [id],
//       "delete",
//       conn
//     );
//   } finally {
//     conn && (await conn.end());
//   }
// };

// productQueries.getAtributosByProducto = async (id) => {
//   const conn = await db.createConnection();
//   const res = await db.query(
//     "SELECT * FROM atributosproducto WHERE producto_id = ?",
//     [id],
//     "select",
//     conn
//   );
//   await conn.end();
//   return res;
// };

// productQueries.deleteAtributosByProducto = async (id) => {
//   const conn = await db.createConnection();
//   await db.query(
//     "DELETE FROM atributosproducto WHERE producto_id = ?",
//     [id],
//     "delete",
//     conn
//   );
//   await conn.end();
// };

// ===== Paneles, Inversores y Baterías =====

productQueries.getPaneles = async () => {
  let conn = null;
  try {
    conn = await db.createConnection();
    return await db.query("SELECT * FROM Paneles", [], "select", conn);
  } catch (e) {
    throw new Error(e);
  } finally {
    conn && (await conn.end());
  }
};

productQueries.updatePaneles = async (id, panelData) => {
  let conn = null;
  try {
    conn = await db.createConnection();
    let panelObj = {
      nombre: panelData.nombre,
      marca: panelData.marca,
      potencia: panelData.potencia,
      vmp: panelData.vmp,
      imp: panelData.imp,
      tipo: panelData.tipo,
      largo: panelData.largo,
      ancho: panelData.ancho,
      alto: panelData.alto,
      color: panelData.color,
      precio: panelData.precio,
      descripcion: panelData.descripcion,
      ficha: panelData.ficha,
    };
    // Eliminamos los campos que no se van a modificar (no llegan por el body)
    panelObj = await utils.removeUndefinedKeys(panelObj);

    return await db.query(
      "UPDATE paneles SET ? WHERE id = ?",
      [panelObj, id],
      "update",
      conn
    );
  } catch (e) {
    throw new Error(e);
  } finally {
    conn && (await conn.end());
  }
};

productQueries.addPanel = async (panelData, pdf) => {
  let conn = null;

  try {
    conn = await db.createConnection();

    let panelObj = {
      nombre: panelData.nombre,
      marca: panelData.marca,
      potencia: panelData.potencia,
      vmp: panelData.vmp,
      imp: panelData.imp,
      tipo: panelData.tipo,
      largo: panelData.largo,
      ancho: panelData.ancho,
      alto: panelData.alto,
      color: panelData.color,
      precio: panelData.precio,
      descripcion: panelData.descripcion,
      ficha: pdf || null,
    };
    return await db.query(
      "INSERT INTO paneles SET ? ",
      panelObj,
      "insert",
      conn
    );
  } catch (e) {
    throw new Error(e);
  } finally {
    conn && (await conn.end());
  }
};

productQueries.deletePanelById = async (id) => {
  let conn = null;
  try {
    conn = await db.createConnection();
    return await db.query(
      "DELETE FROM paneles WHERE id =?",
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

productQueries.getInversores = async () => {
  let conn = null;
  try {
    conn = await db.createConnection();
    return await db.query("SELECT * FROM Inversores", [], "select", conn);
  } catch (e) {
    throw new Error(e);
  } finally {
    conn && (await conn.end());
  }
};

productQueries.updateInversores = async (id, inversorData) => {
  let conn = null;
  try {
    conn = await db.createConnection();
    let inversorObj = {
      nombre: inversorData.nombre,
      marca: inversorData.marca,
      potencia: inversorData.potencia,
      intensidad: inversorData.intensidad,
      nmppt: inversorData.nmppt,
      tensionmin: inversorData.tensionmin,
      tensionmax: inversorData.tensionmax,
      precio: inversorData.precio,
      descripcion: inversorData.descripcion,
      ficha: inversorData.ficha,
    };
    // Eliminamos los campos que no se van a modificar (no llegan por el body)
    inversorObj = await utils.removeUndefinedKeys(inversorObj);

    return await db.query(
      "UPDATE inversores SET ? WHERE id = ?",
      [inversorObj, id],
      "update",
      conn
    );
  } catch (e) {
    throw new Error(e);
  } finally {
    conn && (await conn.end());
  }
};

productQueries.addInversor = async (inversorData, pdf) => {
  let conn = null;

  try {
    conn = await db.createConnection();

    let inversorObj = {
      nombre: inversorData.nombre,
      marca: inversorData.marca,
      potencia: inversorData.potencia,
      intensidad: inversorData.intensidad,
      nmppt: inversorData.nmppt,
      tensionmin: inversorData.tensionmin,
      tensionmax: inversorData.tensionmax,
      precio: inversorData.precio,
      descripcion: inversorData.descripcion,
      ficha: pdf || null,
    };
    return await db.query(
      "INSERT INTO inversores SET ? ",
      inversorObj,
      "insert",
      conn
    );
  } catch (e) {
    throw new Error(e);
  } finally {
    conn && (await conn.end());
  }
};

productQueries.deleteInversorById = async (id) => {
  let conn = null;
  try {
    conn = await db.createConnection();
    return await db.query(
      "DELETE FROM inversores WHERE id =?",
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

productQueries.getBaterias = async () => {
  let conn = null;
  try {
    conn = await db.createConnection();
    return await db.query("SELECT * FROM baterias", [], "select", conn);
  } catch (e) {
    throw new Error(e);
  } finally {
    conn && (await conn.end());
  }
};

productQueries.updateBaterias = async (id, bateriaData) => {
  let conn = null;
  try {
    conn = await db.createConnection();
    let bateriaObj = {
      nombre: bateriaData.nombre,
      marca: bateriaData.marca,
      capacidad: bateriaData.capacidad,
      precio: bateriaData.precio,
      descripcion: bateriaData.descripcion,
      ficha: bateriaData.ficha,
    };
    // Eliminamos los campos que no se van a modificar (no llegan por el body)
    bateriaObj = await utils.removeUndefinedKeys(bateriaObj);

    return await db.query(
      "UPDATE baterias SET ? WHERE id = ?",
      [bateriaObj, id],
      "update",
      conn
    );
  } catch (e) {
    throw new Error(e);
  } finally {
    conn && (await conn.end());
  }
};

productQueries.addBateria = async (bateriaData, pdf) => {
  let conn = null;

  try {
    conn = await db.createConnection();

    let bateriaObj = {
      nombre: bateriaData.nombre,
      marca: bateriaData.marca,
      capacidad: bateriaData.capacidad,
      precio: bateriaData.precio,
      descripcion: bateriaData.descripcion,
      ficha: pdf || null,
    };
    return await db.query(
      "INSERT INTO baterias SET ? ",
      bateriaObj,
      "insert",
      conn
    );
  } catch (e) {
    throw new Error(e);
  } finally {
    conn && (await conn.end());
  }
};

productQueries.deleteBateriaById = async (id) => {
  let conn = null;
  try {
    conn = await db.createConnection();
    return await db.query(
      "DELETE FROM baterias WHERE id =?",
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

productQueries.getProductsByCategory = async (categoria) => {
  // Conectamos con la base de datos y buscamos si existe la imagen por el id.
  let conn = null;
  try {
    conn = await db.createConnection();

    return await db.query(
      "SELECT  productos.* ,JSON_ARRAYAGG(imagenproducto.path) as imagenes FROM productos LEFT JOIN imagenproducto on productos.id = imagenproducto.producto WHERE productos.categoria = ? GROUP BY productos.id",
      categoria,
      "select",
      conn
    );
  } catch (e) {
    throw new Error(e);
  } finally {
    conn && (await conn.end());
  }
};

productQueries.addImage = async (imageData) => {
  // Conectamos con la base de datos y añadimos el usuario.
  let conn = null;
  try {
    conn = await db.createConnection();
    // Creamos un objeto con los datos de la imagen a guardar en la base de datos.
    // Usamos la libreria momentjs para registrar la fecha actual
    let imageObj = {
      id: null,
      producto: imageData.idProducto,
      path: imageData.path,
    };
    return await db.query(
      "INSERT INTO `imagenproducto` SET ?",
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

productQueries.getImageById = async (id) => {
  // Conectamos con la base de datos y buscamos si existe la imagen por el id.
  let conn = null;
  try {
    conn = await db.createConnection();
    return await db.query(
      "SELECT * FROM imagen WHERE producto = ?",
      id,
      "select",
      conn
    );
  } catch (e) {
    throw new Error(e);
  } finally {
    conn && (await conn.end());
  }
};

productQueries.getProductByRef = async (ref) => {
  let conn = null;
  console.log(ref);
  try {
    conn = await db.createConnection();
    return await db.query(
      "SELECT * FROM productos where ref = ?",
      ref,
      "select",
      conn
    );
  } catch (e) {
    throw new Error(e);
  } finally {
    conn && (await conn.end());
  }
};

productQueries.addOffer = async (productData, image) => {
  let conn = null;

  try {
    conn = await db.createConnection();

    let productObj = {
      nombre: productData.nombre,
      path: image,
    };
    return await db.query(
      "INSERT INTO ofertas SET ? ",
      productObj,
      "insert",
      conn
    );
  } catch (e) {
    throw new Error(e);
  } finally {
    conn && (await conn.end());
  }
};

productQueries.updateOffer = async (id, userData) => {
  let conn = null;
  try {
    conn = await db.createConnection();
    let userObj = {
      activo: userData.activo,
    };
    // Eliminamos los campos que no se van a modificar (no llegan por el body)
    userObj = await utils.removeUndefinedKeys(userObj);

    return await db.query(
      "UPDATE ofertas SET ? WHERE id = ?",
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

productQueries.getOffer = async () => {
  let conn = null;
  try {
    conn = await db.createConnection();
    return await db.query("SELECT * from ofertas", [], "select", conn);
  } catch (e) {
    throw new Error(e);
  } finally {
    conn && (await conn.end());
  }
};

productQueries.getOfferActive = async () => {
  let conn = null;
  try {
    conn = await db.createConnection();
    return await db.query(
      "SELECT * FROM ofertas where activo = 1",
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

module.exports = productQueries;

// export default productQueries;

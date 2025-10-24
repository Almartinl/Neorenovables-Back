// import { currentDir } from "../index.js";
// import dao from "../services/dao.js";

const dirInfo = require("../index.js");
const dao = require("../services/dao.js");

// Definimos la constante __dirname donde obtendremos la ruta absoluta
// const dirname = dirInfo.__filename;

const controller = {};

// ===== Categorías =====
controller.getCategorias = async (req, res) => {
  try {
    const categorias = await dao.getCategorias();
    res.json(categorias);
  } catch (e) {
    res.status(500).send(e.message);
  }
};

controller.addCategoria = async (req, res) => {
  try {
    const { nombre, descripcion, atributos } = req.body;
    let uploadRelImg = null;

    // Imagen de categoría
    if (req.files?.img) {
      const img = req.files.img;
      const uploadPath = "./public/img/categorias/" + img.name;
      uploadRelImg = "/img/categorias/" + img.name;
      await img.mv(uploadPath);
    }

    // Crear categoría
    const categoriaId = await dao.addCategoria({
      nombre,
      descripcion,
      img: uploadRelImg,
    });

    // Crear atributos asociados
    if (atributos) {
      let arr = [];
      try {
        arr = typeof atributos === "string" ? JSON.parse(atributos) : atributos;
      } catch {}
      for (const atr of arr) {
        await dao.addAtributoCategoria(
          categoriaId,
          atr.nombre,
          atr.tipo || "texto"
        );
      }
    }

    res.status(201).json({ id: categoriaId });
  } catch (e) {
    console.error(e);
    res.status(500).send("Error al crear la categoría");
  }
};

controller.getCategoriaById = async (req, res) => {
  try {
    const categoria = await dao.getCategoriaById(req.params.id);
    if (!categoria) return res.status(404).send("Categoría no encontrada");

    const atributos = await dao.getAtributosByCategoria(req.params.id);
    res.json({ ...categoria, atributos });
  } catch (e) {
    res.status(500).send(e.message);
  }
};

controller.deleteCategoria = async (req, res) => {
  try {
    await dao.deleteCategoria(req.params.id);
    res.send("Categoría eliminada");
  } catch (e) {
    res.status(500).send(e.message);
  }
};

// ===== Productos =====
controller.getProductosByCategoria = async (req, res) => {
  try {
    const productos = await dao.getProductosByCategoria(req.params.id);
    for (let p of productos) {
      p.valores = await dao.getValoresByProducto(p.id);
    }
    res.json(productos);
  } catch (e) {
    res.status(500).send(e.message);
  }
};

controller.addProducto = async (req, res) => {
  try {
    let {
      categoria_id,
      nombre,
      proveedor,
      precio_compra,
      precio_venta,
      marca,
      descripcion,
      valores,
    } = req.body;

    let ficha = null;
    if (req.files?.ficha) {
      const pdf = req.files.ficha;
      const uploadPath = "./public/pdfs/" + pdf.name;
      ficha = "/pdfs/" + pdf.name;
      await pdf.mv(uploadPath);
    }

    // Insertar producto
    const productoId = await dao.addProducto({
      categoria_id,
      nombre,
      proveedor,
      precio_compra,
      precio_venta,
      marca,
      descripcion,
      ficha,
    });

    // Insertar valores de atributos
    if (valores) {
      let arr = [];
      try {
        arr = typeof valores === "string" ? JSON.parse(valores) : valores;
      } catch {}
      for (const v of arr) {
        await dao.addValorProducto(productoId, v.atributocategoria_id, v.valor);
      }
    }

    res.status(201).json({ id: productoId });
  } catch (e) {
    console.error(e);
    res.status(500).send("Error al crear el producto");
  }
};

controller.getProductoById = async (req, res) => {
  try {
    const producto = await dao.getProductoById(req.params.id);
    if (!producto) return res.status(404).send("Producto no encontrado");

    const valores = await dao.getValoresByProducto(req.params.id);
    res.json({ ...producto, valores });
  } catch (e) {
    res.status(500).send(e.message);
  }
};

controller.updateProducto = async (req, res) => {
  try {
    const { id } = req.params;
    let { valores, ...productoData } = req.body;

    // Manejo de archivo PDF
    if (req.files?.ficha) {
      const pdf = req.files.ficha;
      const uploadPath = "./public/pdfs/" + pdf.name;
      productoData.ficha = "/pdfs/" + pdf.name;
      await pdf.mv(uploadPath);
    }

    // Actualizar producto
    await dao.updateProducto(id, productoData);

    // Actualizar valores de atributos
    if (valores) {
      let arr = [];
      try {
        arr = typeof valores === "string" ? JSON.parse(valores) : valores;
      } catch {}

      await dao.deleteValoresByProducto(id);
      for (const v of arr) {
        await dao.addValorProducto(id, v.atributocategoria_id, v.valor);
      }
    }

    res.status(200).json({ message: "Producto actualizado correctamente" });
  } catch (e) {
    console.error(e);
    res.status(500).send(e.message);
  }
};

controller.deleteProducto = async (req, res) => {
  try {
    await dao.deleteProducto(req.params.id);
    res.send("Producto eliminado");
  } catch (e) {
    res.status(500).send(e.message);
  }
};



// // ===== Categorías =====
// controller.getCategorias = async (req, res) => {
//   try {
//     const categorias = await dao.getCategorias();
//     res.json(categorias);
//   } catch (e) {
//     res.status(500).send(e.message);
//   }
// };

// controller.addCategoria = async (req, res) => {
//   try {
//     let uploadRelImg = null;

//     // 👇 Si se ha subido una imagen
//     if (req.files && req.files.img) {
//       const img = req.files.img;
//       const uploadPath = "./public/img/categorias/" + img.name; // ruta absoluta
//       uploadRelImg = "/img/categorias/" + img.name; // ruta relativa para servirla

//       // Guardamos el archivo en el servidor
//       img.mv(uploadPath, (err) => {
//         if (err) return res.status(500).send("Error al guardar la imagen");
//       });
//     }

//     // Creamos la categoría en la BD (añadimos la ruta de la imagen si existe)
//     const addCategoria = await dao.addCategoria({
//       ...req.body,
//       img: uploadRelImg,
//     });

//     if (addCategoria) {
//       return res.send(`Categoría con id ${addCategoria} registrada`);
//     }
//   } catch (e) {
//     console.log(e.message);
//     return res.status(500).send("Error al crear la categoría");
//   }
// };

// controller.getCategoriaById = async (req, res) => {
//   try {
//     const categoria = await dao.getCategoriaById(req.params.id);
//     if (!categoria) return res.status(404).send("Categoría no encontrada");
//     res.json(categoria);
//   } catch (e) {
//     res.status(500).send(e.message);
//   }
// };

// controller.deleteCategoria = async (req, res) => {
//   try {
//     await dao.deleteCategoria(req.params.id);
//     res.send("Categoría eliminada");
//   } catch (e) {
//     res.status(500).send(e.message);
//   }
// };

// // ===== Productos =====
// controller.getProductosByCategoria = async (req, res) => {
//   try {
//     const productos = await dao.getProductosByCategoria(req.params.id);
//     res.json(productos);
//   } catch (e) {
//     res.status(500).send(e.message);
//   }
// };

// controller.addProducto = async (req, res) => {
//   try {
//     let ficha = null;

//     // Manejo de archivo PDF
//     if (req.files && req.files.ficha) {
//       const pdf = req.files.ficha;
//       const uploadPath = "./public/pdfs/" + pdf.name;
//       ficha = "/pdfs/" + pdf.name;
//       await pdf.mv(uploadPath);
//     }

//     // Insertamos producto
//     const productoId = await dao.addProducto(req.body, ficha);

//     // Insertamos atributos dinámicos
//     if (req.body.atributos) {
//       let atributosArray = [];
//       try {
//         atributosArray = JSON.parse(req.body.atributos); // ✅ convertir JSON string a array
//       } catch (err) {
//         console.error("Error parseando atributos JSON:", err);
//       }

//       if (Array.isArray(atributosArray)) {
//         for (const atr of atributosArray) {
//           // Ajusta según tus nombres de clave y valor
//           await dao.addAtributo(productoId, atr.nombre, atr.valor);
//         }
//       }
//     }

//     res.status(201).json({ id: productoId });
//   } catch (e) {
//     console.error(e);
//     res.status(500).send(e.message);
//   }
// };

// controller.getProductoById = async (req, res) => {
//   try {
//     const producto = await dao.getProductoById(req.params.id);
//     if (!producto) return res.status(404).send("Producto no encontrado");

//     const atributos = await dao.getAtributosByProducto(req.params.id);
//     res.json({ ...producto, atributos });
//   } catch (e) {
//     res.status(500).send(e.message);
//   }
// };

// controller.updateProducto = async (req, res) => {
//   try {
//     const { id } = req.params;

//     // Separar atributos del resto del producto
//     let { atributos, ...productoData } = req.body;

//     // Manejo de archivo PDF (si se permite editar ficha)
//     let ficha = null;
//     if (req.files && req.files.ficha) {
//       const pdf = req.files.ficha;
//       const uploadPath = "./public/pdfs/" + pdf.name;
//       ficha = "/pdfs/" + pdf.name;
//       await pdf.mv(uploadPath);
//       productoData.ficha = ficha;
//     }

//     // Actualizar campos del producto
//     await dao.updateProducto(id, productoData);

//     // Parsear atributos si vienen como string
//     if (atributos && typeof atributos === "string") {
//       try {
//         atributos = JSON.parse(atributos);
//       } catch (e) {
//         return res.status(400).send("Atributos inválidos");
//       }
//     }

//     // Si hay atributos y es un array, los actualizamos
//     if (Array.isArray(atributos)) {
//       // Obtener los atributos actuales en BD
//       const atributosActuales = await dao.getAtributosByProducto(id);

//       // Borrar todos los atributos actuales
//       for (const atr of atributosActuales) {
//         await dao.deleteAtributo(atr.id);
//       }

//       // Insertar todos los atributos nuevos/modificados
//       for (const atr of atributos) {
//         if (atr.nombre && atr.valor) {
//           await dao.addAtributo(id, atr.nombre.trim(), atr.valor.trim());
//         }
//       }
//     }

//     res.status(200).json({ message: "Producto actualizado correctamente" });
//   } catch (e) {
//     console.error(e);
//     res.status(500).send(e.message);
//   }
// };

// controller.deleteProducto = async (req, res) => {
//   try {
//     await dao.deleteProducto(req.params.id);
//     res.send("Producto eliminado");
//   } catch (e) {
//     res.status(500).send(e.message);
//   }
// };

// // ===== Paneles, Inversores y Baterías =====

// controller.getPaneles = async (req, res) => {
//   const { nulo } = req.body;
//   try {
//     const product = await dao.getPaneles();
//     console.log(product);
//     // Si no existe devolvemos un 404 (not found)
//     if (product.length <= 0) return res.status(404).json([]);
//     // Devolvemos la ruta donde se encuentra la imagen
//     // const response = product.map((item) => {
//     //   return {
//     //     ...item,
//     //     imagenes: JSON.parse(item.imagenes),
//     //   };
//     // });

//     return res.send(product);
//   } catch (e) {
//     console.log(e.message);
//     return res.status(400).send(e.message);
//   }
// };

// controller.updatePaneles = async (req, res) => {
//   try {
//     // Si no nos llega ningún campo por el body devolvemos un 400 (bad request)
//     if (Object.entries(req.body).length === 0)
//       return res.status(400).send("Error al recibir el body");

//     let uploadRelPdf = null;

//     // Si se ha subido un nuevo PDF
//     if (req.files && req.files.ficha) {
//       const pdf = req.files.ficha;
//       const uploadPdf = `./public/pdfs/paneles/${pdf.name}`;
//       uploadRelPdf = `/pdfs/paneles/${pdf.name}`;

//       // Guardamos el nuevo archivo
//       pdf.mv(uploadPdf, (err) => {
//         if (err) return res.status(500).send("Error al guardar el archivo PDF");
//       });
//     }

//     // Pasamos los datos a actualizar, incluyendo la ruta del PDF si existe
//     const datosActualizados = {
//       ...req.body,
//       ...(uploadRelPdf && { ficha: uploadRelPdf }),
//     };

//     await dao.updatePaneles(req.params.id, datosActualizados);
//     // Devolvemos la respuesta
//     return res.send(`Panel con id ${req.params.id} modificado`);
//   } catch (e) {
//     console.log(e.message);
//   }
// };

// controller.addPanel = async (req, res) => {
//   try {
//     let uploadRelPdf = null;

//     // Si se ha subido un archivo PDF
//     if (req.files && req.files.ficha) {
//       const pdf = req.files.ficha;
//       const uploadPdf = "./public/pdfs/paneles/" + pdf.name;
//       uploadRelPdf = "/pdfs/paneles/" + pdf.name;

//       // Guardar el archivo en el servidor
//       pdf.mv(uploadPdf, (err) => {
//         if (err) return res.status(500).send(err);
//       });
//     }
//     const addPanel = await dao.addPanel(req.body, uploadRelPdf);
//     console.log(addPanel);

//     if (addPanel) {
//       return res.send(`Panel con id ${addPanel} registrado`);
//     }
//   } catch (e) {
//     console.log(e.message);
//   }
// };

// controller.deletePanelById = async (req, res) => {
//   try {
//     const panel = await dao.deletePanelById(req.params.id);

//     if (panel.length <= 0) return res.status(404).send("panel no existe");

//     return res.send(`panel ${req.params.id} eliminado`).status(200);
//   } catch (e) {
//     console.log(e.message);
//   }
// };

// controller.getInversores = async (req, res) => {
//   const { nulo } = req.body;
//   try {
//     const product = await dao.getInversores();
//     console.log(product);
//     // Si no existe devolvemos un 404 (not found)
//     if (product.length <= 0) return res.status(404).json([]);
//     // Devolvemos la ruta donde se encuentra la imagen
//     // const response = product.map((item) => {
//     //   return {
//     //     ...item,
//     //     imagenes: JSON.parse(item.imagenes),
//     //   };
//     // });

//     return res.send(product);
//   } catch (e) {
//     console.log(e.message);
//     return res.status(400).send(e.message);
//   }
// };

// controller.updateInversores = async (req, res) => {
//   try {
//     // Si no nos llega ningún campo por el body devolvemos un 400 (bad request)
//     if (Object.entries(req.body).length === 0)
//       return res.status(400).send("Error al recibir el body");
//     let uploadRelPdf = null;

//     // Si se ha subido un nuevo PDF
//     if (req.files && req.files.ficha) {
//       const pdf = req.files.ficha;
//       const uploadPdf = `./public/pdfs/inversores/${pdf.name}`;
//       uploadRelPdf = `/pdfs/inversores/${pdf.name}`;

//       // Guardamos el nuevo archivo
//       pdf.mv(uploadPdf, (err) => {
//         if (err) return res.status(500).send("Error al guardar el archivo PDF");
//       });
//     }

//     // Pasamos los datos a actualizar, incluyendo la ruta del PDF si existe
//     const datosActualizados = {
//       ...req.body,
//       ...(uploadRelPdf && { ficha: uploadRelPdf }),
//     };

//     await dao.updateInversores(req.params.id, datosActualizados);
//     return res.send(`Inversor con id ${req.params.id} modificado`);
//   } catch (e) {
//     console.log(e.message);
//   }
// };

// controller.addInversor = async (req, res) => {
//   try {
//     let uploadRelPdf = null;

//     // Si se ha subido un archivo PDF
//     if (req.files && req.files.ficha) {
//       const pdf = req.files.ficha;
//       const uploadPdf = "./public/pdfs/inversores/" + pdf.name;
//       uploadRelPdf = "/pdfs/inversores/" + pdf.name;

//       // Guardar el archivo en el servidor
//       pdf.mv(uploadPdf, (err) => {
//         if (err) return res.status(500).send(err);
//       });
//     }
//     const addInversor = await dao.addInversor(req.body, uploadRelPdf);

//     if (addInversor) {
//       return res.send(`Inversor con id ${addInversor} registrado`);
//     } else {
//       return res.status(500).send("Error al registrar inversor");
//     }
//   } catch (e) {
//     console.log(e.message);
//   }
// };

// controller.deleteInversorById = async (req, res) => {
//   try {
//     const inversor = await dao.deleteInversorById(req.params.id);

//     if (inversor.length <= 0) return res.status(404).send("inversor no existe");

//     return res.send(`inversor ${req.params.id} eliminado`).status(200);
//   } catch (e) {
//     console.log(e.message);
//   }
// };

// controller.getBaterias = async (req, res) => {
//   const { nulo } = req.body;
//   try {
//     const product = await dao.getBaterias();
//     console.log(product);
//     // Si no existe devolvemos un 404 (not found)
//     if (product.length <= 0) return res.status(404).json([]);
//     // Devolvemos la ruta donde se encuentra la imagen
//     // const response = product.map((item) => {
//     //   return {
//     //     ...item,
//     //     imagenes: JSON.parse(item.imagenes),
//     //   };
//     // });

//     return res.send(product);
//   } catch (e) {
//     console.log(e.message);
//     return res.status(400).send(e.message);
//   }
// };

// controller.updateBaterias = async (req, res) => {
//   try {
//     // Comprobamos que al menos venga algo en el body
//     if (Object.entries(req.body).length === 0 && !req.files?.ficha)
//       return res.status(400).send("No se recibió ningún dato para actualizar");

//     let uploadRelPdf = null;

//     // Si se ha subido un nuevo PDF
//     if (req.files && req.files.ficha) {
//       const pdf = req.files.ficha;
//       const uploadPdf = `./public/pdfs/baterias/${pdf.name}`;
//       uploadRelPdf = `/pdfs/baterias/${pdf.name}`;

//       // Guardamos el nuevo archivo
//       pdf.mv(uploadPdf, (err) => {
//         if (err) return res.status(500).send("Error al guardar el archivo PDF");
//       });
//     }

//     // Pasamos los datos a actualizar, incluyendo la ruta del PDF si existe
//     const datosActualizados = {
//       ...req.body,
//       ...(uploadRelPdf && { ficha: uploadRelPdf }),
//     };

//     await dao.updateBaterias(req.params.id, datosActualizados);

//     return res.send(`Batería con id ${req.params.id} modificada`);
//   } catch (e) {
//     console.error(e.message);
//     return res.status(500).send("Error interno al actualizar la batería");
//   }
// };

// controller.addBateria = async (req, res) => {
//   try {
//     let uploadRelPdf = null;

//     // Si se ha subido un archivo PDF
//     if (req.files && req.files.ficha) {
//       const pdf = req.files.ficha;
//       const uploadPdf = "./public/pdfs/baterias/" + pdf.name;
//       uploadRelPdf = "/pdfs/baterias/" + pdf.name;

//       // Guardar el archivo en el servidor
//       pdf.mv(uploadPdf, (err) => {
//         if (err) return res.status(500).send(err);
//       });
//     }

//     // Guardar la batería en la base de datos (con o sin PDF)
//     const bateria = await dao.addBateria(req.body, uploadRelPdf);

//     if (bateria) {
//       return res.send(`Batería con id ${bateria} registrada`);
//     } else {
//       return res.status(500).send("Error al registrar batería");
//     }
//   } catch (e) {
//     console.log(e.message);
//     res.status(500).send("Error interno del servidor");
//   }
// };

// controller.deleteBateriaById = async (req, res) => {
//   try {
//     const bateria = await dao.deleteBateriaById(req.params.id);

//     if (bateria.length <= 0) return res.status(404).send("bateria no existe");

//     return res.send(`bateria ${req.params.id} eliminado`).status(200);
//   } catch (e) {
//     console.log(e.message);
//   }
// };

// controller.getProductByCategory = async (req, res) => {
//   try {
//     const product = await dao.getProductsByCategory(req.body.categoria);
//     // Si no existe devolvemos un 404 (not found)
//     if (product.length <= 0) return res.status(404).send("productos no existe");
//     // Devolvemos la ruta donde se encuentra la imagen
//     // console.log(product[0]);
//     // const response = {
//     //   ...product[0],
//     //   imagenes: JSON.parse(product[0].imagenes),
//     // };
//     return res.send(product);
//   } catch (e) {
//     console.log(e.message);
//     return res.status(400).send(e.message);
//   }
// };



module.exports = controller;

// export default controller;

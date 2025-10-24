// import { jwtVerify, SignJWT } from "jose";
// import md5 from "md5";
// import dao from "../services/dao.js";

const { jwtVerify, SignJWT } = require("jose");
const md5 = require("md5");
const dao = require("../services/dao.js");
// const transporter = require("../config/nodemailer.js");
const fs = require("fs");

const controller = {};

controller.getUsers = async (req, res) => {
  const {} = req.body;
  try {
    const users = await dao.getUsers();

    if (users.length <= 0) return res.status(404).send("usuarios no existe");

    return res.send(users);
  } catch (e) {
    console.log(e.message);
    return res.status(400).send(e.message);
  }
};

controller.getUserByEmail = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await dao.getUserByEmail(email);
    if (user.length <= 0) return res.status(404).send("usuario no registrado");
    return res.send(user);
  } catch (e) {
    console.log(e.message);
    return res.status(400).send(e.message);
  }
};

controller.addUser = async (req, res) => {
  const { nombre, email, password } = req.body;
  if (!nombre || !email || !password)
    return res.status(400).send("Error al recibir el body");

  try {
    const user = await dao.getUserByEmail(email);

    if (user.length > 0) return res.status(409).send("usuario ya registrado");

    const addUser = await dao.addUser(req.body);

    if (addUser) {
      return res.send(`Usuario ${nombre} con id: ${addUser} registrado`);
    }
  } catch (e) {
    console.log(e.message);
  }
};

controller.loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).send("Error al recibir el body");

  try {
    let user = await dao.getUserByEmail(email);
    if (user.length <= 0) return res.status(404).send("usuario no registrado");
    const clientPassword = md5(password);
    console.log(user);

    // [user] = user;
    const [newUser] = user;

    if (newUser.password !== clientPassword)
      return res.status(401).send("Password incorrecta");
    else if (newUser.activo == 0) {
      return res.status(403).send("Usuario no activo");
    }

    const jwtConstructor = new SignJWT({
      id: newUser.id,
      email,
      nombre: newUser.nombre,
      apellido: newUser.apellido,
      role: newUser.rol,
      activo: newUser.activo,
    });

    const encoder = new TextEncoder();

    const jwt = await jwtConstructor
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(encoder.encode(process.env.JWT_SECRET));

    return res.send({ jwt });
  } catch (e) {
    console.log(e.message);
  }
};

// controller.deleteUser = async (req, res) => {
//   // const { authorization } = req.headers;

//   // if (!authorization) return res.sendStatus(401);
//   // const token = authorization.split(" ")[1];

//   try {
//     // const encoder = new TextEncoder();

//     // const { payload } = await jwtVerify(
//     //   token,
//     //   encoder.encode(process.env.JWT_SECRET)
//     // );

//     // if (!payload.role)
//     //   return res.status(409).send("no tiene permiso de administrador");

//     const user = await dao.getUserById(req.params.id);

//     if (user.length <= 0) return res.status(404).send("el usuario no existe");

//     await dao.deleteUser(req.params.id);

//     return res.send(`El usuario con id ${req.params.id} eliminado`).status(200);
//   } catch (e) {
//     console.log(e.message);
//   }
// };

// controller.getVerify = async (req, res) => {
//   // const { authorization } = req.headers;

//   // if (!authorization) return res.sendStatus(401);
//   // const token = authorization.split(" ")[1];

//   try {
//     // const encoder = new TextEncoder();

//     // const { payload } = await jwtVerify(
//     //   token,
//     //   encoder.encode(process.env.JWT_SECRET)
//     // );

//     // if (!payload.role)
//     //   return res.status(409).send("no tiene permiso de administrador");

//     const user = await dao.getUserById(req.params.id);

//     if (user.length <= 0) return res.status(404).send("el usuario no existe");

//     await dao.getVerify(req.params.id);

//     return res
//       .send(`Utilisateur vérifié, vous pouvez maintenant fermer cet onglet`)
//       .status(200);
//   } catch (e) {
//     console.log(e.message);
//   }
// };

// Controlador para modificar un usuario por su id
controller.updateUser = async (req, res) => {
  // const { authorization } = req.headers;
  // // Si no existe el token enviamos un 401 (unauthorized)
  // if (!authorization) return res.sendStatus(401);

  try {
    // Si no nos llega ningún campo por el body devolvemos un 400 (bad request)
    if (Object.entries(req.body).length === 0)
      return res.status(400).send("Error al recibir el body");
    // Actualizamos el usuario
    await dao.updateUser(req.params.id, req.body);
    // Devolvemos la respuesta
    return res.send(`Usuario con id ${req.params.id} modificado`);
  } catch (e) {
    console.log(e.message);
  }
};

// controller.getCountUser = async (req, res) => {
//   const {} = req.body;
//   try {
//     const users = await dao.getCountUser();

//     if (users.length <= 0) return res.status(404).send("usuarios no existe");

//     return res.send(users);
//   } catch (e) {
//     console.log(e.message);
//     return res.status(400).send(e.message);
//   }
// };

// controller.addContact = async (req, res) => {
//   const { nombre, email, descripcion, telefono, apellidos } = req.body;
//   if (!nombre || !email || !descripcion)
//     return res.status(400).send("Error al recibir el body");

//   try {
//     const addContact = await dao.addContact(req.body);
//     let uploadFoto = "";
//     let plano;
//     if (req.files) {
//       plano = req.files.foto;

//       uploadFoto = "./public/images/products/" + plano.name;
//       plano.mv(uploadFoto, (err) => {
//         if (err) return res.status(500).send(err);
//       });
//     }

//     if (addContact) {
//       await transporter.sendMail({
//         from: '"Demande Web GSP" <info@globalsolutionsprefabriquees.com>', // sender address
//         to: `<${email}>`, // list of receivers
//         subject: `Demande client ${nombre}`, // Subject line
//         html: `
//         <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
// <head>
// <!--[if gte mso 9]>
// <xml>
//   <o:OfficeDocumentSettings>
//     <o:AllowPNG/>
//     <o:PixelsPerInch>96</o:PixelsPerInch>
//   </o:OfficeDocumentSettings>
// </xml>
// <![endif]-->
//   <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
//   <meta name="viewport" content="width=device-width, initial-scale=1.0">
//   <meta name="x-apple-disable-message-reformatting">
//   <!--[if !mso]><!--><meta http-equiv="X-UA-Compatible" content="IE=edge"><!--<![endif]-->
//   <title></title>

//     <style type="text/css">
//       @media only screen and (min-width: 520px) {
//   .u-row {
//     width: 500px !important;
//   }
//   .u-row .u-col {
//     vertical-align: top;
//   }

//   .u-row .u-col-30 {
//     width: 150px !important;
//   }

//   .u-row .u-col-70 {
//     width: 350px !important;
//   }

//   .u-row .u-col-100 {
//     width: 500px !important;
//   }

// }

// @media (max-width: 520px) {
//   .u-row-container {
//     max-width: 100% !important;
//     padding-left: 0px !important;
//     padding-right: 0px !important;
//   }
//   .u-row .u-col {
//     min-width: 320px !important;
//     max-width: 100% !important;
//     display: block !important;
//   }
//   .u-row {
//     width: 100% !important;
//   }
//   .u-col {
//     width: 100% !important;
//   }
//   .u-col > div {
//     margin: 0 auto;
//   }
// }
// body {
//   margin: 0;
//   padding: 0;
// }

// table,
// tr,
// td {
//   vertical-align: top;
//   border-collapse: collapse;
// }

// p {
//   margin: 0;
// }

// .ie-container table,
// .mso-container table {
//   table-layout: fixed;
// }

// * {
//   line-height: inherit;
// }

// a[x-apple-data-detectors='true'] {
//   color: inherit !important;
//   text-decoration: none !important;
// }

// table, td { color: #000000; } #u_body a { color: #0000ee; text-decoration: underline; }
//     </style>

// </head>

// <body class="clean-body u_body" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #e7e7e7;color: #000000">
//   <!--[if IE]><div class="ie-container"><![endif]-->
//   <!--[if mso]><div class="mso-container"><![endif]-->
//   <table id="u_body" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #e7e7e7;width:100%" cellpadding="0" cellspacing="0">
//   <tbody>
//   <tr style="vertical-align: top">
//     <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
//     <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #e7e7e7;"><![endif]-->

// <div class="u-row-container" style="padding: 0px;background-color: transparent">
//   <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
//     <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
//       <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px;"><tr style="background-color: transparent;"><![endif]-->

// <!--[if (mso)|(IE)]><td align="center" width="500" style="width: 500px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
// <div class="u-col u-col-100" style="max-width: 320px;min-width: 500px;display: table-cell;vertical-align: top;">
//   <div style="height: 100%;width: 100% !important;">
//   <!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]-->

// <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
//   <tbody>
//     <tr>
//       <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">

// <table width="100%" cellpadding="0" cellspacing="0" border="0">
//   <tr>
//     <td style="padding-right: 0px;padding-left: 0px;" align="center">

//       <img align="center" border="0" src="https://almartindev.com/api/images/logo.png" alt="" title="" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 100%;max-width: 480px;" width="480"/>

//     </td>
//   </tr>
// </table>

//       </td>
//     </tr>
//   </tbody>
// </table>

// <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
//   <tbody>
//     <tr>
//       <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">

//   <table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #BBBBBB;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
//     <tbody>
//       <tr style="vertical-align: top">
//         <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
//           <span>&#160;</span>
//         </td>
//       </tr>
//     </tbody>
//   </table>

//       </td>
//     </tr>
//   </tbody>
// </table>

// <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
//   <tbody>
//     <tr>
//       <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">

//   <h1 style="margin: 0px; line-height: 140%; text-align: center; word-wrap: break-word; font-size: 22px; font-weight: 400;"><p>Merci de nous avoir contactés, nous répondrons rapidement à votre demande.</p>
// <p> </p></h1>

//       </td>
//     </tr>
//   </tbody>
// </table>

// <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
//   <tbody>
//     <tr>
//       <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">

//   <div style="font-size: 14px; line-height: 140%; text-align: center; word-wrap: break-word;">
//     <p style="line-height: 140%;">Salutations de l'équipe GSP</p>
//   </div>

//       </td>
//     </tr>
//   </tbody>
// </table>

// <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
//   <tbody>
//     <tr>
//       <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">

//   <table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #BBBBBB;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
//     <tbody>
//       <tr style="vertical-align: top">
//         <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
//           <span>&#160;</span>
//         </td>
//       </tr>
//     </tbody>
//   </table>

//       </td>
//     </tr>
//   </tbody>
// </table>

//   <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
//   </div>
// </div>
// <!--[if (mso)|(IE)]></td><![endif]-->
//       <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
//     </div>
//   </div>
// </div>

// <div class="u-row-container" style="padding: 0px;background-color: #3b8f1e">
//   <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #3b8f1e;">
//     <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
//       <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: #3b8f1e;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px;"><tr style="background-color: #3b8f1e;"><![endif]-->

// <!--[if (mso)|(IE)]><td align="center" width="350" style="width: 350px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
// <div class="u-col u-col-70" style="max-width: 320px;min-width: 350px;display: table-cell;vertical-align: top;">
//   <div style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
//   <!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"><!--<![endif]-->

// <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
//   <tbody>
//     <tr>
//       <td style="overflow-wrap:break-word;word-break:break-word;padding:17px 10px 10px;font-family:arial,helvetica,sans-serif;" align="left">

//   <div style="font-size: 14px; font-weight: 400; line-height: 140%; text-align: center; word-wrap: break-word;">
//     <p style="line-height: 140%;"><span style="color: #ffffff; text-align: center; white-space: normal; background-color: #3b8f1e; float: none; display: inline; line-height: 19.6px;">Copyright © Global Solutios Prefabriquees</span><span style="color: #ffffff; text-align: center; white-space: normal; background-color: #3b8f1e; float: none; display: inline; line-height: 19.6px;"> </span><span style="color: #ffffff; text-align: center; white-space: normal; background-color: #3b8f1e; float: none; display: inline; line-height: 19.6px;">2023</span><span style="color: #ffffff; text-align: center; white-space: normal; background-color: #3b8f1e; float: none; display: inline; line-height: 19.6px;">.</span></p>
//   </div>

//       </td>
//     </tr>
//   </tbody>
// </table>

//   <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
//   </div>
// </div>
// <!--[if (mso)|(IE)]></td><![endif]-->
// <!--[if (mso)|(IE)]><td align="center" width="150" style="width: 150px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
// <div class="u-col u-col-30" style="max-width: 320px;min-width: 150px;display: table-cell;vertical-align: top;">
//   <div style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
//   <!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"><!--<![endif]-->

// <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
//   <tbody>
//     <tr>
//       <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">

// <div align="center">
//   <div style="display: table; max-width:110px;">
//   <!--[if (mso)|(IE)]><table width="110" cellpadding="0" cellspacing="0" border="0"><tr><td style="border-collapse:collapse;" align="center"><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse; mso-table-lspace: 0pt;mso-table-rspace: 0pt; width:110px;"><tr><![endif]-->

//     <!--[if (mso)|(IE)]><td width="32" style="width:32px; padding-right: 5px;" valign="top"><![endif]-->
//     <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="width: 32px !important;height: 32px !important;display: inline-block;border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;margin-right: 5px">
//       <tbody><tr style="vertical-align: top"><td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
//         <a href="https://www.facebook.com/Global-Solutions-Pr%C3%A9fabriqu%C3%A9es-115355516956606" title="Facebook" target="_blank">
//           <img src="https://almartindev.com/api/images/facebook.png" alt="Facebook" title="Facebook" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">
//         </a>
//       </td></tr>
//     </tbody></table>
//     <!--[if (mso)|(IE)]></td><![endif]-->

//     <!--[if (mso)|(IE)]><td width="32" style="width:32px; padding-right: 5px;" valign="top"><![endif]-->
//     <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="width: 32px !important;height: 32px !important;display: inline-block;border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;margin-right: 5px">
//       <tbody><tr style="vertical-align: top"><td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
//         <a href="https://www.linkedin.com/company/global-solutions-pr%C3%A9fabriqu%C3%A9es/" title="LinkedIn" target="_blank">
//           <img src="https://almartindev.com/api/images/linkedin.png" alt="LinkedIn" title="LinkedIn" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">
//         </a>
//       </td></tr>
//     </tbody></table>
//     <!--[if (mso)|(IE)]></td><![endif]-->

//     <!--[if (mso)|(IE)]><td width="32" style="width:32px; padding-right: 0px;" valign="top"><![endif]-->
//     <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="width: 32px !important;height: 32px !important;display: inline-block;border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;margin-right: 0px">
//       <tbody><tr style="vertical-align: top"><td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
//         <a href="https://api.whatsapp.com/send?phone=221772260577&text=Bonjour%20GLOBAL%20SOLUTIONS%20PREFABRIQUEES.%20Je%20suis%20un/une%20interess%C3%A9(e)." title="WhatsApp" target="_blank">
//           <img src="https://almartindev.com/api/images/whats.png" alt="WhatsApp" title="WhatsApp" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">
//         </a>
//       </td></tr>
//     </tbody></table>
//     <!--[if (mso)|(IE)]></td><![endif]-->

//     <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
//   </div>
// </div>

//       </td>
//     </tr>
//   </tbody>
// </table>

//   <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
//   </div>
// </div>
// <!--[if (mso)|(IE)]></td><![endif]-->
//       <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
//     </div>
//   </div>
// </div>

//     <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
//     </td>
//   </tr>
//   </tbody>
//   </table>
//   <!--[if mso]></div><![endif]-->
//   <!--[if IE]></div><![endif]-->
// </body>

// </html>
//         `,
//       });

//       // await transporter.sendMail({
//       //   from: '"Demande Web GSP" <info@globalsolutionsprefabriquees.com>', // sender address
//       //   to: `<globalsolutionsprefabriquees@gmail.com>`, // list of receivers
//       //   subject: `Demande client ${nombre}`, // Subject line
//       //   html: `
//       //   <html
//       //   xmlns="http://www.w3.org/1999/xhtml"
//       //   xmlns:v="urn:schemas-microsoft-com:vml"
//       //   xmlns:o="urn:schemas-microsoft-com:office:office"
//       // >
//       //   <head>
//       //     <!--[if gte mso 9]>
//       //       <xml>
//       //         <o:OfficeDocumentSettings>
//       //           <o:AllowPNG />
//       //           <o:PixelsPerInch>96</o:PixelsPerInch>
//       //         </o:OfficeDocumentSettings>
//       //       </xml>
//       //     <![endif]-->
//       //     <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
//       //     <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//       //     <meta name="x-apple-disable-message-reformatting" />
//       //     <!--[if !mso]><!-->
//       //     <meta http-equiv="X-UA-Compatible" content="IE=edge" />
//       //     <!--<![endif]-->
//       //     <title></title>

//       //     <style type="text/css">
//       //       @media only screen and (min-width: 520px) {
//       //         .u-row {
//       //           width: 500px !important;
//       //         }
//       //         .u-row .u-col {
//       //           vertical-align: top;
//       //         }

//       //         .u-row .u-col-30p6 {
//       //           width: 153px !important;
//       //         }

//       //         .u-row .u-col-69p4 {
//       //           width: 347px !important;
//       //         }

//       //         .u-row .u-col-100 {
//       //           width: 500px !important;
//       //         }
//       //       }

//       //       @media (max-width: 520px) {
//       //         .u-row-container {
//       //           max-width: 100% !important;
//       //           padding-left: 0px !important;
//       //           padding-right: 0px !important;
//       //         }
//       //         .u-row .u-col {
//       //           min-width: 320px !important;
//       //           max-width: 100% !important;
//       //           display: block !important;
//       //         }
//       //         .u-row {
//       //           width: 100% !important;
//       //         }
//       //         .u-col {
//       //           width: 100% !important;
//       //         }
//       //         .u-col > div {
//       //           margin: 0 auto;
//       //         }
//       //       }
//       //       body {
//       //         margin: 0;
//       //         padding: 0;
//       //       }

//       //       table,
//       //       tr,
//       //       td {
//       //         vertical-align: top;
//       //         border-collapse: collapse;
//       //       }

//       //       p {
//       //         margin: 0;
//       //       }

//       //       .ie-container table,
//       //       .mso-container table {
//       //         table-layout: fixed;
//       //       }

//       //       * {
//       //         line-height: inherit;
//       //       }

//       //       a[x-apple-data-detectors="true"] {
//       //         color: inherit !important;
//       //         text-decoration: none !important;
//       //       }

//       //       table,
//       //       td {
//       //         color: #000000;
//       //       }
//       //       #u_body a {
//       //         color: #0000ee;
//       //         text-decoration: underline;
//       //       }
//       //     </style>
//       //   </head>

//       //   <body
//       //     class="clean-body u_body"
//       //     style="
//       //       margin: 0;
//       //       padding: 0;
//       //       -webkit-text-size-adjust: 100%;
//       //       background-color: #e7e7e7;
//       //       color: #000000;
//       //     "
//       //   >
//       //     <!--[if IE]><div class="ie-container"><![endif]-->
//       //     <!--[if mso]><div class="mso-container"><![endif]-->
//       //     <table
//       //       id="u_body"
//       //       style="
//       //         border-collapse: collapse;
//       //         table-layout: fixed;
//       //         border-spacing: 0;
//       //         mso-table-lspace: 0pt;
//       //         mso-table-rspace: 0pt;
//       //         vertical-align: top;
//       //         min-width: 320px;
//       //         margin: 0 auto;
//       //         background-color: #e7e7e7;
//       //         width: 100%;
//       //       "
//       //       cellpadding="0"
//       //       cellspacing="0"
//       //     >
//       //       <tbody>
//       //         <tr style="vertical-align: top">
//       //           <td
//       //             style="
//       //               word-break: break-word;
//       //               border-collapse: collapse !important;
//       //               vertical-align: top;
//       //             "
//       //           >
//       //             <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #e7e7e7;"><![endif]-->

//       //             <div
//       //               class="u-row-container"
//       //               style="padding: 0px; background-color: transparent"
//       //             >
//       //               <div
//       //                 class="u-row"
//       //                 style="
//       //                   margin: 0 auto;
//       //                   min-width: 320px;
//       //                   max-width: 500px;
//       //                   overflow-wrap: break-word;
//       //                   word-wrap: break-word;
//       //                   word-break: break-word;
//       //                   background-color: transparent;
//       //                 "
//       //               >
//       //                 <div
//       //                   style="
//       //                     border-collapse: collapse;
//       //                     display: table;
//       //                     width: 100%;
//       //                     height: 100%;
//       //                     background-color: transparent;
//       //                   "
//       //                 >
//       //                   <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px;"><tr style="background-color: transparent;"><![endif]-->

//       //                   <!--[if (mso)|(IE)]><td align="center" width="500" style="width: 500px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
//       //                   <div
//       //                     class="u-col u-col-100"
//       //                     style="
//       //                       max-width: 320px;
//       //                       min-width: 500px;
//       //                       display: table-cell;
//       //                       vertical-align: top;
//       //                     "
//       //                   >
//       //                     <div style="height: 100%; width: 100% !important">
//       //                       <!--[if (!mso)&(!IE)]><!--><div
//       //                         style="
//       //                           box-sizing: border-box;
//       //                           height: 100%;
//       //                           padding: 0px;
//       //                           border-top: 0px solid transparent;
//       //                           border-left: 0px solid transparent;
//       //                           border-right: 0px solid transparent;
//       //                           border-bottom: 0px solid transparent;
//       //                         "
//       //                       ><!--<![endif]-->
//       //                         <table
//       //                           style="font-family: arial, helvetica, sans-serif"
//       //                           role="presentation"
//       //                           cellpadding="0"
//       //                           cellspacing="0"
//       //                           width="100%"
//       //                           border="0"
//       //                         >
//       //                           <tbody>
//       //                             <tr>
//       //                               <td
//       //                                 style="
//       //                                   overflow-wrap: break-word;
//       //                                   word-break: break-word;
//       //                                   padding: 10px;
//       //                                   font-family: arial, helvetica, sans-serif;
//       //                                 "
//       //                                 align="left"
//       //                               >
//       //                                 <table
//       //                                   width="100%"
//       //                                   cellpadding="0"
//       //                                   cellspacing="0"
//       //                                   border="0"
//       //                                 >
//       //                                   <tr>
//       //                                     <td
//       //                                       style="
//       //                                         padding-right: 0px;
//       //                                         padding-left: 0px;
//       //                                       "
//       //                                       align="center"
//       //                                     >
//       //                                       <img
//       //                                         align="center"
//       //                                         border="0"
//       //                                         src="https://almartindev.com/api/images/logo.png"
//       //                                         alt=""
//       //                                         title=""
//       //                                         style="
//       //                                           outline: none;
//       //                                           text-decoration: none;
//       //                                           -ms-interpolation-mode: bicubic;
//       //                                           clear: both;
//       //                                           display: inline-block !important;
//       //                                           border: none;
//       //                                           height: auto;
//       //                                           float: none;
//       //                                           width: 100%;
//       //                                           max-width: 480px;
//       //                                         "
//       //                                         width="480"
//       //                                       />
//       //                                     </td>
//       //                                   </tr>
//       //                                 </table>
//       //                               </td>
//       //                             </tr>
//       //                           </tbody>
//       //                         </table>

//       //                         <table
//       //                           style="font-family: arial, helvetica, sans-serif"
//       //                           role="presentation"
//       //                           cellpadding="0"
//       //                           cellspacing="0"
//       //                           width="100%"
//       //                           border="0"
//       //                         >
//       //                           <tbody>
//       //                             <tr>
//       //                               <td
//       //                                 style="
//       //                                   overflow-wrap: break-word;
//       //                                   word-break: break-word;
//       //                                   padding: 10px;
//       //                                   font-family: arial, helvetica, sans-serif;
//       //                                 "
//       //                                 align="left"
//       //                               >
//       //                                 <table
//       //                                   height="0px"
//       //                                   align="center"
//       //                                   border="0"
//       //                                   cellpadding="0"
//       //                                   cellspacing="0"
//       //                                   width="100%"
//       //                                   style="
//       //                                     border-collapse: collapse;
//       //                                     table-layout: fixed;
//       //                                     border-spacing: 0;
//       //                                     mso-table-lspace: 0pt;
//       //                                     mso-table-rspace: 0pt;
//       //                                     vertical-align: top;
//       //                                     border-top: 2px solid #bbbbbb;
//       //                                     -ms-text-size-adjust: 100%;
//       //                                     -webkit-text-size-adjust: 100%;
//       //                                   "
//       //                                 >
//       //                                   <tbody>
//       //                                     <tr style="vertical-align: top">
//       //                                       <td
//       //                                         style="
//       //                                           word-break: break-word;
//       //                                           border-collapse: collapse !important;
//       //                                           vertical-align: top;
//       //                                           font-size: 0px;
//       //                                           line-height: 0px;
//       //                                           mso-line-height-rule: exactly;
//       //                                           -ms-text-size-adjust: 100%;
//       //                                           -webkit-text-size-adjust: 100%;
//       //                                         "
//       //                                       >
//       //                                         <span>&#160;</span>
//       //                                       </td>
//       //                                     </tr>
//       //                                   </tbody>
//       //                                 </table>
//       //                               </td>
//       //                             </tr>
//       //                           </tbody>
//       //                         </table>

//       //                         <table
//       //                           style="font-family: arial, helvetica, sans-serif"
//       //                           role="presentation"
//       //                           cellpadding="0"
//       //                           cellspacing="0"
//       //                           width="100%"
//       //                           border="0"
//       //                         >
//       //                           <tbody>
//       //                             <tr>
//       //                               <td
//       //                                 style="
//       //                                   overflow-wrap: break-word;
//       //                                   word-break: break-word;
//       //                                   padding: 10px;
//       //                                   font-family: arial, helvetica, sans-serif;
//       //                                 "
//       //                                 align="left"
//       //                               >
//       //                                 <h1
//       //                                   style="
//       //                                     margin: 0px;
//       //                                     line-height: 140%;
//       //                                     text-align: center;
//       //                                     word-wrap: break-word;
//       //                                     font-size: 22px;
//       //                                     font-weight: 400;
//       //                                   "
//       //                                 >
//       //                                   Demande client ${nombre}
//       //                                 </h1>
//       //                               </td>
//       //                             </tr>
//       //                           </tbody>
//       //                         </table>

//       //                         <table
//       //                           style="font-family: arial, helvetica, sans-serif"
//       //                           role="presentation"
//       //                           cellpadding="0"
//       //                           cellspacing="0"
//       //                           width="100%"
//       //                           border="0"
//       //                         >
//       //                           <tbody>
//       //                             <tr>
//       //                               <td
//       //                                 style="
//       //                                   overflow-wrap: break-word;
//       //                                   word-break: break-word;
//       //                                   padding: 10px;
//       //                                   font-family: arial, helvetica, sans-serif;
//       //                                 "
//       //                                 align="left"
//       //                               >
//       //                                 <table
//       //                                   height="0px"
//       //                                   align="center"
//       //                                   border="0"
//       //                                   cellpadding="0"
//       //                                   cellspacing="0"
//       //                                   width="100%"
//       //                                   style="
//       //                                     border-collapse: collapse;
//       //                                     table-layout: fixed;
//       //                                     border-spacing: 0;
//       //                                     mso-table-lspace: 0pt;
//       //                                     mso-table-rspace: 0pt;
//       //                                     vertical-align: top;
//       //                                     border-top: 2px solid #bbbbbb;
//       //                                     -ms-text-size-adjust: 100%;
//       //                                     -webkit-text-size-adjust: 100%;
//       //                                   "
//       //                                 >
//       //                                   <tbody>
//       //                                     <tr style="vertical-align: top">
//       //                                       <td
//       //                                         style="
//       //                                           word-break: break-word;
//       //                                           border-collapse: collapse !important;
//       //                                           vertical-align: top;
//       //                                           font-size: 0px;
//       //                                           line-height: 0px;
//       //                                           mso-line-height-rule: exactly;
//       //                                           -ms-text-size-adjust: 100%;
//       //                                           -webkit-text-size-adjust: 100%;
//       //                                         "
//       //                                       >
//       //                                         <span>&#160;</span>
//       //                                       </td>
//       //                                     </tr>
//       //                                   </tbody>
//       //                                 </table>
//       //                               </td>
//       //                             </tr>
//       //                           </tbody>
//       //                         </table>

//       //                         <table
//       //                           style="font-family: arial, helvetica, sans-serif"
//       //                           role="presentation"
//       //                           cellpadding="0"
//       //                           cellspacing="0"
//       //                           width="100%"
//       //                           border="0"
//       //                         >
//       //                           <tbody>
//       //                             <tr>
//       //                               <td
//       //                                 style="
//       //                                   overflow-wrap: break-word;
//       //                                   word-break: break-word;
//       //                                   padding: 10px;
//       //                                   font-family: arial, helvetica, sans-serif;
//       //                                 "
//       //                                 align="left"
//       //                               >
//       //                                 <div
//       //                                   style="
//       //                                     font-size: 14px;
//       //                                     line-height: 140%;
//       //                                     text-align: left;
//       //                                     word-wrap: break-word;
//       //                                   "
//       //                                 >
//       //                                   <p style="line-height: 140%">
//       //                                     Nom: ${nombre} <br />Prenom : ${apellidos}<br />Téléphone:
//       //                                      ${telefono} <br />E-mail: ${email}<br />Description:
//       //                                     ${descripcion}
//       //                                   </p>
//       //                                 </div>
//       //                               </td>
//       //                             </tr>
//       //                           </tbody>
//       //                         </table>

//       //                         <table
//       //                           style="font-family: arial, helvetica, sans-serif"
//       //                           role="presentation"
//       //                           cellpadding="0"
//       //                           cellspacing="0"
//       //                           width="100%"
//       //                           border="0"
//       //                         >
//       //                           <tbody>
//       //                             <tr>
//       //                               <td
//       //                                 style="
//       //                                   overflow-wrap: break-word;
//       //                                   word-break: break-word;
//       //                                   padding: 10px;
//       //                                   font-family: arial, helvetica, sans-serif;
//       //                                 "
//       //                                 align="left"
//       //                               >
//       //                                 <table
//       //                                   height="0px"
//       //                                   align="center"
//       //                                   border="0"
//       //                                   cellpadding="0"
//       //                                   cellspacing="0"
//       //                                   width="100%"
//       //                                   style="
//       //                                     border-collapse: collapse;
//       //                                     table-layout: fixed;
//       //                                     border-spacing: 0;
//       //                                     mso-table-lspace: 0pt;
//       //                                     mso-table-rspace: 0pt;
//       //                                     vertical-align: top;
//       //                                     border-top: 2px solid #bbbbbb;
//       //                                     -ms-text-size-adjust: 100%;
//       //                                     -webkit-text-size-adjust: 100%;
//       //                                   "
//       //                                 >
//       //                                   <tbody>
//       //                                     <tr style="vertical-align: top">
//       //                                       <td
//       //                                         style="
//       //                                           word-break: break-word;
//       //                                           border-collapse: collapse !important;
//       //                                           vertical-align: top;
//       //                                           font-size: 0px;
//       //                                           line-height: 0px;
//       //                                           mso-line-height-rule: exactly;
//       //                                           -ms-text-size-adjust: 100%;
//       //                                           -webkit-text-size-adjust: 100%;
//       //                                         "
//       //                                       >
//       //                                         <span>&#160;</span>
//       //                                       </td>
//       //                                     </tr>
//       //                                   </tbody>
//       //                                 </table>
//       //                               </td>
//       //                             </tr>
//       //                           </tbody>
//       //                         </table>

//       //                         <!--[if (!mso)&(!IE)]><!-->
//       //                       </div>
//       //                       <!--<![endif]-->
//       //                     </div>
//       //                   </div>
//       //                   <!--[if (mso)|(IE)]></td><![endif]-->
//       //                   <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
//       //                 </div>
//       //               </div>
//       //             </div>

//       //             <div
//       //               class="u-row-container"
//       //               style="padding: 0px; background-color: #3b8f1e"
//       //             >
//       //               <div
//       //                 class="u-row"
//       //                 style="
//       //                   margin: 0 auto;
//       //                   min-width: 320px;
//       //                   max-width: 500px;
//       //                   overflow-wrap: break-word;
//       //                   word-wrap: break-word;
//       //                   word-break: break-word;
//       //                   background-color: transparent;
//       //                 "
//       //               >
//       //                 <div
//       //                   style="
//       //                     border-collapse: collapse;
//       //                     display: table;
//       //                     width: 100%;
//       //                     height: 100%;
//       //                     background-color: transparent;
//       //                   "
//       //                 >
//       //                   <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: #3b8f1e;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px;"><tr style="background-color: transparent;"><![endif]-->

//       //                   <!--[if (mso)|(IE)]><td align="center" width="347" style="width: 347px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
//       //                   <div
//       //                     class="u-col u-col-69p4"
//       //                     style="
//       //                       max-width: 320px;
//       //                       min-width: 347px;
//       //                       display: table-cell;
//       //                       vertical-align: top;
//       //                     "
//       //                   >
//       //                     <div
//       //                       style="
//       //                         height: 100%;
//       //                         width: 100% !important;
//       //                         border-radius: 0px;
//       //                         -webkit-border-radius: 0px;
//       //                         -moz-border-radius: 0px;
//       //                       "
//       //                     >
//       //                       <!--[if (!mso)&(!IE)]><!--><div
//       //                         style="
//       //                           box-sizing: border-box;
//       //                           height: 100%;
//       //                           padding: 0px;
//       //                           border-top: 0px solid transparent;
//       //                           border-left: 0px solid transparent;
//       //                           border-right: 0px solid transparent;
//       //                           border-bottom: 0px solid transparent;
//       //                           border-radius: 0px;
//       //                           -webkit-border-radius: 0px;
//       //                           -moz-border-radius: 0px;
//       //                         "
//       //                       ><!--<![endif]-->
//       //                         <table
//       //                           style="font-family: arial, helvetica, sans-serif"
//       //                           role="presentation"
//       //                           cellpadding="0"
//       //                           cellspacing="0"
//       //                           width="100%"
//       //                           border="0"
//       //                         >
//       //                           <tbody>
//       //                             <tr>
//       //                               <td
//       //                                 style="
//       //                                   overflow-wrap: break-word;
//       //                                   word-break: break-word;
//       //                                   padding: 17px 10px 10px;
//       //                                   font-family: arial, helvetica, sans-serif;
//       //                                 "
//       //                                 align="left"
//       //                               >
//       //                                 <div
//       //                                   style="
//       //                                     font-size: 14px;
//       //                                     line-height: 140%;
//       //                                     text-align: center;
//       //                                     word-wrap: break-word;
//       //                                   "
//       //                                 >
//       //                                   <p style="line-height: 140%">
//       //                                     <span
//       //                                       style="
//       //                                         line-height: 19.6px;
//       //                                         text-align: center;
//       //                                         white-space: normal;
//       //                                         color: #ffffff;
//       //                                         background-color: #3b8f1e;
//       //                                         float: none;
//       //                                         display: inline;
//       //                                       "
//       //                                       >Copyright © Global Solutios
//       //                                       Prefabriquees</span
//       //                                     ><span
//       //                                       style="
//       //                                         line-height: 19.6px;
//       //                                         text-align: center;
//       //                                         white-space: normal;
//       //                                         color: #ffffff;
//       //                                         background-color: #3b8f1e;
//       //                                         float: none;
//       //                                         display: inline;
//       //                                       "
//       //                                       > </span
//       //                                     ><span
//       //                                       style="
//       //                                         line-height: 19.6px;
//       //                                         text-align: center;
//       //                                         white-space: normal;
//       //                                         color: #ffffff;
//       //                                         background-color: #3b8f1e;
//       //                                         float: none;
//       //                                         display: inline;
//       //                                       "
//       //                                       >2023</span
//       //                                     ><span
//       //                                       style="
//       //                                         line-height: 19.6px;
//       //                                         text-align: center;
//       //                                         white-space: normal;
//       //                                         color: #ffffff;
//       //                                         background-color: #3b8f1e;
//       //                                         float: none;
//       //                                         display: inline;
//       //                                       "
//       //                                       >.</span
//       //                                     >
//       //                                   </p>
//       //                                 </div>
//       //                               </td>
//       //                             </tr>
//       //                           </tbody>
//       //                         </table>

//       //                         <!--[if (!mso)&(!IE)]><!-->
//       //                       </div>
//       //                       <!--<![endif]-->
//       //                     </div>
//       //                   </div>
//       //                   <!--[if (mso)|(IE)]></td><![endif]-->
//       //                   <!--[if (mso)|(IE)]><td align="center" width="153" style="width: 153px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
//       //                   <div
//       //                     class="u-col u-col-30p6"
//       //                     style="
//       //                       max-width: 320px;
//       //                       min-width: 153px;
//       //                       display: table-cell;
//       //                       vertical-align: top;
//       //                     "
//       //                   >
//       //                     <div
//       //                       style="
//       //                         height: 100%;
//       //                         width: 100% !important;
//       //                         border-radius: 0px;
//       //                         -webkit-border-radius: 0px;
//       //                         -moz-border-radius: 0px;
//       //                       "
//       //                     >
//       //                       <!--[if (!mso)&(!IE)]><!--><div
//       //                         style="
//       //                           box-sizing: border-box;
//       //                           height: 100%;
//       //                           padding: 0px;
//       //                           border-top: 0px solid transparent;
//       //                           border-left: 0px solid transparent;
//       //                           border-right: 0px solid transparent;
//       //                           border-bottom: 0px solid transparent;
//       //                           border-radius: 0px;
//       //                           -webkit-border-radius: 0px;
//       //                           -moz-border-radius: 0px;
//       //                         "
//       //                       ><!--<![endif]-->
//       //                         <table
//       //                           style="font-family: arial, helvetica, sans-serif"
//       //                           role="presentation"
//       //                           cellpadding="0"
//       //                           cellspacing="0"
//       //                           width="100%"
//       //                           border="0"
//       //                         >
//       //                           <tbody>
//       //                             <tr>
//       //                               <td
//       //                                 style="
//       //                                   overflow-wrap: break-word;
//       //                                   word-break: break-word;
//       //                                   padding: 10px;
//       //                                   font-family: arial, helvetica, sans-serif;
//       //                                 "
//       //                                 align="left"
//       //                               >
//       //                                 <div align="center">
//       //                                   <div style="display: table; max-width: 110px">
//       //                                     <!--[if (mso)|(IE)]><table width="110" cellpadding="0" cellspacing="0" border="0"><tr><td style="border-collapse:collapse;" align="center"><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse; mso-table-lspace: 0pt;mso-table-rspace: 0pt; width:110px;"><tr><![endif]-->

//       //                                     <!--[if (mso)|(IE)]><td width="32" style="width:32px; padding-right: 5px;" valign="top"><![endif]-->
//       //                                     <table
//       //                                       align="left"
//       //                                       border="0"
//       //                                       cellspacing="0"
//       //                                       cellpadding="0"
//       //                                       width="32"
//       //                                       height="32"
//       //                                       style="
//       //                                         width: 32px !important;
//       //                                         height: 32px !important;
//       //                                         display: inline-block;
//       //                                         border-collapse: collapse;
//       //                                         table-layout: fixed;
//       //                                         border-spacing: 0;
//       //                                         mso-table-lspace: 0pt;
//       //                                         mso-table-rspace: 0pt;
//       //                                         vertical-align: top;
//       //                                         margin-right: 5px;
//       //                                       "
//       //                                     >
//       //                                       <tbody>
//       //                                         <tr style="vertical-align: top">
//       //                                           <td
//       //                                             align="left"
//       //                                             valign="middle"
//       //                                             style="
//       //                                               word-break: break-word;
//       //                                               border-collapse: collapse !important;
//       //                                               vertical-align: top;
//       //                                             "
//       //                                           >
//       //                                             <a
//       //                                               href="https://www.facebook.com/Global-Solutions-Pr%C3%A9fabriqu%C3%A9es-115355516956606"
//       //                                               title="Facebook"
//       //                                               target="_blank"
//       //                                             >
//       //                                               <img
//       //                                                 src="https://almartindev.com/api/images/facebook.png"
//       //                                                 alt="Facebook"
//       //                                                 title="Facebook"
//       //                                                 width="32"
//       //                                                 style="
//       //                                                   outline: none;
//       //                                                   text-decoration: none;
//       //                                                   -ms-interpolation-mode: bicubic;
//       //                                                   clear: both;
//       //                                                   display: block !important;
//       //                                                   border: none;
//       //                                                   height: auto;
//       //                                                   float: none;
//       //                                                   max-width: 32px !important;
//       //                                                 "
//       //                                               />
//       //                                             </a>
//       //                                           </td>
//       //                                         </tr>
//       //                                       </tbody>
//       //                                     </table>
//       //                                     <!--[if (mso)|(IE)]></td><![endif]-->

//       //                                     <!--[if (mso)|(IE)]><td width="32" style="width:32px; padding-right: 5px;" valign="top"><![endif]-->
//       //                                     <table
//       //                                       align="left"
//       //                                       border="0"
//       //                                       cellspacing="0"
//       //                                       cellpadding="0"
//       //                                       width="32"
//       //                                       height="32"
//       //                                       style="
//       //                                         width: 32px !important;
//       //                                         height: 32px !important;
//       //                                         display: inline-block;
//       //                                         border-collapse: collapse;
//       //                                         table-layout: fixed;
//       //                                         border-spacing: 0;
//       //                                         mso-table-lspace: 0pt;
//       //                                         mso-table-rspace: 0pt;
//       //                                         vertical-align: top;
//       //                                         margin-right: 5px;
//       //                                       "
//       //                                     >
//       //                                       <tbody>
//       //                                         <tr style="vertical-align: top">
//       //                                           <td
//       //                                             align="left"
//       //                                             valign="middle"
//       //                                             style="
//       //                                               word-break: break-word;
//       //                                               border-collapse: collapse !important;
//       //                                               vertical-align: top;
//       //                                             "
//       //                                           >
//       //                                             <a
//       //                                               href="https://www.linkedin.com/company/global-solutions-pr%C3%A9fabriqu%C3%A9es/"
//       //                                               title="LinkedIn"
//       //                                               target="_blank"
//       //                                             >
//       //                                               <img
//       //                                                 src="https://almartindev.com/api/images/linkedin.png"
//       //                                                 alt="LinkedIn"
//       //                                                 title="LinkedIn"
//       //                                                 width="32"
//       //                                                 style="
//       //                                                   outline: none;
//       //                                                   text-decoration: none;
//       //                                                   -ms-interpolation-mode: bicubic;
//       //                                                   clear: both;
//       //                                                   display: block !important;
//       //                                                   border: none;
//       //                                                   height: auto;
//       //                                                   float: none;
//       //                                                   max-width: 32px !important;
//       //                                                 "
//       //                                               />
//       //                                             </a>
//       //                                           </td>
//       //                                         </tr>
//       //                                       </tbody>
//       //                                     </table>
//       //                                     <!--[if (mso)|(IE)]></td><![endif]-->

//       //                                     <!--[if (mso)|(IE)]><td width="32" style="width:32px; padding-right: 0px;" valign="top"><![endif]-->
//       //                                     <table
//       //                                       align="left"
//       //                                       border="0"
//       //                                       cellspacing="0"
//       //                                       cellpadding="0"
//       //                                       width="32"
//       //                                       height="32"
//       //                                       style="
//       //                                         width: 32px !important;
//       //                                         height: 32px !important;
//       //                                         display: inline-block;
//       //                                         border-collapse: collapse;
//       //                                         table-layout: fixed;
//       //                                         border-spacing: 0;
//       //                                         mso-table-lspace: 0pt;
//       //                                         mso-table-rspace: 0pt;
//       //                                         vertical-align: top;
//       //                                         margin-right: 0px;
//       //                                       "
//       //                                     >
//       //                                       <tbody>
//       //                                         <tr style="vertical-align: top">
//       //                                           <td
//       //                                             align="left"
//       //                                             valign="middle"
//       //                                             style="
//       //                                               word-break: break-word;
//       //                                               border-collapse: collapse !important;
//       //                                               vertical-align: top;
//       //                                             "
//       //                                           >
//       //                                             <a
//       //                                               href="https://api.whatsapp.com/send?phone=221772260577&text=Bonjour%20GLOBAL%20SOLUTIONS%20PREFABRIQUEES.%20Je%20suis%20un/une%20interess%C3%A9(e)."
//       //                                               title="WhatsApp"
//       //                                               target="_blank"
//       //                                             >
//       //                                               <img
//       //                                                 src="https://almartindev.com/api/images/whats.png"
//       //                                                 alt="WhatsApp"
//       //                                                 title="WhatsApp"
//       //                                                 width="32"
//       //                                                 style="
//       //                                                   outline: none;
//       //                                                   text-decoration: none;
//       //                                                   -ms-interpolation-mode: bicubic;
//       //                                                   clear: both;
//       //                                                   display: block !important;
//       //                                                   border: none;
//       //                                                   height: auto;
//       //                                                   float: none;
//       //                                                   max-width: 32px !important;
//       //                                                 "
//       //                                               />
//       //                                             </a>
//       //                                           </td>
//       //                                         </tr>
//       //                                       </tbody>
//       //                                     </table>
//       //                                     <!--[if (mso)|(IE)]></td><![endif]-->

//       //                                     <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
//       //                                   </div>
//       //                                 </div>
//       //                               </td>
//       //                             </tr>
//       //                           </tbody>
//       //                         </table>

//       //                         <!--[if (!mso)&(!IE)]><!-->
//       //                       </div>
//       //                       <!--<![endif]-->
//       //                     </div>
//       //                   </div>
//       //                   <!--[if (mso)|(IE)]></td><![endif]-->
//       //                   <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
//       //                 </div>
//       //               </div>
//       //             </div>

//       //             <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
//       //           </td>
//       //         </tr>
//       //       </tbody>
//       //     </table>
//       //     <!--[if mso]></div><![endif]-->
//       //     <!--[if IE]></div><![endif]-->
//       //   </body>
//       // </html>
//       //   `,
//       //   attachments: req.files && [{ filename: plano.name, path: uploadFoto }],
//       // });

//       if (req.files) {
//         fs.unlinkSync(uploadFoto);
//       }

//       return res.send(`Formulario Registrado`);
//     }
//   } catch (e) {
//     console.log(e.message);
//   }
// };

// controller.getCountContact = async (req, res) => {
//   const {} = req.body;
//   try {
//     const formContact = await dao.getCountContact();

//     if (formContact.length <= 0)
//       return res.status(404).send("Formularios no existe");

//     return res.send(formContact);
//   } catch (e) {
//     console.log(e.message);
//     return res.status(400).send(e.message);
//   }
// };

// controller.getAllContact = async (req, res) => {
//   const {} = req.body;
//   try {
//     const formContact = await dao.getAllContact();

//     if (formContact.length <= 0)
//       return res.status(404).send("Formularios no existe");

//     return res.send(formContact);
//   } catch (e) {
//     console.log(e.message);
//     return res.status(400).send(e.message);
//   }
// };



// controller.requestPasswordReset = async (req, res) => {
//   const { email } = req.body;

//   if (!email) {
//     return res
//       .status(400)
//       .json({ error: "Debes proporcionar un correo electrónico" });
//   }

//   try {
//     // Verificar si el usuario con el correo electrónico proporcionado existe
//     const user = await dao.getUserByEmail(email);

//     if (user.length <= 0) {
//       return res.status(404).json({ error: "Usuario no registrado" });
//     }

//     const [newUser] = user;
//     // Generar un token de restablecimiento de contraseña único y seguro
//     const jwtConstructor = new SignJWT({
//       id: newUser.id,
//     });

//     const encoder = new TextEncoder();

//     const jwt = await jwtConstructor
//       .setProtectedHeader({ alg: "HS256", typ: "JWT" })
//       .setIssuedAt()
//       .setExpirationTime("1h")
//       .sign(encoder.encode(process.env.JWT_SECRET));

//     // Guardar el token de restablecimiento de contraseña en la base de datos junto con una fecha de vencimiento

//     // Enviar un correo electrónico al usuario con un enlace para restablecer la contraseña
//     const resetLink = `https://globalsolutionsprefabriquees.com/reset-password?token=${jwt}`;

//     await transporter.sendMail({
//       from: '"Demande Web GSP" <info@globalsolutionsprefabriquees.com>', // sender address
//       to: `<${email}>`, // list of receivers
//       subject: `Reset Password`, // Subject line
//       text: `Pour réinitialiser votre mot de passe, cliquez sur le lien ci-dessous: ${resetLink}`,
//     });

//     return res.send(
//       "Se ha enviado un correo electrónico con las instrucciones para restablecer la contraseña"
//     );
//   } catch (error) {
//     console.error(error.message);
//     return res.status(500).json({ error: "Error interno del servidor" });
//   }
// };

module.exports = controller;

// export default controller;

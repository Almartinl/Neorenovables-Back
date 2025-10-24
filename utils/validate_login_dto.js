// import { Type } from "@sinclair/typebox";
// import Ajv from "ajv";
// import addFormat from "ajv-formats";
// import addErrors from "ajv-errors";

const { Type } = require("@sinclair/typebox")
const Ajv = require("ajv")
const addFormat = require("ajv-formats")
const addErrors = require("ajv-errors")

const LoginDtoSchema = Type.Object(
  {
    email: Type.String({
      format: "email",
      errorMessage: {
        type: "El tipo de email debe ser un string",
        format: "Email debe contener un correo electronico valido",
      },
    }),
    password: Type.String({
      errorMessage: {
        type: "El tipo de password debe de ser un string",
      },
    }),
  },
  {
    additionalProperties: false,
  }
);

const ajv = new Ajv({ allErrors: true });
addFormat(ajv, ["email"]);
addErrors(ajv, { keepErrors: false });

const validate = ajv.compile(LoginDtoSchema);

const validateLoginDto = (req, res, next) => {
  const isDTOValid = validate(req.body);
  if (!isDTOValid)
    return res
      .status(400)
      .send(ajv.errorsText(validate.errors, { separator: "\n" }));

  next();
};

module.exports = validateLoginDto

// export default validateLoginDto;

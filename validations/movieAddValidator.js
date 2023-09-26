const { check } = require("express-validator");

module.exports = [
  check("title").notEmpty().withMessage("Debe ingresar un nombre"),
  check("rating")
    .isInt({ min: 1, max: 10 })
    .withMessage("Debe ingresar un numero entre 1 y 10"),
  check("awards")
    .isInt({ min: 0 })
    .withMessage("Debe ingresar un numero mayor o igual a 0"),
  check("release_date").notEmpty().withMessage("Debe ingresar una fecha"),
  check("length")
    .isInt({ min: 0 })
    .withMessage("Debe ingresar un numero entero")
];

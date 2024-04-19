const userService = require("./usuario.service");
const { genSaltSync, hashSync, compareSync } = require("bcrypt");
const { sign } = require("jsonwebtoken");

module.exports = {
  createUser: (req, res) => {
    const { username, password } = req.body;
    const saltRounds = Number(process.env.SALT_ROUNDS || 10);
    const salt = genSaltSync(saltRounds);
    const hashedPassword = hashSync(password, salt);
    
    const userData = { username, password: hashedPassword };
    
    userService.create(userData, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: 0,
          message: "Error en la conexión de la BD",
        });
      }
      return res.status(200).json({
        success: 1,
        data: results,
      });
    });
  },

  login: (req, res) => {
    const { username, password } = req.body;

    userService.getUserByUserUsername(username, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: 0,
          message: "Error en la conexión de la BD",
        });
      }
      if (!results) {
        return res.status(401).json({
          success: 0,
          message: "Nombre de usuario incorrecto",
        });
      }
      
      const passwordMatch = compareSync(password, results.contra);
      
      if (passwordMatch) {
        results.password = undefined;
        const jsontoken = sign({ result: results }, process.env.JWT_KEY, {
          expiresIn: "1h",
        });
        return res.status(200).json({
          success: 1,
          message: "Inicio de sesión exitoso",
          token: jsontoken,
          userId: results.id,
          username: results.username,
        });
      } else {
        return res.status(401).json({
          success: 0,
          message: "Contraseña incorrecta",
        });
      }
    });
  },
};

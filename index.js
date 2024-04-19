require("dotenv").config();
const express = require("express");
const cors = require("cors"); 
const app = express();
const tareasRouter = require("./src/tareas/tareas.router");
const usuariosRouter = require("./src/usuario/usuario.router");

app.use(express.json());
app.use(cors());


app.use("/tareas", tareasRouter);
app.use("/usuario", usuariosRouter);


app.listen(process.env.APP_PORT, () => {
  console.log("VT en mi cuarto corriendo en el puerto:", process.env.APP_PORT);
});

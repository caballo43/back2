// index.js
const mongoose = require("mongoose");
const express = require("express");
const cors = require('cors')
const app = express();
require('dotenv').config();
app.use(cors());
app.use(express.json());

const rutasPeliculas = require("./routes/rutas-peliculas");
app.use("/api/peliculas", rutasPeliculas);

const rutasUsuarios = require("./routes/rutas-usuarios");
app.use("/api/usuarios", rutasUsuarios);

app.use((req, res) => {

  res.status(404);
  res.json({
    mensaje: "Información no encontrada",
  });
});

mongoose
  // .connect(
  //   "mongodb+srv://a4caballo:Adjust123@cluster0.ymzcq8b.mongodb.net/proyecto?retryWrites=true&w=majority"
  // )
  // .then(() => {
  //   console.log("🤣🤣 Conectado con éxito a Atlas");
  //   app.listen(5000, () => console.log(`🎶 Escuchando en puerto 5000`));
  // })
  // .catch((error) => console.log(error));
  .connect(process.env.MONGO_DB_URI)
  .then(() => {
    console.log("🤣🤣 Conectado con éxito a Atlas");
    app.listen(process.env.PORT, () => console.log('Escuchando en puerto 5000'));
  })
  .catch((error) => console.log(error));
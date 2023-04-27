const mongoose = require("mongoose");

const peliculasSchema = new mongoose.Schema({
  nombre: {
    type: String,
    maxLength: 50,
    required: true,
  },
  genero: {
    type: String,
    minLength: 1,
    maxLength: 100,
    required: true,
  },
  precio: {
    type: Number,
    required: true,
  },

});

module.exports = mongoose.model("Peliculas", peliculasSchema);

// rutas-cursos.js
const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
const Pelicula = require("../models/modelo-peliculas");
const Usuario = require("../models/modelo-usuario");

// const checkAuth = require("../middleware/check-auth"); // (1) Importamos middleware de autorización

// * Recuperar pelis desde la BDD en Atlas
router.get("/", async (req, res, next) => {
  let peliculas;
  try {
    // peliculas = await Pelicula.find({}).populate("usuario");
    peliculas = await Pelicula.find({});
  } catch (err) {
    console.log(err)
    const error = new Error("Ha ocurrido un error en la recuperación de datos");
    error.code = 500;
    return next(error);
  }
  res.status(200).json({
    mensaje: "Todas las películas",
    peliculas: peliculas,
  });
});

// * Recuperar un curso por su Id
router.get("/:id", async (req, res, next) => {
  const idPelicula = req.params.id;
  let pelicula;
  try {
    pelicula = await Pelicula.findById(idPelicula).populate("usuario");
  } catch (err) {
    const error = new Error(
      "Ha habido algún error. No se han podido recuperar los datos"
    );
    error.code = 500;
    return next(error);
  }
  if (!pelicula) {
    const error = new Error(
      "No se ha podido encontrar una película con el id proporcionado"
    );
    error.code = 404;
    return next(error);
  }
  res.json({
    mensaje: "Película encontrada",
    pelicula: pelicula,
  });
});

// * Buscar un curso en función del parámetro de búsqueda
router.get("/buscar/:busca", async (req, res, next) => {
  const search = req.params.busca;
  console.log(search);
  let peliculas;
  try {
    peliculas = await Pelicula.find({
      pelicula: { $regex: search, $options: "i" },
    }).populate("usuario");
  } catch (err) {
    console.log(err)
    const error = new Error("Ha ocurrido un error en la recuperación de datos");
    error.code = 500;
    return next(error);
  }
  res.status(200).json({ mensaje: "Todas las películas", peliculas: peliculas });
});



// * Crear un nuevo curso (y el docente relacionado) y guardarlo en Atlas
router.post("/", async (req, res, next) => {
  // ? Primero creamos el curso y lo guardamos en Atlas
  const { nombre, genero, precio } = req.body;
  const nuevoPelicula = new Pelicula({
    // Nuevo documento basado en el Model Curso.
    nombre: nombre,

    genero: genero,

    precio: precio,
  });
  // ? Localizamos al docente que se corresponde con el que hemos recibido en el request


  try {
    await nuevoPelicula.save(); // ? (1)
  } catch (error) {
    const err = new Error("Ha fallado la creación del nuevo curso");
    err.code = 500;
    return next(err);
  }
  res.status(201).json({
    mensaje: "Película añadida a la BDD",
    pelicula: nuevoPelicula,
  });
});



// * Modificar un curso en base a su id ( y su referencia en docentes)

// ----------------------------------------------------------------
router.patch("/:id", async (req, res, next) => {
  const idPelicula = req.params.id;
  const camposPorCambiar = req.body;
  let peliculaBuscar;
  try {
    peliculaBuscar = await Pelicula.findByIdAndUpdate(
      idPelicula,
      camposPorCambiar,
      {
        new: true,
        runValidators: true,
      }
    ); // (1) Localizamos y actualizamos a la vez la película en la BDD
  } catch (error) {
    res.status(404).json({
      mensaje: "No se han podido actualizar los datos del docente",
      error: error.message,
    });
  }
  res.status(200).json({
    mensaje: "Datos de película modificados",
    pelicula: peliculaBuscar,
  });
});






// * Eliminar un curso en base a su id (y el docente relacionado)
router.delete("/:id", async (req, res, next) => {
  const idPelicula = req.params.id;
  // let pelicula;
  // try {
  //   // pelicula = await Pelicula.findById(idPelicula).populate("usuario"); // ? Localizamos el curso en la BDD por su id
  //   pelicula = await Pelicula.findById(idPelicula)
  // } catch (err) {
  //   const error = new Error(
  //     "Ha habido algún error. No se han podido recuperar los datos para eliminación"
  //   );
  //   error.code = 500;
  //   return next(error);
  // }
  // if (!pelicula) {

  //   const error = new Error(
  //     "No se ha podido encontrar le peli con el id proporcionado"
  //   );
  //   error.code = 404;
  //   return next(error);
  // }

  // ? Si existe el curso y el usuario se ha verificado
  try {
    // elimina la película
    await Pelicula.findByIdAndDelete(idPelicula);

    // await pelicula.deleteOne();

    // ? (2) En el campo usuario del documento pelicula estará la lista con todas las peliculas de dicho usuario. Con el método pull() le decimos a mongoose que elimine el curso también de esa lista.
    // pelicula.usuario.peliculas.pull(pelicula);
    // await pelicula.usuario.save(); // ? (3) Guardamos los datos de el campo docente en la colección curso, ya que lo hemos modificado en la línea de código previa
    // await Usuario.updateOne(
    //   { _id: pelicula.idUsuario },
    //   { $pull: { peliculas: pelicula._id } }
    // );
  } catch (err) {
    console.log(err)
    const error = new Error(
      "Ha habido algún error. No se han podido eliminar los datos"
    );
    error.code = 500;
    return next(error);
  }
  res.json({
    message: "Peli eliminada",
  });
});

module.exports = router;

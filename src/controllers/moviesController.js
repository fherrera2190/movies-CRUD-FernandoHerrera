const db = require("../database/models");
const moment = require("moment");
//Otra forma de llamar a los modelos
const { validationResult } = require("express-validator");

const moviesController = {
  list: (req, res) => {
    db.Movie.findAll().then(movies => {
      res.render("moviesList.ejs", { movies });
    });
  },
  detail: (req, res) => {
    db.Movie.findByPk(req.params.id).then(movie => {
      res.render("moviesDetail.ejs", { movie });
    });
  },
  new: (req, res) => {
    db.Movie
      .findAll({
        order: [["release_date", "DESC"]],
        limit: 5
      })
      .then(movies => {
        res.render("newestMovies", { movies });
      });
  },
  recomended: (req, res) => {
    db.Movie
      .findAll({
        where: {
          rating: { [db.Sequelize.Op.gte]: 8 }
        },
        order: [["rating", "DESC"]]
      })
      .then(movies => {
        res.render("recommendedMovies.ejs", { movies });
      });
  }, //Aqui debemos modificar y completar lo necesario para trabajar con el CRUD
  add: function(req, res) {
    res.render("moviesAdd");
  },

  create: function(req, res) {
    // TODO
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("moviesAdd", {
        errors: errors.mapped(),
        old: req.body
      });
    }
    console.log("Sigo por aca");
    const { title, rating, awards, release_date, length, genre_id } = req.body;
    db.Movie
      .create({
        title: title.trim(),
        rating,
        awards,
        release_date,
        length,
        genre_id
      })
      .then(movie => {
        return res.redirect("/movies");
      })
      .catch(err => {
        console.log(err);
      });
  },

  edit: function(req, res) {
    // TODO
    db.Movie
      .findByPk(req.params.id)
      .then(movie => {
        // console.log(moment(movie.release_date).format("YYYY-MM-DD"));
        return res.render("moviesEdit", { Movie: movie, moment });
      })
      .catch(err => {
        console.log(err);
      });
  },
  update: function(req, res) {
    // TODO

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.body.id = req.params.id;
      // console.log(errors.mapped());
      // console.log("hay errorres");
      return res.render("moviesEdit", {
        errors: errors.mapped(),
        Movie: req.body,
        moment
      });
    }
    const { title, rating, awards, release_date, length, genre_id } = req.body;
    // console.log(title, rating, awards, release_date, length);
    db.Movie
      .update(
        { title: title.trim(), rating, awards, release_date, length, genre_id },
        { where: { id: req.params.id } }
      )
      .then(response => {
        //console.log(response);
        res.redirect("/movies/detail/"+req.params.id);
      })
      .catch(err => {
        console.log(err);
      });
  },
  delete: function(req, res) {
    // TODO
    db.Movie
      .findByPk(req.params.id)
      .then(movie => {
        res.render("moviesDelete", { Movie: movie });
      })
      .catch(err => {
        console.log(err);
      });
  },
  destroy: function(req, res) {
    // TODO
    db.ActorMovie
      .destroy({
        where: {
          movie_id: req.params.id
        }
      })
      .then(reponse => {
        db.Actor
          .update(
            {
              favorite_movie_id: null
            },
            {
              where: {
                favorite_movie_id: req.params.id
              }
            }
          )
          .then(response => {
            console.log(response);
            db.Movie
              .destroy({
                where: {
                  id: req.params.id
                }
              })
              .then(result => {
                console.log(response);
                res.redirect("/movies");
              });
          });
      })
      .catch(err => {
        console.log(err);
      });
  }
};

module.exports = moviesController;

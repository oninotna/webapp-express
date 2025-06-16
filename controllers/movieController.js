const connection = require('../data/db');

const index = (req, res) => {
    const querySql = `
    SELECT * 
      FROM movies;`

    connection.query(querySql, (err, results) => {
        if (err) return res.status(500).json({err: "Database query failed"});
        res.json(results);
    }); 
};

const show = (req, res) => {
    const movieId = parseInt(req.params.id);

    const querySql = `
    SELECT *
      FROM movies
    WHERE movies.id = ?;
    `;

        connection.query(querySql, [movieId], (err, movieResults) => {
        if (err) return res.status(500).json({err: "Database query failed"});
        if (!movieResults.length) res.json("Movie not found");

        const movie = movieResults[0];
        res.json(movie);
        });
};

module.exports = {index, show};
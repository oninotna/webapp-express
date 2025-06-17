const connection = require('../data/db');

const index = (req, res) => {
    const querySql = `
    SELECT 
      movies.title,
      movies.director,
      movies.genre,
      movies.release_year,
      movies.abstract, 
      movies.image
        FROM movies;`

    connection.query(querySql, (err, moviesResults) => {
        if (err) return res.status(500).json({err: "Database query failed"});
        
        const movies = moviesResults.map(movie => (
            {...movie, image: `http://localhost:3000/img/movies/${movie.image}`}
        ))
        res.json(movies);
    }); 
};

const show = (req, res) => {
    const movieId = parseInt(req.params.id);

    const querySql = `
    SELECT 
      movies.title,
      movies.director,
      movies.genre,
      movies.release_year,
      movies.abstract,
      movies.image
        FROM movies
    WHERE movies.id = ?;
    `;

    const queryReviewsSql = `
    SELECT 
      reviews.id,
      reviews.name,
      reviews.vote,
      reviews.text
        FROM reviews
    WHERE movie_id = ?;
    `;

        connection.query(querySql, [movieId], (err, movieResults) => {
        if (err) return res.status(500).json({err: "Database query failed"});
        if (!movieResults.length) res.json("Movie not found");

        connection.query(queryReviewsSql, [movieId], (err, reviewsResults) => {
            if (err) return res.status(500).json({err: "Database query failed"});
            if (!reviewsResults.length) res.json({err: "Reviews don't present"});
            const reviews = reviewsResults;

            const movie = {
            ...movieResults[0], 
            image: `http://localhost:3000/img/movies/${movieResults[0].image}`,
            reviews
            };

            res.json(movie);
        });

        
        });
};

module.exports = {index, show};
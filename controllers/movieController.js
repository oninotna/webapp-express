const connection = require('../data/db');

const index = (req, res) => {
    const querySql = `
    SELECT 
      movies.id,
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
      movies.id,
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
            
            let sumVote = 0;
            for (let i = 0; i < reviews.length; i++) {
                sumVote = sumVote + reviews[i].vote;
            };

            const average_vote = parseFloat((sumVote / reviews.length).toFixed(2));
            
            const movie = {
            ...movieResults[0], 
            image: `http://localhost:3000/img/movies/${movieResults[0].image}`,
            average_vote,
            reviews,
            };

            res.json(movie);
        });

        
        });
};

const storeReview = (req,res) => {
    const movieId = parseInt(req.params.id);
    const {userName, vote, text} = req.body;

    const queryReview =`INSERT INTO 
    movie.reviews (movie_id, name, vote, text) 
    VALUES (?, ?, ?, ?);`;

    connection.query(queryReview, [movieId, userName, vote, text], (err, reviewResults) =>{
        if (err) return res.status(500).json({err: "Database query failed"});

        const review = reviewResults;
        res.status(201).json({
            message: "Review added",
            reviewId: review.insertId
        });
    })
}

module.exports = {index, show, storeReview};
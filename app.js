// Express config
express = require('express');
app = express();
const port = process.env.PORT_NUMBER;

// Routers import
const movieRouter = require('./routers/movieRouter');

// Middlewares import
const errorHandler = require('./middlewares/errorHandler');
const notFound = require('./middlewares/notFound');

app.use(express.static('public'));
app.use(express.json());

app.use('/movies', movieRouter);

app.use(errorHandler);
app.use(notFound);

app.listen(port, (err) => {
    if (err) console.error(err);
    else console.log('App listening on port: ' + port);
});
// Epress e Router config
express = require('express');
const router = express.Router();
const {index, show, storeReview} = require('../controllers/movieController');

// Index movie
router.get('/', index)

// Show movie
router.get('/:id', show);

// Create review
router.post('/:id/reviews', storeReview)

module.exports = router;
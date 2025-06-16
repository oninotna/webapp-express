// Epress e Router config
express = require('express');
const router = express.Router();
const {index, show} = require('../controllers/movieController');

// Index
router.get('/', index)

// Show
router.get('/:id', show);

module.exports = router;
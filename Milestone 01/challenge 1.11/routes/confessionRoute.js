// Routes receive HTTP requests and immediately delegate to the controller.
// No logic, no data manipulation — just wiring URLs to handler functions.

const express = require('express')
const router = express.Router()

const {
  createConfession,
  listAllConfessions,
  getOneConfession,
  listConfessionsByCategory,
  removeConfession
} = require('../controllers/confessionController')

// NOTE: /category/:cat must come before /:id
// otherwise Express matches "category" as an id parameter
router.get('/category/:cat', listConfessionsByCategory)

router.post('/', createConfession)
router.get('/', listAllConfessions)
router.get('/:id', getOneConfession)
router.delete('/:id', removeConfession)

module.exports = router
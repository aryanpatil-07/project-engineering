// Controllers extract data from the HTTP request, call the appropriate
// service function, then send back the HTTP response.
// No business logic lives here — that belongs in services/.

const {
  validateConfessionInput,
  saveConfession,
  getAllConfessions,
  getConfessionById,
  getConfessionsByCategory,
  deleteConfession
} = require('../services/confessionService')

/**
 * POST /api/v1/confessions
 * Validates input, creates a new confession, returns it as 201.
 */
function createConfession(req, res) {
  const confessionData = req.body

  const validation = validateConfessionInput(confessionData)
  if (!validation.valid) {
    return res.status(400).json({ error: validation.error })
  }

  const savedConfession = saveConfession(confessionData)
  return res.status(201).json(savedConfession)
}

/**
 * GET /api/v1/confessions
 * Returns all confessions wrapped in a { data, count } envelope.
 */
function listAllConfessions(req, res) {
  const confessionsResult = getAllConfessions()
  console.log('[confessionController] Fetching all confessions')
  return res.json(confessionsResult)
}

/**
 * GET /api/v1/confessions/:id
 * Looks up one confession by numeric ID. Returns 404 if missing.
 */
function getOneConfession(req, res) {
  const confessionId = parseInt(req.params.id)

  const confession = getConfessionById(confessionId)
  if (!confession) {
    return res.status(404).json({ error: 'confession not found' })
  }

  console.log(`[confessionController] Found confession id=${confessionId} (${confession.text.length} chars)`)
  return res.json(confession)
}

/**
 * GET /api/v1/confessions/category/:cat
 * Returns all confessions in a given category. Returns 400 for unknown categories.
 */
function listConfessionsByCategory(req, res) {
  const category = req.params.cat

  const filteredConfessions = getConfessionsByCategory(category)
  if (filteredConfessions === null) {
    return res.status(400).json({ error: 'invalid category' })
  }

  return res.json(filteredConfessions)
}

/**
 * DELETE /api/v1/confessions/:id
 * Requires the x-delete-token header to match the env secret.
 * Returns the deleted confession on success.
 */
function removeConfession(req, res) {
  // Auth check: token must be present in header and match the env variable
  if (req.headers['x-delete-token'] !== process.env.DELETE_SECRET) {
    return res.status(403).json({ error: 'forbidden: invalid or missing delete token' })
  }

  const confessionId = parseInt(req.params.id)
  const deletedConfession = deleteConfession(confessionId)

  if (!deletedConfession) {
    return res.status(404).json({ error: 'confession not found' })
  }

  return res.json({ msg: 'deleted', item: deletedConfession })
}

module.exports = {
  createConfession,
  listAllConfessions,
  getOneConfession,
  listConfessionsByCategory,
  removeConfession
}
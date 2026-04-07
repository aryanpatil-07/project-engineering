// All business logic lives here. Controllers call these functions.
// No HTTP objects (req/res) are used in this layer.

// In-memory store and auto-increment ID counter
// (In production this would be replaced with a real database)
const confessions = []
let nextId = 0

// The only valid categories for a confession.
// Defined once here so routes and services never go out of sync.
const VALID_CATEGORIES = ['bug', 'deadline', 'imposter', 'vibe-code']

/**
 * Validates that a confession payload has the required fields
 * and meets the text length constraints.
 * Returns { valid: true } or { valid: false, error: string }
 */
function validateConfessionInput(confessionData) {
  if (!confessionData || !confessionData.text) {
    return { valid: false, error: 'text field is required' }
  }

  if (confessionData.text.length === 0) {
    return { valid: false, error: 'text cannot be empty' }
  }

  // 500-character cap keeps confessions short and readable
  if (confessionData.text.length >= 500) {
    return { valid: false, error: 'text must be less than 500 characters' }
  }

  if (!VALID_CATEGORIES.includes(confessionData.category)) {
    return {
      valid: false,
      error: `category must be one of: ${VALID_CATEGORIES.join(', ')}`
    }
  }

  return { valid: true }
}

/**
 * Persists a new confession to the in-memory store.
 * Returns the saved confession object.
 */
function saveConfession(confessionData) {
  const newConfession = {
    id: ++nextId,
    text: confessionData.text,
    category: confessionData.category,
    created_at: new Date()
  }

  confessions.push(newConfession)
  console.log(`[confessionService] Created confession id=${newConfession.id}`)
  return newConfession
}

/**
 * Returns all confessions sorted newest-first.
 * Wraps the array in an envelope with a count for convenience.
 */
function getAllConfessions() {
  const sortedConfessions = [...confessions].sort(
    (a, b) => b.created_at - a.created_at
  )

  return {
    data: sortedConfessions,
    count: sortedConfessions.length
  }
}

/**
 * Finds a single confession by its numeric ID.
 * Returns the confession or null if not found.
 */
function getConfessionById(confessionId) {
  const confession = confessions.find(c => c.id === confessionId)
  return confession || null
}

/**
 * Returns all confessions for a given category, newest-first.
 * Returns null if the category is not in the allowed list.
 */
function getConfessionsByCategory(category) {
  if (!VALID_CATEGORIES.includes(category)) {
    return null
  }

  // Filter first, then reverse so newest entries appear at the top
  const filteredConfessions = confessions
    .filter(confession => confession.category === category)
    .reverse()

  return filteredConfessions
}

/**
 * Removes a confession by ID from the store.
 * Returns the deleted confession, or null if it was not found.
 */
function deleteConfession(confessionId) {
  const confessionIndex = confessions.findIndex(c => c.id === confessionId)

  if (confessionIndex === -1) {
    return null
  }

  // splice returns an array; we only deleted one item so take index 0
  const deletedConfession = confessions.splice(confessionIndex, 1)[0]
  console.log(`[confessionService] Deleted confession id=${deletedConfession.id}`)
  return deletedConfession
}

module.exports = {
  VALID_CATEGORIES,
  validateConfessionInput,
  saveConfession,
  getAllConfessions,
  getConfessionById,
  getConfessionsByCategory,
  deleteConfession
}
// Load environment variables from .env before any other module reads process.env
require('dotenv').config()

const express = require('express')
const confessionRoutes = require('./routes/confessionRoutes')

const app = express()
app.use(express.json())

// Mount all confession endpoints under this base path
app.use('/api/v1/confessions', confessionRoutes)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Dev Confessions API running on port ${PORT}`)
})
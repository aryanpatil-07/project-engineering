const express = require('express');
const cors = require('cors');
const eventRoutes = require('./routes/events');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/events', eventRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const port = process.env.PORT || 4000;

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

module.exports = app;

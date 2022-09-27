const express = require('express');
require('express-async-errors')

const routes = require('./routes');

const app = express();

// Use JSON on Express.
app.use(express.json());

// Routes.
app.use(routes);

// Error Handler.
app.use((error, request, response, next) => {
  console.log(error);
  response.sendStatus(500);
})

// Starts app at port 3000 (http://localhost:3000).
app.listen(3000, () => console.log('Successfully running at http://localhost:3000'));

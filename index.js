const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

// List of allowed origins
const allowedOrigins = [
//   'http://localhost:3000', // Local development
  'https://text-adventure-openai.surge.sh', // Your production site
];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

app.use(cors(corsOptions));

app.get('/proxy', (req, res) => {
    const { url } = req.query;
    if (!url) return res.status(400).send('Invalid request');
    axios({
      url: url,
      responseType: 'stream',
    }).then(
      response =>
        new Promise((resolve, reject) => {
          response.data.pipe(res);
          response.data.on('end', () => {
            resolve();
          })
          response.data.on('error', err => {
            reject(err);
          })
        }),
    );
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));


import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

// configures dotenv to work in your application
dotenv.config();
const app = express();

const PORT = process.env.PORT;

app.use(cors());

app.get('/', (request, response) => {
  response.status(200).send('Hello World');
});

app.get('/players', async (request, response) => {
  const size = Number(request.query.size) || 5;
  const offset = Number(request.query.offset) || 0;

  try {
    const res = await fetch(
      `https://api.balldontlie.io/v1/players?cursor=${offset}&per_page=${size}`,
      {
        headers: {
          Authorization: process.env.API_KEY!,
        },
      }
    );

    if (!res.ok) {
      return response
        .status(res.status)
        .json({ error: `Error with fetch: ${await res.text()}` });
    }

    const data = await res.json();
    response.status(200).json(data);
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error });
  }
  // const dataToSend = {
  //   data: data.data.slice(offset, offset + size),
  // };

  // response.status(200).send(data);
});

app
  .listen(PORT, () => {
    console.log('Server running at PORT: ', PORT);
  })
  .on('error', (error) => {
    // gracefully handle error
    throw new Error(error.message);
  });

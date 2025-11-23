import app from './server.js';

// dotenv.config();

const port = process.env.PORT || 3000;
const stage = process.env.APP_STAGE || 'none';

app.listen(port, () => {
  console.log(`Listining on http://localhost/${port}`);
  console.log(`Environment:${stage}`);
});

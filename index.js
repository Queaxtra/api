require('dotenv').config();
const { createApp } = require('./src/app');

const port = process.env.PORT || 3000;
const app = createApp();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

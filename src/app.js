const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
app.use(cors({ origin: '*' }));
app.use(bodyParser.json());
const sequelize = require('./utils/database');

const product = require('./routers/productrouter');
app.use(product)

sequelize
  .sync()
  .then((result) => {
    app.listen(process.env.PORT);
    console.log("Client connected successfully");
  })  
  .catch((err) => console.log(err));
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const userRouter = require('./src/routes/userRouter');

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/api/user', userRouter);


let port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`app is running on ${process.env.HOST_URL}`);
});
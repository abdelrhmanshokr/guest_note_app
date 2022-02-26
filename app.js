const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const userRouter = require('./src/routes/userRouter');
const noteRouter = require('./src/routes/noteRouter');

const app = express();

// for multer to save static content in static dir
app.use('/static', express.static('./static'));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api/user', userRouter);
app.use('/api/note', noteRouter);

let port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`app is running on ${process.env.HOST_URL}`);
});
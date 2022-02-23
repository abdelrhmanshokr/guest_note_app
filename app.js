const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const userRouter = require('./src/routes/userRouter');

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/api/user', userRouter);



// app.get('/', (req, res) => {
//     // TODO this has to be an async function
//     // so figure it out
//     // connect to database 
//     sql.connect(databaseConfig, (err) => {
//         if(err) console.log('database connection error', err.message);

//         // create a new sql request
//         const databaseRequest = new sql.Request();

//         // query the database 
//         databaseRequest.query('SELECT * FROM guest_note.guest_note_schema.users;', (err, recordSet) => {
//             // check if there is any errors in the query
//             if(err) console.log('An error occured:', err.message);

//             // if not err send back the response 
//             res.send(recordSet);
//         });
//     });
// });


let port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`app is running on ${process.env.HOST_URL}`);
});
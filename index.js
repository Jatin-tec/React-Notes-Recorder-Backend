const connectToMongo = require('./db');
const express = require('express')
var cors = require('cors')

//Connecting to db
connectToMongo();
const app = express();
const port = 5000;

// middleware to recognize the incoming Request Object as a JSON Object
app.use(cors());
app.use(express.json());

// Available Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/note', require('./routes/note'))

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
})

// root route
// => res = this is working

// signin --> POST = success/fail

// register --> POST = user

// profile/:userId --> GET = user

// image --> PUT --> user
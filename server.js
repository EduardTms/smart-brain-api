const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const database = {
    users: [
        {
            id: 1,
            username: 'eduard',
            email: 'eduard@yahoo.com',
            password: 'admin',
            entries: 0,
            joined: new Date(),
        },
        {
            id: 2,
            username: 'Andrei',
            email: 'Andrei@example.com',
            password: 'admin2',
            entries: 0,
            joined: new Date(),
        }
    ]
}

app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.post('/signin', (req, res) => {
    console.log(req.body.email, req.body.password);
    console.log(database.users[0].email, database.users[0].password);
    if (
        req.body.email === database.users[0].email && 
        req.body.password === database.users[0].password
        ){
        res.json('success');
    } else {
        res.status(401).send('Invalid credentials');
    }
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
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
    res.send(database.users);
})

// signin --> POST = success/fail
app.post('/signin', (req, res) => {
    if (
        req.body.email === database.users[0].email && 
        req.body.password === database.users[0].password
        ){
            res.json('success');
        } else {
            res.status(401).send('Invalid credentials');
        }
    })
    
// register --> POST = user
app.post('/register', (req, res) => {
    const { email, username, password } = req.body;
    database.users.push({
        id: 3,
        username: username,
        email: email,
        password: password,
        entries: 0,
        joined: new Date(),
    });
    res.json(database.users[database.users.length - 1]);
})

app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
})

// root route
// => res = this is working



// profile/:userId --> GET = user

// image --> PUT --> user
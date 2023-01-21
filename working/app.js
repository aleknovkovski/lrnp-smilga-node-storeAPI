require('dotenv').config()
// async errors

const express = require('express');
const app = express();

const notFoundMiddleware = require('./middleware/not-found')
const errorMiddleware = require('./middleware/error-handler')

// routes

app.get('/', (req, res) => {
    res.send('<h1>Store API</h1><a href="/api/v1/products">products route</a>')
})

app.use(notFoundMiddleware)
app.use(errorMiddleware)

const port = process.env.PORT || 5000

async function start () {
    try {
        //connect DB here
        app.listen(5000, console.log('Server listening on port ' + port))
    }
    catch (error) {

    }
}

start()
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('config');
const morgan = require('morgan');


// mongoose & server start
const dbhost = config.get('DBHost');
const PORT = process.env.PORT || 5000;      // config.get('port') || 5000;

async function start() {
    try {
        await mongoose.connect(dbhost, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        console.log('DB is connected ...');
        app.listen(PORT, (err) => {
            if (err) {
                return console.log('something went wrong ...', err)
            }
        });
    } catch (e) {
        console.log('DB connection error: ', e.message);
        process.exit(1);
    }
}

start().then(() => console.log(`server has been started on port ${PORT}`));

// express middlewares
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

if (config.util.getEnv('NODE_ENV') !== 'test') {
    app.use(morgan('dev'));
}

// routes

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/link', require('./routes/link.routs'));
app.use('/t', require('./routes/redirect.routes'));

// for production
const path = require('path');
if (process.env.NODE_ENV === 'production') {
    app.use('/', express.static(path.join(__dirname, 'client', 'build')));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}


module.exports = app;

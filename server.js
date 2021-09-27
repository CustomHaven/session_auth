const express = require('express');
// const { Sequelize } = require("sequelize");
const session = require('express-session');
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const bodyParser = require('body-parser');
const { LOCAL, SESS } = require('./config');
const db = require('./db');
const pageRouter = require('./routes');

const app = express();
const PORT = process.env.PORT || LOCAL;

db.authenticate()
  .then(() => console.log('Database connection has successfully been established..'))
  .catch((err) => console.log(`Opps! Something went wrong.. ${err}`))

const IN_PROD = SESS.NODE_ENV === 'production'
const ss_name = SESS.NAME



// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  name: ss_name,
  resave: false,
  saveUninitialized: false,
  secret: SESS.SECRET,
  store: new SequelizeStore({
    db: db,
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 2,
    sameSite: true,
    secure: IN_PROD
  }
}))

// app.use(
//   session({  
//     secret: SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       secure: false,
//       maxAge: 24 * 60 * 60 * 1000
//     }
//   })
// );


app.use('/', pageRouter);

app.listen(PORT, () => console.log(`Server is listening on http://localhost:${PORT}`));
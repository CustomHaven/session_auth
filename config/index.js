require('dotenv').config();
module.exports = {
  LOCAL: process.env.PORT,
  SESS: {
    NODE_ENV: process.env.NODE_ENV,
    NAME: process.env.SESS_NAME,
    SECRET: process.env.SESS_SECRET
  },
  DB: {
    PG_URI: process.env.DATABASE_URI,
    PG_HOST: process.env.PG_HOST,        
    PG_USER: process.env.PG_USER,    
    PG_DB: process.env.PG_DATABASE,
    PG_PASS: process.env.PG_PASSWORD,
    PG_PORT: process.env.PG_PORT,        
  }
}
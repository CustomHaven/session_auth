const { Sequelize } = require('sequelize');
const { DB } = require('../config');

module.exports = new Sequelize(`postgres://${DB.PG_USER}:${DB.PG_PASS}@${DB.PG_HOST}:${DB.PG_PORT}/${DB.PG_DB}`);
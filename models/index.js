const sequelize = require('../db');

require('./user-model');

module.exports = sequelize.sync({ alter: true }).then(results => console.log(results)).catch(err => console.log(err));
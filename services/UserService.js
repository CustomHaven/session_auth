require('../models');
const createError = require('http-errors');

class UserService {
    
  constructor(sequelize) {
    // Model(sequelize);
    this.client = sequelize;
    this.models = sequelize.models;
  }

  async createUser(data) {
    try {
      const { name, email, password } = data;
      const user = await this.models.User.create({
        name,
        email,
        password
      })
      if (!user) {
        throw createError(500, 'Email already excist')
      }
      return user
    } catch (error) {
      return error
    }

  }

  async findOrCreateUser(data) {
    try {
      const { name, email, password } = data;
      const [ user ] = await this.models.User.findOrCreate({ 
        where: { 
          name, email, password
        }, 
        default: { 
          name,
          email,
          password
        } 
      });
      return user;
    } catch (error) {
      return error
    }
  }

  async findUser(data) {
    try {
      console.log('findUser beginning')
      const { email } = data;
      const user = await this.models.User.findOne({
        where: { email: email }
      })
      if (!user) {
        throw createError(500, 'User was not found')
      }
      return user
    } catch (error) {
      return error
    }
  }

  async findById(data) {
    try {
      const { id } = data;
      const user = await this.models.User.findByPk(id)

      if (!user) {
        throw createError(500, 'User was not found')
      }
      return user
    } catch (error) {
      return error
    }
  }
}

module.exports = UserService;
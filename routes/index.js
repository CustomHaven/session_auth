const router = require('express').Router();
const bcrypt = require('bcryptjs');
const db = require('../db');
const { SESS } = require('../config');
const UserService = require('../services/UserService');
const userService = new UserService(db);

const redirectLogin = (req, res, next) => {
  if (!req.session.userId) {
    res.redirect('/login')
  } else {
    next();
  }
}

const redirectHome = (req, res, next) => {
  if (req.session.userId) {
    res.redirect('/home')
  } else {
    next();
  }
}

router.use(async (req, res, next) => {
  const { userId } = req.session;
  console.log(req.session)
  if (userId) {
    // res.locals.user = users.find(user => user.id === req.session.userId)
    // req.foundUser = users.find(user => user.id === req.session.userId);
    const user = await userService.findById({ id: userId });
    req.foundUser = user
  }
  next()
})



router.get('/', (req, res) => {
  const { userId } = req.session
  console.log(userId)
  console.log(req.session)
  res.send(`
    <h1>Welcome!</h1>
    ${userId ? `
      <a href='/home'>Home</a>
      <form method='POST' action='/logout'>
        <button>Logout</button>
      </form>
    ` : `
      <a href='/login'>Login</a>
      <a href='/register'>Register</a>
    `}
  `)
});

router.get('/profile', (req, res) => {

})

router.get('/login', redirectHome, (req, res) => {
  // req.session.userId = 
  res.send(`
    <h1>Login</h1>
    <form method='POST' action='/login'>
      <input type='email' name='email' placeholder='Email' required />
      <input type='password' name='password' placeholder='password' required />
      <input type='submit' />
    </form>
    <a href='/register'>Register</a>
  `)
});

router.get('/register', redirectHome, (req, res) => {
  res.send(`
    <h1>Register</h1>
    <form method='POST' action='/register'>
      <input type='text' name='name' placeholder='Name' required />
      <input type='email' name='email' placeholder='Email' required />
      <input type='password' name='password' placeholder='password' required />
      <input type='submit' />
    </form>
    <a href='/login'>Login</a>
  `)
});

router.get('/home', redirectLogin, (req, res) => {
  // const user = users.find(user => user.id === req.session.userId)
  console.log("home get")
  const user = req.foundUser
  console.log(req.session)
  // const user = res.locals.user
  res.send(`
    <h1>Home</h1>
    <a href='/'>Main</a>
    <ul>
      <li>Name: ${user.name}</li>  
      <li>Email: ${user.email}</li>   
    </ul>
  `)
});

router.post('/login', redirectHome, async (req, res) => {
  const { email, password } = req.body;

  if (email && password) {
    // const user = users.find(user => user.email === email && user.password === password) //hash it
    const user = await userService.findUser({email})
    const similarPassword = await bcrypt.compare(password, user.password)
    if (similarPassword) {
      req.session.userId = user.id
      console.log(req.session)
      return res.redirect('/home')
    } else {
      res.send('Wrong password')
    }
  }
  
  res.redirect('/login')
});

router.post('/register', redirectHome, async (req, res) => {
  const { name, email, password } = req.body;
  const salt = await bcrypt.genSalt(15);
  const hash = await bcrypt.hash(password, salt);
  // console.log(hash)
  if (name && email && password) {

    const user = await userService.findOrCreateUser({ name, email, password: hash })
    req.session.userId = user.id

    return res.redirect('/home')

  }
  
  res.redirect('/register') // TODO: query string error on url req.query
});

router.post('/logout', redirectLogin, (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.redirect('/home')
    }
    // console.log(req.session)
    res.clearCookie(SESS.NAME)
    res.redirect('/login')
  })
});

module.exports = router;
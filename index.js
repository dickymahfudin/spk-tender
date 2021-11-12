require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const flash = require('express-flash');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const middleware = require('./src/helpers/middleware');
const vendorRouter = require('./src/routes/vendor');
const kriteriaRouter = require('./src/routes/kriteria');
const rumusRouter = require('./src/routes/rumus');
const dashboardRouter = require('./src/routes/dashboard');
const loginRouter = require('./src/routes/login');
const userRouter = require('./src/routes/user');

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cookieParser('secret'));
app.use(
  session({
    cookie: { maxAge: 9000000 },
    store: new session.MemoryStore(),
    saveUninitialized: true,
    resave: 'true',
    secret: 'secret',
  })
);
app.use(flash());
app.use(expressLayouts);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('views', path.join(__dirname, './src/views'));
app.set('view engine', 'ejs');
app.set('layout', './layouts/index');
app.use((req, res, next) => {
  res.locals.role = req.session.role || 0;
  next();
});
app.use('/login', loginRouter);
app.use('/user', middleware, userRouter);
app.use('/vendor', middleware, vendorRouter);
app.use('/kriteria', middleware, kriteriaRouter);
app.use('/rumus', middleware, rumusRouter);
app.use('/dashboard', middleware, dashboardRouter);

app.use('*', middleware, (req, res) => res.redirect('/dashboard'));

app.listen(PORT, () => console.info(`Server Running on : http://localhost:${PORT}`));

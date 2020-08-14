require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const mongo = require('./mongoConn.js');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');
const flash = require('connect-flash');
const port = 8081;
const app = express();

async function startDb() {

  await mongo.init();
}
startDb();

app.use(session({
  store: new MongoStore({
    url: 'mongodb+srv://jack7:quarantine247@finalcluster-dsdyq.gcp.mongodb.net/test?retryWrites=true&w=majority',
    dbName: 'final',
    collection: 'sessions'
  }),
  secret: process.env.secret,
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 * 2 }
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.urlencoded({extended: false, limit: '50mb'}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(express.static(__dirname + '/styles'));
app.use(express.static(__dirname + '/js'));
app.use(express.static(__dirname + '/config'));

const indexRouter = require('./routes/home');
const userRouter = require('./routes/users');
const homeRouter = require('./routes/home');
const getImagesRouter = require('./routes/getImages');
const drawRouter = require('./routes/draw');
const signinRouter = require('./routes/signin');
const signupRouter = require('./routes/signup');

app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/get-drawings', getImagesRouter);
app.use('/draw', drawRouter);
app.use('/signin', signinRouter);
app.use('/signup', signupRouter);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
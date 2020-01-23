const express = require('express');
const bodyParser = require('body-parser');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const WebpackConfig = require('./webpack.config');
const cookieParser = require('cookie-parser');
const path = require('path');
const atob = require('atob');

const app = express();
const compiler = webpack(WebpackConfig);

const router = express.Router();

app.use(cookieParser());

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
  'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

app.use(webpackHotMiddleware(compiler));

app.use(express.static(__dirname));

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

// 需要开放静态资源XSRF防御才会生效?
app.use(express.static(__dirname, {}));

router.get('/auth', function(req, res) {
  const auth = req.headers.authorization;
  const [type, credentials] = auth.split(' ');
  console.log(atob(credentials));
  const [username, password] = atob(credentials).split(':');
  res.json({
    username,
    password
  });
});

router.get('/status', function(req, res) {
  console.log('re');
  res.send('!');
  res.sendStatus(404);
});

router.get('/downloadFile', function(req, res) {
  res.sendFile(path.resolve(__dirname, '../LICENSE'));
});

router.get('/defendXSRF', function(req, res) {
  res.cookie('XSRF-BUDU', 'BUDUBUDU');
  res.json(req.cookies);
});

router.post('/withCredentials', function(req, res) {
  res.set(cors);
  res.json(req.cookies);
});
router.options('/withCredentials', function(req, res) {
  res.set(cors);
  res.end();
});

router.get('/error/get', function(req, res) {
  if (Math.random() > 0.5) {
    res.json({
      msg: `hello world`
    });
  } else {
    res.status(500);
    res.end();
  }
});

router.get('/error/timeout', function(req, res) {
  setTimeout(() => {
    res.json({
      msg: `hello world`
    });
  }, 3000);
});

router.get('/extend/user', (req, res) => {
  res.json({
    code: 1,
    result: {
      name: 'linbudu',
      age: 21
    },
    message: 'success'
  });
});
router.get('/interceptor/get', (req, res) => {
  res.end('hello');
});

router.get('/api/baseURL', function(req, res) {
  res.end('baseURL');
});

router.get('/cancel', function(req, res) {
  setTimeout(() => {
    res.json({
      msg: `hello world`
    });
  }, 3000);
});

app.use(router);

app.use(
  webpackDevMiddleware(compiler, {
    publicPath: '/__build__/',
    stats: {
      colors: true,
      chunks: false
    }
  })
);

const port = process.env.PORT || 8888;
module.exports = app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}, Ctrl+C to stop`);
});

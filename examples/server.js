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

// app.use(express.static(__dirname, {}));

router.get('/auth', function(req, res) {
  // const auth = req.headers.authorization;
  // const [type, credentials] = auth.split(' ');
  // console.log(atob(credentials));
  // const [username, password] = atob(credentials).split(':');
  // res.json({
  //   username,
  //   password
  // });
  const auth = req.headers.authorization
  const [type, credentials] = auth.split(' ')
  console.log(atob(credentials))
  const [username, password] = atob(credentials).split(':')
  if (type === 'Basic' && username === 'Yee' && password === '123456') {
    res.json(req.body)
  } else {
    res.end('UnAuthorization')
  }
});

router.get('/more/status', function(req, res) {
  res.status(304);
  res.end();
});

router.get('/downloadFile', function(req, res) {
  res.sendFile(path.resolve(__dirname, '../LICENSE'));
});

router.get('/more/defendXSRF', function(req, res) {
  res.json(req.cookies);
});

app.use(
  express.static(__dirname, {
    setHeaders(res) {
      res.cookie('XSRF-BUDU', 'BUDUBUDU');
    }
  })
);

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

router.get('/more/baseURL', function(req, res) {
  res.end('baseURL');
});

router.get('/more/cancel', function(req, res) {
  setTimeout(() => {
    res.json({
      msg: `hello world`
    });
  }, 3000);
});

router.post('/base/post', (req, res) => {
  console.log(req.body);
  res.send('/base/post');
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

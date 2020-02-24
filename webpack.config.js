var _ = require('lodash')
const path = require('path')

var ProgressPlugin = require('webpack/lib/ProgressPlugin')

var pathutil = require('./lib/util/pathutil')
var log = require('./lib/util/logger').createLogger('webpack:config')

module.exports = {
  context: path.resolve(__dirname)
  , cache: true
  , entry: {
    app: pathutil.resource('./app/app.js')
    , authldap: pathutil.resource('./auth/ldap/scripts/entry.js')
    , authmock: pathutil.resource('./auth/mock/scripts/entry.js')
  }, output: {
    path: pathutil.resource('build')
    , publicPath: '/static/app/build/'
    , filename: 'entry/[name].entry.js'
    , chunkFilename: '[id].[hash].chunk.js'
  }
  , stats: {
    colors: true
  }
  , optimization: {
    splitChunks: {
      chunks: 'all'
    }
  }
  , resolve: {
    modules: ['./app/components', './res/bower_components', './node_modules']
    , descriptionFiles: ['./bower.json', './package.json']
    , extensions: ['.js', '.json', '.html']
    , alias: {
      'angular-bootstrap': 'angular-bootstrap/ui-bootstrap-tpls'
      , localforage: 'localforage/dist/localforage.js'
      , 'socket.io': 'socket.io-client'
      , stats: 'stats.js/src/Stats.js'
      , 'underscore.string': 'underscore.string/index'
      , node_modules: path.join(__dirname, 'node_modules')
      , bower_modules: path.join(__dirname, 'res/bower_modules')
    }
  }
  , module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          'less-loader'
        ]
      },
      {
        test: /\.(png|jpg|gif)$/i,
        use: {
          loader: 'url-loader',
          options: {
            limit: 1000
          }
        }
      },
      {
        test: /\.(woff|otf|ttf)/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 1,
            mimetype: 'application/font-woff'
          }
        }
      },
      {
        test: /\.svg/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 1,
            mimetype: 'image/svg+xml'
          }
        }
      },
      {
        test: /\.eot/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 1,
            mimetype: 'vnd.ms-fontobject'
          }
        }
      },
      {
        test: /\.(pug|jade)$/,
        use: {
          loader: 'pug-loader'
        }
      },
      {
        test: /\.html$/,
        use: {
          loader: 'html-loader'
        }
      },
      {
        test: /angular\.js$/,
        use: [
          {
            loader: 'exports-loader',
            options: {
              angular: 'angular'
            }
          }
        ]
      },
      {
        test: /angular-(cookies|route|touch|animate|growl)\.js$/,
        use: [
          {
            loader: 'imports-loader',
            options: {
              angular: 'angular'
            }
          }
        ]
      },
      {
        test: /dialogs\.js$/,
        use: 'script-loader'
      }

      // TODO: enable when its sane
      // ,
      // {
      //    test: /\.js$/,
      //    exclude: /node_modules|bower_components/,
      //    enforce: "post",
      //    use: 'eslint-loader'
      //  }
      // ],
    ]
    // , noParse: [
    // pathutil.resource('bower_components')
    // ]
  }
  , plugins: [
    new ProgressPlugin(_.throttle(
      function (progress, message) {
        var msg
        if (message) {
          msg = message
        }
        else {
          msg = progress >= 1 ? 'complete' : 'unknown'
        }
        log.info('Build progress %d%% (%s)', Math.floor(progress * 100), msg)
      }
      , 1000
    ))
  ],
  resolveLoader: {
    modules: ['./node_modules'],
    extensions: ['.js', '.json'],
  }
}

// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var app = angular.module('starter', ['ionic', 'lbServices', 'starter.controllers', 'ionic-toast'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function (LoopBackResourceProvider) {
    LoopBackResourceProvider.setUrlBase('http://10.0.2.15:3000/api');
  })

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: "/app"
    , abstract: true
    , templateUrl: "templates/menu.html"
    , controller: 'AppCtrl'
  })

  .state('app.list', {
    url: "/list"
    , views: {
      'menuContent': {
        templateUrl: "templates/list.html"
        , controller: 'ListCtrl'
        , cache: false
      }
    }
  })

  .state('app.events', {
    url: "/events"
    , views: {
      'menuContent': {
        templateUrl: "templates/events.html"
        , controller: 'EventCtrl'
      }
    }
  })

  .state('app.consult', {
    url: '/consult/:id'
    , views: {
      'menuContent': {
        templateUrl: 'templates/consult.html'
        , controller: 'EditCtrl'
      }
    }
  })

  .state('app.edit', {
    url: '/edit/:id'
    , views: {
      'menuContent': {
        templateUrl: 'templates/edit.html'
        , controller: 'EditCtrl'
      }
    }
  })

  .state('app.error', {
    url: '/error'
    , views: {
      'menuContent': {
        templateUrl: 'templates/error.html'
        , controller: 'ErrCtrl'
      }
    }  
  });

  $urlRouterProvider.otherwise('/app/list');
})

.service('Errors', function ($state) {
  
  var Errors = this;
  Errors.errorCode = {};

  Errors.getError = function() {
    return Errors.errorCode.status;
  }

  Errors.setError = function(value) {

    Errors.errorCode.status = value.status;
  }
})

.factory('socket', function ($rootScope) {

    try {
      var socket = io.connect('http://localhost:3000');

      return {
        on: function (eventName, callback) {
          socket.on(eventName, function () {
            var args = arguments;
            $rootScope.$apply(function () {
              callback.apply(socket, args);
            });
          });
        },
        emit: function (eventName, data, callback) {
          socket.emit(eventName, data, function () {
            var args = arguments;
            $rootScope.$apply(function () {
              if (callback) {
                callback.apply(socket, args);
              }
            });
          });
        }
      };
    }
    catch (err) {
      console.log('socket.io failed to load');
      return {
        disabled: true
        , on: function() {}
        , emit: function () {}
      };
    }
  });

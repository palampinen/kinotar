// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic','ionic.service.core', 'ionic.service.analytics','ionic-native-transitions', 'starter.controllers','starter.services'])

.run(function($ionicPlatform,$ionicAnalytics) {
  $ionicPlatform.ready(function() {

    $ionicAnalytics.register();
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

.config(function($stateProvider, $urlRouterProvider, $sceDelegateProvider, $ionicConfigProvider, $ionicNativeTransitionsProvider) {

  $sceDelegateProvider.resourceUrlWhitelist([
    // Allow same origin resource loads.
    'self',
    // Allow loading from our assets domain.  Notice the difference between * and **.
    'https://media.finnkino.fi/**',
    'http://cors-anywhere.herokuapp.com/**',
    'http://www.omdbapi.com/**',
    'http://fin.clip-1.filmtrailer.com/**'

  ]);

  $ionicConfigProvider.backButton.text('').icon('ion-android-arrow-back');
  $ionicConfigProvider.views.transition('none');


   $ionicNativeTransitionsProvider.setDefaultOptions({
    duration: 200,
    slowdownfactor: 1,
    fixedPixelsTop: 54,
    backInOppositeDirection: true 
  });

  $ionicNativeTransitionsProvider.setDefaultTransition({
        'type': 'slide',
        'direction':'left'
  });

    var nativeTransitionStyle = {
    fade:{
          "type"          : "fade",
    },
    slideleft:{
          "type"          : "slide",
          "direction"     : "left",
    },
    slideup:{
          "type"          : "slide",
          "direction"     : "up",
    }
  };



  $stateProvider

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })
    .state('app.playlists', {
      url: "/playlists",
      views: {
        'menuContent': {
          templateUrl: "templates/playlists.html",
          controller: 'PlaylistsCtrl'
        }
      }
    })

  .state('app.single', {
    url: "/playlists/:eventId/:date/:imdbId",
    views: {
      'menuContent': {
        templateUrl: "templates/playlist.html",
        controller: 'PlaylistCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/playlists');
});

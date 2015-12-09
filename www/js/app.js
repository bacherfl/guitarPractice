// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var db = null;
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngCordova'])

.run(function($ionicPlatform, $cordovaSQLite, $window) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }

    db = $cordovaSQLite.openDB("gp.db");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS exercises (id integer primary key, name text, description text," +
      "categoryId integer, image text)");

    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS exercise_log (id integer primary key, date integer, " +
      "speed integer, exerciseId integer)");
  });
})

.config(function($stateProvider, $urlRouterProvider, $compileProvider) {
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel|data):/);
    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: 'templates/home.html',
        controller: 'HomeCtrl',

        resolve: {
          categories: function(CategoriesService) {
            return CategoriesService.all();
          }
        }
      })
      .state('category-detail', {
        url: '/category/:categoryId',
        templateUrl: 'templates/category-detail.html',
        controller: 'CategoryDetailCtrl',
        resolve: {
          category: function($stateParams, CategoriesService) {
            return CategoriesService.get($stateParams.categoryId)
          }
        }
      })
      .state('create-exercise', {
        url: '/create/:categoryId',
        templateUrl: 'templates/create-exercise.html',
        controller: 'CreateExerciseCtrl',
        resolve: {
          categoryId: function($stateParams) {
            return $stateParams.categoryId;
          }
        }
      })

      .state('exercise', {
        url: '/exercise/:exerciseId',
        abstract: true,
        templateUrl: 'templates/exercise.html',
        controller: 'ExerciseNavCtrl',
        resolve: {
          exerciseId: function($stateParams) {
            return $stateParams.exerciseId;
          }
        }
      })

      .state('exercise.overview', {
        url: '/overview',
        templateUrl: 'templates/exercise-overview.html',
        controller: 'ExerciseOverviewCtrl',
        resolve: {
          exerciseId: function($stateParams) {
            return $stateParams.exerciseId;
          }
        }
      })
      .state('exercise.history', {
        url: '/history',
        templateUrl: 'templates/exercise-history.html',
        controller: 'ExerciseHistoryCtrl'
      })
      .state('exercise.play', {
        url: '/play',
        templateUrl: 'templates/exercise-play.html',
        controller: 'ExercisePlayCtrl'
      });
      /*
      .state('exercise-detail', {
        url: 'exercise/:exerciseId',
        templateUrl: 'templates/exercise-detail.html',
        controller: 'ExerciseDetailCtrl',
        resolve: {
          exerciseId: function($stateParams) {
            return $stateParams.exerciseId;
          }
        }
      });
      */

      $urlRouterProvider.otherwise('/home');
  })

// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
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
          },
          exercises: function($stateParams, Exercises) {
            return Exercises.getAllOfCategory($stateParams.categoryId);
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

      $urlRouterProvider.otherwise('/home');
  })

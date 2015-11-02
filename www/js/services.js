/**
 * Created by florian on 30.10.2015.
 */
angular.module('starter.services', [])
  .factory('CategoriesService', function() {
    var categories= [{
      id: 0,
      name: 'Alternate Picking'
    }, {
      id: 1,
      name: 'Sweep Picking'
    }, {
      id: 2,
      name: 'Scales'
    }, {
      id: 3,
      name: 'Other'
    }];
    return {
      all: function() {
        return categories;
      },
      get: function(id) {
        return categories[id];
      }
    }
  })
  .factory('Exercises', ['$window', function($window) {
    return {
      store: function(exercise) {
        var exercises;
        if ($window.localStorage['exercises'] == null || $window.localStorage['exercises'] == "") {
          exercises = [];
        } else {
          exercises = JSON.parse($window.localStorage['exercises']);
        }
        exercises.push(JSON.stringify(exercise));
        $window.localStorage['exercises'] = JSON.stringify(exercises);
        console.log($window.localStorage['exercises']);
      },
      all: function() {
        var result = [];
        if ($window.localStorage['exercises'] == null || $window.localStorage['exercises'] == "")
          return result;
        angular.forEach(JSON.parse($window.localStorage['exercises']), function(exercise) {
          exercise = JSON.parse(exercise);
          result.push(exercise);
        });
        return result;
      },
      getAllOfCategory: function(categoryId) {
        var result = [];
        console.log($window.localStorage['exercises']);

        if ($window.localStorage['exercises'] == null || $window.localStorage['exercises'] == "")
          return result;
        angular.forEach(JSON.parse($window.localStorage['exercises']), function(exercise) {
          exercise = JSON.parse(exercise);
          if (exercise.categoryId == categoryId) {
            result.push(exercise);
          }
        });

        return result;
      }
    }
  }])
  .factory('Camera', ['$q', '$cordovaCamera', function($q, $cordovaCamera) {

  return {
    getPicture: function(options) {
      var q = $q.defer();

      $cordovaCamera.getPicture(options).then(function(imageData) {
        q.resolve("data:image/jpeg;base64," + imageData);
      }, function(err) {
        // An error occured. Show a message to the user
        q.reject(err);
      });
      return q.promise;
      /*
      navigator.camera.getPicture(function(result) {
        // Do any magic you need
        q.resolve(result);
      }, function(err) {
        q.reject(err);
      }, options);

      return q.promise;
      */
    }
  }
}]);

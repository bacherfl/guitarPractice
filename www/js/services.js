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
  .factory('CameraService', ['$q', '$cordovaCamera', function($q, $cordovaCamera) {

  return {
    getPicture: function(options, onSuccess) {
      $cordovaCamera.getPicture(options).then(function(imageData) {
        onImageSuccess(imageData);

        function onImageSuccess(fileURI) {
          createFileEntry(fileURI);
        }

        function createFileEntry(fileURI) {
          window.resolveLocalFileSystemURL(fileURI, copyFile, fail);
        }
        function copyFile(fileEntry) {
          var name = fileEntry.fullPath.substr(fileEntry.fullPath.lastIndexOf('/') + 1);
          var newName = makeId() + name;

          window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(fileSystem2) {
            fileEntry.copyTo(fileSystem2, newName, onCopySuccess, fail);
          }, fail);
        }
        function onCopySuccess(entry) {
          onSuccess(entry);
        }
        function fail(error) {
          console.log("fail: " + error.code);
        }
        function makeId() {
          var text = "";
          var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

          for (var i = 0; i < 5; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
          }
          return text;
        }
      }, function(err) {
        // An error occured. Show a message to the user
        console.log(err)
      });
    }
  }
}]);

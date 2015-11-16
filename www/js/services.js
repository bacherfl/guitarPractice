function getResultRowsAsArray(res) {
  var resultArray = [];
  for (var i = 0; i < res.rows.length; i++) {
    resultArray.push(res.rows.item(i));
  }
  return resultArray;
}
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
  .factory('Exercises', ['$window', '$cordovaSQLite', function($window, $cordovaSQLite) {

    return {
      store: function(exercise) {

        var query = "INSERT INTO exercises (categoryId, name, description, image) VALUES (?,?,?,?)";
        console.log(query);
        console.log(exercise);
        $cordovaSQLite.execute(db, query, [exercise.categoryId, exercise.name, exercise.description, exercise.image])
          .then(function(res) {
            console.log(res);
          }, function(err) {
            console.error(err);
          });

      },
      all: function(callback) {
        var query = "SELECT * FROM exercises";
        $cordovaSQLite.execute(db, query)
          .then(function(res) {
            var resultArray = getResultRowsAsArray(res);
            callback(resultArray);
          });
      },
      getById: function(exerciseId, callback) {
        var query = "SELECT * FROM exercises WHERE id=?";
        $cordovaSQLite.execute(db, query, [exerciseId]).then(function(res) {
          if (res.rows.length > 0) {
            var resultArray = getResultRowsAsArray(res);
            callback(resultArray[0]);
          } else {
            callback(null);
          }
        });
      },
      getAllOfCategory: function(categoryId, callback) {
        var query = "SELECT * FROM exercises WHERE categoryId=?";
        $cordovaSQLite.execute(db, query, [categoryId])
          .then(function(res) {
            var resultArray = getResultRowsAsArray(res);
            callback(resultArray);
          });
      },
      delete: function(exercise, callback) {
        var query = "DELETE FROM exercises WHERE id=?";

        $cordovaSQLite.execute(db, query, [exercise.id]).then(function(res) {
          callback(res);
        }, function(err) {
          console.error(err);
        });
      },
      addLogEntry: function(exercise, speed, callback) {
        var query = "INSERT INTO exercise_log (exerciseId, speed, date) values (?,?,?)";

        $cordovaSQLite.execute(db, query, [exercise.id, speed, Date.now()]).then(function(res) {
          callback();
        });
      },
      getLogEntries: function(exercise, callback) {
        var query = "SELECT * FROM exercise_log where exerciseId=? ORDER BY date DESC";

        $cordovaSQLite.execute(db, query, [exercise.id]).then(function(res) {
          var resultArray = getResultRowsAsArray(res);
          callback(resultArray);
        });
      },
      getLatestLogEntry: function(exercise, callback) {
        var query = "SELECT * FROM exercise_log where exerciseId=? ORDER BY date DESC LIMIT 1";

        $cordovaSQLite.execute(db, query, [exercise.id]).then(function(res) {
          var resultArray = getResultRowsAsArray(res);
          callback(resultArray);
        });
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

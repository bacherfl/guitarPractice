/**
 * Created by florian on 30.10.2015.
 */
angular.module('starter.controllers', [])
  .controller('HomeCtrl', function($scope, categories) {
    $scope.categories = categories;
  })

  .controller('CategoryDetailCtrl', function($scope, $state, category, Exercises) {
    $scope.$on('$ionicView.enter', function() {
      $scope.category = category;
      Exercises.getAllOfCategory(category.id, function(exercises) {
        angular.forEach(exercises, function(exercise) {
          Exercises.getLatestLogEntry(exercise, function(logEntryResult) {
            if (logEntryResult.length > 0) {
              exercise.speed = logEntryResult.speed;
              var lastPracticeDate = new Date(logEntryResult.date);
              var lastPracticeDateString = lastPracticeDate.getDay() + "." + lastPracticeDate.getMonth() + "." + lastPracticeDate.getFullYear();
              exercise.lastPracticeDate = lastPracticeDateString;
            } else {
              exercise.speed = "-";
              exercise.lastPracticeDate = "-";
            }
          });
        });
        $scope.exercises = exercises;
      })
    });
    $scope.urlForImage = function(imageName) {
      if (imageName == null)
        return;
      console.log(imageName);
      var name = imageName.substr(imageName.lastIndexOf('/') + 1);
      var trueOrigin = cordova.file.dataDirectory + name;
      return trueOrigin;
    };

    $scope.deleteExercise = function(exercise) {
      Exercises.delete(exercise, function() {
        var removeIndex;

        for (var i = 0; i < $scope.exercises.length; i++) {
          if ($scope.exercises[i].id == exercise.id) {
            $scope.exercises.splice(i, 1);
            continue;
          }
        }
      });
    };
  })

  .controller('ExerciseNavCtrl', function($scope, $state, exerciseId) {
    $scope.exerciseId = exerciseId;
    $state.transitionTo("exercise.overview");
  })

  .controller('ExerciseOverviewCtrl', function($scope, exerciseId, Exercises) {
    Exercises.getById(exerciseId, function(exercise) {
      $scope.exercise = exercise
      Exercises.getLatestLogEntry(exercise, function(logEntry) {
        $scope.exercise.log = logEntry;
      });
    });

    $scope.urlForImage = function(imageName) {
      console.log(imageName);
      var name = imageName.substr(imageName.lastIndexOf('/') + 1);
      var trueOrigin = cordova.file.dataDirectory + name;
      return trueOrigin;
    };
  })

  .controller('ExercisePlayCtrl', function($scope, exerciseId, Exercises) {
    Exercises.getById(exerciseId, function(exercise) {
      $scope.exercise = exercise
    });
  })

  .controller('ExerciseHistoryCtrl', function($scope, exerciseId, Exercises) {
    Exercises.getById(exerciseId, function(exercise) {
      $scope.exercise = exercise
      Exercises.getLogEntries($scope.exercise, function(log) {
        $scope.exercise.log = log;
      });
    });
  })

  /*
  .controller('ExerciseDetailCtrl', function($scope, exerciseId, Exercises) {
    Exercises.getById(exerciseId, function(exercise) {
      $scope.exercise = exercise
      Exercises.getLogEntries($scope.exercise, function(log) {
        $scope.exercise.log = log;
      });
    });
  })
  */
  .controller('CreateExerciseCtrl', function($scope, categoryId, $cordovaCamera, $location, $state, Exercises, CameraService) {
    $scope.exercise = {name: null, description: null, image: '', categoryId: categoryId};
    $scope.categoryId = categoryId;

    $scope.takePicture = function(){
      var options = {
        quality : 75,
        destinationType : Camera.DestinationType.FILE_URI,
        sourceType : Camera.PictureSourceType.CAMERA,
        allowEdit : false,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 320,
        //targetHeight: 300,
        popoverOptions: CameraPopoverOptions,
        //saveToPhotoAlbum: true
      };
      CameraService.getPicture(options, function(entry) {
        $scope.$apply(function() {
          $scope.exercise.image = entry.nativeURL;
        });
      });
    };



    $scope.urlForImage = function(imageName) {
      console.log(imageName);
      var name = imageName.substr(imageName.lastIndexOf('/') + 1);
      var trueOrigin = cordova.file.dataDirectory + name;
      return trueOrigin;
    };

    $scope.saveExercise = function() {

      Exercises.store($scope.exercise);
      //$location.path('/category/' + categoryId);
      //$route.reload();
      $state.transitionTo('category-detail', {categoryId: $scope.categoryId}, {reload: true, notify: true});
    };
  });

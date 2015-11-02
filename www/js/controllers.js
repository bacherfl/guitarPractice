/**
 * Created by florian on 30.10.2015.
 */
angular.module('starter.controllers', [])
  .controller('HomeCtrl', function($scope, categories) {
    $scope.categories = categories;
  })

  .controller('CategoryDetailCtrl', function($scope, $state, category, exercises) {
    $scope.$on('$ionicView.enter', function() {
      $scope.category = category;
      $scope.exercises = exercises;
    });
  })

  .controller('CreateExerciseCtrl', function($scope, categoryId, $cordovaCamera, $location, $state, Exercises) {
    $scope.exercise = {name: null, description: null, image: '', categoryId: categoryId};
    $scope.categoryId = categoryId;

    $scope.takePicture = function() {
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
          $scope.$apply(function() {
            //$scope.images.push(entry.nativeURL);
            $scope.exercise.image = entry.nativeURL;
          });
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

    $scope.urlForImage = function(imageName) {
      console.log(imageName);
      var name = imageName.substr(imageName.lastIndexOf('/') + 1);
      var trueOrigin = cordova.file.dataDirectory + name;
      return trueOrigin;
    }

    $scope.saveExercise = function() {

      Exercises.store($scope.exercise);
      //$location.path('/category/' + categoryId);
      //$route.reload();
      $state.transitionTo('category-detail', {categoryId: $scope.categoryId}, {reload: true, notify: true});
    }
  });

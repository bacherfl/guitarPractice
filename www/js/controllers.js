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
    $scope.urlForImage = function(imageName) {
      console.log(imageName);
      var name = imageName.substr(imageName.lastIndexOf('/') + 1);
      var trueOrigin = cordova.file.dataDirectory + name;
      return trueOrigin;
    };
  })

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

'use strict';

angular.module('firebaseApp')
  .controller('VideosCTRL', ['$scope', '$window', '$mdToast', '$firebaseArray', '$rootScope', 'FileUploader', '$mdDialog', function ($scope, $window, $mdToast, $firebaseArray, $rootScope, FileUploader, $mdDialog) {

    var currentKey = '';

    var database = firebase.database();

    var videos = database.ref('/videos');

    $scope.edittingMode = false;

    var uploader = $scope.uploader = new FileUploader({
        url: '/extraclass2/upload.php'
    });


    // FILTERS

    uploader.filters.push({
        name: 'customFilter',
        fn: function(item /*{File|FileLikeObject}*/, options) {
            return this.queue.length < 2;
        }
    });

    // CALLBACKS

    uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
        console.info('onWhenAddingFileFailed', item, filter, options);
    };
    uploader.onAfterAddingFile = function(fileItem) {
        console.info('onAfterAddingFile', fileItem);
        console.log(uploader.queue);
        console.log('hello' + $scope.model);
    };
    uploader.onAfterAddingAll = function(addedFileItems) {
        console.info('onAfterAddingAll', addedFileItems);

    };

    uploader.onBeforeUploadItem = function(item) {
        console.info('onBeforeUploadItem', item);
        item.formData.push({name: currentKey});
        item.file.name = currentKey;
        $mdDialog.show({
                controller: 'waitCtrl',
                template: '<md-dialog style="background-color:transparent;box-shadow:none">' +
                            '<div layout="row" layout-sm="column" layout-align="center center" aria-label="wait">' +
                                '<md-progress-circular md-mode="indeterminate" ></md-progress-circular>' +
                            '</div>' +
                         '</md-dialog>',
                parent: angular.element(document.body),
                clickOutsideToClose:false,
                fullscreen: false
              })
              .then(function(answer) {

              });

    };
    uploader.onProgressItem = function(fileItem, progress) {
        console.info('onProgressItem', fileItem, progress);
    };
    uploader.onProgressAll = function(progress) {
        console.info('onProgressAll', progress);
    };
    uploader.onSuccessItem = function(fileItem, response, status, headers) {
        console.info('onSuccessItem', fileItem, response, status, headers);
    };
    uploader.onErrorItem = function(fileItem, response, status, headers) {
        console.info('onErrorItem', fileItem, response, status, headers);
    };
    uploader.onCancelItem = function(fileItem, response, status, headers) {
        console.info('onCancelItem', fileItem, response, status, headers);
    };
    uploader.onCompleteItem = function(fileItem, response, status, headers) {
        console.info('onCompleteItem', fileItem, response, status, headers);
    };
    uploader.onCompleteAll = function() {
        console.info('onCompleteAll');
        uploader.queue = [];
        var updateRef = database.ref('/update');
        updateRef.transaction(function(currentUpdate) {
          return currentUpdate+1;
        });


        $rootScope.$emit("hide_wait");

    };




    console.info('uploader', uploader);

    $scope.video = {};

    //$scope.note.name = $scope.navigation[2].selected.name;

    $scope.validateFiles = function(){
      if(uploader.queue.length >= 1) return false;
      return true;
    }

    $scope.refresh = function(){
      var query = videos.orderByChild("topic").equalTo($scope.navigation[2].selected.$id);
      $scope.video.name = $scope.navigation[2].selected.name;
      $scope.videoList = $firebaseArray(query);
    }

    $scope.$on('openMCQNotes', function (event, data) {
      $scope.refresh();
    });


    $scope.clear = function(){
      angular.copy({}, $scope.video);
      angular.element("input[type='file']").val(null);
      $scope.edittingMode = false;
    }



    $scope.add = function(){



      $scope.video.topic = $scope.navigation[2].selected.$id;
      currentKey = videos.push($scope.video).key;
      uploader.uploadAll();

      $scope.clear();

    }



    $scope.update = function(){
      var index = $scope.video.$id;
      currentKey = index;
      var refNote = database.ref('/videos/' + index);



  		refNote.update({
        name: $scope.video.name
      });

      uploader.uploadAll();

      $scope.clear();
    }

    $scope.edit = function(video){
      angular.copy(video, $scope.video);
      $scope.edittingMode = true;
    }





  }]);

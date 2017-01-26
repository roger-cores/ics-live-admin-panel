'use strict';

angular.module('firebaseApp')
  .controller('NotesCTRL', ['$scope', '$window', '$mdToast', '$firebaseArray', '$rootScope', 'FileUploader', 'firebaseurl', function ($scope, $window, $mdToast, $firebaseArray, $rootScope, FileUploader, firebaseurl) {

    var currentKey = '';

    var database = firebase.database();

    var notes = database.ref('/notes');

    $scope.edittingMode = false;

    var uploader = $scope.uploader = new FileUploader({
        url: '/extraclass2/note-upload.php'
    });


    // FILTERS

    uploader.filters.push({
        name: 'customFilter',
        fn: function(item /*{File|FileLikeObject}*/, options) {
            return this.queue.length < 500;
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




    };




    console.info('uploader', uploader);

    $scope.note = {};

    //$scope.note.name = $scope.navigation[2].selected.name;

    $scope.validateFiles = function(){
      if(uploader.queue.length >= 1) return false;
      return true;
    }

    $scope.refresh = function(){
      var query = notes.orderByChild("topic").equalTo($scope.navigation[2].selected.$id);
      $scope.note.name = $scope.navigation[2].selected.name;
      $scope.noteList = $firebaseArray(query);
    }

    $scope.$on('openMCQNotes', function (event, data) {
      $scope.refresh();
    });


    $scope.clear = function(){
      angular.copy({}, $scope.note);
      angular.element("input[type='file']").val(null);
      $scope.edittingMode = false;
    }



    $scope.add = function(){



      $scope.note.topic = $scope.navigation[2].selected.$id;
      currentKey = notes.push($scope.note).key;
      uploader.uploadAll();

      $scope.clear();

    }



    $scope.update = function(){
      var index = $scope.note.$id;
      currentKey = index;
      var refNote = database.ref('/notes/' + index);



  		refNote.update({
        name: $scope.note.name
      });

      uploader.uploadAll();

      $scope.clear();
    }

    $scope.edit = function(note){
      angular.copy(note, $scope.note);
      $scope.edittingMode = true;
    }





  }]);

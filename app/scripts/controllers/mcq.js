'use strict';

/**
 * @ngdoc function
 * @name firebaseApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the firebaseApp
 */
angular.module('firebaseApp')
  .controller('MCQCtrl', ['$scope', '$window', '$mdToast', '$firebaseArray', '$rootScope', 'FileUploader', 'firebaseurl', function ($scope, $window, $mdToast, $firebaseArray, $rootScope, FileUploader, firebaseurl) {

    var currentKey = '';
    var questname, aname, bname, cname, dname;

    var showMessage = function(message) {
      $mdToast.show(
        $mdToast.simple()
          .textContent(message)
          .hideDelay(1500)
      );
    }

    var database = firebase.database();


    var mcqs = database.ref('/mcqs');



    var uploader = $scope.uploader = new FileUploader({
        url: '/extraclass2/upload.php'
    });


    $scope.uploadFileQuest = function(event){
        var files = event.target.files;
        console.log('this is file');
        console.log(files);
        console.log(uploader.queue);

        for(var i=0; i<uploader.queue.length; i++){
          if(files[0].name === uploader.queue[i]._file.name){
            console.log('yes at ' + i);
            uploader.queue[i]._file.id = 'quest';
          } else console.log('nope');
        }
    };

    $scope.uploadFileA = function(event){
        var files = event.target.files;
        console.log('this is file');
        console.log(files);
        console.log(uploader.queue);

        for(var i=0; i<uploader.queue.length; i++){
          if(files[0].name === uploader.queue[i]._file.name){
            console.log('yes at ' + i);
            uploader.queue[i]._file.id = 'A';
          } else console.log('nope');
        }
    };

    $scope.uploadFileB = function(event){
        var files = event.target.files;
        console.log('this is file');
        console.log(files);
        console.log(uploader.queue);

        for(var i=0; i<uploader.queue.length; i++){
          if(files[0].name === uploader.queue[i]._file.name){
            console.log('yes at ' + i);
            uploader.queue[i]._file.id = 'B';
          } else console.log('nope');
        }
    };

    $scope.uploadFileC = function(event){
        var files = event.target.files;
        console.log('this is file');
        console.log(files);
        console.log(uploader.queue);

        for(var i=0; i<uploader.queue.length; i++){
          if(files[0].name === uploader.queue[i]._file.name){
            console.log('yes at ' + i);
            uploader.queue[i]._file.id = 'C';
          } else console.log('nope');
        }
    };

    $scope.uploadFileD = function(event){
        var files = event.target.files;
        console.log('this is file');
        console.log(files);
        console.log(uploader.queue);

        for(var i=0; i<uploader.queue.length; i++){
          if(files[0].name === uploader.queue[i]._file.name){
            console.log('yes at ' + i);
            uploader.queue[i]._file.id = 'D';
          } else console.log('nope');
        }
    };

    $scope.uploadFileExplanation = function(event){
        var files = event.target.files;
        console.log('this is file');
        console.log(files);
        console.log(uploader.queue);

        for(var i=0; i<uploader.queue.length; i++){
          if(files[0].name === uploader.queue[i]._file.name){
            console.log('yes at ' + i);
            uploader.queue[i]._file.id = 'explanation';
          } else console.log('nope');
        }
    };

    uploader.filters.push({
        name: 'customFilter',
        fn: function(item /*{File|FileLikeObject}*/, options) {
            return this.queue.length < 10;
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
        console.log(item.file.name);
        item.file.name = currentKey + item._file.id;
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
    };

    console.info('uploader', uploader);

    $scope.mcq = {};
    $scope.mcq.type = 'image';
    $scope.mcq.explanationType = 'image';
    $scope.mcq.ans = 'A';
    $scope.mcq.difficulty = 1;
    $scope.edittingMode = false;

    $scope.refresh = function(){
      var query = mcqs.orderByChild("topic").equalTo($scope.navigation[2].selected.$id);
      $scope.mcqList = $firebaseArray(query);
      $scope.edittingMode = false;
    }

    $scope.$on('openMCQNotes', function (event, data) {
      $scope.refresh();
    });


    $scope.clear = function(){
      angular.copy({}, $scope.mcq);
      $scope.mcq.type = 'image';
      $scope.mcq.explanationType = 'image';
      $scope.mcq.difficulty = 1;
      $scope.edittingMode = false;
      angular.element("input[type='file']").val(null);
    }



    $scope.add = function(){



      $scope.mcq.topic = $scope.navigation[2].selected.$id;
      currentKey = mcqs.push($scope.mcq).key();
      if($scope.mcq.type === 'image'){

        uploader.uploadAll();
      } else {

      }
      $scope.clear();

    }

    $scope.validateFiles = function(){
      console.log(uploader.queue.length);
      if($scope.mcq.type == 'image'){
        if($scope.mcq.explanationType == 'image'){

          if(uploader.queue.length >= 6) return false;
          else return true;
        }
        else {
          if(uploader.queue.length >= 5) return false;
          else return true;
        }
      } else {
        if($scope.mcq.explanationType == 'image'){
          if(uploader.queue.length >= 1) return false;
          else return true;
        }
        else {
          return false;
        }
      }
    }

    $scope.update = function(){
      var index = $scope.mcq.$id;
      currentKey = index;
      var refMcq = database.ref('/mcqs/' + index);



  		refMcq.update({
        name: $scope.mcq.name,
        type: $scope.mcq.type,
        ans: $scope.mcq.ans,
        ansA: $scope.mcq.ansA,
        ansB: $scope.mcq.ansB,
        ansC: $scope.mcq.ansC,
        ansD: $scope.mcq.ansD,
        question: $scope.mcq.question
      });

      uploader.uploadAll();

      $scope.clear();
    }

    $scope.edit = function(mcq){
      angular.copy(mcq, $scope.mcq);
      $scope.mcq.ans = 'A';
      if(mcq.type === 'image'){
        $scope.mcq.question = $scope.mcq.$id + 'quest';
        $scope.mcq.ansA = $scope.mcq.$id + 'A';
        $scope.mcq.ansB = $scope.mcq.$id + 'B';
        $scope.mcq.ansC = $scope.mcq.$id + 'C';
        $scope.mcq.ansD = $scope.mcq.$id + 'D';

      }

      if(mcq.explanationType == 'image'){
        $scope.mcq.explanation = $scope.mcq.$id + 'explanation';
      }

      $scope.edittingMode = true;

    }




    $scope.isImageType = function(){
      return ($scope.mcq.type === 'image')
    }


    $scope.isExplanationImageType = function(){
      return ($scope.mcq.explanationType === 'image')
    }


  }]);

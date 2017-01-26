'use strict';

/**
 * @ngdoc function
 * @name firebaseApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the firebaseApp
 */
angular.module('firebaseApp')
  .controller('MasterDataCtrl', ['$scope', '$window', '$mdToast', '$firebaseArray', 'firebaseurl', function ($scope, $window, $mdToast, $firebaseArray, firebaseurl) {

    $scope.edittingMode = false;
    $scope.tournamentMode = true;
    $scope.page = 'masterdata.html';
    $scope.masterData = {};
    $scope.selectedMasterData = 'tournaments';
    $scope.backButtonDisabled = 'true';
    $scope.pageOne = true;
    $scope.publishImage = '../images/ic_online.svg';
    $scope.unpublishImage = '../images/shapes.svg';
    $scope.navigation = [
      {
        name: 'tournaments',
        selected: {}
      }
    ]
    $scope.masterDataNames = [
      'Tournaments',
      'Rounds'
    ];

    var showMessage = function(message) {
      $mdToast.show(
        $mdToast.simple()
          .textContent(message)
          .hideDelay(1500)
      );
    }

    var database = firebase.database();


    var refMasterData = {
      tournaments: database.ref('/tournaments')
    }

    $scope.refresh = function(){
      // switch($scope.selectedMasterData){
      //   case 'tournaments':
      //     $scope.masterDataList = $firebaseArray(refMasterData[$scope.selectedMasterData], 'name');
      //     break;
      //   case 'rounds':
      //     $scope.masterDataList = $firebaseArray(refMasterData.tournaments.child($scope.navigation[0].selected.$id).child("rounds"), 'name');
      //
      //     break;
      //   // case 'games':
      //   //   var query = refMasterData.subjects.orderByChild("course").equalTo($scope.navigation[0].selected.$id);
      //   //   $scope.masterDataList = $firebaseArray(query);
      //   //   break;
      // }
      console.log(refMasterData);
      console.log($scope.selectedMasterData);
      $scope.masterDataList = $firebaseArray(refMasterData[$scope.selectedMasterData].orderByChild("name"));
      $scope.edittingMode = false;
    }

    $scope.add = function(){
      // switch($scope.selectedMasterData){
      //   case 'tournaments':
      //     $scope.masterData.tournament = $scope.navigation[0].selected.$id;
      //     break;
      //   // case 'topics':
      //   //   $scope.masterData.subject = $scope.navigation[1].selected.$id;
      //   //   break;
      //
      // }
      console.log(refMasterData);
      console.log(refMasterData[$scope.selectedMasterData]);
      if($scope.tournamentMode === true){
        $scope.masterData.dateStart = $scope.masterData.dateStart.getTime();
        $scope.masterData.dateEnd = $scope.masterData.dateEnd.getTime();
      } else {
        $scope.masterData.publish = false;
        $scope.masterData.pgn = " ";
      }
      console.log($scope.masterData);
      refMasterData[$scope.selectedMasterData].push($scope.masterData);
  		$scope.masterData={};
    }

    $scope.edit = function(masterData){
      if($scope.tournamentMode === true){
        $scope.masterData = {
          $id: masterData.$id,
          name: masterData.name,
          dateStart: new Date(masterData.dateStart),
          dateEnd: new Date(masterData.dateEnd),
          tournamentAddress: masterData.tournamentAddress,
          base_url: masterData.base_url
        };
      } else {
        $scope.masterData = masterData;
      }

      $window.location.href = '#card';
      $scope.edittingMode = true;
    }

    $scope.update = function(){
      var index = $scope.masterData.$id;
      var refMasterData = database.ref('/' + $scope.selectedMasterData + '/' + index);
      $scope.masterData.dateStart = $scope.masterData.dateStart.getTime();
      $scope.masterData.dateEnd = $scope.masterData.dateEnd.getTime();
  		refMasterData.update({
  			name:$scope.masterData.name,
        dateStart:$scope.masterData.dateStart,
        dateEnd:$scope.masterData.dateEnd,
        tournamentAddress: $scope.masterData.tournamentAddress,
        base_url: $scope.masterData.base_url
  		});

      $scope.masterData = {};
      $scope.edittingMode = false;
    }

    $scope.remove = function(masterData){
      $scope.masterDataList.$remove(masterData);
    }

    $scope.clear = function(){
      $scope.masterData = {};

      $scope.edittingMode = false;
    }

    $scope.open = function(masterData){
      switch($scope.selectedMasterData){
        case 'tournaments':
          $scope.selectedMasterData = 'rounds';
          $scope.navigation[0].selected = masterData;
          refMasterData.rounds = refMasterData.tournaments.child($scope.navigation[0].selected.$id).child("rounds");
          $scope.navigation.push({name: 'rounds'});
          $scope.refresh();
          $scope.backButtonDisabled = 'false';
          $scope.tournamentMode = false;
          break;
        case 'rounds':

          break;

      }
    }

    $scope.back = function(){
      switch($scope.selectedMasterData){
        case 'tournaments':
          $scope.backButtonDisabled = 'true';
          break;
        case 'rounds':
          $scope.navigation.pop();
          $scope.navigation[0].selected = {};
          $scope.selectedMasterData = 'tournaments';
          $scope.refresh();
          $scope.tournamentMode = true;
          refMasterData.rounds = null;
          break;
      }
    }

    $scope.parseDate = function(code){
      var date = new Date(code);
      return moment(code).format("MMMM Do YYYY");
    }

    $scope.togglePublish = function(id, publishStatus){
      var ref = refMasterData.rounds.child(id);
      ref.update({
  			publish: publishStatus
  		});



    }





    $scope.refresh();


  }]);

'use strict';

/**
 * @ngdoc function
 * @name firebaseApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the firebaseApp
 */
angular.module('firebaseApp')
  .controller('HomeCtrl', ['$scope', '$window', '$mdToast', '$firebaseArray', 'firebaseurl', function ($scope, $window, $mdToast, $firebaseArray, firebaseurl) {

    firebase.auth().onAuthStateChanged(function(user) {
      console.log(user + ' in state changed');
      if (!user) {
        $window.location.href = '/extraclass2';
      }
    });
    
    $scope.logOut = function(){
      firebase.auth().signOut().then(function() {
        // Sign-out successful.
      }, function(error) {
        // An error happened.
      });

    };


  }]);

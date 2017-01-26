'use strict';

/**
 * @ngdoc function
 * @name firebaseApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the firebaseApp
 */
angular.module('firebaseApp')
  .controller('LoginCtrl', ['$scope', '$window', '$mdToast', 'firebaseurl', function ($scope, $window, $mdToast, firebaseurl) {

    var showMessage = function(message) {
      $mdToast.show(
        $mdToast.simple()
          .textContent(message)
          .hideDelay(1500)
      );
    }

    var verifyAdmin = function(user) {
      if(user && user.uid){
        var admin = firebase.database().ref('/admin');

        firebase.database().ref('/admin').once('value').then(function(snapshot) {
          if(user.uid == snapshot.val()){
            $window.location.href = 'jade-views/home.html';
          } else {
            showMessage("Authentication Failed");
          }
        });
      } else {
         showMessage("Authentication Failed");
      }
    };

    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        // User is signed in.
        //go ahead
        verifyAdmin(user);
      } else {
        // No user is signed in.
        //do nothing

      }
    });

    var user = firebase.auth().currentUser;

    if (user) {
      // User is signed in.
      //go ahead
      verifyAdmin(user);
    } else {
      // No user is signed in.
      //do nothing
    }



    $scope.user = {};


    $scope.login = function(){
      firebase.auth().signInWithEmailAndPassword($scope.user.email, $scope.user.password).catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;

        if (errorCode === 'auth/wrong-password') {
            showMessage("Wrong Password");
        } else {
          showMessage(errorMessage);
        }
        console.log(error);

      });
    }

  }]);

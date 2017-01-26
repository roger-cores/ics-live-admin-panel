'use strict';

/**
 * @ngdoc function
 * @name firebaseApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the firebaseApp
 */
angular.module('firebaseApp')
  .controller('UsersCtrl', ['$http', '$scope', '$window', '$mdToast', '$firebaseArray', 'firebaseurl', function ($http, $scope, $window, $mdToast, $firebaseArray, firebaseurl) {

    var currentUser;
    firebase.auth().onAuthStateChanged(function(user) {
      console.log(user + ' in state changed');
      if(user) currentUser = user;
    });

    var config = {apiKey: "AIzaSyAFc8Txiyfss_T8jM8JmMimxjIQfwmpvK8",
        authDomain: "extraclass-ii.firebaseapp.com",
        databaseURL: "https://extraclass-ii.firebaseio.com",
        storageBucket: "extraclass-ii.appspot.com",
        messagingSenderId: "1091289016534"};
    var secondaryApp = firebase.initializeApp(config, "Secondary");

    var showMessage = function(message) {
      $mdToast.show(
        $mdToast.simple()
          .textContent(message)
          .hideDelay(1500)
      );
    }

    var database = firebase.database();


    var refUsers = database.ref('/users');
    $scope.user = {};
    $scope.users = $firebaseArray(refUsers);
    $scope.unblocked = 'unblocked';

    $scope.clear = function(){
      $scope.user = {};
    }

    $scope.block = function(id, blocked){
      var refUser = database.ref('/users/' + id);
      refUser.update({
  			blocked: blocked
  		});



    }

    $scope.seeKey = function(user){

      $http.post("/extraclass2/registerUser.php", {"uid": user.uid}).success(function(response){
        console.log(response);
        $http.post("/extraclass2/key.php", {"adminUid": currentUser.uid, "uid": user.uid}).success(function(response){
          user.pkey = response.result;
          console.log(response);
        });
      });

    }

    $scope.mailKey = function(user){

      if(!user.pkey){
        $http.post("/extraclass2/registerUser.php", {"uid": user.uid}).success(function(response){
          console.log(response);
          $http.post("/extraclass2/key.php", {"adminUid": currentUser.uid, "uid": user.uid}).success(function(response){
            user.pkey = response.result;
            console.log(response);

            var subject = "Product Key for Avadhut";
            var message = "You recently bought Avadhut from LearningLinks. Please activate your app with this key: " + user.pkey;
            $window.open("mailto:"+ user.email +"?subject=" + subject+"&body="+message,"_self");
          });
        });
      } else {
        var subject = "Product Key for Avadhut";
        var message = "You recently bought Avadhut from LearningLinks. Please activate your app with this key: " + user.pkey;
        $window.open("mailto:"+ user.email +"?subject=" + subject+"&body="+message,"_self");
      }


    }

    $scope.copyKeyToClipboard = function(key){

    }


    $scope.add = function(){




      secondaryApp.auth().createUserWithEmailAndPassword($scope.user.email, $scope.user.password).then(function(firebaseUser) {
          console.log("User " + firebaseUser.uid + " created successfully!");
          var userRef = firebase.database().ref('/users').push();
          var userObj = {
            activated: false,
            blocked: false,
            email: $scope.user.email,
            fullName: 'User',
            time: 1478529208680,
            uid: firebaseUser.uid
          };
          userRef.set(userObj);
          secondaryApp.auth().signOut();
          $scope.user = {};
      }).catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;

          if(errorCode  === 'auth/email-already-in-use'){
            showMessage("Email is already taken");
          } else if(errorCode === 'auth/invalid-email'){
            showMessage("Invalid Email Address");
          } else if(errorCode === 'auth/weak-password'){
            showMessage("Password should be at least 6 characters long");
          }

        });




    }

    $scope.refreshKey = function(user){
      if(!user.keyUsed){
        $mdToast.show(
          $mdToast.simple()
            .textContent('This key isn\'t used yet')
            .hideDelay(3000)
        );
      } else {
        var refUser = new Firebase(firebaseurl + "/users/"+user.$id);
        refUser.update({
    			keyUsed: false
    		});
      }

    }



  }]);

'use strict';

/**
 * @ngdoc overview
 * @name firebaseApp
 * @description
 * # firebaseApp
 *
 * Main module of the application.
 */
var app = angular
  .module('firebaseApp', [
    'ngAnimate',
    'ngMaterial',
    'ngMessages',
    'firebase',
    'angularFileUpload',
    'ngclipboard'
  ]);
app.constant('firebaseurl', 'https://ics-live.firebaseio.com');
app.directive('onReadFile', function ($parse) {
return {
  restrict: 'A',
  scope: false,
  link: function(scope, element, attrs) {
          var fn = $parse(attrs.onReadFile);

    element.on('change', function(onChangeEvent) {
      var reader = new FileReader();

      reader.onload = function(onLoadEvent) {
        scope.$apply(function() {
          fn(scope, {$fileContent:onLoadEvent.target.result});
        });
      };

      reader.readAsText((onChangeEvent.srcElement || onChangeEvent.target).files[0]);
    });
  }
};
});

app.directive('customOnChange', function() {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var onChangeHandler = scope.$eval(attrs.customOnChange);
      element.bind('change', onChangeHandler);
    }
  };
});

var config = {
  apiKey: "AIzaSyAQJaibXA510_Vb4qaDiXl8Me7fT5_9I_c",
  authDomain: "ics-live.firebaseio.com",
  databaseURL: "https://ics-live.firebaseio.com",
  storageBucket: "ics-live.appspot.com"
};
firebase.initializeApp(config);

'use strict';

angular.module('colorOrganizerApp')
  .controller('MainCtrl', ['$scope', 'Colors', function ($scope, Colors) {
    $scope.colorSets = [
      { 'id': 0, 'name': 'Common','file': 'colors.less' },
      { 'id': 1, 'name': 'CHE', 'file': 'colors-che.less' },
      { 'id': 2, 'name': 'COP', 'file': 'colors-cop.less' }
    ];
    $scope.active = $scope.colorSets[0];
    $scope.manualStyle = '#fff';

    $scope.elements = Colors.get($scope.colorSets[0].file);
    $scope.elements.then(function(elements) {
    	$scope.elements = elements;
    }, function(status) {
    	console.log(status);
    });

    // Eventually
    // $scope.styles = $scope.getStyles();

    // $scope.getStyles = function() {
    // 	return;
    // }

    $scope.switchView = function(set) {
    	console.log('in switch');
      $scope.active = $scope.colorSets[set];
      $scope.elements = Colors.get($scope.colorSets[set].file);

      $scope.elements.then(function(elements) {
      	$scope.elements = elements;
      }, function(status) {
      	console.log(status);
      });
    };
    
    $scope.setClass = function(bool) {
    	return bool ? 'btn-primary' : '';
    }
  }]);

'use strict';

angular.module('colorOrganizerApp')
  .controller('MainCtrl', ['$scope', 'Colors', function ($scope, Colors) {
    $scope.colorSets = [
      { 'name': 'Common','file': 'colors.less' },
      { 'name': 'CHE', 'file': 'colors-che.less' },
      { 'name': 'COP', 'file': 'colors-cop.less' }
    ];
    $scope.active = $scope.colorSets[0].name;
    $scope.manualStyle = '#fff';

    $scope.elements = Colors.get($scope.colorSets[0].file);
    $scope.elements.then(function(elements) {
    	$scope.elements = elements;
    }, function(status) {
    	console.log(status);
    });

    $scope.switchView = function(set) {
      $scope.active = $scope.colorSets[set].name;
      $scope.elements = Colors.get($scope.colorSets[set].file);
    }
  }]);

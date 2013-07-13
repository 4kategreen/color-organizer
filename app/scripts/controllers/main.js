'use strict';

angular.module('colorOrganizerApp')
  .controller('MainCtrl', ['$scope', 'Colors', function ($scope, Colors) {
    $scope.elements = Colors.get();
    $scope.manualStyle = '#ffffff';

    $scope.a = false;
    $scope.b = false;
  }]);

'use strict';

angular.module('colorOrganizerApp')
  .controller('MainCtrl', ['$scope', 'Colors', function ($scope, Colors) {
    $scope.colors = Colors.dummy();
    $scope.manualStyle = '#ffffff';

    $scope.a = false;
    $scope.b = false;
  }]);

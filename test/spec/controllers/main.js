'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('colorOrganizerApp'));

  var MainCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MainCtrl = $controller('MainCtrl', {
      $scope: scope
    });
  }));

  it('gets a valid object from Color', function() {
    expect(scope.colors).toEqual(jasmine.any(Object));
  });
});

'use strict';

describe('Controller: MainCtrl', function () {
  var $httpBackend,
      elements = '// Global values\n// main variables for the site\n// --------------------------------------------------\n@primary:                   #36434c;\n@secondary:                 #edf7ff;\n@tertiary:                  #B6CBD9;\n@base-color :               @primary;\n@heading-color:             #36434d;\n@secondary-heading-color:   #0088cc;';

  // load the controller's module
  beforeEach(module('colorOrganizerApp'));

  var MainCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $injector) {
    $httpBackend = $injector.get('$httpBackend');
    $httpBackend.when('GET', 'styles/colors.less').respond(elements);

    $httpBackend.expectGET('styles/colors.less');

    scope = $rootScope.$new();
    MainCtrl = $controller('MainCtrl', {
      $scope: scope
    });

    $httpBackend.flush();
  }));

  xit('gets a valid object from Color', function() {
    expect(scope.colors).toEqual(jasmine.any(Object));
  });
});

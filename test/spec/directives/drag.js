'use strict';

describe('Directive: drag', function () {
  beforeEach(module('colorOrganizerApp'));

  var element;

  xit('should make hidden element visible', inject(function ($rootScope, $compile) {
    element = angular.element('<drag></drag>');
    element = $compile(element)($rootScope);
    expect(element.text()).toBe('this is the drag directive');
  }));
});

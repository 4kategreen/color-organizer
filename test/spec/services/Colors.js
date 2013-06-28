'use strict';

describe('Service: Colors', function () {

  // load the service's module
  beforeEach(module('colorOrganizerApp'));

  // instantiate service
  var Colors;
  beforeEach(inject(function (_Colors_) {
    Colors = _Colors_;
  }));

  it('should return an object', function () {
    expect(Colors.get()).toEqual(jasmine.any(Object));
  });

  it('should return an object where all colors have a color (not just a link)', function() {
    var colors = Colors.get();
    var hasColor = true;

    var testColors = function(colors) {
      angular.forEach(colors, function(group) {
        angular.forEach(group.colors, function(colors) {
          if (!colors.color) {
            return false;
          }
        });
      });
      // there was no false
      return true;
    };

    expect(testColors(colors)).toBe(true);
  });

});

'use strict';

describe('Service: Colors', function () {
  var $httpBackend,
      Colors,
      elements = "// Global values\n// main variables for the site\n// --------------------------------------------------\n@primary:                   #36434c;\n@secondary:                 #edf7ff;\n@tertiary:                  #B6CBD9;\n@base-color :               @primary;\n@heading-color:             #36434d;\n@secondary-heading-color:   #0088cc;\n\n";

  // load the service's module
  beforeEach(module('colorOrganizerApp'));

  // instantiate service
  beforeEach(inject(function (_Colors_,$injector) {
    Colors = _Colors_;

    $httpBackend = $injector.get('$httpBackend');
    $httpBackend.whenGET('styles/colors.less').respond(elements);
  }));

  afterEach(function() {
   $httpBackend.verifyNoOutstandingExpectation();
   $httpBackend.verifyNoOutstandingRequest();
  });


  it('should return an object', function () {
    $httpBackend.expectGET('styles/colors.less');
    var colors = {},
        q = Colors.get('colors.less');

    q.then(function(ele) {
      colors = ele;
    }, function(s) { console.log(s); });

    $httpBackend.flush();

    expect(colors).toEqual(jasmine.any(Array));
    //expect(colors).toEqual(elements);
  });

  xit('should return an object where all colors have a color (not just a link)', function() {
    var colors = Colors.get('colors.less'),
        hasColor = true;

    $httpBackend.flush();

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


  xit('parses blank lines so that it starts a new group of variables', function() {
    var colors = Colors.get();

    $httpBackend.flush();

    expect(colors.length).toBe(2);
  });


  xit('parses comments correctly.', function() {
    // first comment is put in the element's name

    // second comment is added to that group's comment.
  });

  xit('parses a color and places it in the correct spot: colorList[n].colors', function() {

  });


  xit('parses a color link and finds the link and adds both the link and color', function() {

  });
});

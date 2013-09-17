'use strict';

describe('Service: Colors', function () {
  var $httpBackend,
      Colors,
      singleGroup = "// Global values\n// --------------------------------------------------\n// main variables for the site\n@primary:                   #36434c;\n@secondary:                 #edf7ff;\n@tertiary:                  #B6CBD9;\n@base-color :               @primary;\n@heading-color:             #36434d;\n@secondary-heading-color:   #0088cc;",
      doubleGroup = "// Global values\n// --------------------------------------------------\n// main variables for the site\n@primary:                   #36434c;\n@secondary:                 #edf7ff;\n\n// Second One\n@tertiary:                  #B6CBD9;\n@base-color :               @primary;\n@heading-color:             #36434d;\n@secondary-heading-color:   #0088cc;",
      doubleComment = "// Global values\n// --------------------------------------------------\n// first comment\n// second comment\n@primary:                   #36434c;\n@secondary:                 #edf7ff;";

  // load the service's module
  beforeEach(module('colorOrganizerApp'));

  // instantiate service
  beforeEach(inject(function (_Colors_,$injector) {
    Colors = _Colors_;

    $httpBackend = $injector.get('$httpBackend');
    $httpBackend.whenGET('styles/colors.less').respond(singleGroup);
    $httpBackend.whenGET('styles/double.less').respond(doubleGroup);
    $httpBackend.whenGET('styles/double-comment.less').respond(doubleComment);
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

    expect(colors.length).toEqual(1);
  });


  it('should return an object where all colors have a color (not just a link)', function() {
    var colors = {},
        q = Colors.get('colors.less');

    q.then(function(ele) {
      colors = ele;
    }, function(s) { console.log(s); });

    $httpBackend.flush();

    var testColors = function(colors) {
      angular.forEach(colors, function(group) {
        angular.forEach(group.variables, function(vars) {
          if (vars.valueType === 'link') {
            if (!vars.value.match(/^\#[0-9A-F]{3,6}/i) && !vars.value.match(/^rgb/i)) {
              return false;
            }
          }
        });
      });
      // there was no false
      return true;
    };

    expect(testColors(colors)).toBe(true);
  });


  it('parses comments correctly.', function() {
    var colors = {},
        q = Colors.get('colors.less');

    q.then(function(ele) {
      colors = ele;
    }, function(s) { console.log(s); });

    $httpBackend.flush();

    // first comment is put in the element's name
    expect(colors[0].section).toBe('Global values');

    // second comment is added to that group's comment.
    expect(colors[0].comments[0]).toBe('main variables for the site');
  });
  

  it('deals with multiple comments by adding it to the end of the comment field', function() {
    var colors = {},
        q = Colors.get('double-comment.less');

    q.then(function(ele) {
      colors = ele;
    }, function(s) { console.log(s); });

    $httpBackend.flush();

    expect(colors[0].comments[0]).toBe('first comment');
    expect(colors[0].comments[1]).toBe('second comment');
  })


  xit('parses a color link and finds the link and adds both the link and color', function() {
    // if color.link, then make sure color.color is the same as the hex for color.link's color.
  });

  // Deals with sizes in a non-sucky way.

  // This is a lot of stuff.
});

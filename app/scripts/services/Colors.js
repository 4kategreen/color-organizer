'use strict';

angular.module('colorOrganizerApp')
  .service('Colors', function Colors() {
    /**
      Parses any variable links to get the real color.
    */
    var parseLinks = function(testColor, colorList) {
      var selectedColor = false;

      angular.forEach(colorList, function(color) {
        if (testColor === color[0]) {
          selectedColor = color[1];
        }
      });

      return selectedColor || 'No Color Found';
    };

    /**
      Takes all colors from a parsed list and makes one single list to test against.
    */
    var createColorList = function(colors) {
      var colorList = [];

      angular.forEach(colors, function(group) {
        angular.forEach(group.colors, function(color) {
          if (color.color) {
            colorList.push([color.name, color.color]);
          }
        });
      });

      return colorList;
    };

    return {
      get: function() {
        var colorList = {};
        var colors = [{
          'name': 'Global Values',
          'comment' : 'About this Group',
          'colors' : [{
            'name': 'primary',
            'color': '#36434c'
          }, {
            'name': 'secondary',
            'color': '#edf7ff'
          }, {
            'name': 'tertiary',
            'color': '#b6cbd9'
          }]
        }, {
          'name': 'Major Roles',
          'comment': 'Assign colors to variable roles',
          'colors': [{
            'name': 'base-color',
            'link': 'primary'
          }, {
            'name': 'heading-color',
            'color': '#36434d'
          }, {
            'name': 'seconary-heading-color',
            'color': '#0088cc'
          }]
        }, {
          'name': 'Grays',
          'colors': [{
            'name': 'chronGrayLight',
            'color': '#f7f5f2'
          }, {
            'name': 'chronGray',
            'color': '#e6e4e1'
          }, {
            'name': 'chronGrayDark',
            'color': '#3a3a3a'
          }]
        }, {
          'name': 'Primary Colors',
          'colors': [{
            'name': 'white',
            'color': '#ffffff'
          }]
        }, {
          'name': 'Scaffolding',
          'colors': [{
            'name': 'bodyBackground',
            'link': 'white'
          }, {
            'name': 'textColor',
            'link': 'chronGrayDark'
          }, {
            'name': 'footer',
            'color': '#004573'
          }]
        }];

        colorList = createColorList(colors);

        angular.forEach(colors, function(group) {
          angular.forEach(group.colors, function(colors) {
            if (colors.link) {
              colors.color = parseLinks(colors.link, colorList);
            }
          });
        });
        return colors;
      }
    };
  });
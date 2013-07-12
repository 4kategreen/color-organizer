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
      dummy: function() {
        var colorList = {};
        var colors = [{
          'name': 'Global Values',
          'comment' : 'About this Group',
          'colors' : [{
            'name': 'primary',
            'color': '#36434c',
            'type': 'background'
          }, {
            'name': 'secondary',
            'color': '#edf7ff',
            'type': 'background'
          }, {
            'name': 'tertiary',
            'color': '#b6cbd9',
            'type': 'background'
          }]
        }, {
          'name': 'Major Roles',
          'comment': 'Assign colors to variable roles',
          'colors': [{
            'name': 'base-color',
            'link': 'primary',
            'type': 'background'
          }, {
            'name': 'heading-color',
            'color': '#36434d',
            'type': 'text'
          }, {
            'name': 'seconary-heading-color',
            'color': '#0088cc',
            'type': 'text'
          }]
        }, {
          'name': 'Grays',
          'colors': [{
            'name': 'chronGrayLight',
            'color': '#f7f5f2',
            'type': ['background','type']
          }, {
            'name': 'chronGray',
            'color': '#e6e4e1',
            'type': ['background','type']
          }, {
            'name': 'chronGrayDark',
            'color': '#3a3a3a',
            'type': ['background','type']
          }]
        }, {
          'name': 'Primary Colors',
          'colors': [{
            'name': 'white',
            'color': '#ffffff',
            'type': 'background'
          }]
        }, {
          'name': 'Scaffolding',
          'colors': [{
            'name': 'bodyBackground',
            'link': 'white',
            'type': 'background'
          }, {
            'name': 'textColor',
            'link': 'chronGrayDark',
            'type': 'type'
          }, {
            'name': 'footer',
            'color': '#004573',
            'type': 'background'
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
      },
      get: {
        // open file

        // scrape each line

        // insert into json
      }
    };
  });
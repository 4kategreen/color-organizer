'use strict';

angular.module('colorOrganizerApp')
  .service('Colors', ['$http', function ($http) {
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
        var elements = [{
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

        colorList = createColorList(elements);

        angular.forEach(elements, function(group) {
          angular.forEach(group.colors, function(colors) {
            if (colors.link) {
              colors.color = parseLinks(colors.link, colorList);
            }
          });
        });
        return elements;
      },
      get: function() {
        var elements = [],
            colorList = [],
            holder = {
              colors: [],
              sizes: []
            },
            variable = /^(@.+):\s+([#@\w\/]+);/gi,
            lineComment = /^(\/\/)\s(.+)/g;

        // open file
        $http.get('styles/colors.less').success(function(data) {
        // scrape each line
          var lines = data.split('\n');

          angular.forEach(lines, function(line) {
            var comment = lineComment.exec(line),
                ele = variable.exec(line);

            // get comments
            if (comment) {

              console.log(comment[2]);
              if (holder.name === undefined) {
                holder.name = comment[2];
              } else {
                holder.comment = comment[2];
              }

            } else if (ele) {

              // get variables
              var value = ele[2],
                  elementInfo = {
                    name: ele[1]
                  };

              if (/[\@\#]/g.exec(value[0])) {
                elementInfo.type = 'color';
                if (value[0] === '#') {
                  elementInfo.color = value;
                } else {
                  elementInfo.link = value;
                }

                holder.colors.push(elementInfo);
              // TODO
              } else if (/px/.exec(value[0])) {
                elementInfo.type = 'size';
                elementInfo.value = value;

                holder.sizes.push(elementInfo);
              }

            // get empty line/reset
            } else if (line.length === 0) {

              console.log('empty line');
              console.log(holder);
              // if there's stuff in the holder, push it to colors. otherwise, skip over.
              if (holder.name !== undefined) {
                elements.push(holder);
                holder = { colors: [], sizes: [] };
              }

            } else { console.log('does not match: '+line); }
          });
        });

        colorList = createColorList(elements);

        angular.forEach(elements, function(group) {
          angular.forEach(group.colors, function(colors) {
            if (colors.link) {
              // TODO
              colors.color = parseLinks(colors.link, colorList);
            }
          });
        });

        return elements;
      }
    };
  }]);
'use strict';

angular.module('colorOrganizerApp')
  .service('Colors', ['$http', '$q', function ($http, $q) {
    var methods = {
      parseLines: function(lines) {
        var variables = [],
            result;

        var comment = /^(\/{2})\s*(.+)/i,
            sectionComment = /^(\/{2})\s*(-+)/i,
            element = /^(@.+):\s+(.+);\s*\/{0,2}\s*(.*)/i;

        angular.forEach(lines, function(line, key) {
          // SKIP // ------- lines
          if (!line.match(sectionComment)) {
            // COMMENT
            result = line.match(comment);
            if (result) {
              if (sectionComment.exec(lines[key+1])) {
                variables.push({
                  'type': 'section',
                  'value': result[2]
                });
              } else {
                variables.push({
                  'type': 'comment',
                  'value': result[2]
                });
              }
            }

            // VARIABLES
            result = line.match(element);
            if (result) {
              variables.push({
                'type': 'variable',
                'name': result[1],
                'value': result[2],
                'comment': result[3]
              });
            }
          }
        });

        return methods.organize(variables);
      },
      organize: function(vars) {
        var variables = [], 
            holder = {};

        angular.forEach(vars, function(line) {
          switch (line.type) {
            case 'section':
              if (holder.section) {
                variables.push(holder);
                holder = {};
              }

              holder.section = line.value;
              holder.comments = [];
              holder.variables = [];
              break;
            case 'comment':
              holder.comments.push(line.value);
              break;
            case 'variable':
            default:
              holder.variables.push(line);
          }
        });

        if (holder.length > 0) {
          variables.push(holder);
          holder = {};
        }

        return variables;
      },
      /**
        Parses any variable links to get the real color.
      */
      parseLinks: function(testColor, colorList) {
        var selectedColor = false;

        angular.forEach(colorList, function(color) {
          if (testColor === color[0]) {
            selectedColor = color[1];
          }
        });

        return selectedColor || 'No Color Found';
      },

      /**
        Takes all vars from a parsed list and makes one single list to test against.

        Colors is default
      */
      createVariableList: function(vars, type) {
        var colorList = [];

        angular.forEach(vars, function(group) {
          if (type === 'size') {
            angular.forEach(group.sizes, function(size) {
              colorList.push([size.name, size.size]);
            });
          } else {
            angular.forEach(group.colors, function(color) {
              if (color.color) {
                colorList.push([color.name, color.color]);
              }
            });
          }
        });

        return colorList;
      }
    };

    return {
      get: function (file) {
        var q = $q.defer(),
            elements;

        $http.get('styles/'+file).success(function(data) {
          var lines = data.split('\n');

          elements = methods.parseLines(lines);

          q.resolve(elements);
        });

        return q.promise;
      }
    };
  }]);
'use strict';

angular.module('colorOrganizerApp')
  .service('Colors', ['$http', '$q', function ($http, $q) {
    var methods = {
      parseLines: function(lines) {
        var variables = [],
            result, valueType;

        var comment = /^(\/{2})\s*(.+)/i,
            sectionComment = /^(\/{2})\s*(-+)/i,
            element = /^(@.+):\s+(.+);\s*\/{0,2}\s*(.*)/i;

        angular.forEach(lines, function(line, key) {
          // SKIP // ------- lines
          if (!line.match(sectionComment)) {
            // COMMENT
            result = line.match(comment);
            if (result) {
              if (lines[key+1].match(sectionComment)) {
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
              value = methods.findLinks(result[2]);
              valueType = methods.getValueType(result[2]);

              variables.push({
                'type': 'variable',
                'name': result[1],
                'valueType': valueType,
                'value': result[2],
                'comment': result[3]
              });
            }
          }
        });

        return methods.organize(variables);
      },
      organize: function(lines) {
        var variables = [], 
            holder = {
              comments: [],
              variables: []
            };

        angular.forEach(lines, function(line) {
          switch (line.type) {
            case 'section':
              if (holder.section || holder.comments.length>0 || holder.variables.length>0) {
                variables.push(holder);
                holder = {
                  comments: [],
                  variables: []
                };
              }

              holder.section = line.value;
              break;
            case 'comment':
              holder.comments.push(line.value);
              break;
            case 'variable':
            default:
              if (line.valueType === 'link') {
                line.link = line.value;
                line.value = methods.parseLinks(line.link, lines);
              }
              holder.variables.push(line);
          }
        });

        if (holder.section) {
          variables.push(holder);
        }

        return variables;
      },
      getValueType: function(variable) { // use less parser here?
        // colors have #, rgb, rgba, hsl
        var type = 'unknown',
            hex = /^\#[0-9A-F]{3,6}/i,
            rgb = /^rgb/i;

        if (variable.match(hex) || variable.match(rgb)) {
          type = 'color';
        }

        // math has +,-,*,/

        // js functions exist

        // color math (lift from less?)


        return type;
      },
      findLinks: function(variable) {
        var link = /(\@a-z\-+)\s/i;
      },
      /**
        Parses any variable links to get the real color.

        Gotta be a more efficient way than always looping.
      */
      parseLinks: function(testColor, list) {
        var selected = false,
            i = 0;

        for (i=0;i<list.length;i++) {
          if (list[i] && list[i].type === 'variable') {
            if (list[i].name === testColor) {
              selected = list[i].value;
              break;
            }
          }
        }

        return selected || 'No Color Found';
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
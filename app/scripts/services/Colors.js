'use strict';

angular.module('colorOrganizerApp')
  .service('Colors', ['$http', '$q', function ($http, $q) {
    var variables = [];

    var methods = {
      parseLines: function(lines) {
        var result, value, rawValue, valueType;

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
              rawValue = methods.trim(result[2]);
              value = methods.findLinks(rawValue);
              valueType = methods.getValueType(value);

              variables.push({
                'type': 'variable',
                'name': methods.trim(result[1]),
                'valueType': valueType,
                'rawValue': rawValue,
                'value': value,
                'link': !(value === rawValue),
                'comment': methods.trim(result[3])
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
        var result,
            link,
            value = variable,
            linkExp = /@[\-\w]+/gi;

        while ((result = linkExp.exec(variable)) !== null) {
          // parse link
          link = methods.parseLinks(result[0], variables);

          // switch out link for variable
          value = value.replace(result,link);
        }

        return value;
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
      },
      trim: function(str) {
        return (str || '').replace(/^\s+|\s+$/g, '');
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
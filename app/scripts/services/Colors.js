'use strict';

angular.module('colorOrganizerApp')
  .service('Colors', ['$http', '$q', function ($http, $q) {
    var methods = {
      parseLines: function(lines) {
        var variables = [];

        var comment = /^(\/{2})\s+(.+)/gi,
            sectionComment = /^(\/{2})\s+(-+)/gi,
            ele = /^(@.+):\s+(.+);\s*\/{0,2}\s*(.*)/gi;

        angular.forEach(lines, function(line) {
          // comments and sections
          if (comment.exec(line)) {
            if (sectionComment.exec(line)) {
              variables.push({
                'type': 'section',
                'value': line
              });
            } else {
              variables.push({
                'type': 'comment',
                'value': line
              });
            }
          }

          // element
        });
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
      get: function(file) {
        var deferred = $q.defer(),
            elements = [],
            colorList = [],
            mathHolder = [], // for later calculations
            holder = {
              colors: [],
              sizes: []
            };

        // open file
        $http.get('styles/'+file).success(function(data) {
          var lines = data.split('\n');

          angular.forEach(lines, function(line, key) {
            var comment = /^(\/{2})\s+(.+)/gi.exec(line),
                ele = /^(@.+):\s+(.+);\s*\/{0,2}\s*(.*)/gi.exec(line);

            // get comments
            if (comment) {

              //parseComment(comment[2], holder);

              if (holder.name === undefined) {
                holder.name = comment[2];
              } else {

                // if this isn't isn't a line separator comment
                // multiple comments: this needs to be better!
                if (!/\-+/.exec(comment[2])) {
                  if (!holder.comment) {
                    holder.comment = comment[2];
                  } else {
                    holder.comment+= ' '+comment[2];
                  }
                }
              }
            // end comment

            // get elements
            } else if (ele) {

              // get variables
              var value = ele[2],
                  elementInfo = {
                    name: ele[1],
                    comment: ele[3]
                  };

              // math
              if (/\s[\+\-\/\*]\s/.exec(value)) {
                mathHolder.push(ele);
              // color
              } else if (/[\@\#]/g.exec(value[0])) {
                elementInfo.type = 'color';
                if (value[0] === '#') {
                  elementInfo.color = value;
                } else {
                  elementInfo.link = value;
                }

                holder.colors.push(elementInfo);

              } else if (/px/.exec(value)) {
                var sizeType = /.+(\/{2})\s+(.+)/gi.exec(line);

                elementInfo.type = ele[1];
                elementInfo.style = sizeType[2];
                elementInfo.value = value;

                holder.sizes.push(elementInfo);
              //TODO: color math, pixels, other math
              //} else if (/[darken|lighten|spin]/.exec(value)) {
                //holder.color = 'color math: '+value;
              } else {
                console.log(value);
              }

              // do maths. assumptions: 
                // all variables have been declared before this one
                // all maths are for lengths
                // two elements, please. for now.
              angular.forEach(mathHolder, function(ele){
                var mathInfo = {},
                    sizes = methods.createVariableList(elements, 'size'),
                    calc = /(.+)\s+([\+\-\*\/])\s+(.+)/.exec(ele[2]);

                mathInfo.name = ele[1];
                holder.sizes.push(mathInfo);
              });
              mathHolder = [];
            // end elements

            // get empty line/reset
            } else if (line.length === 0) {

              // if there's stuff in the holder, push it to colors. otherwise, skip over.
              if (holder.name !== undefined) {
                elements.push(holder);
                holder = { colors: [], sizes: [] };
              }
            }
          }); // end parse lines

          // if there's anything left in the holder, put it in elements
          if (holder.name !== undefined) {
            elements.push(holder);
            holder = { colors: [], sizes: [] };
          }

          // do linking
          colorList = methods.createVariableList(elements);

          angular.forEach(elements, function(group) {
            angular.forEach(group.colors, function(colors) {
              if (colors.link) {
                colors.color = methods.parseLinks(colors.link, colorList);
              }
            });
          }); // end linking

          // all the processing is done.
          deferred.resolve(elements);
        });

        return deferred.promise;
      }
    };
  }]);
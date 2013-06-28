'use strict';

angular.module('colorOrganizerApp')
  .service('Colors', function Colors() {
    return {
      get: function() {
        var colors = [{
          "name": "Global Values",
          "comment" : "About this Group",
          "colors" : [{
            "name": "primary",
            "color": "#36434c"
          }, {
            "name": "secondary",
            "color": "#edf7ff"
          }, {
            "name": "tertiary",
            "color": "#b6cbd9"
          }]
        }, {
          "name": "Major Roles",
          "comment": "Assign colors to variable roles",
          "colors": [{
            "name": "base-color",
            "color": "primary"
          }, {
            "name": "heading-color",
            "color": "#36434d"
          }, {
            "name": "seconary-heading-color",
            "color": "#0088cc"
          }]
        }, {
          "name": "Grays",
          "colors": [{
            "name": "chronGrayLight",
            "color": "#f7f5f2"
          }, {
            "name": "chronGray",
            "color": "#e6e4e1"
          }, {
            "name": "chronGrayDark",
            "color": "#3a3a3a"
          }]
        }, {
          "name": "Primary Colors",
          "colors": [{
            "name": "white",
            "color": "#ffffff"
          }]
        }, {
          "name": "Scaffolding",
          "colors": [{
            "name": "bodyBackground",
            "color": "white"
          }, {
            "name": "textColor",
            "color": "chronGrayDark"
          }, {
            "name": "footer",
            "color": "#004573"
          }]
        }];

        // parse other colors to the right ones. does this belong here?
        return colors;
      }
    }
  });

$(document).ready(function () {
    var date = new Date();
    console.log("Here we go at " + date.toTimeString());

    $.get('http://localhost/color-organizer/colors.txt', function(data) {
      parse_colors(data);
    });

    function colorGrouping()
    {
      this.name = "";
      this.comment = "";
      this.colors = [];
    }

    function colorData(name, color) {
      this.name = name;
      this.color = color;
    };

    function parse_colors(data)
    {
      //var comment_regex = new RegExp("//\w+", "g");
      var comment_regex = new RegExp("\/\/.\w+.+", "g");

      // var color_name_regex = new RegExp("\@\S+", "g");
      // var color_value_regex = new RegExp("", "g");

      var last_comment = 0;

      $.each(data.split('\n'), function(key, value) { 

        if (value.startsWith("//")) {
          //we have a comment
          if (match = value.match(comment_regex));
          {
            console.log("Here is an actual comment: " + value);
            last_comment = key;
          }
        } else {
          //we either have an empty line or a color definition 
          if (value.length != 0) //ignore empty lines(hopefully)
          {
            //attempt to split each line on colon
            var line_segments = value.split(':', 2);

            if (line_segments.length != 1) //if for some reason we can't split on this line, ignore it
            { 
              var before = line_segments[0], after = line_segments[1];
              //console.log("Here is the before: " + before + " and the after: " + after);
            }
          }
        }

        

          // if (matched = value.match(comment_regex)) { //we've found a comment
          //   color_data[key] =  { 'comment': matched, 'color_name' : '', 'color_value' : '' }; 
          //   last_comment = key;
          // }

        // ^(@[\w\-\_]+)|((#.+)|(@[\w\-\_]+))
        //
        // //.\w+.+

      });

      //console.log(color_data);
    }
  }
);
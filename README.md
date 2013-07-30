Color Organizer
===

This application will take your site's LESS or Sass variable set and create a page of colors to view and work with.

Right now, it parses colors and variables marked as colors. It makes an attempt at sizes (only pixels just yet), but it's not working right.

Install Instructions
---
I haven't tested this yet, but I think this should work.

1. Make sure node and npm are installed for your OS.
2. Install bower lobally (`npm install -g bower`)
3. Clone the repo where you want.
4. Type npm install
5. Type bower install

TODO
---

In the future, I'd like to:
- create ways to parse LESS and Sass color math.
- parse and display ems and other font sizes.
- show types of variables in combination with each other (say, link colors on top of background)
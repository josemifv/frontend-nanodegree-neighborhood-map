## Project 5 - Front-End Web Developer Nanodegree (Neighborhood Map)
This project contains the source code of the implementation of the Fifth project assigment from Udacity's Front-end Web Developer Nanodegree: Neighborhood map.

The project consists of developing a single-page application featuring a map of your neighborhood or a neighborhood you would like to visit. You will then add additional functionality to this application, including: map markers to identify popular locations or places you’d like to visit, a search function to easily discover these locations, and a listview to support simple browsing of all locations. You will then research and implement third-party APIs that provide additional information about each of these locations (such as StreetView images, Wikipedia articles, Yelp reviews, etc).


In this case, the web app allows to check if an artist or band is on tour. It is powered by [Last.fm's Developer API](http://www.last.fm/api).

The repository includes the following files:
* **app directory**: It contains the source code of the web app.
* **dist directory**: It contains the all files for the distribution of the app. It is generated automatically by the automation tool [GulpJS](http://gulpjs.com/).
* **test directory**: It contains the tests implemented for the app (Currently empty).
* **.bowerrc**: Config file used by the package manager [Bower](http://bower.io/).
* **.gitattributes**: Config file used by [Git](http://www.git-scm.com).
* **.gitignore**: Config file used by [Git](http://www.git-scm.com). It contains the excluded files and directories ignored by Git.
* **.yo-rc.json**: Config file to saved the configuration used by [Yeoman](http://www.yeoman.io).
* **README.md**: The GitHub readme file.
* **.bower.json**: Manifest file used by Bower. It contains all Bower package dependencies used by the project.
* **gulpfile.bable.js**: Automation script used by GulpJS. It contains tasks such as _clean_, _build_ or _deploy_.
* **package.json**: Manifest file used by [NPM](http://www.npmjs.com/) package manager.

### Building the application from the source
- Install Yeoman, GulpJS and Bower: `npm install --global yo gulp bower`
- Install NPM dependencies: `npm install`
- Install Bower dependencies: `bower install`
- Run `gulp serve` to preview and watch for changes
- Run `bower install --save <package>` to install frontend dependencies
- Run `gulp serve:test` to run the tests in the browser
- Run `gulp` to build your webapp for production
- Run `gulp serve:dist` to preview the production build
- Run `gulp deploy` to deploy webapp to GitHub pages

### Running the application
Just visit the following [link](http://josemifv.github.io/frontend-nanodegree-neighborhood-map/).

To run it in a development environment, just run the following command: `gulp serve`. A browser window will be opened and the application will be loaded.


### Resources used to complete this project
* [Udacity's Intro to AJAX course](https://www.udacity.com/course/intro-to-ajax--ud110).
* [Udacity's JavaScript Design Patterns course](https://www.udacity.com/course/javascript-design-patterns--ud989).
* [Google's Material Design Lite Components Library](http://www.getmdl.io/).
* [Google Maps v3 API Reference website](https://developers.google.com/maps/documentation/javascript/reference).
* [KnockoutJS official website](http://knockoutjs.com/).
* [Google's Polymer project](https://www.polymer-project.org/1.0/).
* [StackOverflow website](http://stackoverflow.com/).
* [5 ways to customize Google Maps InfoWindow](http://en.marnoto.com/2014/09/5-formas-de-personalizar-infowindow.html).
* [Yeoman's Gulp Webapp generator](https://github.com/yeoman/generator-gulp-webapp).
* [GulpJS](http://gulpjs.com/), [Yeoman](http://www.yeoman.io) and [Bower](http://bower.io/) official documentation.
* and many more...











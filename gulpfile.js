//  this is running gulp 4.0 
// you need to run npm i -g gulp-cli to update your gulp version


"use strict";

let gulp = require("gulp"),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    maps = require("gulp-sourcemaps"),
    imagemin = require("gulp-imagemin"),
    del = require("del"),
    connect = require("gulp-connect"),
    $ = require("jquery")

// Use hoisting to reduce use of  gulp.task in favor of regular functions 

// concatenate and minify JS files
gulp.task("scripts", gulp.series(concatMin));

//compile scss to css and minify
gulp.task("styles", gulp.series(sassMin));

// compress images
gulp.task("images", gulp.series(compress));

//clean dist file
gulp.task('clean', gulp.series(clean));

gulp.task('build', gulp.series('clean', gulp.parallel('scripts', 'styles', 'images', copy)));

//watch
gulp.task('watch', gulp.series(watchSass));

// gulp.task('default',  gulp.parallel(watchSass, server, concatMin, sassMin, compress, copy));
gulp.task('default',  gulp.series('build', gulp.parallel('watch', server)));
// delete dist file
function clean(){
   return(del([
       "dist/*"
   ])) ;
}
//  javascript concatenate, minify and sourcemaps
function concatMin (){
    return gulp.src([
        "js/jquery.js",
        "js/circle/autogrow.js",
        "js/circle/circle.js",
    ])
    
    .pipe(concat("all.min.js"))
    .pipe(maps.init())
    .pipe(uglify())
    .pipe(maps.write("./"))
    .pipe(gulp.dest("dist/scripts"))
8
}

// function scss to css, minify and sourcemaps
function sassMin(){
   return gulp.src("sass/global.scss")
    .pipe(maps.init())
    .pipe(sass({
        outputStyle: 'compressed'
    }))
    .pipe(concat('all.min.css'))
    .pipe(maps.write("./"))
    .pipe(gulp.dest("dist/styles"))
}
//comprress images
function compress(){
    return gulp.src("images/*")
        .pipe(imagemin())
        .pipe(gulp.dest("dist/content"))
}
// watch sscss
function watchSass(){
    gulp.watch ('sass/**/*.scss', gulp.series('styles', reload))
}

//connect server
function server(){
    connect.server({
        root: 'dist',
        livereload: true,
        port: 3000
      });
}
function copy(){
    return gulp.src([
        "index.html",
        "icons"
    ])
    .pipe(gulp.dest("dist"))
}

function reload(){
 return  gulp.src('index.html')
   .pipe(connect.reload())
}
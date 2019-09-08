const gulp = require("gulp");
const clean = require("gulp-clean");
const sourcemaps = require("gulp-sourcemaps");
const concat = require("gulp-concat");
const babel = require("gulp-babel");
const uglify = require("gulp-uglify");
const htmlmin = require('gulp-htmlmin');
const cssmin = require('gulp-cssmin');
//const rename = require("gulp-rename");
const sass = require("gulp-sass");
sass.compiler = require('node-sass');

const {paths} = require("./config/gulp.config");

let distPaths = {};
for(let attr in paths){
    distPaths[attr] = paths[attr].replace(/src/g,"dist");;
}
//console.log(paths , distPaths);
async function handlerClean() {
    await gulp.src( [distPaths.javascript + "*.js"])
    .pipe(clean());
    await gulp.src( distPaths.style + "*.css")
    .pipe(clean());
    await gulp.src( distPaths.html + "*.html")
    .pipe(clean());
}

async function html() {
    await gulp.src([paths.html+"*.html"])
        .pipe(htmlmin({ collapseWhitespace: true }))
        //.pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(distPaths.html))
}
async function css() {
    await gulp.src([paths.style+"*.css"])
        .pipe(cssmin())
        //.pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(distPaths.style))
}
async function javascript() {
    await gulp.src([paths.javascript+"*.js"])
        .pipe(sourcemaps.init())
        .pipe(concat("index.js"))
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify())
        //.pipe(rename({ suffix: '.min' }))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest(distPaths.javascript))
}

async function scss(){
    await gulp.src([paths.scss+"**/*.scss"])
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(cssmin())
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(distPaths.style))
}

gulp.task(scss);
gulp.task(handlerClean);
gulp.task(javascript);
gulp.task(css);
gulp.task(html);
gulp.task("build", gulp.series("handlerClean", "javascript", "css", "html","scss"));
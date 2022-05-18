//var consts
const gulp = require("gulp")
//for css
const less = require("gulp-less")
const rename = require("gulp-rename")
const cleanCSS = require("gulp-clean-css")
const autoprefixer = require('gulp-autoprefixer')
//for js
const babel = require("gulp-babel")
const uglify = require("gulp-uglify") 
const concat = require("gulp-concat") 
//for del dir
const del = require("del")
//for both
const sourcemaps = require('gulp-sourcemaps')
const imagemin = require('gulp-imagemin')
const htmlmin = require('gulp-htmlmin');
const size = require('gulp-size');


//our paths
const path = {
    styles: {
        src: 'src/styles/**/*.less',
        dest: 'dist/css'
    },
    scripts: {
        src: 'src/scripts/**/*.js',
        dest: 'dist/js'
    },
    images: {
        src: 'src/img/*',
        dest: 'dist/img'
    },
    html: {
        src: 'src/*.html',
        dest: 'dist/'
    }
}

// переоброзование Сss 
function styles(){
    return gulp.src(path.styles.src)
        .pipe(sourcemaps.init())
        .pipe(less()
        .pipe(autoprefixer({
			cascade: false
		})))
        .pipe(cleanCSS({
          level: 2  
        }))
        .pipe(rename({
            basename: 'main',
            suffix: '.min'
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(size())
        .pipe(gulp.dest(path.styles.dest))
}

// переоброзование js 
function scripts() {
    return gulp.src(path.scripts.src)
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets:['@babel/env']
        }))
        .pipe(uglify())
        .pipe(concat('main.min.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(size())
        .pipe(gulp.dest(path.scripts.dest))
}

//create func 
function clean(){
    return del(['dist'])
}

function img(){
    return gulp.src(path.images.src)
		.pipe(imagemin())
        .pipe(size({
            showFiles: true
        }))
		.pipe(gulp.dest(path.images.dest))
}

function html(){
    return gulp.src(path.html.src)
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest(path.html.dest));
}

function watch(){
    gulp.watch(path.styles.src, styles)
    gulp.watch(path.scripts.src, scripts)
}

const build = gulp.series(clean, gulp.parallel(scripts,styles, img), watch)

//export tasks
exports.img = img
exports.html = html
exports.clean = clean
exports.styles = styles
exports.scripts = scripts
exports.watch= watch

exports.build = build
exports.default = build

//var consts
const gulp = require("gulp")
//for css
const less = require("gulp-less")
const sass = require('gulp-sass')(require('sass'))
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
const htmlmin = require('gulp-htmlmin')
const size = require('gulp-size')
const newer = require('gulp-newer')
const browsersync = require('browser-sync').create()
const gulppug = require('gulp-pug')



//our paths
const path = {
    styles: {
        src: ['src/styles/**/*.less', 'src/styles/**/*.scss', 'src/styles/**/*.sass'],
        dest: 'dist/css'
    },
    scripts: {
        src: 'src/scripts/**/*.js',
        dest: 'dist/js'
    },
    images: {
        src: 'src/img/**',
        dest: 'dist/img'
    },
    html: {
        src: 'src/*.html',
        dest: 'dist/'
    },
    pug: {
        src: 'src/*.pug',
        dest: 'dist/'
    }
  
}

// переоброзование Сss 
function styles(){
    return gulp.src(path.styles.src)
        .pipe(sourcemaps.init())
        //.pipe(less())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(cleanCSS({
            level: 2
        }))
        .pipe(rename({
            basename: 'main',
            suffix: '.min',
           
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(size())
        .pipe(gulp.dest(path.styles.dest))
        .pipe(browsersync.stream())
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
        .pipe(browsersync.stream())
}

//create func 
function clean(){
    return del(['dist/*','!dist/img'])
}

function img(){
    return gulp.src(path.images.src)
        .pipe(newer(path.images.dest))
        .pipe(imagemin())
        .pipe(size({
            showFiles: true
        }))
		.pipe(gulp.dest(path.images.dest))
}

function pug(){
    return gulp.src(path.pug.src)
    .pipe(gulppug())
    .pipe(gulp.dest(path.pug.dest))
    .pipe(browsersync.stream())
}


function html(){
    return gulp.src(path.html.src)
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest(path.html.dest))
    .pipe(browsersync.stream())
}

function watch(){
    browsersync.init({
        server: {
            baseDir: "./dist/"
        }
    })

    gulp.watch(path.html.dest).on("change", browsersync.reload)

    gulp.watch(path.html.src, html)
    gulp.watch(path.styles.src, styles)
    gulp.watch(path.scripts.src, scripts)
    gulp.watch(path.images.src, img)
}

const build = gulp.series(clean, html,  gulp.parallel(scripts, styles, img), watch)

//export tasks
exports.img = img
exports.html = html
exports.pug = pug
exports.clean = clean
exports.styles = styles
exports.scripts = scripts
exports.watch= watch


exports.build = build
exports.default = build

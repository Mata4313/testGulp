//var consts
const gulp = require("gulp")
//for css
const less = require("gulp-less")
const rename = require("gulp-rename")
const cleanCSS = require("gulp-clean-css")
//for js
const babel = require("gulp-babel")
const uglify = require("gulp-uglify") 
const concat = require("gulp-concat") 
//for del dir
const del = require("del")

//our paths
const path = {
    styles: {
        src: 'src/styles/**/*.less',
        dest: 'dist/css'
    },
    scripts: {
        src: 'src/scripts/**/*.js',
        dest: 'dist/js'
    }
}

// переоброзование Сss 
function styles(){
    return gulp.src(path.styles.src)
        .pipe(less())
        .pipe(cleanCSS())
        .pipe(rename({
            basename: 'main',
            suffix: '.min'
        }))
        .pipe(gulp.dest(path.styles.dest))
}

// переоброзование js 
function scripts() {
    return gulp.src(path.scripts.src, {
        sourcemaps: true
    })
        .pipe(babel())
        .pipe(uglify())
        .pipe(concat('main.min.js'))
        .pipe(gulp.dest(path.scripts.dest))
}

//create func 
function clean(){
    return del(['dist'])
}

function watch(){
    gulp.watch(path.styles.src, styles)
    gulp.watch(path.scripts.src, scripts)
}

const build = gulp.series(clean, gulp.parallel(scripts,styles), watch)

//export tasks
exports.clean = clean
exports.styles = styles
exports.scripts = scripts
exports.watch= watch
exports.build = build
exports.default = build

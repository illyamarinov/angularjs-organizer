'use strict';

const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const plumber = require('gulp-plumber');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const sass = require('gulp-sass');
const notify = require('gulp-notify');
const gulpIf = require('gulp-if');
const browserSync = require('browser-sync').create();

const PATH = require('./paths.json');

const IS_DEVELOPMENT = true;

function errorHandler(title) {
    return plumber({
        errorHandler: notify.onError(function (err) {
            return {
                title: title,
                message: err.message
            };
        })
    });
}

function outputStyle() {
    return IS_DEVELOPMENT
        ? 'nested'
        : 'compressed';
}

gulp.task('styles', function () {
    return gulp.src(PATH.src.styles)
        .pipe(errorHandler('Styles'))
        .pipe(gulpIf(IS_DEVELOPMENT, sourcemaps.init()))
        .pipe(sass({outputStyle: outputStyle()}))
        .pipe(gulpIf(IS_DEVELOPMENT, sourcemaps.write()))
        .pipe(gulp.dest(PATH.dist.css))
        .pipe(gulpIf(!IS_DEVELOPMENT, browserSync.stream()));
});

gulp.task('vendorStyles', function () {
    return gulp.src(PATH.src.vendorStyles)
        .pipe(errorHandler('Vendor styles'))
        .pipe(gulpIf(IS_DEVELOPMENT, sourcemaps.init()))
        .pipe(sass({outputStyle: outputStyle()}))
        .pipe(concat('vendor.css'))
        .pipe(gulpIf(IS_DEVELOPMENT, sourcemaps.write()))
        .pipe(gulp.dest(PATH.dist.css));
});

gulp.task('scripts', function () {
    return gulp.src(PATH.src.scripts)
        .pipe(errorHandler('Scripts'))
        .pipe(gulpIf(IS_DEVELOPMENT, sourcemaps.init()))
        .pipe(babel())
        .pipe(gulpIf(!IS_DEVELOPMENT, uglify({mangle: false})))
        .pipe(concat('main.js'))
        .pipe(gulpIf(IS_DEVELOPMENT, sourcemaps.write()))
        .pipe(gulp.dest(PATH.dist.js))
        .pipe(gulpIf(!IS_DEVELOPMENT, browserSync.stream()));
});

gulp.task('vendorScripts', function () {
    return gulp.src(PATH.src.vendorScripts)
        .pipe(errorHandler('Vendor scripts'))
        .pipe(gulpIf(IS_DEVELOPMENT, sourcemaps.init()))
        .pipe(babel())
        .pipe(gulpIf(!IS_DEVELOPMENT, uglify({mangle: false})))
        .pipe(concat('vendor.js'))
        .pipe(gulpIf(IS_DEVELOPMENT, sourcemaps.write()))
        .pipe(gulp.dest(PATH.dist.js))
});

gulp.task('html', function () {
    return gulp.src(PATH.src.indexHtml)
        .pipe(errorHandler('index.html'))
        .pipe(gulp.dest(PATH.dist.html));
});


//Task watch
gulp.task('watch', function () {
    browserSync.init({
        server: {
            baseDir: PATH.baseDir
        }
    });

    gulp.watch(PATH.watch.scripts, ['scripts']);
    gulp.watch(PATH.watch.styles, ['styles']);
    gulp.watch(PATH.src.html).on('change', browserSync.reload);
});

gulp.task('build', ['html', 'styles', 'vendorStyles', 'scripts', 'vendorScripts']);

gulp.task('default', ['build', 'watch']);
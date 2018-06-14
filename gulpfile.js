var gulp          = require('gulp'),
    sass          = require('gulp-sass')
    cleanCSS      = require('gulp-clean-css'),
    autoprefixer  = require('gulp-autoprefixer'),
    rename        = require('gulp-rename'),
    inject        = require('gulp-inject'),
    uglify        = require('gulp-uglify'),
    concat        = require('gulp-concat'),
    plumber       = require('gulp-plumber'),
    babel         = require('gulp-babel'),
    browserify    = require('gulp-browserify'),
    clean         = require('gulp-clean'),
    sourcemaps    = require('gulp-sourcemaps'),
    htmlmin       = require('gulp-html-minifier'),
    browserSync   = require('browser-sync');

var src           = "./src/",
    dist          = "./dist/";


// #######################################
// MINIFIER HTML
gulp.task('html',function(){
    gulp.src(dist + '*.html',{force: true})
        .pipe(clean());
    gulp.src(src + '*.html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(dist))
        .pipe(browserSync.stream());
});

// #######################################
// MINIFIER SASS
gulp.task('sass',function(){
    gulp.src(src + 'assets/sass/*.sass')
        .pipe(sourcemaps.init())
            .pipe(plumber())
            .pipe(sass())
            .pipe(autoprefixer())
            .pipe(rename({basename: 'style'}))
            .pipe(cleanCSS())
            .pipe(rename({suffix: '.min'}))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(dist + '/assets/css/'))
        .pipe(browserSync.stream());
});

// #######################################
// MINIFIER JS
gulp.task('js',function(){
    gulp.src(src + 'assets/js/*.js')
        .pipe(sourcemaps.init())
            .pipe(plumber())
            .pipe(concat('global.js'))
            .pipe(babel({
                presets: ['es2015']}))
            .pipe(browserify({
                insertGlobals: true,
                debug: !gulp.env.production }))
            .pipe(uglify())
            .pipe(rename({suffix: '.min'}))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(dist + '/assets/js/'))
        .pipe(browserSync.stream());
});
// #######################################
// WATCH
gulp.task('default',function(){
    browserSync.init({
        server: './dist'
    })
    gulp.watch([src + '*.html'],['html']);
    gulp.watch([src + 'assets/sass/*.sass'],['sass']);
    gulp.watch([src + 'assets/js/*.js'],['js']);
});

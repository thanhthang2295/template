var gulp = require('gulp');
var browserSync = require('browser-sync').create();

var sass = require('gulp-sass');
var minifyCSS = require('gulp-minify-css');
var useref = require('gulp-useref');
var concat = require('gulp-concat');
var prefix = require('gulp-autoprefixer');
var gulpIf = require('gulp-if');
var cssNano = require('gulp-cssnano'); // Minify CSS
var uglify = require('gulp-uglify'); // Minify JS
var imagemin = require('gulp-imagemin');
var rename = require('gulp-rename');
var cache = require('gulp-cache');
var del = require('del');
var sourcemaps = require('gulp-sourcemaps');
var runSequence = require('run-sequence');

var reload = browserSync.reload;

// - - - Browser-Sync
gulp.task('browserSync', function() {
    browserSync.init({
        server:{
            baseDir: './app'
        },
        port: 6789
    })
});

// - - - HTML
gulp.task('html', function() {
    gulp.src('app/*.html')
        .pipe(browserSync.stream());
});

// - - - Sass
gulp.task('sass', function() {
    gulp.src('app/scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.init())
        .pipe(prefix({browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']}))
        // .pipe(concat('main.css'))
        .pipe(gulp.dest('app/css'))
        .pipe(rename('main.min.css'))
        .pipe(sourcemaps.write('.'))
        .pipe(browserSync.stream());
});

// - - - Js
gulp.task('js', function() {
    gulp.src('app/js/**/*.js')
        .pipe(gulp.dest('dist/js'))
});

// - - - Images
gulp.task('image', function() {
    gulp.src('app/images/**/*.+(png|jpg|gif|svg)')
        .pipe(cache(imagemin()))
        .pipe(gulp.dest('dist/images'))
});

// - - - Fonts
gulp.task('font', function() {
    gulp.src('app/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'))
});

// - - - Useref - Noi file
gulp.task('useref', function() {
    gulp.src('app/*.html')
        .pipe(useref())
        .pipe(gulpIf('app/css/main.css', cssNano({safe: true, autoprefixer: true})))
        .pipe(gulp.dest('dist'))
});



// - - - Watch
gulp.task('watch',['clear','browserSync','html', 'sass', 'js'], function() {
    gulp.watch('app/scss/**/*.scss', ['sass']);
    gulp.watch('app/js/**/*.js', browserSync.stream());
    gulp.watch("app/*.html", ['html'])
});

// - - - Clear
gulp.task('clear', function() {
    return del.sync('dist');
});

// - - - Build
gulp.task('build', function(callback) {
    runSequence( 
        'clear',
        ['sass' ,'js', 'useref', 'image', 'font'],
        callback
    )
});

// - - - Default
gulp.task('default', ['watch']);

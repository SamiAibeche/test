// IMPORTS
var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var plumber = require('gulp-plumber');
var notify = require('gulp-notify');
var del = require('del');
var path = require('path');
var sourcemaps = require('gulp-sourcemaps');

// Sass
var sass = require('gulp-sass');
var postCSS = require('gulp-postcss');
var cleanCSS = require('postcss-clean');
var autoprefixer = require('autoprefixer');
var normalize = require('node-normalize-scss').includePaths;

// Grids
var susy = 'node_modules/susy/sass';

// Javascript
var babel = require('gulp-babel');
var wwwPath = path.join(__dirname, 'src/assets');
var publicPath = path.join(__dirname, 'src');

// CONFIGURATION
var config = {
    img: {
        in: path.join(wwwPath, '/images/'),
        out: path.join(publicPath, 'images/'),
    },
    fonts: {
        in: path.join(wwwPath, '/fonts/'),
        out: path.join(publicPath, 'fonts/')
    },
    css: {
        in: path.join(wwwPath, '/scss/'),
        out: path.join(publicPath, 'css/'),
        maps: 'maps/'
    },
    js: {
        in: path.join(wwwPath, '/js/'),
        out: path.join(publicPath, 'js/'),
        maps: 'maps/'
    }
};

// TASKS

/**
 * FONTS compilation
 */

gulp.task('clean:fonts', function () {
    return del.sync([
        config.fonts.out + '/**'
    ]);
});

gulp.task('bundle:fonts', ['clean:fonts'], function () {
    return gulp.src(config.fonts.in + '/**/*.*')
        .pipe(gulp.dest(config.fonts.out));
});

gulp.task('watch:fonts', ['bundle:fonts'], function () {
    return gulp.watch(config.fonts.in + '/**/*.*', ['bundle:fonts']);
});

gulp.task('cleanAdmin:fonts', function () {
    return del.sync([
        config.fonts.out + '/**'
    ]);
});

gulp.task('bundleAdmin:fonts', ['cleanAdmin:fonts'], function () {
    return gulp.src(config.fonts.in + '/**/*.*')
        .pipe(gulp.dest(config.fonts.out));
});

gulp.task('watchAdmin:fonts', ['bundleAdmin:fonts'], function () {
    return gulp.watch(config.fonts.in + '/**/*.*', ['bundleAdmin:fonts']);
});


/**
 * IMAGES compilation
 */
// Front
gulp.task('clean:images', function () {
    return del.sync([
        config.img.out + '/**'
    ]);
});
gulp.task('bundle:images', ['clean:images'], function () {
    return gulp.src(config.img.in + '/**/*.*').pipe(gulp.dest(config.img.out));
});
gulp.task('watch:images', ['bundle:images'], function () {
    return gulp.watch(config.img.in + '/**/*.*', ['bundle:images']);
});

// Admin
gulp.task('cleanAdmin:images', function () {
    return del.sync([
        config.imgAdmin.out + '/**'
    ]);
});
gulp.task('bundleAdmin:images', ['cleanAdmin:images'], function () {
    return gulp.src(config.imgAdmin.in + '/**/*.*').pipe(gulp.dest(config.imgAdmin.out));
});
gulp.task('watchAdmin:images', ['bundleAdmin:images'], function () {
    return gulp.watch(config.imgAdmin.in + '/**/*.*', ['bundleAdmin:images']);
});

// Sass / css
// Front
gulp.task('bundle:css', function () {
    gulp.src(config.css.in + '/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(plumber({
            errorHandler: notify.onError("Erreur: <%= error.message %>")
        }))
        .pipe(sass({
            includePaths: [].concat(normalize, susy),
            outputStyle: 'expanded',
            sourcemap: true,
            style: 'compact'
        }).on('error', sass.logError))
        .pipe(postCSS([
            cleanCSS({compatibility: 'ie9'})
        ]))
        //    .pipe(concat('styles.css'))
        .pipe(rename('styles.min.css'))
        .pipe(sourcemaps.write(config.css.maps))
        .pipe(gulp.dest(config.css.out));
});

gulp.task('watch:css', ['bundle:css'], function () {
    return gulp.watch(config.css.in + '/**/*.scss', ['bundle:css']);
});

// Admin
gulp.task('bundleAdmin:css', function () {
    gulp.src(config.cssAdmin.in + '/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(plumber({
            errorHandler: notify.onError("Erreur: <%= error.message %>")
        }))
        .pipe(sass({
            includePaths: [].concat(normalize, susy),
            outputStyle: 'expanded',
            sourcemap: true,
            style: 'compact'
        }).on('error', sass.logError))
        .pipe(postCSS([
            cleanCSS({compatibility: 'ie9'})
        ]))
        //    .pipe(concat('styles.css'))
        .pipe(rename('styles.min.css'))
        .pipe(sourcemaps.write(config.cssAdmin.maps))
        .pipe(gulp.dest(config.cssAdmin.out));
});

gulp.task('watchAdmin:css', ['bundleAdmin:css'], function () {
    return gulp.watch(config.cssAdmin.in + '/**/*.scss', ['bundleAdmin:css']);
});

// Javascript

gulp.task('clean:js', function () {
    /*return del.sync([
      config.js.out + '/**'
    ]);*/
});

gulp.task('bundle:js', ['clean:js'], function () {
    return gulp.src(config.js.in + '*.js')
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(concat('app.js'))
        .pipe(rename('app.min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write(config.js.maps))
        .pipe(gulp.dest(config.js.out));
});

gulp.task('watch:js', ['bundle:js'], function () {
    return gulp.watch(config.js.in + '/**/*.*', ['bundle:js']);
});

gulp.task('bundleAdmin:js', ['clean:js'], function () {
    return gulp.src(config.jsAdmin.in + '*.js')
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(concat('app.js'))
        .pipe(rename('app.min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write(config.jsAdmin.maps))
        .pipe(gulp.dest(config.jsAdmin.out));
});

gulp.task('watchAdmin:js', ['bundleAdmin:js'], function () {
    return gulp.watch(config.jsAdmin.in + '/**/*.js', ['bundleAdmin:js']);
});

// DEFAULT
gulp.task('default', ['bundle:fonts', 'bundle:images', 'bundle:css', 'bundle:js']);

// WATCHES
gulp.task('watch', ['watch:fonts','watch:images','watch:css', 'watch:js']);

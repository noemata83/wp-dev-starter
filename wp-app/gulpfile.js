var gulp = require('gulp'),
settings = require('./settings'),
webpack = require('webpack'),
browserSync = require('browser-sync').create(),
autoprefixer = require('gulp-autoprefixer'),
sass = require('gulp-sass'),
sourcemaps = require('gulp-sourcemaps'),
rename = require('gulp-rename');

const sassOptions = {
  errLogToConsole: true,
  outputStyle: 'expanded',
  outFile: 'style.css'
};

const autoprefixerOptions = {
  browsers: ['last 2 versions', '> 5%', 'Firefox ESR']
}
gulp.task('styles', function() {
  return gulp.src(settings.themeLocation + 'sass/main.scss')
    .pipe(sourcemaps.init())
    .pipe(sass(sassOptions))
    .on('error', sass.logError)
    .pipe(rename('style.css'))
    .pipe(sourcemaps.write())
    .pipe(autoprefixer(autoprefixerOptions))
    .pipe(gulp.dest(settings.themeLocation));
});

gulp.task('scripts', function(callback) {
  webpack(require('./webpack.config.js'), function(err, stats) {
    if (err) {
      console.log(err.toString());
    }

    console.log(stats.toString());
    callback();
  });
});

gulp.task('watch', function() {
  browserSync.init({
    notify: false,
    proxy: settings.urlToPreview,
    ghostMode: false
  });

  gulp.watch('./**/*.php', function() {
    browserSync.reload();
  });
  // gulp.watch(settings.themeLocation + 'css/**/*.css', ['waitForStyles']);
  gulp.watch(settings.themeLocation + 'sass/**/*.scss', ['waitForStyles'])
  gulp.watch([settings.themeLocation + 'js/modules/*.js', settings.themeLocation + 'js/scripts.js'], ['waitForScripts']);
});

gulp.task('waitForStyles', ['styles'], function() {
  return gulp.src(settings.themeLocation + 'style.css')
    .pipe(browserSync.stream());
});

gulp.task('waitForScripts', ['scripts'], function() {
  browserSync.reload();
});
//gulp configuration
var gulp = require('gulp');
var pug = require('gulp-pug');
var scss = require('gulp-sass');
var prettify = require('gulp-prettify');
var typescript = require('gulp-typescript');
var cleancss = require('gulp-clean-css'); 
var browsersync = require('browser-sync');
var watch = require('gulp-watch');
var run = require('run-sequence'); //all the variables are defined, now we can start creating things, pipe means send through
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var tsify = require('tsify');

var buildpath = './build'; 

gulp.task('ts', function(){
  return browserify({
    baseDir: '.',
    debug: true,
    entries:['ts/todo.ts'],
    cache: {},
    packageCache: {}
  })
  .plugin(tsify)
  .bundle()
  .pipe(source('main.js'))
  .pipe(gulp.dest( buildpath + "/js"));
});

gulp.task('html', function () {
    return gulp.src('./templates/*.pug')
    .pipe( pug() ) //pipe means that will convenrt it to html 
    .pipe( prettify() )
    .pipe( browsersync.reload( {stream:true}) )
    .pipe( gulp.dest(buildpath) );
});

gulp.task('scss', ()=> {
    return gulp.src('./scss/*.scss')
    .pipe( scss () )
    .pipe( cleancss () )
    .pipe( browsersync.reload( {stream:true}) )
    .pipe( gulp.dest(buildpath+'/css') ); //i want it to go to the css directory instead of just the general build
});


gulp.task('js', ()=>{
    return gulp.src('./ts/*.ts')
    .pipe( typescript(
        {
            noImplicityAny: true,
            outFile: 'main.js'
        }
    ))
    .pipe( gulp.dest(buildpath+'/js') );
});

gulp.task('browsersync', ()=>{
    browsersync.init({server:{baseDir: buildpath} })
});

gulp.task('watch', ()=>{
    run('html', 'scss', 'ts', 'browsersync', () =>{});
    gulp.watch('./templates/*.pug', ['html']);
    gulp.watch('./scss/*.scss', ['scss']);
    gulp.watch('./ts/*.ts', ['ts']);
});
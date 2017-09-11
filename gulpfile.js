
/**
 * 引入依赖
 */

var gulp = require('gulp'),
    clean = require('gulp-clean'),          //清空
    concat = require('gulp-concat'),        //合并文件
    less = require('gulp-less'),            //less  css预处理器
    babel = require('gulp-babel'),          //es6 => es5
    rename = require("gulp-rename"),        //文件重命名
    uglify = require("gulp-uglify"),        //js压缩
    minifyCSS = require('gulp-minify-css'), //css压缩
    htmlmin = require('gulp-htmlmin'),      //html压缩
    imagemin = require('gulp-imagemin');    //图片压缩

/**
 * 文件地址寄存
 */

var build = 'dist',
    dev = './src',
    src = {
        less: '/css/**/*.less',
        js  : '/js/**/*.js',
        img : '/img/**/*.{png,jpg,gif,ico}',
        html: '/pages/**/*.html',
        library: '/library/**/*'
};

/**
 * 任务分发
 */

gulp.task('copy',function(){
    gulp.src(dev + src.library).pipe(gulp.dest(build + '/static/library'))
});

gulp.task('clean',function(){
    gulp.src(build)
        .pipe(clean());
});

gulp.task('less',function(){
    gulp.src(dev + src.less)
        .pipe(less())
        .pipe(minifyCSS())
        .pipe(rename({suffix:'.min'}))
        .pipe(gulp.dest(build + '/static/css'));
});


gulp.task('js',function(){
    gulp.src(dev + src.js)
        //.pipe(concat('index.js'))
        .pipe(babel({presets: ['es2015']}))
        .pipe(uglify())
        .pipe(rename({suffix:'.min'}))
        .pipe(gulp.dest(build + '/static/js'));
});


gulp.task('image',function() {
    gulp.src(dev + src.img)
        .pipe(imagemin())
        .pipe(rename({suffix:'.min'}))
        .pipe(gulp.dest(build + '/static/img'));
});

gulp.task('html',function(){
    var options = {
        collapseWhitespace:true,
        collapseBooleanAttributes:true,
        removeComments:true,
        removeEmptyAttributes:true,
        removeScriptTypeAttributes:true,
        removeStyleLinkTypeAttributes:true,
        minifyJS:true,
        minifyCSS:true
    };
    gulp.src(dev + src.html)
        .pipe(htmlmin(options))
        .pipe(gulp.dest(build));
});

//监听任务
gulp.task("watch",function(){   //定义默认任务,并让gulp监视文件变化自动执行
    gulp.watch(dev + src.less,["less"]);
    gulp.watch(dev + src.js,["js"]);
    gulp.watch(dev + src.html,["html"]);
    gulp.watch(dev + src.img,["image"]);
});



//集群分发
gulp.task('build',['less','js','html','image','copy']);
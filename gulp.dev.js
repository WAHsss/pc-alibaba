const gulp = require("gulp");
// 1. 转存 : gulp.src pipe gulp.dest 
// 2. 服务器gulp-connect ;  1.测试服务器;
//                          2.代理服务器
//                          3. 自动刷新; 

const connect = require("gulp-connect");
const proxy = require("http-proxy-middleware");
const { proxyList } = require("./config/gulp.config");
var sass = require('gulp-sass');
sass.compiler = require('node-sass');
const {paths} = require("./config/gulp.config");

let distPaths = {};
for (let attr in paths) {
    distPaths[attr] = paths[attr].replace(/src/g, "dist");;
}

async function handlerConnect() {
    await connect.server({
        root: "./dist",
        port: 8888,
        livereload: true,
        middleware: function (connect, opt) {
            let list = [];
            for (let attr in proxyList) {
                let url = "/" + attr;
                let key = "^/" + attr;
                list.push(
                    proxy(url, {
                        target: proxyList[attr],
                        changeOrigin: true,
                        pathRewrite: {
                            [key]: ""
                        }
                    })
                )
            }
            return list;
        }
    });
}
function javascript(done) {
    gulp.src([paths.javascript + "*.js"])
        .pipe(gulp.dest(distPaths.javascript))
        .pipe(connect.reload());
    done();
}
function css(done) {
    gulp.src([paths.style + "*.css"])
        .pipe(gulp.dest(distPaths.style))
        .pipe(connect.reload())
    done();
}
async function scss(){
    await gulp.src([paths.scss+"*.scss"])
    .pipe(sass().on('error',sass.logError))
    .pipe(gulp.dest(distPaths.style))
    .pipe(connect.reload())
}

function html(done) {
    gulp.src([paths.html + "*.html"])
        .pipe(gulp.dest(distPaths.html))
        .pipe(connect.reload())
    done();
}
async function watch() {
    await gulp.watch([paths.javascript + "*.js"], gulp.series("javascript"));
    await gulp.watch([paths.style + "*.css"], gulp.series("css"));
    await gulp.watch([paths.html + "*.html"], gulp.series("html"));
    await gulp.watch([paths.scss + "*.scss"],gulp.series("scss"))
}
gulp.task(handlerConnect);
gulp.task(watch);
gulp.task(javascript);
gulp.task(css);
gulp.task(scss);
gulp.task(html);
gulp.task("dev", gulp.parallel("watch","handlerConnect"));

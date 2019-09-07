const gulp = require("gulp");
//  此时把工程分成了两个部分 : 1. run 模式 ; 项目可以高效展示; 
//  此时只需要搭建一个服务器, 代码进行简单的转存就可以了;

// build 模式 ; 打包模式 , 把所有的代码压缩编译成我们的项目需求; ES6 => ES5 代码必须压缩; ....
let arg = process.argv;

let mode = arg.filter((item,index) => index > 1)[0];

if(mode === "dev"){
    // dev模式； 独立的模式；
    console.log("开启dev模式...");
    const dev = require("./gulp.dev");
}
if(mode === "build"){
    console.log("开启build模式...");
    const build = require("./gulp.build");
}

// (from: http://cartman0.hatenablog.com/entry/2017/05/14/172311)

const fs       = require('fs');
const process  = require('process');
const getStdin = require('get-stdin');
const mjAPI    = require('mathjax-node');

mjAPI.config({
    mjAPI: {

    }
})
mjAPI.start();

getStdin().then(str => {
    const yourMath = str;
    
    mjAPI.typeset({
        math: yourMath,
        format: "TeX", // "inline-TeX", "MathML"
        svg: true,
      }, function (data) {
        if (!data.errors) {
            fs.writeFileSync("math.svg", data.svg);
        }
      });
});


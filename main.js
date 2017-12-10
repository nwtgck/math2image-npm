#!/usr/bin/env node

// (from: https://qiita.com/takayukioda/items/a149bc2907ef77121229)
// (from: http://cartman0.hatenablog.com/entry/2017/05/14/172311)

const fs       = require('fs');
const fse      = require('fs-extra');
const util     = require('util');
const process  = require('process');
const getStdin = require('get-stdin');
const mjAPI    = require('mathjax-node');
const program  = require('commander');
const svg2png  = require('svg2png');

program
    .option('-o --output-file [FILE]', "Output file name")
    .option('-p --to-png', "Output png or not")
    .parse(process.argv);

mjAPI.config({
    mjAPI: {

    }
})
mjAPI.start();

function isInputFileSpecified(){
    return program.args.length === 1;
}

(async function(){
    let mathStr = null;
    if(isInputFileSpecified()){
        const filePath = program.args[0];
        const exists   = await fse.pathExists(filePath);
        if(exists){
            mathStr = await fse.readFile(program.args[0]);            
        } else {
            console.error(`Error: '${filePath}' not found`);
            process.exit(1);
        }
    } else {
        mathStr = await getStdin();        
    }
    const data    = await mjAPI.typeset({
        math: mathStr,
        format: "TeX", // "inline-TeX", "MathML"
        svg: true,
      }
    );

    let outdata = null;
    if(program.toPng){
        outdata = await svg2png(data.svg, {width: 300, height: undefined}); // TODO Hard code
    } else {
        outdata = data.svg;
    }

    if(!isInputFileSpecified() && program.outputFile == undefined){
        // Output to stdout
        await process.stdout.write(outdata);
    } else {
        // Decide file path
        const outFilePath =  program.outputFile || `${program.args[0]}.${program.toPng ? 'png': 'svg' }`
        // Write to a file
        await fse.writeFile(outFilePath, outdata);
        console.log(`Saved to ${outFilePath}`);
    }   
})();


#!/usr/bin/env node

// (from: https://qiita.com/takayukioda/items/a149bc2907ef77121229)
// (from: http://cartman0.hatenablog.com/entry/2017/05/14/172311)

import * as fse       from 'fs-extra';
import * as process   from 'process';
import * as getStdin  from 'get-stdin';
import * as mjAPI     from 'mathjax-node';
import * as program   from 'commander';
import * as svg2png   from 'svg2png';

program
    .option('-o --output-file [FILE]', "Output file name")
    .option('-p --to-png', "Output png or not")
    .option('--png-width [N]', "Width of png image")
    .option('--png-height [N]', "Width of png image")
    .parse(process.argv);

mjAPI.config({
    mjAPI: {

    }
});
mjAPI.start();

function isInputFileSpecified(): boolean{
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
        if(program.pngWidth == undefined && program.pngHeight == undefined){
            console.error("Error: Should specify at least one of --png-width or --png-height");
            process.exit(1);
        }
        // Convert svg to png
        outdata = await svg2png(data.svg, {width: program.pngWidth, height: program.pngHeight});
    } else {
        outdata = data.svg;
    }

    if(!isInputFileSpecified() && program.outputFile == undefined){
        // Output to stdout
        await process.stdout.write(outdata);
    } else {
        // Decide file path
        const outFilePath =  program.outputFile || `${program.args[0]}.${program.toPng ? 'png': 'svg' }`;
        // Write to a file
        await fse.writeFile(outFilePath, outdata);
        console.log(`Saved to ${outFilePath}`);
    }
})();


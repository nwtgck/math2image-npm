#!/usr/bin/env node

// (from: https://qiita.com/takayukioda/items/a149bc2907ef77121229)
// (from: http://cartman0.hatenablog.com/entry/2017/05/14/172311)

import * as fse from 'fs-extra';
import * as process from 'process';
import * as getStdin from 'get-stdin';
import * as mjAPI from 'mathjax-node';
import * as yargs from 'yargs';
import * as svg2png from 'svg2png';

const args = yargs
  .option('output-file', {
    alias: 'o',
    type: 'string',
    describe: 'Output file path',
  })
  .option('to-png', {
    alias: 'p',
    type: "boolean",
    describe: "Output as png"
  })
  .option('png-width', {
    type: "number",
    describe: "Width of png image",
  })
  .option('png-height', {
    type: "number",
    describe: "Height of png image",
  })
  .argv;

mjAPI.config({
  mjAPI: {}
});
mjAPI.start();

function isInputFileSpecified(): boolean {
  return args._.length === 1;
}

(async function () {
  let mathStr = null;
  if (isInputFileSpecified()) {
    const filePath = args._[0] as string;
    const exists = await fse.pathExists(filePath);
    if (exists) {
      mathStr = await fse.readFile(args._[0]);
    } else {
      console.error(`Error: '${filePath}' not found`);
      process.exit(1);
    }
  } else {
    mathStr = await getStdin();
  }
  const data = await mjAPI.typeset({
      math: mathStr,
      format: "TeX", // "inline-TeX", "MathML"
      svg: true,
    }
  );

  let outdata = null;
  if (args["to-png"]) {
    if (args["png-width"] === undefined && args["png-height"] === undefined) {
      console.error("Error: Should specify at least one of --png-width or --png-height");
      process.exit(1);
    }
    // Convert svg to png
    outdata = await svg2png(data.svg, {width: args["png-width"], height: args["png-height"]});
  } else {
    outdata = data.svg;
  }

  if (!isInputFileSpecified() && args["output-file"] === undefined) {
    // Output to stdout
    await process.stdout.write(outdata);
  } else {
    // Decide file path
    const outFilePath = args["output-file"] || `${args._[0]}.${args["to-png"] ? 'png' : 'svg'}`;
    // Write to a file
    await fse.writeFile(outFilePath, outdata);
    console.log(`Saved to ${outFilePath}`);
  }
})();

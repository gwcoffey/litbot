#!/usr/bin/env node

const yargs = require('yargs');

yargs(process.argv.slice(2))
  .commandDir('../dist/commands')
  .demandCommand()
  .strict()
  .help()
  .parse()
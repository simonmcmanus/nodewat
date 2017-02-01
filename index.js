#!/usr/bin/env node

'use strict';

var chokidar = require('chokidar')
var fs = require('fs')
var chalk = require('chalk')
var folder = process.cwd();

console.log('');
console.log(chalk.green('Watching folder:'));
console.log(chalk.grey(folder));
console.log('');

chokidar.watch(folder + '/node_modules/**/package.json', {
    persistent: true
})
.on('all', (event, path) => {
    if(event === 'add' || event === 'change')  {

        try{

            if (path.slice(-12) === 'package.json') {
                var removePackage = require(path);
                fs.lstat(path.slice(0, -12), (err, stats) => {

                    if (err) {
                        throw(err)
                    }

                    if (stats.isSymbolicLink()) {
                        console.log('    ' + removePackage.name + '@' + removePackage.version);
                        console.log('    ' + chalk.grey(path.replace(folder, ' ')))
                        console.log('');
                    }
                })
            }

        } catch(e) {
            console.log(e)
        }
    }
});
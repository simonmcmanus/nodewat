#!/usr/bin/env node

'use strict';

var chokidar = require('chokidar')
var fs = require('fs')
var chalk = require('chalk')
var folder = process.cwd();
var exec = require('child_process').exec;


console.log('');
console.log(chalk.green('Folder:'));
console.log(chalk.grey(folder));
console.log('');

chokidar.watch(folder + '/node_modules/**/package.json', {})
.on('all', (event, path) => {
    if(event === 'add' || event === 'change')  {

        try{

            if (path.slice(-12) === 'package.json') {
                var removePackage = require(path);


                fs.lstat(path.slice(0, -12), (err, stats) => {

                    if (err) {
                        return console.log(err)
                    }

                    if (stats.isSymbolicLink()) {

                        fs.realpath(path, (err, realPath) => {


                            // get the branch
                            exec("git rev-parse --abbrev-ref HEAD", {cwd: path.slice(0, -12)}, function (error, branch, stderr) {
                                if (error !== null) {
                                    return console.log('exec error: ' + error);
                                }

                                console.log('    ' + removePackage.name + '@' + removePackage.version + chalk.grey(' git:') +  chalk.red(branch));
                                console.log('    ' + chalk.grey(path.replace(folder, ' '))  + ' -> ' )
                                console.log('     ' + chalk.grey(realPath))
                                console.log('');
                            });

                        });

                    }
                })
            }

        } catch(e) {
            console.log(e)
        }
    }
});
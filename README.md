# file-path-resolver
Resolves path to a file in a Node Js when we require a it.

### Prerequisite
    * NPM : 4.0.2 or higher version
    * Node: v6.9.1 or higher version

### Installation
    npm install file-path-resolver  --save
                or
    yarn add file-path-resolver --save
    
### What is the use ??

Most of the developers requires a files as,
```js
var helper = require('../../../../../../../../../../lib/helper');
var dbConfig = require('../../../../../../../../../../../../configurations/db/config');
```
But you can require these files as using `file-path-resolver`.

```js
var useFilePath = require('file-path-resolver').useFilePath;
var helper = require(userFilePath('helper'));
var dbConfig = require(userFilePath('config')); 
```
`file-path-resolver` appends the `.js` file extension if not specified while requiring a file.

### How to use ??

##### For the best results 
    * keep the name of files unique.
    * keep the folder names unique, if you have multiple files with same name.

`file-path-resolver` can be used in Node Js project. if you are using `express` then,
Add the following lines to your `app.js` file as
```js

// app.js 
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();

/* File Path Resolver Module  */
var filePathResolver = require('file-path-resolver');
filePathResolver('root-folder-name');  // Takes name of the root folder/directory as the argument.
...
```

Now, you can use `file-path-resolver` througout the project anywhere as shown in `What is the use ??` section.

### Use cases handling

    # You have multiple file with same in different folders.
    
Suppose you have `abc.js` file in `aaa` , `bbbb` and `ccc` folder/directory. Now, you can require `abc.js` file  from `bbb` as,
```js
 /**
  * Pass the name of file as the first argument and folder/directory name as the second argument
  */
 var abc = require(userFilePath('abc','bbb'));  // Note the name of folder/directory as the argument
```
Here, in this case make sure that there is no folder/directory exists with same `bbb` and contains
a file named - `abc`. if there another folder/directory `bbb` exists but do'nt has the file `bbb` then it has 
no problem.
    
    #  You have a file with unique name throughout the project.
    
Suppose you have file `xyz.js` with unique name then you can require it as,
```js
var abc = require(userFilePath('xyz')); // just pass the name of file as the argument.
```
    # You don't want to include folder and files while requiring a file (present in root folder only)
```js


/* File Path Resolver Module  */
var filePathResolver = require('file-path-resolver');
filePathResolver('root-folder-name', ['.idea', 'yarn.lock', '.gitignore']);// Note this line, carefully
```
Here, You have passed an array of files and folders to be ignored.

## Congrates

This is all abou this module.

Report issues [Here](https://github.com/sauravgaursmith/file-path-resolver/issues).

Feel free to give your valuable comments, issues and suggestions at `js.tech.feedback@gmail.com`

###LICENSE

[MIT](LICENSE)



    
    
    

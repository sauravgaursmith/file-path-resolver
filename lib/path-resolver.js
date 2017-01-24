/**
 * Dependency
 */
const fs = require('fs');

/***
 * Declarations
 */
const defaultFoldersAndFilesToIgnore = [
    '.idea',
    'app.js',
    'node_modules',
    'nodemon.json',
    'path-resolver',
    'yarn.lock'
];
let rootDirectoryName;
let paths = {};
let folderWisePaths = {};
let foldersAndFilesToBeScan = [];
let validDirectories = [];
let filesWithMultipleExistence = [];


/**
 * Removes the items from arr1 that also exists in arr2;
 * @param arr1
 * @param arr2
 * @returns {*|Array.<T>}
 */
function diffArray(arr1, arr2) {
    return arr1.filter(function (val) {
        if (!arr2.includes(val))
            return val;
    });
}


/**
 * pathResolver : sets path for root folder and calls pathCollector
 * @param projectRootFolder : String, Project Root Folder/Directory
 * @param foldersAndFilesToIgnore : Array , holds name of files/folders not to be included in search.
 */
function pathResolver(projectRootFolder, foldersAndFilesToIgnore = []) {
    validDirectories.push(projectRootFolder);
    rootDirectoryName = projectRootFolder;
    let file = process.mainModule.filename;
    let index = file.lastIndexOf(projectRootFolder);
    let rootFolderPath = file.slice(0, index + projectRootFolder.length);
    let foldersAndFilesInRootFolder = fs.readdirSync(rootFolderPath);
    foldersAndFilesToBeScan = diffArray(foldersAndFilesInRootFolder, [...defaultFoldersAndFilesToIgnore, ...foldersAndFilesToIgnore]);
    pathCollector(foldersAndFilesToBeScan, rootFolderPath, projectRootFolder);
}


exports = module.exports = pathResolver;

/**
 * pathCollector: collects paths for all files.
 * @param foldersAndFilesToBeScan : array, holds names of files to be scanned for gathering paths
 * @param directoryPath: string, path of the current directory/folder or file being scanned.
 * @param directory: string, directory that is being scanned.
 */
function pathCollector(foldersAndFilesToBeScan, directoryPath, directory) {

    for (let item of foldersAndFilesToBeScan) {
        let tempDirectoryPath = directoryPath + "/" + item;
        let isDirectory = fs.statSync(tempDirectoryPath).isDirectory();
        if (isDirectory) {
            validDirectories.push(item);
            pathCollector(fs.readdirSync(tempDirectoryPath), tempDirectoryPath, item);
        } else {
            if (paths.hasOwnProperty(item)) {
                filesWithMultipleExistence.push(item);
                paths[directory + '-' + item] = tempDirectoryPath;
            } else {
                paths[item] = tempDirectoryPath;
            }

            folderWisePaths[directory + '-' + item] = tempDirectoryPath;
        }
    }
}

/**
 * extension : Appends default extension ".js", if not specified
 * @param fileName: string (not null), name the file of which path to be returned.
 * @returns {string}: path of the file
 */
function extension(fileName) {
    let ext = /[.]/.exec(fileName) ? /[^.]+$/.exec(fileName) : undefined;
    return ((ext && typeof ext === 'object') ? fileName : fileName + '.js');
}

/**
 * useFilePath: returns path of the file
 * @param fileName string (not null), filename
 * @param directory, string , Directory/folder in which file exists.
 * @returns {*}: paths of file , throws error if validations failed.
 */
function useFilePath(fileName, directory) {
    let isValidFileName = (fileName && typeof fileName === 'string');
    if (isValidFileName) {
        let file = extension(fileName);
        if (filesWithMultipleExistence.includes(file) && !(directory && typeof directory === 'string')) {
            throw new Error('file exists in multiple directories/folders. give a directory/folder name in which file exists');
        }

        if (directory && typeof directory === 'string') {
            if (validDirectories.includes(directory)) {
                file = (directory === rootDirectoryName) ? file : directory + '-' + file;
            }
            else {
                throw new Error('directory/folder does\'nt exist');
            }
        } else {
            if (!(typeof directory === 'undefined')) {
                throw new Error('directory/folder name must be a not null string');
            }
        }
        if (paths[file]) {
            return paths[file];
        }
        throw new Error('file does\'nt exist');
    }
    throw new Error('filename must be a not null string');

}

exports.useFilePath = useFilePath;
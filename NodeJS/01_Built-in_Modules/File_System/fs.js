// Import fs module to work with File_System in JS
import fs from 'fs';

// **************** Read File *****************
// read file using fs module
fs.readFile("./packages/File_System/textfile1.txt", "utf-8", (error, data) => {
    if (error) {
        console.log(error);
        return;
    }
    console.log(data);
    return data;
});

// ************* Create or Update File ****************
// The File_System module has methods for creating ./File_System/New_ files: [3]
// [1] fs.appendFile()  ==> method appends specified content to a file. If the file does not exist, the file will be created. Can be also used to update file.
fs.appendFile('./packages/File_System/New_appendfile.txt', 'Hello! This file is created using Append File Method in fs Module.', function (err) {
    if (err) throw err;
    console.log('append.txt file Saved!');
});

// [2] fs.open()  ==> method takes a "flag" as the second argument, if the flag is "w" for "writing", the specified file is opened for writing. If the file does not exist, an empty file is created
fs.open('./packages/File_System/New_open.txt', 'w', function (err, file) {
    if (err) throw err;
    console.log('open.txt file Saved!');
});

// [3] fs.writeFile()  ==> method replaces the specified file and content. Can be also used to update file.
fs.writeFile('./packages/File_System/New_writefile.txt', 'Hello! This file is created using Write File Method in fs Module.', function (err) {
    if (err) throw err;
    console.log('writefile.txt file Saved!');
});

// **************** Delete File **********************
// fs.unlink() ==>  method deletes the specified file

fs.unlink('./packages/File_System/New_appendfile.txt', function (err) {
    if (err) throw err;
    console.log('append.txt File deleted!');
});

//  ****************** Rename Files *******************
// The fs.rename() method renames the specified file:
fs.rename('./packages/File_System/New_open.txt', './packages/File_System/Renamed_File.txt', function (err) {
    if (err) throw err;
    console.log('open.txt File Renamed to Renamed_file.txt!');
});
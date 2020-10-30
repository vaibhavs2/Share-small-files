
# Share-small-files
Its helps to share small files and folders between devices, It's based on http. It will start a server on your system and provide you a link.
Put provided link in your device browser.
Start accessing your system's file remotely within range and click on files to download it.


#### When you need to share files between your phone and Laptop,
* connect them via hotspot or common wifi and run server.js file.
* You need to have nodeJs installed in laptop.
* Install a npm module
  * [Link](https://www.npmjs.com/package/formidable)

* Run in terminal and make sure server.js file is in current directory
```
$ node server.js
```
* you will get a link, put this link in your Phone's browser, you will see files/folder of directory where you started your terminal

## To Run from any directory
* Edit or make a .bashrc file put ```alias send_http="node /home/hurr/server.js"``` below the last line.
* send_http(put whatever you want) - command to start server,

## In terminal just write
```
$ send_http
```

![ScreenShot](https://github.com/vaibhavs2/Share-small-files/blob/master/screenshot.png)

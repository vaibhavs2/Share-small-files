
# Share-small-files
Its helps to share small files and folders between devices, It's based on http. It will start a server on your system, when it will run.
Put provided link in your browser.
Start accessing your file remotely within range and click on files to download it.

* If you need to share files between your phone and Laptop, connect them via hotspot or common wifi and run this file.

#### You need to have nodeJs installed.
Install a npm module
[Link](https://www.npmjs.com/package/formidable)

Run node server.js in terminal within correct directory.
It will show files in current directory and afterwards.

To Run from anywhere
Edit or make a .bashrc file put ```alias send_http="node /home/hurr/server.js"``` below the last line.
send_http(put whatever you want) - command to start server,

In terminal just write
```send_http```

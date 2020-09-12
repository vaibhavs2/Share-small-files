const fileSystem = require("fs");
const http = require("http");
const formidable = require("formidable");
const path = require("path");
const operatingSystem = require("os");

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  let chunks_iteration = 0,
    file_nth = 0;
  console.log(req.url);

  if (req.url === "/status") {
    res.setHeader("Content-Type", "text/html");
    res.end(`${formatBytes(chunks_iteration * 512 * 1024)} of (${file_nth})`);
    return;
  }

  if (req.url === "/") {
    res.setHeader("Content-Type", "text/html");
    res.write(readDirectory("./"));
    res.end();
    return;
  }
  if (req.url === "/send_files") {
    res.setHeader("Content-Type", "text/html");
    res.write(htmlForm());
    res.end();
    return;
  }
  if (req.url === "/file_submit") {
    const form = formidable({ multiples: true });
    form.parse(req, (err, fields, files) => {
      if (err) {
        console.log(err);
        res.end("Encounterd error");
        return;
      }
      ["file", "folder"].map((formItem) => {
        if (Array.isArray(files[formItem])) {
          files[formItem].map((each_file) => {
            let readStream = fileSystem.createReadStream(each_file.path, {
              highWaterMark: 512 * 1024,
            });
            if (!fileSystem.existsSync(path.dirname(each_file.name))) {
              fileSystem.mkdirSync(path.dirname(each_file.name));
            }

            file_nth++;
            readStream
              .on("data", function (chunk) {
                fileSystem.appendFileSync(each_file.name, chunk);
                chunks_iteration = ++chunks_iteration;
              })
              .on("end", function () {
                chunks_iteration = 0;
              });
          });
        } else {
          let readStream = fileSystem.createReadStream(files[formItem].path, {
            highWaterMark: 512 * 1024,
          });
          file_nth++;
          readStream
            .on("data", function (chunk) {
              fileSystem.appendFileSync(files[formItem].name, chunk);
              chunks_iteration = ++chunks_iteration;
            })
            .on("end", function () {
              chunks_iteration = 0;
            });
        }
      });
      res.setHeader("Content-Type", "text/html");
      res.write(htmlForm());
      res.end();
    });
  }
  var decodedUrl = decodeURIComponent(req.url);

  if (fileSystem.existsSync("." + decodedUrl)) {
    if (fileSystem.lstatSync("." + decodedUrl).isFile()) {
      var readStream = fileSystem.createReadStream("." + decodedUrl);
      readStream.pipe(res);
    } else {
      res.write(readDirectory("." + decodedUrl + "/"));
      res.end();
    }
  }
});

server.listen(5000, (err) => {
  if (!err) {
    console.log(`Server running at port 5000`);
    var n_interfaces = operatingSystem.networkInterfaces();
    if (n_interfaces.wlo1)
      n_interfaces.wlo1.map((each_interface) => {
        if (each_interface.family === "IPv4") {
          console.log(
            `Open Link in Browser http://${each_interface.address}:5000`
          );
          return;
        }
      });
    else {
      console.log(
        "You are not connected to any device, connect with mobile via hostpot/wifi then you can share files between your mobile and laptop\n"
      );

      console.log(
        "Still you can try it on this system , open http://localhost:5000"
      );
    }
  } else console.log(err);
});

function HtmlParent(insertion) {
  return `<!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>SHare</title>
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
        <script src="https://unpkg.com/htmx.org@0.0.8"></script>
        <link rel="icon" href="data:" type="image/x-icon" />
      </head>
      <body>
        <h2>Start share <span class="material-icons">description</span></h2>
        ${insertion}
        <footer style="position: absolute; left: 20px; bottom: 0">
          <p>©Copyright 2050 by nobody. All rights reversed.</p>
        </footer>
      </body>
    </html>`;
}

function readDirectory(read_path) {
  let tag = "",
    return_tag = "",
    eachfile_stat = "";
  fileSystem.readdirSync(read_path).map((fileName) => {
    eachfile_stat = fileSystem.lstatSync(read_path + fileName);
    if (eachfile_stat.isFile()) {
      tag = `<tr><td><span class="material-icons">description</span></td>
                <td><a href="${
                  read_path.replace(".", "") + fileName
                }" download title="Download" >${fileName}</a></td><td>${formatBytes(
        eachfile_stat.size
      )}</td></tr>`;
    } else {
      tag = `<tr><td><span class="material-icons">folder</span></td>
            <td><a href="${
              read_path.replace(".", "") + fileName
            }" title="Open" >${fileName}/</a></td></tr>`;
    }
    return_tag = return_tag + tag;
  });
  return_tag = ` 
  <a href="/send_files" type=button ><button>Send files</button></a>
  <main style="margin-top:40px; overflow: auto;max-height: 75vh;">
  <table>
      <thead><tr><th>Files</th></tr></thead>
        <tbody>
          ${return_tag}
         </tbody>
        </table></main>`;
  return HtmlParent(return_tag);
}

function htmlForm() {
  var return_form = `<a href="/" ><button>Get files</button></a>
  <main style="margin-top:40px">
   <form action="/file_submit" enctype="multipart/form-data" method="POST">
    <label for="file">Upload files</label>
    <input type="file" name="file" id="file" multiple />
    <h4 style="margin-left: 18px">or</h4>
    <label for="folder">Upload folder</label>
    <input type="file" name="folder" id="folder" webkitdirectory multiple /><br />
    <input
      type="submit"
      name="submit"
      onclick="replaceDiv()"
      id="submit"
      style="margin-left: 20px; margin-top: 40px"
    />
  </form>
  <div id="toReplace">
    </div>
  </main>
  <script>
  function replaceDiv() {
    document.getElementById("toReplace").innerHTML = "<div hx-get="/status" hx-trigger="every 1s"> </div>"
};
  </script>
  `;
  return HtmlParent(return_form);
}
//b :) decimals
function formatBytes(a, b = 2) {
  if (0 === a) return "0 Bytes";
  const c = 0 > b ? 0 : b,
    d = Math.floor(Math.log(a) / Math.log(1024));
  return (
    parseFloat((a / Math.pow(1024, d)).toFixed(c)) +
    " " +
    ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"][d]
  );
}

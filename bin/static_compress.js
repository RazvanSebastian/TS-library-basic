const fs = require("fs");
const zlib = require("zlib");
const fileExtensions = [".js", ".css", ".html", ".json"];
const recursive = require("recursive-readdir");

recursive("dist/", function(error, files) {
  for (const file of files) {
    for (const fileExtension of fileExtensions) {
      if (file.endsWith(fileExtension)) {
        gzipCompress(file);
        brotliCompress(file);
      }
    }
  }
});

function gzipCompress(file) {
  const readable = fs.createReadStream(file);
  const gzipCompressor = zlib.createGzip({
    chunkSize: 32 * 1024,
    level: 9,
  });
  const gzipOutput = fs.createWriteStream(file + ".gz");
  readable.pipe(gzipCompressor).pipe(gzipOutput);
}

function brotliCompress(file) {
  const readable = fs.createReadStream(file);
  const brotliCompressor = zlib.createBrotliCompress({
    chunkSize: 32 * 1024,
    params: {
      [zlib.constants.BROTLI_PARAM_MODE]: zlib.constants.BROTLI_MODE_TEXT,
      [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
      [zlib.constants.BROTLI_PARAM_SIZE_HINT]: fs.statSync(file).size,
    },
  });
  const brotliOutput = fs.createWriteStream(file + ".br");
  readable.pipe(brotliCompressor).pipe(brotliOutput);
}

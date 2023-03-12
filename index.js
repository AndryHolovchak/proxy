const http = require("http");
const https = require("https");
const url = require("url");

const DEEZER_API_BASE_URL = "https://api.deezer.com";

const proxy = http.createServer((req, res) => {
  // Parse the incoming request URL
  const reqUrl = url.parse(req.url);

  // Build the target URL for the Deezer API
  const targetUrl = DEEZER_API_BASE_URL + reqUrl.path;

  // Create the proxy request to the Deezer API
  const proxyReq = https.request(targetUrl, (proxyRes) => {
    // Set the headers of the response
    res.writeHead(proxyRes.statusCode, proxyRes.headers);

    // Pipe the response from the Deezer API to the client
    proxyRes.pipe(res);
  });

  // Handle errors in the proxy request
  proxyReq.on("error", (err) => {
    console.error(`Proxy request error: ${err}`);
    res.statusCode = 500;
    res.end("Proxy request error");
  });

  // Pipe the incoming request to the proxy request
  req.pipe(proxyReq);
});

proxy.listen(3000, () => {
  console.log("Proxy server listening on port 3000");
});

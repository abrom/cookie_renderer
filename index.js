const http = require('http');
const url = require('url');

http.createServer((request, response) => {
  let valueLookup = {}, index = 0, requestType;

  const query = url.parse(request.url, true).query;

  if (query.type === 'headers') {
    requestType = 'header';
    valueLookup = request.headers;
  } else {
    requestType = 'cookie';
    const requestCookie = request.headers.cookie;
    requestCookie && requestCookie.split(";").forEach((cookie) => {
      const parts = cookie.split("=");
      valueLookup[parts.shift().trim()] = decodeURIComponent(parts.join("="));
    });
  }
  const names = Object.keys(valueLookup);
  const requestTitle = requestType[0].toUpperCase() + requestType.substring(1)

  response.writeHead(200, { "Content-Type": "text/html" });
  response.end(
    `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          table { margin-top: 10px; border-collapse: collapse; border-spacing: 0; }
          th { border-bottom: 1px solid #ddd; }
          th, td { padding: 8px; }
          td.cookie-value { word-break: break-all; }
          tr.empty { font-style: italic; text-align: center; }
        </style>
      </head>
      <body>
        Request contained ${names.length} ${requestType}${names.length == 1 ? '' : 's'}
        <table>
          <thead>
            <tr>
              <th></th>
              <th>${requestTitle} name</th>
              <th>${requestTitle} value</th>
            </tr>
          </thead>
          <tbody>
          ${
            names.map((key) => {
              index += 1;
              return `<tr><td>${index}.</td><td>${key}</td><td class="cookie-value">${valueLookup[key]}</td></tr>`
            }).join('') || '<tr class="empty"><td colspan="3">Nothing to see here</td></tr>'
          }
          </tbody>
        </table>
      </body>
    </html>
    `
  );
}).listen(process.env.PORT);

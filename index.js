const http = require('http');

http.createServer((request, response) => {
  const requestCookie = request.headers.cookie;
  let cookies = {}, index = 0, cookie_names;

  requestCookie && requestCookie.split(";").forEach((cookie) => {
    const parts = cookie.split("=");
    cookies[parts.shift().trim()] = decodeURI(parts.join("="));
  });
  cookie_names = Object.keys(cookies);

  response.writeHead(200, { "Content-Type": "text/html" });
  response.end(
    `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          table { margin-top: 10px; border-collapse: collapse; border-spacing: 0; }
          th { border-bottom: 1px solid #ddd; }
          td { padding: 8px; }
          td.cookie-value { word-break: break-all; }
          tr.empty { font-style: italic; text-align: center; }
        </style>
      </head>
      <body>
        Request contained ${cookie_names.length} cookie${cookie_names.length == 1 ? '' : 's'}
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Cookie name</th>
              <th>Cookie value</th>
            </tr>
          </thead>
          <tbody>
          ${
            cookie_names.map((key) => {
              index += 1;
              return `<tr><td>${index}</td><td>${key}</td><td class="cookie-value">${cookies[key]}</td></tr>`
            }).join('') || '<tr class="empty"><td colspan="3">Nothing to see here</td></tr>'
          }
          </tbody>
        </table>
      </body>
    </html>
    `
  );
}).listen(process.env.PORT);

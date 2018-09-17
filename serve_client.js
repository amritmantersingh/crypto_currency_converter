const handler = require('serve-handler');
const http = require('http');

const server = http.createServer((request, response) => {
    return handler(request, response, {
        "public": "./build"
    });
})

server.listen(8844, () => {
    console.log('Running chat client at http://localhost:8844');
});
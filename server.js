const server = Bun.serve({
        port: 3000, // You can change the port if needed
        async fetch(req, serv) {
            const url = new URL(req.url);
            let file = getFile(url.pathname)
            if (file) {
                const content = await file.arrayBuffer();
                // Compress the content
                const compressed = Bun.gzipSync(Buffer.from(content));
                
                let contentType;
                
                switch (url.pathname.split('.').pop()) {
                    case 'css':
                        contentType = 'text/css';
                        break;
                    case 'js':
                        contentType = 'application/javascript';
                        break;
                    case 'ico':
                        contentType = 'image/x-icon';
                        break;
                    case 'html':
                        contentType = 'text/html';
                        break;
                    default:
                        contentType = 'text/plain'
                        break
                }
                
                if (url.pathname === "/") {
                    contentType = 'text/html';
                }
                const ip = serv.requestIP(req);
                console.log(`[${new Date().toLocaleTimeString()}]`, req.method, req.url, `(${req.headers.get('User-Agent')})`, ip.address);

                return new Response(compressed, {
                    headers: {
                        'Content-Type': contentType,
                        'Content-Encoding': 'gzip'
                    }})
            }
            else  {
                return new Response("404 Not Found", {status: 404});
            }
            
            function getFile() {
                if (url.pathname === "/") return Bun.file('./dist/index.html');
                if (url.pathname.endsWith('.js') || url.pathname.endsWith('.js') || url.pathname.endsWith('.css') || url.pathname.endsWith('.html') || url.pathname.endsWith('.ico')) {
                    return Bun.file('./dist' + url.pathname);
                } 
                return false;
            }
            
        }
});
console.log(`Listening on ${server.url}`);


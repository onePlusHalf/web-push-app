const http = require('http');
const fs = require('fs');
const {parse} = require('querystring');
const webPush = require('web-push');
const dummySubDB = {
    subscription: null
};

// This will generate a public and private key pair
// We can use any other method too, but this is straight-forward
// These will be used here in server as well as in client
const keys = webPush.generateVAPIDKeys();
console.log('Vapid Keys: ', keys);

// This sets private-public key pair
webPush.setVapidDetails('mailto:rahul.kumar.kaushik@outlook.com', keys.publicKey, keys.privateKey);

const server = http.createServer((req, res) => {
    if (req.url === '/') {
        fs.readFile('./index.html', null, function (error, data) {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            res.end();
        })
    } else if (req.url === '/sendNotification') {
        webPush.sendNotification(
            dummySubDB.subscription,
            JSON.stringify({title: 'This is custom Node Js Web Push Notification, stay tuned for more.'}))
            .catch((e) => {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'text/plain');
                res.end('Notification Not Sent');
            });
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Notification Sent');
    } else if (req.url === '/save-subscription') {
        let body = {
            data: ''
        };
        req.on('data', chunk => {
            body.data += chunk.toString(); // convert Buffer to string
            console.log('body : ', (body));

        });
        req.on('end', () => {
        	console.log('parse data : ' , JSON.parse(body.data));
            dummySubDB.subscription = JSON.parse(body.data);
            res.end('ok');
        });
        res.end('Success');
    } else {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Hello, World');
    }
});

server.listen(3001, '127.0.0.1', () => {
    console.log('Server started on localhost');
});

# web-push-app
Front End and Back end to demo push notification

# How to use ?
## First start with back-end
#### In back-end
- npm i
- npm run start (server is designed to start on 3001)
- Copy Public Key which is console.logged, paste it in front-end->service.js#Line:81
- (Now do front-end steps and save-subscription in server to start sending notifications)
- Hit /sendNotification in server through Postman or Browser and you should see notification

#### In front-End
- npm i
- npm run start
- Click on Ask Permission Button -> Allow (This will also save-subscription to server, so server should be started by this time)


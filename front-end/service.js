console.log('In Service.js');

// Below are the exhaustive list of options that can be shown on notification banner.
const options  = (body) => ({
	"//": "Visual Options",
	"body": body,
	// "icon": "<URL String>",
	// "image": "<URL String>",
	// "badge": "<URL String>",
	// "vibrate": "<Array of Integers>",
	// "sound": "<URL String>",
	// "dir": "<String of 'auto' | 'ltr' | 'rtl'>",

	"//": "Behavioural Options",
	// "tag": "<String>",
	// "data": "<Anything>",
	// "requireInteraction": "<boolean>",
	// "renotify": "<Boolean>",
	// "silent": "<Boolean>",

	"//": "Both Visual & Behavioural Options",
	// "actions": "<Array of Strings>",

	"//": "Information Option. No visual affect.",
	// "timestamp": "<Long>"
  });

const urlB64ToUint8Array = base64String => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/')
    const rawData = atob(base64)
    const outputArray = new Uint8Array(rawData.length)
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  };

  // This will call the API Server to save this users/browsers subscription
  // with subscription as parameter.
const saveSubscription = async (subscription) => {
    const SERVER_URL = 'http://localhost:3001/save-subscription';
    console.log(SERVER_URL );//= 'http://localhost:3001/save-subscription';
    let response;
    try{
        response = await fetch(SERVER_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify(subscription)
            }
        );
    } catch(e) {
        console.log('Error in getch : ' + e);
    }
    return response.json();
};

const showLocalNotifications = (title, body, swRegistration) => {
    const notificationOptions = options(JSON.parse(body).title);

    try{
        // This uses Service Workers showNotification method to show system notification
        swRegistration.showNotification(title, notificationOptions);
    } catch(e){
        console.log('Error sending notification : ' + e);
    }
};

// This adds a listener for when Service Worker is getting registered
// This will only execute once, otherwise need to unregister and register sw again to execute this.
self.addEventListener('activate', async () => {
	console.log('Activate event listener');
    try {
        // For Google Chrome, both are mandatory
        // applicationServerKey is the publicKey from VAPID Keys generated and used/stored in Server
        const subscriptionOptions = {
            applicationServerKey : urlB64ToUint8Array('BFOSfZuIJL_ONOdUe78kRJFobfF8ANGT32gaYu9FYiEEiZfF-ij53nsxY3OqPVMXyDAmlSS2cfB2r5kJph2Cxz8'), // use public key generated in server
            userVisibleOnly : true
        };

        // This actually gives a subscription url which is sent to API server for registration
        // this gives new endpoint, every time this is called, a unique endpoint
        const subscription = await self.registration.pushManager.subscribe(subscriptionOptions);
        console.log('subscription : ', subscription);
        const serverResponse = await saveSubscription(subscription);

    } catch(e) {
        console.log('Push Subscription Failed with : ' + e);
    }
});

// This listens for push type event, which will be triggered when sending push from server.
self.addEventListener('push', (event) => {
    console.log('Got a push, yayy');
    if(event.data) {
        showLocalNotifications('Hello', event.data.text(), self.registration);
    } else {
        console.log('Kiene Datum');
    }
});

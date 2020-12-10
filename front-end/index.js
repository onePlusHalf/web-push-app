
const checkServiceWorkerSupport = () => {
	if(!'serviceWorker' in navigator) {
		throw new Error('serviceWorker not supported');
	}
};

const checkPushManagerSupport = () => {
	if(!'PushManager' in window) {
		throw new Error('PushManager not supported');
	}
};

const requestNotificationPermission = async () => {
	const permission = await window.Notification.requestPermission();

	if(permission !== 'granted') {
		throw new Error('Permission to show push notifications not granted');
	}
};

const registerServiceWorker = async () => {
	const swRegistration = await navigator.serviceWorker.register('./service.js');
	return swRegistration;
};

const mainMethod = async () => {
	try {
		checkServiceWorkerSupport();
		checkPushManagerSupport();

		const swRegistration = await registerServiceWorker();
		const permission = await requestNotificationPermission();
	} catch(e) {
		console.log('Error Initializing Server Worker :', e);
	}
};

const logSomething = () => {
	console.log('This will log while asking for permission, or not ??');
};

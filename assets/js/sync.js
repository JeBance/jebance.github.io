let sync = new Object();

sync.synchronization = async function()
{
//	myHub.xhr({request:'ping'}).then((value) => {
//		if (value.result == 'pong') {

			if (myHub.publicKey == null) {
				myHub.xhr({request:'getServerPublicKey'})
					.then((value) => {
						result = new Object(value);
						if (result.result == 'ok') myHub.publicKey = result.serverPublicKey;
					})
					.catch((error) => console.error(`${error}`));
			}

			if (secureStorage.activeAllSecureData()) {
				let JSONstring = JSON.stringify({ request: 'getNewMessages' });
				myHub.xhr({request: JSONstring})
					.then((value) => {
						console.log(value);
					})
					.catch((error) => console.error(`${error}`));
			}

//		}
//	});

}

setInterval(sync.synchronization, 3000);

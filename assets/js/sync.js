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
						if (value.result == 'ok') {
							let messagesKeys = Object.keys(value.newMessages);
							for (let i = 0, l = messagesKeys.length; i < l; i++) {
								if (value.newMessages[messagesKeys[i]]['request'] == 'addMe') {
									let timestamp = value.newMessages[messagesKeys[i]]['from']['timestamp'];
									dbInit().then((db) => {
										let transaction = db.transaction("messages", "readwrite");
										let messagesStore = transaction.objectStore("messages");

										let addedMessage = {
											id: messagesKeys[i],
											chat: value.newMessages[messagesKeys[i]]['from']['fingerprint'],
											from: value.newMessages[messagesKeys[i]]['from']['fingerprint'],
											timestamp: value.newMessages[messagesKeys[i]]['from']['timestamp'],
											message: value.newMessages[messagesKeys[i]]['message'],
											request: 'addMe',
											wasRead: false
										};

										let request = messagesStore.add(addedMessage);

										request.onsuccess = function() {
											console.log(request.result + ' - новый запрос контакта от ' + value.newMessages[messagesKeys[i]]['from']['fingerprint']);
										};

										transaction.oncomplete = function() {
											chat.chatBlockUpdate();
										};

										request.onerror = function() {
											let request = event.target;
											console.error("Ошибка", request.error);
										};
									});
								}
							}
														
						}
					})
					.catch((error) => console.error(`${error}`));
			}

//		}
//	});

}

setInterval(sync.synchronization, 3000);

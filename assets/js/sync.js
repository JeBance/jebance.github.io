let sync = new Object();

sync.synchronization = async function()
{
	if (myHub.publicKey == null) {
		myHub.xhr({request:'getServerPublicKey'})
			.then((value) => {
				result = new Object(value);
				if (result.result == 'ok') myHub.publicKey = result.serverPublicKey;
			})
			.catch((error) => console.error(`${error}`));
	}

	if ((secureStorage.activeAllSecureData()) && (myHub.publicKey !== null)) {
		let JSONstring = JSON.stringify({ request: 'getNewMessages' });
		let request = await myHub.xhr({request: JSONstring }).then((value) => { return value; });

		if (request.result == 'ok') {
			let messagesKeys = Object.keys(request.newMessages);
			let message = new Message();

			for (let i = 0, l = messagesKeys.length; i < l; i++) {
				if ((await message.init(messagesKeys[i])) == false) {
					message.id = messagesKeys[i];
					message.chat = request.newMessages[messagesKeys[i]]['from']['fingerprint'];
					message.from = request.newMessages[messagesKeys[i]]['from']['fingerprint'];
					message.timestamp = request.newMessages[messagesKeys[i]]['from']['timestamp'];
					message.message = request.newMessages[messagesKeys[i]]['message'];
					message.request = request.newMessages[messagesKeys[i]]['request'];
					message.wasRead = false;

					if (request.newMessages[messagesKeys[i]]['request'] == 'addMe') {
						await message.save();
						// если приходит запрос на добавление от собеседника, то проверяем, добавляли ли мы его раньше
						let contact = new Contact();
						if (await contact.init(request.newMessages[messagesKeys[i]]['from']['fingerprint'])) {
							if (contact.publicKey.length > 0) {
								// если добавляли, то напоминаем ему свой публичный ключ
								let string = JSON.stringify({ myPublicKey: secureStorage.publicArmoredKey });
								let encryptedMessage = await secureStorage.encryptMessage(contact.publicKey, string);
								let JSONstring = JSON.stringify({ request: 'sendMessage', to: contact.fingerprint, message: encryptedMessage });
								await myHub.xhr({request: JSONstring }).then((value) => { return value; });
							}
						}

					} else if (request.newMessages[messagesKeys[i]]['request'] == 'sendMessage') {
						if ((message.message.length > 0) && (message.from !== secureStorage.fingerprint)) {
							try {
								message.message = await secureStorage.decryptMessage(message.message);
								await message.save();
								if (message.message.myPublicKey) {
									let contact = new Contact();
									if (await contact.init(request.newMessages[messagesKeys[i]]['from']['fingerprint'])) {
										if (contact.publicKey.length == 0) {
											let invitation = await message.checkInvite(request.newMessages[messagesKeys[i]]['from']['fingerprint']);
											if ((invitation.message) && (invitation.wasRead)) {
												let publicArmoredKey = message.message.myPublicKey;
												let publicKey = await openpgp.readKey({ armoredKey: publicArmoredKey });
												let nickname = publicKey.users[0].userID.name;
												let email = publicKey.users[0].userID.email;
												let fingerprint = (publicKey.getFingerprint()).toUpperCase();
												if (fingerprint == request.newMessages[messagesKeys[i]]['from']['fingerprint']) {
													contact.fingerprint = fingerprint;
													contact.publicKey = publicArmoredKey;
													contact.nickname = nickname;
													contact.email = email;
													await contact.save();
												}
											}
										}
									}
								}
							} catch(e) {
								console.error('Ошибка: Некорректное сообщение.\n' + e.message);
							}
						}

					}

					contact.contactBlockUpdate();
					chat.chatBlockUpdate();
					
					if (localStorage.recipientFingerprint == message.from)
					chat.getMessage(message);
				}
			}
		}
	}
}

setInterval(sync.synchronization, 3000);

localStorage.recipientFingerprint = '';
localStorage.recipientPublicKey = '';





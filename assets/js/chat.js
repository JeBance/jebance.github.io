let chat = new Object();

chat.closeModal = function()
{
	let modalAccessBlock = document.getElementsByName('modalForContactAccessForm');
	modalAccessBlock[0].remove();
	shadeContactAccept.remove();
}

chat.addNew = async function(id)
{
	if (contactAccessPassword.value.length > 0) {
		let message = new Message();
		let allMessages = await message.getAllMessagesFromChat(id);

		let lastAddContactMessage = new Object();
		for (let i = 0, l = allMessages.length; i < l; i++) {
			if (allMessages[i].request == 'addMe') {
				lastAddContactMessage = allMessages[i];
			}
		}

		if (lastAddContactMessage.message.length > 0) {
			let decrypted = await secureStorage.decryptMessageSymmetricallyWithCompression(lastAddContactMessage.message, contactAccessPassword.value);
			if ((decrypted) && (decrypted.myPublicKey.length > 0)) {
				let contact = new Contact();
				if (await contact.init(id)) {
					if (contact.publicKey.length == 0) {
						let publicArmoredKey = decrypted.myPublicKey;
						let publicKey = await openpgp.readKey({ armoredKey: publicArmoredKey });
						let nickname = publicKey.users[0].userID.name;
						let email = publicKey.users[0].userID.email;
						let fingerprint = (publicKey.getFingerprint()).toUpperCase();
						if (fingerprint == id) {
							contact.fingerprint = fingerprint;
							contact.publicKey = publicArmoredKey;
							contact.nickname = nickname;
							contact.email = email;
							await contact.save();

							await message.init(lastAddContactMessage.id);
							message.wasRead = true;
							await message.save();

							let string = JSON.stringify({ myPublicKey: secureStorage.publicArmoredKey });
							let encryptedMessage = await secureStorage.encryptMessage(publicArmoredKey, string);
							let JSONstring = JSON.stringify({ request: 'sendMessage', to: fingerprint, message: encryptedMessage });
							await myHub.xhr({request: JSONstring }).then((value) => { return value; });

							chat.chatBlockUpdate();
							chat.closeModal();
						}
					}
				}
			}
		} else {
			alert('Не найдено приглашение на добавление контакта!');
			chat.closeModal();
		}
	} else {
		alert('Введите пароль!');
	}
}

chat.chatBlockUpdate = async function()
{
	chats.innerHTML = '';
	let message = new Message();
	let allMessages = await message.getAllMessages();
	let allChats = new Object();
	for (let i = 0, l = allMessages.length; i < l; i++) {
		if ((allMessages[i].chat in allChats) == false) {
			allChats[allMessages[i].chat] = allMessages[i]['message'];
			chat.getChatButton(allMessages[i]);
		}
	}
}

chat.getChatButton = async function(obj)
{
	console.log(obj);

	let contact = new Contact();
	await contact.init(obj.chat);

	let newContainerForChat = document.createElement('div');
	newContainerForChat.id = obj.chat;
	newContainerForChat.setAttribute('name', 'chat');
	newContainerForChat.className = 'leftItem';
	newContainerForChat.setAttribute('onclick', 'chat.getChat(\''+obj.chat+'\')');
	let newDivForAvatar = document.createElement('div');
	newDivForAvatar.className = 'avatar';
	let newDivForLeftItemInfo = document.createElement('div');
	newDivForLeftItemInfo.className = 'leftItemInfo';
	let newDivForLeftItemInfoTop = document.createElement('div');
	newDivForLeftItemInfoTop.className = 'leftItemInfoTop';
	let newDivForLeftItemInfoBottom = document.createElement('div');
	newDivForLeftItemInfoBottom.className = 'leftItemInfoBottom';
	let newDivForLeftItemInfoName = document.createElement('div');
	newDivForLeftItemInfoName.className = 'leftItemInfoName';
	if (contact.publicKey.length == 0) {
		newDivForLeftItemInfoName.innerHTML = 'Ожидает подтверждения';
		newDivForLeftItemInfoName.setAttribute('style', 'color:red;');
	} else {
		newDivForLeftItemInfoName.innerHTML = contact.nickname;
	}
	let newDivForLeftItemInfoTime = document.createElement('div');
	newDivForLeftItemInfoTime.className = 'leftItemInfoTime';
	newDivForLeftItemInfoTime.innerHTML = timestampToTime(obj.timestamp);
	let newDivForLeftItemInfoText = document.createElement('div');
	newDivForLeftItemInfoText.className = 'leftItemInfoText';
	if (contact.publicKey.length == 0) {
		newDivForLeftItemInfoText.innerHTML = obj.chat;
	} else {
		if (obj.request == 'addMe') {
			newDivForLeftItemInfoText.innerHTML = 'Запрос на добавление контакта';
		} else {
			newDivForLeftItemInfoText.innerHTML = obj.message.message;
		}
	}
	let newDivForLeftItemInfoCounter = document.createElement('div');
	newDivForLeftItemInfoCounter.id = obj.chat;
	newDivForLeftItemInfoCounter.setAttribute('name', 'inboxCounter');
	newDivForLeftItemInfoCounter.className = 'leftItemInfoCounter';
	if (obj.wasRead == false) {
		newDivForLeftItemInfoCounter.innerHTML = '1';
	} else {
		newDivForLeftItemInfoCounter.innerHTML = '';
	}
	newDivForLeftItemInfoTop.append(newDivForLeftItemInfoName);
	newDivForLeftItemInfoTop.append(newDivForLeftItemInfoTime);
	newDivForLeftItemInfoBottom.append(newDivForLeftItemInfoText);
	newDivForLeftItemInfoBottom.append(newDivForLeftItemInfoCounter);
	newDivForLeftItemInfo.append(newDivForLeftItemInfoTop);
	newDivForLeftItemInfo.append(newDivForLeftItemInfoBottom);
	newContainerForChat.append(newDivForAvatar);
	newContainerForChat.append(newDivForLeftItemInfo);
	chats.append(newContainerForChat);
}

chat.getChat = async function(id)
{
	chatReadArea.innerHTML = '';
	let contact = new Contact();
	if (await contact.init(id)) {
		if (contact.publicKey.length == 0) {
			if (id !== secureStorage.fingerprint)
			chat.getAddContactAccessForm(id);
		} else {
			localStorage.recipientFingerprint = contact.fingerprint;
			localStorage.recipientPublicKey = contact.publicKey;
			let message = new Message();
			let allMessages = await message.getAllMessagesFromChat(id);
			for (let i = 0, l = allMessages.length; i < l; i++) {
				chat.getMessage(allMessages[i]);
			}
			blockCenter.show('center');
			blockCenterCenter.scrollTop = blockCenterCenter.scrollHeight;
		}
	}
}

chat.getMessage = async function(obj)
{
	console.log(obj);
	let newContainerForMessage = document.createElement('div');
	newContainerForMessage.id = obj.id;
	newContainerForMessage.setAttribute('name', 'message');
	if (obj.from == secureStorage.fingerprint) {
		newContainerForMessage.className = 'message outgoingMessage';
		newContainerForMessage.innerHTML = obj.message;
	} else if (obj.from == obj.chat) {
		newContainerForMessage.className = 'message incomingMessage';
		if ((obj.request !== 'addMe') && (obj.message.message)) newContainerForMessage.innerHTML = obj.message.message;
	} else {
		newContainerForMessage.className = 'message outgoingMessage';
		newContainerForMessage.innerHTML = obj.message;
	}
	if (obj.request == 'addMe') newContainerForMessage.innerHTML = 'Запрос на добавление контакта';

	let newContainerForTime = document.createElement('div');
	newContainerForTime.id = obj.id;
	newContainerForTime.setAttribute('name', 'message');
	(obj.from == obj.chat)
	? newContainerForTime.className = 'leftMessageTime'
	: newContainerForTime.className = 'rightMessageTime';
	newContainerForTime.innerHTML = timestampToTime(obj.timestamp);

	newContainerForMessage.append(newContainerForTime);
	chatReadArea.append(newContainerForMessage);
	blockCenterCenter.scrollTop = blockCenterCenter.scrollHeight;
}

chat.getAddContactAccessForm = function(id)
{
	let newContainerForModal = document.createElement('div');
	newContainerForModal.id = id;
	newContainerForModal.setAttribute('name', 'modalForContactAccessForm');
	newContainerForModal.className = 'modalContact';
	newContainerForModal.innerHTML = '<h2>Новый контакт</h2><p>Введите пароль указанный собеседником.</p>';
	let newContainerForForm = document.createElement('div');
	newContainerForForm.className = 'form';
	let newInputForPassword = document.createElement('input');
	newInputForPassword.id = 'contactAccessPassword';
	newInputForPassword.type = 'password';
	newInputForPassword.setAttribute('onkeydown', '{if(event.key==\'Enter\')acceptNewContact.click()}');
	newInputForPassword.placeholder = 'Пароль';
	let newButton = document.createElement('button');
	newButton.id = 'acceptNewContact';
	newButton.setAttribute('onclick', 'chat.addNew(\''+id+'\')');
	newButton.innerHTML = 'Подтвердить';
	newContainerForForm.append(newInputForPassword);
	newContainerForForm.append(newButton);
	newContainerForModal.append(newContainerForForm);
	document.body.append(newContainerForModal);
	let newShade = document.createElement('div');
	newShade.id = 'shadeContactAccept';
	newShade.className = 'shade';
	newShade.setAttribute('onclick', 'chat.closeModal()');
	document.body.append(newShade);
	newInputForPassword.focus();
}

chat.sendMessage = async function()
{
	if (messageInput.value.length > 0) {
		let string = JSON.stringify({ message: messageInput.value });
		let encryptedMessage = await secureStorage.encryptMessage(localStorage.recipientPublicKey, string);
		let JSONstring = JSON.stringify({ request: 'sendMessage', to: localStorage.recipientFingerprint, message: encryptedMessage });
//		console.log(JSONstring);
		let request = await myHub.xhr({request: JSONstring }).then((value) => { return value; });
//		console.log(request);
		if (request.result == 'ok') {
			let message = {
				id: request.response,
				chat: localStorage.recipientFingerprint,
				from: secureStorage.fingerprint.toUpperCase(),
				message: String(messageInput.value),
				request: 'sendMessage',
				timestamp: Math.floor(Date.now() / 1000),
				wasRead: false
			}
			chat.getMessage(message);
			// сохранить сообщение в БД
			let db = await dbInit().then((db) => { return db; });
			let transactionMessages = db.transaction("messages", "readwrite");
			let messagesStore = transactionMessages.objectStore("messages");
			let requestMessages = messagesStore.add(message);
			x = new Promise((resolve, reject) => {
				requestMessages.onsuccess = function() { resolve(requestMessages.result); }
			});
			await x.then((value) => { return value; });
			messageInput.value = '';
		}
	}
}

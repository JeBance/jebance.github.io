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
		let db = await dbInit().then((db) => { return db; });
		let transactionMessages = db.transaction("messages", "readonly");
		let messagesStore = transactionMessages.objectStore("messages");
		let chatIndex = messagesStore.index("chat_id");

		let requestMessages = chatIndex.getAll(id);
		x = new Promise((resolve, reject) => {
			requestMessages.onsuccess = function() { resolve(requestMessages.result); }
		});
		let allMessages = await x.then((value) => { return value; });
//		let allMessages = await (new Promise((resolve, reject) => { requestMessages.onsuccess = function() { resolve(requestMessages.result); }})).then((value) => { return value; });

		let lastAddContactMessage = new Object();
		for (let i = 0, l = allMessages.length; i < l; i++) {
			if (allMessages[i].request == 'addMe') {
				lastAddContactMessage = allMessages[i];
			}
		}

		if (lastAddContactMessage.message.length > 0) {
			let decrypted = await secureStorage.decryptMessageSymmetricallyWithCompression(lastAddContactMessage.message, contactAccessPassword.value);
			if ((decrypted) && (decrypted.myPublicKey.length > 0)) {
				let publicArmoredKey = decrypted.myPublicKey;
				let publicKey = await openpgp.readKey({ armoredKey: publicArmoredKey });
				let nickname = publicKey.users[0].userID.name;
				let email = publicKey.users[0].userID.email;
				let fingerprint = (publicKey.getFingerprint()).toUpperCase();
				if (fingerprint == id) {
					let transactionContacts = db.transaction("contacts", "readwrite");
					let contactsStore = transactionContacts.objectStore("contacts");
					let addedContact = {
						fingerprint: fingerprint,
						publicKey: publicArmoredKey,
						nickname: nickname,
						email: email
					};
					let requestContacts = contactsStore.put(addedContact);
					x = new Promise((resolve, reject) => {
						requestContacts.onsuccess = function() { resolve(requestContacts.result); }
					});
					let contact = await x.then((value) => { return value; });

					lastAddContactMessage.wasRead = true;

					let transactionMessages = db.transaction("messages", "readwrite");
					let messagesStore = transactionMessages.objectStore("messages");

					let requestMessages = messagesStore.put(lastAddContactMessage);
					x = new Promise((resolve, reject) => {
						requestMessages.onsuccess = function() { resolve(requestMessages.result); }
					});
					let putMessage = await x.then((value) => { return value; });

					let chatIndex = messagesStore.index("chat_id");
					requestMessages = chatIndex.getAll(id);
					x = new Promise((resolve, reject) => {
						requestMessages.onsuccess = function() { resolve(requestMessages.result); }
					});
					let allMessages = await x.then((value) => { return value; });

					chat.chatBlockUpdate();
					chat.closeModal();
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
	let db = await dbInit().then((db) => { return db; });
	let transaction = db.transaction("messages", "readonly");
	let messagesStore = transaction.objectStore("messages");
	let chatIndex = messagesStore.index("chat_id");
	let requestMessages = chatIndex.getAll();
	x = new Promise((resolve, reject) => {
		requestMessages.onsuccess = function() { resolve(requestMessages.result); }
	});
	let allMessages = await x.then((value) => { return value; });
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

	let db = await dbInit().then((db) => { return db; });
	let transactionContacts = db.transaction("contacts", "readonly");
	let contactsStore = transactionContacts.objectStore("contacts");
	let requestContacts = contactsStore.get(obj.chat);
	x = new Promise((resolve, reject) => {
		requestContacts.onsuccess = function() { resolve(requestContacts.result); }
	});
	let contactInfo = await x.then((value) => { return value; });

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
	if (contactInfo.publicKey.length == 0) {
		newDivForLeftItemInfoName.innerHTML = 'Ожидает подтверждения';
		newDivForLeftItemInfoName.setAttribute('style', 'color:red;');
	} else {
		newDivForLeftItemInfoName.innerHTML = contactInfo.nickname;
	}
	let newDivForLeftItemInfoTime = document.createElement('div');
	newDivForLeftItemInfoTime.className = 'leftItemInfoTime';
	newDivForLeftItemInfoTime.innerHTML = timestampToTime(obj.timestamp);
	let newDivForLeftItemInfoText = document.createElement('div');
	newDivForLeftItemInfoText.className = 'leftItemInfoText';
	if (contactInfo.publicKey.length == 0) {
		newDivForLeftItemInfoText.innerHTML = obj.chat;
	} else {
		if (obj.request == 'addMe') {
			newDivForLeftItemInfoText.innerHTML = 'Запрос на добавление контакта';
		} else {
			newDivForLeftItemInfoText.innerHTML = obj.message;
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
	let db = await dbInit().then((db) => { return db; });
	let transactionContacts = db.transaction("contacts", "readonly");
	let contactsStore = transactionContacts.objectStore("contacts");
	let requestContacts = contactsStore.get(id);
	x = new Promise((resolve, reject) => {
		requestContacts.onsuccess = function() { resolve(requestContacts.result); }
	});
	let contactInfo = await x.then((value) => { return value; });
	if (contactInfo.publicKey.length == 0) {
		chat.getAddContactAccessForm(id);
	} else {
		let transactionMessages = db.transaction("messages", "readonly");
		let messagesStore = transactionMessages.objectStore("messages");
		let chatIndex = messagesStore.index("chat_id");
		let requestMessages = chatIndex.getAll(id);
		requestMessages.onsuccess = function() {
			allMessages = requestMessages.result;
			for (let i = 0, l = allMessages.length; i < l; i++) {
				chat.getMessage(allMessages[i]);
			}
		};
	}



//	chatInputArea.hide();
//	blockCenter.show('center');
}

chat.getMessage = function(obj)
{
	let newContainerForMessage = document.createElement('div');
	newContainerForMessage.id = obj.id;
	newContainerForMessage.setAttribute('name', 'message');
	(obj.from == obj.chat)
	? newContainerForMessage.className = 'message incomingMessage'
	: newContainerForMessage.className = 'message outgoingMessage';
	newContainerForMessage.innerHTML = obj.message;

	let newContainerForTime = document.createElement('div');
	newContainerForTime.id = obj.id;
	newContainerForTime.setAttribute('name', 'message');
	(obj.from == obj.chat)
	? newContainerForTime.className = 'leftMessageTime'
	: newContainerForTime.className = 'rightMessageTime';
	newContainerForTime.innerHTML = timestampToTime(obj.timestamp);

	newContainerForMessage.append(newContainerForTime);
	chatReadArea.append(newContainerForMessage);
	
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

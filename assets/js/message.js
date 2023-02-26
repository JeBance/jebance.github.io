class Message {
	db = '';
	transaction = '';
	messages = '';

	id = '';
	chat = '';
	from = '';
	timestamp = '';
	message = '';
	request = '';
	wasRead = '';

	async initDB() {
		this.db = await dbInit().then((db) => { return db; });
		this.transaction = this.db.transaction("messages", "readwrite");
		this.messages = this.transaction.objectStore("messages");
	}

	async init(id) {
		this.id = id;
		await this.initDB();
		let request = this.messages.get(this.id);
		let x = new Promise((resolve, reject) => {
			request.onsuccess = function() { resolve(request.result); }
		});
		let info = await x.then((value) => { return value; });

		if (info !== undefined) {
			this.id = info.id;
			this.chat = info.chat;
			this.from = info.from;
			this.timestamp = info.timestamp;
			this.message = info.message;
			this.request = info.request;
			this.wasRead = info.wasRead;
			return true;
		} else {
			return false;
		}
	}

	async save() {
		let addedMessage = {
			id: this.id,
			chat: this.chat,
			from: this.from,
			timestamp: this.timestamp,
			message: this.message,
			request: this.request,
			wasRead: this.wasRead
		};

		await this.initDB();
		let request = this.messages.put(addedMessage);
		let x = new Promise((resolve, reject) => {
			request.onsuccess = function() { resolve(request.result); }
		});
		await x.then((value) => { return value; });
	}

	async getAllMessages() {
		await this.initDB();
		let request = this.messages.getAll();
		let x = new Promise((resolve, reject) => {
			request.onsuccess = function() { resolve(request.result); }
			request.onerror = function() { reject('Error: ' + openRequest.error); }
		});
		let allMessages = await x.then((value) => { return value; }).catch((error) => console.log(`${error}`));
		return allMessages;
	}

	async getAllMessagesFromChat(chat_id) {
		await this.initDB();
		let chatIndex = this.messages.index("chat_id");
		let request = chatIndex.getAll(chat_id);
		let x = new Promise((resolve, reject) => {
			request.onsuccess = function() { resolve(request.result); }
			request.onerror = function() { reject('Error: ' + openRequest.error); }
		});
		let allMessages = await x.then((value) => { return value; }).catch((error) => console.log(`${error}`));
		return allMessages;
	}

	async checkInvite(chat_id) {
		let allMessages = await this.getAllMessagesFromChat(chat_id);
		//console.log(allMessages);
		let lastAddContactMessage = new Object();
		for (let i = 0, l = allMessages.length; i < l; i++) {
			if ((allMessages[i].request == 'addMe') && (allMessages[i].from == chat_id)) {
				lastAddContactMessage = allMessages[i];
			}
		}
		//console.log(lastAddContactMessage);
		if (lastAddContactMessage.message) {
			return lastAddContactMessage;
		} else {
			return false;
		}
	}
}

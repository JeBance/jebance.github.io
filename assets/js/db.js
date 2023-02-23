async function dbInit()
{
	return new Promise((resolve, reject) => {
		let openRequest = indexedDB.open("DB", 1);

		openRequest.onupgradeneeded = function() {
			let db = openRequest.result;
			switch(event.oldVersion) {
				case 0:
					let contacts = db.createObjectStore('contacts', {keyPath: 'fingerprint'});
					let messages = db.createObjectStore('messages', {keyPath: 'id'});
					let nicknameIndex = contacts.createIndex('nickname_id', 'nickname');
					let chatIndex = messages.createIndex('chat_id', 'chat');
					break;
			}
		};

		openRequest.onerror = function() {
			reject('Error: ' + openRequest.error);
		};

		openRequest.onsuccess = function() {
			let db = openRequest.result;
			db.onversionchange = function() {
				db.close();
				reject("База данных устарела. Пожалуйста, перезагрузите страницу для обновления.");
			};
			resolve(db);
		};

		openRequest.onblocked = function() {
			reject('База данных устарела. Пожалуйста, закройте другие вкладки и перезагрузите страницу для обновления.');
		};
	});
}

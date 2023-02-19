/*
let openRequest = indexedDB.open("DB", 1);

openRequest.onupgradeneeded = function() {
	let db = openRequest.result;
	switch(event.oldVersion) {
		case 0:
			db.createObjectStore('contacts', {keyPath: 'fingerprint_id'});
			break;
	}
};

openRequest.onerror = function() {
  console.error("Error", openRequest.error);
};

openRequest.onsuccess = function() {
	let db = openRequest.result;
	db.onversionchange = function() {
		db.close();
		alert("База данных устарела. Пожалуйста, перезагрузите страницу для обновления.")
	};

	let transaction = db.transaction("contacts", "readwrite"); // (1)
	// получить хранилище объектов для работы с ним
	let contacts = transaction.objectStore("contacts"); // (2)

	let contact = {
		fingerprint_id: 'elkjcmeoverojforuokm03fjoiproeimlc',
		nickname: 'jebance',
		email: 'email'
	};

	let request = contacts.add(contact); // (3)

	request.onsuccess = function() { // (4)
		console.log("Контакт добавлен в хранилище", request.result);
	};

	transaction.oncomplete = function() {
		console.log("Транзакция выполнена");
	};

	request.onerror = function() {
		let request = event.target;
		console.log("Ошибка", request.error);
	};
};

openRequest.onblocked = function() {
	alert("База данных устарела. Пожалуйста, закройте другие вкладки и перезагрузите страницу для обновления.")
};
*/

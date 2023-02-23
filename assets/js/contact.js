let contact = new Object();

contact.animation = function()
{
	if (modalContactBlock.className == 'modalContact') {
		contactFingerprint.value = '';
		contactPassword.value = '';
		modalContactBlock.hide();
		shadeContactBlock.hide();
	} else {
		modalContactBlock.show('modalContact');
		shadeContactBlock.show('shade');
		contactFingerprint.focus();
	}
}

contact.addNew = async function()
{
	if (contactFingerprint.value.length > 0) {
		let matches = contactFingerprint.value.match(/^[a-z0-9]{40}$/i);
		if (matches !== null) {
			if (contactPassword.value.length > 0) {
				let string = JSON.stringify({ myPublicKey: secureStorage.publicArmoredKey });
				let recipient = matches[0].toUpperCase();
				let message = await secureStorage.encryptMessageSymmetricallyWithCompression(string, contactPassword.value);
				let JSONstring = JSON.stringify({ request: 'addMe', message: message, to: recipient });
				myHub.xhr({request: JSONstring })
					.then((value) => {
						if (value.result == 'ok') {
							contact.animation();
							dbInit().then((db) => {
								let transaction = db.transaction("contacts", "readwrite");
								let contactsStore = transaction.objectStore("contacts");

								let addedContact = {
									fingerprint: recipient,
									publicKey: '',
									nickname: '',
									email: ''
								};

								contactsStore.delete(recipient);
								let request = contactsStore.add(addedContact);

								request.onsuccess = function() {
									console.log("Контакт добавлен: ", request.result);
								};

								transaction.oncomplete = function() {
									console.log("Транзакция выполнена");
									contact.contactBlockUpdate();
								};

								request.onerror = function() {
									let request = event.target;
									console.error("Ошибка", request.error);
								};
							});
						}
					})
					.catch((error) => console.error(`${error}`));
			} else {
				alert('Введите пароль для собеседника, чтобы он мог подтвердить добавление.');
			}
		} else {
			alert('Введён неверный отпечаток собеседника!');
		}
	} else {
		alert('Введите отпечаток собеседника!');
	}
}

contact.contactBlockUpdate = async function()
{
	contacts.innerHTML = '';
	await contact.getAddButton();

	dbInit().then((db) => {
		let transaction = db.transaction("contacts", "readonly");
		let contactsStore = transaction.objectStore("contacts");
		let nicknameIndex = contactsStore.index("nickname_id");
		let request = nicknameIndex.getAll();
		request.onsuccess = function() {
			if (request.result !== undefined) {
				allContacts = request.result;
				for (let i = 0, l = allContacts.length; i < l; i++) {
					contact.getContactButton(allContacts[i]);
				}
			}
		};
	});
}

/*
<div id="1" name="contact" class="leftItem">
	<div class="avatar">👾</div>
	<div class="leftItemInfo">
		<div class="leftItemInfoTop">
			<div class="leftItemInfoName">Oleg Prudkov</div><div class="leftItemInfoTime"><pre>22:22</pre></div>
		</div>
		<div class="leftItemInfoBottom">
			<div class="leftItemInfoText">Очень длинный текст последнего сообщения</div>
			<!-- <div id="1" name="inboxCounter" class="leftItemInfoCounter">2222</div> -->
		</div>
	</div>
</div>
*/
contact.getContactButton = function(obj)
{
	let newContainerForContact = document.createElement('div');
	newContainerForContact.id = obj.fingerprint;
	newContainerForContact.name = 'contact';
	newContainerForContact.className = 'leftItem';
//	newContainerForContact.setAttribute('onclick', 'chat.getChat(obj.fingerprint)');
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
	if (obj.nickname.length > 0) {
		newDivForLeftItemInfoName.innerHTML = obj.nickname
	} else {
		newDivForLeftItemInfoName.innerHTML = 'Ожидает подтверждения';
		newDivForLeftItemInfoName.setAttribute('style', 'color:red;');
	}
	let newDivForLeftItemInfoText = document.createElement('div');
	newDivForLeftItemInfoText.className = 'leftItemInfoText';
	newDivForLeftItemInfoText.innerHTML = obj.fingerprint;
	newDivForLeftItemInfoTop.append(newDivForLeftItemInfoName);
	newDivForLeftItemInfoBottom.append(newDivForLeftItemInfoText);
	newDivForLeftItemInfo.append(newDivForLeftItemInfoTop);
	newDivForLeftItemInfo.append(newDivForLeftItemInfoBottom);
	newContainerForContact.append(newDivForAvatar);
	newContainerForContact.append(newDivForLeftItemInfo);
	contacts.append(newContainerForContact);
}

contact.getAddButton = function()
{
	let newContainerForAddContact = document.createElement('div');
	newContainerForAddContact.className = 'leftItem';
	newContainerForAddContact.setAttribute('onclick', 'contact.animation()');
	let newDivForI = document.createElement('div');
	newDivForI.setAttribute('style', 'display:grid;justify-content:center;');
	let newI = document.createElement('i');
	newI.className = 'fa fa-plus fa-lg';
	newI.setAttribute('aria-hidden', 'true');
	let newDivForInnerHTML = document.createElement('div');
	newDivForInnerHTML.innerHTML = 'Добавить контакт';
	newDivForI.append(newI);
	newContainerForAddContact.append(newDivForI);
	newContainerForAddContact.append(newDivForInnerHTML);
	contacts.append(newContainerForAddContact);
}

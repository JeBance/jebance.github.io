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
							console.log('Новый контакт: ' + recipient);
							contact.animation();
							// Добавление контакта в базу данных
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

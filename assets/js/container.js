container.click = async function(elem)
{
	for (let i = 0, l = containerElements.length; i < l; i++) containerElements[i].hide();
	switch(elem.id) {
		case 'containerBrowse':
			break;

		case 'containerCreate':
			containerInfo.innerHTML = 'Заполните форму. Эти данные будут добавлены в Ваш PGP ключ. Придумайте сложный пароль от 8 символов для шифрования контейнера.';
			containerNameInput.show('selectable');
			containerEmailInput.show('selectable');
			containerPasswordInput.show('selectable');
			containerPasswordAccept.show();
			break;

		case 'containerSave':
			break;

		case 'containerPasswordAccept':
			if (containerNameInput.value.length == 0) alert('Введите никнейм!');
			if (containerEmailInput.value.length == 0) alert('Введите email!');
			if (containerPasswordInput.value.length < 8) alert('Короткий пароль!');
			if (containerPasswordInput.value.length > 7) {
				if (containerNameInput.value.length > 0) {
					if (containerEmailInput.value.length > 0) {
						if (EMAIL_REGEXP.test(containerEmailInput.value)) {
							loader.show();
							const { privateKey, publicKey } = await openpgp.generateKey({
								type: 'rsa',
								rsaBits: 4096,
								userIDs: [{ name: containerNameInput.value, email: containerEmailInput.value }],
								passphrase: containerPasswordInput.value
							});
							localStorage.setItem('publicKey', publicKey);
							localStorage.setItem('privateKey', privateKey);
							localStorage.setItem('passphrase', containerPasswordInput.value);
							containerNameInput.value = '';
							containerEmailInput.value = '';
							containerPasswordInput.value = '';
							containerNameInput.hide();
							containerEmailInput.hide();
							containerPasswordInput.hide();
							containerPasswordAccept.hide();
							containerInfo.innerHTML = '<b>Отпечаток:</b> ' + publicKey.getFingerprint();
							loader.hide();
						} else {
							alert('Вы ввели некорректный email!');
						}
					}
				}
			}
			break;

		default:
			break;
	}
}

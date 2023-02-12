container.click = function(elem)
{
	console.log(elem.id);
	switch(elem.id) {
		case 'containerBrowse':
			break;

		case 'containerCreate':
			containerBrowse.className = 'hide';
			containerCreate.className = 'hide';
			containerInfo.innerHTML = 'Заполните форму. Эти данные будут добавлены в Ваш PGP ключ. Придумайте сложный пароль от 8 символов для шифрования контейнера.';
			containerNameInput.className = 'show';
			containerEmailInput.className = 'show';
			containerPasswordInput.className = 'show';
			containerPasswordAccept.className = 'show';
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
						if (isEmailValid(containerEmailInput.value)) {
							loader.show();
							const { privateKey, publicKey } = await openpgp.generateKey({
								type: 'rsa',
								rsaBits: 4096,
								userIDs: [{ name: containerNameInput.value, email: containerEmailInput.value }],
								passphrase: containerPasswordInput.value
							});
							localStorage.setItem('publicKey', publicKey);
							localStorage.setItem('privateKey', privateKey)
							console.log(localStorage.getItem('publicKey'));
							console.log(localStorage.getItem('privateKey'));
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

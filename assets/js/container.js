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
			downloadHref.click()
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
							containerInfo.innerHTML = 'Генерация контейнера ...';
							fingerprint = (await openpgp.readKey({ armoredKey: publicKey })).getFingerprint();
							containerInfo.innerHTML = '<b>Отпечаток:</b> ' + fingerprint;
							let NZPGP = JSON.stringify({
								publicKey: localStorage.getItem('publicKey'),
								privateKey: localStorage.getItem('privateKey'),
								passphrase: localStorage.getItem('passphrase'),
								fingerprint: fingerprint
							});
							console.log('NZPGP: '+NZPGP);
							const encrypted = await openpgp.encrypt({
								message: await openpgp.createMessage({ text: NZPGP }),
								passwords: [ localStorage.getItem('passphrase') ],
								config: { preferredCompressionAlgorithm: openpgp.enums.compression.zlib }
							});
							console.log('encrypted: '+encrypted);
							let downloadHref = document.createElement('a');
							downloadHref.id = 'downloadHref';
							downloadHref.setAttribute('href', 'data:nz/pgp,' + encrypted);
							downloadHref.setAttribute('download', fingerprint + '.nz');
							downloadHref.hide();
							right.append(downloadHref);
							containerSave.show();
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

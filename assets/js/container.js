container.click = async function(elem)
{
	switch(elem.id) {
		case 'containerBrowse':
			file.click();
			break;

		case 'containerCreate':
			containerInfo.innerHTML = 'Заполните форму. Эти данные будут добавлены в Ваш PGP ключ. Придумайте сложный пароль от 8 символов для шифрования контейнера.';
			containerElements.hide();
			containerNameInput.show('selectable');
			containerEmailInput.show('selectable');
			containerPasswordInput.show('selectable');
			containerPasswordAccept.show();
			break;

		case 'containerSave':
			downloadNZPGPhref.click()
			break;

		case 'file':
			let x = elem.files[0];
			let reader = new FileReader();
			reader.readAsText(x);
			reader.onload = function() {
				file.x = x;
				file.data = reader.result;
				containerElements.hide();
				containerInfo.innerHTML = 'Введите пароль для дешифровки контейнера.';
				containerPasswordInput.show();
				containerPasswordAccept.show();
			};
			reader.onerror = function() {
				alert(reader.error);
			};
			break;

		case 'containerPasswordAccept':
			if (containerPasswordInput.value.length < 8) alert('Короткий пароль!');
			if (file.data) {
				const armMessage = await openpgp.readMessage({
					armoredMessage: file.data
				});
				const { data: decrypted } = await openpgp.decrypt({
					message: armMessage,
					passwords: [ containerPasswordInput.value ],
				});
				if (decrypted.isJsonString()) {
					let NZPGP = JSON.parse(decrypted);
					const publicKey = await openpgp.readKey({ armoredKey: NZPGP.publicKey });
					if (NZPGP.fingerprint == publicKey.getFingerprint()) {
						localStorage.setItem('publicKey', NZPGP.publicKey);
						localStorage.setItem('privateKey', NZPGP.privateKey);
						localStorage.setItem('passphrase', NZPGP.passphrase);
						containerElements.hide();
						await container.generate();
						containerSave.show();
						file.data = null;
						file.x = null;
					} else {
						alert('Отпечаток публичного ключа не совпадает с фактическим!');
					}
				} else {
					alert('Неверный пароль!');
				}
			} else {
				if (containerNameInput.value.length == 0) alert('Введите никнейм!');
				if (containerEmailInput.value.length == 0) alert('Введите email!');
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
								containerElements.hide();
								containerInfo.innerHTML = 'Генерация контейнера ...';
								await container.generate();
								containerSave.show();
								loader.hide();
							} else {
								alert('Вы ввели некорректный email!');
							}
						}
					}
				}
			}
			break;

		default:
			break;
	}
}

container.generate = async function()
{
	fingerprint = (await openpgp.readKey({ armoredKey: localStorage.getItem('publicKey') })).getFingerprint();
	containerInfo.innerHTML = '<b>Отпечаток:</b> ' + fingerprint;
	let NZPGP = JSON.stringify({
		publicKey: localStorage.getItem('publicKey'),
		privateKey: localStorage.getItem('privateKey'),
		passphrase: localStorage.getItem('passphrase'),
		fingerprint: fingerprint
	});
	const encrypted = await openpgp.encrypt({
		message: await openpgp.createMessage({ text: NZPGP }),
		passwords: [ localStorage.getItem('passphrase') ],
		config: { preferredCompressionAlgorithm: openpgp.enums.compression.zlib }
	});
	downloadNZPGPhref.setAttribute('href', 'data:application/pgp-encrypted,' + encodeURIComponent(encrypted));
	downloadNZPGPhref.setAttribute('download', fingerprint + '.nz');
}

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

		case 'containerOff':
			container.secureStorage.eraseAllSecureData();
			downloadNZPGPhref.removeAttribute('href');
			downloadNZPGPhref.removeAttribute('download');
			containerElements.hide();
			containerInfo.innerHTML = 'Все данные передаются через сервера в зашифрованном виде. Подключите свой ранее созданный PGP контейнер с расширением .nz, или создайте новый.';
			containerBrowse.show();
			containerCreate.show();
			break;

		case 'file':
			let x = elem.files[0];
			let reader = new FileReader();
			reader.readAsText(x);
			reader.onload = function() {
				if (x.name.substring(x.name.length - 3)) {
					file.x = x;
					file.data = reader.result;
					containerElements.hide();
					containerInfo.innerHTML = 'Введите пароль для дешифровки контейнера.';
					containerPasswordInput.show();
					containerPasswordAccept.show();
				} else {
					alert('Некорректный файл. Выберите файл контейнера с расширением .nz');
				}
			};
			reader.onerror = function() {
				alert(reader.error);
			};
			break;

		case 'containerPasswordAccept':
			if (containerPasswordInput.value.length < 8) alert('Короткий пароль!');
			if (file.data) {
				container.secureStorage = new SecureStorage();
				await container.secureStorage.openStorage(file.data, containerPasswordInput.value);
				if (container.secureStorage.activeAllSecureData()) {
					containerPasswordInput.value = '';
					containerElements.hide();
					await container.generate();
					containerSave.show();
					containerOff.show();
					file.value = null;
					file.data = null;
					file.x = null;
				}
			} else {
				if (containerNameInput.value.length == 0) alert('Введите никнейм!');
				if (containerEmailInput.value.length == 0) alert('Введите email!');
				if ((containerPasswordInput.value.length > 7)
				&& (containerNameInput.value.length > 0)
				&& (containerEmailInput.value.length > 0)) {
					if (EMAIL_REGEXP.test(containerEmailInput.value)) {
						loader.show();
						container.secureStorage = new SecureStorage();
						await container.secureStorage.createStorage(containerNameInput.value, containerEmailInput.value, containerPasswordInput.value);
						if (container.secureStorage.activeAllSecureData()) {
							containerNameInput.value = '';
							containerEmailInput.value = '';
							containerPasswordInput.value = '';
							containerElements.hide();
							containerInfo.innerHTML = 'Генерация контейнера ...';
							await container.generate();
							containerSave.show();
							containerOff.show();
						}
						loader.hide();
					} else {
						alert('Вы ввели некорректный email!');
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
	containerInfo.innerHTML = '<b>Отпечаток:</b> ' + container.secureStorage.fingerprint;
	let fileHref = container.secureStorage.generateSecureFile;
	downloadNZPGPhref.setAttribute('href', fileHref);
	downloadNZPGPhref.setAttribute('download', container.secureStorage.fingerprint + '.nz');
}

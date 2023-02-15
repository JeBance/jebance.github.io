container.click = async function(elem)
{
	switch(elem.id) {
		case 'containerBrowse':
			file.click();
			break;

		case 'containerCreate':
			containerInfo.innerHTML = 'Заполните форму. Эти данные будут добавлены в Ваш PGP-ключ. Придумайте сложный пароль от 8 символов для шифрования контейнера.';
			container.elements.hide();
			containerNameInput.show('selectable');
			containerEmailInput.show('selectable');
			containerPasswordInput.show('selectable');
			containerPasswordAccept.show();
			break;

		case 'containerSave':
			downloadNZPGPhref.click()
			break;

		case 'containerOff':
			secureStorage.eraseAllSecureData();
			downloadNZPGPhref.removeAttribute('href');
			downloadNZPGPhref.removeAttribute('download');
			container.choice();
			break;

		case 'file':
			let x = elem.files[0];
			let reader = new FileReader();
			reader.readAsText(x);
			reader.onload = function() {
				if (x.name.substring(x.name.length - 3) == '.nz') {
					file.data = reader.result;
					secureStorage.checkStorage(file.data).then((value) => {
						if (value == true) {
							container.elements.hide();
							containerInfo.innerHTML = 'Введите пароль для дешифровки контейнера.';
							containerPasswordInput.show();
							containerPasswordAccept.show();
						}
					})
				} else {
					alert(`Некорректный файл!\nВыберите файл контейнера с расширением .nz`);
				}
			};
			reader.onerror = function() {
				alert(reader.error);
			};
			break;

		case 'containerPasswordAccept':
			if (containerPasswordInput.value.length < 8) {
				alert('Короткий пароль!');
			} else {
				if (file.data) {
					await secureStorage.openStorage(file.data, containerPasswordInput.value);
					if (secureStorage.activeAllSecureData() == true) await container.generate();
				} else {
					if (containerNameInput.value.length == 0) alert('Введите никнейм!');
					if (containerEmailInput.value.length == 0) alert('Введите email!');
					if ((containerPasswordInput.value.length > 7)
					&& (containerNameInput.value.length > 0)
					&& (containerEmailInput.value.length > 0)) {
						if (EMAIL_REGEXP.test(containerEmailInput.value)) {
							loader.show();
							try {
								await secureStorage.createStorage(containerNameInput.value, containerEmailInput.value, containerPasswordInput.value);
								if (secureStorage.activeAllSecureData() == true) await container.generate();
							} catch(e) {
								console.error(e);
							}
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

container.elements = document.getElementsByName("container");

container.elements.hide = function() {
	for (let i = 0, l = container.elements.length; i < l; i++) container.elements[i].hide();
}

container.clearInputs = function()
{
	file.data = null;
	file.value = null;
	containerNameInput.value = '';
	containerEmailInput.value = '';
	containerPasswordInput.value = '';
}

container.choice = function()
{
	container.clearInputs();
	container.elements.hide();
	containerInfo.innerHTML = 'Все данные передаются через сервера в зашифрованном виде. Подключите свой ранее созданный PGP контейнер с расширением .nz, или создайте новый.';
	containerBrowse.show();
	containerCreate.show();
}

container.generate = async function()
{
	container.clearInputs();
	container.elements.hide();
	containerInfo.innerHTML = 'Генерация контейнера ...';
	let fileHref = await secureStorage.generateSecureFile();
	downloadNZPGPhref.setAttribute('href', fileHref);
	downloadNZPGPhref.setAttribute('download', secureStorage.fingerprint + '.nz');
	containerInfo.innerHTML = '<b>Отпечаток:</b> ' + secureStorage.fingerprint;
	containerSave.show();
	containerOff.show();
}

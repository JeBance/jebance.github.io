let hide = new Object();

hide.pages = function()
{
	infoPage.hide();
	accountPage.hide();
}

async function wrap(elem)
{
	menu.animation();
	window.onresize();
	hide.pages();
	switch(elem.id) {
		case 'menuButtonMain':
			infoPage.show();
			break;

		case 'menuButtonSettings':
			containerElements.hide();
			if (localStorage.getItem('publicKey') && localStorage.getItem('privateKey') && localStorage.getItem('passphrase')) {
				await container.generate();
				containerSave.show();
			} else {
				containerInfo.innerHTML = 'Все данные передаются через сервера в зашифрованном виде. Подключите свой ранее созданный PGP контейнер с расширением .nz, или создайте новый.';
				containerBrowse.show();
				containerCreate.show();
			}
			accountPage.show();
			break;

		default:
			break;
	}
}


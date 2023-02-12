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
			for (let i = 0, l = containerElements.length; i < l; i++) containerElements[i].hide();
			if (localStorage.getItem('publicKey')) {
				publicKey = await openpgp.readKey({ armoredKey: localStorage.getItem('publicKey') });
				containerInfo.innerHTML = '<b>Отпечаток:</b> ' + publicKey.getFingerprint();
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


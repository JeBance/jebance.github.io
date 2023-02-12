let hide = new Object();

hide.pages = function()
{
	infoPage.hide();
	accountPage.hide();
}

function wrap(elem)
{
	menu.animation();
	window.onresize();
	hide.pages();
	switch(elem.id) {
		case 'menuButtonMain':
			infoPage.show();
			break;

		case 'menuButtonSettings':
			if (localStorage.getItem('publicKey')) {
				const publicKey = await openpgp.readKey({ armoredKey: localStorage.getItem('publicKey') });
				containerInfo.innerHTML = '<b>Отпечаток:</b> ' + publicKey.getFingerprint();
			} else {
				containerInfo.innerHTML = 'Все данные передаются через сервера в зашифрованном виде. Подключите свой ранее созданный PGP контейнер с расширением .nz, или создайте новый.';
				containerBrowse.className = 'show';
				containerCreate.className = 'show';
			}
			accountPage.show();
			break;

		default:
			break;
	}
}


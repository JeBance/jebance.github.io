let darkModeState = false;
const useDark = window.matchMedia("(prefers-color-scheme: dark)");

function toggleDarkMode(state) {
	document.documentElement.classList.toggle("dark-mode", state);
	darkModeState = state;
	lamp.checked = !state;
}

function setDarkModeLocalStorage(state) {
	localStorage.setItem("dark-mode", state);
}

if ((localStorage.getItem("dark-mode") == "true")
|| ((useDark.matches) && (localStorage.getItem("dark-mode") !== "false")))
toggleDarkMode(true);

//useDark.addListener((evt) => toggleDarkMode(evt.matches));

lamp.onclick = function() {
	darkModeState = !darkModeState;
	toggleDarkMode(darkModeState);
	setDarkModeLocalStorage(darkModeState);
}

menu.animation = function() {
	if ((menu.className == 'menu') || (menu.className == 'hideMenu menu')) {
		menu.className = ('showMenu menu');
		hide.className = ('background');
	} else {
		menu.className = ('hideMenu menu');
		hide.className = ('hide');
	}
}

window.onresize = function() {
	if (document.documentElement.clientWidth > 799) {
		menu.className = ('menu');
		hide.className = ('hide');
	}
}

function wrap(elem) {
	switch(elem.id) {
		case 'myProjectsButton':
			page.innerHTML = '';
			break;

		case 'addNewProduct':
			hide.menu()
			brdProducts.hide();
			let newContainer = document.createElement('div');
			newContainer.id = 'newContainer';
			newContainer.name = 'newContainer';
			newContainer.className = 'container';
			let newH1 = document.createElement('h1');
			newH1.innerHTML = 'Add new product';
			let closeButton = document.createElement('button');
			closeButton.id = 'mP';
			closeButton.innerHTML = '❌';
			closeButton.className = 'square-button';
			closeButton.setAttribute('onclick', 'wrap(this)');
			let newForm = document.createElement('div');
			newForm.id = 'newForm';
			newForm.className = 'card';
			let newLabelName = document.createElement('label');
			newLabelName.setAttribute('for', 'productName');
			newLabelName.innerHTML = 'Name:';
			let newInputName = document.createElement('input');
			newInputName.id = 'productName';
			newInputName.type = 'text';
			newInputName.value = '';
			newInputName.setAttribute('placeholder', 'Name');
			newInputName.className = 'selectable';
			let newLabelDescription = document.createElement('label');
			newLabelDescription.setAttribute('for', 'productDescription');
			newLabelDescription.innerHTML = 'Description:';
			let newInputDescription = document.createElement('textarea');
			newInputDescription.id = 'productDescription';
			newInputDescription.setAttribute('placeholder', 'Description');
			newInputDescription.className = 'selectable';
			let newLabelPrice = document.createElement('label');
			newLabelPrice.setAttribute('for', 'productPrice');
			newLabelPrice.innerHTML = 'Price:';
			let newInputPrice = document.createElement('input');
			newInputPrice.id = 'productPrice';
			newInputPrice.type = 'text';
			newInputPrice.value = '';
			newInputPrice.setAttribute('placeholder', 'Price');
			newInputPrice.className = 'selectable';
			let newLabelCurrency = document.createElement('label');
			newLabelCurrency.setAttribute('for', 'productCurrency');
			newLabelCurrency.innerHTML = 'Currency:';
			let newSelectCurrency = document.createElement('select');
			newSelectCurrency.id = 'productCurrency';
			let curKeys = Object.keys(ticker.info);
			for (var i = 0, l = curKeys.length; i < l; i++) {
				newOption = new Option(curKeys[i], curKeys[i]);
				newSelectCurrency.append(newOption);
				if (user.info.currency == curKeys[i]) { newOption.selected = true; }
			}
			let addButton = document.createElement('button');
			addButton.id = 'addButton';
			addButton.innerHTML = 'Add';
			addButton.setAttribute('onclick', 'product.create(this)');
			newForm.append(newLabelName);
			newForm.append(newInputName);
			newForm.append(newLabelDescription);
			newForm.append(newInputDescription);
			newForm.append(newLabelPrice);
			newForm.append(newInputPrice);
			newForm.append(newLabelCurrency);
			newForm.append(newSelectCurrency);
			newForm.append(addButton);
			newContainer.append(newH1);
			newContainer.append(closeButton);
			newContainer.append(newForm);
			wraper.append(newContainer);

		default:
			break;
	}
}

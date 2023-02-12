const SITE_URL = 'https://jebance.github.io/';

//localStorage.clear();
jsCheck.parentNode.removeChild(jsCheck);
loader.hide = function() { loader.className = 'hide'; }
loader.show = function() { loader.className = 'loaderBackground'; }
loader.show();

function sleep(ms) {
  return new Promise(
    resolve => setTimeout(resolve, ms)
  );
}

progress.hide = async function()
{
	bar.style.width = '100%';
	await sleep(5000);
	progress.className = 'hide';
	bar.className = 'hide';
	bar.width = 0;
}
progress.show = function() {
	progress.className = 'progress';
	bar.className = 'bar';
}
bar.move = function(step, description, color)
{
	if ((progress.className == 'hide') && (bar.className == 'hide')) {
		progress.show();
		bar.style.width = '0%';
	}

	bar.width = bar.width + step;
	progress.innerHTML = '&emsp;' + bar.width + '%&emsp;' + description;
	bar.innerHTML = '&emsp;' + bar.width + '%&emsp;' + description;
	bar.style.background = color;
	bar.style.width = bar.width + '%';
}
bar.width = 0;

function loadModules(step, name)
{
	bar.move(step, 'Loading modules', 'white');
	script = document.createElement('script');
	script.src = SITE_URL + 'assets/js/' + name;
	document.head.append(script);
	script.onload = function() {
		i++;
		if (i < keys.length) {
			loadModules(step, modules[keys[i]]);
		} else {
			bar.move((100 - bar.width), 'Version: ' + VERSION, 'white');
			progress.hide();
			window.i = null;
			window.keys = null;
			window.step = null;
			loader.hide();
		}
	};
	script.onerror = function() {
		bar.move(0, '"' + name + '" loading error', '#F08080');
		loader.hide();
	};
}

function scanScripts()
{
	let requestURL = SITE_URL + 'assets/js/scripts.json';
	let request = new XMLHttpRequest();
	request.open('GET', requestURL);
	request.responseType = 'json';
	request.send();
	request.onload = function() {
		let response = request.response;
		//console.log(response);
		let keys = Object.keys(response);
		//console.log(keys);
		let result = '';
		for (let i = 0, l = keys.length; i < l; i++) {
			modules.push(response[keys[i]]);
		}
		return modules;
	}
	request.onerror = function() {
		scanScripts();
	}
}

let modules = [];
let keys;
let step;
let i = 0;
scanScripts();
chS = setInterval(checkScripts, 100);
function checkScripts()
{
	keys = Object.keys(modules);
	if (keys.length > 0) {
		clearInterval(chS);
		step = parseInt(100 / keys.length);
		//step = parseFloat((100 / keys.length).toFixed(2));
		bar.move(0, 'Loading modules', 'white');
		loadModules(step, modules[keys[i]])
	}
}















































/*
let myProjects = new Object();
myProjects.refresh = function()
{
	let requestURL = 'https://jebance.github.io/assets/json/projects.json';
	let request = new XMLHttpRequest();
	request.open('GET', requestURL);
	request.responseType = 'json';
	request.send();
	request.onload = function() {
		myProjects.info = request.response;
	}
	request.onerror = function() {
		myProjects.refresh();
	}
}
myProjects.refresh();
*/

container.click = function(elem)
{
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
							generatePGPkeys(containerNameInput.value, containerEmailInput.value, containerPasswordInput.value)
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

async function generatePGPkeys(name, email, password)
{
    const { privateKey, publicKey } = await openpgp.generateKey({
        type: 'rsa',
        rsaBits: 4096,
        userIDs: [{ name: name, email: email }],
        passphrase: password
    });
//	pubKey.textContent = publicKey;
//	privKey.textContent = privateKey;
    console.log(publicKey);
    console.log(privateKey);
}



/*
var script = document.createElement('script');
script.onload = function () {
    // Скрипт был загружен
};

document.head.appendChild(script);
script.src = 'урл к вашему файлу';
*/

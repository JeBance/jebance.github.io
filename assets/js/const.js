const VERSION = '0.3.15';
console.log('VERSION: '+VERSION);
const API_URL = 'https://api.jebance.ru/';
const EMAIL_REGEXP = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;

async function HMAC(key, message)
{
	const g = str => new Uint8Array([...unescape(encodeURIComponent(str))].map(c => c.charCodeAt(0))),
	k = g(key),
	m = g(message),
	c = await crypto.subtle.importKey('raw', k, { name: 'HMAC', hash: 'SHA-512' }, true, ['sign']),
	s = await crypto.subtle.sign('HMAC', c, m);
	return btoa(String.fromCharCode(...new Uint8Array(s)))
}

let myHub = new Object();
myHub.address = API_URL;
myHub.publicKey = null;

myHub.xhr = async function(post = new Object({request:'ping'}))
{
	if ((post.request != 'ping')
	&& (post.request != 'getServerPublicKey')
	&& (secureStorage.activeAllSecureData())
	&& (myHub.publicKey !== null))
	post.request = await secureStorage.encryptMessage(myHub.publicKey, post.request);

	if (post.request !== false) {
		let post_data = (new URLSearchParams(post)).toString();
		return new Promise((resolve, reject) => {
			let xhr = new XMLHttpRequest();
			xhr.open('POST', myHub.address);
			xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			xhr.responseType = 'json';
			xhr.send(post_data);
			xhr.onload = (event) => {
				if (xhr.status != 200) {
					reject(`Error ${xhr.status}: ${xhr.statusText}`);
				} else {
//					console.log(`Done! Received ${event.loaded} bytes`);
					resolve(xhr.response);
				}
			}
			xhr.onerror = () => {
				reject('Error!');
			}
			xhr.onprogress = (event) => {
				if (event.lengthComputable) {
//					console.log(`Received ${event.loaded} of ${event.total} bytes`);
				} else {
//					console.log(`Received ${event.loaded} bytes`);
				}
			};
		});
	} else {
		alert(`Не удалось сформировать запрос к серверу.\nПроверьте, подключение контейнера.`);
	}
}

String.prototype.isJsonString = function()
{
	try {
		JSON.parse(this);
	} catch (e) {
		return false;
	}
	return true;
}

timestampToTime = function(unix_timestamp)
{
	let date = new Date(unix_timestamp * 1000);
	let hours = date.getHours();
	let minutes = "0" + date.getMinutes();
	let formattedTime = hours + ':' + minutes.substr(-2);
	return formattedTime;
}

Object.prototype.hide = function() { this.className = 'hide'; }

Object.prototype.show = function(attribute = null)
{
	if (attribute == null) {
		this.className = 'show';
	} else {
		this.setAttribute('class', attribute);
	}
}

Object.prototype.incorrect = async function()
{
	this.classList.toggle('red');
	await sleep(100);
	this.classList.toggle('red');
	this.value = "";
}

Object.prototype.correct = async function()
{
	this.classList.toggle('green');
	await sleep(100);
	this.classList.toggle('green');
}

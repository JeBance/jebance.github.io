const VERSION = '0.3.1';
const urlAPI = urlSite + 'api.php';

let uID = "";
let LANG = "";

header.hide = function() { header.className = 'hide'; }
header.show = function() { header.className = 'header'; }

menu.hide = function() { menu.className = 'hide'; }
menu.show = function() { menu.className = 'menu'; }

//mFS.hide = function() { mFS.className = 'hide'; }
//mFS.show = function() { mFS.className = 'fullScreen'; }

search.hide = function() { search.className = 'hide'; }
search.show = function() { search.className = 'search'; }

glass.hide = function() { glass.className = 'hide'; }
glass.show = function() { glass.className = 'glass'; }

language.hide = function() { language.className = 'hide'; }
language.show = function() { language.className = 'language'; }

auth.hide = function() { auth.className = 'hide'; }
auth.show = function() { auth.className = 'auth'; }

brdSearch.hide = function() { brdSearch.className = 'hide'; }
brdSearch.show = function() { brdSearch.className = 'container'; }
brdMessages.hide = function() { brdMessages.className = 'hide'; }
brdMessages.show = function() { brdMessages.className = 'container'; }
brdOrders.hide = function() { brdOrders.className = 'hide'; }
brdOrders.show = function() { brdOrders.className = 'container'; }
brdProducts.hide = function() { brdProducts.className = 'hide'; }
brdProducts.show = function() { brdProducts.className = 'container'; }
brdAccount.hide = function() { brdAccount.className = 'hide'; }
brdAccount.show = function() { brdAccount.className = 'container'; }

Radius1.addEventListener("input", function() { R1.innerHTML = Radius1.value; });
Radius2.addEventListener("input", function() { R2.innerHTML = Radius2.value; });

const myProducts = document.getElementsByName("myProduct");
const allNewContainer = document.getElementsByName("newContainer");

String.prototype.hexEncode = function()
{
    var hex, i;
    var result = "";
    for (i=0; i<this.length; i++) {
        hex = this.charCodeAt(i).toString(16);
        result += ("000"+hex).slice(-4);
    }
    return result
}

String.prototype.hexDecode = function()
{
    var j;
    var hexes = this.match(/.{1,4}/g) || [];
    var back = "";
    for(j = 0; j<hexes.length; j++) {
        back += String.fromCharCode(parseInt(hexes[j], 16));
    }
    return back;
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

String.prototype.isCoordinates = function()
{
	if ((this.length !== 0) && (this.includes(', ') == true)) {
		let splits = this.split(', ', 2);
		if ((Number(splits[0]) !== NaN) && (Number(splits[1]) !== NaN)) {
			return true;
		} else {
			return false;
		}
	} else {
		return false;
	}
}

String.prototype.getLocation = function()
{
	let splits = this.split(', ', 2);
	let location = new Object();
	location.latitude = parseFloat(splits[0]);
	location.longitude = parseFloat(splits[1]);
	return location;
}

String.prototype.getWallets = function()
{
	if (this.length !== 0) {
		let j = 0;
		let addresses = new Object();
		let str = '[' + this + ']';
		if (str.isJsonString() == true) {
			let splits = JSON.parse(str);
			let keys = Object.keys(splits);
			for (var i = 0, l = keys.length; i < l; i++) {
				if (bitcoin.checkAddress(splits[keys[i]])) {
					addresses[j] = splits[keys[i]];
					j++;
				}
			}
		}
		return addresses;
	} else {
		return false;
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
	this.classList.toggle('purple');
	await sleep(100);
	this.classList.toggle('purple');
}

Object.prototype.xhr = async function(method, obj)
{
	let str = key.value.hexDecode();
	if ((str.length !== 0) && (str.isJsonString() == true)) {
		let post = new Object();
		post = JSON.parse(JSON.stringify(obj));
		post.nonce = parseInt(window.performance.timeOrigin);
		json = JSON.stringify(post);
		post = new Object();
		post.json = json;
		let post_data = (new URLSearchParams(post)).toString();
		let keys = JSON.parse(str);
		let signkey = await hmacSha256Hex(keys.secret, post_data);
		post.key = keys.key;
		post.signkey = signkey;
//console.log(post);
		post_data = (new URLSearchParams(post)).toString();
		return new Promise((resolve, reject) => {
			let url = urlAPI + '?' + method;
			let xhr = new XMLHttpRequest();
			xhr.open('POST', url);
			xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			xhr.responseType = 'json';
			xhr.send(post_data);
			xhr.onload = () => resolve(xhr.response);
			xhr.onerror = function() {
				this.xhr(method, obj);
			}
		});
	}
}

function getPriceBTC(price, currency, ticker)
{
	let priceBTC = ((1 / ticker.info[currency]) * price + parseFloat(localStorage.getItem('feeSellProduct'))).toFixed(8);
	return priceBTC;
}

function ping()
{
	let requestURL = urlAPI + '?ping';
	let request = new XMLHttpRequest();
	request.open('GET', requestURL);
	request.responseType = 'json';
	request.send();
	request.onload = function() {
		if ((request.response.result) && (request.response.result == 'pong')) {
			localStorage.setItem('feeCreateProduct', request.response.feeCreateProduct);
			localStorage.setItem('feeSellProduct', request.response.feeSellProduct);
		}
	}
	request.onerror = function() {
		ping();
	}
}

async function hmacSha256Hex(secret, message)
{
  const enc = new TextEncoder("utf-8");
  const algorithm = { name: "HMAC", hash: "SHA-256" };
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    algorithm,
    false, ["sign", "verify"]
  );
  const hashBuffer = await crypto.subtle.sign(
    algorithm.name, 
    key, 
    enc.encode(message)
  );
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(
      b => b.toString(16).padStart(2, '0')
  ).join('');
  return hashHex;
}

/*
Object.prototype.request = async function(method, obj)
{
	let str = key.value.hexDecode();
	if ((str.length !== 0) && (str.isJsonString() == true)) {
		let keys = JSON.parse(str);
		let post = new Object();
		post = obj;
		let post_data = (new URLSearchParams(post)).toString();
		let signkey = await hmacSha256Hex(keys.secret, post_data);
		post.key = keys.key;
		post.signkey = signkey;
		post_data = (new URLSearchParams(post)).toString();

		let requestURL = urlAPI + '?' + method;
		let request = new XMLHttpRequest();
		request.open('POST', requestURL);
		request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		request.responseType = 'json';
		request.send(post_data);
		x = new Promise((resolve, reject) => {
			request.onload = function() {
				let response = request.response;
				resolve(response);
			}
		});
		request.onerror = function() {
			this.request(method, obj);
		}
		x.then((value) => {
			this.response = value;
		});
	}
}
*/







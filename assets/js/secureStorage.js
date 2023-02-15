class SecureStorage {
	#publicKey = '';
	#privateKey = '';
	#passphrase = '';
	fingerprint = '';

	async createStorage(name, email, passphrase) {
		try {
			const { privateKey, publicKey } = await openpgp.generateKey({
				type: 'rsa',
				rsaBits: 4096,
				userIDs: [{ name: name, email: email }],
				passphrase: passphrase
			});
			this.#publicKey = publicKey;
			this.#privateKey = privateKey;
			this.#passphrase = passphrase;
			this.fingerprint = (await openpgp.readKey({ armoredKey: publicKey })).getFingerprint();
		} catch(e) {
			alert('Не удалось сгенерировать контейнер!');
		}
	}

	async checkStorage(data) {
		let check = false;
		try {
			const armMessage = await openpgp.readMessage({
				armoredMessage: data
			});
			check = true;
		} catch(e) {
			alert('Файл не является защищённым хранилищем ключей!');
		}
		return new Promise((resolve, reject) => { resolve(check) });
	}

	async openStorage(data, passphrase) {
		try {
			const armMessage = await openpgp.readMessage({
				armoredMessage: data
			});
			try {
				const { data: decrypted } = await openpgp.decrypt({
					message: armMessage,
					passwords: [ passphrase ],
				});
				if (decrypted.isJsonString()) {
					let parseData = JSON.parse(decrypted);
					this.#publicKey = parseData.publicKey;
					this.#privateKey = parseData.privateKey;
					this.#passphrase = passphrase;
					this.fingerprint = (await openpgp.readKey({ armoredKey: parseData.publicKey })).getFingerprint();
				} else {
					alert('Контейнер повреждён!');
				}
			} catch(e) {
				alert('Неверный пароль!');
			}
		} catch(e) {
			alert('Файл не является защищённым хранилищем ключей!');
		}
	}

	activeAllSecureData() {
		let check = false;
		((this.#publicKey) && (this.#privateKey) && (this.#passphrase)) ? check = true : check = false;
		return check;
	}

	eraseAllSecureData() {
		this.#publicKey = '';
		this.#privateKey = '';
		this.#passphrase = '';
		this.fingerprint = '';
	}

	async generateSecureFile() {
		let string = JSON.stringify({
			publicKey: this.#publicKey,
			privateKey: this.#privateKey
		});
		let encrypted = await openpgp.encrypt({
			message: await openpgp.createMessage({ text: string }),
			passwords: [ this.#passphrase ],
			config: { preferredCompressionAlgorithm: openpgp.enums.compression.zlib }
		});
		let fileHref = 'data:application/pgp-encrypted,' + encodeURIComponent(encrypted);
		return fileHref;
	}
	
	async encryptMessage(recipientPublicKey, message) {
		let passphrase = this.#passphrase;
		try {
			const publicKey = await openpgp.readKey({ armoredKey: recipientPublicKey });
			try {
				const privateKey = await openpgp.decryptKey({
					privateKey: await openpgp.readPrivateKey({ armoredKey: this.#privateKey }),
					passphrase
				});
				try {
					const encrypted = await openpgp.encrypt({
						message: await openpgp.createMessage({ text: message }),
						encryptionKeys: publicKey,
						signingKeys: privateKey
					});
					return encrypted;
				} catch(e) {
					alert('Не удалось зашифровать запрос к серверу!');
				}
			} catch(e) {
				alert('Не удалось прочитать приватный ключ из хранилища ключей!');
			}
		} catch(e) {
			alert('Не удалось прочитать публичный ключ сервера!');
		}
		return false;
	}
}

let secureStorage = new SecureStorage();

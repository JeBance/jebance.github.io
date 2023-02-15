class SecureStorage {
	#publicKey = '';
	#privateKey = '';
	#publicArmoredKey = '';
	#privateArmoredKey = '';
	#passphrase = '';
	fingerprint = '';
	nickname = '';
	email = '';

	async createStorage(name, email, passphrase) {
		try {
			const { privateKey, publicKey } = await openpgp.generateKey({
				type: 'rsa',
				rsaBits: 4096,
				userIDs: [{ name: name, email: email }],
				passphrase: passphrase
			});
			this.#publicKey = await openpgp.readKey({ armoredKey: publicKey });
			this.#privateKey = await openpgp.decryptKey({
				privateKey: await openpgp.readPrivateKey({ armoredKey: privateKey }),
				passphrase
			});
			this.#publicArmoredKey = publicKey;
			this.#privateArmoredKey = privateKey;
			this.#passphrase = passphrase;
			this.fingerprint = this.#publicKey.getFingerprint();
			this.nickname = this.#publicKey.users[0].userID.name;
			this.email = this.#publicKey.users[0].userID.email;
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
					try {
						this.#publicKey = await openpgp.readKey({ armoredKey: parseData.publicKey });
						this.fingerprint = this.#publicKey.getFingerprint();
						this.nickname = this.#publicKey.users[0].userID.name;
						this.email = this.#publicKey.users[0].userID.email;
						try {
							this.#privateKey = await openpgp.decryptKey({
								privateKey: await openpgp.readPrivateKey({ armoredKey: parseData.privateKey }),
								passphrase
							});
						} catch(e) {
							alert('Не удалось прочитать приватный ключ из хранилища ключей!');
						}
					} catch(e) {
						alert('Не удалось прочитать публичный ключ из хранилища ключей!');
					}
					this.#publicArmoredKey = parseData.publicKey;
					this.#privateArmoredKey = parseData.privateKey;
					this.#passphrase = passphrase;
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
		((this.#publicKey)
		&& (this.#privateKey)
		&& (this.#publicArmoredKey)
		&& (this.#privateArmoredKey)
		&& (this.#passphrase)) ? check = true : check = false;
		return check;
	}

	eraseAllSecureData() {
		this.#publicArmoredKey = '';
		this.#privateArmoredKey = '';
		this.#passphrase = '';
		this.fingerprint = '';
	}

	async generateSecureFile() {
		let string = JSON.stringify({
			publicKey: this.#publicArmoredKey,
			privateKey: this.#privateArmoredKey
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
			const privateKey = this.#privateKey;
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
			alert('Не удалось прочитать публичный ключ сервера!');
		}
		return false;
	}

	async decryptMessage(encrypted) {
		try {
			const message = await openpgp.readMessage({ armoredMessage: encrypted });
			try {
				const { data: decrypted, signatures } = await openpgp.decrypt({
					message,
					verificationKeys: this.#publicKey,
					decryptionKeys: this.#privateKey
				});
				console.log('decrypted' + decrypted);
				console.log('signatures' + signatures);
				try {
					await signatures[0].verified;
					let decodedJSON = JSON.parse(decrypted);
					return decodedJSON;
				} catch (e) {
					//throw new Error('Signature could not be verified: ' + e.message);
					console.error('Signature could not be verified: ' + e.message);
					return false;
				}
			} catch(e) {
				console.log(e);
				return false;
			}
		} catch(e) {
			console.log(e);
			return false;
		}
	}
}

let secureStorage = new SecureStorage();

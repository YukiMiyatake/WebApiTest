// WebCryptoのライブラリ
let crypto = window.crypto || window.msCrypto;
let subtle = crypto.subtle || crypto.webkitSubtle;

// アルゴリズム
const signAlg = "RSASSA-PKCS1-v1_5";
const hashAlg = "SHA-256";

// 64文字ごとに改行を入れる
function pac64(pemString)
{
	const stringLength = pemString.length;
	let resultString = "";
	
	for(let i = 0, count = 0; i < stringLength; i++, count++){
		if(count > 63)
		{
			resultString = `${resultString}\r\n`;
			count = 0;
		}		
		resultString += pemString[i];
	}
	
	return resultString;
}

// ArrayBufferをStringに
function ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint8Array(buf));
}

// KeyPairを生成しPrivateKeyを表示させる
function createCryptoKeys() {
    return( Promise.resolve()
        .then(() => {
            // アルゴリズムを選びKeyPairを作る
            let algorithm = {
                name: signAlg,
                modulusLength: 2048,
                publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
                hash: {
                    name: hashAlg
                }
            };
            return subtle.generateKey(algorithm, true, ["sign", "verify"]);
        },
            error => Promise.reject((`Error during generateKey: ${error}`))
        )

        .then(keyPair => {
            // PrivateKeyをpkcs#8(秘密鍵)形式にExportする
            return (subtle.exportKey(
                "pkcs8",
                keyPair.privateKey
            ));
        },
            error => Promise.reject((`Error during exportkey: ${error}`))
        )

        .then(pkcs8 => {
            // ArrayBufferを文字列にし
            const pkcs8str = ab2str(pkcs8);
            // Base64エンコードを行い64文字毎に改行を行い
            const base64 = pac64(btoa(pkcs8str));
            // ヘッダとフッタを追加
            const pem = `-----BEGIN PRIVATE KEY-----\n${base64}\n-----END PRIVATE KEY-----`;

            // Textareaに表示
            document.getElementById("pem-text").value = pem;
            return (pem);
        })
    );
}

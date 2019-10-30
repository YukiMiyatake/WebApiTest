let crypto = window.crypto || window.msCrypto;
let subtle = crypto.subtle;
const signAlg = "RSASSA-PKCS1-v1_5";
const hashAlg = "SHA-256";

// PEM
function pac64(pemString)
{
	const stringLength = pemString.length;
	let resultString = "";
	
	for(let i = 0, count = 0; i < stringLength; i++, count++)
	{
		if(count > 63)
		{
			resultString = `${resultString}\r\n`;
			count = 0;
		}		
		resultString += pemString[i];
	}
	
	return resultString;
}

function ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint8Array(buf));
}

function exportPrivateKey(key) {
    return (subtle.exportKey(
        "pkcs8",
        key
    ).then((pkcs8) =>{
        const pkcs8str = ab2str(pkcs8);
        const base64 = pac64(btoa(pkcs8str));
        const pem = `-----BEGIN PRIVATE KEY-----\n${base64}\n-----END PRIVATE KEY-----`;

        return(pem);
    } ));
}

function createCryptoKeys(){
    createCryptoKeysAsync().then();
}

function createCryptoKeysAsync(){
    let sequence = Promise.resolve();
    //let keyPair;

    sequence = sequence.then(() =>
    {
        let algorithm = {
                name: signAlg,
                modulusLength: 2048,
                publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
                hash: {
                    name: hashAlg
                }
            };
            
            let sequence = Promise.resolve();
            return subtle.generateKey(algorithm, true,  ["sign", "verify"]);
    },
        error => Promise.reject((`Error during generateKey: ${error}`))
    );

    sequence = sequence.then(keyPair =>
    {
        exportPrivateKey(keyPair.privateKey).then(pem => {
            document.getElementById("pem-text").value = pem;
            return(pem);
        });
    },
        error => Promise.reject((`Error during exportkey: ${error}`))
    )

	return(sequence);
}

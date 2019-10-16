let crypto = window.crypto;
let subtle = crypto.subtle;
const signAlg = "RSASSA-PKCS1-v1_5";
const hashAlg = "SHA-256";

// 本物PEM
function formatPEM(pemString)
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

function str2ab(str) {
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
        }
    return buf;
}

// 改行などいれてない嘘PEM
function exportPrivateKey(key) {
    return (subtle.exportKey(
        "pkcs8",
        key
    ).then((pkcs8) =>{
        const pkcs8str = ab2str(pkcs8);
        const base64 = btoa(pkcs8str);
        const pem = `-----BEGIN PRIVATE KEY-----\n${base64}\n-----END PRIVATE KEY-----`;

        return(pem);
    } ));
}

function exportPublicKey(key) {
    return (subtle.exportKey(
        "spki",
        key
    ).then((pkcs8) =>{
        const pkcs8str = ab2str(pkcs8);
        const base64 = btoa(pkcs8str);
        const pem = `-----BEGIN PUBLIC KEY-----\n${base64}\n-----END PUBLIC KEY-----`;

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
    });
   
    
    let publicKey;
    let publicPem;

    sequence = sequence.then(keyPair =>
    {
        publicKey = keyPair.publicKey;

        return Promise.all([
            new Promise( resolve =>{
                exportPrivateKey(keyPair.privateKey).then( pem =>{

                    console.log("save key");
                    console.log( "privateKey: "  + pem );
                    resolve(pem);
                } );
            }),
            new Promise( resolve =>{
                exportPublicKey(keyPair.publicKey).then( pem =>{
                    publicPem = pem;
                    console.log("save key");
                    console.log( "publicKey: "  + pem );
                    resolve(pem);
                } );
            })
        ])
    },
    error => Promise.reject((`Error during key generation: ${error}`))
    )

	return(sequence);
}

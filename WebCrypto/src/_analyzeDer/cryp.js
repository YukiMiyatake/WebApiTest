import * as cryp from "lib.js";

const signAlg = "RSASSA-PKCS1-v1_5";
const hashAlg = "SHA-256";


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
            return cryp.getCrypto().generateKey(algorithm, true,  ["sign", "verify"]);
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

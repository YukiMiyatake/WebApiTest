let crypto = window.crypto || window.msCrypto;
let subtle = crypto.subtle;


export default class lib {

    static get getCrypto() {
        return subtle;
    }

    static ab2str(buf) {
        return String.fromCharCode.apply(null, new Uint8Array(buf));
    }

    static exportPrivateKey(key) {
        return (this.getCrypto.exportKey(
            "pkcs8",
            key
        ).then((pkcs8) =>{
            const pkcs8str = ab2str(pkcs8);
            const base64 = pac64(btoa(pkcs8str));
            const pem = `-----BEGIN PRIVATE KEY-----\n${base64}\n-----END PRIVATE KEY-----`;
    
            return(pem);
        } ));
    }

    static pac64(pemString)
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
}

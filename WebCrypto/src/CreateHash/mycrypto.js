// WebCryptoのライブラリ
let crypto = window.crypto || window.msCrypto;
let subtle = crypto.subtle || crypto.webkitSubtle;

// アルゴリズム
const hashAlg = "SHA-1";


// StringをArrayBufferに
function str2ab(str) {
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}

// ArrayBufferをHexに
function ab2hex(buf) {
    var s = "";
    var dataView = new DataView(buf);
    for (var i = 0; i < buf.byteLength; i++) {
        var hex = dataView.getUint8(i).toString(16);
        hex = "00".substr(0, 2 - hex.length) + hex;
        s += hex;
    }
    return s;
}

// Hash化する
function createHash() {
    return( Promise.resolve()
        .then(() => {
            const msg = str2ab(document.getElementById("msg-text").value);
            return(subtle.digest(hashAlg, msg));
        },
            error => Promise.reject((`Error during digest: ${error}`))
        )

        .then(hash => {
            const hex = ab2hex(hash);
            document.getElementById("hash-text").value = hex;
        })
    );
}

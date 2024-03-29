// WebCryptoのライブラリ
let crypto = window.crypto || window.msCrypto;
let subtle = crypto.subtle || crypto.webkitSubtle;

// アルゴリズム
const signAlg = "RSASSA-PKCS1-v1_5";
const hashAlg = "SHA-256";

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
    
    // PublicKeyとPrivateKeyのExportは並列実行出来る
    .then(keyPair => {      
      return Promise.all([
        // Private Key
        Promise.resolve()
        .then(() => {
            // PrivateKeyをpkcs#8(秘密鍵)形式にExportする
            return(subtle.exportKey(
              "pkcs8",
              keyPair.privateKey
            ));
        })
        
        .then(pkcs8 => {
          const pem = ab2pem(pkcs8, "PRIVATE KEY");
          return (pem);
        })

        // Public Key
        , Promise.resolve()
        .then(() => {
            // PublicKeyをspki形式にExportする
            return(subtle.exportKey(
              "spki",
              keyPair.publicKey
            ));
        })
        
        .then(pkcs8 => {
          const pem = ab2pem(pkcs8, "PUBLIC KEY");
          return (pem);
        })          
      ])

      .then(values => {
        document.getElementById("private-pem-text").value = values[0];
        document.getElementById("public-pem-text").value = values[1];
      });
    })
  );
}

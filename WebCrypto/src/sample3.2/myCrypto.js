// WebCryptoのライブラリ
let crypto = window.crypto || window.msCrypto;
let subtle = crypto.subtle;

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
    
    // PublicKeyとPrivateKeyのExportは並列で出来る
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






/*


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
      document.getElementById("private-pem-text").value = pem;
      return (pem);
    })
*/    
  );
}

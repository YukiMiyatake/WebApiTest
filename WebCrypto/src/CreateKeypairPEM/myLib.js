
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

// 
function ab2pem(buffer, header) {
  // ArrayBufferを文字列にし
  const pkcs8str = ab2str(buffer);
  // Base64エンコードを行い64文字毎に改行を行い
  const base64 = pac64(btoa(pkcs8str));
  // ヘッダとフッタを追加
  return( `-----BEGIN ${header}-----\n${base64}\n-----END ${header}-----` );
}

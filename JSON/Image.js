/**
 * v3
 * Fields: dataSourceName, jsonPath, urlprepend, urlappend, webp
 */
const _app = window.app;
const _MICROP = window.MICROP;
urlprepend = urlprepend ? urlprepend : "";
urlappend = urlappend ? urlappend : "";

function _arrayBufferToBase64( buffer ) {
    var binary = '';
    var bytes = new Uint8Array( buffer );
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode( bytes[ i ] );
    }
    return window.btoa(binary);
}

let pro =  Promise.all(_MICROP.promises).then(() => {
  const parsed = _MICROP.dataSources[dataSourceName.toLowerCase()].data;
  if(jsonPath.indexOf("[index]") > -1 && (Number(index) === 0 || index)){
    jsonPath = jsonPath.replace("[index]", index);
  }
  const properties = _MICROP.getDynamicPath(jsonPath).split(".");
  let value = parsed;
  for(let i = 0; i < properties.length; i++){
    value = value[properties[i]];
  }
  return urlprepend + value + urlappend;
});

if(webp === "True"){
  return MICROP.webpConvertion(pro);
}
else{
  return pro;
}
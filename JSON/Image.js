/**
 * v3
 * Fields: dataSourceName, jsonPath, urlprepend, urlappend, webp
 */
const _app = window.app;
const _MICROP = window.MICROP;
urlprepend = urlprepend ? urlprepend : "";
urlappend = urlappend ? urlappend : "";

let pro =  Promise.all(_MICROP.promises).then(() => {
  const parsed = _MICROP.dataSources[dataSourceName.toLowerCase()].data;
  jsonPath = _MICROP.evaluateIndex(jsonPath, index, "json");
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
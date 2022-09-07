/**
 * v2
 * Fields: dataSourceName, jsonPath, maxChars
 */
const _app = window.app;
const _MICROP = window.MICROP;

return Promise.all(_MICROP.promises).then(() => {
  const parsed = _MICROP.dataSources[dataSourceName.toLowerCase()].data;
  let value = parsed;
  if(jsonPath.indexOf("[index]") > -1 && (Number(index) === 0 || index)){
    jsonPath = jsonPath.replace("[index]", index);
  }
  const properties = _MICROP.getDynamicPath(jsonPath).split(".");
  let i = 0;
  for(; i < properties.length; i++){
    value = value[properties[i]];
  }
  value = value.trim();
  if(maxChars && value.length > Number(maxChars)){
    return value.substring(0, maxChars) + "...";
  }
  return value;
});
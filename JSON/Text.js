/**
 * v2
 * Fields: dataSourceName, jsonPath, maxChars
 */
const _app = window.app;
const _MICROP = window.MICROP;

return Promise.all(_MICROP.promises).then(() => {
  const parsed = _MICROP.dataSources[dataSourceName.toLowerCase()].data;
  jsonPath = _MICROP.evaluateIndex(jsonPath, index, "json");
  const properties = _MICROP.getDynamicPath(jsonPath).split(".");
  let value = parsed;
  let i = 0;
  for(; i < properties.length; i++){
    value = value[properties[i]];
  }
  return _MICROP.trimText(value, maxChars);
});
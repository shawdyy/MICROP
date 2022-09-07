/**
 * v1
 * Fields: dataSourceName, jsonPath, dateprop(day, time), locale(for example: en-US, en-GB, de-DE)
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

  for(let i = 0; i < properties.length; i++){
    value = value[properties[i]];
  }
  console.log(value);
  let date = new Date(value)
  if(dateprop === "day"){
    return date.toLocaleDateString(locale, {weekday: "long"})
  }
  let hours = date.getHours().toString();
  hours = (hours.length < 2) ? "0"+hours : hours
  let minutes = date.getMinutes().toString();
  minutes = (minutes.length < 2) ? "0"+minutes : minutes
  return hours + ":" + minutes;
});
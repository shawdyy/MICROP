/**
 * v1
 * Variables: data
 * Fields: jsonPath
 */
const parsed = JSON.parse(data.data);
const properties = MICROP.getDynamicPath(jsonPath).split(".");
let value = parsed;
for(let i = 0; i < properties.length; i++){
  value = value[properties[i]];
}
return value;
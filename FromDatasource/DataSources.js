/**
 * v1
 * Fields: name, dataSourceData
 */
const _app = window.app;
const _MICROP = window.MICROP

let pro = new Promise((resolve, reject) => {
    _MICROP.dataSources[name.toLowerCase()] = {
        html: dataSourceData.data,
        url: url,
    };
    _MICROP.dataSourceResolve();
    resolve(name);
})
_MICROP.promises.push(pro);
return pro;
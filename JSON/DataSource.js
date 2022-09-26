/**
 * v1
 * Fields: url, name, type, useProxy
 */
const _app = window.app;
const _MICROP = window.MICROP

const proxi = (useProxy !== "False") ? _app.debug.CD.proxyUrl(_MICROP.getDynamicUrl(url)) : url;
let pro = new Promise((resolve, reject) => {
    fetch(proxi)
        .then((response) => {
            return response.json()
        })
        .then((responseText) => {
            console.log(responseText)
            _MICROP.dataSources[name.toLowerCase()] = {
                data: responseText,
                url: url,
                type: type
            };
            _MICROP.dataSourceResolve();
            resolve(name);
        })
        .catch((err) => {
            console.log(err);
        });
})
_MICROP.promises.push(pro);
return pro;
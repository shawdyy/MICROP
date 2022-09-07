/**
 * v1
 * Fields: name, url
 */
const _app = window.app;
const _MICROP = window.MICROP
const domParser = new DOMParser();

const proxi = _app.debug.CD.proxyUrl(_MICROP.getDynamicUrl(url));

let pro = new Promise((resolve, reject) => {
    fetch(proxi)
        .then((response) => {
            return response.text()
        })
        .then((responseText) => {
            _MICROP.dataSources[name.toLowerCase()] = {
                html: responseText,
                url: url,
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
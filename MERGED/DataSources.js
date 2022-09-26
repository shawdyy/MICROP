/**
 *
 */
const _app = window.app;
const _MICROP = window.MICROP
const name = _app.getProperty("microp_dataSourceName")
const useProxy = _app.getProperty("microp_useProx")
const type = _app.getProperty("microp_dataSourceType").toLowerCase()
let pro;

if(!name) MICROP.throwError("Provide a name of datasource");
if(!type) MICROP.throwError("Provide a type of datasource");

_MICROP.debugLog([name, type].toString());
if(type === "html" || type === "json"){
    let url = _app.getProperty("microp_dataSourceUrl")
    const proxi = (useProxy !== "False") ? _app.debug.CD.proxyUrl(_MICROP.getDynamicUrl(url)) : url;
    pro = new Promise((resolve, reject) => {
        fetch(proxi)
            .then((response) => {
                if(type === "html") return response.text();
                if(type === "json") return response.json();
            })
            .then((responseText) => {
                _MICROP.debugLog(`newDatasource:: Response text: \n${responseText}`);
                _MICROP.dataSources[name.toLowerCase()] = {
                    data: responseText,
                    url: url,
                    type: type
                };
                _MICROP.dataSourceResolve();
                resolve(name);
            })
            .catch((err) => {
                _MICROP.throwError(err);
            });
    })
}
else if(type === "datasource_html" || type === "datasource_json"){
    let dataSourceData = _app.getProperty("dataSourceData").value.data
    pro = new Promise((resolve, reject) => {
        _MICROP.dataSources[name.toLowerCase()] = {
            html: dataSourceData.data,
            url: "none",
            type: type
        };
        _MICROP.dataSourceResolve();
        resolve(name);
    })
}
_MICROP.promises.push(pro);
return pro;
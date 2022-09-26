const _MICROP = window.MICROP;
const app = window.app;
const type = app.getProperty("microp_dataSourceType").toLowerCase();
if (type === "datasource_html" || type === "datasource_json") {
    _MICROP.debugLog("dataSourceEnabler","MI dataSourceEnabler activated")
    let dataSourceData = app.debug.getAllProperties().filter((el) => el.propertyPath === "dataSourceData")[0].value;
    let name = "datasource";
    let pro = new Promise((resolve, reject) => {
        _MICROP.dataSources[name.toLowerCase()] = {
            data: (type === "datasource_json") ? JSON.parse(dataSourceData.data): dataSourceData.data,
            url: "none",
            type: type
        };
        _MICROP.debugLog("dataSourceEnabler", _MICROP.dataSources[name.toLowerCase()].data);
        _MICROP.dataSourceResolve();
        resolve(name);
    })
    _MICROP.promises.push(pro);
    return pro;
}
return " ";
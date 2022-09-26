/**
 * Variables:
 * * _dataSourceName: string
 * * _dataSourceType: enum(html | json | datasource_html | datasource_json)
 * Fields: 
 * * selectorOrPath: string
 * * index: string
 * * maxChars: string
 */
const _MICROP = window.MICROP;
maxChars = (maxChars) ? maxChars : undefined;
return Promise.all(_MICROP.promises).then(() => {
    const dataSourceType = _dataSourceType;
    let dataSourceName = (dataSourceType.indexOf("datasource") > -1) ? "datasource" : _dataSourceName;
    let pro;

    if (dataSourceType === "html" || dataSourceType === "datasource_html") {
        pro = Promise.all(_MICROP.promises).then(() => {
            const doc = _MICROP.domParser.parseFromString(_MICROP.dataSources[dataSourceName.toLowerCase()].data, "text/html");
            let el = _MICROP.evaluateIndex(selectorOrPath, index, "html", doc);
            if (!el) {
                _MICROP.debugLog("getText","Couldn't find Element - Returned Fallback");
                return " ";
            }
            return el.innerText;
        });
    }
    else if (dataSourceType === "json" || dataSourceType === "datasource_json") {
        pro = Promise.all(_MICROP.promises).then(() => {
            try{
                const parsed = _MICROP.dataSources[dataSourceName.toLowerCase()].data;
                const jsonPath = _MICROP.evaluateIndex(selectorOrPath, index, "json");
                const properties = _MICROP.getDynamicPath(jsonPath).split(".");
                let value = parsed;
                for (let i = 0; i < properties.length; i++) {
                    value = value[properties[i]];
                }
                return value;
            }
            catch(err){
                _MICROP.throwError("getText::Couldn't find text in jsonPATH", err);
            }
        })
    }
    return _MICROP.trimText(pro, maxChars);
})
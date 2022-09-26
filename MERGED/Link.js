/**
 * Variables:
 * * _dataSourceName: string
 * * _dataSourceType: enum(html | json | datasource_html | datasource_json)
 * Fields: 
 * * selectorOrPath: string
 * * index: string
 * * urlprepend: string
 * * urlappend: string
 */
const _MICROP = window.MICROP;
return Promise.all(_MICROP.promises).then(() => {
    const dataSourceType = _dataSourceType;
    let dataSourceName = (dataSourceType.indexOf("datasource") > -1) ? "datasource" : _dataSourceName;
    urlprepend = urlprepend ? urlprepend : "";
    urlappend = urlappend ? urlappend : "";
    let pro;

    if (dataSourceType === "html" || dataSourceType === "datasource_html") {
        pro = Promise.all(_MICROP.promises).then(() => {
            const doc = _MICROP.domParser.parseFromString(_MICROP.dataSources[dataSourceName.toLowerCase()].data, "text/html");
            let el = _MICROP.evaluateIndex(selectorOrPath, index, "html", doc);
            if (!el) {
                _MICROP.debugLog("getLink","Couldn't find Element - Returned Fallback");
                return " ";
            }
            return urlprepend + el.getAttribute("href") + urlappend;
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
                src = src[properties[i]];
            }
            return urlprepend + value + urlappend;
        }
        catch(err){
            _MICROP.throwError("getLink::Couldn't find Image URL in jsonPATH");
        }
    })
    }
    return _MICROP.trimText(pro);
});
/**
 * Variables:
 * * _dataSourceName: string
 * * _dataSourceType: enum(html | json | datasource_html | datasource_json)
 * Fields: 
 * * selectorOrPath: string
 * * index: string
 * * condition: string
 * * negation: enum(true | false)
 * * alternativeAttribute: string
 */
const _MICROP = window.MICROP;

return Promise.all(_MICROP.promises).then(() => {
    const dataSourceType = _dataSourceType;
    let dataSourceName = (dataSourceType.indexOf("datasource") > -1) ? "datasource" : _dataSourceName;
    let pro;

    if (dataSourceType === "html" || dataSourceType === "datasource_html") {
        pro = Promise.all(_MICROP.promises).then(() => {
            const doc = _MICROP.domParser.parseFromString(_MICROP.dataSources[dataSourceName.toLowerCase()].data, "text/html");
            let el = _MICROP.evaluateIndex(selectorOrPath, index, "html", doc);
            let innerText;
            if (!el) {
                _MICROP.debugLog("getBool","Couldn't find Element - Returned false");
                _MICROP.evaluateNegation(negation, true);
            }
            if(condition){
                innerText = (alternativeAttribute) ? el.getAttribute(alternativeAttribute): el.innerText;
                innerText = "'" + innerText.trim() + "'";
                return _MICROP.evaluateNegation(negation, _MICROP.evaluateCondition(condition, innerText, "[VAL]"));
            }
            return ((alternativeAttribute) ? _MICROP.evaluateNegation(negation, el.getAttribute(alternativeAttribute)): _MICROP.evaluateNegation(negation, el.innerText));
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
                if(condition){
                    innerText = value;
                    return _MICROP.evaluateNegation(negation, _MICROP.evaluateCondition(condition, innerText, "[VAL]"));
                }
                return _MICROP.evaluateNegation(negation, value);
            }
            catch(err){
                _MICROP.throwError("getBool::Couldn't find bool in jsonPATH", err);
            }
        })
    }
    return pro;
})
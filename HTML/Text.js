/**
 * Fields: dataSourceName, selector, index, maxChars
 */
const _MICROP = window.MICROP;

return Promise.all(_MICROP.promises).then(() => {
    const doc = _MICROP.domParser.parseFromString(_MICROP.dataSources[dataSourceName.toLowerCase()].html, "text/html");
    let el = _MICROP.evaluateIndex(selector, index, "html", doc);
    if (!el) {
        console.log("Returned Fallback")
        return " ";
    }
    return _MICROP.trimText(el.innerText, maxChars);
})
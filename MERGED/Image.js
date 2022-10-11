/**
 * Variables:
 * * _dataSourceName: string
 * * _dataSourceType: enum(html | json | datasource_html | datasource_json)
 * Fields: 
 * * selectorOrPath: string
 * * index: string
 * * urlprepend: string
 * * urlappend: string
 * * webp: enum(True | False)
 */
const _MICROP = window.MICROP;
return Promise.all(_MICROP.promises).then(() => {
    const dataSourceType = _dataSourceType;
    let dataSourceName = (dataSourceType.indexOf("datasource") > -1) ? "datasource" : _dataSourceName;
    let pro;
    urlprepend = urlprepend ? urlprepend : "";
    urlappend = urlappend ? urlappend : "";

    if(!selectorOrPath) MICROP.throwError("Provide selector(HTML) or jsonPath(JSON)");

    if(dataSourceType === "html" || dataSourceType === "datasource_html"){
        if(!dataSourceName) MICROP.throwError("Provide a dataSourceName");
        pro = Promise.all(_MICROP.promises).then(() => {
            const doc = _MICROP.domParser.parseFromString(_MICROP.dataSources[dataSourceName.toLowerCase()].data, "text/html");
            let el  = _MICROP.evaluateIndex(selectorOrPath, index, "html", doc);
            if (!el) {
                _MICROP.debugLog("getImage","Couldn't find Element - Returned Fallback");
                return "https://movableink-assets-production.s3.amazonaws.com/9144/a36cef8c-0a7e-4d42-bf74-7e5610f39a7f/84b38107-c9dd-44e0-8ee0-8e73f133e757.jpg";
            }
            if (el.tagName === "DIV" && el.style.backgroundImage.length > 0) {
                let url = el.style.backgroundImage;
                url = url.substring('url("'.length);
                url = url.substring(0, url.indexOf('"'));
                return url;
            }
            let srcset;
            let src;
            if (el.tagName === "PICTURE") {
                if (el.querySelector("source").srcset && el.querySelector("source").srcset.match(/^\S+\.jpg/)) {
                    srcset = el.querySelector("source").srcset.match(/^\S+\.jpg/)[0]
                } else if (el.querySelector("source").getAttribute("data-lazysrcset") && el.querySelector("source").getAttribute("data-lazysrcset").match(/^\S+\.jpg/)) {
                    srcset = el.querySelector("source").getAttribute("data-lazysrcset").match(/^\S+\.jpg/)[0]
                }
                else if (el.querySelector("source").getAttribute("data-srcset") && el.querySelector("source").getAttribute("data-srcset").match(/^\S+\.jpg/)) {
                    srcset = el.querySelector("source").getAttribute("data-srcset").match(/^\S+\.jpg/)[0]
                }
                else {
                  srcset = el.querySelector("img").getAttribute("src");
                }
            } else {
                if (el.getAttribute("data-imgsrc")) {
                    _MICROP.debugLog("getImage","data-imgsrc")
                    srcset = el.getAttribute("data-imgsrc");
                } else if (el.getAttribute("data-src")) {
                    _MICROP.debugLog("getImage","data-src")
                    srcset = el.getAttribute("data-src");
                } else {
                    _MICROP.debugLog("getImage","src")
                    srcset = el.getAttribute("src");
                }
            }
            srcset = srcset.trim();
            switch (srcset.substring(0, 2)) {
                case "//":
                    src = "https:" + srcset;
                    break;
                case "ht":
                    src = srcset;
                    break;
                case "da":
                    src = srcset;
                    break;
                default:
                    src = srcset;
            }
            src = urlprepend + src + urlappend;
            _MICROP.debugLog("MICROP.getImage", src);
            return src + ((src.indexOf("?") > 0) ? "&" : "?") + "imgeng=/f_jpg&imformat=generic";
        });
    }
    else if(dataSourceType === "json" || dataSourceType === "datasource_json"){
        pro = Promise.all(_MICROP.promises).then(() => {
            try{
                const parsed = _MICROP.dataSources[dataSourceName.toLowerCase()].data;
                const jsonPath = _MICROP.evaluateIndex(selectorOrPath, index, "json");
                const properties = _MICROP.getDynamicPath(jsonPath).split(".");
                let src = parsed;
                for (let i = 0; i < properties.length; i++) {
                    src = src[properties[i]];
                }
                src = urlprepend + src + urlappend;
                _MICROP.debugLog("MICROP.getImage", src);
                return src + ((src.indexOf("?") > 0) ? "&" : "?") + "imgeng=/f_jpg&imformat=generic";
            }
            catch(err){
                _MICROP.throwError("getImage::Couldn't find Image URL in jsonPATH");
            }
        });
    }
    if(webp === "True"){
        return _MICROP.webpConvertion(pro);
    }
    return pro;
})
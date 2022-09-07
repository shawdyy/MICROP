/**
 * v1
 * Fields: dataSourceName, selector, urlprepend, urlappend
 */
const _MICROP = window.MICROP;
urlprepend = urlprepend ? urlprepend : "";
urlappend = urlappend ? urlappend : "";

return Promise.all(_MICROP.promises).then(() => {
    const doc = _MICROP.domParser.parseFromString(_MICROP.dataSources[dataSourceName.toLowerCase()].html, "text/html");
    let el;
    if(selector.indexOf("[index]") > -1 && (Number(index) === 0 || index)){
      let str = selector.split("[index]");
      el = doc.querySelectorAll(str[0])[index].querySelector(str[1]);
    }
    else if(Number(index) === 0 || index){
      el = doc.querySelectorAll(selector)[Number(index)];
    }
    else{
      el = doc.querySelector(selector);  
    }
    if (!el) {
        console.log("Returned Fallback")
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
        else {
          srcset = el.querySelector("img").getAttribute("src");
        }
    } else {
        if (el.getAttribute("data-imgsrc")) {
            console.log("data-imgsrc")
            srcset = el.getAttribute("data-imgsrc");
        } else if (el.getAttribute("data-src")) {
            console.log("data-src")
            srcset = el.getAttribute("data-src");
        } else {
            console.log("src")
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
    console.log(src)
    return urlprepend + src + urlappend + ((src.indexOf("?") > 0) ? "&" : "?") + "imgeng=/f_jpg&imformat=generic";
})
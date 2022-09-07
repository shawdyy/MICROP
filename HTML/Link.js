/**
 * Fields: dataSourceName, selector, index, urlprepend, urlappend
 */
const _MICROP = window.MICROP;
urlprepend = urlprepend ? urlprepend : "";
urlappend = urlappend ? urlappend : "";

return Promise.all(_MICROP.promises).then(() => {
    const doc = _MICROP.domParser.parseFromString(_MICROP.dataSources[dataSourceName.toLowerCase()].html, "text/html");
    let el;
    let href;
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
        return " ";
    }
    else if(el.tagName === "A" && el.href){
        href = el.href;
    }
    else{
      while(!(el.tagName === "A" && el.href)){
          el = el.querySelector("a");
      }
      href = el.href;
    } 
    return urlprepend + href + urlappend;
})
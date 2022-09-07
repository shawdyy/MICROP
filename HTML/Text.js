/**
 * Fields: dataSourceName, selector, index, maxChars
 */
const _MICROP = window.MICROP;

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
        return " ";
    }
    let text = el.innerText.trim();
    if(maxChars && text.length > Number(maxChars)){
      return text.substring(0, maxChars) + "...";
    }
    return text;
})
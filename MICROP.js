(function () {

var app = new studio191048C9.A();
  window.app = app;
  window.MICROP = {};
  MICROP.dataSourceResolve = undefined;
  MICROP.dataSourceReject = undefined;
  MICROP.dataSources = {};
  MICROP.domParser = new DOMParser();
  MICROP.promises = [new Promise((resolve, reject) => {
    MICROP.dataSourceResolve = resolve;
    MICROP.dataSourceReject = reject;
  })];
  MICROP.getDataSource = (name) => {
    return window.MICROP.dataSources[name.toLowerCase()].data;
  };
  MICROP.lookbehindWorkaround = (string, symbolstart, symbolend) => {
    let str = string;
    let res = [];
    let i = 0;
    let indexStart = 0;
    let indexEnd = 0;
    while (indexStart > -1) {
      indexStart = str.indexOf(symbolstart);
      indexEnd = str.indexOf(symbolend);
      if (indexStart < 0 || indexEnd < 0) {
        break;
      }
      let match = str.substring(indexStart + 1, indexEnd);
      res.push(match);
      str = str.substring(indexEnd + 1);
    }
    return res;
  };
  MICROP.getDynamicUrl = (url) => {
    const matches = MICROP.lookbehindWorkaround(url, "[", "]");
    const placeholder = url.match(/\[\w+\]/g);
    for (let i = 0; i < matches.length; i++) {
      let dynamic_field = app.getProperty(`params.${matches[i]}`);
      url = url.replace(placeholder[i], dynamic_field);
    }
    return url;
  };
  MICROP.getDynamicPath = (jsonPath) => {
    const matches = MICROP.lookbehindWorkaround(jsonPath, "[", "]");
    const placeholder = jsonPath.match(/\[\w+\]/g);
    for (let i = 0; i < matches.length; i++) {
      try {
        let dynamic_field = app.getProperty(`params.${matches[i]}`);
        jsonPath = jsonPath.replace(placeholder[i], dynamic_field);
      } catch (err) {

      }
    }
    return jsonPath;
  };
  MICROP.getDynamicField = (dynamicField) => {
    const match = MICROP.lookbehindWorkaround(dynamicField, "[", "]");
    try{
      let value = app.getProperty(`params.${match[0]}`);
      return value;
    }
    catch(err){

    }
  };
  MICROP.activateSVGSupport = () => {
    let svgs = Array.from(document.querySelectorAll(".type-image.tool-image")).filter((el) => {
      return el.querySelector("img[src*='data:image/svg+xml']");
    });
    svgs.forEach((el) => {
      el.querySelector(".studio-dynamic-image").style.width = "auto";
      el.querySelector(".studio-dynamic-image").style.height = "auto";
      el.querySelector("img[src^='data:image/svg+xml']").style.width = el.style.width;
      el.querySelector("img[src^='data:image/svg+xml']").style.height = el.style.height;
      el.style.overflow = "visible";
    });
  };
  MICROP.webpConvertion = (promise) => {
    const _arrayBufferToBase64 = (buffer) => {
      var binary = '';
      var bytes = new Uint8Array( buffer );
      var len = bytes.byteLength;
      for (var i = 0; i < len; i++) {
          binary += String.fromCharCode( bytes[ i ] );
      }
      return window.btoa(binary);
    }
    const h = {
      "User-Agent": "PostmanRuntime"
    }
    return promise
    .then((d) => {
      return fetch(app.debug.CD.proxyUrl(d), {method: "GET", headers: h})
      .then((d) => {
        return d.arrayBuffer();
      })
    })
    .then((d) => {
      return "data:image/png;base64," + _arrayBufferToBase64(d);
    })
  };
  (() => {
    const fallbackValues = [{
      dynamic_field: "language",
      fallback: "de"
    }];
    const setFallbacks = (arr) => {
      arr.forEach((el, i) => {
        if (!app.getProperty(`params.${el.dynamic_field}`)) {
          app.overrideProperty(`params.${el.dynamic_field}`, (e) => {
            return el.fallback;
          });
        }
      })
    }
    setFallbacks(fallbackValues);
  })()
app.render(document.getElementById('react-root')).then(function () {
  MICROP.activateSVGSupport();
  window.APP_SUCCESSFULLY_RENDERED = true;
});
})();

(function () {

    var app = new studio191048C9.A();
    window.app = app;
    window.MICROP = {};
    MICROP.dataSourceResolve = undefined;
    MICROP.dataSourceReject = undefined;
    MICROP.isDebugLogActivated = (app.getProperty("microp_debug") === "True");
    MICROP.globalIndex = (app.getProperty("microp_globalIndex")) ? app.getProperty("microp_globalIndex") : null;
    MICROP.dataSources = {};
    MICROP.domParser = new DOMParser();
    MICROP.promises = [new Promise((resolve, reject) => {
        MICROP.dataSourceResolve = resolve;
        MICROP.dataSourceReject = reject;
    })];
    MICROP.debugLog = function (name) {
        if (MICROP.isDebugLogActivated) {
            for (let i = 1; i < arguments.length; i++) {
                console.log("MICROP DEBUG LOG "+ (name), arguments[i]);
            }
        }
    }
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
        MICROP.debugLog("activateSVGSupport");
    };
    MICROP.webpConvertion = (promise) => {
        const _arrayBufferToBase64 = (buffer) => {
            var binary = '';
            var bytes = new Uint8Array(buffer);
            var len = bytes.byteLength;
            for (var i = 0; i < len; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            return window.btoa(binary);
        }
        const h = {
            "User-Agent": "PostmanRuntime",
            "Accept": "image/png, image/jpg"
        }
        return promise
            .then((d) => {
                return fetch(app.debug.CD.proxyUrl(d), {
                        method: "GET",
                        headers: h
                    })
                    .then((d) => {
                        return d.arrayBuffer();
                    })
            })
            .then((d) => {
                MICROP.debugLog("webpConvertion");
                return "data:image/png;base64," + _arrayBufferToBase64(d);
            })
    };
    MICROP.setFallbacks = (arr) => {
        arr.forEach((el, i) => {
            if (!app.getProperty(`params.${el.dynamic_field}`)) {
                app.overrideProperty(`params.${el.dynamic_field}`, (e) => {
                    return el.fallback;
                });
            }
        });
        MICROP.debugLog("setFallbacks", arr);
    };
    MICROP.evaluateIndex = (searchString, index, type, doc = null) => {
        // Priority of index
        // 1. Global
        // 2. placeholder in selector
        // 3. Array Index
        // 4. First Match
        if (type === "html") {
            if (MICROP.globalIndex !== null && (MICROP.globalIndex || Number(MICROP.globalIndex) === 0)) {
                MICROP.debugLog("evaluateIndex", "Placeholder->GlobalIndex");
                let globalIndex = Number(MICROP.globalIndex);
                let str = searchString.split("[index]");
                return doc.querySelectorAll(str[0])[globalIndex].querySelector(str[1]);
            } else if (searchString.indexOf("[index]") > -1 && (Number(index) === 0 || index)) {
                MICROP.debugLog("evaluateIndex", "Placeholder->LocalIndex");
                let str = searchString.split("[index]");
                if(str[0].length > 0 && str[1].length > 0) return doc.querySelectorAll(str[0])[Number(index)].querySelector(str[1]);
                return doc.querySelectorAll(str[0])[Number(index)];
            } else if (Number(index) === 0 || index) {
                MICROP.debugLog("evaluateIndex", "LocalIndex");
                return doc.querySelectorAll(searchString)[Number(index)];
            } else {
                MICROP.debugLog("evaluateIndex", "First Match");
                return doc.querySelector(searchString);
            }
        } else if (type === "json") {
            if (MICROP.globalIndex !== null && (MICROP.globalIndex || Number(MICROP.globalIndex) === 0)) {
                MICROP.debugLog("evaluateIndex", "Placeholder->GlobalIndex");
                globalIndex = Number(MICROP.globalIndex);
                return searchString.replace("[index]", globalIndex);
            } else if (searchString.indexOf("[index]") > -1 && (Number(index) === 0 || index)) {
                MICROP.debugLog("evaluateIndex", "Placeholder->LocalIndex");
                return searchString.replace("[index]", index);
            } else {
                MICROP.debugLog("evaluateIndex", "Match");
                return searchString;
            }
        }
    };
    MICROP.evaluateCondition = (conditionString, innerText, placeholder) => {
        let condition = conditionString.replace(placeholder, innerText);
        return Boolean(eval(condition));
    }
    MICROP.evaluateNegation = (negation, value) =>{
        negation = !!(negation === "true");
        return (negation) ? !Boolean(value) : Boolean(value);
    }
    MICROP.trimText = (prom, maxChars) => {
        return prom.then((string) => {
            if (typeof string !== "string") {
                string = string.toString();
            }
            string = string.trim();
            if (maxChars && string.length > Number(maxChars)) {
                return string.substring(0, maxChars) + "...";
            }
            return string;
        })
    }
    MICROP.throwError = (message) => {
        throw new Error("MICROP ERROR: " + message);
    }
    MICROP.initDataSource = () => {

        let name = app.getProperty("microp_dataSourceName")
        const useProxy = app.getProperty("microp_useProxy")
        const type = app.getProperty("microp_dataSourceType").toLowerCase()
        let pro;

        if (!type) MICROP.throwError("Provide a type of datasource");

        if (type === "html" || type === "json") {
            if (!name) MICROP.throwError("Provide a name of datasource");
            let url = app.getProperty("microp_dataSourceUrl")
            const proxi = (useProxy !== "False") ? app.debug.CD.proxyUrl(MICROP.getDynamicUrl(url)) : MICROP.getDynamicUrl(url);
            pro = new Promise((resolve, reject) => {
                fetch(proxi)
                    .then((response) => {
                        if (type === "html") return response.text();
                        if (type === "json") return response.json();
                    })
                    .then((responseText) => {
                        MICROP.dataSources[name.toLowerCase()] = {
                            data: responseText,
                            url: url,
                            type: type
                        };
                        if (type === "html") MICROP.debugLog("initDataSource", MICROP.dataSources[name.toLowerCase()].data);
                        else MICROP.debugLog("initDataSource", JSON.stringify(MICROP.dataSources[name.toLowerCase()].data));
                        MICROP.dataSourceResolve();
                        resolve(name);
                    })
                    .catch((err) => {
                        MICROP.throwError(err);
                    });
            })
            MICROP.promises.push(pro);
        }
    }

    MICROP.setFallbacks([{
        dynamic_field: "language",
        fallback: "de"
    }]);
    MICROP.initDataSource();
    app.render(document.getElementById('react-root')).then(function () {
        MICROP.activateSVGSupport();
        window.APP_SUCCESSFULLY_RENDERED = true;
    });
})();
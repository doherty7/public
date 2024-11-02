if (typeof DX5Manager == "undefined") {
    var DX5Manager = function() {
        function detectBrowser() {
            var ag = navigator.userAgent,
                match = null,
                rs = {
                    isOpera: false,
                    isFirefox: false,
                    isSafari: false,
                    isChrome: false,
                    isIE: false,
                    isEdge: false,
                    isUnKnown: false,
                    version: "0"
                };
            if (!!window.opr || !!window.opera || ag.indexOf(" OPR/") >= 0) {
                rs.isOpera = true;
                match = ag.match(/ OPR\/([0-9]+)\./);
                rs.version = match ? match[1] : "8";
                return rs
            }
            if (typeof InstallTrigger !== "undefined") {
                rs.isFirefox = true;
                match = ag.match(/Firefox\/([0-9]+)\./);
                rs.version = match ? match[1] : "1";
                return rs
            } else if (ag.indexOf("FxiOS/") >= 0) {
                rs.isFirefox = true;
                match = ag.match(/FxiOS\/([0-9]+)\./);
                rs.version = match ? match[1] : "1";
                return rs
            }
            if (false || !!document.documentMode) {
                rs.isIE = true;
                match = ag.match(/MSIE ([0-9]+)\./);
                if (match) rs.version = match[1];
                else if (!window.ActiveXObject && "ActiveXObject" in window) rs.version = "11";
                return rs
            }
            if (!!window.StyleMedia && !!navigator.msSaveBlob) {
                rs.isEdge = true;
                match = ag.match(/Edge\/([0-9]+)\./);
                rs.version = match ? match[1] : "1";
                return rs
            }
            if (window.chrome) {
                rs.isChrome = true;
                match = ag.match(/Chrom(e|ium)\/([0-9]+)\./);
                rs.version = match ? match[2] : "1";
                return rs
            }
            if (ag.indexOf("CriOS/") >= 0) {
                rs.isChrome = true;
                match = ag.match(/CriOS\/([0-9]+)\./);
                rs.version = match ? match[1] : "1";
                return rs
            }
            if (/constructor/i.test(window.HTMLElement) || function(p) {
                    if (p.toString() === "true" && ag.indexOf("Safari/") >= 0 && /Mac/.test(ag)) return true;
                    else return p.toString() === "[object SafariRemoteNotification]"
                }(!window["safari"] || window["safari"].pushNotification)) {
                rs.isSafari = true;
                match = ag.match(/ Version\/([0-9]+)\./);
                rs.version = match ? match[1] : "3";
                return rs
            }
            if (ag.indexOf("Safari/") >= 0 && /iP(ad|od|hone)/.test(ag)) {
                rs.isSafari = true;
                match = ag.match(/ Version\/([0-9]+)\./);
                rs.version = match ? match[1] : "3";
                return rs
            }
            rs.isUnKnown = true;
            return rs
        }

        function detectEnvironment(preloadedBrowserInfo) {
            var env = {
                    osName: "",
                    osVersion: "",
                    isMobile: false,
                    browser: "",
                    browserVersion: "",
                    supportedOSForHD: false,
                    supportedBrowserForHD: false,
                    supportedOSForSingleDownload: false,
                    supportedOSForMultiDownload: false,
                    notConsoleSupported: false,
                    notOnLoadSupported: false
                },
                ag = navigator.userAgent,
                dic = [{
                    n: "Windows 10",
                    r: /(Windows 10.0|Windows NT 10.0)/
                }, {
                    n: "Windows 8.1",
                    r: /(Windows 8.1|Windows NT 6.3)/
                }, {
                    n: "Windows 8",
                    r: /(Windows 8|Windows NT 6.2)/
                }, {
                    n: "Windows 7",
                    r: /(Windows 7|Windows NT 6.1)/
                }, {
                    n: "Windows Vista",
                    r: /Windows NT 6.0/
                }, {
                    n: "Windows Server 2003",
                    r: /Windows NT 5.2/
                }, {
                    n: "Windows XP",
                    r: /(Windows NT 5.1|Windows XP)/
                }, {
                    n: "Windows 2000",
                    r: /(Windows NT 5.0|Windows 2000)/
                }, {
                    n: "Windows ME",
                    r: /(Win 9x 4.90|Windows ME)/
                }, {
                    n: "Windows 98",
                    r: /(Windows 98|Win98)/
                }, {
                    n: "Windows 95",
                    r: /(Windows 95|Win95|Windows_95)/
                }, {
                    n: "Windows NT 4.0",
                    r: /(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/
                }, {
                    n: "Windows CE",
                    r: /Windows CE/
                }, {
                    n: "Windows 3.11",
                    r: /Win16/
                }, {
                    n: "Android",
                    r: /Android/
                }, {
                    n: "Open BSD",
                    r: /OpenBSD/
                }, {
                    n: "Sun OS",
                    r: /SunOS/
                }, {
                    n: "Linux",
                    r: /(Linux|X11)/
                }, {
                    n: "iOS",
                    r: /(iPhone|iPad|iPod)/
                }, {
                    n: "Mac OS X",
                    r: /Mac OS X/
                }, {
                    n: "Mac OS",
                    r: /(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/
                }, {
                    n: "QNX",
                    r: /QNX/
                }, {
                    n: "UNIX",
                    r: /UNIX/
                }, {
                    n: "BeOS",
                    r: /BeOS/
                }, {
                    n: "OS/2",
                    r: /OS\/2/
                }, {
                    n: "Search Bot",
                    r: /(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/
                }],
                match = null;
            for (var i = 0; i < dic.length; i++) {
                if (dic[i].r.test(ag)) {
                    env.osName = dic[i].n;
                    break
                }
            }
            if (/Windows/.test(env.osName)) {
                match = /Windows (.*)/.exec(env.osName);
                env.osVersion = match && match[1];
                env.osName = "Windows"
            } else if (env.osName === "Mac OS X") {
                match = /Mac OS X ([0-9]{2}[._\d]+)/.exec(ag);
                env.osVersion = match && match[1]
            } else if (env.osName === "Android") {
                match = /Android ([._\d]+)/.exec(ag);
                env.osVersion = match && match[1]
            } else if (env.osName === "iOS") {
                match = /OS (\d+)_(\d+)_?(\d+)?/.exec(navigator.appVersion);
                env.osVersion = match && match[1] + "." + match[2] + "." + (match[3] || 0)
            }
            env.isMobile = /Mobile|mini|Fennec|Android|iP(ad|od|hone)/.test(navigator.appVersion);
            var br = preloadedBrowserInfo || detectBrowser();
            env.browser = br.isOpera ? "Opera" : br.isFirefox ? "FireFox" : br.isSafari ? "Safari" : br.isChrome ? "Chrome" : br.isIE ? "Internet Explorer" : br.isEdge ? "Edge" : "";
            env.browserVersion = br.version;
            env.supportedOSForHD = env.osName === "Windows" || env.osName.indexOf("Mac") >= 0;
            if (!env.supportedOSForHD) {
                env.supportedBrowserForHD = false
            } else if (env.osName === "Windows") {
                if (br.isIE && parseInt(br.version, 10) < 10) env.supportedBrowserForHD = false;
                else if (br.isUnKnown || br.isSafari) env.supportedBrowserForHD = false;
                else env.supportedBrowserForHD = true;
                if (br.isIE && parseInt(br.version, 10) < 9) env.notConsoleSupported = true;
                if (br.isIE && parseInt(br.version, 10) < 9) env.notOnLoadSupported = true
            } else {
                if (br.isSafari && parseInt(br.version, 10) < 11) env.supportedBrowserForHD = false;
                else if (br.isUnKnown) env.supportedBrowserForHD = false;
                else env.supportedBrowserForHD = true
            }
            env.supportedOSForSingleDownload = false;
            env.supportedOSForMultiDownload = false;
            for (var idx = 0, ables = ["Windows", "Mac OS X", "Android", "Linux"]; idx < ables.length; idx++) {
                if (env.osName === ables[idx]) {
                    env.supportedOSForSingleDownload = true;
                    env.supportedOSForMultiDownload = true;
                    break
                }
            }
            if (env.osName === "iOS" && br.isSafari && parseInt(br.version, 10) >= 13) {
                env.supportedOSForSingleDownload = true;
                env.supportedOSForMultiDownload = false
            }
            env.supportedHTML5Upload = window.Blob && window.File && window.FileList && window.FileReader ? true : false;
            return env
        }

        function AXFiltering() {
            if (false == !!document.documentMode) {
                return "unsupported"
            }
            if (typeof window.external.msActiveXFilteringEnabled == "unknown") {
                if (window.external.msActiveXFilteringEnabled()) {
                    return true
                } else {
                    return false
                }
            } else {
                return false
            }
        }

        function loopTask(o) {
            var index = -2;
            var next = function() {
                index++;
                try {
                    if (index === -1) {
                        if (o.init && typeof o.init == "function") o.init(next)
                    } else if (index > -1 && index < o.length) {
                        if (o.func && typeof o.func == "function") o.func(next, index)
                    } else {
                        if (o.complete && typeof o.complete == "function") o.complete()
                    }
                } catch (ex) {
                    if (o.error && typeof o.error == "function") o.error(ex, index)
                }
            };
            next()
        }

        function dic2kvList(dic) {
            var lst = [];
            if (dic) {
                for (var key in dic) {
                    lst.push(encodeURIComponent(key) + "=" + encodeURIComponent(dic[key]))
                }
            }
            return lst
        }

        function ab2str(ab, encoding) {
            if ("TextDecoder" in window) {
                var dataView = new DataView(ab);
                var decoder = new TextDecoder(encoding);
                return decoder.decode(dataView)
            } else {
                console.log("Your browser doesn't support the text encoding API.");
                return String.fromCharCode.apply(null, new Uint8Array(ab))
            }
        }

        function xml2str(src) {
            if (isDefined(src.xml)) return src.xml;
            else if (isDefined(src.innerHTML)) return src.innerHTML;
            else if (isDefined(src.documentElement)) {
                if (isDefined(src.documentElement.xml)) return src.documentElement.xml;
                if (isDefined(src.documentElement.innerHTML)) return src.documentElement.innerHTML;
                else if ("XMLSerializer" in window) {
                    var serializer = new XMLSerializer;
                    return serializer.serializeToString(src)
                } else return src
            } else return src
        }

        function combinePath(prev, next) {
            var bpi = prev.lastIndexOf("/") == prev.length - 1;
            var bni = next.indexOf("/") == 0;
            if (bpi && bni) return prev + next.substring(1);
            else if (bpi && !bni) return prev + next;
            else if (!bpi && bni) return prev + next;
            else return prev + "/" + next
        }

        function compareVersion(vera, verb) {
            var tokenA = vera.split(/\./);
            var tokenB = verb.split(/\./);
            for (var i = 0, len = Math.max(tokenA.length, tokenB.length), va = 0, vb = 0; i < len; i++) {
                va = i < tokenA.length ? parseInt(tokenA[i]) : 0;
                vb = i < tokenB.length ? parseInt(tokenB[i]) : 0;
                if (va < vb) return -1;
                else if (va > vb) return 1;
                else continue
            }
            return 0
        }
        var DX5HDManager = function(manager) {
            this.manager = manager
        };
        DX5HDManager.prototype.$throwHDErr = function(id, rc, ec, em) {
            this.manager.throwErr(id, "EHD-" + rc + "-" + ec, em || "")
        };
        DX5HDManager.prototype.$communicateToApp = function(url, method, callbackFunctions, returnType, data, requestHeaders, asyncflag) {
            var xhr = typeof XMLHttpRequest !== "undefined" ? new XMLHttpRequest : new ActiveXObject("Microsoft.XMLHTTP"),
                query = dic2kvList(data);
            url = method.toUpperCase() != "POST" ? url + (query.length > 0 ? "?" + query.join("&") : "") : url;
            xhr["method"] = method.toUpperCase();
            xhr.open(xhr["method"], url, asyncflag);
            if (method === "POST") xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            if (requestHeaders)
                for (var h in requestHeaders) {
                    xhr.setRequestHeader(h, requestHeaders[h])
                }
            if (returnType == "blob") xhr.responseType = "blob";
            else if (returnType == "json") xhr.responseType = "json";
            else if (returnType == "xml") {
                xhr.overrideMimeType("text/xml");
                xhr.responseType = "document"
            } else if (returnType == "buffer") xhr.responseType = "arraybuffer";
            else xhr.responseType = "text";
            var funcError = function(evt) {
                if (callbackFunctions && typeof callbackFunctions.error == "function") {
                    callbackFunctions.error(xhr.status, evt.message)
                }
            };
            var funcReady = function() {
                if (xhr.readyState == 2) {
                    if (callbackFunctions && typeof callbackFunctions.header == "function") {
                        callbackFunctions.header()
                    }
                }
            };
            var funcStart = function(evt) {
                if (callbackFunctions && typeof callbackFunctions.start == "function") {
                    callbackFunctions.start(evt)
                }
            };
            var funcProgress = function(evt) {
                if (callbackFunctions && typeof callbackFunctions.progress == "function") {
                    callbackFunctions.progress(evt)
                }
            };
            var funcAbort = function() {
                if (callbackFunctions && typeof callbackFunctions.abort == "function") {
                    callbackFunctions.abort()
                }
            };
            var funcTimeout = function() {
                if (callbackFunctions && typeof callbackFunctions.timeout == "function") {
                    callbackFunctions.timeout()
                }
            };
            var funcLoad = function() {
                if (xhr.status < 400) {
                    if (callbackFunctions && typeof callbackFunctions.load == "function") {
                        if (method === "HEAD") {
                            callbackFunctions.load("")
                        } else {
                            switch (xhr.responseType) {
                                case "arraybuffer":
                                    callbackFunctions.load(xhr.response);
                                    break;
                                case "document":
                                    callbackFunctions.load(xhr.responseXML);
                                    break;
                                case "json":
                                    callbackFunctions.load(xhr.response);
                                    break;
                                case "blob":
                                    callbackFunctions.load(xhr.response);
                                    break;
                                default:
                                    callbackFunctions.load(xhr.responseText);
                                    break
                            }
                        }
                    }
                } else {
                    if (callbackFunctions && typeof callbackFunctions.error == "function") {
                        var contentType = xhr.getResponseHeader("Content-Type");
                        if (contentType && contentType.indexOf("text/") == 0) {
                            if (xhr.responseType == "blob") {
                                var fr = new FileReader;
                                var frLoad = function(frevt) {
                                    var errbody = frevt.target.result;
                                    fr.removeEventListener("load", frLoad);
                                    callbackFunctions.error(xhr.status, errbody)
                                };
                                fr.addEventListener("load", frLoad);
                                fr.readAsText(xhr.response)
                            } else if (xhr.responseType == "arraybuffer") {
                                var errbody = ab2str(!xhr.response ? [] : xhr.response, "utf-8");
                                callbackFunctions.error(xhr.status, errbody)
                            } else if (xhr.responseType == "json") {
                                callbackFunctions.error(xhr.status, !xhr.response ? "Check the response body from the browser network tab in development mode." : xhr.response)
                            } else if (xhr.responseType == "document") {
                                callbackFunctions.error(xhr.status, xml2str(xhr.response))
                            } else {
                                callbackFunctions.error(xhr.status, xhr.response)
                            }
                        } else {
                            callbackFunctions.error(xhr.status, xhr.response)
                        }
                    }
                }
            };
            var funcEnd = function() {
                xhr.removeEventListener("readystatechange", funcReady);
                xhr.removeEventListener("loadstart", funcStart);
                xhr.removeEventListener("progress", funcProgress);
                xhr.removeEventListener("error", funcError);
                xhr.removeEventListener("abort", funcAbort);
                xhr.removeEventListener("timeout", funcTimeout);
                xhr.removeEventListener("load", funcLoad);
                xhr.removeEventListener("loadend", funcEnd)
            };
            xhr.addEventListener("readystatechange", funcReady, false);
            xhr.addEventListener("loadstart", funcStart, false);
            xhr.addEventListener("progress", funcProgress, false);
            xhr.addEventListener("abort", funcAbort, false);
            xhr.addEventListener("error", funcError, false);
            xhr.addEventListener("timeout", funcTimeout, false);
            xhr.addEventListener("load", funcLoad, false);
            xhr.addEventListener("loadend", funcEnd, false);
            xhr.send(xhr["method"] == "POST" && query.length > 0 ? query.join("&") : null);
            return xhr
        };
        DX5HDManager.prototype.$getHDOrigin = function(isHDS) {
            var pathName = isHDS === true ? "/DEXTUploadX5_HDS" : "/DEXTUploadX5_HDM";
            var mng = this.manager;
            if (mng.environment.osName === "Windows") {
                if (!mng.browser.isIE && !mng.browser.isChrome && !mng.browser.isFirefox && !mng.browser.isOpera && !mng.browser.isEdge) {
                    throw new Error("Current browser(" + mng.environment.browser + ") is not supported to use the HD application.")
                }
                if (mng.browser.isIE && (location.protocol == "https" || location.protocol == "https:")) return "https://127.0.0.1" + pathName;
                else return "http://127.0.0.1:35959" + pathName
            } else if (mng.environment.osName.indexOf("Mac") >= 0) {
                if (!mng.browser.isSafari && !mng.browser.isChrome && !mng.browser.isFirefox && !mng.browser.isOpera) {
                    throw new Error("Current browser(" + mng.environment.browser + ") is not supported to use the HD application.")
                }
                if (mng.browser.isSafari && (location.protocol == "https" || location.protocol == "https:")) return "https://localhost:" + (isHDS === true ? "35757" : "35959") + pathName;
                else return "http://127.0.0.1:" + (isHDS === true ? "35656" : "35858") + pathName
            } else throw new Error("Current OS(" + mng.environment.osName + ") is not supported to use the HD application.")
        };
        DX5HDManager.prototype.$callHDS = function(cmdnum, data, success, fail) {
            var origin = "";
            try {
                origin = this.$getHDOrigin(true)
            } catch (ex) {
                fail(undefined, ex.message);
                return
            }
            data["cmd"] = cmdnum;
            this.$communicateToApp(origin, "POST", {
                load: function(res) {
                    success(res)
                },
                error: function(ecode, err) {
                    fail(ecode, err)
                }
            }, "text", data, {}, true)
        };
        DX5HDManager.prototype.$callHDM = function(cmdnum, data, success, fail) {
            var origin = "";
            try {
                origin = this.$getHDOrigin(false)
            } catch (ex) {
                fail(undefined, ex.message);
                return
            }
            data["cmd"] = cmdnum;
            this.$communicateToApp(origin, "POST", {
                load: function(res) {
                    success(res)
                },
                error: function(ecode, err) {
                    fail(ecode, err)
                }
            }, "text", data, {}, true)
        };
        DX5HDManager.prototype.$runHDM = function(module, callback) {
            var self = this;
            var manager = self.manager;
            var errs = manager.errs;
            self.$callHDS(2, {}, function(data) {
                var res = JSON.parse(data);
                if (res.rc === 0) {
                    if (callback && typeof callback == "function") {
                        callback()
                    }
                } else {
                    console.log("DX5: Running HDM was discarded or failed.");
                    self.$throwHDErr(module.domObject.id, res.rc, res.ec, res.em)
                }
            }, function(ecode, err) {
                console.log("DX5: The error occured for running HDM.");
                manager.throwErr(module.domObject.id, "EX5-16", errs.get("EX5-16", "_DEXTUploadX5 HD application is not installed or requesting to HD failed.\n{0}\n{1}"), [ecode, err])
            })
        };
        DX5HDManager.prototype.$setTextResourceHDM = function(module, lang, callback) {
            var self = this;
            var manager = self.manager;
            var errs = manager.errs;
            var env = self.manager.environment;
            var hdlang = "";
            if (!lang || lang == "auto") {
                hdlang = navigator.language || navigator.browserLanguage || navigator.systemLanguage;
                hdlang = hdlang ? hdlang.split("-")[0] : ""
            } else {
                hdlang = lang
            }
            var osname = env.osName === "Windows" ? "win" : env.osName.indexOf("Mac") >= 0 ? "mac" : "";
            if (!osname) {
                console.log("DX5: The error occured for changing the text resource of HD.");
                manager.throwErr(module.domObject.id, "EX5-25", errs.get("EX5-25", "_DEXTUploadX5 HD application is not supported to {0}."), [env.osName]);
                return
            }
            self.$callHDM(6, {
                textxml_uri: combinePath(manager.rootPath, "res/dextuploadx5-hd-message-" + osname + (hdlang ? "-" + hdlang : "") + ".xml")
            }, function(data) {
                var res = JSON.parse(data);
                if (res.rc === 0) {
                    if (callback && typeof callback == "function") {
                        callback()
                    }
                } else {
                    console.log("DX5: Changing the text resource of HD was discarded or failed.");
                    self.$throwHDErr(module.domObject.id, res.rc, res.ec, res.em)
                }
            }, function(ecode, err) {
                console.log("DX5: The error occured for changing the text resource of HD.");
                manager.throwErr(module.domObject.id, "EX5-16", errs.get("EX5-16", "_DEXTUploadX5 HD application is not installed or requesting to HD failed.\n{0}\n{1}"), [ecode, err])
            })
        };
        DX5HDManager.prototype.$isRedundantItemHD = function(module, name, size, yes, no) {
            var self = this;
            var manager = self.manager;
            var errs = manager.errs;
            self.$callHDM(7, {
                check_title: name || "",
                check_size: size
            }, function(data) {
                var res = JSON.parse(data);
                if (res.rc === 0) {
                    if (no && typeof no == "function") {
                        no()
                    }
                } else {
                    if (yes && typeof yes == "function") {
                        yes()
                    }
                }
            }, function(ecode, err) {
                console.log("DX5: The error occured for checking duplication.");
                manager.throwErr(module.domObject.id, "EX5-16", errs.get("EX5-16", "_DEXTUploadX5 HD application is not installed or requesting to HD failed.\n{0}\n{1}"), [ecode, err])
            })
        };
        DX5HDManager.prototype.$addItemToHD = function(module, item, callback) {
            var self = this;
            var manager = self.manager;
            var errs = manager.errs;
            self.$callHDM(3, {
                downfileuri: item.downUrl || item.url || "",
                authkey: manager.authkey || "",
                middlepath: item.middlePath || "",
                filetitle: item.name || "",
                filesize: item.size || -1,
                eventuri_start: item.eventUriStart || "",
                eventuri_stop: item.eventUriStop || "",
                eventuri_complete: item.eventUriEnd || "",
                chunkSize: item.chunkSize || -1,
                custom_header: module.getTotalCustomHeaders() || "",
                hdtitle: item.hdTitle || ""
            }, function(data) {
                var res = JSON.parse(data);
                if (res.rc === 0) {
                    if (callback && typeof callback == "function") {
                        callback()
                    }
                } else {
                    console.log("DX5: Adding an item was discarded of failed.");
                    self.$throwHDErr(module.domObject.id, res.rc, res.ec, res.em)
                }
            }, function(ecode, err) {
                console.log("DX5: The error occured for adding an item.");
                manager.throwErr(module.domObject.id, "EX5-16", errs.get("EX5-16", "_DEXTUploadX5 HD application is not installed or requesting to HD failed.\n{0}\n{1}"), [ecode, err])
            })
        };
        DX5HDManager.prototype.$parseHDEnvString = function(source) {
            var env = {
                autoActivation: false,
                autoDownload: false,
                deleteTemporary: false,
                resumeDownload: false,
                saveStatus: {
                    waitStop: false,
                    downloading: false,
                    complete: false,
                    error: false
                }
            };
            var tokens = source ? source.toLowerCase().split(/;/) : [];
            for (var i = 0, okv = null, flag = 0; i < tokens.length; i++) {
                okv = tokens[i].split("=");
                if (okv.length === 0) continue;
                else if (okv.length === 1) continue;
                else if (okv[0].indexOf("hdmconfig_1") >= 0) env.autoActivation = okv[1] === "true";
                else if (okv[0].indexOf("hdmconfig_2") >= 0) env.autoDownload = okv[1] === "true";
                else if (okv[0].indexOf("hdmconfig_3") >= 0) env.deleteTemporary = okv[1] === "true";
                else if (okv[0].indexOf("hdmconfig_4") >= 0) env.resumeDownload = okv[1] === "true";
                else if (okv[0].indexOf("hdmconfig_5") >= 0) {
                    flag = parseInt(okv[1], 10);
                    env.saveStatus.waitStop = (flag & 1) === 1;
                    env.saveStatus.downloading = (flag & 2) === 2;
                    env.saveStatus.complete = (flag & 4) === 4;
                    env.saveStatus.error = (flag & 8) === 8
                } else continue
            }
            return env
        };
        DX5HDManager.prototype.$parameterizeHDEnv = function(env) {
            var parameter = {};
            if (Object.prototype.hasOwnProperty.call(env, "autoActivation")) parameter["hdmconfig_1"] = env.autoActivation ? "true" : false;
            if (Object.prototype.hasOwnProperty.call(env, "autoDownload")) parameter["hdmconfig_2"] = env.autoDownload ? "true" : false;
            if (Object.prototype.hasOwnProperty.call(env, "deleteTemporary")) parameter["hdmconfig_3"] = env.deleteTemporary ? "true" : false;
            if (Object.prototype.hasOwnProperty.call(env, "resumeDownload")) parameter["hdmconfig_4"] = env.resumeDownload ? "true" : false;
            if (Object.prototype.hasOwnProperty.call(env, "saveStatus")) {
                parameter["hdmconfig_5"] = typeof env.saveStatus === "number" ? env.saveStatus : (env.saveStatus.waitStop ? 1 : 0) + (env.saveStatus.downloading ? 2 : 0) + (env.saveStatus.complete ? 4 : 0) + (env.saveStatus.error ? 8 : 0)
            }
            return parameter
        };
        DX5HDManager.prototype.$upgradeHD = function(module, callback) {
            var self = this;
            var manager = self.manager;
            var errs = manager.errs;
            console.log("DX5: Updating the HD application to " + manager.version + " version.");
            if (module.isUsingProgressDialog() === true) {
                manager.showUpdateProgress(module.domObject.id)
            }
            self.$callHDS(3, {
                version: manager.version,
                update_file_url_32: manager.resources.hd32UpdateURL,
                update_file_url_64: manager.resources.hd64UpdateURL
            }, function(data) {
                if (module.isUsingProgressDialog() === true) {
                    manager.hideUpdateProgress(module.domObject.id, true)
                }
                var res = JSON.parse(data);
                if (res.rc === 0) {
                    if (callback && typeof callback == "function") {
                        callback()
                    }
                } else {
                    console.log("DX5: Updating HD was dicarded or failed to " + manager.version + " verison.");
                    self.$throwHDErr(module.domObject.id, res.rc, res.ec, res.em)
                }
            }, function(ecode, err) {
                if (module.isUsingProgressDialog() === true) {
                    manager.hideUpdateProgress(module.domObject.id, true)
                }
                console.log("DX5: The error occured for updating HD.");
                manager.throwErr(module.domObject.id, "EX5-16", errs.get("EX5-16", "_DEXTUploadX5 HD application is not installed or requesting to HD failed.\n{0}\n{1}"), [ecode, err])
            })
        };
        DX5HDManager.prototype.getDownPathOfHD = function(module, callback) {
            var self = this;
            var manager = self.manager;
            var errs = manager.errs;
            self.$callHDM(8, {}, function(data) {
                var res = JSON.parse(data);
                if (res.rc === 0) {
                    if (callback && typeof callback == "function") {
                        callback(res.rd)
                    }
                } else {
                    console.log("DX5: Getting the download path of HD was discarded or failed. " + res.ec + " " + res.em);
                    self.$throwHDErr(module.domObject.id, res.rc, res.ec, res.em)
                }
            }, function(ecode, err) {
                console.log("DX5: The error occured for getting the download path of HD.");
                manager.throwErr(module.domObject.id, "EX5-16", errs.get("EX5-16", "_DEXTUploadX5 HD application is not installed or requesting to HD failed.\n{0}\n{1}"), [ecode, err])
            })
        };
        DX5HDManager.prototype.setDownPathOfHD = function(module, path, callback) {
            var self = this;
            var manager = self.manager;
            var errs = manager.errs;
            self.$callHDM(9, {
                new_save_path: path
            }, function(data) {
                var res = JSON.parse(data);
                if (res.rc === 0) {
                    if (callback && typeof callback == "function") {
                        callback(res.rd)
                    }
                } else {
                    console.log("DX5: Setting the download path of HD was discarded or failed. " + res.ec + " " + res.em);
                    self.$throwHDErr(module.domObject.id, res.rc, res.ec, res.em)
                }
            }, function(ecode, err) {
                console.log("DX5: The error occured for setting the download path of HD.");
                manager.throwErr(module.domObject.id, "EX5-16", errs.get("EX5-16", "_DEXTUploadX5 HD application is not installed or requesting to HD failed.\n{0}\n{1}"), [ecode, err])
            })
        };
        DX5HDManager.prototype.askDownPathOfHD = function(module, callback) {
            var self = this;
            var manager = self.manager;
            var errs = manager.errs;
            self.$callHDM(2, {}, function(data) {
                var res = JSON.parse(data);
                if (res.rc === 0) {
                    if (callback && typeof callback == "function") {
                        callback(res.rd)
                    }
                } else {
                    console.log("DX5: Asking the download path of HD was discarded or failed. " + res.ec + " " + res.em);
                    self.$throwHDErr(module.domObject.id, res.rc, res.ec, res.em)
                }
            }, function(ecode, err) {
                console.log("DX5: The error occured for asking the download path of HD.");
                manager.throwErr(module.domObject.id, "EX5-16", errs.get("EX5-16", "_DEXTUploadX5 HD application is not installed or requesting to HD failed.\n{0}\n{1}"), [ecode, err])
            })
        };
        DX5HDManager.prototype.terminateHDM = function(module, callback) {
            var self = this;
            var manager = self.manager;
            var errs = manager.errs;
            self.$callHDM(10, {}, function(data) {
                var res = JSON.parse(data);
                if (res.rc === 0) {
                    if (callback && typeof callback == "function") {
                        callback()
                    }
                } else {
                    console.log("DX5: Terminating HDM was discarded or failed.");
                    self.$throwHDErr(module.domObject.id, res.rc, res.ec, res.em)
                }
            }, function(ecode, err) {
                console.log("DX5: The error occured for terminating HDM.");
                manager.throwErr(module.domObject.id, "EX5-16", errs.get("EX5-16", "_DEXTUploadX5 HD application is not installed or requesting to HD failed.\n{0}\n{1}"), [ecode, err])
            })
        };
        DX5HDManager.prototype.startDownloadingHD = function(module, callback) {
            var self = this;
            var manager = self.manager;
            var errs = manager.errs;
            self.$callHDM(4, {}, function(data) {
                var res = JSON.parse(data);
                if (res.rc === 0) {
                    if (callback && typeof callback == "function") {
                        callback()
                    }
                } else {
                    console.log("DX5: Starting the download of HD was discarded or failed. " + res.ec + " " + res.em);
                    self.$throwHDErr(module.domObject.id, res.rc, res.ec, res.em)
                }
            }, function(ecode, err) {
                console.log("DX5: The error occured for starting the download of HD.");
                manager.throwErr(module.domObject.id, "EX5-16", errs.get("EX5-16", "_DEXTUploadX5 HD application is not installed or requesting to HD failed.\n{0}\n{1}"), [ecode, err])
            })
        };
        DX5HDManager.prototype.stopDownloadingHD = function(module, callback) {
            var self = this;
            var manager = self.manager;
            var errs = manager.errs;
            self.$callHDM(5, {}, function(data) {
                var res = JSON.parse(data);
                if (res.rc === 0) {
                    if (callback && typeof callback == "function") {
                        callback()
                    }
                } else {
                    console.log("DX5: Stopping the download of HD was discarded or failed. " + res.ec + " " + res.em);
                    self.$throwHDErr(module.domObject.id, res.rc, res.ec, res.em)
                }
            }, function(ecode, err) {
                console.log("DX5: The error occured for stopping the download of HD.");
                manager.throwErr(module.domObject.id, "EX5-16", errs.get("EX5-16", "_DEXTUploadX5 HD application is not installed or requesting to HD failed.\n{0}\n{1}"), [ecode, err])
            })
        };
        DX5HDManager.prototype.getEnvHD = function(module, callback) {
            var self = this;
            var manager = self.manager;
            var errs = manager.errs;
            self.$callHDM(12, {}, function(data) {
                var res = JSON.parse(data);
                if (res.rc === 0) {
                    if (callback && typeof callback == "function") {
                        callback(self.$parseHDEnvString(res.rd))
                    }
                } else {
                    console.log("DX5: Getting values of HD configuration was discarded or failed. " + res.ec + " " + res.em);
                    self.$throwHDErr(module.domObject.id, res.rc, res.ec, res.em)
                }
            }, function(ecode, err) {
                console.log("DX5: The error occured for getting values of HD configuration.");
                manager.throwErr(module.domObject.id, "EX5-16", errs.get("EX5-16", "_DEXTUploadX5 HD application is not installed or requesting to HD failed.\n{0}\n{1}"), [ecode, err])
            })
        };
        DX5HDManager.prototype.setEnvHD = function(module, env, callback) {
            var self = this;
            var manager = self.manager;
            var errs = manager.errs;
            self.$callHDM(11, self.$parameterizeHDEnv(env), function(data) {
                var res = JSON.parse(data);
                if (res.rc === 0) {
                    if (callback && typeof callback == "function") {
                        callback()
                    }
                } else {
                    console.log("DX5: Setting values to HD configuration was discarded or failed. " + res.ec + " " + res.em);
                    self.$throwHDErr(module.domObject.id, res.rc, res.ec, res.em)
                }
            }, function(ecode, err) {
                console.log("DX5: The error occured for setting values to HD configuration.");
                manager.throwErr(module.domObject.id, "EX5-16", errs.get("EX5-16", "_DEXTUploadX5 HD application is not installed or requesting to HD failed.\n{0}\n{1}"), [ecode, err])
            })
        };
        DX5HDManager.prototype.exeHD = function(module, callback) {
            var self = this;
            var manager = self.manager;
            var errs = manager.errs;
            var env = self.manager.environment;
            if (!env.supportedOSForHD) {
                console.log("DX5: The error occured for communicating to the HD.");
                manager.throwErr(module.domObject.id, "EX5-25", errs.get("EX5-25", "_DEXTUploadX5 HD application is not supported to {0}."), [env.osName]);
                return
            }
            if (!env.supportedBrowserForHD) {
                console.log("DX5: The error occured for communicating to the HD.");
                manager.throwErr(module.domObject.id, "EX5-27", errs.get("EX5-27", "_DEXTUploadX5 HD application is not supported to {0} {1}."), [env.browser, env.browserVersion]);
                return
            }
            self.$callHDS(1, {}, function(data) {
                var res = JSON.parse(data);
                if (res.rc === 0) {
                    if (compareVersion(manager.version, res.rd) <= 0) {
                        self.$runHDM(module, function() {
                            self.$setTextResourceHDM(module, module.lang, function() {
                                if (callback && typeof callback == "function") {
                                    callback()
                                }
                            })
                        })
                    } else if (env.osName.indexOf("Mac") >= 0) {
                        if (manager.resources.hdDownloadURL) {
                            window.open(manager.resources.hdDownloadURL, "DEXTUploadX5HDApplicationDownloadPage", "width=640,height=730,status=no,toolbar=no,menubar=no,location=no")
                        } else {
                            console.log("DX5: The version of HD is low(" + res.rd + " < " + manager.version + ").");
                            manager.throwErr(module.domObject.id, "EX5-17", errs.get("EX5-17", "_DEXTUploadX5 HD application version is low({0} < {1})."), [res.rd, manager.version])
                        }
                    } else if (compareVersion(res.rd, "2.1.2.0") < 0) {
                        if (manager.resources.hdDownloadURL) {
                            window.open(manager.resources.hdDownloadURL, "DEXTUploadX5HDApplicationDownloadPage", "width=640,height=730,status=no,toolbar=no,menubar=no,location=no")
                        } else {
                            console.log("DX5: The version of HD is under 2.1.2.0.");
                            manager.throwErr(module.domObject.id, "EX5-17", errs.get("EX5-17", "_DEXTUploadX5 HD application version is low({0} < {1})."), [res.rd, manager.version])
                        }
                    } else {
                        self.$upgradeHD(module)
                    }
                } else {
                    console.log("DX5: Getting version of HD was discarded of failed.");
                    self.$throwHDErr(module.domObject.id, res.rc, res.ec, res.em)
                }
            }, function(ecode, err) {
                console.log("DX5: The error occured for getting version of HD. code = " + ecode + ", error = " + err);
                if (manager.resources.hdDownloadURL) {
                    window.open(manager.resources.hdDownloadURL, "DEXTUploadX5HDApplicationDownloadPage", "width=640,height=730,status=no,toolbar=no,menubar=no,location=no")
                } else {
                    manager.throwErr(module.domObject.id, "EX5-16", errs.get("EX5-16", "_DEXTUploadX5 HD application is not installed or requesting to HD failed.\n{0}\n{1}"), [ecode, err])
                }
                return
            })
        };
        DX5HDManager.prototype.transferToHD = function(module, arr, duplicated) {
            var self = this;
            var manager = self.manager;
            var errs = manager.errs;
            var opWhenDuplication = 0;
            loopTask({
                length: arr.length,
                init: function(next) {
                    next()
                },
                func: function(next, index) {
                    self.$isRedundantItemHD(module, arr[index].name || "", arr[index].size, function() {
                        if (opWhenDuplication == 2) {} else if (opWhenDuplication == 3) {
                            next();
                            return
                        } else {
                            if (duplicated && typeof duplicated == "function") {
                                var ret = duplicated(arr[index].name);
                                if (ret === 1) {
                                    next();
                                    return
                                } else if (ret === 2) {
                                    opWhenDuplication = 2
                                } else if (ret === 3) {
                                    opWhenDuplication = 3;
                                    next();
                                    return
                                } else {
                                    opWhenDuplication = 0
                                }
                            }
                        }
                        self.$addItemToHD(module, arr[index], function() {
                            next()
                        })
                    }, function() {
                        self.$addItemToHD(module, arr[index], function() {
                            next()
                        })
                    })
                },
                complete: function() {
                    console.log("DX5: Adding items to HDM has finished.")
                },
                error: function(ex, _index) {
                    console.log("DX5: Adding items to HDM has failed." + ex);
                    manager.throwErr(module.domObject.id, "EX5-29", errs.get("EX5-29", "_Adding items to HDM has failed.\n{0}"), [ex.toString()])
                }
            })
        };
        var DX5Manager = function(errorTable) {
            this.errs = errorTable;
            this.rootPath = "";
            this.lang = "";
            this.browser = detectBrowser();
            this.environment = detectEnvironment(this.browser);
            this.authkey = "";
            this.version = "";
            this.instances = {};
            this.waitQueue = [];
            this.MODULE_LOAD_WAIT = 0;
            this.MODULE_LOAD_ACTIVE = 1;
            this.loadingModuleState = this.MODULE_LOAD_WAIT;
            this.loadedEssentialScripts = false;
            var self = this;
            this.popupManager = {
                up: {
                    0: null,
                    1: null,
                    2: null,
                    3: null
                },
                dn: {
                    0: null,
                    1: null,
                    2: null,
                    3: null
                },
                pv: null,
                cp: null,
                ud: null,
                showUp: function(id) {
                    var dx = self.get(id);
                    if (dx) this.up[dx.getProgressType()].show(id);
                    else console.log("DX5: " + id + " component not exist")
                },
                showDn: function(id) {
                    var dx = self.get(id);
                    if (dx) this.dn[dx.getProgressType()].show(id);
                    else console.log("DX5: " + id + " component not exist")
                }
            };
            var gconfig = null;
            if (!window.dextuploadx5Configuration) return;
            else gconfig = window.dextuploadx5Configuration;
            this.authkey = gconfig.authkey || "";
            this.rootPath = gconfig.productPath || "";
            this.version = gconfig.version || "";
            this.resources = {
                ieDownloadURL: gconfig.ieDownloadURL || "",
                hdDownloadURL: gconfig.hdDownloadURL || "",
                hd32UpdateURL: gconfig.hd32UpdateURL || "",
                hd64UpdateURL: gconfig.hd64UpdateURL || ""
            };
            if (!this.rootPath) {
                this.throwErr("undefined", "EX5-2", this.errs.get("EX5-2", "_The product path is necessary to create DEXTUploadX5 component."));
                return
            }
            this.hdManager = new DX5HDManager(this)
        };
        DX5Manager.prototype.$defaultConfig = {
            mode: "multi",
            style: "list",
            progressType: "0",
            id: "",
            parentId: "",
            lang: "auto",
            width: "100%",
            height: "100%",
            path: "",
            enableSortColumn: true,
            sortPriorityVirtualFile: true,
            autoSortType: "0",
            enablePreview: false,
            previewBgColor: "#5E6E8D",
            loadWaitingTime: 3e3,
            uploadUrl: "",
            codePage: "65001",
            useProfile: false,
            messageXmlUrl: "",
            enableDnd: true,
            enableDeleteKey: true,
            splitStr: "",
            emptyStr: "",
            fileDialogTitle: "",
            folderDialogTitle: "",
            filterWhite: "",
            filterBlack: "",
            filterSilence: false,
            duplicable: false,
            limitFileCount: -1,
            limitFileMinSize: -1,
            limitFileMaxSize: -1,
            limitTotalFileSize: -1,
            extractEXIF: false,
            enableUploadHiddenItem: false,
            overwriteMode: "QUESTION",
            downloadHTTPMethod: "GET",
            limitNetSpeed: 0,
            compressTitle: "",
            compressSavePath: "",
            compressFileTitle: "",
            compressType: "",
            compressAutoInserting: true,
            compressEnsuringFile: false,
            compressAutoDeleting: true,
            encryptionTitle: "",
            encryptionSavePath: "",
            encryptionPrefix: "",
            encryptionAutoInserting: true,
            encryptionEnsuringFile: false,
            encryptionAutoDeleting: true,
            decryptionTitle: "",
            decryptionSavePath: "",
            decryptionEnsuringFile: false,
            thumbnailAutoMaking: false,
            thumbnailWidth: 0,
            thumbnailHeight: 0,
            thumbnailAspectRatio: true,
            thumbnailAutoDeleting: true,
            thumbnailAutoRotating: false,
            thumbnailSavePath: "",
            thumbnailPrefix: "",
            thumbnailFormat: "",
            tempExecutingPath: "",
            showBorder: true,
            showGridLine: true,
            showOnlyTitle: true,
            showTreeStyle: false,
            listShowProgress: true,
            listUIColorPattern: 0,
            listStatusImagePattern: 0,
            headerColorNormalTop: "",
            headerColorNormalBottom: "",
            headerColorPushTop: "",
            headerColorPushBottom: "",
            headerHeight: 0,
            itemHeight: 0,
            backgroundImageURL: "",
            textColor: "#595959",
            backgroundColor: "",
            gridLineColor: "",
            btnFile: "",
            btnFolder: "",
            btnSelectAll: "",
            btnUnselectAll: "",
            btnDeleteSelected: "",
            btnDeleteAll: "",
            btnDeleteChecked: "",
            btnRevokeAll: "",
            btnUploadAuto: "",
            btnUploadChecked: "",
            btnUploadSelected: "",
            btnDownloadAuto: "",
            btnDownloadChecked: "",
            btnDownloadSelected: "",
            btnStopUploading: "",
            btnStopDownloading: "",
            btnOpenDownloadDialog: "",
            btnDownloadCompressedAuto: "",
            btnDownloadCompressedSelected: "",
            btnDownloadCompressedChecked: "",
            btnStopCompressWaiting: "",
            btnOpenDownloadDialogOfHD: "",
            btnDownloadToHDAuto: "",
            btnDownloadToHDChecked: "",
            btnDownloadToHDSelected: ""
        };
        DX5Manager.prototype.$emitErrorEvent = function(evt) {
            this.hideAllProgress(evt.id);
            var strVer = "c:" + (this.version || "unknown");
            try {
                var dx = this.get(evt.id);
                strVer += "-m:" + (dx && dx.getVersion ? dx.getVersion() : "unknown")
            } catch (ex) {
                strVer += "-m:unknown"
            }
            strVer += "\n";
            if (window.onDX5Error) window.onDX5Error(evt.id, evt.code, strVer + evt.message);
            else console.error("DX5: Error id=" + evt.id + ", code=" + evt.code + ", message=" + strVer + evt.message)
        };
        DX5Manager.prototype.$emitCreatedEvent = function(evt) {
            if (window.onDX5Created) window.onDX5Created(evt.id)
        };
        DX5Manager.prototype.$emitItemSelectEvent = function(evt) {
            if (window.onDX5ItemSelect) window.onDX5ItemSelect(evt.id, evt.itemIndex, evt.itemId, evt.itemType)
        };
        DX5Manager.prototype.$emitItemCheckEvent = function(evt) {
            if (window.onDX5ItemCheck) window.onDX5ItemCheck(evt.id, evt.count)
        };
        DX5Manager.prototype.$emitItemDoubleClickEvent = function(evt) {
            if (window.onDX5ItemDoubleClick) window.onDX5ItemDoubleClick(evt.id, evt.itemIndex, evt.itemId, evt.itemType)
        };
        DX5Manager.prototype.$emitBeforeItemsAddEvent = function(evt) {
            if (window.onDX5BeforeItemsAdd) {
                var ret = window.onDX5BeforeItemsAdd(evt.id, evt.count);
                if (ret === false) evt.preventDefault()
            }
        };
        DX5Manager.prototype.$emitItemAddingEvent = function(evt) {
            if (window.onDX5ItemAdding) {
                var ret = window.onDX5ItemAdding(evt.id, evt.file);
                if (ret === false) evt.preventDefault()
            }
        };
        DX5Manager.prototype.$emitItemsAddedEvent = function(evt) {
            if (window.onDX5ItemsAdded) window.onDX5ItemsAdded(evt.id, evt.count, evt.arr)
        };
        DX5Manager.prototype.$emitBeforeItemsDeleteEvent = function(evt) {
            if (window.onDX5BeforeItemsDelete) {
                var ret = window.onDX5BeforeItemsDelete(evt.id, evt.arr);
                if (ret === false) evt.preventDefault()
            }
        };
        DX5Manager.prototype.$emitItemDeletingEvent = function(evt) {
            if (window.onDX5ItemDeleting) {
                var ret = window.onDX5ItemDeleting(evt.id, evt.itemId);
                if (ret === false) evt.preventDefault()
            }
        };
        DX5Manager.prototype.$emitItemsDeletedEvent = function(evt) {
            if (window.onDX5ItemsDeleted) window.onDX5ItemsDeleted(evt.id, evt.count)
        };
        DX5Manager.prototype.$emitUploadBeginEvent = function(evt) {
            if (window.onDX5UploadBegin) window.onDX5UploadBegin(evt.id);
            this.showUploadProgress(evt.id)
        };
        DX5Manager.prototype.$emitUploadItemStartEvent = function(evt) {
            if (window.onDX5UploadItemStart) window.onDX5UploadItemStart(evt.id, evt.itemId)
        };
        DX5Manager.prototype.$emitUploadItemEndEvent = function(evt) {
            if (window.onDX5UploadItemEnd) window.onDX5UploadItemEnd(evt.id, evt.itemId)
        };
        DX5Manager.prototype.$emitUploadCompletedEvent = function(evt) {
            if (!this.hideUploadProgress(evt.id, false, function() {
                    if (window.onDX5UploadCompleted) window.onDX5UploadCompleted(evt.id)
                })) {
                if (window.onDX5UploadCompleted) window.onDX5UploadCompleted(evt.id)
            }
        };
        DX5Manager.prototype.$emitUploadStoppedEvent = function(evt) {
            this.hideUploadProgress(evt.id, true);
            if (window.onDX5UploadStopped) window.onDX5UploadStopped(evt.id)
        };
        DX5Manager.prototype.$emitDownloadBeginEvent = function(evt) {
            if (window.onDX5DownloadBegin) window.onDX5DownloadBegin(evt.id);
            this.showDownloadProgress(evt.id)
        };
        DX5Manager.prototype.$emitDownloadItemStartEvent = function(evt) {
            if (window.onDX5DownloadItemStart) window.onDX5DownloadItemStart(evt.id, evt.itemId)
        };
        DX5Manager.prototype.$emitDownloadItemEndEvent = function(evt) {
            if (window.onDX5DownloadItemEnd) window.onDX5DownloadItemEnd(evt.id, evt.itemId)
        };
        DX5Manager.prototype.$emitDownloadCompletedEvent = function(evt) {
            if (!this.hideDownloadProgress(evt.id, false, function() {
                    if (window.onDX5DownloadCompleted) window.onDX5DownloadCompleted(evt.id)
                })) {
                if (window.onDX5DownloadCompleted) window.onDX5DownloadCompleted(evt.id)
            }
        };
        DX5Manager.prototype.$emitDownloadStoppedEvent = function(evt) {
            this.hideDownloadProgress(evt.id, true);
            if (window.onDX5DownloadStopped) window.onDX5DownloadStopped(evt.id)
        };
        DX5Manager.prototype.$emitPreviewEvent = function(evt) {
            if (evt.method == 1 && evt.itemSource) {
                this.showPreviewWindow(evt.itemSource, evt.backColor)
            } else if (evt.method == 2 && window.onDX5Preview) {
                window.onDX5Preview(evt.id, evt.itemIndex, evt.itemId, evt.itemSource)
            }
        };
        DX5Manager.prototype.$emitCompressWaitingBeginEvent = function(evt) {
            if (window.onDX5CompressWaitingBegin) window.onDX5CompressWaitingBegin(evt.id);
            this.showCompressWaitingProgress(evt.id)
        };
        DX5Manager.prototype.$emitCompressWaitingCompletedEvent = function(evt) {
            if (!this.hideCompressWaitingProgress(evt.id, false, function() {
                    if (window.onDX5CompressWaitingCompleted) window.onDX5CompressWaitingCompleted(evt.id)
                })) {
                if (window.onDX5CompressWaitingCompleted) window.onDX5CompressWaitingCompleted(evt.id)
            }
        };
        DX5Manager.prototype.$emitCompressWaitingStoppedEvent = function(evt) {
            this.hideCompressWaitingProgress(evt.id);
            if (window.onDX5CompressWaitingStopped) window.onDX5CompressWaitingStopped(evt.id)
        };
        DX5Manager.prototype.$emitDragAndDropEvent = function(evt) {
            if (window.onDX5DragAndDrop) window.onDX5DragAndDrop(evt.id)
        };
        DX5Manager.prototype.$emitDownloadToHDForSingleEvent = function(evt) {
            var dx = this.get(evt.id);
            if (dx) {
                dx.downloadByIdToHD(evt.itemId)
            }
        };
        DX5Manager.prototype.$emitColumnDataBindingEvent = function(evt) {
            if (window.onDX5ColumnDataBinding) {
                var ret = window.onDX5ColumnDataBinding(evt.id, evt.itemId, evt.columnKey, evt.columnValue);
                if (typeof ret == "undefined") evt.preventDefault();
                else evt.funcValue = ret
            } else if (!Object.prototype.hasOwnProperty.call(evt, "funcValue")) evt.preventDefault()
        };
        DX5Manager.prototype.$adjustLoadingTime = function(time) {
            if (typeof time != "number") {
                time = 3e3
            } else if (time < 3e3) {
                time = 3e3
            } else {
                time = Math.floor(time)
            }
            return time
        };
        DX5Manager.prototype.$createMultiModule = function(configuration) {
            var self = this;
            var doc = window.document;
            var orderOfModules = self.loadedEssentialScripts === true ? [] : ["dextuploadx5-polyfill", "dextuploadx5-common", "dextuploadx5-class-progress-up", "dextuploadx5-class-progress-dn", "dextuploadx5-class-progress-cp", "dextuploadx5-class-progress-ud", "dextuploadx5-class-preview", "dextuploadx5-class-module-multi"];
            orderOfModules.push(function(next) {
                configuration.lang = !configuration.lang || configuration.lang == "auto" ? getPageLang() : configuration.lang;
                configuration.loadWaitingTime = self.$adjustLoadingTime(configuration.loadWaitingTime);
                if (!self.popupManager.up[configuration.progressType]) self.popupManager.up[configuration.progressType] = new DX5UpProgress(self, window, configuration.progressType);
                if (!self.popupManager.dn[configuration.progressType]) self.popupManager.dn[configuration.progressType] = new DX5DnProgress(self, window, configuration.progressType);
                if (!self.popupManager.pv) self.popupManager.pv = new DX5ImagePreview(self, window);
                if (!self.popupManager.cp) self.popupManager.cp = new DX5CompressProgress(self, window);
                if (self.environment.supportedBrowserForHD) {
                    if (!self.popupManager.ud) self.popupManager.ud = new DX5HDUpdateProgress(self, window)
                }
                var container = document.getElementById(getIdSharp(configuration.parentId, false));
                if (!container) {
                    self.throwErr(configuration.id || "undefined", "EX5-1", self.errs.get("EX5-1", "_The target element({0}) does not exist."), [configuration.parentId]);
                    return
                }
                var module = new DX5MultiModule(self, container, configuration, self.browser.isChrome || self.browser.isOpera || self.browser.isSafari);
                module.load(configuration.loadWaitingTime, function(_version) {
                    module.loaded = true;
                    self.instances[module.domObject.id] = module;
                    next()
                }, function() {
                    ///self.throwErr(configuration.id, "EX5-7", self.errs.get("EX5-7", "_Loading DEXTUploadX5 Multi module failed!"));
					console.log('Loading DEXTUploadX5 Multi module failed!');
                })
            });
            orderOfModules.push(function(next) {
                var module = self.get(configuration.id);
                //console.log("DX5: Precondition settings");
                if (self.authkey) {
                    module.setAuthkey(self.authkey)
                } else {
                    self.throwErr(module.domObject.id, "EX5-10", self.errs.get("EX5-10", "_The product authkey is necessary."))
                }
                module.setEnableColumnSorting(configuration.enableSortColumn || configuration.enableSortColumn == "true");
                module.setSortPriorityVirtualFile(configuration.sortPriorityVirtualFile || configuration.sortPriorityVirtualFile == "true");
                module.setAutoSortingType(parseInt(configuration.autoSortType, 10));
                module.setPreviewEnable(configuration.enablePreview);
                module.initDownObjects();
                if (configuration.uploadUrl) module.setUploadURL(configuration.uploadUrl);
                next()
            });
            orderOfModules.push(function(next) {
                var module = self.get(configuration.id);
                //console.log("DX5: Event settings");
                module.component.addEventListener("error", function(evt) {
                    module.manager.$emitErrorEvent(evt)
                }, false);
                module.component.addEventListener("created", function(evt) {
                    module.manager.$emitCreatedEvent(evt)
                }, false);
                module.component.addEventListener("itemselect", function(evt) {
                    module.manager.$emitItemSelectEvent(evt)
                }, false);
                module.component.addEventListener("itemdbclick", function(evt) {
                    module.manager.$emitItemDoubleClickEvent(evt)
                }, false);
                module.component.addEventListener("beforeItemsAdd", function(evt) {
                    module.manager.$emitBeforeItemsAddEvent(evt)
                }, false);
                module.component.addEventListener("itemAdding", function(evt) {
                    module.manager.$emitItemAddingEvent(evt)
                }, false);
                module.component.addEventListener("itemsAdded", function(evt) {
                    module.manager.$emitItemsAddedEvent(evt)
                }, false);
                module.component.addEventListener("beforeItemsDelete", function(evt) {
                    module.manager.$emitBeforeItemsDeleteEvent(evt)
                }, false);
                module.component.addEventListener("itemDeleting", function(evt) {
                    module.manager.$emitItemDeletingEvent(evt)
                }, false);
                module.component.addEventListener("itemsDeleted", function(evt) {
                    module.manager.$emitItemsDeletedEvent(evt)
                }, false);
                module.component.addEventListener("itemCheck", function(evt) {
                    module.manager.$emitItemCheckEvent(evt)
                }, false);
                module.component.addEventListener("uploadBegin", function(evt) {
                    module.manager.$emitUploadBeginEvent(evt)
                }, false);
                module.component.addEventListener("uploadItemStart", function(evt) {
                    module.manager.$emitUploadItemStartEvent(evt)
                }, false);
                module.component.addEventListener("uploadItemEnd", function(evt) {
                    module.manager.$emitUploadItemEndEvent(evt)
                }, false);
                module.component.addEventListener("uploadCompleted", function(evt) {
                    module.manager.$emitUploadCompletedEvent(evt)
                }, false);
                module.component.addEventListener("uploadStopped", function(evt) {
                    module.manager.$emitUploadStoppedEvent(evt)
                }, false);
                module.component.addEventListener("downloadBegin", function(evt) {
                    module.manager.$emitDownloadBeginEvent(evt)
                }, false);
                module.component.addEventListener("downloadItemStart", function(evt) {
                    module.manager.$emitDownloadItemStartEvent(evt)
                }, false);
                module.component.addEventListener("downloadItemEnd", function(evt) {
                    module.manager.$emitDownloadItemEndEvent(evt)
                }, false);
                module.component.addEventListener("downloadCompleted", function(evt) {
                    module.manager.$emitDownloadCompletedEvent(evt)
                }, false);
                module.component.addEventListener("downloadStopped", function(evt) {
                    module.manager.$emitDownloadStoppedEvent(evt)
                }, false);
                module.component.addEventListener("preview", function(evt) {
                    module.manager.$emitPreviewEvent(evt)
                }, false);
                module.component.addEventListener("compressBegin", function(evt) {
                    module.manager.$emitCompressWaitingBeginEvent(evt)
                }, false);
                module.component.addEventListener("compressCompleted", function(evt) {
                    module.manager.$emitCompressWaitingCompletedEvent(evt)
                }, false);
                module.component.addEventListener("compressStopped", function(evt) {
                    module.manager.$emitCompressWaitingStoppedEvent(evt)
                }, false);
                module.component.addEventListener("downloadToHDForSingle", function(evt) {
                    module.manager.$emitDownloadToHDForSingleEvent(evt)
                }, false);
                module.component.addEventListener("columnDataBinding", function(evt) {
                    module.manager.$emitColumnDataBindingEvent(evt)
                }, false);
                module.dndObject.addEventListener("dragenter", function(evt) {
                    evt.stopPropagation();
                    evt.preventDefault()
                }, false);
                module.dndObject.addEventListener("dragover", function(evt) {
                    evt.stopPropagation();
                    evt.preventDefault();
                    evt.dataTransfer.dropEffect = module.getEnableDnd() === true ? "copy" : "none"
                }, false);
                module.dndObject.addEventListener("drop", function(evt) {
                    evt.stopPropagation();
                    evt.preventDefault();
                    if (module.getEnableDnd() !== true) return;
                    if (self.browser.isChrome) module.addEntriesForChrome(evt.dataTransfer.items);
                    else module.addFileList(evt.dataTransfer.files);
                    module.manager.$emitDragAndDropEvent({
                        id: module.domObject.id
                    })
                }, false);
                if (self.browser.isFirefox) {
                    window.addEventListener("resize", function() {
                        module.component.dispatchSVGResize()
                    })
                }
                if (self.browser.isSafari && parseInt(self.browser.version, 10) >= 14) {
                    window.addEventListener("resize", function() {
                        module.component.dispatchSVGResize()
                    })
                }
                next()
            });
            orderOfModules.push(function(next) {
                var module = self.get(configuration.id);
                var btn = null;
                //console.log("DX5: Helper settings");
                if (configuration.btnFile) {
                    btn = doc.getElementById(getIdSharp(configuration.btnFile, false));
                    btn && btn.addEventListener("click", function(e) {
                        e.preventDefault();
                        module.openFileDialog()
                    }, false)
                }
                if (configuration.btnFolder) {
                    btn = doc.getElementById(getIdSharp(configuration.btnFolder, false));
                    btn && btn.addEventListener("click", function(e) {
                        e.preventDefault();
                        module.openFolderDialog()
                    }, false)
                }
                if (configuration.btnSelectAll) {
                    btn = doc.getElementById(getIdSharp(configuration.btnSelectAll, false));
                    btn && btn.addEventListener("click", function(e) {
                        e.preventDefault();
                        module.selectAll()
                    }, false)
                }
                if (configuration.btnUnselectAll) {
                    btn = doc.getElementById(getIdSharp(configuration.btnUnselectAll, false));
                    btn && btn.addEventListener("click", function(e) {
                        e.preventDefault();
                        module.unselectAll()
                    }, false)
                }
                if (configuration.btnDeleteSelected) {
                    btn = doc.getElementById(getIdSharp(configuration.btnDeleteSelected, false));
                    btn && btn.addEventListener("click", function(e) {
                        e.preventDefault();
                        module.removeSelected()
                    }, false)
                }
                if (configuration.btnDeleteAll) {
                    btn = doc.getElementById(getIdSharp(configuration.btnDeleteAll, false));
                    btn && btn.addEventListener("click", function(e) {
                        e.preventDefault();
                        module.removeAll()
                    }, false)
                }
                if (configuration.btnDeleteChecked) {
                    btn = doc.getElementById(getIdSharp(configuration.btnDeleteChecked, false));
                    btn && btn.addEventListener("click", function(e) {
                        e.preventDefault();
                        module.removeChecked()
                    }, false)
                }
                if (configuration.btnRevokeAll) {
                    btn = doc.getElementById(getIdSharp(configuration.btnRevokeAll, false));
                    btn && btn.addEventListener("click", function(e) {
                        e.preventDefault();
                        module.revokeAllVirtualFiles()
                    }, false)
                }
                if (configuration.btnUploadAuto) {
                    btn = doc.getElementById(getIdSharp(configuration.btnUploadAuto, false));
                    btn && btn.addEventListener("click", function(e) {
                        e.preventDefault();
                        module.upload("AUTO")
                    }, false)
                }
                if (configuration.btnUploadChecked) {
                    btn = doc.getElementById(getIdSharp(configuration.btnUploadChecked, false));
                    btn && btn.addEventListener("click", function(e) {
                        e.preventDefault();
                        module.upload("CHECKED")
                    }, false)
                }
                if (configuration.btnUploadSelected) {
                    btn = doc.getElementById(getIdSharp(configuration.btnUploadSelected, false));
                    btn && btn.addEventListener("click", function(e) {
                        e.preventDefault();
                        module.upload("SELECTED")
                    }, false)
                }
                if (configuration.btnOpenDownloadDialog) {
                    btn = doc.getElementById(getIdSharp(configuration.btnOpenDownloadDialog, false));
                    btn && btn.addEventListener("click", function(e) {
                        e.preventDefault();
                        if (module.mode == "ie") module.openDownloadPathDialog();
                        else self.throwErr(module.domObject.id, "EX5-11", self.errs.get("EX5-11", "_Not supported function in DEXTUploadX5 Multi module"))
                    }, false)
                }
                if (configuration.btnDownloadAuto) {
                    btn = doc.getElementById(getIdSharp(configuration.btnDownloadAuto, false));
                    btn && btn.addEventListener("click", function(e) {
                        e.preventDefault();
                        module.download("AUTO")
                    }, false)
                }
                if (configuration.btnDownloadChecked) {
                    btn = doc.getElementById(getIdSharp(configuration.btnDownloadChecked, false));
                    btn && btn.addEventListener("click", function(e) {
                        e.preventDefault();
                        module.download("CHECKED")
                    }, false)
                }
                if (configuration.btnDownloadSelected) {
                    btn = doc.getElementById(getIdSharp(configuration.btnDownloadSelected, false));
                    btn && btn.addEventListener("click", function(e) {
                        e.preventDefault();
                        module.download("SELECTED")
                    }, false)
                }
                if (configuration.btnStopUploading) {
                    btn = doc.getElementById(getIdSharp(configuration.btnStopUploading, false));
                    btn && btn.addEventListener("click", function(e) {
                        e.preventDefault();
                        module.stopUploading()
                    }, false)
                }
                if (configuration.btnStopDownloading) {
                    btn = doc.getElementById(getIdSharp(configuration.btnStopDownloading, false));
                    btn && btn.addEventListener("click", function(e) {
                        e.preventDefault();
                        module.stopDownloading()
                    }, false)
                }
                if (configuration.btnDownloadCompressedAuto) {
                    btn = doc.getElementById(getIdSharp(configuration.btnDownloadCompressedAuto, false));
                    btn && btn.addEventListener("click", function(e) {
                        e.preventDefault();
                        if (module.mode == "multi") module.downloadCompressed("AUTO");
                        else self.throwErr(module.domObject.id, "EX5-12", self.errs.get("EX5-12", "_Not supported function in DEXTUploadX5 IE module"))
                    }, false)
                }
                if (configuration.btnDownloadCompressedChecked) {
                    btn = doc.getElementById(getIdSharp(configuration.btnDownloadCompressedChecked, false));
                    btn && btn.addEventListener("click", function(e) {
                        e.preventDefault();
                        if (module.mode == "multi") module.downloadCompressed("CHECKED");
                        else self.throwErr(module.domObject.id, "EX5-12", self.errs.get("EX5-12", "_Not supported function in DEXTUploadX5 IE module"))
                    }, false)
                }
                if (configuration.btnDownloadCompressedSelected) {
                    btn = doc.getElementById(getIdSharp(configuration.btnDownloadCompressedSelected, false));
                    btn && btn.addEventListener("click", function(e) {
                        e.preventDefault();
                        if (module.mode == "multi") module.downloadCompressed("SELECTED");
                        else self.throwErr(module.domObject.id, "EX5-12", self.errs.get("EX5-12", "_Not supported function in DEXTUploadX5 IE module"))
                    }, false)
                }
                if (configuration.btnStopCompressWaiting) {
                    btn = doc.getElementById(getIdSharp(configuration.btnStopCompressWaiting, false));
                    btn && btn.addEventListener("click", function(e) {
                        e.preventDefault();
                        if (module.mode == "multi") module.stopCompressWaiting();
                        else self.throwErr(module.domObject.id, "EX5-12", self.errs.get("EX5-12", "_Not supported function in DEXTUploadX5 IE module"))
                    }, false)
                }
                if (configuration.btnOpenDownloadDialogOfHD) {
                    btn = doc.getElementById(getIdSharp(configuration.btnOpenDownloadDialogOfHD, false));
                    btn && btn.addEventListener("click", function(e) {
                        e.preventDefault();
                        module.openDownloadPathDialogOfHD()
                    }, false)
                }
                if (configuration.btnDownloadToHDAuto) {
                    btn = doc.getElementById(getIdSharp(configuration.btnDownloadToHDAuto, false));
                    btn && btn.addEventListener("click", function(e) {
                        e.preventDefault();
                        module.downloadToHD("AUTO")
                    }, false)
                }
                if (configuration.btnDownloadToHDChecked) {
                    btn = doc.getElementById(getIdSharp(configuration.btnDownloadToHDChecked, false));
                    btn && btn.addEventListener("click", function(e) {
                        e.preventDefault();
                        module.downloadToHD("CHECKED")
                    }, false)
                }
                if (configuration.btnDownloadToHDSelected) {
                    btn = doc.getElementById(getIdSharp(configuration.btnDownloadToHDSelected, false));
                    btn && btn.addEventListener("click", function(e) {
                        e.preventDefault();
                        module.downloadToHD("SELECTED")
                    }, false)
                }
                next()
            });
            var thead = window.document.getElementsByTagName("head")[0];
            loopTask({
                length: orderOfModules.length,
                init: function(next) {
                    self.loadingModuleState = self.MODULE_LOAD_ACTIVE;
                    next()
                },
                func: function(next, index) {
                    if (typeof orderOfModules[index] === "function") {
                        orderOfModules[index](next)
                    } else {
                        var tscript = window.document.createElement("script");
                        tscript.onload = function() {
                            //console.log("DX5: module loaded = " + tscript.src);
                            next()
                        };
                        tscript.type = "text/javascript";
                        tscript.src = configuration.path + (configuration.path.indexOf("/") === configuration.path.length - 1 ? "/" : "") + "module/" + orderOfModules[index] + ".js";
                        thead.appendChild(tscript)
                    }
                },
                complete: function() {
                    self.loadedEssentialScripts = true;
                    self.loadingModuleState = self.MODULE_LOAD_WAIT;
                    //console.log("DX5: Module loaded");
                    var module = self.get(configuration.id);
                    module.$show()
                },
                error: function(ex, index) {
                    if (!self.environment.notConsoleSupported) console.log("[DX5] loading failed: " + ex.toString() + "\n" + orderOfModules[index]);
                    throw new Error("[DX5] loading failed: " + ex.toString() + "\n" + orderOfModules[index])
                }
            })
        };
        DX5Manager.prototype.$createIEModule = function(configuration) {
            var self = this;
            var doc = window.document;
            var orderOfModules = self.loadedEssentialScripts === true ? [] : ["dextuploadx5-polyfill-ie", "dextuploadx5-common", "dextuploadx5-event-ie", "dextuploadx5-class-progress-ud", "dextuploadx5-class-module-ie"];
            orderOfModules.push(function(next) {
                configuration.lang = !configuration.lang || configuration.lang == "auto" ? getPageLang() : configuration.lang;
                configuration.loadWaitingTime = self.$adjustLoadingTime(configuration.loadWaitingTime);
                if (self.environment.supportedBrowserForHD) {
                    if (!self.popupManager.ud) self.popupManager.ud = new DX5HDUpdateProgress(self, window)
                }
                var container = document.getElementById(getIdSharp(configuration.parentId, false));
                if (!container) {
                    self.throwErr(configuration.id || "undefined", "EX5-1", self.errs.get("EX5-1", "_The target element({0}) does not exist."), [configuration.parentId]);
                    return
                }
                var module = new DX5IEModule(self, container, configuration);
                module.load(configuration.loadWaitingTime, function(version) {
                    if (self.version) {
                        if (compareVersion(version, self.version) < 0) {
                            if (self.resources.ieDownloadURL) {
                                var pop = window.open(self.resources.ieDownloadURL, "DEXTUploadX5ClientDownloadPage", "width=640,height=730,status=no,toolbar=no,menubar=no,location=no");
                                if (pop) pop.focus()
                            } else {
                                self.throwErr(configuration.id, "EX5-8", self.errs.get("EX5-8", "_Loading DEXTUploadX5 IE module failed! - version is low."));
                                return
                            }
                        }
                    }
                    module.loaded = true;
                    self.instances[module.domObject.id] = module;
                    next()
                }, function() {
                    if (self.resources.ieDownloadURL) {
                        var pop = window.open(self.resources.ieDownloadURL, "DEXTUploadX5ClientDownloadPage", "width=640,height=730,status=no,toolbar=no,menubar=no,location=no");
                        if (pop) pop.focus()
                    } else {
                        self.throwErr(configuration.id, "EX5-9", self.errs.get("EX5-9", "_Loading DEXTUploadX5 IE module failed! - not installed"))
                    }
                })
            });
            orderOfModules.push(function(next) {
                var module = self.get(configuration.id);
                //console.log("DX5: Precondition settings");
                if (self.authkey) {
                    module.setAuthkey(self.authkey);
                    if (configuration.uploadUrl) module.setUploadURL(configuration.uploadUrl)
                } else {
                    self.throwErr(module.domObject.id, "EX5-10", self.errs.get("EX5-10", "_The product authkey is necessary."))
                }
                next()
            });
            orderOfModules.push(function(next) {
                var module = self.get(configuration.id);
                var btn = null;
                console.log("DX5: Helper settings");
                if (configuration.btnFile) {
                    btn = doc.getElementById(getIdSharp(configuration.btnFile, false));
                    btn && btn.addEventListener("click", function(e) {
                        e.preventDefault();
                        module.openFileDialog()
                    }, false)
                }
                if (configuration.btnFolder) {
                    btn = doc.getElementById(getIdSharp(configuration.btnFolder, false));
                    btn && btn.addEventListener("click", function(e) {
                        e.preventDefault();
                        module.openFolderDialog()
                    }, false)
                }
                if (configuration.btnSelectAll) {
                    btn = doc.getElementById(getIdSharp(configuration.btnSelectAll, false));
                    btn && btn.addEventListener("click", function(e) {
                        e.preventDefault();
                        module.selectAll()
                    }, false)
                }
                if (configuration.btnUnselectAll) {
                    btn = doc.getElementById(getIdSharp(configuration.btnUnselectAll, false));
                    btn && btn.addEventListener("click", function(e) {
                        e.preventDefault();
                        module.unselectAll()
                    }, false)
                }
                if (configuration.btnDeleteSelected) {
                    btn = doc.getElementById(getIdSharp(configuration.btnDeleteSelected, false));
                    btn && btn.addEventListener("click", function(e) {
                        e.preventDefault();
                        module.removeSelected()
                    }, false)
                }
                if (configuration.btnDeleteAll) {
                    btn = doc.getElementById(getIdSharp(configuration.btnDeleteAll, false));
                    btn && btn.addEventListener("click", function(e) {
                        e.preventDefault();
                        module.removeAll()
                    }, false)
                }
                if (configuration.btnDeleteChecked) {
                    btn = doc.getElementById(getIdSharp(configuration.btnDeleteChecked, false));
                    btn && btn.addEventListener("click", function(e) {
                        e.preventDefault();
                        module.removeChecked()
                    }, false)
                }
                if (configuration.btnRevokeAll) {
                    btn = doc.getElementById(getIdSharp(configuration.btnRevokeAll, false));
                    btn && btn.addEventListener("click", function(e) {
                        e.preventDefault();
                        module.revokeAllVirtualFiles()
                    }, false)
                }
                if (configuration.btnUploadAuto) {
                    btn = doc.getElementById(getIdSharp(configuration.btnUploadAuto, false));
                    btn && btn.addEventListener("click", function(e) {
                        e.preventDefault();
                        module.upload("AUTO")
                    }, false)
                }
                if (configuration.btnUploadChecked) {
                    btn = doc.getElementById(getIdSharp(configuration.btnUploadChecked, false));
                    btn && btn.addEventListener("click", function(e) {
                        e.preventDefault();
                        module.upload("CHECKED")
                    }, false)
                }
                if (configuration.btnUploadSelected) {
                    btn = doc.getElementById(getIdSharp(configuration.btnUploadSelected, false));
                    btn && btn.addEventListener("click", function(e) {
                        e.preventDefault();
                        module.upload("SELECTED")
                    }, false)
                }
                if (configuration.btnOpenDownloadDialog) {
                    btn = doc.getElementById(getIdSharp(configuration.btnOpenDownloadDialog, false));
                    btn && btn.addEventListener("click", function(e) {
                        e.preventDefault();
                        if (module.mode == "ie") module.openDownloadPathDialog();
                        else self.throwErr(module.domObject.id, "EX5-11", self.errs.get("EX5-11", "_Not supported function in DEXTUploadX5 Multi module"))
                    }, false)
                }
                if (configuration.btnDownloadAuto) {
                    btn = doc.getElementById(getIdSharp(configuration.btnDownloadAuto, false));
                    btn && btn.addEventListener("click", function(e) {
                        e.preventDefault();
                        module.download("AUTO")
                    }, false)
                }
                if (configuration.btnDownloadChecked) {
                    btn = doc.getElementById(getIdSharp(configuration.btnDownloadChecked, false));
                    btn && btn.addEventListener("click", function(e) {
                        e.preventDefault();
                        module.download("CHECKED")
                    }, false)
                }
                if (configuration.btnDownloadSelected) {
                    btn = doc.getElementById(getIdSharp(configuration.btnDownloadSelected, false));
                    btn && btn.addEventListener("click", function(e) {
                        e.preventDefault();
                        module.download("SELECTED")
                    }, false)
                }
                if (configuration.btnStopUploading) {
                    btn = doc.getElementById(getIdSharp(configuration.btnStopUploading, false));
                    btn && btn.addEventListener("click", function(e) {
                        e.preventDefault();
                        module.stopUploading()
                    }, false)
                }
                if (configuration.btnStopDownloading) {
                    btn = doc.getElementById(getIdSharp(configuration.btnStopDownloading, false));
                    btn && btn.addEventListener("click", function(e) {
                        e.preventDefault();
                        module.stopDownloading()
                    }, false)
                }
                if (configuration.btnDownloadCompressedAuto) {
                    btn = doc.getElementById(getIdSharp(configuration.btnDownloadCompressedAuto, false));
                    btn && btn.addEventListener("click", function(e) {
                        e.preventDefault();
                        if (module.mode == "multi") module.downloadCompressed("AUTO");
                        else self.throwErr(module.domObject.id, "EX5-12", self.errs.get("EX5-12", "_Not supported function in DEXTUploadX5 IE module"))
                    }, false)
                }
                if (configuration.btnDownloadCompressedChecked) {
                    btn = doc.getElementById(getIdSharp(configuration.btnDownloadCompressedChecked, false));
                    btn && btn.addEventListener("click", function(e) {
                        e.preventDefault();
                        if (module.mode == "multi") module.downloadCompressed("CHECKED");
                        else self.throwErr(module.domObject.id, "EX5-12", self.errs.get("EX5-12", "_Not supported function in DEXTUploadX5 IE module"))
                    }, false)
                }
                if (configuration.btnDownloadCompressedSelected) {
                    btn = doc.getElementById(getIdSharp(configuration.btnDownloadCompressedSelected, false));
                    btn && btn.addEventListener("click", function(e) {
                        e.preventDefault();
                        if (module.mode == "multi") module.downloadCompressed("SELECTED");
                        else self.throwErr(module.domObject.id, "EX5-12", self.errs.get("EX5-12", "_Not supported function in DEXTUploadX5 IE module"))
                    }, false)
                }
                if (configuration.btnStopCompressWaiting) {
                    btn = doc.getElementById(getIdSharp(configuration.btnStopCompressWaiting, false));
                    btn && btn.addEventListener("click", function(e) {
                        e.preventDefault();
                        if (module.mode == "multi") module.stopCompressWaiting();
                        else self.throwErr(module.domObject.id, "EX5-12", self.errs.get("EX5-12", "_Not supported function in DEXTUploadX5 IE module"))
                    }, false)
                }
                if (configuration.btnOpenDownloadDialogOfHD) {
                    btn = doc.getElementById(getIdSharp(configuration.btnOpenDownloadDialogOfHD, false));
                    btn && btn.addEventListener("click", function(e) {
                        e.preventDefault();
                        module.openDownloadPathDialogOfHD()
                    }, false)
                }
                if (configuration.btnDownloadToHDAuto) {
                    btn = doc.getElementById(getIdSharp(configuration.btnDownloadToHDAuto, false));
                    btn && btn.addEventListener("click", function(e) {
                        e.preventDefault();
                        module.downloadToHD("AUTO")
                    }, false)
                }
                if (configuration.btnDownloadToHDChecked) {
                    btn = doc.getElementById(getIdSharp(configuration.btnDownloadToHDChecked, false));
                    btn && btn.addEventListener("click", function(e) {
                        e.preventDefault();
                        module.downloadToHD("CHECKED")
                    }, false)
                }
                if (configuration.btnDownloadToHDSelected) {
                    btn = doc.getElementById(getIdSharp(configuration.btnDownloadToHDSelected, false));
                    btn && btn.addEventListener("click", function(e) {
                        e.preventDefault();
                        module.downloadToHD("SELECTED")
                    }, false)
                }
                next()
            });
            var thead = window.document.getElementsByTagName("head")[0];
            loopTask({
                length: orderOfModules.length,
                init: function(next) {
                    self.loadingModuleState = self.MODULE_LOAD_ACTIVE;
                    next()
                },
                func: function(next, index) {
                    if (typeof orderOfModules[index] === "function") {
                        orderOfModules[index](next)
                    } else {
                        var tscript = window.document.createElement("script");
                        if (self.environment.notOnLoadSupported) {
                            tscript.onreadystatechange = function() {
                                if (tscript.readyState === "complete" || tscript.readyState === "loaded") {
                                    tscript.onreadystatechange = null;
                                    console.log("DX5: module loaded = " + tscript.src);
                                    next()
                                }
                            }
                        } else {
                            tscript.onload = function() {
                                this.onload = null;
                                console.log("DX5: module loaded = " + tscript.src);
                                next()
                            }
                        }
                        tscript.type = "text/javascript";
                        tscript.src = configuration.path + (configuration.path.indexOf("/") === configuration.path.length - 1 ? "/" : "") + "module/" + orderOfModules[index] + ".js";
                        thead.appendChild(tscript)
                    }
                },
                complete: function() {
                    self.loadedEssentialScripts = true;
                    self.loadingModuleState = self.MODULE_LOAD_WAIT;
                    //console.log("DX5: Module loaded")
                },
                error: function(ex, index) {
                    if (!self.environment.notConsoleSupported) console.log("[DX5] loading failed: " + ex.toString() + "\n" + orderOfModules[index]);
                    throw new Error("[DX5] loading failed: " + ex.toString() + "\n" + orderOfModules[index])
                }
            })
        };
        DX5Manager.prototype.throwErr = function(id, code, msg, parameters) {
            this.loadingModuleState = this.MODULE_LOAD_WAIT;
            var maked = parameters ? sformat(msg, parameters) : msg;
            this.$emitErrorEvent({
                id: id,
                code: code,
                message: maked
            })
        };
        DX5Manager.prototype.create = function(userConfig) {
            var self = this;
            var configuration = {};
            for (var pname in this.$defaultConfig) {
                configuration[pname] = userConfig && userConfig[pname] ? userConfig[pname] : this.$defaultConfig[pname]
            }
            configuration.path = configuration.path || self.rootPath;
            configuration.data = userConfig.data || {};
            self.waitQueue.push(configuration);
            (function loadSequence(expiration) {
                if (self.waitQueue.length == 0) return;
                if (expiration <= 0) {
                    //self.throwErr("undefined", "EX5-28", self.errs.get("EX5-28", "_Creating a Multi module is failed."));
					console.log('Creating a Multi module is failed.');
                    return
                }
                if (self.loadingModuleState === self.MODULE_LOAD_WAIT) {
                    var currentConfig = self.waitQueue.shift();
                    if (currentConfig.mode === "multi") {
                        if (!self.environment.supportedHTML5Upload) {
                            self.throwErr("undefined", "EX5-26", self.errs.get("EX5-26", "_Essential HTML5 features not supported."))
                        } else {
                            self.delete(currentConfig.id);
                            self.$createMultiModule(currentConfig)
                        }
                    } else if (currentConfig.mode === "ie") {
                        var supported = AXFiltering();
                        if (supported === "unsupported") {
                            self.throwErr(currentConfig.id || "undefined", "EX5-4", self.errs.get("EX5-4", "_The browser does not support the ActiveX."));
                            return
                        } else if (supported === true) {
                            self.throwErr(currentConfig.id || "undefined", "EX5-5", self.errs.get("EX5-5", "_The browser is disable of the ActiveX."));
                            return
                        } else {
                            self.delete(currentConfig.id);
                            self.$createIEModule(currentConfig)
                        }
                    }
                } else {
                    setTimeout(function() {
                        loadSequence(expiration - 100)
                    }, 100)
                }
            })(1e4)
        };
        DX5Manager.prototype.canonicalize = function(relative) {
            var lstSlashIndex = location.pathname.lastIndexOf("/"),
                parent = location.pathname.substring(0, lstSlashIndex);
            if (!relative) return location.href;
            while (parent || relative) {
                if (relative.indexOf("/") == 0) {
                    parent = "";
                    relative = relative.substring(1)
                } else if (relative.indexOf("./") == 0) {
                    relative = relative.substring(2)
                } else if (relative.indexOf("../") == 0) {
                    relative = relative.substring(3);
                    parent = parent.substring(0, parent.lastIndexOf("/"))
                } else break
            }
            if (!location.origin) location.origin = location.protocol + "//" + location.host;
            return location.origin + parent + "/" + relative
        };
        DX5Manager.prototype.isHDAvailable = function(success, fail) {
            var self = this;
            if (!self.environment.supportedOSForHD) {
                console.log("DX5: The error occured for checking the HD available.");
                self.throwErr("undefined", "EX5-25", self.errs.get("EX5-25", "_DEXTUploadX5 HD application is not supported to {0}."), [self.environment.osName]);
                return
            }
            if (!self.environment.supportedBrowserForHD) {
                console.log("DX5: The error occured for checking the HD available.");
                self.throwErr("undefined", "EX5-27", self.errs.get("EX5-27", "_DEXTUploadX5 HD application is not supported to {0} {1}."), [self.environment.browser, self.environment.browserVersion]);
                return
            }
            self.hdManager.$callHDS(1, {}, function(data) {
                var res = JSON.parse(data);
                if (res.rc === 0) {
                    if (success && typeof success === "function") {
                        success(res.rd)
                    }
                } else {
                    if (fail && typeof fail === "function") {
                        fail(res.ec, res.em)
                    }
                }
            }, function(ecode, err) {
                if (fail && typeof fail === "function") {
                    fail(ecode, err)
                }
            })
        };
        DX5Manager.prototype.isHDRunning = function(success, fail) {
            var self = this;
            if (!self.environment.supportedOSForHD) {
                console.log("DX5: The error occured for checking the HD running.");
                self.throwErr("undefined", "EX5-25", self.errs.get("EX5-25", "_DEXTUploadX5 HD application is not supported to {0}."), [self.environment.osName]);
                return
            }
            if (!self.environment.supportedBrowserForHD) {
                console.log("DX5: The error occured for checking to HD running.");
                self.throwErr("undefined", "EX5-27", self.errs.get("EX5-27", "_DEXTUploadX5 HD application is not supported to {0} {1}."), [self.environment.browser, self.environment.browserVersion]);
                return
            }
            self.hdManager.$callHDM(1, {}, function(data) {
                var res = JSON.parse(data);
                if (res.rc === 0) {
                    if (success && typeof success === "function") {
                        success(res.rd)
                    }
                } else {
                    if (fail && typeof fail === "function") {
                        fail(res.ec, res.em)
                    }
                }
            }, function(ecode, err) {
                if (fail && typeof fail === "function") {
                    fail(ecode, err)
                }
            })
        };
        DX5Manager.prototype.get = function(elementId) {
            return this.instances[elementId] || null
        };
        DX5Manager.prototype.delete = function(elementId) {
            var target = this.instances[elementId];
            if (target) {
                target.$deleteSelf();
                delete this.instances[elementId];
                return true
            } else return false
        };
        DX5Manager.prototype.showUploadProgress = function(id) {
            var dx = this.get(id);
            if (dx && dx.isUsingProgressDialog && dx.isUsingProgressDialog() === true) {
                this.popupManager.up[dx.getProgressType()].show(id)
            }
        };
        DX5Manager.prototype.hideUploadProgress = function(id, force, after) {
            var dx = this.get(id);
            if (dx && dx.isUsingProgressDialog && dx.isUsingProgressDialog() === true) {
                this.popupManager.up[dx.getProgressType()].hide(id, force === true, after);
                return true
            } else {
                return false
            }
        };
        DX5Manager.prototype.showDownloadProgress = function(id) {
            var dx = this.get(id);
            if (dx && dx.isUsingProgressDialog && dx.isUsingProgressDialog() === true) {
                this.popupManager.dn[dx.getProgressType()].show(id)
            }
        };
        DX5Manager.prototype.hideDownloadProgress = function(id, force, after) {
            var dx = this.get(id);
            if (dx && dx.isUsingProgressDialog && dx.isUsingProgressDialog() === true) {
                this.popupManager.dn[dx.getProgressType()].hide(id, force === true, after);
                return true
            } else {
                return false
            }
        };
        DX5Manager.prototype.showPreviewWindow = function(itemSource, backColor) {
            this.popupManager.pv.show(itemSource, backColor)
        };
        DX5Manager.prototype.showCompressWaitingProgress = function(id) {
            var dx = this.get(id);
            if (dx && dx.isUsingProgressDialog && dx.isUsingProgressDialog() === true) {
                this.popupManager.cp.show(id)
            }
        };
        DX5Manager.prototype.hideCompressWaitingProgress = function(id, force, after) {
            var dx = this.get(id);
            if (dx && dx.isUsingProgressDialog && dx.isUsingProgressDialog() === true) {
                this.popupManager.cp.hide(id, force === true, after);
                return true
            } else {
                return false
            }
        };
        DX5Manager.prototype.showUpdateProgress = function(id) {
            var dx = this.get(id);
            if (dx && dx.isUsingProgressDialog && dx.isUsingProgressDialog() === true) {
                this.popupManager.ud.show(id)
            }
        };
        DX5Manager.prototype.hideUpdateProgress = function(id, force, after) {
            var dx = this.get(id);
            if (dx && dx.isUsingProgressDialog && dx.isUsingProgressDialog() === true) {
                this.popupManager.ud.hide(id, force === true, after);
                return true
            } else {
                return false
            }
        };
        DX5Manager.prototype.hideAllProgress = function(id) {
            var dx = this.get(id);
            if (dx && dx.mode == "multi" && dx.loaded === true && dx.isUsingProgressDialog && dx.isUsingProgressDialog() === true) {
                this.popupManager.up[dx.getProgressType()].hide(id, true);
                this.popupManager.dn[dx.getProgressType()].hide(id, true);
                this.popupManager.cp.hide(id, true)
            }
        };
        return DX5Manager
    }();
    var ResourceBundle = function() {
        this.bundle = null
    };
    ResourceBundle.prototype.init = function(bundle) {
        this.bundle = bundle
    };
    ResourceBundle.prototype.get = function(key, defVal) {
        if (this.bundle[key] != undefined) return this.bundle[key];
        else if (defVal) return defVal;
        else return null
    };
    var ERRS = new ResourceBundle;
    ERRS.init({
        "EX5-1": "The target element({0}) does not exist.",
        "EX5-2": "The product path is necessary to create DEXTUploadX5 component.",
        "EX5-3": "The mode of the 'create' method's parameter object is only 'multi' or 'ie'.",
        "EX5-4": "The browser does not support the ActiveX.",
        "EX5-5": "The browser is disable of the ActiveX.",
        "EX5-6": "The component[{0}] does not exist.",
        "EX5-7": "Loading DEXTUploadX5 Multi module failed!",
        "EX5-8": "Loading DEXTUploadX5 IE module failed! - version is low.",
        "EX5-9": "Loading DEXTUploadX5 IE module failed! - not installed",
        "EX5-10": "The product authkey is necessary.",
        "EX5-11": "Not supported function in DEXTUploadX5 Multi module",
        "EX5-12": "Not supported function in DEXTUploadX5 IE module",
        "EX5-13": "The progress popup window doesn't exist for DEXTUploadX5.",
        "EX5-14": "The progress popdown window doesn't exist for DEXTUploadX5.",
        "EX5-15": "The progress compress window doesn't exist for DEXTUploadX5.",
        "EX5-16": "DEXTUploadX5 HD application is not installed or requesting to HD failed.\n{0}\n{1}",
        "EX5-17": "DEXTUploadX5 HD application version is low({0} < {1}).",
        "EX5-18": "There is no item for downloading.",
        "EX5-19": "The progress update window doesn't exist for DEXTUploadX5.",
        "EX5-20": "The virtual file is only permitted to download.",
        "EX5-21": "The target path of downloading is not set.",
        "EX5-22": "Choose one flag of 'AUTO, CHECKED, SELECTED.",
        "EX5-23": "The 'enable' parameter should be set to a value of Boolean type.",
        "EX5-24": "The 'value' parameter should be one of '0 ~ 15'.",
        "EX5-25": "DEXTUploadX5 HD application is not supported to {0}.",
        "EX5-26": "Essential HTML5 features not supported.",
        "EX5-27": "DEXTUploadX5 HD application is not supported to {0} {1}.",
        "EX5-28": "Creating a Multi module is failed.",
        "EX5-29": "Adding items to HDM has failed.\n{0}",
        "EX5-30": "The index of the responses is out of range."
    });
    window["dx5"] = new DX5Manager(ERRS)
}
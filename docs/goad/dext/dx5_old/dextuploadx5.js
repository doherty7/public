/*
 * DEXTUploadX5 - main library
 * http://www.dextsolution.com
 *
 * Using MDN content
 * https://developer.mozilla.org/en-US/docs/MDN/About#Copyrights_and_licenses
 * http://creativecommons.org/licenses/by-sa/2.5/deed.ko
 *
 * "About MDN by Mozilla Contributors is licensed under CC-BY-SA 2.5."
 *
 * Includes MDN(Mozillar Deveolper Network) polyfill libraries
 *   - https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
 *   - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
 *
 * Copyright DEVPIA Inc.
 */
;;
(function(win) {
    if (win.dx5) return;
    var doc = win.document;
    var methods = ["assert", "cd", "clear", "count", "countReset", "debug", "dir", "dirxml", "error", "exception", "group", "groupCollapsed", "groupEnd", "info", "log", "markTimeline", "profile", "profileEnd", "select", "table", "time", "timeEnd", "timeStamp", "timeline", "timelineEnd", "trace", "warn"];
    var length = methods.length;
    var console = (window.console = window.console || {});
    var methodName;
    var noop = function() {};
    while (length--) {
        methodName = methods[length];
        if (!console[methodName]) console[methodName] = noop;
    }(function() {
        if (!Event.prototype.preventDefault) {
            Event.prototype.preventDefault = function() {
                this.returnValue = false;
            };
        }
        if (!Event.prototype.stopPropagation) {
            Event.prototype.stopPropagation = function() {
                this.cancelBubble = true;
            };
        }
        if (!Element.prototype.addEventListener) {
            var eventListeners = [];
            var addEventListener = function(type, listener) {
                var self = this;
                var wrapper = function(e) {
                    e.target = e.srcElement, e.currentTarget = self;
                    if (listener.handleEvent) listener.handleEvent(e);
                    else listener.call(self, e);
                };
                if (type == "DOMContentLoaded") {
                    var wrapper2 = function(e) {
                        if (doc.readyState == "complete") {
                            wrapper(e);
                        }
                    };
                    doc.attachEvent("onreadystatechange", wrapper2);
                    eventListeners.push({
                        object: this,
                        type: type,
                        listener: listener,
                        wrapper: wrapper2
                    });
                    if (doc.readyState == "complete") {
                        var e = new Event();
                        e.srcElement = window;
                        wrapper2(e);
                    }
                } else {
                    this.attachEvent("on" + type, wrapper);
                    eventListeners.push({
                        object: this,
                        type: type,
                        listener: listener,
                        wrapper: wrapper
                    });
                }
            };
            var removeEventListener = function(type, listener) {
                var counter = 0;
                while (counter < eventListeners.length) {
                    var eventListener = eventListeners[counter];
                    if (eventListener.object == this && eventListener.type == type && eventListener.listener == listener) {
                        if (type == "DOMContentLoaded") {
                            this.detachEvent("onreadystatechange", eventListener.wrapper);
                        } else {
                            this.detachEvent("on" + type, eventListener.wrapper);
                        }
                        eventListeners.splice(counter, 1);
                        break;
                    }++counter;
                }
            };
            Element.prototype.addEventListener = addEventListener;
            Element.prototype.removeEventListener = removeEventListener;
            if (HTMLDocument) {
                HTMLDocument.prototype.addEventListener = addEventListener;
                HTMLDocument.prototype.removeEventListener = removeEventListener;
            }
            if (Window) {
                Window.prototype.addEventListener = addEventListener;
                Window.prototype.removeEventListener = removeEventListener;
            }
        }
    })();
    (function() {
        if (!Array.prototype.map) {
            Array.prototype.map = function(callback, thisArg) {
                var T, A, k;
                if (this == null) {
                    throw new TypeError(' this is null or not defined');
                }
                var O = Object(this);
                var len = O.length >>> 0;
                if (typeof callback !== 'function') {
                    throw new TypeError(callback + ' is not a function');
                }
                if (arguments.length > 1) {
                    T = thisArg;
                }
                A = new Array(len);
                k = 0;
                while (k < len) {
                    var kValue, mappedValue;
                    if (k in O) {
                        kValue = O[k];
                        mappedValue = callback.call(T, kValue, k, O);
                        A[k] = mappedValue;
                    }
                    k++;
                }
                return A;
            };
        }
    })();
    (function() {
        if (!Array.prototype.indexOf) {
            Array.prototype.indexOf = function(searchElement, fromIndex) {
                var k;
                if (this == null) {
                    throw new TypeError('"this" is null or not defined');
                }
                var o = Object(this);
                var len = o.length >>> 0;
                if (len === 0) {
                    return -1;
                }
                var n = fromIndex | 0;
                if (n >= len) {
                    return -1;
                }
                k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
                while (k < len) {
                    if (k in o && o[k] === searchElement) {
                        return k;
                    }
                    k++;
                }
                return -1;
            };
        }
    })();

    function combinePath(prev, next) {
        var bpi = prev.lastIndexOf("/") == (prev.length - 1);
        var bni = next.indexOf("/") == 0;
        if (bpi && bni) return prev + next.substring(1);
        else if (bpi && !bni) return prev + next;
        else if (!bpi && bni) return prev + next;
        else return prev + "/" + next;
    }

    function isDefined(t) {
        return typeof(t) != "undefined";
    }

    function AXFiltering() {
        if (false == (!!document.documentMode)) {
            return "unsupported";
        }
        if (typeof window.external.msActiveXFilteringEnabled == "unknown") {
            if (window.external.msActiveXFilteringEnabled()) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    function detectBrowser() {
        var ag = navigator.userAgent,
            match = null,
            rs = {
                "isOpera": false,
                "isFirefox": false,
                "isSafari": false,
                "isChrome": false,
                "isIE": false,
                "isEdge": false,
                "isUnKnown": false,
                "version": "0"
            };
        if (!!window.opr || !!window.opera || ag.indexOf(' OPR/') >= 0) {
            rs.isOpera = true;
            match = ag.match(/ OPR\/([0-9]+)\./);
            rs.version = match ? match[1] : "8";
            return rs;
        }
        if (typeof InstallTrigger !== 'undefined') {
            rs.isFirefox = true;
            match = ag.match(/Firefox\/([0-9]+)\./);
            rs.version = match ? match[1] : "1";
            return rs;
        }
        if (/constructor/i.test(window.HTMLElement) || (function(p) {
                return p.toString() === "[object SafariRemoteNotification]";
            })(!window['safari'] || safari.pushNotification)) {
            rs.isSafari = true;
            match = ag.match(/ Version\/([0-9]+)\./);
            rs.version = match ? match[1] : "3";
            return rs;
        }
        if (false || !!document.documentMode) {
            rs.isIE = true;
            match = ag.match(/MSIE ([0-9]+)\./);
            if (match) rs.version = match[1];
            else if (!(window.ActiveXObject) && "ActiveXObject" in window) rs.version = "11";
            return rs;
        }
        if (!!window.StyleMedia && !!navigator.msSaveBlob) {
            rs.isEdge = true;
            match = ag.match(/Edge\/([0-9]+)\./);
            rs.version = match ? match[1] : "1";
            return rs;
        }
        if (!!window.chrome) {
            rs.isChrome = true;
            match = ag.match(/Chrom(e|ium)\/([0-9]+)\./);
            rs.version = match ? match[2] : "1";
            return rs;
        }
        rs.isUnKnown = true;
        return rs;
    }

    function getIdSharp(id, use) {
        var sharp = (id && id.indexOf("#") == 0) ? true : false;
        if (sharp && use) return id;
        else if (sharp && !use) return id.substring(1);
        else if (!sharp && use) return "#" + id;
        else return id;
    }

    function addClass(target, cname) {
        var tcls = target.className;
        var tokens = tcls.split(" ");
        tokens.push(cname);
        target.className = tokens.join(" ");
    }

    function removeClass(target, rname) {
        var tcls = target.className;
        var tokens = tcls.split(" ");
        for (var i = 0; i < tokens.length; i++) {
            if (rname == tokens[i]) {
                tokens.splice(i, 1);
                break;
            }
        }
        target.className = tokens.join(" ");
    }

    function compareVersion(vera, verb) {
        var tokenA = vera.split(/\./);
        var tokenB = verb.split(/\./);
        for (var i = 0, len = Math.max(tokenA.length, tokenB.length), va = 0, vb = 0; i < len; i++) {
            va = i < tokenA.length ? parseInt(tokenA[i]) : 0;
            vb = i < tokenB.length ? parseInt(tokenB[i]) : 0;
            if (va < vb) return -1;
            else if (va > vb) return 1;
            else continue;
        }
        return 0;
    }

    function dic2kvList(dic) {
        var lst = [];
        if (dic) {
            for (var key in dic) {
                lst.push(encodeURIComponent(key) + "=" + encodeURIComponent(dic[key]));
            }
        }
        return lst;
    }

    function asyncLoop(o) {
        var index = -1;
        var next = function() {
            index++;
            if (index == o.length) {
                if (o.complete && typeof o.complete == "function") o.complete();
                return;
            } else {
                if (o.func && typeof o.func == "function") o.func(next, index);
            }
        };
        next();
    };

    function errorOut(id, code, message) {
        win.onDX5_H5_Error({
            "id": id,
            "code": code,
            "message": message
        });
    }

    function errorFromHD(id, rc, ec, em) {
        var code = "EHD-" + rc + "-" + ec;
        var msg = em || "";
        errorOut(id, code, msg);
    }

    function errorFromX5(id, code, msg) {
        var code = "EX5-" + code;
        errorOut(id, code, msg);
    }

    function ajaxOnlyHD(url, method, callbacks, ret, data, headers, asyncflag) {
        var xhr = (typeof XMLHttpRequest !== "undefined") ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP"),
            query = dic2kvList(data),
            url = method.toUpperCase() != "POST" ? url + (query.length > 0 ? "?" + query.join("&") : "") : url;
        xhr["method"] = method.toUpperCase();
        xhr.open(xhr["method"], url, asyncflag);
        if (xhr["method"] == "POST") xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        if (headers)
            for (var h in headers) {
                xhr.setRequestHeader(h, headers[h]);
            }
        if (ret == "blob") {
            xhr.responseType = "blob";
        } else if (ret == "json") {
            xhr.responseType = "json";
        } else if (ret == "xml") {
            xhr.overrideMimeType('text/xml');
            xhr.responseType = "document";
        } else if (ret == "buffer") {
            xhr.responseType = "arraybuffer";
        } else {
            xhr.responseType = "text";
        }
        xhr.addEventListener("readystatechange", function(evt) {
            if (xhr.readyState == this.HEADERS_RECEIVED) {
                if (callbacks && typeof callbacks.header == "function") {
                    callbacks.header();
                }
            }
        }, false);
        xhr.addEventListener("loadstart", function(evt) {
            if (callbacks && typeof callbacks.start == "function") {
                callbacks.start(evt);
            }
        }, false);
        xhr.addEventListener("progress", function(evt) {
            if (callbacks && typeof callbacks.progress == "function") {
                callbacks.progress(evt);
            }
        }, false);
        xhr.addEventListener("abort", function(evt) {
            if (callbacks && typeof callbacks.abort == "function") {
                callbacks.abort();
            }
        }, false);
        xhr.addEventListener("error", function(evt) {
            if (callbacks && typeof callbacks.error == "function") {
                callbacks.error(xhr.status, evt.message);
            }
        }, false);
        xhr.addEventListener("timeout", function(evt) {
            if (callbacks && typeof callbacks.timeout == "function") {
                callbacks.timeout();
            }
        }, false);
        xhr.addEventListener("load", function(evt) {
            if (xhr.status < 400) {
                if (callbacks && typeof callbacks.load == "function") {
                    if (xhr["method"] && xhr["method"] == "HEAD") {
                        callbacks.load("");
                    } else {
                        switch (xhr.responseType) {
                            case "arraybuffer":
                                callbacks.load(xhr.response);
                                break;
                            case "document":
                                callbacks.load(xhr.responseXML);
                                break;
                            case "json":
                                callbacks.load(xhr.response);
                                break;
                            case "blob":
                                callbacks.load(xhr.response);
                                break;
                            default:
                                callbacks.load(xhr.responseText);
                                break;
                        }
                    }
                }
            } else {
                if (callbacks && typeof callbacks.error == "function") {
                    var contentType = xhr.getResponseHeader("Content-Type");
                    if (contentType && contentType.indexOf("text/") == 0) {
                        if (xhr.responseType == "blob") {
                            var fr = new FileReader();
                            fr.addEventListener("load", function(frevt) {
                                var errbody = frevt.target.result;
                                fr.removeEventListener("load", arguments.callee);
                                callbacks.error(xhr.status, errbody);
                            });
                            fr.readAsText(xhr.response);
                        } else if (xhr.responseType == "arraybuffer") {
                            var errbody = ab2str(!xhr.response ? [] : xhr.response, "utf-8");
                            callbacks.error(xhr.status, errbody);
                        } else if (xhr.responseType == "json") {
                            callbacks.error(xhr.status, !xhr.response ? "Check the response body from the browser network tab in development mode." : xhr.response);
                        } else if (xhr.responseType == "document") {
                            callbacks.error(xhr.status, xml2str(xhr.response));
                        } else {
                            callbacks.error(xhr.status, xhr.response);
                        }
                    } else {
                        callbacks.error(xhr.status, xhr.response);
                    }
                }
            }
        }, false);
        xhr.addEventListener("loadend", function(evt) {
            xhr.removeEventListener("readystatechange", arguments.callee);
            xhr.removeEventListener("loadstart", arguments.callee);
            xhr.removeEventListener("error", arguments.callee);
            xhr.removeEventListener("abort", arguments.callee);
            xhr.removeEventListener("timeout", arguments.callee);
            xhr.removeEventListener("loadend", arguments.callee);
        }, false);
        xhr.send((xhr["method"] == "POST" && query.length > 0) ? query.join("&") : null);
        return xhr;
    }

    function getHDOrigin() {
        if (location.protocol == "https" || location.protocol == "https:") {
            if (win.dx5.browser.isIE) return "https://127.0.0.1";
            else if (win.dx5.browser.isChrome) return "https://localhost";
            else if (win.dx5.browser.isFirefox) return "http://127.0.0.1:35959";
            else if (win.dx5.browser.isOpera) return "https://localhost";
            else if (win.dx5.browser.isEdge) return "https://127.0.0.1";
            else throw new Error("Current browser is not supported to use the HD application.");
        } else {
            if (win.dx5.browser.isIE) return "http://127.0.0.1:35959";
            else return "http://localhost:35959";
        }
    }

    function callHDS(cmdnum, data, success, fail) {
        var origin = "";
        try {
            origin = getHDOrigin() + "/DEXTUploadX5_HDS";
        } catch (ex) {
            fail(undefined, ex.message);
            return;
        }
        data["cmd"] = cmdnum;
        ajaxOnlyHD(origin, "POST", {
            load: function(res) {
                success(res);
            },
            error: function(ecode, err) {
                fail(ecode, err);
            }
        }, "text", data, {}, true);
    }

    function callHDM(cmdnum, data, success, fail) {
        var origin = "";
        try {
            origin = getHDOrigin() + "/DEXTUploadX5_HDM";
        } catch (ex) {
            fail(undefined, ex.message);
            return;
        }
        data["cmd"] = cmdnum;
        ajaxOnlyHD(origin, "POST", {
            load: function(res) {
                success(res);
            },
            error: function(ecode, err) {
                fail(ecode, err);
            }
        }, "text", data, {}, true);
    }

    function callHD(wrapper, callback) {
        callHDS(1, {}, function(data) {
            if (JSON) {
                var res = JSON.parse(data);
                if (res.rc === 0) {
                    if (compareVersion(win.dextuploadx5Configuration.version, res.rd) <= 0) {
                        callHDS(2, {}, function(data) {
                            res = JSON.parse(data);
                            if (res.rc === 0) {
                                callHDM(6, {
                                    "textxml_uri": combinePath(win.dx5.rootPath, "res/dextuploadx5-hd-message" + (win.dx5.lang ? "-" + win.dx5.lang : "") + ".xml")
                                }, function(data) {
                                    var res = JSON.parse(data);
                                    if (res.rc === 0) {
                                        if (callback && typeof callback == "function") {
                                            callback();
                                        }
                                    } else {
                                        console.log("DX5: HD Error occured. Changing the HD text resource failed.");
                                        errorFromHD(wrapper.domObject.id, res.rc, res.ec, res.em);
                                    }
                                }, function(ecode, err) {
                                    console.log("DX5: HD Error occured. Changing the HD text resource failed.");
                                    errorFromX5(wrapper.domObject.id, 16, "DEXTUploadX5 HD Application Not Installed or Request Failed.\n" + ecode + "\n" + err);
                                });
                            } else {
                                console.log("DX5: HD Error occured. It failed to run the HD.");
                                errorFromHD(wrapper.domObject.id, res.rc, res.ec, res.em);
                            }
                        }, function(ecode, err) {
                            console.log("DX5: HD Error occured. It failed to run the HD.");
                            errorFromX5(wrapper.domObject.id, 16, "DEXTUploadX5 HD Application Not Installed or Request Failed.\n" + ecode + "\n" + err);
                        });
                    } else if (compareVersion(res.rd, "2.1.2.0") < 0) {
                        if (win.dextuploadx5Configuration && win.dextuploadx5Configuration.hdDownloadURL) {
                            win.open(win.dextuploadx5Configuration.hdDownloadURL, "DEXTUploadX5HDApplicationDownloadPage", "width=640,height=600,status=no,toolbar=no,menubar=no,location=no");
                        } else {
                            console.log("DX5: HD Error occured. Version comparision.");
                            errorFromX5(wrapper.domObject.id, 17, "DEXTUploadX5 HD Application Version low(" + res.rd + " < " + win.dextuploadx5Configuration.version + ").");
                        }
                        return;
                    } else {
                        console.log("DX5: Updating the HD application from " + res.rd + " to " + win.dextuploadx5Configuration.version);
                        if (wrapper.isUsingProgressDialog() === true) {
                            win.dx5.popupManager.ud.show(wrapper.domObject.id);
                        }
                        callHDS(3, {
                            "version": win.dextuploadx5Configuration.version,
                            "update_file_url_32": win.dextuploadx5Configuration.hd32UpdateURL,
                            "update_file_url_64": win.dextuploadx5Configuration.hd64UpdateURL,
                        }, function(data) {
                            if (wrapper.isUsingProgressDialog() === true) {
                                win.dx5.popupManager.ud.hide(wrapper.domObject.id, true);
                            }
                            res = JSON.parse(data);
                            if (res.rc === 0) {} else {
                                console.log("DX5: HD Error occured. Updating failed. version = " + win.dextuploadx5Configuration.version + ", url = ");
                                errorFromHD(wrapper.domObject.id, res.rc, res.ec, res.em);
                            }
                        }, function(ecode, err) {
                            if (wrapper.isUsingProgressDialog() === true) {
                                win.dx5.popupManager.ud.hide(wrapper.domObject.id, true);
                            }
                            console.log("DX5: HD Error occured. Updating failed.");
                            errorFromX5(wrapper.domObject.id, 16, "DEXTUploadX5 HD Application Not Installed or Request Failed.\n" + ecode + "\n" + err);
                        });
                        return;
                    }
                } else {
                    console.log("DX5: HD Error occured. Getting version.");
                    errorFromHD(wrapper.domObject.id, res.rc, res.ec, res.em);
                }
            }
        }, function(ecode, err) {
            console.log("DX5: HD Error occured. Getting version. code = " + ecode + ", error = " + err);
            if (win.dextuploadx5Configuration && win.dextuploadx5Configuration.hdDownloadURL) {
                win.open(win.dextuploadx5Configuration.hdDownloadURL, "DEXTUploadX5HDApplicationDownloadPage", "width=640,height=600,status=no,toolbar=no,menubar=no,location=no");
            } else {
                errorFromX5(wrapper.domObject.id, 16, "DEXTUploadX5 HD Application Not Installed or Request Failed.\n" + ecode + "\n" + err);
            }
            return;
        });
    };

    function downloadByHD(wrapper, arr, duplicated) {
        var opWhenDuplication = 0;
        callHD(wrapper, function() {
            asyncLoop({
                length: arr.length,
                func: function(next, index) {
                    callHDM(7, {
                        "check_title": arr[index].name || "",
                        "check_size": arr[index].size
                    }, function(data) {
                        var res = JSON.parse(data);
                        if (res.rc !== 0) {
                            if (opWhenDuplication == 2) {} else if (opWhenDuplication == 3) {
                                next();
                                return;
                            } else {
                                if (duplicated && typeof duplicated == "function") {
                                    var ret = duplicated(arr[index].name);
                                    if (ret === 1) {
                                        next();
                                        return;
                                    } else if (ret === 2) {
                                        opWhenDuplication = 2;
                                    } else if (ret === 3) {
                                        opWhenDuplication = 3;
                                        next();
                                        return;
                                    } else {
                                        opWhenDuplication = 0;
                                    }
                                }
                            }
                        }
                        callHDM(3, {
                            "downfileuri": arr[index].downUrl || arr[index].url || "",
                            "authkey": win.dextuploadx5Configuration.authkey || "",
                            "middlepath": arr[index].middlePath || "",
                            "filetitle": arr[index].name || "",
                            "filesize": arr[index].size || -1,
                            "eventuri_start": arr[index].eventUriStart || "",
                            "eventuri_stop": arr[index].eventUriStop || "",
                            "eventuri_complete": arr[index].eventUriEnd || "",
                            "chunkSize": arr[index].chunkSize || -1,
                            "custom_header": wrapper.getTotalCustomHeaders() || "",
                            "hdtitle": arr[index].hdTitle || ""
                        }, function(data) {
                            res = JSON.parse(data);
                            if (res.rc === 0) next();
                            else {
                                console.log("DX5: HD Error occured. Adding items.");
                                errorFromHD(wrapper.domObject.id, res.rc, res.ec, res.em);
                            }
                        }, function(ecode, err) {
                            console.log("DX5: HD Error occured. Adding items.");
                            errorFromX5(wrapper.domObject.id, 16, "DEXTUploadX5 HD Application Not Installed or Request Failed.\n" + ecode + "\n" + err);
                        });
                    }, function(ecode, err) {
                        console.log("DX5: HD Error occured. Checking duplication.");
                        errorFromX5(wrapper.domObject.id, 16, "DEXTUploadX5 HD Application Not Installed or Request Failed.\n" + ecode + "\n" + err);
                    });
                },
                complete: function() {
                    console.log("DX5: It has finishied adding items to the HDM.");
                }
            });
        });
    }

    function askDownPathOfHD(wrapper, callback) {
        callHD(wrapper, function() {
            callHDM(2, {}, function(data) {
                var res = JSON.parse(data);
                if (res.rc === 0) {
                    console.log("DX5: Asked the HD download path. " + res.rd);
                    if (callback && typeof callback == "function") {
                        callback(res.rd);
                    }
                } else {
                    console.log("DX5: Asking the HD download path discarded or failed. " + res.ec + " " + res.em + " " + res.sec + " " + res.sem);
                }
            }, function(ecode, err) {
                console.log("DX5: HD Error occured. Asking the download path.");
                errorFromX5(wrapper.domObject.id, 16, "DEXTUploadX5 HD Application Not Installed or Request Failed.\n" + ecode + "\n" + err);
            });
        });
    }

    function getDownPathOfHD(wrapper, callback) {
        callHD(wrapper, function() {
            callHDM(8, {}, function(data) {
                var res = JSON.parse(data);
                if (res.rc === 0) {
                    console.log("DX5: Getting the HD download path. " + res.rd);
                    if (callback && typeof callback == "function") {
                        callback(res.rd);
                    }
                } else {
                    console.log("DX5: Getting the HD download path discarded or failed. " + res.ec + " " + res.em + " " + res.sec + " " + res.sem);
                    errorFromHD(wrapper.domObject.id, res.rc, res.ec, res.em);
                }
            }, function(ecode, err) {
                console.log("DX5: HD Error occured. Getting the download path.");
                errorFromX5(wrapper.domObject.id, 16, "DEXTUploadX5 HD Application Not Installed or Request Failed.\n" + ecode + "\n" + err);
            });
        });
    }

    function setDownPathOfHD(wrapper, path, callback) {
        callHD(wrapper, function() {
            callHDM(9, {
                "new_save_path": path
            }, function(data) {
                var res = JSON.parse(data);
                if (res.rc === 0) {
                    console.log("DX5: Setting the HD download path. " + res.rd);
                    if (callback && typeof callback == "function") {
                        callback(res.rd);
                    }
                } else {
                    console.log("DX5: Setting the HD download path discarded or failed. " + res.ec + " " + res.em + " " + res.sec + " " + res.sem);
                    errorFromHD(wrapper.domObject.id, res.rc, res.ec, res.em);
                }
            }, function(ecode, err) {
                console.log("DX5: HD Error occured. Setting the download path.");
                errorFromX5(wrapper.domObject.id, 16, "DEXTUploadX5 HD Application Not Installed or Request Failed.\n" + ecode + "\n" + err);
            });
        });
    }

    function changeResourceOfHD(wrapper, lang) {
        var hdlang = "";
        if (!lang || lang == "auto") {
            hdlang = navigator.language || navigator.browserLanguage || navigator.systemLanguage;
            hdlang = hdlang ? hdlang.split("-")[0] : "";
        } else {
            hdlang = lang;
        }
        callHD(wrapper, function() {
            callHDM(6, {
                "textxml_uri": combinePath(win.dx5.rootPath, "res/dextuploadx5-hd-message" + (hdlang ? "-" + hdlang : "") + ".xml")
            }, function(data) {
                var res = JSON.parse(data);
                if (res.rc === 0) {
                    console.log("DX5: HD text resource changed. " + res.rd);
                } else {
                    console.log("DX5: HD Error occured. Changing text resource.");
                    errorFromHD(wrapper.domObject.id, res.rc, res.ec, res.em);
                }
            }, function(ecode, err) {
                console.log("DX5: HD Error occured. Changing text resource.");
                errorFromX5(wrapper.domObject.id, 16, "DEXTUploadX5 HD Application Not Installed or Request Failed.\n" + ecode + "\n" + err);
            });
        });
    }

    function getMutliUIStyle(style) {
        switch (style) {
            case "tile":
                return "dextuploadx5-main-tile.svg";
            case "single":
                return "dextuploadx5-main-single.svg";
            default:
                return "dextuploadx5-main-list.svg";
        }
    }

    function throwMultiNotSupportedError() {
        throw new Error("Not supported function in DEXTUploadX5 Multi module");
    }

    function throwIENotSupportedError() {
        throw new Error("Not supported function in DEXTUploadX5 IE module");
    }

    function setAPIs(wrapper) {
        wrapper.allowHiddenFile = function(allow) {
            if (this.mode == "multi") throwMultiNotSupportedError();
            else if (this.mode == "ie") this.component.allowHiddenFile(allow);
        };
        wrapper.getVersion = function() {
            return this.component.getVersion();
        };
        wrapper.getSplitString = function() {
            return this.component.getSplitString();
        };
        wrapper.setSplitString = function(str) {
            this.component.setSplitString(str);
        };
        wrapper.getEmptyString = function() {
            return this.component.getEmptyString();
        };
        wrapper.setEmptyString = function(str) {
            this.component.setEmptyString(str);
        };
        wrapper.getAuthkey = function() {
            return this.component.getAuthkey();
        };
        wrapper.setAuthkey = function(key) {
            this.component.setAuthkey(key);
        };
        wrapper.getUploadURL = function() {
            return this.component.getUploadURL();
        };
        wrapper.setUploadURL = function(url) {
            this.component.setUploadURL(url);
        };
        wrapper.getUploadMode = function() {
            return this.component.getUploadMode();
        };
        wrapper.setUploadMode = function(mode) {
            this.component.setUploadMode(mode);
        };
        wrapper.setUploadBlockSize = function(size) {
            this.component.setUploadBlockSize(size);
        };
        wrapper.enableResumingUpload = function(enable) {
            if (this.mode == "multi") this.component.enableResumingUpload(enable);
            else if (this.mode == "ie") throwIENotSupportedError();
        };
        wrapper.openFileDialog = function() {
            if (this.mode == "multi") {
                this.component.openFileDialog();
                return true;
            } else if (this.mode == "ie") {
                return this.component.openFileDialog();
            }
        };
        wrapper.openFolderDialog = function() {
            if (this.mode == "multi") {
                throwMultiNotSupportedError();
            } else if (this.mode == "ie") {
                return this.component.openFolderDialog();
            }
        };
        wrapper.addFileList = function(list) {
            if (this.mode == "multi") this.component.addFileList(list);
            else if (this.mode == "ie") throwIENotSupportedError();
        };
        wrapper.addEntriesForChrome = function(list) {
            if (this.mode == "multi") this.component.addEntriesForChrome(list);
            else if (this.mode == "ie") throwIENotSupportedError();
        };
        wrapper.addVirtualFile = function(vf) {
            if (this.mode == "multi") this.component.addVirtualFile(vf);
            else if (this.mode == "ie") this.component.addVirtualFile(vf.vindex || "", vf.name || "", vf.url || "", vf.folder || "", vf.size || -1, vf.lock || false, vf.checked || false, vf.eventUriStart || "", vf.eventUriStop || "", vf.eventUriEnd || "", vf.chunkSize || -1, vf.hdTitle || "");
        };
        wrapper.addVirtualFileList = function(vfs) {
            if (this.mode == "multi") this.component.addVirtualFileList(vfs);
            else if (this.mode == "ie") {
                for (var i = 0, len = vfs.length; i < len; i++) {
                    this.addVirtualFile(vfs[i]);
                }
            }
        };
        wrapper.getEnableDnd = function() {
            if (this.mode == "multi") return this.component.getEnableDnd();
            else if (this.mode == "ie") return this.component.getEnableDragDrop();
        };
        wrapper.setEnableDnd = function(enable) {
            if (this.mode == "multi") this.component.setEnableDnd(enable);
            else if (this.mode == "ie") this.component.setEnableDragDrop(enable);
        };
        wrapper.setFilterSilence = function(enable) {
            if (this.mode == "multi") this.component.setFilterSilence(enable);
            else if (this.mode == "ie") this.component.setLimitCheckInSilence(enable);
        };
        wrapper.getMaxFileCount = function() {
            return this.component.getMaxFileCount();
        };
        wrapper.setMaxFileCount = function(count, withVF) {
            this.component.setMaxFileCount(count, withVF);
        };
        wrapper.getMinFileSize = function() {
            if (this.mode == "multi") return this.component.getMinFileSize();
            else if (this.mode == "ie") {
                var isIE8 = (win.dx5.browser.isIE == true && navigator.userAgent.indexOf("MSIE 8.0") >= 0);
                return isIE8 ? parseInt(this.component.getMaxFileSizeMinStr(), 10) : this.component.getMaxFileSizeMin();
            }
        };
        wrapper.setMinFileSize = function(size) {
            if (this.mode == "multi") this.component.setMinFileSize(size);
            else if (this.mode == "ie") this.component.setMaxFileSizeMin(size);
        };
        wrapper.getMaxFileSize = function() {
            if (this.mode == "multi") return this.component.getMaxFileSize();
            else if (this.mode == "ie") {
                var isIE8 = (win.dx5.browser.isIE == true && navigator.userAgent.indexOf("MSIE 8.0") >= 0);
                return isIE8 ? parseInt(this.component.getMaxFileSizeMaxStr(), 10) : this.component.getMaxFileSizeMax();
            }
        };
        wrapper.setMaxFileSize = function(size) {
            if (this.mode == "multi") this.component.setMaxFileSize(size);
            else if (this.mode == "ie") this.component.setMaxFileSizeMax(size);
        };
        wrapper.getMaxTotalSize = function() {
            if (this.mode == "multi") return this.component.getMaxTotalSize();
            else if (this.mode == "ie") {
                var isIE8 = (win.dx5.browser.isIE == true && navigator.userAgent.indexOf("MSIE 8.0") >= 0);
                return isIE8 ? parseInt(this.component.getMaxTotalSizeStr(), 10) : this.component.getMaxTotalSize();
            }
        };
        wrapper.setMaxTotalSize = function(tsize, withVF) {
            this.component.setMaxTotalSize(tsize, withVF);
        };
        wrapper.getExtensionFilter = function(reverse) {
            if (this.mode == "multi") return this.component.getExtentionFilter(reverse);
            else if (this.mode == "ie") return (reverse === true) ? this.component.getFilterBlack() : this.component.getFilterWhite();
        };
        wrapper.setExtensionFilter = function(filterString, reverse) {
            if (this.mode == "multi") this.component.setExtentionFilter(filterString, reverse === true);
            else if (this.mode == "ie") {
                if (reverse === true) this.component.setFilterBlack(filterString);
                else this.component.setFilterWhite(filterString);
            }
        };
        wrapper.isAllowNoExtension = function() {
            if (this.mode == "multi") return this.component.isAllowNoExtension();
            else if (this.mode == "ie") return this.component.getAllowNoExtension();
        };
        wrapper.setAllowNoExtension = function(allow) {
            this.component.setAllowNoExtension(allow);
        };
        wrapper.clearItems = function(flag) {
            this.component.clearItems(flag);
        };
        wrapper.getTotalItemCount = function(onlyLocal) {
            return this.component.getTotalItemCount(onlyLocal);
        };
        wrapper.getTotalFileSize = function(onlyLocal) {
            if (this.mode == "multi") return this.component.getTotalFileSize(onlyLocal);
            else if (this.mode == "ie") {
                var isIE8 = (win.dx5.browser.isIE == true && navigator.userAgent.indexOf("MSIE 8.0") >= 0);
                return isIE8 ? parseInt(this.component.getTotalFileSizeStr(onlyLocal), 10) : this.component.getTotalFileSize(onlyLocal);
            }
        };
        wrapper.setUploadableFilesFrom = function(dx) {
            if (!dx || !dx.getItems) return;
            var localOriginFiles;
            if (this.mode == "multi") localOriginFiles = dx.getItems(true, true);
            else if (this.mode == "ie") localOriginFiles = dx.component.getItems(true);
            if (!localOriginFiles || localOriginFiles.length == 0) return;
            this.component.addItems(localOriginFiles);
        };
        wrapper.setUploableFilesFrom = function(dx) {
            this.setUploadableFilesFrom(dx);
        };
        wrapper.getSelectedItems = function(onlyLocal) {
            if (this.mode == "multi") return this.component.getSelectedItems(onlyLocal);
            else if (this.mode == "ie") {
                var arr = [],
                    items = this.component.getSelectedItems(onlyLocal);
                for (var i = 0, len = items.length, t = null; i < len; i++) {
                    t = items.Item(i);
                    if (onlyLocal === true && t.type == "VIRTUAL") continue;
                    else arr.push(wrapItemForAX(t));
                }
                return arr;
            }
        };
        wrapper.getItemIds = function(onlyLocal) {
            if (this.mode == "multi") return this.component.getItemIds(onlyLocal);
            else if (this.mode == "ie") {
                var arr = [],
                    items = this.component.getItemIds(onlyLocal);
                for (var i = 0, len = items.length, t = null; i < len; i++) {
                    t = items.Item(i);
                    if (onlyLocal === true && t.type == "VIRTUAL") continue;
                    else arr.push(t);
                }
                return arr;
            }
        };
        wrapper.getSelectedItemIds = function(onlyLocal) {
            if (this.mode == "multi") return this.component.getSelectedItemIds(onlyLocal);
            else if (this.mode == "ie") {
                var arr = [],
                    items = this.component.getSelectedItemIds(onlyLocal);
                for (var i = 0, len = items.length; i < len; i++) {
                    arr.push(items.Item(i));
                }
                return arr;
            }
        };
        wrapper.getSelectedIndices = function(onlyLocal) {
            if (this.mode == "multi") return this.component.getSelectedIndices(onlyLocal);
            else if (this.mode == "ie") {
                var arr = [],
                    items = this.component.getSelectedIndices(onlyLocal);
                for (var i = 0, len = items.length; i < len; i++) {
                    arr.push(items.Item(i));
                }
                return arr;
            }
        };
        wrapper.getSelectedCount = function(onlyLocal) {
            if (this.mode == "multi") return this.component.getSelectedIndices(onlyLocal).length;
            else if (this.mode == "ie") return this.component.getSelectedCount(onlyLocal);
        };
        wrapper.getItemById = function(id) {
            if (this.mode == "multi") return this.component.getItemById(id);
            else if (this.mode == "ie") return wrapItemForAX(this.component.getItemById(id));
        };
        wrapper.getItemByIndex = function(index) {
            if (this.mode == "multi") return this.component.getItemByIndex(index);
            else if (this.mode == "ie") return wrapItemForAX(this.component.getItemByIndex(index));
        };
        wrapper.getTotalRemovedFileCount = function() {
            return this.component.getTotalRemovedFileCount();
        };
        wrapper.getTotalRemovedFileSize = function() {
            if (this.mode == "multi") return this.component.getTotalRemovedFileSize();
            else if (this.mode == "ie") {
                var isIE8 = (win.dx5.browser.isIE == true && navigator.userAgent.indexOf("MSIE 8.0") >= 0);
                return isIE8 ? parseInt(this.component.getTotalRemovedFileSizeStr(), 10) : this.component.getTotalRemovedFileSize();
            }
        };
        wrapper.getRemovedFileIds = function() {
            return this.component.getRemovedFileIds();
        };
        wrapper.getRemovedFiles = function() {
            if (this.mode == "multi") return this.component.getRemovedFiles();
            else if (this.mode == "ie") {
                var arr = [],
                    items = this.component.getRemovedFiles();
                for (var i = 0, len = items.length; i < len; i++) {
                    arr.push(wrapItemForAX(items.Item(i)));
                }
                return arr;
            }
        };
        wrapper.getRemovedFileById = function(id) {
            if (this.mode == "multi") return this.component.getRemovedFileById(id);
            else if (this.mode == "ie") return wrapItemForAX(this.component.getRemovedFileById(id));
        };
        wrapper.removeById = function(id, perma, fireEvent) {
            if (this.mode == "multi") return this.component.removeById(id, perma, fireEvent);
            else if (this.mode == "ie") return this.component.removeById(id, perma);
        };
        wrapper.removeByIndex = function(index, perma, fireEvent) {
            if (this.mode == "multi") return this.component.removeByIndex(index, perma, fireEvent);
            else if (this.mode == "ie") return this.component.removeByIndex(index, perma);
        };
        wrapper.removeSelected = function(perma, fireEvent) {
            if (this.mode == "multi") return this.component.removeSelected(perma, fireEvent);
            else if (this.mode == "ie") return this.component.removeSelected(perma);
        };
        wrapper.removeAll = function(perma, fireEvent) {
            if (this.mode == "multi") return this.component.removeAll(perma, fireEvent);
            else if (this.mode == "ie") return this.component.removeAll(perma);
        };
        wrapper.removeChecked = function(perma, fireEvent) {
            if (this.mode == "multi") return this.component.removeChecked(perma, fireEvent);
            else if (this.mode == "ie") return this.component.removeChecked(perma);
        };
        wrapper.purgeRemovedVirtual = function(id) {
            this.component.purgeRemovedVirtual(id);
        };
        wrapper.revokeVirtualFile = function(id) {
            return this.component.revokeVirtualFile(id);
        };
        wrapper.revokeAllVirtualFiles = function() {
            return this.component.revokeAllVirtualFiles();
        };
        wrapper.checkAll = function(allOrNot) {
            this.component.checkAll(allOrNot);
        };
        wrapper.checkById = function(id, checked) {
            this.component.checkById(id, checked);
        };
        wrapper.checkByIndex = function(index, checked) {
            this.component.checkByIndex(index, checked);
        };
        wrapper.changeStatus = function(id, status) {
            this.component.changeStatus(id, status);
        };
        wrapper.checkDuplication = function(enable) {
            if (this.mode == "multi") this.component.checkDuplication(enable);
            else if (this.mode == "ie") this.component.setPermitDuplicateItem(enable);
        };
        wrapper.getMetaDataById = function(id, name) {
            return this.component.getMetaDataById(id, name);
        };
        wrapper.getMetaDataByIndex = function(index, name) {
            return this.component.getMetaDataByIndex(index, name);
        };
        wrapper.setMetaDataById = function(id, name, value) {
            return this.component.setMetaDataById(id, name, value);
        };
        wrapper.setMetaDataByIndex = function(index, name, value) {
            return this.component.setMetaDataByIndex(index, name, value);
        };
        wrapper.deleteMetaDataById = function(id, name) {
            return this.component.deleteMetaDataById(id, name);
        };
        wrapper.deleteMetaDataByIndex = function(index, name) {
            return this.component.deleteMetaDataByIndex(index, name);
        };
        wrapper.getResponses = function(index) {
            if (this.mode == "multi") return this.component.getResponse(index);
            else if (this.mode == "ie") {
                var arr = [],
                    res = this.component.getResponses();
                if (typeof(index) != "undefined") {
                    if (index >= 0 && index < res.length) {
                        return res.Item(index);
                    } else if (win.onDX5Error) {
                        win.onDX5Error(this.domObject.id, "EJS-0001", "The index of the responses is out of range.");
                        return undefined;
                    }
                } else {
                    for (var i = 0, len = res.length; i < len; i++) {
                        arr.push(res.Item(i));
                    }
                    return arr;
                }
            }
        };
        wrapper.getUploadStatus = function() {
            if (this.mode == "multi") return this.component.getUploadStatus();
            else if (this.mode == "ie") {
                var status = this.component.getUploadStatus();
                var isIE8 = (win.dx5.browser.isIE == true && navigator.userAgent.indexOf("MSIE 8.0") >= 0);
                return {
                    totalSize: (isIE8 ? parseInt(status.getTotalSizeStr(), 10) : status.getTotalSize()),
                    totalCount: status.getTotalCount(),
                    totalSendSize: (isIE8 ? parseInt(status.getTotalSendSizeStr(), 10) : status.getTotalSendSize()),
                    completeCount: status.getCompleteCount(),
                    currentName: status.getCurName(),
                    currentSize: (isIE8 ? parseInt(status.getCurSizeStr(), 10) : status.getCurSize()),
                    currentSendSize: (isIE8 ? parseInt(status.getCurSendSizeStr(), 10) : status.getCurSendSize()),
                    totalRate: status.getTotalRate(),
                    totalSpeed: status.getSpeed(),
                    currentRate: status.getCurRate(),
                    currentSpeed: status.getSpeed(),
                    totalTime: status.getTotalTime(),
                    currentTime: status.getCurTime(),
                    remainedTotalTime: status.getTotalRemainTime(),
                    remainedCurrentTime: status.getCurRemainTime()
                };
            }
        };
        wrapper.hasUploadableItems = function() {
            return this.component.hasUploadableItems();
        };
        wrapper.upload = function(flag) {
            if (this.mode == "multi") this.component.upload(flag);
            else if (this.mode == "ie") this.component.uploadStart(flag);
        };
        wrapper.stopUploading = function() {
            if (this.mode == "multi") this.component.stopUploading();
            else if (this.mode == "ie") this.component.uploadStop();
        };
        wrapper.downloadById = function(id) {
            if (this.mode == "multi") this.component.downloadById(id);
            else if (this.mode == "ie") return this.component.downloadStartById(id);
        };
        wrapper.download = function(flag, useMD) {
            if (this.mode == "multi") this.component.download(flag, useMD);
            else if (this.mode == "ie") return this.component.downloadStart(flag);
        };
        wrapper.stopDownloading = function() {
            if (this.mode == "multi") this.component.stopDownloading();
            else if (this.mode == "ie") this.component.downloadStop();
        };
        wrapper.getFileDialogTitle = function() {
            if (this.mode == "multi") throwMultiNotSupportedError();
            else if (this.mode == "ie") return this.component.getFileDialogTitle();
        };
        wrapper.setFileDialogTitle = function(title) {
            if (this.mode == "multi") throwMultiNotSupportedError();
            else if (this.mode == "ie") this.component.setFileDialogTitle(title);
        };
        wrapper.getFolderDialogTitle = function() {
            if (this.mode == "multi") throwMultiNotSupportedError();
            else if (this.mode == "ie") return this.component.getFolderDialogTitle();
        };
        wrapper.setFolderDialogTitle = function(title) {
            if (this.mode == "multi") throwMultiNotSupportedError();
            else if (this.mode == "ie") this.component.setFolderDialogTitle(title);
        };
        wrapper.selectAll = function() {
            this.component.selectAll();
        };
        wrapper.unselectAll = function() {
            this.component.unselectAll();
        };
        wrapper.selectByIndex = function(index) {
            this.component.selectByIndex(index);
        };
        wrapper.unselectByIndex = function(index) {
            this.component.unselectByIndex(index);
        };
        wrapper.isSelectedByIndex = function(index) {
            if (this.mode == "multi") return this.component.isSelectedByIndex(index);
            else if (this.mode == "ie") return this.component.isSelectedItem(index);
        };
        wrapper.getEnableColumnSorting = function() {
            if (this.mode == "multi") return this.component.getEnableColumnSorting();
            else if (this.mode == "ie") return this.component.getEnableSortColumn();
        };
        wrapper.setEnableColumnSorting = function(enable) {
            if (this.mode == "multi") this.component.setEnableColumnSorting(enable);
            else if (this.mode == "ie") this.component.setEnableSortColumn(enable);
        };
        wrapper.setSortPriorityVirtualFile = function(enable) {
            this.component.setSortPriorityVirtualFile(enable);
        };
        wrapper.getAutoSortingType = function() {
            if (this.mode == "multi") return this.component.getAutoSortingType();
            else if (this.mode == "ie") return this.component.getAutoSortType();
        };
        wrapper.setAutoSortingType = function(stype) {
            if (this.mode == "multi") this.component.setAutoSortingType(stype);
            else if (this.mode == "ie") this.component.setAutoSortType(stype);
        };
        wrapper.sortColumnIndex = function(index, ascending) {
            if (this.mode == "multi") this.component.sortItems(index, ascending);
            else if (this.mode == "ie") this.component.sortIndexColumn(index, ascending);
        };
        wrapper.moveItemUp = function(index) {
            if (this.mode == "multi") this.component.moveItemUp(index);
            else if (this.mode == "ie") this.component.moveUp(index);
        };
        wrapper.moveItemDown = function(index) {
            if (this.mode == "multi") this.component.moveItemDown(index);
            else if (this.mode == "ie") this.component.moveDown(index);
        };
        wrapper.getDownloadStatus = function() {
            if (this.mode == "multi") {
                return this.component.getDownloadStatus();
            } else if (this.mode == "ie") {
                var status = this.component.getDownloadStatus();
                var isIE8 = (win.dx5.browser.isIE == true && navigator.userAgent.indexOf("MSIE 8.0") >= 0);
                return {
                    totalSize: (isIE8 ? parseInt(status.getTotalSizeStr(), 10) : status.getTotalSize()),
                    totalCount: status.getTotalCount(),
                    totalReceiveSize: (isIE8 ? parseInt(status.getTotalRecvSizeStr(), 10) : status.getTotalRecvSize()),
                    completeCount: status.getCompleteCount(),
                    currentName: status.getCurName(),
                    currentSize: (isIE8 ? parseInt(status.getCurSizeStr(), 10) : status.getCurSize()),
                    currentReceiveSize: (isIE8 ? parseInt(status.getCurRecvSizeStr(), 10) : status.getCurRecvSize()),
                    totalRate: status.getTotalRate(),
                    totalSpeed: status.getSpeed(),
                    currentRate: status.getCurRate(),
                    currentSpeed: status.getSpeed(),
                    totalTime: status.getTotalTime(),
                    currentTime: status.getCurTime(),
                    remainedTotalTime: status.getTotalRemainTime(),
                    remainedCurrentTime: status.getCurRemainTime()
                };
            }
        };
        wrapper.getCommonFolderPath = function(title) {
            if (this.mode == "multi") throwMultiNotSupportedError();
            else if (this.mode == "ie") return this.component.showSelectFolderPathDlg(title);
        };
        wrapper.getTotalLocalFileCount = function() {
            if (this.mode == "multi") return this.component.getTotalItemCount(true);
            else if (this.mode == "ie") return this.component.getItemCountFile();
        };
        wrapper.getTotalLocalFolderCount = function() {
            if (this.mode == "multi") throwMultiNotSupportedError();
            else if (this.mode == "ie") return this.component.getItemCountFolder();
        };
        wrapper.getTotalVirtualFileCount = function() {
            if (this.mode == "multi") return this.component.getTotalItemCount() - this.component.getTotalItemCount(true);
            else if (this.mode == "ie") return this.component.getItemCountVirtual();
        };
        wrapper.openDownloadPathDialog = function() {
            if (this.mode == "multi") throwMultiNotSupportedError();
            else if (this.mode == "ie") return this.component.setDownloadPathByDialog();
        };
        wrapper.exploreDownloadPath = function() {
            if (this.mode == "multi") throwMultiNotSupportedError();
            else if (this.mode == "ie") this.component.exploreDownloadPath();
        };
        wrapper.getDownloadPath = function() {
            if (this.mode == "multi") throwMultiNotSupportedError();
            else if (this.mode == "ie") return this.component.getDownloadPath();
        };
        wrapper.setDownloadPath = function(path) {
            if (this.mode == "multi") throwMultiNotSupportedError();
            else if (this.mode == "ie") return this.component.setDownloadPath(path);
        };
        wrapper.getOverwriteMode = function() {
            if (this.mode == "multi") throwMultiNotSupportedError();
            else if (this.mode == "ie") return this.component.getOverWriteMode();
        };
        wrapper.setOverwriteMode = function(mode) {
            if (this.mode == "multi") throwMultiNotSupportedError();
            else if (this.mode == "ie") return this.component.setOverWriteMode(mode);
        };
        wrapper.setDownloadPostData = function(index, data) {
            if (this.mode == "multi") throwMultiNotSupportedError();
            else if (this.mode == "ie") return this.component.setDownloadPostSendData(index, data);
        };
        wrapper.getLimitNetSpeed = function() {
            if (this.mode == "multi") throwMultiNotSupportedError();
            else if (this.mode == "ie") return this.component.getNetSpeedLimit();
        };
        wrapper.setLimitNetSpeed = function(limit) {
            if (this.mode == "multi") throwMultiNotSupportedError();
            else if (this.mode == "ie") this.component.setNetSpeedLimit(limit);
        };
        wrapper.getCompressType = function() {
            if (this.mode == "multi") throwMultiNotSupportedError();
            else if (this.mode == "ie") return this.component.getCompressType().toLowerCase();
        };
        wrapper.setCompressType = function(ctype) {
            if (this.mode == "multi") throwMultiNotSupportedError();
            else if (this.mode == "ie") this.component.setCompressType(ctype.toLowerCase());
        };
        wrapper.getCompressDialogTitle = function() {
            if (this.mode == "multi") throwMultiNotSupportedError();
            else if (this.mode == "ie") return this.component.getCompressDlgTitle();
        };
        wrapper.setCompressDialogTitle = function(title) {
            if (this.mode == "multi") throwMultiNotSupportedError();
            else if (this.mode == "ie") this.component.setCompressDlgTitle(title);
        };
        wrapper.getCompressFileName = function() {
            if (this.mode == "multi") throwMultiNotSupportedError();
            else if (this.mode == "ie") return this.component.getCompressSaveTitle();
        };
        wrapper.setCompressFileName = function(title) {
            if (this.mode == "multi") throwMultiNotSupportedError();
            else if (this.mode == "ie") this.component.setCompressSaveTitle(title);
        };
        wrapper.getCompressSavePath = function() {
            if (this.mode == "multi") throwMultiNotSupportedError();
            else if (this.mode == "ie") return this.component.getCompressSavePath();
        };
        wrapper.setCompressSavePath = function(path) {
            if (this.mode == "multi") throwMultiNotSupportedError();
            else if (this.mode == "ie") this.component.setCompressSavePath(path);
        };
        wrapper.isCompressAutoInserting = function() {
            if (this.mode == "multi") throwMultiNotSupportedError();
            else if (this.mode == "ie") return this.component.getAutoInsertAfterCompress();
        };
        wrapper.setCompressAutoInserting = function(isAuto) {
            if (this.mode == "multi") throwMultiNotSupportedError();
            else if (this.mode == "ie") this.component.setAutoInsertAfterCompress(isAuto);
        };
        wrapper.isCompressEnsuringFile = function() {
            if (this.mode == "multi") throwMultiNotSupportedError();
            else if (this.mode == "ie") return this.component.getEnsureCompressFile();
        };
        wrapper.setCompressEnsuringFile = function(ensure) {
            if (this.mode == "multi") throwMultiNotSupportedError();
            else if (this.mode == "ie") this.component.setEnsureCompressFile(ensure);
        };
        wrapper.isCompressAutoDeleting = function() {
            if (this.mode == "multi") throwMultiNotSupportedError();
            else if (this.mode == "ie") return this.component.getAutoDeleteCompressFile();
        };
        wrapper.setCompressAutoDeleting = function(isAuto) {
            if (this.mode == "multi") throwMultiNotSupportedError();
            else if (this.mode == "ie") this.component.setAutoDeleteCompressFile(isAuto);
        };
        wrapper.compress = function(flag) {
            if (this.mode == "multi") throwMultiNotSupportedError();
            else if (this.mode == "ie") this.component.startCompress(flag);
        };
        wrapper.getEncryptionDialogTitle = function() {
            if (this.mode == "multi") throwMultiNotSupportedError();
            else if (this.mode == "ie") return this.component.getEncryptionDlgTitle();
        };
        wrapper.setEncryptionDialogTitle = function(title) {
            if (this.mode == "multi") throwMultiNotSupportedError();
            else if (this.mode == "ie") this.component.setEncryptionDlgTitle(title);
        };
        wrapper.getEncryptionSavePath = function() {
            if (this.mode == "multi") throwMultiNotSupportedError();
            else if (this.mode == "ie") return this.component.getEncryptionSavePath();
        };
        wrapper.setEncryptionSavePath = function(path) {
            if (this.mode == "multi") throwMultiNotSupportedError();
            else if (this.mode == "ie") this.component.setEncryptionSavePath(path);
        };
        wrapper.getEncryptionPrefix = function() {
            if (this.mode == "multi") throwMultiNotSupportedError();
            else if (this.mode == "ie") return this.component.getEncryptionPrefix();
        };
        wrapper.setEncryptionPrefix = function(prefix) {
            if (this.mode == "multi") throwMultiNotSupportedError();
            else if (this.mode == "ie") this.component.setEncryptionPrefix(prefix);
        };
        wrapper.isEncryptionAutoInserting = function() {
            if (this.mode == "multi") throwMultiNotSupportedError();
            else if (this.mode == "ie") return this.component.getAutoInsertAfterEncryption();
        };
        wrapper.setEncryptionAutoInserting = function(isAuto) {
            if (this.mode == "multi") throwMultiNotSupportedError();
            else if (this.mode == "ie") this.component.setAutoInsertAfterEncryption(isAuto);
        };
        wrapper.isEncryptionEnsuringFile = function() {
            if (this.mode == "multi") throwMultiNotSupportedError();
            else if (this.mode == "ie") return this.component.getEnsureEncryptionFile();
        };
        wrapper.setEncryptionEnsuringFile = function(ensure) {
            if (this.mode == "multi") throwMultiNotSupportedError();
            else if (this.mode == "ie") this.component.setEnsureEncryptionFile(ensure);
        };
        wrapper.isEncryptionAutoDeleting = function() {
            if (this.mode == "multi") throwMultiNotSupportedError();
            else if (this.mode == "ie") return this.component.getAutoDeleteEncryptionFile();
        };
        wrapper.setEncryptionAutoDeleting = function(isAuto) {
            if (this.mode == "multi") throwMultiNotSupportedError();
            else if (this.mode == "ie") this.component.setAutoDeleteEncryptionFile(isAuto);
        };
        wrapper.encrypt = function(flag) {
            if (this.mode == "multi") throwMultiNotSupportedError();
            else if (this.mode == "ie") this.component.startEncryption(flag);
        };
        wrapper.getDecryptionDialogTitle = function() {
            if (this.mode == "multi") throwMultiNotSupportedError();
            else if (this.mode == "ie") return this.component.getDecryptionDlgTitle();
        };
        wrapper.setDecryptionDialogTitle = function(title) {
            if (this.mode == "multi") throwMultiNotSupportedError();
            else if (this.mode == "ie") this.component.setDecryptionDlgTitle(title);
        };
        wrapper.getDecryptionSavePath = function() {
            if (this.mode == "multi") throwMultiNotSupportedError();
            else if (this.mode == "ie") return this.component.getDecryptionSavePath();
        };
        wrapper.setDecryptionSavePath = function(path) {
            if (this.mode == "multi") throwMultiNotSupportedError();
            else if (this.mode == "ie") this.component.setDecryptionSavePath(path);
        };
        wrapper.isDecryptionEnsuringFile = function() {
            if (this.mode == "multi") throwMultiNotSupportedError();
            else if (this.mode == "ie") return this.component.getEnsureDecryptionFile();
        };
        wrapper.setDecryptionEnsuringFile = function(ensure) {
            if (this.mode == "multi") throwMultiNotSupportedError();
            else if (this.mode == "ie") this.component.setEnsureDecryptionFile(ensure);
        };
        wrapper.decrypt = function(flag) {
            if (this.mode == "multi") throwMultiNotSupportedError();
            else if (this.mode == "ie") this.component.startDecryption(flag);
        };
        wrapper.isPreviewEnable = function() {
            if (this.mode == "multi") return this.component.isPreviewEnable();
            else if (this.mode == "ie") return this.component.getEnablePreview();
        };
        wrapper.setPreviewEnable = function(enable) {
            if (this.mode == "multi") this.component.setPreviewEnable(enable);
            else if (this.mode == "ie") this.component.setEnablePreview(enable);
        };
        wrapper.getPreviewMethod = function() {
            return this.component.getPreviewMethod();
        };
        wrapper.setPreviewMethod = function(method) {
            this.component.setPreviewMethod(method);
        };
        wrapper.preview = function(index) {
            if (this.mode == "multi") this.component.preview(index);
            else if (this.mode == "ie") this.component.previewItem(index);
        };
        wrapper.getPreviewBackgroundColor = function() {
            if (this.mode == "multi") return this.component.getPreviewBackgroundColor();
            else if (this.mode == "ie") return this.component.getPreviewBgcolor();
        };
        wrapper.setPreviewBackgroundColor = function(hexrgb) {
            if (this.mode == "multi") this.component.setPreviewBackgroundColor(hexrgb);
            else if (this.mode == "ie") this.component.setPreviewBgColor(hexrgb);
        };
        wrapper.isThumbnailAutoMaking = function() {
            if (this.mode == "multi") throwMultiNotSupportedError();
            else if (this.mode == "ie") return this.component.getEnableAutoMakeThumbnail();
        };
        wrapper.setThumbnailAutoMaking = function(enable) {
            if (this.mode == "multi") throwMultiNotSupportedError();
            else if (this.mode == "ie") this.component.setEnableAutoMakeThumbnail(enable);
        };
        wrapper.getThumbnailWidth = function() {
            if (this.mode == "multi") throwMultiNotSupportedError();
            else if (this.mode == "ie") return this.component.getThumbnailWidth();
        };
        wrapper.setThumbnailWidth = function(width) {
            if (this.mode == "multi") throwMultiNotSupportedError();
            else if (this.mode == "ie") this.component.setThumbnailWidth(width);
        };
        wrapper.getThumbnailHeight = function() {
            if (this.mode == "multi") throwMultiNotSupportedError();
            else if (this.mode == "ie") return this.component.getThumbnailHeight();
        };
        wrapper.setThumbnailHeight = function(height) {
            if (this.mode == "multi") throwMultiNotSupportedError();
            else if (this.mode == "ie") this.component.setThumbnailHeight(height);
        };
        wrapper.isThumbnailAspectRatio = function() {
            if (this.mode == "multi") throwMultiNotSupportedError();
            else if (this.mode == "ie") return this.component.getThumbnailAutoRatio();
        };
        wrapper.setThumbnailAspectRatio = function(enable) {
            if (this.mode == "multi") throwMultiNotSupportedError();
            else if (this.mode == "ie") this.component.setThumbnailAutoRatio(enable);
        };
        wrapper.isThumbnailAutoDeleting = function() {
            if (this.mode == "multi") throwMultiNotSupportedError();
            else if (this.mode == "ie") return this.component.getThumbnailAutoDelete();
        };
        wrapper.setThumbnailAutoDeleting = function(enable) {
            if (this.mode == "multi") throwMultiNotSupportedError();
            else if (this.mode == "ie") this.component.setThumbnailAutoDelete(enable);
        };
        wrapper.isThumbnailAutoRotating = function() {
            if (this.mode == "multi") throwMultiNotSupportedError();
            else if (this.mode == "ie") return this.component.getThumbnailAutoRotate();
        };
        wrapper.setThumbnailAutoRotating = function(enable) {
            if (this.mode == "multi") throwMultiNotSupportedError();
            else if (this.mode == "ie") this.component.setThumbnailAutoRotate(enable);
        };
        wrapper.getThumbnailSavePath = function() {
            if (this.mode == "multi") throwMultiNotSupportedError();
            else if (this.mode == "ie") return this.component.getThumbnailSavePath();
        };
        wrapper.setThumbnailSavePath = function(path) {
            if (this.mode == "multi") throwMultiNotSupportedError();
            else if (this.mode == "ie") return this.component.setThumbnailSavePath(path);
        };
        wrapper.getThumbnailPrefix = function() {
            if (this.mode == "multi") throwMultiNotSupportedError();
            else if (this.mode == "ie") return this.component.getThumbnailPrevTitle();
        };
        wrapper.setThumbnailPrefix = function(prefix) {
            if (this.mode == "multi") throwMultiNotSupportedError();
            else if (this.mode == "ie") return this.component.setThumbnailPrevTitle(prefix);
        };
        wrapper.getThumbnailFormat = function() {
            if (this.mode == "multi") throwMultiNotSupportedError();
            else if (this.mode == "ie") return this.component.getThumbnailImageExt();
        };
        wrapper.setThumbnailFormat = function(format) {
            if (this.mode == "multi") throwMultiNotSupportedError();
            else if (this.mode == "ie") return this.component.setThumbnailImageExt(format);
        };
        wrapper.getThumbnailProvider = function() {
            if (this.mode == "multi") throwMultiNotSupportedError();
            else if (this.mode == "ie") return this.component.getSupportThumbnailExtension();
        };
        wrapper.getTempPathByExecuting = function() {
            if (this.mode == "multi") throwMultiNotSupportedError();
            else if (this.mode == "ie") return this.component.getTempPathForExecute();
        };
        wrapper.setTempPathByExecuting = function(path) {
            if (this.mode == "multi") throwMultiNotSupportedError();
            else if (this.mode == "ie") return this.component.setTempPathForExecute(path);
        };
        wrapper.executeItem = function(index, origin, parameter) {
            if (this.mode == "multi") this.component.executeItem(index);
            else if (this.mode == "ie") this.component.executeItem(index, origin, parameter);
        };
        wrapper.getCheckedItems = function(onlyLocal) {
            var items = this.component.getCheckedItems(onlyLocal);
            if (this.mode == "multi") {
                return items;
            } else if (this.mode == "ie") {
                var arr = [];
                for (var i = 0, len = items.length; i < len; i++) {
                    arr.push(wrapItemForAX(items.Item(i)));
                }
                return arr;
            }
        };
        wrapper.getCheckedIds = function(onlyLocal) {
            var items = this.component.getCheckedIds(onlyLocal);
            if (this.mode == "multi") {
                return items;
            } else if (this.mode == "ie") {
                var arr = [];
                for (var i = 0, len = items.length; i < len; i++) {
                    arr.push(items.Item(i));
                }
                return arr;
            }
        };
        wrapper.getItemId = function(index) {
            return this.component.getItemId(index);
        };
        wrapper.getItemIndex = function(id) {
            return this.component.getItemIndex(id);
        };
        wrapper.lockById = function(id) {
            return this.component.lockById(id);
        };
        wrapper.lockByIndex = function(index) {
            return this.component.lockByIndex(index);
        };
        wrapper.unlockById = function(id) {
            return this.component.unlockById(id);
        };
        wrapper.unlockByIndex = function(index) {
            return this.component.unlockByIndex(index);
        };
        wrapper.isExtractingEXIF = function() {
            if (this.mode == "multi") throwMultiNotSupportedError();
            else if (this.mode == "ie") return this.component.getExtractEXIF();
        };
        wrapper.setExtractingEXIF = function(enable) {
            if (this.mode == "multi") throwMultiNotSupportedError();
            else if (this.mode == "ie") this.component.setExtractEXIF(enable);
        };
        wrapper.isUsingProgressDialog = function() {
            if (this.mode == "multi") return this.component.isUsingProgressDialog();
            else if (this.mode == "ie") throwIENotSupportedError();
        };
        wrapper.useProgressDialog = function(enable) {
            this.component.useProgressDialog(enable);
        };
        wrapper.getProgressType = function() {
            if (this.mode == "multi") throwMultiNotSupportedError();
            else if (this.mode == "ie") return this.component.getUpDownUIType();
        };
        wrapper.setProgressType = function(uitype) {
            if (this.mode == "multi") throwMultiNotSupportedError();
            else if (this.mode == "ie") this.component.setUpDownUIType(uitype);
        };
        if (wrapper.mode == "multi") setMultiAPIs(wrapper);
        else if (wrapper.mode == "ie") setIEAPIs(wrapper);
        if (wrapper.mode == "multi") {
            wrapper.getItems = function(onlyLocal, isOrigin) {
                return this.component.getItems(onlyLocal, isOrigin);
            };
            wrapper.changeToVirtualFile = function(id, openUrl, downUrl) {
                this.component.changeToVirtualFile(id, openUrl, downUrl);
            };
        } else if (wrapper.mode == "ie") {
            wrapper.getItems = function(flag) {
                var arr = [],
                    items = isDefined(flag) ? this.component.getItems(flag) : this.component.getItems(false);
                for (var i = 0, len = items.length; i < len; i++) {
                    arr.push(wrapItemForAX(items.Item(i)));
                }
                return arr;
            };
            wrapper.changeToVirtualFile = function(id, url) {
                this.component.changeToVirtualFile(id, url);
            };
        }
        wrapper.downloadByIdToHD = function(id, duplicated) {
            var item = this.getItemById(id);
            if (item) {
                if (item.type != "VIRTUAL") {
                    errorOut(this.domObject.id, "EHD-0002", "_가상 파일만 다운로드할 수 있습니다.");
                } else if (!item.downUrl) {
                    errorOut(this.domObject.id, "EHD-0002", "_경로(다운로드, 열기)가 정의되지 않았습니다.");
                } else {
                    downloadByHD(this, [item], duplicated);
                }
            }
        };
        wrapper.downloadToHD = function(flag, duplicated) {
            if (!isDefined(flag)) {
                flag = "AUTO";
            } else if (["AUTO", "CHECKED", "SELECTED"].indexOf(flag.toUpperCase()) == -1) {
                errorOut(this.domObject.id, "EHD-0002", "Choose one flag of 'AUTO, CHECKED, SELECTED.");
                return;
            } else {
                flag = flag.toUpperCase();
            }
            var temp = null;
            if (flag === "AUTO") temp = this.getItems();
            else if (flag === "CHECKED") temp = this.getCheckedItems();
            else if (flag === "SELECTED") temp = this.getSelectedItems();
            var arr = [];
            for (var i = 0, len = temp.length; i < len; i++) {
                if (temp[i].type && temp[i].type === "VIRTUAL" && (temp[i].downUrl || temp[i].url)) {
                    arr.push(temp[i]);
                }
            }
            if (arr.length == 0) {
                errorFromX5(this.domObject.id, 18, "There is no item for downloading.");
            } else {
                downloadByHD(this, arr, duplicated);
            }
        };
        wrapper.openDownloadPathDialogOfHD = function(success) {
            askDownPathOfHD(this, success);
        };
        wrapper.getDownloadPathOfHD = function(success) {
            getDownPathOfHD(this, success);
        };
        wrapper.setDownloadPathOfHD = function(path, success) {
            setDownPathOfHD(this, path, success);
        };
        wrapper.isUsingHDWhenSingle = function() {
            if (wrapper.mode == "multi") return this.component.isUsingHDWhenSingle();
            else if (wrapper.mode == "ie") throwIENotSupportedError();
        };
        wrapper.setUsingHDWhenSingle = function(enable) {
            if (wrapper.mode == "multi") this.component.setUsingHDWhenSingle(enable);
            else if (wrapper.mode == "ie") throwIENotSupportedError();
        };
        wrapper.getCustomHeader = function(name) {
            return this.component.getCustomHeader(name);
        };
        wrapper.setCustomHeader = function(name, value) {
            this.component.setCustomHeader(name, value);
        };
        wrapper.removeCustomHeader = function(name) {
            this.component.removeCustomHeader(name);
        };
        wrapper.getTotalCustomHeaders = function(separator) {
            if (typeof separator == "undefined") return this.component.getTotalCustomHeaders();
            else return this.component.getTotalCustomHeaders(separator);
        };
        wrapper.getWithCredentials = function() {
            if (this.mode == "multi") return this.component.getWithCredentials();
            else if (this.mode == "ie") throwIENotSupportedError();
        };
        wrapper.setWithCredentials = function(isWith) {
            if (this.mode == "multi") this.component.setWithCredentials(isWith);
            else if (this.mode == "ie") throwIENotSupportedError();
        };
        if (win.dextuploadx5Configuration && win.dextuploadx5Configuration.authkey) {
            wrapper.setAuthkey(win.dextuploadx5Configuration.authkey);
        } else {
            errorFromX5(wrapper.domObject.id, 10, "The product authkey is necessary.");
        }
    }

    function setMultiAPIs(t) {
        t.changeLocalFileById = function() {
            throwMultiNotSupportedError();
        };
        t.changeLocalFileByIndex = function() {
            throwMultiNotSupportedError();
        };
        t.getSupportClipboard = function() {
            throwMultiNotSupportedError();
        };
        t.setSupportClipboard = function() {
            throwMultiNotSupportedError();
        };
        t.getAutoDeleteClipboardFile = function() {
            throwMultiNotSupportedError();
        };
        t.setAutoDeleteClipboardFile = function() {
            throwMultiNotSupportedError();
        };
        t.getClipboardFilePrefix = function() {
            throwMultiNotSupportedError();
        };
        t.setClipboardFilePrefix = function() {
            throwMultiNotSupportedError();
        };
        t.getTempPathForClipboard = function() {
            throwMultiNotSupportedError();
        };
        t.setTempPathForClipboard = function() {
            throwMultiNotSupportedError();
        };
        t.getSupportPHP = function() {
            return this.component.getSupportPHP();
        };
        t.setSupportPHP = function(enable) {
            this.component.setSupportPHP(enable);
        };
        t.isFolderDeletionWithSubItems = function() {
            throwMultiNotSupportedError();
        };
        t.setFolderDeletionWithSubItems = function() {
            throwMultiNotSupportedError();
        };
        t.isEnableUseProfile = function() {
            throwMultiNotSupportedError();
        };
        t.setEnableUseProfile = function() {
            throwMultiNotSupportedError();
        };
        t.setLimitMultiDownloadSize = function(size) {
            this.component.setLimitMultiDownloadSize(size);
        };
        t.updateUI = function() {
            this.component.updateUI();
        };
        t.getCompressURL = function() {
            return this.component.getCompressURL();
        };
        t.setCompressURL = function(url) {
            this.component.setCompressURL(url);
        };
        t.downloadCompressed = function(flag) {
            this.component.downloadCompressed(flag);
        };
        t.stopCompressWaiting = function() {
            this.component.stopCompressWaiting();
        };
        t.setBorderVisible = function(visible) {
            this.component.setBorderVisible(visible);
        };
        t.setGridLineVisible = function(visible) {
            this.component.setGridLineVisible(visible);
        };
        t.setItemHeight = function(height) {
            return this.component.setItemHeight(height);
        };
        t.setHeaderHeight = function(height) {
            return this.component.setHeaderHeight(height);
        };
        t.setBackgroundColor = function(hexrgb) {
            this.component.setBackgroundColor(hexrgb);
        };
        t.setGridLineColor = function(hexrgb) {
            this.component.setGridLineColor(hexrgb);
        };
        t.setHeaderVisible = function(visible) {
            this.component.setHeaderVisible(visible);
        };
        t.setStatusBarVisible = function(visible) {
            this.component.setStatusBarVisible(visible);
        };
        t.setCheckerVisible = function(visible) {
            this.component.setCheckerVisible(visible);
        };
        t.setHeaderSolidColor = function(hexrgb) {
            this.component.setHeaderSolidColor(hexrgb);
        };
        t.setStatusBarSolidColor = function(hexrgb) {
            this.component.setStatusBarSolidColor(hexrgb);
        };
        t.setHeaderGradient = function(di, sc, ec) {
            this.component.setHeaderGradient(di, sc, ec);
        };
        t.setBackgroundImage = function(url, w, h) {
            this.component.setBackgroundImage(url, w, h);
        };
        t.setHeaderFontName = function(font) {
            this.component.setHeaderFontName(font);
        };
        t.setHeaderFontColor = function(hexrgb) {
            this.component.setHeaderFontColor(hexrgb);
        };
        t.setItemFontName = function(font) {
            this.component.setItemFontName(font);
        };
        t.setItemFontColor = function(hexrgb) {
            this.component.setItemFontColor(hexrgb);
        };
        t.setStatusBarFontName = function(font) {
            this.component.setStatusBarFontName(font);
        };
        t.setStatusBarFontColor = function(hexrgb) {
            this.component.setStatusBarFontColor(hexrgb);
        };
        t.setTileColumnCount = function(count) {
            this.component.setTileColumnCount(count);
        };
        t.setDownloadButtonVisible = function(visible) {
            this.component.setDownloadButtonVisible(visible);
        };
        t.setOpenButtonVisible = function(visible) {
            this.component.setOpenButtonVisible(visible);
        };
        t.setItemBackColor = function(hexrgb) {
            this.component.setItemBackColor(hexrgb);
        };
        t.setBorderColor = function(hexrgb) {
            this.component.setBorderColor(hexrgb);
        };
        t.setHeaderLineColor = function(hexrgb) {
            this.component.setHeaderLineColor(hexrgb);
        };
        t.setColumnLineColor = function(hexrgb) {
            this.component.setColumnLineColor(hexrgb);
        };
        t.setStatusBarLineColor = function(hexrgb) {
            this.component.setStatusBarLineColor(hexrgb);
        };
        t.setFilterVisible = function(visible) {
            this.component.setFilterVisible(visible);
        };
        t.setSizeColumnVisible = function(visible) {
            this.component.setSizeColumnVisible(visible);
        };
        t.setUIStyle = function(style) {
            if (!style) return;
            if (isDefined(style.headerVisible)) this.setHeaderVisible(style.headerVisible === true);
            if (isDefined(style.statusBarVisible)) this.setStatusBarVisible(style.statusBarVisible === true);
            if (isDefined(style.checkerVisible)) this.setCheckerVisible(style.checkerVisible === true);
            if (isDefined(style.headerSolidColor)) this.setHeaderSolidColor(style.headerSolidColor);
            if (isDefined(style.statusBarSolidColor)) this.setStatusBarSolidColor(style.statusBarSolidColor);
            if (isDefined(style.headerGradient)) {
                var gradient = style.headerGradient.split(" "),
                    font, sc, ec;
                if (gradient.length >= 1) di = gradient[0];
                if (gradient.length >= 2) sc = gradient[1];
                if (gradient.length >= 3) ec = gradient[2];
                this.setHeaderGradient(di, sc, ec);
            }
            if (isDefined(style.headerFontName)) this.setHeaderFontName(style.headerFontName);
            if (isDefined(style.headerFontColor)) this.setHeaderFontColor(style.headerFontColor);
            if (isDefined(style.itemFontName)) this.setItemFontName(style.itemFontName);
            if (isDefined(style.itemFontColor)) this.setItemFontColor(style.itemFontColor);
            if (isDefined(style.statusBarFontName)) this.setStatusBarFontName(style.statusBarFontName);
            if (isDefined(style.statusBarFontColor)) this.setStatusBarFontColor(style.statusBarFontColor);
            if (isDefined(style.headerHeight)) this.setHeaderHeight(style.headerHeight);
            if (isDefined(style.borderVisible)) this.setBorderVisible(style.borderVisible === true);
            if (isDefined(style.itemHeight)) this.setItemHeight(style.itemHeight);
            if (isDefined(style.backgroundColor)) this.setBackgroundColor(style.backgroundColor);
            if (isDefined(style.backgroundImage)) {
                var background = style.backgroundImage.split(" "),
                    url, w, h;
                url = background[0];
                if (background.length == 1) w = h = 0;
                if (background.length == 2) w = h = parseInt(background[1], 10);
                if (background.length >= 3) w = parseInt(background[1], 10), h = parseInt(background[2], 10);
                this.setBackgroundImage(url, w, h);
            }
            if (isDefined(style.tileColumnCount)) this.setTileColumnCount(style.tileColumnCount);
            if (isDefined(style.downloadButtonVisible)) this.setDownloadButtonVisible(style.downloadButtonVisible);
            if (isDefined(style.openButtonVisible)) this.setOpenButtonVisible(style.openButtonVisible);
            if (isDefined(style.borderColor)) this.setBorderColor(style.borderColor);
            if (isDefined(style.itemBackColor)) this.setItemBackColor(style.itemBackColor);
            if (isDefined(style.gridLineColor)) this.setGridLineColor(style.gridLineColor);
            if (isDefined(style.gridLineVisible)) this.setGridLineVisible(style.gridLineVisible);
            if (isDefined(style.headerLineColor)) this.setHeaderLineColor(style.headerLineColor);
            if (isDefined(style.columnLineColor)) this.setColumnLineColor(style.columnLineColor);
            if (isDefined(style.statusBarLineColor)) this.setStatusBarLineColor(style.statusBarLineColor);
            if (isDefined(style.filterVisible)) this.setFilterVisible(style.filterVisible);
            if (isDefined(style.sizeColumnVisible)) this.setSizeColumnVisible(style.sizeColumnVisible);
        };
    }

    function wrapItemForAX(origin) {
        if (!origin) return undefined;
        var isIE8 = (win.dx5.browser.isIE == true && navigator.userAgent.indexOf("MSIE 8.0") >= 0);
        var ctime = null,
            mtime = null;
        if (isIE8) {
            ctime = new Date();
            ctime.setTime(parseInt(origin.cdateStr, 10));
            mtime = new Date();
            mtime.setTime(parseInt(origin.mdateStr, 10));
        }
        return {
            controlId: origin.controlId,
            id: origin.id,
            vindex: origin.vindex,
            type: origin.type,
            name: origin.name,
            ext: origin.ext,
            url: origin.url,
            lock: origin.lock,
            size: isIE8 ? parseInt(origin.sizeStr, 10) : origin.size,
            cdate: isIE8 ? ctime : origin.cdate,
            mdate: isIE8 ? mtime : origin.mdate,
            status: origin.status,
            eventUriStart: origin.eventUriStart,
            eventUriStop: origin.eventUriStop,
            eventUriEnd: origin.eventUriEnd,
            path: origin.path,
            middlePath: origin.middlePath,
            imageWidth: origin.imageWidth,
            imageHeight: origin.imageHeight,
            exif: origin.exif,
            chunkSize: origin.chunkSize,
            hdTitle: origin.hdTitle
        };
    }

    function setIEAPIs(t) {
        t.changeLocalFileById = function(id, localPath) {
            return this.component.itemFileChangeById(id, localPath);
        };
        t.changeLocalFileByIndex = function(index, localPath) {
            return this.component.itemFileChangeByIndex(id, localPath);
        };
        t.getSupportClipboard = function() {
            return this.component.getSupportClipboard();
        };
        t.setSupportClipboard = function(enable) {
            this.component.setSupportClipboard(enable);
        };
        t.getAutoDeleteClipboardFile = function() {
            return this.component.getAutoDeleteClipboardFile();
        };
        t.setAutoDeleteClipboardFile = function(enable) {
            this.component.setAutoDeleteClipboardFile(enable);
        };
        t.getClipboardFilePrefix = function() {
            return this.component.getClipboardFilePrefix();
        };
        t.setClipboardFilePrefix = function(prefix) {
            this.component.setClipboardFilePrefix(prefix);
        };
        t.getTempPathForClipboard = function() {
            return this.component.getTempPathForClipboard();
        };
        t.setTempPathForClipboard = function(path) {
            return this.component.setTempPathForClipboard(path);
        };
        t.getSupportPHP = function() {
            return this.component.getSupportPHP();
        };
        t.setSupportPHP = function(enable) {
            this.component.setSupportPHP(enable);
        };
        t.isFolderDeletionWithSubItems = function() {
            return this.component.getDeleteSubItemsWithParent();
        };
        t.setFolderDeletionWithSubItems = function(enable) {
            this.component.setDeleteSubItemsWithParent(enable);
        };
        t.isEnableUseProfile = function() {
            return this.component.getUseProfile();
        };
        t.setEnableUseProfile = function(enable) {
            this.component.setUseProfile(enable);
        };
        t.setLimitMultiDownloadSize = function() {
            throwIENotSupportedError();
        };
        t.updateUI = function() {};
        t.getCompressURL = function() {
            throwIENotSupportedError();
        };
        t.setCompressURL = function() {
            throwIENotSupportedError();
        };
        t.downloadCompressed = function() {
            throwIENotSupportedError();
        };
        t.stopCompressWaiting = function() {
            throwIENotSupportedError();
        };
        t.getLayoutStyle = function() {
            return this.component.getListUIStyle();
        };
        t.setLayoutStyle = function(style) {
            this.component.setListUIStyle(style);
        };
        t.getShowTreeStyle = function() {
            return this.component.getShowTreeStyle();
        };
        t.setShowTreeStyle = function(enable) {
            this.component.setShowTreeStyle(enable);
        };
        t.isBorderVisible = function() {
            return this.component.getShowBorder();
        };
        t.setBorderVisible = function(enable) {
            this.component.setShowBorder(enable);
        };
        t.isGridLineVisible = function() {
            return this.component.getShowGridLine();
        };
        t.setGridLineVisible = function(enable) {
            this.component.setShowGridLine(enable);
        };
        t.getItemHeight = function() {
            return this.component.getListItemHeight();
        };
        t.setItemHeight = function(height) {
            return this.component.setListItemHeight(height);
        };
        t.getHeaderHeight = function() {
            return this.component.getListHeaderHeight();
        };
        t.setHeaderHeight = function(height) {
            return this.component.setListHeaderHeight(height);
        };
        t.getHeaderGradientType = function() {
            return this.component.getListHeaderGradationType();
        };
        t.setHeaderGradientType = function(gtype) {
            this.component.setListHeaderGradationType(gtype);
        };
        t.getHeaderColorNormalTop = function() {
            return this.component.getListHeaderColorNormalTop();
        };
        t.setHeaderColorNormalTop = function(hexrgb) {
            this.component.setListHeaderColorNormalTop(hexrgb);
        };
        t.getHeaderColorNormalBottom = function() {
            return this.component.getListHeaderColorNormalbottom();
        };
        t.setHeaderColorNormalBottom = function(hexrgb) {
            this.component.setListHeaderColorNormalBottom(hexrgb);
        };
        t.getHeaderColorPushTop = function() {
            return this.component.getListHeaderColorPushTop();
        };
        t.setHeaderColorPushTop = function(hexrgb) {
            this.component.setListHeaderColorPushTop(hexrgb);
        };
        t.getHeaderColorPushBottom = function() {
            return this.component.getListHeaderColorPushbottom();
        };
        t.setHeaderColorPushBottom = function(hexrgb) {
            this.component.setListHeaderColorPushbottom(hexrgb);
        };
        t.getBackgroundImageURL = function() {
            return this.component.getListBkImageURL();
        };
        t.setBackgroundImageURL = function(url) {
            this.component.setListBkImageURL(url);
        };
        t.getBackgroundImageOffsetX = function() {
            return this.component.getListBkImageXOffsetPos();
        };
        t.setBackgroundImageOffsetX = function(x) {
            this.component.setListBkImageXOffsetPos(x);
        };
        t.getBackgroundImageOffsetY = function() {
            return this.component.getListBkImageYOffsetPos();
        };
        t.setBackgroundImageOffsetY = function(y) {
            this.component.setListBkImageYOffsetPos(y);
        };
        t.getColorPattern = function() {
            return this.component.getListUIColorPattern();
        };
        t.setColorPattern = function(pattern) {
            this.component.setListUIColorPattern(pattern);
        };
        t.getStatusImagePattern = function() {
            return this.component.getListStatusImagePattern();
        };
        t.setStatusImagePattern = function(pattern) {
            this.component.setListStatusImagePattern(pattern);
        };
        t.getBackgroundColor = function() {
            return this.component.getListCustomBkColor();
        };
        t.setBackgroundColor = function(hexrgb) {
            this.component.setListCustomBkColor(hexrgb);
        };
        t.getGridLineColor = function() {
            return this.component.getListGridLineColor();
        };
        t.setGridLineColor = function(hexrgb) {
            this.component.setListGridLineColor(hexrgb);
        };
        t.setBackgroundImage = function(url, x, y) {
            this.component.setListBkImageURL(url);
            this.component.setListBkImageXOffsetPos(x);
            this.component.setListBkImageYOffsetPos(y);
        };
        t.getHeaderFontName = function() {
            return this.component.getListHeaderFontName();
        };
        t.setHeaderFontName = function(font) {
            this.component.setListHeaderFontName(font);
        };
        t.getHeaderFontSize = function() {
            return this.component.getListHeaderFontSize();
        };
        t.setHeaderFontSize = function(size) {
            this.component.setListHeaderFontSize(size);
        };
        t.getHeaderFontColor = function() {
            return this.component.getHeaderTextColor();
        };
        t.setHeaderFontColor = function(hexrgb) {
            return this.component.setHeaderTextColor(hexrgb);
        };
        t.getItemFontName = function() {
            return this.component.getListFontName();
        };
        t.setItemFontName = function(font) {
            this.component.setListFontName(font);
        };
        t.getItemFontSize = function() {
            return this.component.getListFontSize();
        };
        t.setItemFontSize = function(size) {
            this.component.setListFontSize(size);
        };
        t.getItemTextColor = function() {
            return this.component.getListCustomTextColor();
        };
        t.setItemFontColor = function(hexrgb) {
            this.component.setListCustomTextColor(hexrgb);
        };
        t.setUIStyle = function(style) {
            if (!style) return;
            if (isDefined(style.colorPattern)) this.setColorPattern(style.colorPattern);
            if (isDefined(style.imagePattern)) this.setStatusImagePattern(style.imagePattern);
            if (isDefined(style.borderVisible)) this.setBorderVisible(style.borderVisible === true);
            if (isDefined(style.gridLineVisible)) this.setGridLineVisible(style.gridLineVisible === true);
            if (isDefined(style.gridLineColor)) this.setGridLineColor(style.gridLineColor);
            if (isDefined(style.itemHeight)) this.setItemHeight(style.itemHeight);
            if (isDefined(style.fontName)) this.setItemFontName(style.fontName);
            if (isDefined(style.fontSize)) this.setItemFontSize(style.fontSize);
            if (isDefined(style.fontColor)) this.setItemFontColor(style.fontColor);
            if (isDefined(style.headerHeight)) this.setHeaderHeight(style.headerHeight);
            if (isDefined(style.headerGradientType)) this.setHeaderGradientType(style.headerGradientType);
            if (isDefined(style.headerFontName)) this.setHeaderFontName(style.headerFontName);
            if (isDefined(style.headerFontSize)) this.setHeaderFontSize(style.headerFontSize);
            if (isDefined(style.headerFontColor)) this.setHeaderFontColor(style.headerFontColor);
            if (isDefined(style.headerColors)) {
                var colors = style.headerColors.split(" "),
                    cntop = colors[0],
                    cnbottom, cptop, cpbottom;
                if (colors.length == 1) {
                    cnbottom = cptop = cpbottom = cntop;
                } else if (colors.length == 2) {
                    cnbottom = cntop;
                    cptop = cpbottom = colors[1];
                } else if (colors.length == 3) {
                    cnbottom = colors[1];
                    cptop = cpbottom = colors[2];
                } else {
                    cnbottom = colors[1];
                    cptop = colors[2];
                    cpbottom = colors[3];
                }
                this.setHeaderColorNormalTop(cntop);
                this.setHeaderColorNormalBottom(cnbottom);
                this.setHeaderColorPushTop(cptop);
                this.setHeaderColorPushBottom(cpbottom);
            }
            if (isDefined(style.backgroundColor)) this.setBackgroundColor(style.backgroundColor);
            if (isDefined(style.backgroundImageURL)) this.setBackgroundImageURL(style.backgroundImageURL);
            if (isDefined(style.backgroundImageOffset)) {
                var xy = style.backgroundImageOffset.split(" "),
                    xpos = xy[0],
                    ypos = (xy.length == 1 ? xpos : xy[1]);
                this.setBackgroundImageOffsetX(xpos);
                this.setBackgroundImageOffsetY(ypos);
            }
            if (isDefined(style.backgroundImage)) {
                var background = style.backgroundImage.split(" "),
                    url, x, y;
                url = background[0];
                if (background.length == 1) x = y = parseInt(0, 10);
                if (background.length == 2) x = y = parseInt(background[1], 10);
                if (background.length >= 3) x = parseInt(background[1], 10), y = parseInt(background[1], 10);
                this.setBackgroundImage(url, x, y);
            }
        };
    }

    function setPrecondition(t, config) {
        if (t.mode != "multi") return;
        t.setEnableColumnSorting(config.enableSortColumn || config.enableSortColumn == "true");
        t.setSortPriorityVirtualFile(config.sortPriorityVirtualFile || config.sortPriorityVirtualFile == "true");
        t.setAutoSortingType(parseInt(config.autoSortType, 10));
        t.setPreviewEnable(config.enablePreview);
    }

    function setEvents(t, config) {
        if (config.mode == "multi") {
            var component = t.component;
            var dndObject = t.dndObject;
            component.addEventListener("error", win.onDX5_H5_Error, false);
            component.addEventListener("created", win.onDX5_H5_Created, false);
            component.addEventListener("itemselect", win.onDX5_H5_ItemSelect, false);
            component.addEventListener("itemdbclick", win.onDX5_H5_ItemDoubleClick, false);
            component.addEventListener("beforeItemsAdd", win.onDX5_H5_BeforeItemsAdd, false);
            component.addEventListener("itemAdding", win.onDX5_H5_ItemAdding, false);
            component.addEventListener("itemsAdded", win.onDX5_H5_ItemsAdded, false);
            component.addEventListener("beforeItemsDelete", win.onDX5_H5_BeforeItemsDelete, false);
            component.addEventListener("itemDeleting", win.onDX5_H5_ItemDeleting, false);
            component.addEventListener("itemsDeleted", win.onDX5_H5_ItemsDeleted, false);
            component.addEventListener("uploadBegin", win.onDX5_H5_UploadBegin, false);
            component.addEventListener("uploadItemStart", win.onDX5_H5_UploadItemStart, false);
            component.addEventListener("uploadItemEnd", win.onDX5_H5_UploadItemEnd, false);
            component.addEventListener("uploadCompleted", win.onDX5_H5_UploadCompleted, false);
            component.addEventListener("uploadStopped", win.onDX5_H5_UploadStopped, false);
            component.addEventListener("downloadBegin", win.onDX5_H5_DownloadBegin, false);
            component.addEventListener("downloadItemStart", win.onDX5_H5_DownloadItemStart, false);
            component.addEventListener("downloadItemEnd", win.onDX5_H5_DownloadItemEnd, false);
            component.addEventListener("downloadCompleted", win.onDX5_H5_DownloadCompleted, false);
            component.addEventListener("downloadStopped", win.onDX5_H5_DownloadStopped, false);
            component.addEventListener("preview", win.onDX5_H5_Preview, false);
            component.addEventListener("compressBegin", win.onDX5_H5_CompressWaitingBegin, false);
            component.addEventListener("compressCompleted", win.onDX5_H5_CompressWaitingCompleted, false);
            component.addEventListener("compressStopped", win.onDX5_H5_CompressWaitingStopped, false);
            component.addEventListener("downloadToHDForSingle", win.onDX5_H5_DownloadToHDForSingle, false);
            dndObject.addEventListener("dragenter", function(evt) {
                evt.stopPropagation();
                evt.preventDefault();
            }, false);
            dndObject.addEventListener("dragover", function(evt) {
                evt.stopPropagation();
                evt.preventDefault();
                evt.dataTransfer.dropEffect = t.getEnableDnd() === true ? "copy" : "none";
            }, false);
            dndObject.addEventListener("drop", function(evt) {
                evt.stopPropagation();
                evt.preventDefault();
                if (t.getEnableDnd() !== true) return;
                if (win.dx5.browser.isChrome) t.addEntriesForChrome(evt.dataTransfer.items);
                else t.addFileList(evt.dataTransfer.files);
                win.onDX5_H5_DragAndDrop({
                    "id": t.domObject.id
                });
            }, false);
            if (win.dx5.browser.isFirefox) {
                win.addEventListener("resize", function() {
                    component.dispatchSVGResize();
                });
            }
        } else {}
    }

    function setUIHelpers(t, config) {
        if (config.btnFile) {
            var btn = doc.getElementById(getIdSharp(config.btnFile, false));
            btn && btn.addEventListener("click", function(e) {
                e.preventDefault();
                t.openFileDialog();
            }, false);
        }
        if (config.btnFolder) {
            var btn = doc.getElementById(getIdSharp(config.btnFolder, false));
            btn && btn.addEventListener("click", function(e) {
                e.preventDefault();
                t.openFolderDialog();
            }, false);
        }
        if (config.btnSelectAll) {
            var btn = doc.getElementById(getIdSharp(config.btnSelectAll, false));
            btn && btn.addEventListener("click", function(e) {
                e.preventDefault();
                t.selectAll();
            }, false);
        }
        if (config.btnUnselectAll) {
            var btn = doc.getElementById(getIdSharp(config.btnUnselectAll, false));
            btn && btn.addEventListener("click", function(e) {
                e.preventDefault();
                t.unselectAll();
            }, false);
        }
        if (config.btnDeleteSelected) {
            var btn = doc.getElementById(getIdSharp(config.btnDeleteSelected, false));
            btn && btn.addEventListener("click", function(e) {
                e.preventDefault();
                t.removeSelected();
            }, false);
        }
        if (config.btnDeleteAll) {
            var btn = doc.getElementById(getIdSharp(config.btnDeleteAll, false));
            btn && btn.addEventListener("click", function(e) {
                e.preventDefault();
                t.removeAll();
            }, false);
        }
        if (config.btnDeleteChecked) {
            var btn = doc.getElementById(getIdSharp(config.btnDeleteChecked, false));
            btn && btn.addEventListener("click", function(e) {
                e.preventDefault();
                t.removeChecked();
            }, false);
        }
        if (config.btnRevokeAll) {
            var btn = doc.getElementById(getIdSharp(config.btnRevokeAll, false));
            btn && btn.addEventListener("click", function(e) {
                e.preventDefault();
                t.revokeAllVirtualFiles();
            }, false);
        }
        if (config.btnUploadAuto) {
            var btn = doc.getElementById(getIdSharp(config.btnUploadAuto, false));
            btn && btn.addEventListener("click", function(e) {
                e.preventDefault();
                t.upload("AUTO");
            }, false);
        }
        if (config.btnUploadChecked) {
            var btn = doc.getElementById(getIdSharp(config.btnUploadChecked, false));
            btn && btn.addEventListener("click", function(e) {
                e.preventDefault();
                t.upload("CHECKED");
            }, false);
        }
        if (config.btnUploadSelected) {
            var btn = doc.getElementById(getIdSharp(config.btnUploadSelected, false));
            btn && btn.addEventListener("click", function(e) {
                e.preventDefault();
                t.upload("SELECTED");
            }, false);
        }
        if (config.btnOpenDownloadDialog) {
            var btn = doc.getElementById(getIdSharp(config.btnOpenDownloadDialog, false));
            btn && btn.addEventListener("click", function(e) {
                e.preventDefault();
                if (t.mode == "ie") t.openDownloadPathDialog();
                else errorFromX5(t.domObject.id, 11, "Not supported function in DEXTUploadX5 Multi module");
            }, false);
        }
        if (config.btnDownloadAuto) {
            var btn = doc.getElementById(getIdSharp(config.btnDownloadAuto, false));
            btn && btn.addEventListener("click", function(e) {
                e.preventDefault();
                t.download("AUTO");
            }, false);
        }
        if (config.btnDownloadChecked) {
            var btn = doc.getElementById(getIdSharp(config.btnDownloadChecked, false));
            btn && btn.addEventListener("click", function(e) {
                e.preventDefault();
                t.download("CHECKED");
            }, false);
        }
        if (config.btnDownloadSelected) {
            var btn = doc.getElementById(getIdSharp(config.btnDownloadSelected, false));
            btn && btn.addEventListener("click", function(e) {
                e.preventDefault();
                t.download("SELECTED");
            }, false);
        }
        if (config.btnStopUploading) {
            var btn = doc.getElementById(getIdSharp(config.btnStopUploading, false));
            btn && btn.addEventListener("click", function(e) {
                e.preventDefault();
                t.stopUploading();
            }, false);
        }
        if (config.btnStopDownloading) {
            var btn = doc.getElementById(getIdSharp(config.btnStopDownloading, false));
            btn && btn.addEventListener("click", function(e) {
                e.preventDefault();
                t.stopDownloading();
            }, false);
        }
        if (config.btnDownloadCompressedAuto) {
            var btn = doc.getElementById(getIdSharp(config.btnDownloadCompressedAuto, false));
            btn && btn.addEventListener("click", function(e) {
                e.preventDefault();
                if (t.mode == "multi") t.downloadCompressed("AUTO");
                else errorFromX5(t.domObject.id, 12, "Not supported function in DEXTUploadX5 IE module");
            }, false);
        }
        if (config.btnDownloadCompressedChecked) {
            var btn = doc.getElementById(getIdSharp(config.btnDownloadCompressedChecked, false));
            btn && btn.addEventListener("click", function(e) {
                e.preventDefault();
                if (t.mode == "multi") t.downloadCompressed("CHECKED");
                else errorFromX5(t.domObject.id, 12, "Not supported function in DEXTUploadX5 IE module");
            }, false);
        }
        if (config.btnDownloadCompressedSelected) {
            var btn = doc.getElementById(getIdSharp(config.btnDownloadCompressedSelected, false));
            btn && btn.addEventListener("click", function(e) {
                e.preventDefault();
                if (t.mode == "multi") t.downloadCompressed("SELECTED");
                else errorFromX5(t.domObject.id, 12, "Not supported function in DEXTUploadX5 IE module");
            }, false);
        }
        if (config.btnStopCompressWaiting) {
            var btn = doc.getElementById(getIdSharp(config.btnStopCompressWaiting, false));
            btn && btn.addEventListener("click", function(e) {
                e.preventDefault();
                if (t.mode == "multi") t.stopCompressWaiting();
                else errorFromX5(t.domObject.id, 12, "Not supported function in DEXTUploadX5 IE module");
            }, false);
        }
        if (config.btnOpenDownloadDialogOfHD) {
            var btn = doc.getElementById(getIdSharp(config.btnOpenDownloadDialogOfHD, false));
            btn && btn.addEventListener("click", function(e) {
                e.preventDefault();
                t.openDownloadPathDialogOfHD();
            }, false);
        }
        if (config.btnDownloadToHDAuto) {
            var btn = doc.getElementById(getIdSharp(config.btnDownloadToHDAuto, false));
            btn && btn.addEventListener("click", function(e) {
                e.preventDefault();
                t.downloadToHD("AUTO");
            }, false);
        }
        if (config.btnDownloadToHDChecked) {
            var btn = doc.getElementById(getIdSharp(config.btnDownloadToHDChecked, false));
            btn && btn.addEventListener("click", function(e) {
                e.preventDefault();
                t.downloadToHD("CHECKED");
            }, false);
        }
        if (config.btnDownloadToHDSelected) {
            var btn = doc.getElementById(getIdSharp(config.btnDownloadToHDSelected, false));
            btn && btn.addEventListener("click", function(e) {
                e.preventDefault();
                t.downloadToHD("SELECTED");
            }, false);
        }
    }
    win.onDX5_H5_Error = function(evt) {
        var dx = win.dx5.get(evt.id);
        if (dx && dx.mode == "multi" && dx.isUsingProgressDialog && dx.isUsingProgressDialog() === true) {
            win.dx5.popupManager.up.hide(evt.id, true);
            win.dx5.popupManager.dn.hide(evt.id, true);
            win.dx5.popupManager.cp.hide(evt.id, true);
        }
        if (win.onDX5Error) {
            var strVer = "";
            try {
                strVer = "c" + ((win.dextuploadx5Configuration && win.dextuploadx5Configuration.version) ? win.dextuploadx5Configuration.version : "unknown");
            } catch (ex) {
                strVer = "c:unknown";
            }
            try {
                strVer += "-m" + ((dx && dx.getVersion) ? dx.getVersion() : "unknown");
            } catch (ex) {
                strVer += "-m:unknown";
            }
            strVer += "\n";
            win.onDX5Error(evt.id, evt.code, strVer + evt.message);
        }
    };
    win.onDX5_H5_Created = function(evt) {
        if (win.onDX5Created) win.onDX5Created(evt.id);
    };
    win.onDX5_H5_ItemSelect = function(evt) {
        if (win.onDX5ItemSelect) win.onDX5ItemSelect(evt.id, evt.itemIndex, evt.itemId, evt.itemType);
    };
    win.onDX5_H5_ItemDoubleClick = function(evt) {
        if (win.onDX5ItemDoubleClick) win.onDX5ItemDoubleClick(evt.id, evt.itemIndex, evt.itemId, evt.itemType);
    };
    win.onDX5_H5_BeforeItemsAdd = function(evt) {
        if (win.onDX5BeforeItemsAdd) {
            var ret = win.onDX5BeforeItemsAdd(evt.id, evt.count);
            if (ret === false) evt.preventDefault();
        }
    };
    win.onDX5_H5_ItemAdding = function(evt) {
        if (win.onDX5ItemAdding) {
            var ret = win.onDX5ItemAdding(evt.id, evt.file);
            if (ret === false) evt.preventDefault();
        }
    };
    win.onDX5_H5_ItemsAdded = function(evt) {
        if (win.onDX5ItemsAdded) win.onDX5ItemsAdded(evt.id, evt.count);
    };
    win.onDX5_H5_BeforeItemsDelete = function(evt) {
        if (win.onDX5BeforeItemsDelete) {
            var ret = win.onDX5BeforeItemsDelete(evt.id, evt.arr);
            if (ret === false) evt.preventDefault();
        }
    };
    win.onDX5_H5_ItemDeleting = function(evt) {
        if (win.onDX5ItemDeleting) {
            var ret = win.onDX5ItemDeleting(evt.id, evt.itemId);
            if (ret === false) evt.preventDefault();
        }
    };
    win.onDX5_H5_ItemsDeleted = function(evt) {
        if (win.onDX5ItemsDeleted) win.onDX5ItemsDeleted(evt.id, evt.count);
    };
    win.onDX5_H5_UploadBegin = function(evt) {
        if (win.onDX5UploadBegin) win.onDX5UploadBegin(evt.id);
        if (win.dx5.get(evt.id).isUsingProgressDialog() === true) {
            win.dx5.popupManager.up.show(evt.id);
        }
    };
    win.onDX5_H5_UploadItemStart = function(evt) {
        if (win.onDX5UploadItemStart) win.onDX5UploadItemStart(evt.id, evt.itemId);
    };
    win.onDX5_H5_UploadItemEnd = function(evt) {
        if (win.onDX5UploadItemEnd) win.onDX5UploadItemEnd(evt.id, evt.itemId);
    };
    win.onDX5_H5_UploadCompleted = function(evt) {
        if (win.dx5.get(evt.id).isUsingProgressDialog() === true) {
            win.dx5.popupManager.up.hide(evt.id, false, function() {
                if (win.onDX5UploadCompleted) win.onDX5UploadCompleted(evt.id);
            });
        } else {
            if (win.onDX5UploadCompleted) win.onDX5UploadCompleted(evt.id);
        }
    };
    win.onDX5_H5_UploadStopped = function(evt) {
        if (win.dx5.get(evt.id).isUsingProgressDialog() === true) {
            win.dx5.popupManager.up.hide(evt.id, true);
        }
        if (win.onDX5UploadStopped) win.onDX5UploadStopped(evt.id);
    };
    win.onDX5_H5_DownloadBegin = function(evt) {
        if (win.onDX5DownloadBegin) win.onDX5DownloadBegin(evt.id);
        if (win.dx5.get(evt.id).isUsingProgressDialog() === true) {
            win.dx5.popupManager.dn.show(evt.id);
        }
    };
    win.onDX5_H5_DownloadItemStart = function(evt) {
        if (win.onDX5DownloadItemStart) win.onDX5DownloadItemStart(evt.id, evt.itemId);
    };
    win.onDX5_H5_DownloadItemEnd = function(evt) {
        if (win.onDX5DownloadItemEnd) win.onDX5DownloadItemEnd(evt.id, evt.itemId);
    };
    win.onDX5_H5_DownloadCompleted = function(evt) {
        if (win.dx5.get(evt.id).isUsingProgressDialog() === true) {
            win.dx5.popupManager.dn.hide(evt.id, false, function() {
                if (win.onDX5DownloadCompleted) win.onDX5DownloadCompleted(evt.id);
            });
        } else {
            if (win.onDX5DownloadCompleted) win.onDX5DownloadCompleted(evt.id);
        }
    };
    win.onDX5_H5_DownloadStopped = function(evt) {
        if (win.dx5.get(evt.id).isUsingProgressDialog() === true) {
            win.dx5.popupManager.dn.hide(evt.id, true);
        }
        if (win.onDX5DownloadStopped) win.onDX5DownloadStopped(evt.id);
    };
    win.onDX5_H5_Preview = function(evt) {
        if (evt.method == 1 && evt.itemSource) {
            win.dx5.popupManager.pv.show(evt.itemSource, evt.backColor);
        } else if (evt.method == 2 && win.onDX5Preview) {
            win.onDX5Preview(evt.id, evt.itemIndex, evt.itemId, evt.itemSource);
        }
    };
    win.onDX5_H5_CompressWaitingBegin = function(evt) {
        if (win.onDX5CompressWaitingBegin) win.onDX5CompressWaitingBegin(evt.id);
        if (win.dx5.get(evt.id).isUsingProgressDialog() === true) {
            win.dx5.popupManager.cp.show(evt.id);
        }
    };
    win.onDX5_H5_CompressWaitingCompleted = function(evt) {
        if (win.dx5.get(evt.id).isUsingProgressDialog() === true) {
            win.dx5.popupManager.cp.hide(evt.id, false, function() {
                if (win.onDX5CompressWaitingCompleted) win.onDX5CompressWaitingCompleted(evt.id);
            });
        } else {
            if (win.onDX5CompressWaitingCompleted) win.onDX5CompressWaitingCompleted(evt.id);
        }
    };
    win.onDX5_H5_CompressWaitingStopped = function(evt) {
        if (win.dx5.get(evt.id).isUsingProgressDialog() === true) {
            win.dx5.popupManager.cp.hide(evt.id, true);
        }
        if (win.onDX5CompressWaitingStopped) win.onDX5CompressWaitingStopped(evt.id);
    };
    win.onDX5_H5_DragAndDrop = function(evt) {
        if (win.onDX5DragAndDrop) win.onDX5DragAndDrop(evt.id);
    };
    win.onDX5_H5_DownloadToHDForSingle = function(evt) {
        var dx = win.dx5.get(evt.id);
        if (dx) {
            dx.downloadByIdToHD(evt.itemId);
        }
    };
    win.onDX5_AX_Error = function(vObjectID, vError) {
        var err = vError || ";";
        var tokens = err.split(/;/);
        var code = tokens[0];
        var message = (tokens.length == 2) ? tokens[1] : tokens[1] + "\n" + tokens.slice(2, tokens.length).join(";");
        if (win.onDX5Error) {
            var dx = win.dx5.get(vObjectID);
            var strVer = "";
            try {
                strVer = "c" + ((win.dextuploadx5Configuration && win.dextuploadx5Configuration.version) ? win.dextuploadx5Configuration.version : "unknown");
            } catch (ex) {
                strVer = "c:unknown";
            }
            try {
                strVer += "-m" + (dx ? dx.getVersion() : "unknown");
            } catch (ex) {
                strVer += "-m:unknown";
            }
            strVer += "\n";
            win.onDX5Error(vObjectID, code, strVer + message);
        }
    };
    win.onDX5_AX_Created = function(vObjectID) {
        if (win.onDX5Created) win.onDX5Created(vObjectID);
    };
    win.onDX5_AX_BeforeItemsAdd = function(vObjectID, vItemCnt) {
        if (win.onDX5BeforeItemsAdd) return win.onDX5BeforeItemsAdd(vObjectID, vItemCnt);
    };
    win.onDX5_AX_ItemAdding = function(vObjectID, vItemObj) {
        if (win.onDX5ItemAdding) return win.onDX5ItemAdding(vObjectID, vItemObj);
    };
    win.onDX5_AX_ItemsAdded = function(vObjectID, vAddedItemsCnt) {
        if (win.onDX5ItemsAdded) win.onDX5ItemsAdded(vObjectID, vAddedItemsCnt);
    };
    win.onDX5_AX_BeforeItemsDelete = function(vObjectID, vItemIds) {
        var arr = [];
        for (var i = 0, len = vItemIds.length; i < len; i++) arr.push(vItemIds.Item(i));
        if (win.onDX5BeforeItemsDelete) return win.onDX5BeforeItemsDelete(vObjectID, arr);
    };
    win.onDX5_AX_ItemDeleting = function(vObjectID, vItemId) {
        if (win.onDX5ItemDeleting) return win.onDX5ItemDeleting(vObjectID, vItemId);
    };
    win.onDX5_AX_ItemsDeleted = function(vObjectID, vItemCnt) {
        if (win.onDX5ItemsDeleted) win.onDX5ItemsDeleted(vObjectID, vItemCnt);
    };
    win.onDX5_AX_ItemSelected = function(vObjectID, vItemListIndex, vItemUniqID, vItemType) {
        if (win.onDX5ItemSelect) win.onDX5ItemSelect(vObjectID, vItemListIndex, vItemUniqID, vItemType);
    };
    win.onDX5_AX_ItemClick = function(vObjectID, vItemListIndex, vItemUniqID, vItemType) {
        if (win.onDX5ItemClick) win.onDX5ItemClick(vObjectID, vItemListIndex, vItemUniqID, vItemType);
    };
    win.onDX5_AX_ItemDbClick = function(vObjectID, vItemListIndex, vItemUniqID, vItemType) {
        if (win.onDX5ItemDoubleClick) win.onDX5ItemDoubleClick(vObjectID, vItemListIndex, vItemUniqID, vItemType);
    };
    win.onDX5_AX_UploadBegin = function(vObjectID) {
        if (win.onDX5UploadBegin) win.onDX5UploadBegin(vObjectID);
    };
    win.onDX5_AX_UploadItemStart = function(vObjectID, vItemID) {
        if (win.onDX5UploadItemStart) win.onDX5UploadItemStart(vObjectID, vItemID);
    };
    win.onDX5_AX_UploadItemEnd = function(vObjectID, vItemID) {
        if (win.onDX5UploadItemEnd) win.onDX5UploadItemEnd(vObjectID, vItemID);
    };
    win.onDX5_AX_UploadComplete = function(vObjectID) {
        if (win.onDX5UploadCompleted) win.onDX5UploadCompleted(vObjectID);
    };
    win.onDX5_AX_UploadStop = function(vObjectID) {
        if (win.onDX5UploadStopped) win.onDX5UploadStopped(vObjectID);
    };
    win.onDX5_AX_DownloadBegin = function(vObjectID) {
        if (win.onDX5DownloadBegin) win.onDX5DownloadBegin(vObjectID);
    };
    win.onDX5_AX_DownloadItemStart = function(vObjectID, vItemID) {
        if (win.onDX5DownloadItemStart) win.onDX5DownloadItemStart(vObjectID, vItemID);
    };
    win.onDX5_AX_DownloadItemEnd = function(vObjectID, vItemID) {
        if (win.onDX5DownloadItemEnd) win.onDX5DownloadItemEnd(vObjectID, vItemID);
    };
    win.onDX5_AX_DownloadComplete = function(vObjectID) {
        if (win.onDX5DownloadCompleted) win.onDX5DownloadCompleted(vObjectID);
    };
    win.onDX5_AX_DownloadStop = function(vObjectID) {
        if (win.onDX5DownloadStopped) win.onDX5DownloadStopped(vObjectID);
    };
    win.onDX5_AX_CompressComplete = function(vObjectID) {
        if (win.onDX5CompressCompleted) win.onDX5CompressCompleted(vObjectID);
    };
    win.onDX5_AX_EncryptionComplete = function(vObjectID) {
        if (win.onDX5EncryptionCompleted) win.onDX5EncryptionCompleted(vObjectID);
    };
    win.onDX5_AX_DecryptionComplete = function(vObjectID) {
        if (win.onDX5DecryptionCompleted) win.onDX5DecryptionCompleted(vObjectID);
    };
    win.onDX5_AX_Preview = function(vObjectID, vItemListIndex, vItemUniqID, vItemLocalPath) {
        if (win.onDX5Preview) win.onDX5Preview(vObjectID, vItemListIndex, vItemUniqID, vItemLocalPath);
    };
    win.dx5 = {};
    win.dx5.defaultConfig = {
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
        loadWaitingTime: 3000,
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
    win.dx5.popupManager = null;
    win.dx5.instances = {};
    win.dx5.rootPath = "";
    win.dx5.lang = "";
    win.dx5.createPopupManager = function(popwin, config) {
        var tdoc = popwin.document;
        var headTag = tdoc.querySelector("head");
        if (!headTag) {
            headTag = tdoc.createElement("head");
            tdoc.documentElement.appendChild(headTag);
        }
        if (!popwin.declarationDX5PopupStyle) {
            popwin.declarationDX5PopupStyle = [];
        }
        var popcss = null;
        if (popwin.declarationDX5PopupStyle.indexOf("dextuploadx5-up-" + config.progressType + "-style") === -1) {
            popcss = tdoc.createElement("link");
            popcss.setAttribute("rel", "stylesheet");
            popcss.setAttribute("type", "text/css");
            popcss.setAttribute("href", combinePath(config.path, "./pop/dextuploadx5-up-" + config.progressType + "-style.css"));
            headTag.appendChild(popcss);
            popwin.declarationDX5PopupStyle.push("dextuploadx5-up-" + config.progressType + "-style");
        }
        var pupwin = tdoc.createElement("div");
        pupwin.classList.add("dx5-pop-up");
        tdoc.documentElement.appendChild(pupwin);
        var pupctn = tdoc.createElement("div");
        pupctn.classList.add("dx5-pop-up-container");
        pupwin.appendChild(pupctn);
        var pupobj = tdoc.createElement("object");
        pupobj.classList.add("dx5-pop-up-svg");
        pupobj.style.width = "100%";
        pupobj.style.height = "100%";
        pupobj.type = "image/svg+xml";
        pupobj.data = combinePath(config.path, "./pop/dextuploadx5-up-" + config.progressType + ".svg") + "?lang=" + escape(config.lang) + "&update=" + new Date().getTime();
        pupctn.appendChild(pupobj);
        if (popwin.declarationDX5PopupStyle.indexOf("dextuploadx5-dn-" + config.progressType + "-style") === -1) {
            popcss = tdoc.createElement("link");
            popcss.setAttribute("rel", "stylesheet");
            popcss.setAttribute("type", "text/css");
            popcss.setAttribute("href", combinePath(config.path, "./pop/dextuploadx5-dn-" + config.progressType + "-style.css"));
            headTag.appendChild(popcss);
            popwin.declarationDX5PopupStyle.push("dextuploadx5-dn-" + config.progressType + "-style");
        }
        var pdnwin = tdoc.createElement("div");
        pdnwin.classList.add("dx5-pop-dn");
        tdoc.documentElement.appendChild(pdnwin);
        var pdnctn = tdoc.createElement("div");
        pdnctn.classList.add("dx5-pop-dn-container");
        pdnwin.appendChild(pdnctn);
        var pdnobj = tdoc.createElement("object");
        pdnobj.classList.add("dx5-pop-dn-svg");
        pdnobj.style.width = "100%";
        pdnobj.style.height = "100%";
        pdnobj.type = "image/svg+xml";
        pdnobj.data = combinePath(config.path, "./pop/dextuploadx5-dn-" + config.progressType + ".svg") + "?lang=" + escape(config.lang) + "&update=" + new Date().getTime();
        pdnctn.appendChild(pdnobj);
        if (popwin.declarationDX5PopupStyle.indexOf("dextuploadx5-pv-style") === -1) {
            popcss = tdoc.createElement("link");
            popcss.setAttribute("rel", "stylesheet");
            popcss.setAttribute("type", "text/css");
            popcss.setAttribute("href", combinePath(config.path, "./pop/dextuploadx5-pv-style.css"));
            headTag.appendChild(popcss);
            popwin.declarationDX5PopupStyle.push("dextuploadx5-pv-style");
        }
        var ppvwin = tdoc.createElement("div");
        ppvwin.classList.add("dx5-pop-pv");
        ppvwin.style.cursor = "pointer";
        ppvwin.onclick = function() {
            win.dx5.popupManager.pv.hide();
        };
        tdoc.documentElement.appendChild(ppvwin);
        var ppvimg = tdoc.createElement("img");
        ppvimg.classList.add("dx5-pop-pv-media");
        ppvimg.src = "";
        ppvimg.alt = "preview";
        ppvimg.style.cursor = "pointer";
        ppvimg.onclick = function() {
            win.dx5.popupManager.pv.hide();
        };
        ppvwin.appendChild(ppvimg);
        if (popwin.declarationDX5PopupStyle.indexOf("dextuploadx5-cp-style") === -1) {
            popcss = tdoc.createElement("link");
            popcss.setAttribute("rel", "stylesheet");
            popcss.setAttribute("type", "text/css");
            popcss.setAttribute("href", combinePath(config.path, "./pop/dextuploadx5-cp-style.css"));
            headTag.appendChild(popcss);
            popwin.declarationDX5PopupStyle.push("dextuploadx5-cp-style");
        }
        var pcpwin = tdoc.createElement("div");
        pcpwin.classList.add("dx5-pop-cp");
        tdoc.documentElement.appendChild(pcpwin);
        var pcpctn = tdoc.createElement("div");
        pcpctn.classList.add("dx5-pop-cp-container");
        pcpwin.appendChild(pcpctn);
        var pcpobj = tdoc.createElement("object");
        pcpobj.classList.add("dx5-pop-cp-svg");
        pcpobj.style.width = "100%";
        pcpobj.style.height = "100%";
        pcpobj.type = "image/svg+xml";
        pcpobj.data = combinePath(config.path, "./pop/dextuploadx5-cp.svg") + "?lang=" + escape(config.lang) + "&update=" + new Date().getTime();
        pcpctn.appendChild(pcpobj);
        if (popwin.declarationDX5PopupStyle.indexOf("dextuploadx5-ud-style") === -1) {
            popcss = tdoc.createElement("link");
            popcss.setAttribute("rel", "stylesheet");
            popcss.setAttribute("type", "text/css");
            popcss.setAttribute("href", combinePath(config.path, "./pop/dextuploadx5-ud-style.css"));
            headTag.appendChild(popcss);
            popwin.declarationDX5PopupStyle.push("dextuploadx5-ud-style");
        }
        var pudwin = tdoc.createElement("div");
        pudwin.classList.add("dx5-pop-ud");
        tdoc.documentElement.appendChild(pudwin);
        var pudctn = tdoc.createElement("div");
        pudctn.classList.add("dx5-pop-ud-container");
        pudwin.appendChild(pudctn);
        var pudobj = tdoc.createElement("object");
        pudobj.classList.add("dx5-pop-ud-svg");
        pudobj.style.width = "100%";
        pudobj.style.height = "100%";
        pudobj.type = "image/svg+xml";
        pudobj.data = combinePath(config.path, "./pop/dextuploadx5-ud.svg") + "?lang=" + escape(config.lang) + "&update=" + new Date().getTime();
        pudctn.appendChild(pudobj);
        win.dx5.popupManager = {
            up: {
                pwn: pupwin,
                pob: pupobj,
                show: function(id) {
                    if (!id) return;
                    var tw = this.pwn;
                    var to = this.pob;
                    addClass(tw, "is-visible");
                    (function detectPopup(delay) {
                        if (delay < 0) {
                            errorFromX5(t.domObject.id, 13, "The progress popup window does not exist for DEXTUploadX5.");
                            return;
                        }
                        if (to && to.contentDocument && typeof(to.contentDocument.updateUI) == "function") {
                            to.contentDocument.updateUI(win.dx5.get(id));
                        } else {
                            setTimeout(function() {
                                detectPopup(delay - 1000);
                            }, 100);
                        }
                    })();
                },
                hide: function(id, force, callback) {
                    console.log("DX5: Hide progress up window(" + id + ") " + (force ? "by force" : "") + ".");
                    var dx = win.dx5.get(id);
                    if (dx && force) dx.stopUploading();
                    var tw = this.pwn;
                    var to = this.pob;
                    if (to && to.contentDocument && typeof(to.contentDocument.stopUI) == "function") {
                        (function detectStop() {
                            var ret = to.contentDocument.stopUI(!force);
                            if (ret == true || force == true) {
                                removeClass(tw, "is-visible");
                                if (callback && typeof(callback) == "function") callback();
                            } else {
                                setTimeout(function() {
                                    detectStop();
                                }, 100);
                            }
                        })();
                    }
                }
            },
            dn: {
                pwn: pdnwin,
                pob: pdnobj,
                show: function(id) {
                    if (!id) return;
                    var tw = this.pwn;
                    var to = this.pob;
                    addClass(tw, "is-visible");
                    (function detectPopup(delay) {
                        if (delay < 0) {
                            errorFromX5(t.domObject.id, 14, "The progress popdown window doesn't exist for DEXTUploadX5.");
                            return;
                        }
                        if (to && to.contentDocument && typeof(to.contentDocument.updateUI) == "function") {
                            to.contentDocument.updateUI(win.dx5.get(id));
                        } else {
                            setTimeout(function() {
                                detectPopup(delay - 1000);
                            }, 100);
                        }
                    })();
                },
                hide: function(id, force, callback) {
                    console.log("DX5: Hide progress down window(" + id + ") " + (force ? "by force" : "") + ".");
                    var dx = win.dx5.get(id);
                    if (dx && force) dx.stopDownloading();
                    var tw = this.pwn;
                    var to = this.pob;
                    if (to && to.contentDocument && typeof(to.contentDocument.stopUI) == "function") {
                        (function detectStop() {
                            var ret = to.contentDocument.stopUI(!force);
                            if (ret == true || force == true) {
                                removeClass(tw, "is-visible");
                                if (callback && typeof(callback) == "function") callback();
                            } else {
                                setTimeout(function() {
                                    detectStop();
                                }, 100);
                            }
                        })();
                    }
                }
            },
            pv: {
                pwn: ppvwin,
                pob: ppvimg,
                show: function(source, color) {
                    if (!this.pwn.style.backgroundColor || this.pwn.style.backgroundColor != color) {
                        this.pwn.style.backgroundColor = color;
                    }
                    this.pob.src = source;
                    addClass(this.pwn, "is-visible");
                    addClass(this.pob, "is-visible");
                },
                hide: function() {
                    this.pob.src = "";
                    removeClass(this.pob, "is-visible");
                    removeClass(this.pwn, "is-visible");
                }
            },
            cp: {
                pwn: pcpwin,
                pob: pcpobj,
                show: function(id) {
                    if (!id) return;
                    var tw = this.pwn;
                    var to = this.pob;
                    addClass(tw, "is-visible");
                    (function detectPopup(delay) {
                        if (delay < 0) {
                            errorFromX5(t.domObject.id, 15, "The progress compress window doesn't exist for DEXTUploadX5.");
                            return;
                        }
                        if (to && to.contentDocument && typeof(to.contentDocument.updateUI) == "function") {
                            to.contentDocument.updateUI(win.dx5.get(id));
                        } else {
                            setTimeout(function() {
                                detectPopup(delay - 1000);
                            }, 100);
                        }
                    })();
                },
                hide: function(id, force, callback) {
                    console.log("DX5: Hide progress compress window(" + id + ") " + (force ? "by force" : "") + ".");
                    var dx = win.dx5.get(id);
                    if (dx && force) dx.stopCompressWaiting();
                    var tw = this.pwn;
                    var to = this.pob;
                    if (to && to.contentDocument && typeof(to.contentDocument.stopUI) == "function") {
                        to.contentDocument.stopUI();
                        removeClass(tw, "is-visible");
                        if (callback && typeof(callback) == "function") callback();
                    }
                }
            },
            ud: {
                pwn: pudwin,
                pob: pudobj,
                show: function(id) {
                    if (!id) return;
                    var tw = this.pwn;
                    var to = this.pob;
                    addClass(tw, "is-visible");
                    (function detectPopup(delay) {
                        if (delay < 0) {
                            errorFromX5(t.domObject.id, 15, "The progress window of updating doesn't exist for DEXTUploadX5.");
                            return;
                        }
                        if (to && to.contentDocument && typeof(to.contentDocument.updateUI) == "function") {
                            to.contentDocument.updateUI(win.dx5.get(id));
                        } else {
                            setTimeout(function() {
                                detectPopup(delay - 1000);
                            }, 100);
                        }
                    })();
                },
                hide: function(id, force, callback) {
                    console.log("DX5: Hide the progress window(" + id + ") of updating " + (force ? "by force" : "") + ".");
                    var dx = win.dx5.get(id);
                    var tw = this.pwn;
                    var to = this.pob;
                    if (to && to.contentDocument && typeof(to.contentDocument.stopUI) == "function") {
                        to.contentDocument.stopUI();
                        removeClass(tw, "is-visible");
                        if (callback && typeof(callback) == "function") callback();
                    }
                }
            }
        };
    };
    win.dx5.setup = function(config, delay) {
        var wrapper = win.dx5.get(config.id);
        if (wrapper) {
            wrapper.component = (wrapper.mode == "multi") ? wrapper.domObject.contentDocument : wrapper.domObject;
            wrapper.dndObject = (win.dx5.browser.isChrome || win.dx5.browser.isOpera || win.dx5.browser.isSafari) ? wrapper.domObject : wrapper.component;
            var version = "";
            try {
                version = wrapper.component.getVersion();
            } catch (e) {
                version = "";
            }
            if (version) {
                if (wrapper.mode == "ie" && win.dextuploadx5Configuration && win.dextuploadx5Configuration.version) {
                    if (compareVersion(version, win.dextuploadx5Configuration.version) < 0) {
                        if (win.dextuploadx5Configuration && win.dextuploadx5Configuration.ieDownloadURL) {
                            win.open(win.dextuploadx5Configuration.ieDownloadURL, "DEXTUploadX5ClientDownloadPage", "width=640,height=600,status=no,toolbar=no,menubar=no,location=no");
                        } else {
                            errorFromX5(config.id, 8, "Loading DEXTUploadX5 IE module failed! - version is low.");
                        }
                        return;
                    }
                }
                console.log("DX5: API settings");
                setAPIs(wrapper);
                console.log("DX5: Precondition settings");
                setPrecondition(wrapper, config);
                console.log("DX5: Event settings");
                setEvents(wrapper, config);
                console.log("DX5: Helper settings");
                setUIHelpers(wrapper, config);
            } else if (delay < config.loadWaitingTime) {
                setTimeout(function() {
                    dx5.setup(config, delay + 100);
                }, 100);
            } else if (config.mode == "multi") {
                errorFromX5(config.id, 7, "DEXTUploadX5 Multi module loading failed!");
            } else if (config.mode == "ie") {
                if (win.dextuploadx5Configuration && win.dextuploadx5Configuration.ieDownloadURL) {
                    win.open(win.dextuploadx5Configuration.ieDownloadURL, "DEXTUploadX5ClientDownloadPage", "width=640,height=600,status=no,toolbar=no,menubar=no,location=no");
                } else {
                    errorFromX5(config.id, 9, "DEXTUploadX5 IE module loading failed! - not installed");
                }
            }
        } else {
            errorFromX5(config.id, 6, "The component[" + config.id + "] does not exist.");
        }
    };
    win.dx5.get = function(elementId) {
        var target = win.dx5.instances[elementId];
        return target ? target : null;
    };
    win.dx5.create = function(userConfig) {
        var popwin = win;
        var container = doc.getElementById(getIdSharp(userConfig.parentId, false));
        if (!container) {
            errorFromX5(configuration.id || "undefined", 1, "The target element(" + userConfig.parentId + ") does not exist.");
            return;
        }
        var configuration = {};
        for (var pname in win.dx5.defaultConfig) {
            configuration[pname] = userConfig && userConfig[pname] ? userConfig[pname] : win.dx5.defaultConfig[pname];
        }
        if (!configuration.path) {
            if (win.dextuploadx5Configuration && win.dextuploadx5Configuration.productPath) {
                configuration.path = win.dextuploadx5Configuration.productPath;
            } else {
                errorFromX5(configuration.id || "undefined", 2, "The product path is necessary to create DEXTUploadX5 component.");
                return;
            }
        }
        win.dx5.rootPath = configuration.path;
        if (!win.dx5.popupManager && configuration.mode == "multi") win.dx5.createPopupManager(popwin, configuration);
        var host = doc.createElement("object");
        host.id = getIdSharp(configuration.id, false);
        host.style.width = configuration.width;
        host.style.height = configuration.height;
        var x5lang = "";
        if (!configuration.lang || configuration.lang == "auto") {
            x5lang = navigator.language || navigator.browserLanguage || navigator.systemLanguage;
            x5lang = x5lang ? x5lang.split("-")[0] : "";
        } else {
            x5lang = configuration.lang;
        }
        if (typeof configuration.loadWaitingTime != "number") {
            configuration.loadWaitingTime = 3000;
        } else if (configuration.loadWaitingTime < 3000) {
            configuration.loadWaitingTime = 3000;
        } else {
            configuration.loadWaitingTime = Math.floor(configuration.loadWaitingTime);
        }
        win.dx5.lang = x5lang;
        if (configuration.mode == "multi") {
            host.type = "image/svg+xml";
            configuration.style = configuration.style || "list";
            var url = combinePath(configuration.path, getMutliUIStyle(configuration.style));
            host.data = url + "?elementId=" + escape(configuration.id) + "&lang=" + escape(x5lang);
        } else if (configuration.mode == "ie") {
            var supported = AXFiltering();
            if (supported === "unsupported") {
                errorFromX5(configuration.id || "undefined", 4, "The browser does not support the ActiveX.");
                return;
            } else if (supported === true) {
                errorFromX5(configuration.id || "undefined", 5, "The browser is disable of the ActiveX.");
                return;
            }
            var paramtag = doc.createElement("param");
            paramtag.setAttribute("name", "ObjectID");
            paramtag.setAttribute("value", getIdSharp(configuration.id, false));
            host.appendChild(paramtag);
            paramtag = doc.createElement("param");
            paramtag.setAttribute("name", "CodePage");
            paramtag.setAttribute("value", configuration.codePage);
            host.appendChild(paramtag);
            paramtag = doc.createElement("param");
            paramtag.setAttribute("name", "UseProfile");
            paramtag.setAttribute("value", configuration.useProfile);
            host.appendChild(paramtag);
            configuration.style = configuration.style || "report";
            paramtag = doc.createElement("param");
            paramtag.setAttribute("name", "UIStyle");
            paramtag.setAttribute("value", configuration.style);
            host.appendChild(paramtag);
            configuration.messageXmlUrl = combinePath(configuration.path, "res/dextuploadx5-ax-message" + (x5lang ? "-" + x5lang : "") + ".xml");
            paramtag = doc.createElement("param");
            paramtag.setAttribute("name", "MessageXMLURL");
            paramtag.setAttribute("value", configuration.messageXmlUrl);
            host.appendChild(paramtag);
            paramtag = doc.createElement("param");
            paramtag.setAttribute("name", "EnableDragDrop");
            paramtag.setAttribute("value", configuration.enableDnd);
            host.appendChild(paramtag);
            paramtag = doc.createElement("param");
            paramtag.setAttribute("name", "EnableDeleteKey");
            paramtag.setAttribute("value", configuration.enableDeleteKey);
            host.appendChild(paramtag);
            paramtag = doc.createElement("param");
            paramtag.setAttribute("name", "EnableSortColumn");
            paramtag.setAttribute("value", configuration.enableSortColumn);
            host.appendChild(paramtag);
            paramtag = doc.createElement("param");
            paramtag.setAttribute("name", "SortPriorityVirtualFile");
            paramtag.setAttribute("value", configuration.sortPriorityVirtualFile);
            host.appendChild(paramtag);
            paramtag = doc.createElement("param");
            paramtag.setAttribute("name", "AutoSortType");
            paramtag.setAttribute("value", configuration.autoSortType);
            host.appendChild(paramtag);
            if (configuration.splitStr) {
                paramtag = doc.createElement("param");
                paramtag.setAttribute("name", "SplitStr");
                paramtag.setAttribute("value", configuration.splitStr);
                host.appendChild(paramtag);
            }
            if (configuration.emptyStr) {
                paramtag = doc.createElement("param");
                paramtag.setAttribute("name", "EmptyStr");
                paramtag.setAttribute("value", configuration.emptyStr);
                host.appendChild(paramtag);
            }
            if (configuration.fileDialogTitle) {
                paramtag = doc.createElement("param");
                paramtag.setAttribute("name", "FileDialogTitle");
                paramtag.setAttribute("value", configuration.fileDialogTitle);
                host.appendChild(paramtag);
            }
            if (configuration.folderDialogTitle) {
                paramtag = doc.createElement("param");
                paramtag.setAttribute("name", "FolderDialogTitle");
                paramtag.setAttribute("value", configuration.folderDialogTitle);
                host.appendChild(paramtag);
            }
            if (configuration.filterWhite) {
                paramtag = doc.createElement("param");
                paramtag.setAttribute("name", "FilterWhite");
                paramtag.setAttribute("value", configuration.filterWhite);
                host.appendChild(paramtag);
            }
            if (configuration.filterBlack) {
                paramtag = doc.createElement("param");
                paramtag.setAttribute("name", "FilterBlack");
                paramtag.setAttribute("value", configuration.filterBlack);
                host.appendChild(paramtag);
            }
            paramtag = doc.createElement("param");
            paramtag.setAttribute("name", "ExtractEXIF");
            paramtag.setAttribute("value", configuration.extractEXIF);
            host.appendChild(paramtag);
            paramtag = doc.createElement("param");
            paramtag.setAttribute("name", "EnableUploadHiddenItem");
            paramtag.setAttribute("value", configuration.enableUploadHiddenItem);
            host.appendChild(paramtag);
            paramtag = doc.createElement("param");
            paramtag.setAttribute("name", "OverWriteMode");
            paramtag.setAttribute("value", configuration.overwriteMode.toUpperCase());
            host.appendChild(paramtag);
            paramtag = doc.createElement("param");
            paramtag.setAttribute("name", "DownloadHTTPMethod");
            paramtag.setAttribute("value", configuration.downloadHTTPMethod.toUpperCase());
            host.appendChild(paramtag);
            if (configuration.limitNetSpeed) {
                paramtag = doc.createElement("param");
                paramtag.setAttribute("name", "NetSpeedLimit");
                paramtag.setAttribute("value", configuration.limitNetSpeed.toString());
                host.appendChild(paramtag);
            }
            paramtag = doc.createElement("param");
            paramtag.setAttribute("name", "ShowGridLine");
            paramtag.setAttribute("value", configuration.showGridLine);
            host.appendChild(paramtag);
            paramtag = doc.createElement("param");
            paramtag.setAttribute("name", "ShowOnlyTitle");
            paramtag.setAttribute("value", configuration.showOnlyTitle);
            host.appendChild(paramtag);
            paramtag = doc.createElement("param");
            paramtag.setAttribute("name", "ShowTreeStyle");
            paramtag.setAttribute("value", configuration.showTreeStyle);
            host.appendChild(paramtag);
            paramtag = doc.createElement("param");
            paramtag.setAttribute("name", "ListShowProgress");
            paramtag.setAttribute("value", configuration.listShowProgress);
            host.appendChild(paramtag);
            if (configuration.listUIColorPattern) {
                paramtag = doc.createElement("param");
                paramtag.setAttribute("name", "ListUIColorPattern");
                paramtag.setAttribute("value", configuration.listUIColorPattern.toString());
                host.appendChild(paramtag);
            }
            if (configuration.listStatusImagePattern) {
                paramtag = doc.createElement("param");
                paramtag.setAttribute("name", "ListStatusImagePattern");
                paramtag.setAttribute("value", configuration.listStatusImagePattern.toString());
                host.appendChild(paramtag);
            }
            if (configuration.progressType) {
                paramtag = doc.createElement("param");
                paramtag.setAttribute("name", "UpDownUIType");
                paramtag.setAttribute("value", configuration.progressType.toString());
                host.appendChild(paramtag);
            }
            if (configuration.compressTitle) {
                paramtag = doc.createElement("param");
                paramtag.setAttribute("name", "CompressDlgTitle");
                paramtag.setAttribute("value", configuration.compressTitle);
                host.appendChild(paramtag);
            }
            if (configuration.compressSavePath) {
                paramtag = doc.createElement("param");
                paramtag.setAttribute("name", "CompressSavePath");
                paramtag.setAttribute("value", configuration.compressSavePath);
                host.appendChild(paramtag);
            }
            if (configuration.compressFileTitle) {
                paramtag = doc.createElement("param");
                paramtag.setAttribute("name", "CompressSaveTitle");
                paramtag.setAttribute("value", configuration.compressFileTitle);
                host.appendChild(paramtag);
            }
            if (configuration.compressType) {
                paramtag = doc.createElement("param");
                paramtag.setAttribute("name", "CompressType");
                paramtag.setAttribute("value", configuration.compressType);
                host.appendChild(paramtag);
            }
            paramtag = doc.createElement("param");
            paramtag.setAttribute("name", "AutoInsertAfterCompress");
            paramtag.setAttribute("value", configuration.compressAutoInserting.toString());
            host.appendChild(paramtag);
            paramtag = doc.createElement("param");
            paramtag.setAttribute("name", "EnsureCompressFile");
            paramtag.setAttribute("value", configuration.compressEnsuringFile.toString());
            host.appendChild(paramtag);
            paramtag = doc.createElement("param");
            paramtag.setAttribute("name", "AutoDeleteCompressFile");
            paramtag.setAttribute("value", configuration.compressAutoDeleting.toString());
            host.appendChild(paramtag);
            if (configuration.encryptionTitle) {
                paramtag = doc.createElement("param");
                paramtag.setAttribute("name", "EncryptionDlgTitle");
                paramtag.setAttribute("value", configuration.encryptionTitle);
                host.appendChild(paramtag);
            }
            if (configuration.encryptionSavePath) {
                paramtag = doc.createElement("param");
                paramtag.setAttribute("name", "EncryptionSavePath");
                paramtag.setAttribute("value", configuration.encryptionSavePath);
                host.appendChild(paramtag);
            }
            if (configuration.encryptionPrefix) {
                paramtag = doc.createElement("param");
                paramtag.setAttribute("name", "EncryptionPrefix");
                paramtag.setAttribute("value", configuration.encryptionPrefix);
                host.appendChild(paramtag);
            }
            paramtag = doc.createElement("param");
            paramtag.setAttribute("name", "AutoInsertAfterEncryption");
            paramtag.setAttribute("value", configuration.encryptionAutoInserting.toString());
            host.appendChild(paramtag);
            paramtag = doc.createElement("param");
            paramtag.setAttribute("name", "EnsureEncryptionFile");
            paramtag.setAttribute("value", configuration.encryptionEnsuringFile.toString());
            host.appendChild(paramtag);
            paramtag = doc.createElement("param");
            paramtag.setAttribute("name", "AutoDeleteEncryptionFile");
            paramtag.setAttribute("value", configuration.encryptionAutoDeleting.toString());
            host.appendChild(paramtag);
            if (configuration.decryptionTitle) {
                paramtag = doc.createElement("param");
                paramtag.setAttribute("name", "DecryptionDlgTitle");
                paramtag.setAttribute("value", configuration.decryptionTitle);
                host.appendChild(paramtag);
            }
            if (configuration.decryptionSavePath) {
                paramtag = doc.createElement("param");
                paramtag.setAttribute("name", "DecryptionSavePath");
                paramtag.setAttribute("value", configuration.decryptionSavePath);
                host.appendChild(paramtag);
            }
            paramtag = doc.createElement("param");
            paramtag.setAttribute("name", "EnsureDecryptionFile");
            paramtag.setAttribute("value", configuration.decryptionEnsuringFile.toString());
            host.appendChild(paramtag);
            paramtag = doc.createElement("param");
            paramtag.setAttribute("name", "EnablePreview");
            paramtag.setAttribute("value", configuration.enablePreview.toString());
            host.appendChild(paramtag);
            if (configuration.previewBgColor) {
                paramtag = doc.createElement("param");
                paramtag.setAttribute("name", "PreviewBgColor");
                paramtag.setAttribute("value", configuration.previewBgColor);
                host.appendChild(paramtag);
            }
            paramtag = doc.createElement("param");
            paramtag.setAttribute("name", "EnableAutomakeThumbnail");
            paramtag.setAttribute("value", configuration.thumbnailAutoMaking.toString());
            host.appendChild(paramtag);
            if (configuration.thumbnailWidth) {
                paramtag = doc.createElement("param");
                paramtag.setAttribute("name", "ThumbnailWidth");
                paramtag.setAttribute("value", configuration.thumbnailWidth.toString());
                host.appendChild(paramtag);
            }
            if (configuration.thumbnailHeight) {
                paramtag = doc.createElement("param");
                paramtag.setAttribute("name", "ThumbnailHeight");
                paramtag.setAttribute("value", configuration.thumbnailHeight.toString());
                host.appendChild(paramtag);
            }
            paramtag = doc.createElement("param");
            paramtag.setAttribute("name", "ThumbnailAutoRatio");
            paramtag.setAttribute("value", configuration.thumbnailAspectRatio.toString());
            host.appendChild(paramtag);
            paramtag = doc.createElement("param");
            paramtag.setAttribute("name", "ThumbnailAutoDelete");
            paramtag.setAttribute("value", configuration.thumbnailAutoDeleting.toString());
            host.appendChild(paramtag);
            paramtag = doc.createElement("param");
            paramtag.setAttribute("name", "ThumbnailAutoRotate");
            paramtag.setAttribute("value", configuration.thumbnailAutoRotating.toString());
            host.appendChild(paramtag);
            if (configuration.thumbnailSavePath) {
                paramtag = doc.createElement("param");
                paramtag.setAttribute("name", "ThumbnailSavePath");
                paramtag.setAttribute("value", configuration.thumbnailSavePath);
                host.appendChild(paramtag);
            }
            if (configuration.thumbnailPrefix) {
                paramtag = doc.createElement("param");
                paramtag.setAttribute("name", "ThumbnailPrevTitle");
                paramtag.setAttribute("value", configuration.thumbnailPrefix);
                host.appendChild(paramtag);
            }
            if (configuration.thumbnailFormat) {
                paramtag = doc.createElement("param");
                paramtag.setAttribute("name", "ThumbnailImageExt");
                paramtag.setAttribute("value", configuration.thumbnailFormat);
                host.appendChild(paramtag);
            }
            if (configuration.tempExecutingPath) {
                paramtag = doc.createElement("param");
                paramtag.setAttribute("name", "TempPathForExecute");
                paramtag.setAttribute("value", configuration.tempExecutingPath);
                host.appendChild(paramtag);
            }
            if (configuration.headerColorNormalTop) {
                paramtag = doc.createElement("param");
                paramtag.setAttribute("name", "ListHeaderColorNormalTop");
                paramtag.setAttribute("value", configuration.headerColorNormalTop);
                host.appendChild(paramtag);
            }
            if (configuration.headerColorNormalBottom) {
                paramtag = doc.createElement("param");
                paramtag.setAttribute("name", "ListHeaderColorNormalBottom");
                paramtag.setAttribute("value", configuration.headerColorNormalBottom);
                host.appendChild(paramtag);
            }
            if (configuration.headerColorPushTop) {
                paramtag = doc.createElement("param");
                paramtag.setAttribute("name", "ListHeaderColorPushTop");
                paramtag.setAttribute("value", configuration.headerColorPushTop);
                host.appendChild(paramtag);
            }
            if (configuration.headerColorPushBottom) {
                paramtag = doc.createElement("param");
                paramtag.setAttribute("name", "ListHeaderColorPushBottom");
                paramtag.setAttribute("value", configuration.headerColorPushBottom);
                host.appendChild(paramtag);
            }
            if (configuration.headerHeight) {
                paramtag = doc.createElement("param");
                paramtag.setAttribute("name", "ListHeaderHeight");
                paramtag.setAttribute("value", configuration.headerHeight.toString());
                host.appendChild(paramtag);
            }
            if (configuration.itemHeight) {
                paramtag = doc.createElement("param");
                paramtag.setAttribute("name", "ListItemHeight");
                paramtag.setAttribute("value", configuration.itemHeight.toString());
                host.appendChild(paramtag);
            }
            if (configuration.backgroundImageURL) {
                paramtag = doc.createElement("param");
                paramtag.setAttribute("name", "ListBkImageURL");
                paramtag.setAttribute("value", configuration.backgroundImageURL);
                host.appendChild(paramtag);
            }
            if (configuration.textColor) {
                paramtag = doc.createElement("param");
                paramtag.setAttribute("name", "ListCustomTextColor");
                paramtag.setAttribute("value", configuration.textColor);
                host.appendChild(paramtag);
            }
            if (configuration.backgroundColor) {
                paramtag = doc.createElement("param");
                paramtag.setAttribute("name", "ListCustomBkColor");
                paramtag.setAttribute("value", configuration.backgroundColor);
                host.appendChild(paramtag);
            }
            if (configuration.gridLineColor) {
                paramtag = doc.createElement("param");
                paramtag.setAttribute("name", "ListGridLineColor");
                paramtag.setAttribute("value", configuration.gridLineColor);
                host.appendChild(paramtag);
            }
            paramtag = doc.createElement("param");
            paramtag.setAttribute("name", "LimitFileCount");
            paramtag.setAttribute("value", configuration.limitFileCount.toString());
            host.appendChild(paramtag);
            paramtag = doc.createElement("param");
            paramtag.setAttribute("name", "LimitFileSizeMin");
            paramtag.setAttribute("value", configuration.limitFileMinSize.toString());
            host.appendChild(paramtag);
            paramtag = doc.createElement("param");
            paramtag.setAttribute("name", "LimitFileSizeMax");
            paramtag.setAttribute("value", configuration.limitFileMaxSize.toString());
            host.appendChild(paramtag);
            paramtag = doc.createElement("param");
            paramtag.setAttribute("name", "LimitTotalFileSize");
            paramtag.setAttribute("value", configuration.limitTotalFileSize.toString());
            host.appendChild(paramtag);
            paramtag = doc.createElement("param");
            paramtag.setAttribute("name", "LimitCheckInSilence");
            paramtag.setAttribute("value", configuration.filterSilence.toString());
            host.appendChild(paramtag);
            paramtag = doc.createElement("param");
            paramtag.setAttribute("name", "PermitDuplicateItem");
            paramtag.setAttribute("value", configuration.duplicable.toString());
            host.appendChild(paramtag);
            host.classid = "CLSID:A0C72065-9C0A-4570-A4ED-3AB5D4951B20";
        } else {
            errorFromX5(configuration.id || "undefined", 3, "The mode of the 'create' method's parameter object is only 'multi' or 'ie'.");
            return null;
        }
        container.appendChild(host);
        if (win.dx5.browser.isIE == true && isDefined(win.dialogArguments)) {
            if (isDefined(win.attachEvent)) {
                host.attachEvent("onDX5_AX_Error", win.onDX5_AX_Error);
                host.attachEvent("onDX5_AX_Created", win.onDX5_AX_Created);
                host.attachEvent("onDX5_AX_BeforeItemsAdd", win.onDX5_AX_BeforeItemsAdd);
                host.attachEvent("onDX5_AX_ItemAdding", win.onDX5_AX_ItemAdding);
                host.attachEvent("onDX5_AX_ItemsAdded", win.onDX5_AX_ItemsAdded);
                host.attachEvent("onDX5_AX_BeforeItemsDelete", win.onDX5_AX_BeforeItemsDelete);
                host.attachEvent("onDX5_AX_ItemDeleting", win.onDX5_AX_ItemDeleting);
                host.attachEvent("onDX5_AX_ItemsDeleted", win.onDX5_AX_ItemsDeleted);
                host.attachEvent("onDX5_AX_ItemSelected", win.onDX5_AX_ItemSelected);
                host.attachEvent("onDX5_AX_ItemClick", win.onDX5_AX_ItemClick);
                host.attachEvent("onDX5_AX_ItemDbClick", win.onDX5_AX_ItemDbClick);
                host.attachEvent("onDX5_AX_UploadBegin", win.onDX5_AX_UploadBegin);
                host.attachEvent("onDX5_AX_UploadItemStart", win.onDX5_AX_UploadItemStart);
                host.attachEvent("onDX5_AX_UploadItemEnd", win.onDX5_AX_UploadItemEnd);
                host.attachEvent("onDX5_AX_UploadComplete", win.onDX5_AX_UploadComplete);
                host.attachEvent("onDX5_AX_UploadStop", win.onDX5_AX_UploadStop);
                host.attachEvent("onDX5_AX_DownloadBegin", win.onDX5_AX_DownloadBegin);
                host.attachEvent("onDX5_AX_DownloadItemStart", win.onDX5_AX_DownloadItemStart);
                host.attachEvent("onDX5_AX_DownloadItemEnd", win.onDX5_AX_DownloadItemEnd);
                host.attachEvent("onDX5_AX_DownloadComplete", win.onDX5_AX_DownloadComplete);
                host.attachEvent("onDX5_AX_DownloadStop", win.onDX5_AX_DownloadStop);
                host.attachEvent("onDX5_AX_CompressComplete", win.onDX5_AX_CompressComplete);
                host.attachEvent("onDX5_AX_EncryptionComplete", win.onDX5_AX_EncryptionComplete);
                host.attachEvent("onDX5_AX_DecryptionComplete", win.onDX5_AX_DecryptionComplete);
            } else {
                document.head.appendChild(document.createTextNode("<script type=\"text/javascript\" for=\"" + host.id + "\" event=\"onDX5_AX_Error(vObjectID, vError)\">window.onDX5_AX_Error(vObjectID, vError);</script>"));
                document.head.appendChild(document.createTextNode("<script type=\"text/javascript\" for=\"" + host.id + "\" event=\"onDX5_AX_Created(vObjectID)\">window.onDX5_AX_Created(vObjectID);</script>"));
                document.head.appendChild(document.createTextNode("<script type=\"text/javascript\" for=\"" + host.id + "\" event=\"onDX5_AX_BeforeItemsAdd(vObjectID, vItemCnt)\">window.onDX5_AX_BeforeItemsAdd(vObjectID, vItemCnt);</script>"));
                document.head.appendChild(document.createTextNode("<script type=\"text/javascript\" for=\"" + host.id + "\" event=\"onDX5_AX_ItemAdding(vObjectID, vItemObj)\">window.onDX5_AX_ItemAdding(vObjectID, vItemObj);</script>"));
                document.head.appendChild(document.createTextNode("<script type=\"text/javascript\" for=\"" + host.id + "\" event=\"onDX5_AX_ItemsAdded(vObjectID, vAddedItemsCnt)\">window.onDX5_AX_ItemsAdded(vObjectID, vAddedItemsCnt);</script>"));
                document.head.appendChild(document.createTextNode("<script type=\"text/javascript\" for=\"" + host.id + "\" event=\"onDX5_AX_BeforeItemsDelete(vObjectID, vItemIds)\">window.onDX5_AX_BeforeItemsDelete(vObjectID, vItemIds);</script>"));
                document.head.appendChild(document.createTextNode("<script type=\"text/javascript\" for=\"" + host.id + "\" event=\"onDX5_AX_ItemDeleting(vObjectID, vItemId)\">window.onDX5_AX_ItemDeleting(vObjectID, vItemId);</script>"));
                document.head.appendChild(document.createTextNode("<script type=\"text/javascript\" for=\"" + host.id + "\" event=\"onDX5_AX_ItemsDeleted(vObjectID, vItemCnt)\">window.onDX5_AX_ItemsDeleted(vObjectID, vItemCnt);</script>"));
                document.head.appendChild(document.createTextNode("<script type=\"text/javascript\" for=\"" + host.id + "\" event=\"onDX5_AX_ItemSelected(vObjectID, vItemListIndex, vItemUniqID, vItemType)\">window.onDX5_AX_ItemSelected(vObjectID, vItemListIndex, vItemUniqID, vItemType);</script>"));
                document.head.appendChild(document.createTextNode("<script type=\"text/javascript\" for=\"" + host.id + "\" event=\"onDX5_AX_ItemClick(vObjectID, vItemListIndex, vItemUniqID, vItemType)\">window.onDX5_AX_ItemClick(vObjectID, vItemListIndex, vItemUniqID, vItemType);</script>"));
                document.head.appendChild(document.createTextNode("<script type=\"text/javascript\" for=\"" + host.id + "\" event=\"onDX5_AX_ItemDbClick(vObjectID, vItemListIndex, vItemUniqID, vItemType)\">window.onDX5_AX_ItemDbClick(vObjectID, vItemListIndex, vItemUniqID, vItemType);</script>"));
                document.head.appendChild(document.createTextNode("<script type=\"text/javascript\" for=\"" + host.id + "\" event=\"onDX5_AX_UploadBegin(vObjectID)\">window.onDX5_AX_UploadBegin(vObjectID);</script>"));
                document.head.appendChild(document.createTextNode("<script type=\"text/javascript\" for=\"" + host.id + "\" event=\"onDX5_AX_UploadItemStart(vObjectID, vItemID)\">window.onDX5_AX_UploadItemStart(vObjectID, vItemID);</script>"));
                document.head.appendChild(document.createTextNode("<script type=\"text/javascript\" for=\"" + host.id + "\" event=\"onDX5_AX_UploadItemEnd(vObjectID, vItemID)\">window.onDX5_AX_UploadItemEnd(vObjectID, vItemID);</script>"));
                document.head.appendChild(document.createTextNode("<script type=\"text/javascript\" for=\"" + host.id + "\" event=\"onDX5_AX_UploadComplete(vObjectID)\">window.onDX5_AX_UploadComplete(vObjectID);</script>"));
                document.head.appendChild(document.createTextNode("<script type=\"text/javascript\" for=\"" + host.id + "\" event=\"onDX5_AX_UploadStop(vObjectID)\">window.onDX5_AX_UploadStop(vObjectID);</script>"));
                document.head.appendChild(document.createTextNode("<script type=\"text/javascript\" for=\"" + host.id + "\" event=\"onDX5_AX_DownloadBegin(vObjectID)\">window.onDX5_AX_DownloadBegin(vObjectID);</script>"));
                document.head.appendChild(document.createTextNode("<script type=\"text/javascript\" for=\"" + host.id + "\" event=\"onDX5_AX_DownloadItemStart(vObjectID, vItemID)\">window.onDX5_AX_DownloadItemStart(vObjectID, vItemID);</script>"));
                document.head.appendChild(document.createTextNode("<script type=\"text/javascript\" for=\"" + host.id + "\" event=\"onDX5_AX_DownloadItemEnd(vObjectID, vItemID)\">window.onDX5_AX_DownloadItemEnd(vObjectID, vItemID);</script>"));
                document.head.appendChild(document.createTextNode("<script type=\"text/javascript\" for=\"" + host.id + "\" event=\"onDX5_AX_DownloadComplete(vObjectID)\">window.onDX5_AX_DownloadComplete(vObjectID);</script>"));
                document.head.appendChild(document.createTextNode("<script type=\"text/javascript\" for=\"" + host.id + "\" event=\"onDX5_AX_DownloadStop(vObjectID)\">window.onDX5_AX_DownloadStop(vObjectID);</script>"));
                document.head.appendChild(document.createTextNode("<script type=\"text/javascript\" for=\"" + host.id + "\" event=\"onDX5_AX_CompressComplete(vObjectID)\">window.onDX5_AX_CompressComplete(vObjectID);</script>"));
                document.head.appendChild(document.createTextNode("<script type=\"text/javascript\" for=\"" + host.id + "\" event=\"onDX5_AX_EncryptionComplete(vObjectID)\">window.onDX5_AX_EncryptionComplete(vObjectID);</script>"));
                document.head.appendChild(document.createTextNode("<script type=\"text/javascript\" for=\"" + host.id + "\" event=\"onDX5_AX_DecryptionComplete(vObjectID)\">window.onDX5_AX_DecryptionComplete(vObjectID);</script>"));
            }
        }
        var wrapper = {
            mode: configuration.mode,
            domObject: host,
            dndObject: null,
            component: null
        };
        win.dx5.instances[host.id] = wrapper;
        win.dx5.setup(configuration, 0);
        return host;
    };
    win.dx5.canonicalize = function(relative) {
        var lstSlashIndex = location.pathname.lastIndexOf("/"),
            parent = location.pathname.substring(0, lstSlashIndex);
        if (!relative) return location.href;
        while (parent || relative) {
            if (relative.indexOf("/") == 0) {
                parent = "";
                relative = relative.substring(1);
            } else if (relative.indexOf("./") == 0) {
                relative = relative.substring(2);
            } else if (relative.indexOf("../") == 0) {
                relative = relative.substring(3);
                parent = parent.substring(0, parent.lastIndexOf("/"));
            } else break;
        }
        if (!location.origin) location.origin = location.protocol + "//" + location.host;
        return location.origin + parent + "/" + relative;
    };
    win.dx5.isHDAvailable = function(success, fail) {
        callHDS(1, {}, function(data) {
            var res = JSON.parse(data);
            if (res.rc === 0) {
                if (success && typeof success === "function") {
                    success(res.rd);
                }
            } else {
                if (fail && typeof fail === "function") {
                    fail(res.ec, res.em);
                }
            }
        }, function(ecode, err) {
            if (fail && typeof fail === "function") {
                fail(ecode, err);
            }
        });
    };
    win.dx5.isHDRunning = function(success, fail) {
        callHDM(1, {}, function(data) {
            var res = JSON.parse(data);
            if (res.rc === 0) {
                if (success && typeof success === "function") {
                    success(res.rd);
                }
            } else {
                if (fail && typeof fail === "function") {
                    fail(res.ec, res.em);
                }
            }
        }, function(ecode, err) {
            if (fail && typeof fail === "function") {
                fail(ecode, err);
            }
        });
    };
    if (!win.dx5.browser) {
        win.dx5.browser = detectBrowser();
    }
})(window);
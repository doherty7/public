﻿/*
 * DEXTUploadX5 - File upload/download library
 * http://www.dextsolution.com
 *
 * Includes aes.js
 * http://code.google.com/p/crypto-js
 *
 * Copyright DEVPIA Inc.
 */
;;
(function(win) {
    if (!(win.Blob && win.File && win.FileList && win.FileReader)) {
        console.log("DX5: Blob, File, FileList, FileReader not supported.");
        return;
    }
    if (!(win.DX5FileItem && win.DX5FileList && win.DX5UploadStatus && win.DX5DownloadStatus)) {
        console.log("DX5: Essential classes not defined.");
        return;
    }
    var FC = function() {
        this.REQUEST_MEHTOD_UPLOAD = "POST";
        this.controlId = "";
        this.licenseKey = "";
        this.acting = false;
        this.uploadUrl = "";
        this.compressURL = "";
        this.userFormData = {};
        this.response = [];
        this.isDoneResponse = true;
        this.isPHP = false;
        this.cumulative = 0;
        this.uploadMode = "ORAF";
        this.chunkedBlock = (10 * 1024 * 1024);
        this.resuming = true;
        this.splitString = "[SPLT]";
        this.emptyString = "[EMPTY]";
        this.ufiles = new DX5FileList();
        this.xfiles = new DX5FileList();
        this.upQueue = new DX5FileList();
        this.upstatus = new DX5UploadStatus();
        this.downQueue = new DX5FileList();
        this.downstatus = new DX5DownloadStatus();
        this.compressXHR = null;
        this.browser = null;
        this.limitMDSize = (1024 * 1024 * 100);
        this.customHeaders = {};
        this.credential = false;
        this.onerror = null;
        this.onbegin = null;
        this.onitemstart = null;
        this.onprogress = null;
        this.onitemend = null;
        this.oncomplete = null;
        this.oncancel = null;
        this.ondownloadbegin = null;
        this.ondownloaditemstart = null;
        this.ondownloadprogress = null;
        this.ondownloaditemend = null;
        this.ondownloadcomplete = null;
        this.ondownloadcancel = null;
        this.oncompressbegin = null;
        this.oncompresscomplete = null;
        this.oncompresscancel = null;
    };
    FC.prototype = (function() {
        var LS = win.localStorage;
        var throwError = function(eg, code, msg, params) {
            if (eg && eg.onerror && typeof(eg.onerror) == "function") {
                eg.onerror(code, msg, params);
            }
        };
        var createId = function(seed) {
            return "DX5-" + new Date().getTime() + "-" + seed.toString(16);
        };
        var createFI = function(ctrId, id, file, vindex, type, name, size) {
            var f = new DX5FileItem();
            f.controlId = ctrId;
            f.ofile = file;
            if (file.lastModified) {
                f.mdate = new Date(file.lastModified);
            } else {
                f.mdate = file.lastModifiedDate || new Date();
            }
            f.id = id;
            f.vindex = vindex;
            f.type = type;
            f.name = name;
            f.size = size;
            f.status = "WAIT";
            return f;
        };
        var transferORAF = function(engine) {
            if (engine.upQueue.length == 0) {
                return;
            }
            var fd = new FormData();
            engine.upstatus.currentItem = null;
            if (engine.upstatus.totalCount == 1) {
                engine.upstatus.currentName = engine.upQueue[0].name;
            } else if (engine.upstatus.totalCount == 2) {
                engine.upstatus.currentName = engine.upQueue[0].name + " + 1 file";
            } else if (engine.upstatus.totalCount > 2) {
                engine.upstatus.currentName = engine.upQueue[0].name + " + " + (engine.upstatus.totalCount - 1) + " files";
            } else {
                engine.upstatus.currentName = "";
            }
            fd.append("DEXTUploadX5_AuthKey", engine.licenseKey);
            for (var i = 0, len = engine.upQueue.length, cf = null; i < len; i++) {
                cf = engine.upQueue[i];
                fd.append(engine.isPHP ? "DEXTUploadX5_ControlId[]" : "DEXTUploadX5_ControlId", (cf.controlId || engine.controlId));
                fd.append(engine.isPHP ? "DEXTUploadX5_UniqueId[]" : "DEXTUploadX5_UniqueId", cf.id);
                fd.append(engine.isPHP ? "DEXTUploadX5_Folder[]" : "DEXTUploadX5_Folder", cf.middlePath);
                fd.append(engine.isPHP ? "DEXTUploadX5_EXIFData[]" : "DEXTUploadX5_EXIFData", "");
                fd.append(engine.isPHP ? "DEXTUploadX5_FileData[]" : "DEXTUploadX5_FileData", cf.ofile);
                var metaStrings = [];
                for (var metaName in cf.meta) {
                    metaStrings.push(metaName + engine.splitString + cf.meta[metaName]);
                }
                fd.append(engine.isPHP ? "DEXTUploadX5_MetaData[]" : "DEXTUploadX5_MetaData", metaStrings.join(engine.splitString));
            }
            engine.upstatus.xhr = new XMLHttpRequest();
            attachORAFEvents(engine, engine.upstatus.xhr);
            try {
                engine.upstatus.xhr.open(engine.REQUEST_MEHTOD_UPLOAD, engine.uploadUrl, true);
                engine.upstatus.xhr.withCredentials = (engine.credential === true);
                if (engine.customHeaders)
                    for (var h in engine.customHeaders) {
                        engine.upstatus.xhr.setRequestHeader(h, engine.customHeaders[h]);
                    }
                engine.upstatus.xhr.send(fd);
            } catch (ex) {
                engine.acting = false;
                throwError(engine, "ESVG-00018", "_파일 업로드 진행 중 오류가 발생했습니다.\n{0}\n{1}\n{2}", ["Type: ORAF", "Target: " + engine.uploadUrl, ex.message]);
            }
        };
        var attachORAFEvents = function(engine, xhr) {
            xhr.addEventListener("loadstart", function(e) {
                this.removeEventListener("loadstart", arguments.callee);
                engine.upstatus.uploadStartTime = Date.now();
                engine.upstatus.uploadCountTime = 0;
                if (engine.onitemstart && typeof(engine.onitemstart) == "function") {
                    engine.onitemstart(engine.upstatus);
                }
            }, false);
            xhr.upload.addEventListener("progress", function(e) {
                if (e.lengthComputable && engine.onprogress && typeof(engine.onprogress) == "function") {
                    engine.upstatus.currentSize = e.total;
                    engine.upstatus.currentSendSize = e.loaded;
                    engine.upstatus.totalSize = e.total;
                    engine.upstatus.totalSendSize = e.loaded;
                    engine.upstatus.uploadCountTime = Date.now() - engine.upstatus.uploadStartTime;
                    engine.onprogress(engine.upstatus);
                }
            }, false);
            xhr.addEventListener("error", function(e) {
                engine.acting = false;
                throwError(engine, "ESVG-00019", "_파일 업로드 진행 중 오류가 발생했습니다.\n{0}\n{1}\n{2}\n{3}", ["ORAF Target: " + engine.uploadUrl, xhr.status, xhr.statusText, e.message]);
            }, false);
            xhr.addEventListener("abort", function(e) {
                engine.acting = false;
                if (engine.oncancel && typeof(engine.oncancel) == "function") {
                    engine.oncancel();
                }
            }, false);
            xhr.addEventListener("timeout", function(e) {
                engine.acting = false;
                throwError(engine, "ESVG-00018", "_파일 업로드 진행 중 오류가 발생했습니다.\n{0}\n{1}\n{2}", [xhr.status, xhr.statusText, xhr.responseText]);
            }, false);
            xhr.addEventListener("load", function(e) {
                if (xhr.status == 200) {
                    for (var i = 0, len = engine.upQueue.length; i < len; i++) {
                        engine.upQueue[i].status = "DONE";
                        engine.upQueue[i].update();
                    }
                    engine.upstatus.completeCount = engine.upstatus.totalCount;
                    engine.response.push(e.target.responseText);
                    if (engine.onitemend && typeof(engine.onitemend) == "function") {
                        engine.onitemend(engine.upstatus, e.target.responseText);
                    }
                } else {
                    engine.acting = false;
                    throwError(engine, "ESVG-00019", "_파일 업로드 진행 중 오류가 발생했습니다.\n{0}\n{1}\n{2}\n{3}", ["ORAF Target: " + engine.uploadUrl, xhr.status, xhr.statusText, xhr.response]);
                }
            }, false);
            xhr.addEventListener("loadend", function(e) {
                engine.acting = false;
                engine.upstatus.xhr = null;
                engine.isDoneResponse = true;
                this.removeEventListener("error", arguments.callee);
                this.removeEventListener("abort", arguments.callee);
                this.removeEventListener("timeout", arguments.callee);
                this.removeEventListener("load", arguments.callee);
                this.removeEventListener("loadend", arguments.callee);
                if (xhr.readyState == 4 && xhr.status == 200) {
                    if (engine.oncomplete && typeof(engine.oncomplete) == "function") {
                        engine.oncomplete();
                    }
                }
            }, false);
        };
        var transferOROF = function(engine) {
            if (engine.upQueue.length == 0) return;
            var fd = new FormData();
            var cf = engine.upQueue.shift();
            engine.upstatus.currentItem = cf;
            engine.upstatus.currentName = cf.name;
            engine.upstatus.currentSize = cf.size;
            fd.append("DEXTUploadX5_AuthKey", engine.licenseKey);
            fd.append("DEXTUploadX5_ControlId", (cf.controlId || engine.controlId));
            fd.append("DEXTUploadX5_UniqueId", cf.id);
            fd.append("DEXTUploadX5_Folder", cf.middlePath);
            fd.append("DEXTUploadX5_EXIFData", "");
            fd.append("DEXTUploadX5_FileData", cf.ofile);
            var metaStrings = [];
            for (var metaName in cf.meta) {
                metaStrings.push(metaName + engine.splitString + cf.meta[metaName]);
            }
            fd.append("DEXTUploadX5_MetaData", metaStrings.join(engine.splitString));
            engine.upstatus.xhr = new XMLHttpRequest();
            attachOROFEvents(engine, engine.upstatus.xhr);
            try {
                engine.upstatus.xhr.open(engine.REQUEST_MEHTOD_UPLOAD, engine.uploadUrl, true);
                engine.upstatus.xhr.withCredentials = (engine.credential === true);
                if (engine.customHeaders)
                    for (var h in engine.customHeaders) {
                        engine.upstatus.xhr.setRequestHeader(h, engine.customHeaders[h]);
                    }
                engine.upstatus.xhr.send(fd);
            } catch (ex) {
                engine.acting = false;
                throwError(engine, "ESVG-00019", "_파일 업로드 진행 중 오류가 발생했습니다.\n{0}\n{1}\n{2}\n{3}", ["Type: OROF", "Target: " + engine.uploadUrl, "File: " + cf.name, ex.message]);
            }
        };
        var attachOROFEvents = function(engine, xhr) {
            xhr.addEventListener("loadstart", function(e) {
                this.removeEventListener("loadstart", arguments.callee);
                engine.upstatus.currentStartTime = Date.now();
                engine.upstatus.currentCountTime = 0;
                if (engine.onitemstart && typeof(engine.onitemstart) == "function") {
                    engine.onitemstart(engine.upstatus);
                }
            }, false);
            xhr.upload.addEventListener("progress", function(e) {
                if (e.lengthComputable && engine.onprogress && typeof(engine.onprogress) == "function") {
                    var diff = e.total - engine.upstatus.currentSize;
                    var real = e.loaded - diff;
                    engine.upstatus.currentSendSize = real;
                    engine.upstatus.totalSendSize = engine.upstatus.totalPrevSendSize + real;
                    engine.upstatus.currentCountTime = Date.now() - engine.upstatus.currentStartTime;
                    engine.onprogress(engine.upstatus);
                }
            }, false);
            xhr.addEventListener("error", function(e) {
                engine.acting = false;
                throwError(engine, "ESVG-00019", "_파일 업로드 진행 중 오류가 발생했습니다.\n{0}\n{1}\n{2}\n{3}", ["OROF Target: " + engine.uploadUrl, xhr.status, xhr.statusText, e.message]);
            }, false);
            xhr.addEventListener("abort", function(e) {
                engine.acting = false;
                if (engine.oncancel && typeof(engine.oncancel) == "function") {
                    engine.oncancel();
                }
            }, false);
            xhr.addEventListener("timeout", function(e) {
                engine.acting = false;
                throwError(engine, "ESVG-00018", "_파일 업로드 진행 중 오류가 발생했습니다.\n{0}\n{1}\n{2}", [xhr.status, xhr.statusText, xhr.responseText]);
            }, false);
            xhr.addEventListener("load", function(e) {
                if (xhr.status == 200) {
                    engine.upstatus.currentItem.status = "DONE";
                    engine.upstatus.currentItem.update();
                    engine.upstatus.currentSendSize = engine.upstatus.currentSize;
                    engine.upstatus.totalPrevSendSize = engine.upstatus.totalPrevSendSize + engine.upstatus.currentSize;
                    engine.upstatus.uploadCountTime += engine.upstatus.currentCountTime;
                    engine.upstatus.currentCountTime = 0;
                    engine.upstatus.completeCount++;
                    engine.response.push(e.target.responseText);
                    if (engine.onitemend && typeof(engine.onitemend) == "function") {
                        engine.onitemend(engine.upstatus, e.target.responseText);
                    }
                } else {
                    engine.acting = false;
                    throwError(engine, "ESVG-00019", "_파일 업로드 진행 중 오류가 발생했습니다.\n{0}\n{1}\n{2}\n{3}", ["OROF Target: " + engine.uploadUrl, xhr.status, xhr.statusText, xhr.response]);
                }
            }, false);
            xhr.addEventListener("loadend", function(e) {
                engine.upstatus.xhr = null;
                this.removeEventListener("error", arguments.callee);
                this.removeEventListener("abort", arguments.callee);
                this.removeEventListener("timeout", arguments.callee);
                this.removeEventListener("load", arguments.callee);
                this.removeEventListener("loadend", arguments.callee);
                if (xhr.readyState == 4 && xhr.status == 200) {
                    if (engine.upQueue.length == 0) {
                        engine.acting = false;
                        engine.isDoneResponse = true;
                        if (engine.oncomplete && typeof(engine.oncomplete) == "function") {
                            engine.oncomplete();
                        }
                    } else {
                        setTimeout(function() {
                            transferOROF(engine);
                        }, 10);
                    }
                } else {
                    engine.acting = false;
                }
            }, false);
        };
        var transferEXNJ = function(engine) {
            var fd = new FormData(),
                status = engine.upstatus,
                storedKey = "",
                actionContent = "",
                startIndex = -1,
                endIndex = -1,
                chunked = 0,
                isLast = false,
                bin = null;
            if (status.currentChunkedAction == "P") {
                if (engine.upQueue.length == 0) return;
                status.clearItem();
                status.currentItem = engine.upQueue.shift();
                status.currentName = status.currentItem.name;
                status.currentSize = status.currentItem.size;
                status.currentLocalKey = encodeURIComponent(status.currentItem.name) + status.currentItem.size + status.currentItem.mdate.getTime().toString();
                storedKey = engine.resuming === true ? LS.getItem(status.currentLocalKey) : "";
                actionContent = sformat("type=preparing\r\nkey={0}\r\nname={1}\r\nlocal=/dx5fakepath/{2}\r\nsize={3}\r\nmodified={4}", [storedKey ? storedKey : "", status.currentItem.name, status.currentItem.name, status.currentItem.size, status.currentItem.mdate.getTime()]);
                fd.append("DEXTUploadX5_AuthKey", engine.licenseKey);
                fd.append("DEXT_EXTENSION_ACTION", actionContent);
            } else {
                var resTokens = status.currentResponseValue.split(/\s*[;]{1}\s*/, 2);
                if (!resTokens || resTokens.length != 2) {
                    engine.acting = false;
                    throwError(engine, "ESVG-00074", "_대용량 파일 업로드의 응답데이터 형식이 잘못되었습니다.\n{0}", [status.currentResponseValue]);
                    return;
                }
                var tokenKey = "",
                    tokenSize = "";
                for (var i = 0, result; i < resTokens.length; i++) {
                    result = resTokens[i].match(/\s*key\s*=\s*(.*)\s*/i);
                    if (result) {
                        tokenKey = result[1];
                        continue;
                    }
                    result = resTokens[i].match(/\s*size\s*=\s*(.*)\s*/i);
                    if (result) {
                        tokenSize = result[1];
                        continue;
                    }
                }
                if (!tokenKey || !tokenSize) {
                    engine.acting = false;
                    throwError(engine, "ESVG-00074", "_대용량 파일 업로드의 응답데이터 형식이 잘못되었습니다.\n{0}", [status.currentResponseValue]);
                    return;
                }
                status.currentServerKey = trim(tokenKey);
                status.currentServerSize = parseInt(trim(tokenSize), 10);
                try {
                    if (engine.resuming === true) {
                        LS.setItem(status.currentLocalKey, status.currentServerKey);
                    }
                } catch (ex1) {
                    var msg = "";
                    if (ex1.message.indexOf("QUOTA_EXCEEDED_ERR") >= 0) {
                        msg = "QUOTA_EXCEEDED_ERR";
                    }
                    engine.acting = false;
                    throwError(engine, "ESVG-00018", "_파일 업로드 진행 중 오류가 발생했습니다.\n{0}\n{1}\n{2}", ["Type: EXNJ", "Target-key: " + status.currentServerKey, msg]);
                    return;
                }
                status.currentSendSize = status.currentServerSize;
                status.currentChunkedSize = Math.min(engine.chunkedBlock, (status.currentSize - status.currentSendSize));
                status.currentChunkedPrevSendSize = status.currentSendSize;
                isLast = (status.currentSize - status.currentSendSize - status.currentChunkedSize) == 0;
                startIndex = status.currentSendSize;
                endIndex = startIndex + status.currentChunkedSize;
                bin = status.currentItem.ofile.slice(startIndex, endIndex);
                actionContent = sformat("type=attaching\r\nkey={0}\r\nname={1}\r\nlocal=/dx5fakepath/{2}\r\nsize={3}\r\nmodified={4}", [status.currentServerKey ? status.currentServerKey : "", status.currentItem.name, status.currentItem.name, status.currentItem.size, status.currentItem.mdate.getTime()]);
                fd.append("DEXTUploadX5_AuthKey", engine.licenseKey);
                fd.append("DEXT_EXTENSION_ACTION", actionContent);
                fd.append("DEXTUploadX5_ControlId", (status.currentItem.controlId || engine.controlId));
                fd.append("DEXTUploadX5_UniqueId", status.currentItem.id);
                fd.append("DEXTUploadX5_Folder", status.currentItem.middlePath);
                fd.append("DEXTUploadX5_EXIFData", "");
                fd.append("DEXTUploadX5_FileData", bin, status.currentItem.name);
                if (isLast) {
                    var metaStrings = [];
                    for (var metaName in status.currentItem.meta) {
                        metaStrings.push(metaName + engine.splitString + status.currentItem.meta[metaName]);
                    }
                    fd.append("DEXTUploadX5_MetaData", metaStrings.join(engine.splitString));
                }
                status.currentChunkedAction = (isLast ? "D" : "A");
            }
            status.xhr = new XMLHttpRequest();
            attachEXNJEvents(engine, status.xhr);
            try {
                status.xhr.open(engine.REQUEST_MEHTOD_UPLOAD, engine.uploadUrl, true);
                status.xhr.withCredentials = (engine.credential === true);
                if (engine.customHeaders)
                    for (var h in engine.customHeaders) {
                        status.xhr.setRequestHeader(h, engine.customHeaders[h]);
                    }
                status.xhr.send(fd);
            } catch (ex) {
                engine.acting = false;
                throwError(engine, "ESVG-00019", "_파일 업로드 진행 중 오류가 발생했습니다.\n{0}\n{1}\n{2}\n{3}", ["Type: EXNJ", "Target: " + engine.uploadUrl, "Action: " + actionContent, ex.message]);
            }
        };
        var attachEXNJEvents = function(engine, xhr) {
            xhr.addEventListener("loadstart", function(e) {
                this.removeEventListener("loadstart", arguments.callee);
                engine.upstatus.chunkedStartTime = Date.now();
                engine.upstatus.chunkedCountTime = 0;
                if (engine.upstatus.currentChunkedAction == "P") {
                    engine.upstatus.currentStartTime = Date.now();
                    engine.upstatus.currentCountTime = 0;
                    if (engine.onitemstart && typeof(engine.onitemstart) == "function") {
                        engine.onitemstart(engine.upstatus);
                    }
                }
            }, false);
            xhr.upload.addEventListener("progress", function(e) {
                if (engine.upstatus.currentChunkedAction == "A" && e.lengthComputable && engine.onprogress && typeof(engine.onprogress) == "function") {
                    var diff = e.total - engine.upstatus.currentChunkedSize;
                    var real = e.loaded - diff;
                    engine.upstatus.currentSendSize = engine.upstatus.currentChunkedPrevSendSize + real;
                    engine.upstatus.totalSendSize = engine.upstatus.totalPrevSendSize + engine.upstatus.currentSendSize;
                    engine.upstatus.chunkedCountTime = Date.now() - engine.upstatus.chunkedStartTime;
                    engine.onprogress(engine.upstatus);
                }
            }, false);
            xhr.addEventListener("error", function(e) {
                engine.acting = false;
                throwError(engine, "ESVG-00019", "_파일 업로드 진행 중 오류가 발생했습니다.\n{0}\n{1}\n{2}\n{3}", ["EXNJ Target: " + engine.uploadUrl, xhr.status, xhr.statusText, e.message]);
            }, false);
            xhr.addEventListener("abort", function(e) {
                engine.acting = false;
                if (engine.oncancel && typeof(engine.oncancel) == "function") {
                    engine.oncancel();
                }
            }, false);
            xhr.addEventListener("timeout", function(e) {
                engine.acting = false;
                throwError(engine, "ESVG-00018", "_파일 업로드 진행 중 오류가 발생했습니다.\n{0}\n{1}\n{2}", [xhr.status, xhr.statusText, xhr.responseText]);
            }, false);
            xhr.addEventListener("load", function(e) {
                if (xhr.status == 200) {
                    engine.upstatus.currentResponseValue = trim(e.target.responseText);
                    if (engine.upstatus.currentChunkedAction == "A") {
                        engine.upstatus.currentCountTime += engine.upstatus.chunkedCountTime;
                        engine.upstatus.chunkedCountTime = 0;
                    } else if (engine.upstatus.currentChunkedAction == "D") {
                        engine.upstatus.currentSendSize = engine.upstatus.currentSize;
                        engine.upstatus.totalSendSize = engine.upstatus.totalPrevSendSize + engine.upstatus.currentSize;
                        engine.upstatus.totalPrevSendSize = engine.upstatus.totalSendSize;
                        engine.upstatus.currentCountTime += engine.upstatus.chunkedCountTime;
                        engine.upstatus.chunkedCountTime = 0;
                        engine.upstatus.uploadCountTime += engine.upstatus.currentCountTime;
                        engine.upstatus.currentCountTime = 0;
                        if (engine.onprogress && typeof(engine.onprogress) == "function") {
                            engine.onprogress(engine.upstatus);
                        }
                        engine.upstatus.currentItem.status = "DONE";
                        engine.upstatus.currentItem.update();
                        engine.upstatus.completeCount++;
                        engine.response.push(e.target.responseText);
                        try {
                            LS.removeItem(engine.upstatus.currentLocalKey);
                        } catch (e) {}
                        if (engine.onitemend && typeof(engine.onitemend) == "function") {
                            engine.onitemend(engine.upstatus, e.target.responseText);
                        }
                    }
                } else {
                    engine.acting = false;
                    throwError(engine, "ESVG-00019", "_파일 업로드 진행 중 오류가 발생했습니다.\n{0}\n{1}\n{2}\n{3}", ["EXNJ Target: " + engine.uploadUrl, xhr.status, xhr.statusText, xhr.response]);
                }
            }, false);
            xhr.addEventListener("loadend", function(e) {
                engine.upstatus.xhr = null;
                this.removeEventListener("error", arguments.callee);
                this.removeEventListener("abort", arguments.callee);
                this.removeEventListener("timeout", arguments.callee);
                this.removeEventListener("load", arguments.callee);
                this.removeEventListener("loadend", arguments.callee);
                if (xhr.readyState == 4 && xhr.status == 200) {
                    if (engine.upQueue.length == 0 && engine.upstatus.currentChunkedAction == "D") {
                        engine.acting = false;
                        engine.isDoneResponse = true;
                        if (engine.oncomplete && typeof(engine.oncomplete) == "function") {
                            engine.oncomplete();
                        }
                    } else {
                        if (engine.upstatus.currentChunkedAction == "P") {
                            engine.upstatus.currentChunkedAction = "A";
                        } else if (engine.upstatus.currentChunkedAction == "D") {
                            engine.upstatus.currentChunkedAction = "P";
                        }
                        setTimeout(function() {
                            transferEXNJ(engine);
                        }, 10);
                    }
                } else {
                    engine.acting = false;
                }
            }, false);
        };
        var downloadURI = function(url, name) {
            var oAnchor = document.getElementById("XHTML-DOWNLOAD-LINK");
            if ("download" in oAnchor) {
                oAnchor.href = url;
                if (name) {
                    oAnchor.download = name;
                }
                oAnchor.target = "XHTML-DOWNLOAD-FRAME";
                oAnchor.click();
            } else {
                var oframe = document.getElementById("XHTML-DOWNLOAD-FRAME");
                oframe.src = url;
            }
        };
        var downloadSingle = function(engine, target) {
            try {
                AJAX(target.downUrl, "head", {
                    load: function(res) {
                        downloadURI(target.downUrl, target.name);
                    },
                    abort: function() {},
                    error: function(status, msg) {
                        throwError(engine, "ESVG-00021", "_파일 다운로드 진행 중 오류가 발생했습니다.\n{0}\n{1}\n{2}\n{3}", ["Type: Single", "Target: " + target.downUrl, "Respone-status: " + status, msg]);
                    }
                }, "text", undefined, undefined, engine.credential, true);
            } catch (ex) {
                throwError(engine, "ESVG-00020", "파일 다운로드 진행 중 오류가 발생했습니다.\n{0}\n{1}\n{2}", ["Type: Single", "Target: " + target.downUrl, ex.message]);
            }
        };
        var downloadQueue = function(engine) {
            if (engine.downQueue.length == 0) {
                engine.acting = false;
                return;
            }
            var cf = engine.downQueue.shift();
            if (authenticate(engine, engine.licenseKey, cf.downUrl) != true) {
                engine.acting = false;
                return;
            }
            engine.downstatus.currentItem = cf;
            engine.downstatus.currentName = cf.name;
            engine.downstatus.currentSize = cf.size;
            try {
                var xhr = AJAX(cf.downUrl, "get", {
                    header: function() {
                        if (getDomain(xhr.responseURL) != getDomain(cf.downUrl)) {
                            console.log("DX5: Response redirection to " + xhr.responseURL);
                            if (authenticate(engine, engine.licenseKey, xhr.responseURL) != true) {
                                try {
                                    xhr.abort();
                                    engine.acting = false;
                                } catch (ex) {
                                    engine.acting = false;
                                    throwError(engine, "ESVG-00025", "_파일 전송을 중지하는 과정에서 오류가 발생했습니다.\n{0}", [ex.message]);
                                }
                                return;
                            }
                        }
                        var strLen = xhr.getResponseHeader("Content-Length");
                        var flen = parseInt(strLen, 10);
                        if (!isNaN(flen) && isFinite(flen)) {
                            if (flen != engine.downstatus.currentSize) {
                                console.log(sformat("DX5: {0}'s length[{1}] does not equal the Content-Length[{2}] of the response.", [engine.downstatus.currentName, engine.downstatus.currentSize, strLen]));
                                engine.downstatus.totalSize = engine.downstatus.totalSize - engine.downstatus.currentSize + flen;
                                engine.downstatus.currentSize = flen;
                            }
                        } else {
                            console.log(sformat("DX5: {0} Content-Length missing", [engine.downstatus.currentName]));
                            console.log(sformat("DX5: {0} Transfer-Encoding: {1}", [engine.downstatus.currentName, xhr.getResponseHeader("Transfer-Encoding")]));
                        }
                    },
                    start: function(evt) {
                        engine.downstatus.currentStartTime = Date.now();
                        engine.downstatus.currentCountTime = 0;
                        if (engine.ondownloaditemstart && typeof(engine.ondownloaditemstart) == "function") {
                            engine.ondownloaditemstart(engine.downstatus);
                        }
                    },
                    progress: function(evt) {
                        if (engine.ondownloadprogress && typeof(engine.ondownloadprogress) == "function") {
                            engine.downstatus.currentSendSize = evt.loaded;
                            engine.downstatus.totalSendSize = engine.downstatus.totalPrevSendSize + evt.loaded;
                            engine.downstatus.currentCountTime = Date.now() - engine.downstatus.currentStartTime;
                            engine.ondownloadprogress(engine.downstatus);
                        }
                    },
                    load: function(res) {
                        console.log(sformat("DX5: file downloading done. name={0}, type={1}, size={2}", [engine.downstatus.currentItem.name, res.type, res.size]));
                        saveData(res, engine.downstatus.currentItem.name, res.type, engine.browser.isSafari, function() {
                            engine.downstatus.currentSendSize = engine.downstatus.currentSize;
                            engine.downstatus.totalPrevSendSize = engine.downstatus.totalPrevSendSize + engine.downstatus.currentSize;
                            engine.downstatus.downloadCountTime += engine.downstatus.currentCountTime;
                            engine.downstatus.currentCountTime = 0;
                            engine.downstatus.completeCount++;
                            if (engine.ondownloaditemend && typeof(engine.ondownloaditemend) == "function") {
                                console.log(sformat("DX5: file downloading total rate={0}", [engine.downstatus.getTotalRate().toFixed(2)]));
                                engine.ondownloaditemend(engine.downstatus);
                            }
                            if (engine.downQueue.length == 0) {
                                engine.acting = false;
                                if (engine.ondownloadcomplete && typeof(engine.ondownloadcomplete) == "function") {
                                    engine.ondownloadcomplete();
                                }
                            } else {
                                setTimeout(function() {
                                    downloadQueue(engine);
                                })
                            }
                        }, function(ecode, emsg, eparams) {
                            engine.acting = false;
                            throwError(engine, ecode, emsg, eparams);
                        });
                    },
                    abort: function(evt) {
                        console.log("DX5: Current multi downloading job stopped.");
                        engine.acting = false;
                        if (engine.ondownloadcancel && typeof(engine.ondownloadcancel) == "function") {
                            engine.ondownloadcancel();
                        }
                    },
                    timeout: function(evt) {
                        console.log("DX5: Current multi downloading job time-out.");
                        engine.acting = false;
                        throwError(engine, "ESVG-00020", "_파일 다운로드 진행 중 오류가 발생했습니다.\n{0}\n{1}\n{2}", ["Type: Single", "Target: " + cf.downUrl, "Respone-status: " + engine.downstatus.xhr.statusText]);
                    },
                    error: function(status, msg) {
                        console.log("DX5: Some downloading error occured.");
                        engine.acting = false;
                        throwError(engine, "ESVG-00021", "_파일 다운로드 진행 중 오류가 발생했습니다.\n{0}\n{1}\n{2}\n{3}", ["Type: Multi", "Target: " + cf.downUrl, "Respone-status: " + status, msg]);
                    }
                }, "blob", undefined, engine.customHeaders, engine.credential, true);
                engine.downstatus.xhr = xhr;
            } catch (ex) {
                engine.acting = false;
                throwError(engine, "ESVG-00020", "_파일 다운로드 진행 중 오류가 발생했습니다.\n{0}\n{1}\n{2}", ["Type: Multi", "Target: " + cf.downUrl, ex.message]);
            }
        };
        var execute = function(engine, target) {
            var popWinOption = "memubar=no,toolbar=no,location=no,resizable";
            var pop = win.open(target.openUrl, "DEXTUploadX5-" + target.id, popWinOption);
            if (location.href.indexOf("localhost") < 0) pop.focus();
        };
        var getDomain = function(url) {
            if (!url) return "";
            var domain = (url.indexOf("://") > -1) ? url.split("/")[2] : url.split("/")[0];
            domain = domain.split(":")[0];
            return domain;
        };
        var decodeDomainKey = function(source) {
            var key, iv;
            if (typeof TextDecoder !== "undefined") {
                key = CryptoJS.enc.Utf8.parse(new TextDecoder("UTF-8").decode(new Uint8Array([68, 69, 88, 84, 85, 112, 108, 111, 97, 100, 88, 53, 80, 97, 115, 115])));
            } else {
                key = CryptoJS.lib.WordArray.create([1145395284, 1433431151, 1633966133, 1348563827], 16);
            }
            if (typeof TextDecoder !== "undefined") {
                iv = CryptoJS.enc.Utf8.parse(new TextDecoder("UTF-8").decode(new Uint8Array([48, 49, 48, 50, 48, 51, 48, 52, 48, 53, 48, 54, 48, 55, 48, 56])));
            } else {
                iv = CryptoJS.lib.WordArray.create([808529970, 808661044, 808792118, 808923192], 16);
            }
            var decrypted = CryptoJS.AES.decrypt(source, key, {
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            });
            var str = decrypted.toString(CryptoJS.enc.Utf8);
            return str;
        };
        var decodeCombinationKey = function(source) {
            var key, iv;
            if (typeof TextDecoder !== "undefined") {
                key = CryptoJS.enc.Utf8.parse(new TextDecoder("UTF-8").decode(new Uint8Array([68, 69, 88, 84, 67, 111, 109, 98, 105, 110, 101, 100, 80, 97, 115, 115])));
            } else {
                key = CryptoJS.lib.WordArray.create([1145395284, 1131375970, 1768842596, 1348563827], 16);
            }
            if (typeof TextDecoder !== "undefined") {
                iv = CryptoJS.enc.Utf8.parse(new TextDecoder("UTF-8").decode(new Uint8Array([48, 49, 48, 50, 48, 51, 48, 52, 48, 53, 48, 54, 48, 55, 48, 56])));
            } else {
                iv = CryptoJS.lib.WordArray.create([808529970, 808661044, 808792118, 808923192], 16);
            }
            var decrypted = CryptoJS.AES.decrypt(source, key, {
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            });
            var str = decrypted.toString(CryptoJS.enc.Utf8);
            return str;
        };
        var validateURLInDomain = function(engine, authkey, url) {
            var upperDomain = getDomain(url).toUpperCase();
            var tokens = authkey.split(/\|/);
            var pid = "",
                sn = "",
                ver = "",
                lic = "",
                max = 0,
                domains = "",
                exdate = "",
                permitcnt = 0,
                isultimate = false,
                licname;
            if (!tokens || tokens.length < 3) {
                throwError(engine, "ESVG-00059", "_인증키 형식이 올바르지 않습니다.", undefined);
                return false;
            }
            for (var i = 0, len = tokens.length; i < len; i++) {
                if (tokens[i].toLowerCase().indexOf("pid=") == 0) pid = tokens[i].split("=")[1];
                if (tokens[i].toLowerCase().indexOf("sn=") == 0) sn = tokens[i].split("=")[1];
                if (tokens[i].toLowerCase().indexOf("version=") == 0) ver = tokens[i].split("=")[1];
                if (tokens[i].toLowerCase().indexOf("licensetype=") == 0) lic = tokens[i].split("=")[1];
                if (tokens[i].toLowerCase().indexOf("max=") == 0) max = parseInt(tokens[i].split("=")[1], 10);
                if (tokens[i].toLowerCase().indexOf("domains=") == 0) domains = tokens[i].split("=")[1].split(";");
                if (tokens[i].toLowerCase().indexOf("expiredate=") == 0) exdate = tokens[i].split("=")[1];
            }
            if (pid.indexOf("DNX5") != 0 && pid.indexOf("ENX5") != 0) {
                throwError(engine, "ESVG-00059", "_인증키 형식이 올바르지 않습니다.", undefined);
                return false;
            }
            if (lic == "0") {
                permitcnt = max = 1, licname = "Evaluation";
            } else if (lic == "1") {
                permitcnt = max = 2, licname = "1~2 Domains";
            } else if (lic == "2") {
                permitcnt = max = 8, licname = "1~8 Domains";
            } else if (lic == "3") {
                permitcnt = max = 2, licname = "Ultimate", isultimate = true;
            } else if (lic == "4") {
                permitcnt = max = 10, licname = "IP";
                return true;
            } else if (lic == "5") {
                permitcnt = max, licname = "N domains";
            } else {
                throwError(engine, "ESVG-00059", "_인증키 형식이 올바르지 않습니다.", undefined);
                return false;
            }
            if (lic == "0") {
                var monthes = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                var strDate = monthes[parseInt(exdate.substring(4, 6), 10) - 1] + " " + exdate.substring(6, 8) + " " + exdate.substring(0, 4);
                var exp = new Date(strDate);
                exp.setTime(exp.getTime() + 86400000);
                if (exp <= new Date()) {
                    throwError(engine, "ESVG-00061", "_평가판 사용 기간이 만료되었습니다.", undefined);
                    return false;
                }
            }
            
            if (upperDomain == "LOCALHOST" || upperDomain == "127.0.0.1") return true;
            for (var i = 0, len = Math.min(domains.length, permitcnt), cdomain = null, mi = -1; i < len; i++) {
                cdomain = domains[i].toUpperCase();
                if (isultimate) {
                    if (cdomain.indexOf(".") == 0) cdomain = cdomain.substring(1);
                    else if (cdomain.indexOf("*.") == 0) cdomain = cdomain.substring(2);
                    mi = upperDomain.indexOf(cdomain);
                    if (mi == 0 && upperDomain.length == cdomain.length) return true;
                    else if (mi > 0 && upperDomain.charAt(mi - 1) == "." && upperDomain.length == (mi + cdomain.length)) return true;
                } else if (cdomain == upperDomain) {
                    return true;
                }
            }
            
            //--**	이상준 추가 나중에 지울것
            return true;
            
            throwError(engine, "ESVG-00060", "_{0}: 등록된 도메인(IP)이 아닙니다.", [upperDomain]);
            return false;
        };
        var validateURLInCombination = function(engine, authkey, url) {
            var upperDomain = getDomain(url).toUpperCase();
            var tokens = authkey.split(/\|/);
            var pid = "",
                sn = "",
                hd = "0",
                ml = 0,
                sl = 1,
                services = [],
                exdate = "",
                max = 0,
                isultimate = false;
            if (!tokens || tokens.length < 3) {
                throwError(engine, "ESVG-00059", "_인증키 형식이 올바르지 않습니다.", undefined);
                return false;
            }
            for (var i = 0, len = tokens.length; i < len; i++) {
                if (tokens[i].toLowerCase().indexOf("pid=") == 0) pid = tokens[i].split("=")[1];
                if (tokens[i].toLowerCase().indexOf("sn=") == 0) sn = tokens[i].split("=")[1];
                if (tokens[i].toLowerCase().indexOf("hd=") == 0) hd = tokens[i].split("=")[1];
                if (tokens[i].toLowerCase().indexOf("ml=") == 0) ml = parseInt(tokens[i].split("=")[1], 10);
                if (tokens[i].toLowerCase().indexOf("sl=") == 0) sl = parseInt(tokens[i].split("=")[1], 10);
                if (tokens[i].toLowerCase().indexOf("services=") == 0) services = tokens[i].split("=")[1].split(";");
                if (tokens[i].toLowerCase().indexOf("expired=") == 0) exdate = tokens[i].split("=")[1];
            }
            if (!pid || !sn) {
                throwError(engine, "ESVG-00059", "_인증키 형식이 올바르지 않습니다.", undefined);
                return false;
            }
            if (pid.substr(0, 4) != "EACP" && pid.substr(0, 3) != "D5C") {
                throwError(engine, "ESVG-00059", "_인증키 형식이 올바르지 않습니다.", undefined);
                return false;
            }
            max = Math.min(services.length, sl);
            isultimate = (ml === 2);
            if (ml === 0) {
                var monthes = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                var strDate = monthes[parseInt(exdate.substring(4, 6), 10) - 1] + " " + exdate.substring(6, 8) + " " + exdate.substring(0, 4);
                var exp = new Date(strDate);
                exp.setTime(exp.getTime() + 86400000);
                if (exp <= new Date()) {
                    throwError(engine, "ESVG-00061", "_평가판 사용 기간이 만료되었습니다.", undefined);
                    return false;
                }
            }
            
            if (upperDomain == "LOCALHOST" || upperDomain == "127.0.0.1") return true;
            for (var i = 0, cdomain = null, mi = -1; i < max; i++) {
                cdomain = services[i].toUpperCase();
                if (isultimate) {
                    if (cdomain.indexOf("*.") == 0) cdomain = cdomain.substring(2);
                    mi = upperDomain.indexOf(cdomain);
                    if (mi == 0 && upperDomain.length == cdomain.length) return true;
                    else if (mi > 0 && upperDomain.charAt(mi - 1) == "." && upperDomain.length == (mi + cdomain.length)) return true;
                } else if (cdomain == upperDomain) {
                    return true;
                }
            }
            
            //--**	이상준 추가 나중에 지울것
            return true;
            
            throwError(engine, "ESVG-00060", "_{0}: 등록된 도메인(IP)이 아닙니다.", [upperDomain]);
            return false;
        };
        var authenticate = function(engine, auth, url) {
            var decoded = "",
                isError = false,
                err = "";
            try {
                decoded = decodeDomainKey(auth);
                if (!decoded) throw Error("The decoded string is blank.");
            } catch (e1) {
                isError = true;
                err = e1;
            }
            if (isError === false) {
                return validateURLInDomain(engine, decoded, url);
            } else {
                isError = false;
            }
            try {
                decoded = decodeCombinationKey(auth);
                if (!decoded) throw Error("The decoded string is blank.");
            } catch (e2) {
                isError = true;
                err = e2;
            }
            if (isError === false) {
                return validateURLInCombination(engine, decoded, url);
            } else {
                throwError(engine, "ESVG-00081", "_알 수 없는 인증키 형식입니다.\n{0}", e2.message);
                return false;
            }
        };
        var adjustInteger = function(value, permitMinus, defValue) {
            var num = parseInt(value, 10);
            if (permitMinus) return num;
            else if (num < 0) return defValue;
            else return num;
        };
        return {
            addFile: function(file) {
                var engine = this,
                    item = null,
                    blob = null,
                    fname = "";
                if (isFile(file)) {
                    item = createFI(engine.controlId, createId(++engine.cumulative), file, "", "FILE", file.name, file.size);
                    item.ext = getFileExtension(file.name);
                    item.mime = file.type;
                    var relativePath = file.webkitRelativePath || file.relativePath || file.dx5RelativePath;
                    if (relativePath) {
                        item.middlePath = getParentPath(relativePath);
                    }
                } else if (file) {
                    blob = new Blob([], {
                        type: "application/octet-stream"
                    });
                    item = createFI(engine.controlId, createId(++engine.cumulative), blob, file.vindex || "", "VIRTUAL", file.name, typeof(file.size) === "undefined" ? -1 : adjustInteger(file.size, false, -1));
                    item.ext = getFileExtension(file.name);
                    item.mime = "application/octet-stream";
                    item.openUrl = file.openUrl || "";
                    item.downUrl = file.downUrl || file.url || "";
                    item.url = item.downUrl;
                    item.thumbnail = file.thumb || "";
                    item.lock = (file.lock === true ? true : false);
                    item.checked = (file.checked === true ? true : false);
                    item.eventUriStart = file.eventUriStart || "";
                    item.eventUriStop = file.eventUriStop || "";
                    item.eventUriEnd = file.eventUriEnd || "";
                    item.chunkSize = typeof(file.chunkSize) === "undefined" ? -1 : adjustInteger(file.chunkSize, false, -1);
                    item.hdTitle = file.hdTitle || "";
                } else return null;
                engine.ufiles.push(item);
                return item;
            },
            stopUploading: function() {
                var engine = this;
                if (engine.upstatus.xhr) {
                    try {
                        engine.upstatus.xhr.abort();
                    } catch (ex) {
                        throwError(engine, "ESVG-00025", "_파일 전송을 중지하는 과정에서 오류가 발생했습니다.\n{0}", [ex.message]);
                    }
                }
            },
            stopDownloading: function() {
                var engine = this;
                if (engine.downstatus.xhr) {
                    try {
                        engine.downstatus.xhr.abort();
                    } catch (ex) {
                        throwError(engine, "ESVG-00025", "_파일 전송을 중지하는 과정에서 오류가 발생했습니다.\n{0}", [ex.message]);
                    }
                }
            },
            stopCompressWaiting: function() {
                var engine = this;
                if (engine.compressXHR) {
                    try {
                        engine.compressXHR.abort();
                    } catch (ex) {
                        throwError(engine, "ESVG-00079", "_파일 압축 요청을 중지하는 과정에서 오류가 발생했습니다.\n{0}", [ex.message]);
                    }
                }
            },
            upload: function(ids) {
                var engine = this;
                if (engine.acting == true) {
                    throwError(engine, "ESVG-00024", "_파일을 전송하고 있는 상태입니다.");
                    return;
                }
                if (!engine.uploadUrl) {
                    throwError(engine, "ESVG-00053", "_파일 업로드 경로가 지정되지 않았습니다.");
                    return;
                }
                if (!engine.licenseKey) {
                    throwError(engine, "ESVG-00035", "인증키가 없습니다. 파일 업로드 작업은 중단됩니다.");
                    return;
                }
                if (authenticate(engine, engine.licenseKey, engine.uploadUrl) != true) return;
                engine.upQueue = new DX5FileList();
                for (var i = 0, len = ids.length, t = null; i < len; i++) {
                    t = engine.ufiles.getItem(ids[i]);
                    if (t && t.status == "WAIT" && t.type == "FILE") {
                        engine.upQueue.push(t);
                    }
                }
                if (engine.upQueue.length == 0) return;
                if (engine.isDoneResponse == true) {
                    engine.response = [];
                    engine.isDoneResponse = false;
                } else {}
                engine.upstatus.clear();
                engine.upstatus.uploadStartTime = Date.now();
                engine.upstatus.uploadCountTime = 0;
                engine.upstatus.totalSize = engine.upQueue.getTotalSize();
                engine.upstatus.totalCount = engine.upQueue.length;
                engine.upstatus.totalPrevSendSize = 0;
                engine.upstatus.totalSendSize = 0;
                engine.upstatus.completeCount = 0;
                engine.acting = true;
                if (engine.onbegin && typeof(engine.onbegin) == "function") {
                    engine.onbegin(engine.upstatus);
                }
                if (engine.uploadMode == "ORAF") transferORAF(engine);
                else if (engine.uploadMode == "OROF") transferOROF(engine);
                else if (engine.uploadMode == "EXNJ") transferEXNJ(engine);
                else {
                    engine.acting = false;
                    throwError(engine, "ESVG-00069", "_{0}은(는) 올바른 파일 업로드 방식이 아닙니다.", [engine.uploadMode]);
                }
            },
            download: function(arr, md) {
                var engine = this;
                if (!arr || !Array.isArray(arr) || arr.length == 0) return;
                if (!md) {
                    var t = engine.ufiles.getItem(arr[0]);
                    if (!t) {
                        throwError(engine, "ESVG-00022", "_다운로드할 대상 파일이 없습니다.");
                        return;
                    } else if (!t.downUrl) {
                        throwError(engine, "ESVG-00040", "_경로(다운로드, 열기)가 정의되지 않았습니다.");
                        return;
                    }
                    downloadSingle(engine, t);
                    return;
                }
                if (engine.acting == true) {
                    throwError(engine, "ESVG-00024", "_파일을 전송하고 있는 상태입니다.");
                    return;
                }
                engine.downQueue.clear("VIRTUAL");
                for (var i = 0, len = arr.length, t = null; i < len; i++) {
                    t = engine.ufiles.getItem(arr[i]);
                    if (engine.limitMDSize >= 0 && t.size > engine.limitMDSize) {
                        engine.downQueue.clear("VIRTUAL");
                        throwError(engine, "ESVG-00065", "_파일 크기가 {0} 보다 큰 대상이 존재하므로 다운로드 작업을 진행할 수 없습니다.", [engine.limitMDSize]);
                        return;
                    } else {
                        engine.downQueue.push(t);
                    }
                }
                engine.downstatus.clear();
                engine.downstatus.downloadStartTime = Date.now();
                engine.downstatus.downloadCountTime = 0;
                engine.downstatus.totalSize = engine.downQueue.getTotalSize();
                engine.downstatus.totalCount = engine.downQueue.length;
                engine.downstatus.totalPrevSendSize = 0;
                engine.downstatus.totalSendSize = 0;
                engine.downstatus.completeCount = 0;
                engine.acting = true;
                if (engine.ondownloadbegin && typeof(engine.ondownloadbegin) == "function") {
                    engine.ondownloadbegin(engine.downstatus);
                }
                downloadQueue(engine);
            },
            downloadCompressed: function(arr) {
                var engine = this;
                if (engine.acting == true) {
                    throwError(engine, "ESVG-00024", "_파일을 전송하고 있는 상태입니다.");
                    return;
                }
                if (!arr || !Array.isArray(arr) || arr.length == 0) return;
                if (!engine.compressURL) {
                    throwError(engine, "ESVG-00077", "_파일 압축을 처리하는 경로가 지정되지 않았습니다.");
                    return;
                }
                var data = [];
                arr.forEach(function(v, i) {
                    var t = engine.ufiles.getItem(v);
                    if (t && t.vindex) {
                        data.push(encodeURIComponent(t.vindex));
                    }
                });
                try {
                    engine.acting = true;
                    var xhr = AJAX(engine.compressURL, "post", {
                        start: function(evt) {
                            if (engine.oncompressbegin && typeof(engine.oncompressbegin) == "function") {
                                engine.oncompressbegin();
                            }
                        },
                        load: function(res) {
                            console.log("DX5: The compressed file url: " + res);
                            engine.acting = false;
                            if (engine.oncompresscomplete && typeof(engine.oncompresscomplete) == "function") {
                                engine.oncompresscomplete();
                            }
                            downloadURI(res);
                        },
                        abort: function() {
                            console.log("DX5: Current multi downloading job stopped.");
                            engine.acting = false;
                            if (engine.oncompresscancel && typeof(engine.oncompresscancel) == "function") {
                                engine.oncompresscancel();
                            }
                        },
                        timeout: function() {
                            console.log("DX5: Current multi downloading job time-out.");
                            engine.acting = false;
                            throwError(engine, "ESVG-00078", "_파일 압축을 요청하는 시간이 초과되었습니다.\n{0}\n{1}", ["Type: Compress", "Target: " + engine.compressURL]);
                        },
                        error: function(status, msg) {
                            console.log("DX5: Some compressing error occured.");
                            engine.acting = false;
                            throwError(engine, "ESVG-00076", "_파일 압축을 요청하는 과정에서 오류가 발생했습니다.\n{0}\n{1}\n{2}\n{3}", ["Type: Compress", "Target: " + engine.compressURL, "Respone-status: " + status, msg]);
                        }
                    }, "text", {
                        "DEXTUploadX5_VIndexes": data
                    }, engine.customHeaders, engine.credential, true);
                    engine.compressXHR = xhr;
                } catch (ex) {
                    throwError(engine, "ESVG-00075", "_파일 압축을 요청하는 과정에서 오류가 발생했습니다.\n{0}\n{1}\n{2}", ["Type: Compress", "Target: " + engine.compressURL, ex.message]);
                }
            },
            run: function(id) {
                if (!id) return;
                var engine = this,
                    t = engine.ufiles.getItem(id);
                if (!t) {
                    throwError(engine, "ESVG-00023", "_열려고 하는 대상 파일이 없습니다.");
                    return;
                }
                execute(engine, t);
            }
        };
    })();
    win.DX5FileEngine = FC;
})(window);
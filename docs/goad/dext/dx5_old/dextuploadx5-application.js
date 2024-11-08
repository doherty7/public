﻿/*
 * DEXTUploadX5 - Application
 * http://www.dextsolution.com
 *
 * Copyright DEVPIA Inc.
 */
var gfileEngine = null;
var gselectedList = [];
var gsortedList = [];
var gdx5Parameter = {};
var gDEF_HEADER_HEIGHT = 36,
    gMIN_HEADER_HEIGHT = 24,
    gMAX_HEADER_HEIGHT = 40;
var gDEF_LSTITEM_HEIGHT = 36,
    gMIN_LSTITEM_HEIGHT = 24,
    gMAX_LSTITEM_HEIGHT = 40;
var gDEF_FOOTER_HEIGHT = 36;
var gDEF_CHECKER_WIDTH = 30;
var gDEF_SIZESORTBUTTON_WIDTH = 8;
var gvector = {
    version: "3.1.1.0",
    uitype: "LIST",
    tileColumnCount: 2,
    maxFileCount: -1,
    maxFileCountWithVF: false,
    minFileSize: -1,
    maxFileSize: -1,
    maxTotalSize: -1,
    maxTotalSizeWithVF: false,
    filterSilence: false,
    downloadLimitSize: -1,
    filters: [],
    reversedFilters: [],
    allowedNoExtension: true,
    uploadMode: "ORAF",
    duplicable: false,
    useProgressDialog: true,
    enableColumnSorting: false,
    autoSortingType: 0,
    sortPriorityVF: false,
    headerHeight: gDEF_HEADER_HEIGHT,
    savedHeaderHeight: gDEF_HEADER_HEIGHT,
    fileItemHeight: gDEF_LSTITEM_HEIGHT,
    footerHeight: gDEF_FOOTER_HEIGHT,
    headerTextBaseline: Math.floor(gDEF_HEADER_HEIGHT / 2) + 5,
    itemTextBaseline: Math.floor(gDEF_LSTITEM_HEIGHT / 2) + 5,
    footerTextBaseline: Math.floor(gDEF_FOOTER_HEIGHT / 2) + 5,
    checkerWidth: gDEF_CHECKER_WIDTH,
    sizeSortButtonWidth: 0,
    vscrollbarWidth: 0,
    downloadButtonVisible: true,
    openButtonVisible: true,
    fileFormats: {
        image: ["jpg", "jpeg", "gif", "bmp", "tif", "tiff", "png", "rif", "ppm", "pgm", "pbm", "pnm", "svg", "webp", "pcx", "tga", "wmf", "raf", "orf", "crw", "raw", "scr", "nef", "srf", "cr2", "erf", "nrw", "pef", "dng", "ico", "jp2", "psp", "tgf", "cdr", "pic", "eps"],
        video: ["webm", "mkv", "flv", "vob", "avi", "wmv", "rm", "asf", "mp4", "m4p", "m4v", "mpg", "mpeg", "mov"],
        audio: ["aac", "au", "flac", "m4a", "mmf", "mp3", "ra", "ogg", "wma", "wav", "cda", "asx", "m3u"],
        msdoc: ["doc", "docx"],
        msxls: ["xls", "xlsx"],
        msppt: ["ppt", "pptx"],
        archv: ["zip", "arj", "7z", "alz", "gz", "rar", "cab", "tar", "lzh", "egg"],
        exec: ["exe", "sh", "msi", "com"],
        html: ["html", "htm", "xml", "css"],
        flash: ["fla", "swf", "air", "swz", "as"],
        outlook: ["pst", "eml", "dbx"],
        document: ["txt", "ps", "hlp", "rtf", "gul", "lwd"],
        clang: ["c", "hrc", "h"],
        cpplang: ["cpp", "hpp"],
        rubylang: ["rb", "rbw"],
        objclang: ["m", "mm"],
        javalang: ["java", "jsp", "jar", "war", "class"],
        etclang: ["bas", "pas", "por", "cgi", "rc"],
        font: ["ttf", "hft", "otf", "fnt", "fot", "eot", "woff"],
        adobePremiere: ["ppj", "ptl", "prtl", "plb", "prproj"],
        adobeAfterEffect: ["aep", "aet", "aepx"],
        threeDimension: ["3ds", "max", "ma", "mb", "lwo", "lws", "xsi", "dwf", "hsf", "dxf", "dwg", "3dm", "blend"],
        asp: ["asp", "aspx", "asa", "ashx", "asax"],
        data: ["dat", "mdf", "ldf", "frm", "ibd", "myd", "myi"],
        others: ["ai", "bat", "chm", "exe", "hwp", "pdf", "log", "psd", "torrent", "cs", "pl", "js", "py", "swift", "vbs", "php", "csv", "log", "id", "sql"]
    },
    enablePreview: false,
    previewMethod: 1,
    previewBgColor: "#5E6E8D",
    enableDnd: true,
    useHDWhenSingle: false,
    sizeColumnWidth: 70
};
var guploadStatus = {
    totalSize: 0,
    totalCount: 0,
    totalSendSize: 0,
    completeCount: 0,
    currentName: "",
    currentSize: 0,
    currentSendSize: 0,
    totalRate: 0,
    totalSpeed: 0,
    currentRate: 0,
    currentSpeed: 0,
    totalTime: null,
    currentTime: null,
    remainedTotalTime: null,
    remainedCurrentTime: null
};
var gdownloadStatus = {
    totalSize: 0,
    totalCount: 0,
    totalReceiveSize: 0,
    completeCount: 0,
    currentName: "",
    currentSize: 0,
    currentSendSize: 0,
    totalRate: 0,
    totalSpeed: 0,
    currentRate: 0,
    currentSpeed: 0,
    totalTime: null,
    currentTime: null,
    remainedTotalTime: null,
    remainedCurrentTime: null
};
var gbrowser = null;
var gRB = new ResourceBundle();
var gsvgHelper = new SVGHelper();
var me = null;

function onLoadHandler(uitype, evt) {
    //--**console.log("DX5: Start " + gvector.version);
    //--**console.log("DX5: Initialize variables.");
    initVariables(uitype);
    //--**console.log("DX5: Initialize engine.");
    initEngine();
    //--**console.log("DX5: Initialize APIs.");
    initInterfaces();
    var worker = new Worker("dextuploadx5-worker-resource.js");
    worker.onmessage = function(evt) {
        //--**console.log("DX5: Initialize resource bundle.");
        gRB.init(evt.data);
        //--**console.log("DX5: Initialize UI.");
        initUI();
        setTimeout(function() {
            //--**console.log("DX5: Call create event.");
            dispatchDEXTX5Event("created", createDEXTX5Event("created", {
                id: gvector.elementId
            }));
        }, 100);
        //--**console.log("DX5: Remove blind.");
        gsvgHelper.get("UIC-BLIND").style["display"] = "none";
    };
    worker.onerror = function(evt) {
        //--**console.log("DX5: Text resource(main view) loading failed!\n" + evt.message);
        alert("Text resource(main view) loading failed!\n" + evt.message);
    };
    worker.postMessage(gvector.lang);
}

function initVariables(uitype) {
    loadParameters(gdx5Parameter);
    if (!gdx5Parameter.lang || gdx5Parameter.lang == "auto") {
        gvector.lang = navigator.language || navigator.browserLanguage || navigator.systemLanguage;
        gvector.lang = gvector.lang ? gvector.lang.split("-")[0] : "";
    } else {
        gvector.lang = gdx5Parameter.lang;
    }
    gvector.elementId = gdx5Parameter.elementId;
    gvector.uitype = uitype;
    if (gvector.uitype == "LIST") {
        gvector.headerHeight = gDEF_HEADER_HEIGHT;
        gvector.fileItemHeight = gDEF_LSTITEM_HEIGHT;
    } else if (gvector.uitype == "TILE") {
        gvector.headerHeight = 0;
        gvector.fileItemHeight = 110;
    } else if (gvector.uitype == "SINGLE") {
        gvector.maxFileCount = 1;
    }
    me = gsvgHelper.get("UIC-DEXTUPLOADX5-MAIN");
}

function initEngine() {
    gfileEngine = new DX5FileEngine();
    gfileEngine.controlId = gvector.elementId;
    gfileEngine.onerror = onErrorHandler;
    gfileEngine.onbegin = onUploadBeginHandler;
    gfileEngine.onprogress = onUploadProgressHandler;
    gfileEngine.oncomplete = onUploadCompletehandler;
    gfileEngine.onitemstart = onUploadItemStartHandler;
    gfileEngine.onitemend = onUploadItemEndHandler;
    gfileEngine.oncancel = onUploadCancelHandler;
    gfileEngine.ondownloadbegin = onDownloadBeginHandler;
    gfileEngine.ondownloadprogress = onDownloadProgressHandler;
    gfileEngine.ondownloadcomplete = onDownloadCompletehandler;
    gfileEngine.ondownloaditemstart = onDownloadItemStartHandler;
    gfileEngine.ondownloaditemend = onDownloadItemEndHandler;
    gfileEngine.ondownloadcancel = onDownloadCancelHandler;
    gfileEngine.oncompressbegin = onCompressBeginHandler;
    gfileEngine.oncompresscomplete = onCompressCompleteHandler;
    gfileEngine.oncompresscancel = onCompressCancelHandler;
}

function initInterfaces() {
    document["getVersion"] = api_getVersion;
    document["getSplitString"] = api_getSplitString;
    document["setSplitString"] = api_setSplitString;
    document["getEmptyString"] = api_getEmptyString;
    document["setEmptyString"] = api_setEmptyString;
    document["getAuthkey"] = api_getAuthkey;
    document["setAuthkey"] = api_setAuthkey;
    document["getUploadURL"] = api_getUploadURL;
    document["setUploadURL"] = api_setUploadURL;
    document["setDownloadLimitSize"] = api_setDownloadLimitSize;
    document["setUploadMode"] = api_setUploadMode;
    document["getUploadMode"] = api_getUploadMode;
    document["enableResumingUpload"] = api_enableResumingUpload;
    document["setUploadBlockSize"] = api_setUploadBlockSize;
    document["openFileDialog"] = api_openFileDialog;
    document["openFolderDialog"] = api_openFolderDialog;
    document["addFileList"] = api_addFileList;
    document["addEntriesForChrome"] = api_addEntriesForChrome;
    document["addVirtualFile"] = api_addVirtualFile;
    document["addVirtualFileList"] = api_addVirtualFileList;
    document["getMaxFileCount"] = api_getMaxFileCount;
    document["setMaxFileCount"] = api_setMaxFileCount;
    document["getMaxFileSize"] = api_getMaxFileSize;
    document["setMaxFileSize"] = api_setMaxFileSize;
    document["getMinFileSize"] = api_getMinFileSize;
    document["setMinFileSize"] = api_setMinFileSize;
    document["getMaxTotalSize"] = api_getMaxTotalSize;
    document["setMaxTotalSize"] = api_setMaxTotalSize;
    document["setFilterSilence"] = api_setFilterSilence;
    document["getExtentionFilter"] = api_getExtentionFilter;
    document["setExtentionFilter"] = api_setExtentionFilter;
    document["isAllowNoExtension"] = api_isAllowNoExtension;
    document["setAllowNoExtension"] = api_setAllowNoExtension;
    document["clearItems"] = api_clearItems;
    document["getTotalItemCount"] = api_getTotalItemCount;
    document["getTotalFileSize"] = api_getTotalFileSize;
    document["getItems"] = api_getItems;
    document["addItems"] = api_addItems;
    document["getSelectedItems"] = api_getSelectedItems;
    document["getItemIds"] = api_getItemIds;
    document["getSelectedItemIds"] = api_getSelectedItemIds;
    document["getSelectedIndices"] = api_getSelectedIndices;
    document["getItemById"] = api_getItemById;
    document["getItemByIndex"] = api_getItemByIndex;
    document["getCheckedItems"] = api_getCheckedItems;
    document["getCheckedIds"] = api_getCheckedIds;
    document["getItemId"] = api_getItemId;
    document["getItemIndex"] = api_getItemIndex;
    document["lockById"] = api_lockById;
    document["lockByIndex"] = api_lockByIndex;
    document["unlockById"] = api_unlockById;
    document["unlockByIndex"] = api_unlockByIndex;
    document["getTotalRemovedFileCount"] = api_getTotalRemovedFileCount;
    document["getTotalRemovedFileSize"] = api_getTotalRemovedFileSize;
    document["getRemovedFileIds"] = api_getRemovedFileIds;
    document["getRemovedFiles"] = api_getRemovedFiles;
    document["getRemovedFileById"] = api_getRemovedFileById;
    document["removeById"] = api_removeById;
    document["removeByIndex"] = api_removeByIndex;
    document["removeSelected"] = api_removeSelected;
    document["removeAll"] = api_removeAll;
    document["removeChecked"] = api_removeChecked;
    document["purgeRemovedVirtual"] = api_purgeRemovedVirtual;
    document["revokeVirtualFile"] = api_revokeVirtualFile;
    document["revokeAllVirtualFiles"] = api_revokeAllVirtualFiles;
    document["checkAll"] = api_checkAll;
    document["checkById"] = api_checkById;
    document["checkByIndex"] = api_checkByIndex;
    document["changeToVirtualFile"] = api_changeToVirtualFile;
    document["changeStatus"] = api_changeStatus;
    document["checkDuplication"] = api_checkDuplication;
    document["getMetaDataByIndex"] = api_getMetaDataByIndex;
    document["getMetaDataById"] = api_getMetaDataById;
    document["setMetaDataByIndex"] = api_setMetaDataByIndex;
    document["setMetaDataById"] = api_setMetaDataById;
    document["deleteMetaDataByIndex"] = api_deleteMetaDataByIndex;
    document["deleteMetaDataById"] = api_deleteMetaDataById;
    document["getResponse"] = api_getResponse;
    document["getUploadStatus"] = api_getUploadStatus;
    document["getDownloadStatus"] = api_getDownloadStatus;
    document["stopUploading"] = api_stopUploading;
    document["stopDownloading"] = api_stopDownloading;
    document["hasUploadableItems"] = api_hasUploadableItems;
    document["upload"] = api_upload;
    document["downloadById"] = api_downloadById;
    document["download"] = api_download;
    document["executeItem"] = api_executeItem;
    document["dispatchSVGResize"] = api_dispatchSVGResize;
    document["selectAll"] = api_selectAll;
    document["unselectAll"] = api_unselectAll;
    document["selectByIndex"] = api_selectByIndex;
    document["unselectByIndex"] = api_unselectByIndex;
    document["isSelectedByIndex"] = api_isSelectedByIndex;
    document["useProgressDialog"] = api_useProgressDialog;
    document["isUsingProgressDialog"] = api_isUsingProgressDialog;
    document["getSupportPHP"] = api_getSupportPHP;
    document["setSupportPHP"] = api_setSupportPHP;
    document["setLimitMultiDownloadSize"] = api_setLimitMultiDownloadSize;
    document["getEnableColumnSorting"] = api_getEnableColumnSorting;
    document["setEnableColumnSorting"] = api_setEnableColumnSorting;
    document["setSortPriorityVirtualFile"] = api_setSortPriorityVirtualFile;
    document["getAutoSortingType"] = api_getAutoSortingType;
    document["setAutoSortingType"] = api_setAutoSortingType;
    document["sortItems"] = api_sortItems;
    document["moveItemUp"] = api_moveItemUp;
    document["moveItemDown"] = api_moveItemDown;
    document["isPreviewEnable"] = api_isPreviewEnable;
    document["setPreviewEnable"] = api_setPreviewEnable;
    document["getPreviewMethod"] = api_getPreviewMethod;
    document["setPreviewMethod"] = api_setPreviewMethod;
    document["getPreviewBackgroundColor"] = api_getPreviewBackgroundColor;
    document["setPreviewBackgroundColor"] = api_setPreviewBackgroundColor;
    document["preview"] = api_preview;
    document["updateUI"] = api_updateUI;
    document["getCompressURL"] = api_getCompressURL;
    document["setCompressURL"] = api_setCompressURL;
    document["downloadCompressed"] = api_downloadCompressed;
    document["stopCompressWaiting"] = api_stopCompressWaiting;
    document["getEnableDnd"] = api_getEnableDnd;
    document["setEnableDnd"] = api_setEnableDnd;
    document["isUsingHDWhenSingle"] = api_isUsingHDWhenSingle;
    document["setUsingHDWhenSingle"] = api_setUsingHDWhenSingle;
    document["getCustomHeader"] = api_getCustomHeader;
    document["setCustomHeader"] = api_setCustomHeader;
    document["removeCustomHeader"] = api_removeCustomHeader;
    document["getTotalCustomHeaders"] = api_getTotalCustomHeaders;
    document["getWithCredentials"] = api_getWithCredentials;
    document["setWithCredentials"] = api_setWithCredentials;
    document["setHeaderVisible"] = api_setHeaderVisible;
    document["setHeaderHeight"] = api_setHeaderHeight;
    document["setStatusBarVisible"] = api_setStatusBarVisible;
    document["setCheckerVisible"] = api_setCheckerVisible;
    document["setBorderVisible"] = api_setBorderVisible;
    document["setHeaderSolidColor"] = api_setHeaderSolidColor;
    document["setStatusBarSolidColor"] = api_setStatusBarSolidColor;
    document["setHeaderGradient"] = api_setHeaderGradient;
    document["setItemHeight"] = api_setItemHeight;
    document["setBackgroundColor"] = api_setBackgroundColor;
    document["setBackgroundImage"] = api_setBackgroundImage;
    document["setHeaderFontName"] = api_setHeaderFontName;
    document["setHeaderFontColor"] = api_setHeaderFontColor;
    document["setItemFontName"] = api_setItemFontName;
    document["setItemFontColor"] = api_setItemFontColor;
    document["setStatusBarFontName"] = api_setStatusBarFontName;
    document["setStatusBarFontColor"] = api_setStatusBarFontColor;
    document["setTileColumnCount"] = api_setTileColumnCount;
    document["setDownloadButtonVisible"] = api_setDownloadButtonVisible;
    document["setOpenButtonVisible"] = api_setOpenButtonVisible;
    document["setItemBackColor"] = api_setItemBackColor;
    document["setGridLineColor"] = api_setGridLineColor;
    document["setBorderColor"] = api_setBorderColor;
    document["setHeaderLineColor"] = api_setHeaderLineColor;
    document["setColumnLineColor"] = api_setColumnLineColor;
    document["setStatusBarLineColor"] = api_setStatusBarLineColor;
    document["setGridLineVisible"] = api_setGridLineVisible;
    document["setFilterVisible"] = api_setFilterVisible;
    document["setSizeColumnVisible"] = api_setSizeColumnVisible;
}

function initUI() {
    var hp = window.gsvgHelper;
    gbrowser = detectBrowser();
    gfileEngine.browser = gbrowser;
    if (gvector.uitype == "LIST") {
        hp.replaceText(hp.get("UIC-HEADER-TXT-FILE"), gRB.get("RB-LIST-MAIN-0001", "_파일"));
        hp.replaceText(hp.get("UIC-HEADER-TXT-SIZE"), gRB.get("RB-LIST-MAIN-0002", "_크기"));
    }
    updateFilterInfo();
    updateCurrentFilesInfo();
    updateUILayout(me);
    document.addEventListener("keydown", onFileItemKeyDownHandler, false);
    hp.get("XHTML-INPUT-FILES").addEventListener("change", function() {
        var success = registerLocalFiles(this.files);
        if (!success) {
            resetHtmlFiles();
        }
    }, false);
    if (gbrowser.isChrome && (gvector.uitype == "LIST" || gvector.uitype == "TILE")) {
        hp.get("XHTML-INPUT-FOLDER").addEventListener("change", function() {
            var success = registerLocalFiles(this.files);
            if (!success) {
                resetHtmlFiles();
            }
        }, false);
    }
    if (gvector.uitype == "SINGLE") {
        hp.get("UIC-BTN-ADD").addEventListener("click", function(evt) {
            evt.stopPropagation();
            evt.preventDefault();
            if (gfileEngine.acting) {
                errorOut("ESVG-00024", gRB.get("ESVG-00024", "_파일을 전송하고 있는 상태입니다."));
                return;
            }
            if (gfileEngine.ufiles.length == 0) {
                api_openFileDialog();
            }
        }, false);
        hp.get("UIC-BTN-DELETE").addEventListener("click", onDeleteFileHandler, false);
    } else {
        var checker = hp.get("UIC-HEADER-CHECKER");
        if (checker) {
            hp.get("UIC-HEADER-CHECKER-NOT").addEventListener("click", onFileCheckHandler, false);
            hp.get("UIC-HEADER-CHECKER-CHK").addEventListener("click", onFileCheckHandler, false);
        }
        var regionColumnSorting = hp.get("UIC-SORT-BUTTONS");
        if (regionColumnSorting) {
            regionColumnSorting.style.display = gvector.enableColumnSorting ? "block" : "none";
            var btnNameSorting = hp.get("UIC-HEADER-BK-NAME"),
                btnSizeSorting = hp.get("UIC-HEADER-BK-SIZE");
            btnNameSorting.addEventListener("click", function(evt) {
                if (!gvector.enableColumnSorting) return;
                evt.stopPropagation();
                evt.preventDefault();
                if (gfileEngine.acting) {
                    errorOut("ESVG-00024", gRB.get("ESVG-00024", "_파일을 전송하고 있는 상태입니다."));
                    return;
                } else {
                    sortByName();
                }
            }, false);
            btnSizeSorting.addEventListener("click", function(evt) {
                if (!gvector.enableColumnSorting) return;
                evt.stopPropagation();
                evt.preventDefault();
                if (gfileEngine.acting) {
                    errorOut("ESVG-00024", gRB.get("ESVG-00024", "_파일을 전송하고 있는 상태입니다."));
                    return;
                } else {
                    sortBySize();
                }
            }, false);
        }
        var scroller = hp.get("UIC-FILE-SCROLL-SECTION");
        if (scroller) {
            hp.get("UIC-FILE-SCROLL-UP").addEventListener("click", function(evt) {
                evt.stopPropagation();
                evt.preventDefault();
                if (gfileEngine.acting) {
                    errorOut("ESVG-00024", gRB.get("ESVG-00024", "_파일을 전송하고 있는 상태입니다."));
                    return;
                }
                scrollRegion("up");
            }, false);
            hp.get("UIC-FILE-SCROLL-DOWN").addEventListener("click", function(evt) {
                evt.stopPropagation();
                evt.preventDefault();
                if (gfileEngine.acting) {
                    errorOut("ESVG-00024", gRB.get("ESVG-00024", "_파일을 전송하고 있는 상태입니다."));
                    return;
                }
                scrollRegion("down");
            }, false);
        }
    }
}

function api_getVersion() {
    return gvector.version;
}

function api_getSplitString() {
    return gfileEngine.splitString;
}

function api_setSplitString(str) {
    if (!checkStrongDataType(USER_DATA_TYPE.STRING, str)) {
        errorOut("ESVG-00004", gRB.get("ESVG-00004", "_{0} 함수의 {1} 파라미터는 {2} 형식이어야 합니다."), ["api_setSplitString", "str", "String"]);
    } else {
        gfileEngine.splitString = str;
    }
}

function api_getEmptyString() {
    return gfileEngine.emptyString;
}

function api_setEmptyString(str) {
    if (!checkStrongDataType(USER_DATA_TYPE.STRING, str)) {
        errorOut("ESVG-00004", gRB.get("ESVG-00004", "_{0} 함수의 {1} 파라미터는 {2} 형식이어야 합니다."), ["api_setEmptyString", "str", "String"]);
    } else {
        gfileEngine.emptyString = str;
    }
}

function api_getAuthkey() {
    return gfileEngine.licenseKey;
}

function api_setAuthkey(key) {
    if (!checkStrongDataType(USER_DATA_TYPE.STRING, key)) {
        errorOut("ESVG-00004", gRB.get("ESVG-00004", "_{0} 함수의 {1} 파라미터는 {2} 형식이어야 합니다."), ["api_setAuthkey", "key", "String"]);
    } else {
        gfileEngine.licenseKey = key;
    }
}

function api_getUploadURL() {
    return gfileEngine.uploadUrl;
}

function api_setUploadURL(url) {
    if (!checkStrongDataType(USER_DATA_TYPE.STRING, url)) {
        errorOut("ESVG-00004", gRB.get("ESVG-00004", "_{0} 함수의 {1} 파라미터는 {2} 형식이어야 합니다."), ["api_setUploadURL", "url", "String"]);
    } else if (url.length == 0 || (url.toLowerCase().indexOf("http://") != 0 && url.toLowerCase().indexOf("https://") != 0)) {
        errorOut("ESVG-00026", gRB.get("ESVG-00026", "_경로가 올바르지 않습니다.\n파일 업로드 주소는 http 또는 https로 시작하는 전체 경로를 지정해야 합니다."));
    } else {
        gfileEngine.uploadUrl = url;
    }
}

function api_getCompressURL() {
    return gfileEngine.compressURL;
}

function api_setCompressURL(url) {
    if (!checkStrongDataType(USER_DATA_TYPE.STRING, url)) {
        errorOut("ESVG-00004", gRB.get("ESVG-00004", "_{0} 함수의 {1} 파라미터는 {2} 형식이어야 합니다."), ["api_setCompressURL", "url", "String"]);
    } else if (url.length == 0 || (url.toLowerCase().indexOf("http://") != 0 && url.toLowerCase().indexOf("https://") != 0)) {
        errorOut("ESVG-00080", gRB.get("ESVG-00080", "_경로가 올바르지 않습니다.\n압축 요청 주소는 http 또는 https로 시작하는 전체 경로를 지정해야 합니다."));
    } else {
        gfileEngine.compressURL = url;
    }
}

function api_setDownloadLimitSize(limit) {
    if (!checkStrongDataType(USER_DATA_TYPE.INTEGER_WITH_MINUSONE, tsize)) {
        errorOut("ESVG-00004", gRB.get("ESVG-00004", "_{0} 함수의 {1} 파라미터는 {2} 형식이어야 합니다."), ["api_setDownloadLimitSize", "tsize", "-1 이상인 정수"]);
    } else {
        gvector.downloadLimitSize = limit;
    }
}

function api_setUploadMode(mode) {
    if (!checkStrongDataType(USER_DATA_TYPE.STRING, mode)) {
        errorOut("ESVG-00004", gRB.get("ESVG-00004", "_{0} 함수의 {1} 파라미터는 {2} 형식이어야 합니다."), ["api_setUploadMode", "mode", "String"]);
    } else if (["ORAF", "OROF", "EXNJ"].indexOf(mode.toUpperCase()) == -1) {
        errorOut("ESVG-00028", gRB.get("ESVG-00028", "_파일 업로드 방법은 ORAF, OROF, EXNJ 중 하나를 선택해야 합니다."));
    } else {
        gfileEngine.uploadMode = mode.toUpperCase();
    }
}

function api_getUploadMode() {
    return gfileEngine.uploadMode;
}

function api_enableResumingUpload(enable) {
    if (!checkStrongDataType(USER_DATA_TYPE.BOOLEAN, enable)) {
        errorOut("ESVG-00004", gRB.get("ESVG-00004", "_{0} 함수의 {1} 파라미터는 {2} 형식이어야 합니다."), ["api_enableResumingUpload", "enable", "Boolean"]);
    } else {
        gfileEngine.resuming = enable;
    }
}

function api_setUploadBlockSize(size) {
    if (!checkStrongDataType(USER_DATA_TYPE.INTEGER_WITH_ZERO, size)) {
        errorOut("ESVG-00004", gRB.get("ESVG-00004", "_{0} 함수의 {1} 파라미터는 {2} 형식이어야 합니다."), ["api_setUploadBlockSize", "size", "정수"]);
    } else if (size < (1024 * 1024) || size > (1024 * 1024 * 1024)) {
        errorOut("ESVG-00012", gRB.get("ESVG-00012", "_대용량 파일을 나누는 블록의 크기는 1MB ~ 1GB 범위어야 합니다."));
    } else {
        gfileEngine.chunkedBlock = size;
    }
}

function api_openFileDialog() {
    gsvgHelper.get("XHTML-INPUT-FILES").click();
}

function api_openFolderDialog() {
    if (gbrowser.isChrome) {
        gsvgHelper.get("XHTML-INPUT-FOLDER").click();
    } else {
        errorOut("ESVG-00071", gRB.get("ESVG-00071", "_폴더를 추가하려면 크롬 브라우저를 사용하세요."));
    }
}

function api_addFileList(list) {
    if (!list) {} else if (!isFileList(list)) {
        errorOut("ESVG-00016", gRB.get("ESVG-00016", "_대상은 FileList 객체가 아닙니다."));
    } else if (list.length == 0) {} else {
        var success = registerLocalFiles(list);
        if (!success) {
            resetHtmlFiles();
        }
    }
}

function api_addEntriesForChrome(dataTransferItemList) {
    var cnt = 0,
        list = [];

    function traverseTreeForChrome(item, path) {
        if (item.isFile) {
            item.file(function(f) {
                if (path.indexOf("/") == 0) f.dx5RelativePath = path.substring(1) + "/" + f.name;
                else if (path) f.dx5RelativePath = path + "/" + f.name;
                else f.dx5RelativePath = "";
                list.push(f);
                cnt--;
                if (cnt == 0) {
                    var success = registerLocalFiles(list);
                    if (!success) {
                        resetHtmlFiles();
                    }
                }
            });
        } else if (item.isDirectory) {
            path = item.fullPath;
            item.createReader().readEntries(function(entries) {
                cnt += entries.length;
                for (var i = 0, len = entries.length; i < len; i++) {
                    traverseTreeForChrome(entries[i], path);
                }
                cnt--;
                if (cnt == 0) {
                    var success = registerLocalFiles(list);
                    if (!success) {
                        resetHtmlFiles();
                    }
                }
            });
        }
    }
    cnt = dataTransferItemList.length;
    for (var i = 0, len = dataTransferItemList.length, item = null; i < len; i++) {
        item = dataTransferItemList[i].webkitGetAsEntry();
        if (item) {
            traverseTreeForChrome(item, "");
        }
    }
}

function api_addVirtualFile(vf) {
    if (gvector.uitype == "SINGLE") {
        errorOut("ESVG-00013", gRB.get("ESVG-00013", "_단일형(single) UI에서는 가상 파일을 등록할 수 없습니다."));
    } else if (!vf) {
        errorOut("ESVG-00001", gRB.get("ESVG-00001", "_{0}이(가) 정의되지 않았습니다."), ["가상 파일"]);
    } else {
        registerVirtualFiles([vf]);
    }
}

function api_addVirtualFileList(vfs) {
    if (gvector.uitype == "SINGLE") {
        errorOut("ESVG-00013", gRB.get("ESVG-00013", "_단일형(single) UI에서는 가상 파일을 등록할 수 없습니다."));
    } else if (!vfs) {
        errorOut("ESVG-00001", gRB.get("ESVG-00001", "_{0}이(가) 정의되지 않았습니다."), ["가상 파일 배열 객체"]);
    } else if (!Array.isArray(vfs)) {
        errorOut("ESVG-00002", gRB.get("ESVG-00002", "_대상은 배열이 아닙니다."));
    } else if (vfs.length == 0) {
        errorOut("ESVG-00003", gRB.get("ESVG-00003", "_콜렉션 또는 배열의 길이가 0입니다."));
    } else {
        registerVirtualFiles(vfs);
    }
}

function api_getMaxFileCount() {
    return gvector.maxFileCount;
}

function api_setMaxFileCount(count, withVF) {
    if (gvector.uitype == "SINGLE") {
        errorOut("ESVG-00014", gRB.get("ESVG-00014", "_단일형(single) UI에서는 허용 가능한 파일의 개수를 변경할 수 없습니다."));
    } else if (!checkStrongDataType(USER_DATA_TYPE.INTEGER_WITH_MINUSONE, count)) {
        errorOut("ESVG-00004", gRB.get("ESVG-00004", "_{0} 함수의 {1} 파라미터는 {2} 형식이어야 합니다."), ["api_setMaxFileCount", "count", "-1 이상인 정수"]);
    } else {
        gvector.maxFileCount = count;
        gvector.maxFileCountWithVF = withVF === true ? true : false;
        updateFilterInfo();
    }
}

function api_getMaxFileSize() {
    return gvector.maxFileSize;
}

function api_setMaxFileSize(size) {
    if (!checkStrongDataType(USER_DATA_TYPE.INTEGER_WITH_MINUSONE, size)) {
        errorOut("ESVG-00004", gRB.get("ESVG-00004", "_{0} 함수의 {1} 파라미터는 {2} 형식이어야 합니다."), ["api_setMaxFileSize", "size", "-1 이상인 정수"]);
    } else {
        gvector.maxFileSize = size;
        updateFilterInfo();
    }
}

function api_getMinFileSize() {
    return gvector.minFileSize;
}

function api_setMinFileSize(size) {
    if (!checkStrongDataType(USER_DATA_TYPE.INTEGER_WITH_MINUSONE, size)) {
        errorOut("ESVG-00004", gRB.get("ESVG-00004", "_{0} 함수의 {1} 파라미터는 {2} 형식이어야 합니다."), ["api_setMinFileSize", "size", "-1 이상인 정수"]);
    } else {
        gvector.minFileSize = size;
        updateFilterInfo();
    }
}

function api_getMaxTotalSize() {
    return gvector.maxTotalSize;
}

function api_setMaxTotalSize(tsize, withVF) {
    if (!checkStrongDataType(USER_DATA_TYPE.INTEGER_WITH_MINUSONE, tsize)) {
        errorOut("ESVG-00004", gRB.get("ESVG-00004", "_{0} 함수의 {1} 파라미터는 {2} 형식이어야 합니다."), ["api_setMaxTotalSize", "tsize", "-1 이상인 정수"]);
    } else {
        gvector.maxTotalSize = tsize;
        gvector.maxTotalSizeWithVF = withVF === true ? true : false;
        updateFilterInfo();
    }
}

function api_setFilterSilence(enable) {
    if (!checkStrongDataType(USER_DATA_TYPE.BOOLEAN, enable)) {
        errorOut("ESVG-00004", gRB.get("ESVG-00004", "_{0} 함수의 {1} 파라미터는 {2} 형식이어야 합니다."), ["api_setFilterSilence", "enable", "Boolean"]);
    } else {
        gvector.filterSilence = enable;
    }
}

function api_getExtentionFilter(reverse) {
    var exts = (reverse === true ? gvector.reversedFilters : gvector.filters);
    var str = "";
    exts.forEach(function(v, i) {
        str += "*" + v + (i + 1 < exts.length ? "," : "");
    });
    return str;
}

function api_setExtentionFilter(filterString, reverse) {
    if (!checkStrongDataType(USER_DATA_TYPE.STRING_WITH_EMPTY, filterString)) {
        errorOut("ESVG-00004", gRB.get("ESVG-00004", "_{0} 함수의 {1} 파라미터는 {2} 형식이어야 합니다."), ["api_setExtentionFilter", "filterString", "String(with empty)"]);
        return;
    }
    var nfilters = [],
        tokens = filterString.split(";");
    for (var i = 0, len = tokens.length, c = "", dotIndex = 0; i < len; i++) {
        c = trim(tokens[i].replace(/\*+/, '')).toLowerCase();
        dotIndex = c.lastIndexOf(".");
        if (dotIndex >= 0) c = c.substring(dotIndex + 1);
        if (c && c.length > 1) nfilters.push("." + c);
    }
    var compareTarget = reverse === true ? gvector.filters : gvector.reversedFilters;
    var duplicateds = SETOPS.intersect(compareTarget, nfilters);
    if (duplicateds.length > 0) {
        errorOut("ESVG-00056", gRB.get("ESVG-00056", "_필터링할 확장자({0})가 이미 등록되어 있으므로 필터 설정 작업을 취소합니다."),
            [reverse === true ? gRB.get("TSVG-00007", "_순필터") : gRB.get("TSVG-00008", "_역필터")]);
        return;
    }
    if (reverse === true) {
        gvector.reversedFilters = nfilters;
    } else {
        gvector.filters = nfilters;
        gsvgHelper.get("XHTML-INPUT-FILES").accept = "";
        gsvgHelper.get("XHTML-INPUT-FILES").accept = nfilters.join(",");
    }
    updateFilterInfo();
}

function api_isAllowNoExtension() {
    return gvector.allowedNoExtension;
}

function api_setAllowNoExtension(allow) {
    if (!checkStrongDataType(USER_DATA_TYPE.BOOLEAN, allow)) {
        errorOut("ESVG-00004", gRB.get("ESVG-00004", "_{0} 함수의 {1} 파라미터는 {2} 형식이어야 합니다."), ["api_setAllowNoExtension", "allow", "Boolean"]);
    } else {
        gvector.allowedNoExtension = allow;
        updateFilterInfo();
    }
}

function api_clearItems(flag) {
    if (typeof(flag) === "undefined") flag = "ALL";
    else if (!checkStrongDataType(USER_DATA_TYPE.STRING, flag)) {
        errorOut("ESVG-00004", gRB.get("ESVG-00004", "_{0} 함수의 {1} 파라미터는 {2} 형식이어야 합니다."), ["api_clearItems", "flag", "String"]);
        return;
    } else if (["FILE", "VIRTUAL", "DVIRTUAL", "ALL"].indexOf(flag.toUpperCase()) == -1) {
        errorOut("ESVG-00029", gRB.get("ESVG-00029", "_파일을 초기화하는 옵션은 FILE, VIRTUAL, DVIRTUAL, ALL 중 하나를 선택해야 합니다."));
        return;
    } else {
        flag = flag.toUpperCase();
    }
    switch (flag) {
        case "FILE":
            removeFilesNUpdateUI(queryItems("ID", {
                type: "FILE"
            }), true, false);
            break;
        case "VIRTUAL":
            removeFilesNUpdateUI(queryItems("ID", {
                type: "VIRTUAL"
            }), true, false);
            break;
        case "DVIRTUAL":
            gfileEngine.xfiles = new DX5FileList();
            break;
        default:
            gfileEngine.xfiles = new DX5FileList();
            removeFilesNUpdateUI(queryItems("ID", {}), true, false);
            break;
    }
}

function api_getTotalItemCount(onlyLocal) {
    return gfileEngine.ufiles.getLength(onlyLocal === true ? true : false);
}

function api_getTotalFileSize(onlyLocal) {
    return gfileEngine.ufiles.getTotalSize(onlyLocal === true ? true : false);
}

function api_getItems(onlyLocal, isOrigin) {
    var arr = [];
    var ids = (onlyLocal === true ? queryItems("ID", {
        type: "FILE"
    }) : queryItems("ID", {}));
    for (var i = 0, len = ids.length, t = null; i < len; i++) {
        t = gfileEngine.ufiles.getItem(ids[i]);
        arr.push(isOrigin === true ? t : clonejson(t));
    }
    return arr;
}

function api_addItems(items) {
    if (!items) {
        errorOut("ESVG-00001", gRB.get("ESVG-00001", "_{0}이(가) 정의되지 않았습니다."), ["파일 항목 배열 객체"]);
    } else {
        for (var i = 0, len = items.length, t = null; i < len; i++) {
            t = items[i];
            if (t.toString() != "[object DX5FileItem]") {
                errorOut("ESVG-00054", gRB.get("ESVG-00054", "_파일 항목 객체가 아닙니다."));
                return;
            } else if (t.type != "FILE") {
                errorOut("ESVG-00055", gRB.get("ESVG-00055", "_로컬 파일 항목만 등록할 수 있습니다."));
                return;
            }
            gfileEngine.ufiles.push(t);
            gsortedList.push(t.id);
        }
    }
}

function api_getSelectedItems(onlyLocal) {
    var arr = [];
    var ids = api_getSelectedItemIds();
    for (var i = 0, t = null; i < ids.length; i++) {
        t = gfileEngine.ufiles.getItem(ids[i]);
        if (onlyLocal === true) {
            if (t.type == "FILE") arr.push(clonejson(t));
        } else {
            arr.push(clonejson(t));
        }
    }
    return arr;
}

function api_getItemIds(onlyLocal) {
    var arr = [];
    if (onlyLocal === true) {
        arr = queryItems("ID", {
            type: "FILE"
        });
    } else {
        arr = queryItems("ID", {});
    }
    return arr;
}

function api_getSelectedItemIds(onlyLocal) {
    var arr = [];
    for (var i = 0, len = gselectedList.length, t = null; i < len; i++) {
        if (onlyLocal === true) {
            t = gfileEngine.ufiles.getItem(gselectedList[i]);
            if (t.type == "FILE") arr.push(t.id);
        } else {
            arr.push(gselectedList[i]);
        }
    }
    return arr;
}

function api_getSelectedIndices(onlyLocal) {
    var arr = [];
    gsortedList.forEach(function(v, i) {
        if (gselectedList.indexOf(v) >= 0) {
            if (onlyLocal === true) {
                t = gfileEngine.ufiles.getItem(v);
                if (t.type == "FILE") arr.push(i);
            } else {
                arr.push(i);
            }
        }
    });
    return arr;
}

function api_getItemById(id) {
    if (!checkStrongDataType(USER_DATA_TYPE.STRING, id)) {
        errorOut("ESVG-00004", gRB.get("ESVG-00004", "_{0} 함수의 {1} 파라미터는 {2} 형식이어야 합니다."), ["api_getItemById", "id", "String"]);
        return null;
    }
    if (gsortedList.indexOf(id) < 0) {
        errorOut("ESVG-00005", gRB.get("ESVG-00005", "_{0}는 존재하지 않는 파일의 고유 아이디입니다."), [id]);
        return null;
    }
    var t = gfileEngine.ufiles.getItem(id);
    return t ? clonejson(t) : null;
}

function api_getItemByIndex(index) {
    if (!checkStrongDataType(USER_DATA_TYPE.INTEGER_WITH_ZERO, index)) {
        errorOut("ESVG-00004", gRB.get("ESVG-00004", "_{0} 함수의 {1} 파라미터는 {2} 형식이어야 합니다."), ["api_getItemByIndex", "index", "정수(0 이상)"]);
        return null;
    }
    if (index >= gsortedList.length || index < 0) {
        errorOut("ESVG-00006", gRB.get("ESVG-00006", "_주어진 순서[{0}]는 {1} 범위를 벗어났습니다."), [index, "파일 개수"]);
        return null;
    }
    var id = gsortedList[index];
    var t = gfileEngine.ufiles.getItem(id);
    return t ? clonejson(t) : null;
}

function api_getCheckedItems(onlyLocal) {
    var arr = [];
    var items = (onlyLocal === true) ? queryItems("ITEM", {
        checked: true,
        type: "FILE"
    }) : queryItems("ITEM", {
        checked: true
    });
    for (var i = 0, len = items.length; i < len; i++) {
        arr.push(clonejson(items[i]));
    }
    return arr;
}

function api_getCheckedIds(onlyLocal) {
    return (onlyLocal === true) ? queryItems("ID", {
        checked: true,
        type: "FILE"
    }) : queryItems("ITEM", {
        checked: true
    });
}

function api_getItemId(index) {
    if (!checkStrongDataType(USER_DATA_TYPE.INTEGER_WITH_ZERO, index)) {
        errorOut("ESVG-00004", gRB.get("ESVG-00004", "_{0} 함수의 {1} 파라미터는 {2} 형식이어야 합니다."), ["api_getItemId", "index", "정수(0 이상)"]);
        return null;
    } else if (index >= gsortedList.length || index < 0) {
        errorOut("ESVG-00006", gRB.get("ESVG-00006", "_주어진 순서[{0}]는 {1} 범위를 벗어났습니다."), [index, "파일 개수"]);
        return null;
    } else return gsortedList[index];
}

function api_getItemIndex(id) {
    if (!checkStrongDataType(USER_DATA_TYPE.STRING, id)) {
        errorOut("ESVG-00004", gRB.get("ESVG-00004", "_{0} 함수의 {1} 파라미터는 {2} 형식이어야 합니다."), ["api_getItemIndex", "id", "String"]);
        return undefined;
    } else if (gsortedList.indexOf(id) < 0) {
        errorOut("ESVG-00005", gRB.get("ESVG-00005", "_{0}는 존재하지 않는 파일의 고유 아이디입니다."), [id]);
        return undefined;
    } else return gsortedList.indexOf(id);
}

function api_lockById(id) {
    if (!checkStrongDataType(USER_DATA_TYPE.STRING, id)) {
        errorOut("ESVG-00004", gRB.get("ESVG-00004", "_{0} 함수의 {1} 파라미터는 {2} 형식이어야 합니다."), ["api_lockById", "id", "String"]);
        return false;
    } else if (gsortedList.indexOf(id) < 0) {
        errorOut("ESVG-00005", gRB.get("ESVG-00005", "_{0}는 존재하지 않는 파일의 고유 아이디입니다."), [id]);
        return false;
    } else {
        var item = gfileEngine.ufiles.getItem(id);
        if (item.type != "VIRTUAL") {
            errorOut("ESVG-00064", gRB.get("ESVG-00064", "_가상 파일만 잠금 혹은 잠금 해제할 수 있습니다."));
            return false;
        } else {
            item.lock = true;
            item.update();
            return true;
        }
    }
}

function api_lockByIndex(index) {
    if (!checkStrongDataType(USER_DATA_TYPE.INTEGER_WITH_ZERO, index)) {
        errorOut("ESVG-00004", gRB.get("ESVG-00004", "_{0} 함수의 {1} 파라미터는 {2} 형식이어야 합니다."), ["api_lockByIndex", "index", "정수(0 이상)"]);
        return false;
    } else if (index >= gsortedList.length || index < 0) {
        errorOut("ESVG-00006", gRB.get("ESVG-00006", "_주어진 순서[{0}]는 {1} 범위를 벗어났습니다."), [index, "파일 개수"]);
        return false;
    } else {
        var item = gfileEngine.ufiles.getItem(gsortedList[index]);
        if (item.type != "VIRTUAL") {
            errorOut("ESVG-00064", gRB.get("ESVG-00064", "_가상 파일만 잠금 혹은 잠금 해제할 수 있습니다."));
            return false;
        } else {
            item.lock = true;
            item.update();
            return true;
        }
    }
}

function api_unlockById(id) {
    if (!checkStrongDataType(USER_DATA_TYPE.STRING, id)) {
        errorOut("ESVG-00004", gRB.get("ESVG-00004", "_{0} 함수의 {1} 파라미터는 {2} 형식이어야 합니다."), ["api_unlockById", "id", "String"]);
        return false;
    } else if (gsortedList.indexOf(id) < 0) {
        errorOut("ESVG-00005", gRB.get("ESVG-00005", "_{0}는 존재하지 않는 파일의 고유 아이디입니다."), [id]);
        return false;
    } else {
        var item = gfileEngine.ufiles.getItem(id);
        if (item.type != "VIRTUAL") {
            errorOut("ESVG-00064", gRB.get("ESVG-00064", "_가상 파일만 잠금 혹은 잠금 해제할 수 있습니다."));
            return false;
        } else {
            item.lock = false;
            item.update();
            return true;
        }
    }
}

function api_unlockByIndex(index) {
    if (!checkStrongDataType(USER_DATA_TYPE.INTEGER_WITH_ZERO, index)) {
        errorOut("ESVG-00004", gRB.get("ESVG-00004", "_{0} 함수의 {1} 파라미터는 {2} 형식이어야 합니다."), ["api_unlockByIndex", "index", "정수(0 이상)"]);
        return false;
    } else if (index >= gsortedList.length || index < 0) {
        errorOut("ESVG-00006", gRB.get("ESVG-00006", "_주어진 순서[{0}]는 {1} 범위를 벗어났습니다."), [index, "파일 개수"]);
        return false;
    } else {
        var item = gfileEngine.ufiles.getItem(gsortedList[index]);
        if (item.type != "VIRTUAL") {
            errorOut("ESVG-00064", gRB.get("ESVG-00064", "_가상 파일만 잠금 혹은 잠금 해제할 수 있습니다."));
            return false;
        } else {
            item.lock = false;
            item.update();
            return true;
        }
    }
}

function api_getTotalRemovedFileCount() {
    return gfileEngine.xfiles.getLength();
}

function api_getTotalRemovedFileSize() {
    return gfileEngine.xfiles.getTotalSize();
}

function api_getRemovedFileIds() {
    var arr = [];
    for (var i = 0, len = gfileEngine.xfiles.getLength(); i < len; i++) {
        arr.push(gfileEngine.xfiles[i].id);
    }
    return arr;
}

function api_getRemovedFiles() {
    var arr = [];
    var ids = api_getRemovedFileIds();
    for (var i = 0, len = ids.length, t = null; i < len; i++) {
        t = gfileEngine.xfiles.getItem(ids[i]);
        arr.push(clonejson(t));
    }
    return arr;
}

function api_getRemovedFileById(id) {
    if (!checkStrongDataType(USER_DATA_TYPE.STRING, id)) {
        errorOut("ESVG-00004", gRB.get("ESVG-00004", "_{0} 함수의 {1} 파라미터는 {2} 형식이어야 합니다."), ["api_getRemovedFileById", "id", "String"]);
        return null;
    }
    var t = gfileEngine.xfiles.getItem(id);
    if (!t) {
        errorOut("ESVG-00005", gRB.get("ESVG-00005", "_{0}는 존재하지 않는 파일의 고유 아이디입니다."), [id]);
        return null;
    } else return clonejson(t);
}

function api_removeById(id, perma, fireEvent) {
    if (!checkStrongDataType(USER_DATA_TYPE.STRING, id)) {
        errorOut("ESVG-00004", gRB.get("ESVG-00004", "_{0} 함수의 {1} 파라미터는 {2} 형식이어야 합니다."), ["api_removeById", "id", "String"]);
        return false;
    } else if (gsortedList.indexOf(id) < 0) {
        errorOut("ESVG-00005", gRB.get("ESVG-00005", "_{0}는 존재하지 않는 파일의 고유 아이디입니다."), [id]);
        return false;
    } else {
        var item = gfileEngine.ufiles.getItem(id);
        if (item.lock === true) {
            errorOut("ESVG-00051", gRB.get("ESVG-00051", "_대상은 잠겨있습니다."));
            return false;
        } else {
            return removeFilesNUpdateUI([id], perma === true, fireEvent === true);
        }
    }
}

function api_removeByIndex(index, perma, fireEvent) {
    if (!checkStrongDataType(USER_DATA_TYPE.INTEGER_WITH_ZERO, index)) {
        errorOut("ESVG-00004", gRB.get("ESVG-00004", "_{0} 함수의 {1} 파라미터는 {2} 형식이어야 합니다."), ["api_removeByIndex", "index", "정수(0 이상)"]);
        return false;
    } else if (index >= gsortedList.length || index < 0) {
        errorOut("ESVG-00006", gRB.get("ESVG-00006", "_주어진 순서[{0}]는 {1} 범위를 벗어났습니다."), [index, "파일 개수"]);
        return false;
    } else {
        var id = gsortedList[index];
        var item = gfileEngine.ufiles.getItem(id);
        if (item.lock === true) {
            errorOut("ESVG-00051", gRB.get("ESVG-00051", "_대상은 잠겨있습니다."));
            return false;
        } else {
            return removeFilesNUpdateUI([id], perma === true, fireEvent === true);
        }
    }
}

function api_removeSelected(perma, fireEvent) {
    var locked = queryItems("ID", {
        lock: true
    });
    var intersection = SETOPS.intersect(gselectedList, locked);
    if (intersection.length > 0) {
        errorOut("ESVG-00052", gRB.get("ESVG-00052", "_잠겨 있는 항목이 존재하므로 삭제할 수 없습니다."));
        return false;
    } else if (gselectedList.length == 0) {
        errorOut("ESVG-00038", gRB.get("ESVG-00038", "_삭제할 대상이 없습니다."));
        return false;
    } else {
        var sels = cloneArray(gselectedList);
        return removeFilesNUpdateUI(sels, perma === true, fireEvent === true);
    }
}

function api_removeAll(perma, fireEvent) {
    var locked = queryItems("ID", {
        lock: true
    });
    if (locked.length > 0) {
        errorOut("ESVG-00052", gRB.get("ESVG-00052", "_잠겨 있는 항목이 존재하므로 삭제할 수 없습니다."));
        return false;
    } else if (gsortedList.length == 0) {
        errorOut("ESVG-00038", gRB.get("ESVG-00038", "_삭제할 대상이 없습니다."));
        return false;
    } else {
        var sels = cloneArray(gsortedList);
        return removeFilesNUpdateUI(sels, perma === true, fireEvent === true);
    }
}

function api_removeChecked(perma, fireEvent) {
    var locked = queryItems("ID", {
        lock: true
    });
    var checkedList = queryItems("ID", {
        checked: true
    });
    var intersection = SETOPS.intersect(checkedList, locked);
    if (intersection.length > 0) {
        errorOut("ESVG-00052", gRB.get("ESVG-00052", "_잠겨 있는 항목이 존재하므로 삭제할 수 없습니다."));
        return false;
    } else if (checkedList.length == 0) {
        errorOut("ESVG-00038", gRB.get("ESVG-00038", "_삭제할 대상이 없습니다."));
        return false;
    } else {
        return removeFilesNUpdateUI(checkedList, perma === true, fireEvent === true);
    }
}

function api_purgeRemovedVirtual(id) {
    if (!checkStrongDataType(USER_DATA_TYPE.STRING, id)) {
        errorOut("ESVG-00004", gRB.get("ESVG-00004", "_{0} 함수의 {1} 파라미터는 {2} 형식이어야 합니다."), ["api_purgeRemovedVirtual", "id", "String"]);
    } else {
        var item = gfileEngine.xfiles.getItem(id);
        if (!item) {
            errorOut("ESVG-00005", gRB.get("ESVG-00005", "_{0}는 존재하지 않는 파일의 고유 아이디입니다."), [id]);
        } else {
            gfileEngine.xfiles.removeById(id);
        }
    }
}

function api_revokeVirtualFile(id) {
    if (!checkStrongDataType(USER_DATA_TYPE.STRING, id)) {
        errorOut("ESVG-00004", gRB.get("ESVG-00004", "_{0} 함수의 {1} 파라미터는 {2} 형식이어야 합니다."), ["api_revokeVirtualFile", "id", "String"]);
        return false;
    } else {
        var item = gfileEngine.xfiles.getItem(id);
        if (!item) {
            errorOut("ESVG-00005", gRB.get("ESVG-00005", "_{0}는 존재하지 않는 파일의 고유 아이디입니다."), [id]);
            return false;
        } else {
            if (gvector.duplicable === false) {
                if (isFileDuplication(item) === true) {
                    errorOut("ESVG-00034", gRB.get("ESVG-00034", "_복구하려는 대상과 중복인 파일이 이미 존재합니다.\n{0}"), [item.name]);
                    return false;
                }
            }
            var area = gsvgHelper.get("UIC-FILE-AREA"),
                uitem = null;
            item.type = "VIRTUAL";
            gfileEngine.ufiles.push(item);
            gfileEngine.xfiles.removeByObject(item);
            uitem = createUIItem(item);
            area.appendChild(uitem);
            gsortedList.push(item.id);
            if (gvector.uitype == "TILE") {
                if (!item.thumbnail) {
                    var oThumb = gsvgHelper.get(item.id + "-THUMB");
                    gsvgHelper.attr(oThumb, "xlink:href", "./assets/icons/" + getIconFilename(item.name, true));
                }
            }
            if (gsvgHelper.get("UIC-HEADER-CHECKER") && gfileEngine.ufiles.length > 0) {
                var count = 0,
                    len = gfileEngine.ufiles.length;
                for (var i = 0, item = null; i < len; i++) {
                    item = gfileEngine.ufiles[i];
                    count += (item.checked ? 1 : 0);
                }
                gsvgHelper.get("UIC-HEADER-CHECKER-NOT").style.display = count == len ? "none" : "block";
                gsvgHelper.get("UIC-HEADER-CHECKER-CHK").style.display = count == len ? "block" : "none";
            }
            updateCurrentFilesInfo();
            if (gvector.autoSortingType > 0) {
                sortItems("name", "S", gvector.autoSortingType == 1 ? "asc" : "desc");
            }
            updateUILayout(me);
            return true;
        }
    }
}

function api_revokeAllVirtualFiles() {
    if (gfileEngine.xfiles.length == 0) {
        errorOut("ESVG-00050", gRB.get("ESVG-00050", "_삭제된 가상 파일이 없습니다."));
        return false;
    } else {
        var arr = [];
        gfileEngine.xfiles.forEach(function(v, i) {
            arr.push(v);
        });
        if (gvector.duplicable === false) {
            var rs = checkDuplication(arr);
            if (rs.not.length > 0) {
                errorOut("ESVG-00034", gRB.get("ESVG-00034", "_복구하려는 대상과 중복인 파일이 이미 존재합니다.\n{0}"), [rs.getNotAllowedNames("\n")]);
                return false;
            }
        }
        var area = gsvgHelper.get("UIC-FILE-AREA"),
            uitem = null;
        arr.forEach(function(v, i) {
            v.type = "VIRTUAL";
            gfileEngine.ufiles.push(v);
            gfileEngine.xfiles.removeByObject(v);
            uitem = createUIItem(v);
            area.appendChild(uitem);
            gsortedList.push(v.id);
            if (gvector.uitype == "TILE") {
                if (!v.thumbnail) {
                    var oThumb = gsvgHelper.get(v.id + "-THUMB");
                    gsvgHelper.attr(oThumb, "xlink:href", "./assets/icons/" + getIconFilename(v.name, true));
                }
            }
        });
        if (gsvgHelper.get("UIC-HEADER-CHECKER") && gfileEngine.ufiles.length > 0) {
            var count = 0,
                len = gfileEngine.ufiles.length;
            for (var i = 0, item = null; i < len; i++) {
                item = gfileEngine.ufiles[i];
                count += (item.checked ? 1 : 0);
            }
            gsvgHelper.get("UIC-HEADER-CHECKER-NOT").style.display = count == len ? "none" : "block";
            gsvgHelper.get("UIC-HEADER-CHECKER-CHK").style.display = count == len ? "block" : "none";
        }
        updateCurrentFilesInfo();
        if (gvector.autoSortingType > 0) {
            sortItems("name", "S", gvector.autoSortingType == 1 ? "asc" : "desc");
        }
        updateUILayout(me);
        return true;
    }
}

function api_checkAll(allOrNot) {
    if (!checkStrongDataType(USER_DATA_TYPE.BOOLEAN, allOrNot)) {
        errorOut("ESVG-00004", gRB.get("ESVG-00004", "_{0} 함수의 {1} 파라미터는 {2} 형식이어야 합니다."), ["api_checkAll", "allOrNot", "Boolean"]);
    } else if (gfileEngine.ufiles.length > 0) {
        var checker = gsvgHelper.get("UIC-HEADER-CHECKER");
        if (checker) {
            gsvgHelper.get("UIC-HEADER-CHECKER-NOT").style.display = allOrNot ? "none" : "block";
            gsvgHelper.get("UIC-HEADER-CHECKER-CHK").style.display = allOrNot ? "block" : "none";
        }
        for (var i = 0, len = gfileEngine.ufiles.length, item = null, oUse = null; i < len; i++) {
            item = gfileEngine.ufiles[i];
            item.checked = allOrNot;
            checkItem(item);
        }
    }
}

function api_checkById(id, checked) {
    if (!checkStrongDataType(USER_DATA_TYPE.STRING, id)) {
        errorOut("ESVG-00004", gRB.get("ESVG-00004", "_{0} 함수의 {1} 파라미터는 {2} 형식이어야 합니다."), ["api_checkById", "id", "String"]);
    } else if (!checkStrongDataType(USER_DATA_TYPE.BOOLEAN, checked)) {
        errorOut("ESVG-00004", gRB.get("ESVG-00004", "_{0} 함수의 {1} 파라미터는 {2} 형식이어야 합니다."), ["api_checkById", "checked", "Boolean"]);
    } else if (gsortedList.indexOf(id) < 0) {
        errorOut("ESVG-00005", gRB.get("ESVG-00005", "_{0}는 존재하지 않는 파일의 고유 아이디입니다."), [id]);
    } else {
        var item = gfileEngine.ufiles.getItem(id);
        item.checked = checked;
        checkItem(item);
        if (gsvgHelper.get("UIC-HEADER-CHECKER") && gfileEngine.ufiles.length > 0) {
            var count = 0,
                len = gfileEngine.ufiles.length;
            for (var i = 0, item = null; i < len; i++) {
                item = gfileEngine.ufiles[i];
                count += (item.checked ? 1 : 0);
            }
            gsvgHelper.get("UIC-HEADER-CHECKER-NOT").style.display = count == len ? "none" : "block";
            gsvgHelper.get("UIC-HEADER-CHECKER-CHK").style.display = count == len ? "block" : "none";
        }
    }
}

function api_checkByIndex(index, checked) {
    if (!checkStrongDataType(USER_DATA_TYPE.INTEGER_WITH_ZERO, index)) {
        errorOut("ESVG-00004", gRB.get("ESVG-00004", "_{0} 함수의 {1} 파라미터는 {2} 형식이어야 합니다."), ["api_checkByIndex", "id", "정수(0이상)"]);
    } else if (!checkStrongDataType(USER_DATA_TYPE.BOOLEAN, checked)) {
        errorOut("ESVG-00004", gRB.get("ESVG-00004", "_{0} 함수의 {1} 파라미터는 {2} 형식이어야 합니다."), ["api_checkByIndex", "checked", "Boolean"]);
    } else if (index >= gsortedList.length || index < 0) {
        errorOut("ESVG-00006", gRB.get("ESVG-00006", "_주어진 순서[{0}]는 {1} 범위를 벗어났습니다."), [index, "파일 개수"]);
    } else {
        var item = gfileEngine.ufiles.getItem(gsortedList[index]);
        item.checked = checked;
        checkItem(item);
        if (gsvgHelper.get("UIC-HEADER-CHECKER") && gfileEngine.ufiles.length > 0) {
            var count = 0,
                len = gfileEngine.ufiles.length;
            for (var i = 0, item = null; i < len; i++) {
                item = gfileEngine.ufiles[i];
                count += (item.checked ? 1 : 0);
            }
            gsvgHelper.get("UIC-HEADER-CHECKER-NOT").style.display = count == len ? "none" : "block";
            gsvgHelper.get("UIC-HEADER-CHECKER-CHK").style.display = count == len ? "block" : "none";
        }
    }
}

function api_changeToVirtualFile(id, openUrl, downUrl) {
    if (!checkStrongDataType(USER_DATA_TYPE.STRING, id)) {
        errorOut("ESVG-00004", gRB.get("ESVG-00004", "_{0} 함수의 {1} 파라미터는 {2} 형식이어야 합니다."), ["api_changeToVirtualType", "id", "String"]);
    } else if (gsortedList.indexOf(id) < 0) {
        errorOut("ESVG-00005", gRB.get("ESVG-00005", "_{0}는 존재하지 않는 파일의 고유 아이디입니다."), [id]);
    } else {
        var item = gfileEngine.ufiles.getItem(id);
        if (item.type !== "FILE") {
            errorOut("ESVG-00030", gRB.get("ESVG-00030", "_로컬 파일만 가상 파일로 형식 변환이 가능합니다."));
        } else {
            item.toVirtual(openUrl, downUrl);
        }
    }
}

function api_changeStatus(id, to) {
    if (!checkStrongDataType(USER_DATA_TYPE.STRING, id)) {
        errorOut("ESVG-00004", gRB.get("ESVG-00004", "_{0} 함수의 {1} 파라미터는 {2} 형식이어야 합니다."), ["api_changeStatus", "id", "String"]);
    } else if (!checkStrongDataType(USER_DATA_TYPE.STRING, to)) {
        errorOut("ESVG-00004", gRB.get("ESVG-00004", "_{0} 함수의 {1} 파라미터는 {2} 형식이어야 합니다."), ["api_changeStatus", "to", "String"]);
    } else if (["WAIT", "DONE"].indexOf(to.toUpperCase()) == -1) {
        errorOut("ESVG-00032", gRB.get("ESVG-00032", "_파일의 상태 값은 WAIT, DONE 중 하나를 선택해야 합니다."));
    } else if (gsortedList.indexOf(id) < 0) {
        errorOut("ESVG-00005", gRB.get("ESVG-00005", "_{0}는 존재하지 않는 파일의 고유 아이디입니다."), [id]);
    } else {
        var item = gfileEngine.ufiles.getItem(id);
        item.status = to;
        updateUIItem(item);
    }
}

function api_checkDuplication(enable) {
    if (!checkStrongDataType(USER_DATA_TYPE.BOOLEAN, enable)) {
        errorOut("ESVG-00004", gRB.get("ESVG-00004", "_{0} 함수의 {1} 파라미터는 {2} 형식이어야 합니다."), ["api_checkDuplication", "enable", "Boolean"]);
    } else {
        gvector.duplicable = !enable;
    }
}

function api_getMetaDataByIndex(index, name) {
    if (!checkStrongDataType(USER_DATA_TYPE.INTEGER_WITH_ZERO, index)) {
        errorOut("ESVG-00004", gRB.get("ESVG-00004", "_{0} 함수의 {1} 파라미터는 {2} 형식이어야 합니다."), ["api_getMetaDataByIndex", "index", "0 이상의 정수"]);
        return undefined;
    } else if (!checkStrongDataType(USER_DATA_TYPE.STRING, name)) {
        errorOut("ESVG-00004", gRB.get("ESVG-00004", "_{0} 함수의 {1} 파라미터는 {2} 형식이어야 합니다."), ["api_getMetaDataByIndex", "name", "String (no empty)"]);
        return undefined;
    } else if (!new RegExp("^[a-z]+[a-z0-9_-]*$", "gi").test(name)) {
        errorOut("ESVG-00062", gRB.get("ESVG-00062", "_메타 데이터 이름의 첫 문자는 반드시 영문자이어야 하며, 영문자와 숫자, '-', '_' 외에 다른 문자를 사용할 수 없습니다."));
        return undefined;
    } else if (index >= gsortedList.length || index < 0) {
        errorOut("ESVG-00006", gRB.get("ESVG-00006", "_주어진 순서[{0}]는 {1} 범위를 벗어났습니다."), [index, "파일 개수"]);
        return undefined;
    } else {
        var id = gsortedList[index];
        var item = gfileEngine.ufiles.getItem(id);
        if (checkStrongDataType(USER_DATA_TYPE.UNDEFINED, item.meta[name])) {
            errorOut("ESVG-00001", gRB.get("ESVG-00001", "_{0}이(가) 정의되지 않았습니다."), [name]);
            return undefined;
        } else {
            return item.meta[name];
        }
    }
}

function api_getMetaDataById(id, name) {
    if (!checkStrongDataType(USER_DATA_TYPE.STRING, id)) {
        errorOut("ESVG-00004", gRB.get("ESVG-00004", "_{0} 함수의 {1} 파라미터는 {2} 형식이어야 합니다."), ["api_getMetaDataById", "id", "String (no empty)"]);
        return undefined;
    } else if (!checkStrongDataType(USER_DATA_TYPE.STRING, name)) {
        errorOut("ESVG-00004", gRB.get("ESVG-00004", "_{0} 함수의 {1} 파라미터는 {2} 형식이어야 합니다."), ["api_getMetaDataById", "name", "String (no empty)"]);
        return undefined;
    } else if (!new RegExp("^[a-z]+[a-z0-9_-]*$", "gi").test(name)) {
        errorOut("ESVG-00062", gRB.get("ESVG-00062", "_메타 데이터 이름의 첫 문자는 반드시 영문자이어야 하며, 영문자와 숫자, '-', '_' 외에 다른 문자를 사용할 수 없습니다."));
        return undefined;
    } else if (gsortedList.indexOf(id) < 0) {
        errorOut("ESVG-00005", gRB.get("ESVG-00005", "_{0}는 존재하지 않는 파일의 고유 아이디입니다."), [id]);
        return undefined;
    } else {
        var item = gfileEngine.ufiles.getItem(id);
        if (checkStrongDataType(USER_DATA_TYPE.UNDEFINED, item.meta[name])) {
            errorOut("ESVG-00001", gRB.get("ESVG-00001", "_{0}이(가) 정의되지 않았습니다."), [name]);
            return undefined;
        } else {
            return item.meta[name];
        }
    }
}

function api_setMetaDataByIndex(index, name, value) {
    if (!checkStrongDataType(USER_DATA_TYPE.INTEGER_WITH_ZERO, index)) {
        errorOut("ESVG-00004", gRB.get("ESVG-00004", "_{0} 함수의 {1} 파라미터는 {2} 형식이어야 합니다."), ["api_setMetaDataByIndex", "index", "0 이상의 정수"]);
        return false;
    } else if (!checkStrongDataType(USER_DATA_TYPE.STRING, name)) {
        errorOut("ESVG-00004", gRB.get("ESVG-00004", "_{0} 함수의 {1} 파라미터는 {2} 형식이어야 합니다."), ["api_setMetaDataByIndex", "name", "String (no empty)"]);
        return false;
    } else if (!new RegExp("^[a-z]+[a-z0-9_-]*$", "gi").test(name)) {
        errorOut("ESVG-00062", gRB.get("ESVG-00062", "_메타 데이터 이름의 첫 문자는 반드시 영문자이어야 하며, 영문자와 숫자, '-', '_' 외에 다른 문자를 사용할 수 없습니다."));
        return false;
    } else if (checkStrongDataType(USER_DATA_TYPE.UNDEFINED, value)) {
        errorOut("ESVG-00001", gRB.get("ESVG-00001", "_{0}이(가) 정의되지 않았습니다."), ["value"]);
        return false;
    } else if (index >= gsortedList.length || index < 0) {
        errorOut("ESVG-00006", gRB.get("ESVG-00006", "_주어진 순서[{0}]는 {1} 범위를 벗어났습니다."), [index, "파일 개수"]);
        return false;
    } else {
        var id = gsortedList[index];
        var item = gfileEngine.ufiles.getItem(id);
        if (item.type != "FILE") {
            errorOut("ESVG-00039", gRB.get("ESVG-00039", "_로컬 파일만 메타 데이터를 등록할 수 있습니다."));
            return false;
        } else {
            item.meta[name] = value.toString();
            return true;
        }
    }
}

function api_setMetaDataById(id, name, value) {
    if (!checkStrongDataType(USER_DATA_TYPE.STRING, id)) {
        errorOut("ESVG-00004", gRB.get("ESVG-00004", "_{0} 함수의 {1} 파라미터는 {2} 형식이어야 합니다."), ["api_setMetaDataById", "id", "String (no empty)"]);
        return false;
    } else if (!checkStrongDataType(USER_DATA_TYPE.STRING, name)) {
        errorOut("ESVG-00004", gRB.get("ESVG-00004", "_{0} 함수의 {1} 파라미터는 {2} 형식이어야 합니다."), ["api_setMetaDataById", "name", "String (no empty)"]);
        return false;
    } else if (!new RegExp("^[a-z]+[a-z0-9_-]*$", "gi").test(name)) {
        errorOut("ESVG-00062", gRB.get("ESVG-00062", "_메타 데이터 이름의 첫 문자는 반드시 영문자이어야 하며, 영문자와 숫자, '-', '_' 외에 다른 문자를 사용할 수 없습니다."));
        return false;
    } else if (checkStrongDataType(USER_DATA_TYPE.UNDEFINED, value)) {
        errorOut("ESVG-00001", gRB.get("ESVG-00001", "_{0}이(가) 정의되지 않았습니다."), ["value"]);
        return false;
    } else if (gsortedList.indexOf(id) < 0) {
        errorOut("ESVG-00005", gRB.get("ESVG-00005", "_{0}는 존재하지 않는 파일의 고유 아이디입니다."), [id]);
        return false;
    } else {
        var item = gfileEngine.ufiles.getItem(id);
        if (item.type != "FILE") {
            errorOut("ESVG-00039", gRB.get("ESVG-00039", "_로컬 파일만 메타 데이터를 등록할 수 있습니다."));
            return false;
        } else {
            item.meta[name] = value.toString();
            return true;
        }
    }
}

function api_deleteMetaDataByIndex(index, name) {
    if (!checkStrongDataType(USER_DATA_TYPE.INTEGER_WITH_ZERO, index)) {
        errorOut("ESVG-00004", gRB.get("ESVG-00004", "_{0} 함수의 {1} 파라미터는 {2} 형식이어야 합니다."), ["api_deleteMetaDataByIndex", "index", "0 이상의 정수"]);
        return false;
    } else if (!checkStrongDataType(USER_DATA_TYPE.STRING, name)) {
        errorOut("ESVG-00004", gRB.get("ESVG-00004", "_{0} 함수의 {1} 파라미터는 {2} 형식이어야 합니다."), ["api_deleteMetaDataByIndex", "name", "String (no empty)"]);
        return false;
    } else if (!new RegExp("^[a-z]+[a-z0-9_-]*$", "gi").test(name)) {
        errorOut("ESVG-00062", gRB.get("ESVG-00062", "_메타 데이터 이름의 첫 문자는 반드시 영문자이어야 하며, 영문자와 숫자, '-', '_' 외에 다른 문자를 사용할 수 없습니다."));
        return false;
    } else if (index >= gsortedList.length || index < 0) {
        errorOut("ESVG-00006", gRB.get("ESVG-00006", "_주어진 순서[{0}]는 {1} 범위를 벗어났습니다."), [index, "파일 개수"]);
        return false;
    } else {
        var id = gsortedList[index];
        var item = gfileEngine.ufiles.getItem(id);
        if (checkStrongDataType(USER_DATA_TYPE.UNDEFINED, item.meta[name])) {
            errorOut("ESVG-00001", gRB.get("ESVG-00001", "_{0}이(가) 정의되지 않았습니다."), [name]);
            return false;
        } else {
            return delete item.meta[name];
        }
    }
}

function api_deleteMetaDataById(id, name) {
    if (!checkStrongDataType(USER_DATA_TYPE.STRING, id)) {
        errorOut("ESVG-00004", gRB.get("ESVG-00004", "_{0} 함수의 {1} 파라미터는 {2} 형식이어야 합니다."), ["api_deleteMetaDataById", "id", "String (no empty)"]);
        return false;
    } else if (!checkStrongDataType(USER_DATA_TYPE.STRING, name)) {
        errorOut("ESVG-00004", gRB.get("ESVG-00004", "_{0} 함수의 {1} 파라미터는 {2} 형식이어야 합니다."), ["api_deleteMetaDataByIndex", "name", "String (no empty)"]);
        return false;
    } else if (!new RegExp("^[a-z]+[a-z0-9_-]*$", "gi").test(name)) {
        errorOut("ESVG-00062", gRB.get("ESVG-00062", "_메타 데이터 이름의 첫 문자는 반드시 영문자이어야 하며, 영문자와 숫자, '-', '_' 외에 다른 문자를 사용할 수 없습니다."));
        return false;
    } else if (gsortedList.indexOf(id) < 0) {
        errorOut("ESVG-00005", gRB.get("ESVG-00005", "_{0}는 존재하지 않는 파일의 고유 아이디입니다."), [id]);
        return false;
    } else {
        var item = gfileEngine.ufiles.getItem(id);
        if (checkStrongDataType(USER_DATA_TYPE.UNDEFINED, item.meta[name])) {
            errorOut("ESVG-00001", gRB.get("ESVG-00001", "_{0}이(가) 정의되지 않았습니다."), [name]);
            return false;
        } else {
            return delete item.meta[name];
        }
    }
}

function api_getResponse(index) {
    if (checkStrongDataType(USER_DATA_TYPE.UNDEFINED, index)) {
        return cloneArray(gfileEngine.response);
    } else if (!checkStrongDataType(USER_DATA_TYPE.INTEGER_WITH_ZERO, index)) {
        errorOut("ESVG-00004", gRB.get("ESVG-00004", "_{0} 함수의 {1} 파라미터는 {2} 형식이어야 합니다."), ["api_getResponse", "index", "정수(0 이상)"]);
        return null;
    } else if (index >= gfileEngine.response.length || index < 0) {
        errorOut("ESVG-00006", gRB.get("ESVG-00006", "_주어진 순서[{0}]는 {1} 범위를 벗어났습니다."), [index, "응답 개수"]);
        return null;
    }
    return gfileEngine.response[index];
}

function api_getUploadStatus() {
    return clonejson(guploadStatus);
}

function api_getDownloadStatus() {
    return clonejson(gdownloadStatus);
}

function api_stopUploading() {
    gfileEngine.stopUploading();
}

function api_stopDownloading() {
    gfileEngine.stopDownloading();
}

function api_stopCompressWaiting() {
    gfileEngine.stopCompressWaiting();
}

function api_hasUploadableItems() {
    var arr = queryItems("ID", {
        type: "FILE",
        status: "WAIT"
    });
    return (arr.length > 0);
}

function api_upload(flag) {
    if (checkStrongDataType(USER_DATA_TYPE.UNDEFINED, flag)) {
        flag = "AUTO";
    } else if (!checkStrongDataType(USER_DATA_TYPE.STRING, flag)) {
        errorOut("ESVG-00004", gRB.get("ESVG-00004", "_{0} 함수의 {1} 파라미터는 {2} 형식이어야 합니다."), ["api_upload", "flag", "String"]);
        return;
    } else if (["AUTO", "CHECKED", "SELECTED"].indexOf(flag.toUpperCase()) == -1) {
        errorOut("ESVG-00042", gRB.get("ESVG-00042", "_파일 업로드 플래그 값은 AUTO, CHECKED, SELECTED 중 하나를 선택해야 합니다."));
        return;
    } else {
        flag = flag.toUpperCase();
    }
    var targetIds = [];
    var lessThanIE11 = (gbrowser.isIE === true && navigator.userAgent.indexOf(" MSIE ") >= 0);
    var caughtEmtpyFile = false;
    gfileEngine.ufiles.forEach(function(v, i) {
        if (v.status != "WAIT" || v.type != "FILE") return;
        if (flag == "CHECKED" && v.checked === true) {
            if (v.ofile.size == 0 && lessThanIE11) caughtEmtpyFile = true;
            else targetIds.push(v.id);
        } else if (flag == "SELECTED" && gselectedList.indexOf(v.id) >= 0) {
            if (v.ofile.size == 0 && lessThanIE11) caughtEmtpyFile = true;
            else targetIds.push(v.id);
        } else if (flag == "AUTO") {
            if (v.ofile.size == 0 && lessThanIE11) caughtEmtpyFile = true;
            else targetIds.push(v.id);
        }
    });
    if (caughtEmtpyFile) {
        errorOut("ESVG-00057", gRB.get("ESVG-00057", "_Internet Explorer 브라우저는 11 버전 이상에서만 0 바이트 파일을 업로드할 수 있습니다."));
    } else if (targetIds.length > 0) {
        gfileEngine.upload(targetIds);
    } else {
        errorOut("ESVG-00043", gRB.get("ESVG-00043", "_업로드할 대상이 없습니다."));
    }
}

function api_downloadById(id) {
    if (!checkStrongDataType(USER_DATA_TYPE.STRING, id)) {
        errorOut("ESVG-00004", gRB.get("ESVG-00004", "_{0} 함수의 {1} 파라미터는 {2} 형식이어야 합니다."), ["api_downloadById", "id", "String (no empty)"]);
    } else if (gsortedList.indexOf(id) < 0) {
        errorOut("ESVG-00005", gRB.get("ESVG-00005", "_{0}는 존재하지 않는 파일의 고유 아이디입니다."), [id]);
    } else {
        var item = gfileEngine.ufiles.getItem(id);
        if (item.type != "VIRTUAL") {
            errorOut("ESVG-00031", gRB.get("ESVG-00031", "_가상 파일만 다운로드할 수 있습니다."));
        } else if (!item.downUrl) {
            errorOut("ESVG-00040", gRB.get("ESVG-00040", "_경로(다운로드, 열기)가 정의되지 않았습니다."));
        } else {
            gfileEngine.download([id], false);
        }
    }
}

function api_download(flag, useMD) {
    if (checkStrongDataType(USER_DATA_TYPE.UNDEFINED, flag)) {
        flag = "AUTO";
    } else if (!checkStrongDataType(USER_DATA_TYPE.STRING, flag)) {
        errorOut("ESVG-00004", gRB.get("ESVG-00004", "_{0} 함수의 {1} 파라미터는 {2} 형식이어야 합니다."), ["api_download", "flag", "String"]);
        return;
    } else if (["AUTO", "CHECKED", "SELECTED"].indexOf(flag.toUpperCase()) == -1) {
        errorOut("ESVG-00063", gRB.get("ESVG-00063", "_파일 다운로드 플래그 값은 AUTO, CHECKED, SELECTED 중 하나를 선택해야 합니다."));
        return;
    } else if (gbrowser.isSafari && useMD && parseInt(gbrowser.version) < 10) {
        errorOut("ESVG-00067", gRB.get("ESVG-00067", "_대상 브라우저는 다중 파일 다운로드를 지원하지 않습니다."));
        return
    } else {
        flag = flag.toUpperCase();
    }
    var arr = [];
    for (var i = 0, len = gsortedList.length, t = null; i < len; i++) {
        if (arr.length > 0 && !useMD) break;
        t = gfileEngine.ufiles.getItem(gsortedList[i]);
        if (t.type != "VIRTUAL") continue;
        if (!t.downUrl) continue;
        if (flag == "CHECKED" && t.checked === true) {
            arr.push(t.id);
        } else if (flag == "SELECTED" && gselectedList.indexOf(t.id) >= 0) {
            arr.push(t.id);
        } else if (flag == "AUTO") {
            arr.push(t.id);
        }
    }
    if (arr.length == 0) {
        errorOut("ESVG-00022", gRB.get("ESVG-00022", "_다운로드할 대상 파일이 없습니다."));
    } else {
        gfileEngine.download(arr, useMD);
    }
}

function api_downloadCompressed(flag) {
    if (checkStrongDataType(USER_DATA_TYPE.UNDEFINED, flag)) {
        flag = "AUTO";
    } else if (!checkStrongDataType(USER_DATA_TYPE.STRING, flag)) {
        errorOut("ESVG-00004", gRB.get("ESVG-00004", "_{0} 함수의 {1} 파라미터는 {2} 형식이어야 합니다."), ["api_downloadCompressed", "flag", "String"]);
        return;
    } else if (["AUTO", "CHECKED", "SELECTED"].indexOf(flag.toUpperCase()) == -1) {
        errorOut("ESVG-00063", gRB.get("ESVG-00063", "_파일 다운로드 플래그 값은 AUTO, CHECKED, SELECTED 중 하나를 선택해야 합니다."));
        return;
    } else {
        flag = flag.toUpperCase();
    }
    var arr = [];
    for (var i = 0, len = gsortedList.length, t = null; i < len; i++) {
        t = gfileEngine.ufiles.getItem(gsortedList[i]);
        if (t.type != "VIRTUAL") continue;
        if (flag == "CHECKED" && t.checked === true) {
            arr.push(t.id);
        } else if (flag == "SELECTED" && gselectedList.indexOf(t.id) >= 0) {
            arr.push(t.id);
        } else if (flag == "AUTO") {
            arr.push(t.id);
        }
    }
    if (arr.length == 0) {
        errorOut("ESVG-00022", gRB.get("ESVG-00022", "_다운로드할 대상 파일이 없습니다."));
    } else {
        gfileEngine.downloadCompressed(arr);
    }
}

function api_executeItem(index) {
    if (!checkStrongDataType(USER_DATA_TYPE.INTEGER_WITH_ZERO, index)) {
        errorOut("ESVG-00004", gRB.get("ESVG-00004", "_{0} 함수의 {1} 파라미터는 {2} 형식이어야 합니다."), ["api_removeByIndex", "index", "정수(0 이상)"]);
    } else if (index >= gsortedList.length || index < 0) {
        errorOut("ESVG-00006", gRB.get("ESVG-00006", "_주어진 순서[{0}]는 {1} 범위를 벗어났습니다."), [index, "파일 개수"]);
    } else {
        var id = gsortedList[index];
        var item = gfileEngine.ufiles.getItem(id);
        if (item.type != "VIRTUAL") {
            errorOut("ESVG-00049", gRB.get("ESVG-00049", "_가상 파일만 열기를 허용합니다."));
        } else {
            gfileEngine.run(item.id);
        }
    }
}

function api_dispatchSVGResize() {
    onResizeHandler(null);
}

function api_selectAll() {
    selectAllFileItems(true);
}

function api_unselectAll() {
    unselectAllFileItems(true);
}

function api_selectByIndex(index) {
    if (!checkStrongDataType(USER_DATA_TYPE.INTEGER_WITH_ZERO, index)) {
        errorOut("ESVG-00004", gRB.get("ESVG-00004", "_{0} 함수의 {1} 파라미터는 {2} 형식이어야 합니다."), ["api_selectByIndex", "index", "정수(0 이상)"]);
    } else if (index >= gsortedList.length || index < 0) {
        errorOut("ESVG-00006", gRB.get("ESVG-00006", "_주어진 순서[{0}]는 {1} 범위를 벗어났습니다."), [index, "항목"]);
    } else {
        selectFileItem(gsortedList[index], true);
    }
}

function api_unselectByIndex(index) {
    if (!checkStrongDataType(USER_DATA_TYPE.INTEGER_WITH_ZERO, index)) {
        errorOut("ESVG-00004", gRB.get("ESVG-00004", "_{0} 함수의 {1} 파라미터는 {2} 형식이어야 합니다."), ["api_selectByIndex", "index", "정수(0 이상)"]);
    } else if (index >= gsortedList.length || index < 0) {
        errorOut("ESVG-00006", gRB.get("ESVG-00006", "_주어진 순서[{0}]는 {1} 범위를 벗어났습니다."), [index, "항목"]);
    } else {
        unselectFileItem(gsortedList[index], true);
    }
}

function api_isSelectedByIndex(index) {
    if (!checkStrongDataType(USER_DATA_TYPE.INTEGER_WITH_ZERO, index)) {
        errorOut("ESVG-00004", gRB.get("ESVG-00004", "_{0} 함수의 {1} 파라미터는 {2} 형식이어야 합니다."), ["api_selectByIndex", "index", "정수(0 이상)"]);
        return undefined;
    } else if (index >= gsortedList.length || index < 0) {
        errorOut("ESVG-00006", gRB.get("ESVG-00006", "_주어진 순서[{0}]는 {1} 범위를 벗어났습니다."), [index, "항목"]);
        return undefined;
    } else {
        return gselectedList.indexOf(gsortedList[index]) >= 0;
    }
}

function api_setHeaderVisible(visible) {
    if (!checkStrongDataType(USER_DATA_TYPE.BOOLEAN, visible)) {
        errorOut("ESVG-00004", gRB.get("ESVG-00004", "_{0} 함수의 {1} 파라미터는 {2} 형식이어야 합니다."), ["api_setHeaderVisible", "visible", "Boolean"]);
    } else if (gvector.uitype === "TILE" || gvector.uitype === "SINGLE") {
        return;
    } else {
        if (visible) {
            gvector.headerHeight = gvector.savedHeaderHeight;
            gvector.headerTextBaseline = Math.floor(gvector.savedHeaderHeight / 2) + 5;
        } else {
            gvector.savedHeaderHeight = gvector.headerHeight;
            gvector.headerHeight = 0;
        }
        updateUILayout(me);
    }
}

function api_setHeaderHeight(height) {
    if (!checkStrongDataType(USER_DATA_TYPE.INTEGER_WITH_ZERO, height)) {
        errorOut("ESVG-00004", gRB.get("ESVG-00004", "_{0} 함수의 {1} 파라미터는 {2} 형식이어야 합니다."), ["api_setHeaderHeight", "height", "정수(0 이상)"]);
    } else if (height < gMIN_HEADER_HEIGHT || height > gMAX_HEADER_HEIGHT) {
        errorOut("ESVG-00044", gRB.get("ESVG-00044", "_주어진 값[{0}]은 {1} 적합하지 않습니다."), [index, "헤더 높이(" + gMIN_HEADER_HEIGHT + "~" + gMAX_HEADER_HEIGHT + ")에"]);
    } else if (gvector.headerHeight == 0) {
        errorOut("ESVG-00045", gRB.get("ESVG-00045", "_헤더 숨김 상태에서는 높이를 조절할 수 없습니다."));
    } else if (gvector.uitype === "TILE" || gvector.uitype === "SINGLE") {
        return;
    } else {
        gvector.headerHeight = height;
        gvector.headerTextBaseline = Math.floor(height / 2) + 5;
        updateUILayout(me);
    }
}

function api_setStatusBarVisible(visible) {
    if (!checkStrongDataType(USER_DATA_TYPE.BOOLEAN, visible)) {
        errorOut("ESVG-00004", gRB.get("ESVG-00004", "_{0} 함수의 {1} 파라미터는 {2} 형식이어야 합니다."), ["api_setStatusBarVisible", "visible", "Boolean"]);
    } else if (gvector.uitype === "SINGLE") {
        return;
    } else {
        if (visible) {
            gvector.footerHeight = gDEF_FOOTER_HEIGHT;
            gvector.footerTextBaseline = Math.floor(gDEF_FOOTER_HEIGHT / 2) + 5;
        } else {
            gvector.footerHeight = 0;
        }
        updateUILayout(me);
    }
}

function api_setCheckerVisible(visible) {
    if (!checkStrongDataType(USER_DATA_TYPE.BOOLEAN, visible)) {
        errorOut("ESVG-00004", gRB.get("ESVG-00004", "_{0} 함수의 {1} 파라미터는 {2} 형식이어야 합니다."), ["api_setCheckerVisible", "visible", "Boolean"]);
    } else if (gvector.uitype === "SINGLE") {
        return;
    } else {
        gvector.checkerWidth = visible ? gDEF_CHECKER_WIDTH : 0;
        var checkers = gsvgHelper.queryAll(".css-item-checker");
        for (var i = 0, len = checkers.length, t = null; i < len; i++) {
            t = checkers[i];
            if (gvector.checkerWidth === 0) gsvgHelper.attr(t, "class", "hide", true);
            else gsvgHelper.removeAttr(t, "class", "hide");
        }
        updateUILayout(me);
    }
}

function api_setBorderVisible(visible) {
    if (!checkStrongDataType(USER_DATA_TYPE.BOOLEAN, visible)) {
        errorOut("ESVG-00004", gRB.get("ESVG-00004", "_{0} 함수의 {1} 파라미터는 {2} 형식이어야 합니다."), ["api_setBorderVisible", "visible", "Boolean"]);
    } else {
        var ui = gsvgHelper.get("UIC-OUTMOST-BORDER");
        if (!ui) return;
        ui.style.display = visible ? "block" : "none";
    }
}

function api_setHeaderSolidColor(hexrgb) {
    if (!checkStrongDataType(USER_DATA_TYPE.STRING, hexrgb)) {
        errorOut("ESVG-00004", gRB.get("ESVG-00004", "_{0} 함수의 {1} 파라미터는 {2} 형식이어야 합니다."), ["api_setHeaderSolidColor", "hexrgb", "String"]);
    } else if (isHexaColor(hexrgb) == false) {
        errorOut("ESVG-00046", gRB.get("ESVG-00046", "_{0}(은)는 올바르지 않은 색상 표현입니다."), [hexrgb]);
    } else if (gvector.uitype === "TILE" || gvector.uitype === "SINGLE") {
        return;
    } else {
        var header = gsvgHelper.get("UIC-HEADER");
        if (!header) return;
        gsvgHelper.attr(header, "fill", hexrgb);
    }
}

function api_setStatusBarSolidColor(hexrgb) {
    if (!checkStrongDataType(USER_DATA_TYPE.STRING, hexrgb)) {
        errorOut("ESVG-00004", gRB.get("ESVG-00004", "_{0} 함수의 {1} 파라미터는 {2} 형식이어야 합니다."), ["api_setStatusBarSolidColor", "hexrgb", "String"]);
    } else if (isHexaColor(hexrgb) == false) {
        errorOut("ESVG-00046", gRB.get("ESVG-00046", "_{0}(은)는 올바르지 않은 색상 표현입니다."), [hexrgb]);
    } else if (gvector.uitype === "SINGLE") {
        return;
    } else {
        var statusbar = gsvgHelper.get("UIC-FOOTER");
        if (!statusbar) return;
        gsvgHelper.attr(statusbar, "fill", hexrgb);
    }
}

function api_setHeaderGradient(direction, shexrgb, ehexrgb) {
    if (!checkStrongDataType(USER_DATA_TYPE.STRING, direction)) {
        errorOut("ESVG-00004", gRB.get("ESVG-00004", "_{0} 함수의 {1} 파라미터는 {2} 형식이어야 합니다."), ["api_setHeaderGradient", "direction", "String"]);
    } else if (["VERTICAL", "HORIZONTAL"].indexOf(direction.toUpperCase()) == -1) {
        errorOut("ESVG-00047", gRB.get("ESVG-00047", "_그레디언트 방향은 VERTICAL, HORIZONTAL 중 하나를 선택해야 합니다."));
    } else if (!checkStrongDataType(USER_DATA_TYPE.STRING, shexrgb)) {
        errorOut("ESVG-00004", gRB.get("ESVG-00004", "_{0} 함수의 {1} 파라미터는 {2} 형식이어야 합니다."), ["api_setHeaderGradient", "shexrgb", "String"]);
    } else if (isHexaColor(shexrgb) == false) {
        errorOut("ESVG-00046", gRB.get("ESVG-00046", "_{0}(은)는 올바르지 않은 색상 표현입니다."), [shexrgb]);
    } else if (!checkStrongDataType(USER_DATA_TYPE.STRING, ehexrgb)) {
        errorOut("ESVG-00004", gRB.get("ESVG-00004", "_{0} 함수의 {1} 파라미터는 {2} 형식이어야 합니다."), ["api_setHeaderGradient", "ehexrgb", "String"]);
    } else if (isHexaColor(ehexrgb) == false) {
        errorOut("ESVG-00046", gRB.get("ESVG-00046", "_{0}(은)는 올바르지 않은 색상 표현입니다."), [ehexrgb]);
    } else if (gvector.uitype === "TILE" || gvector.uitype === "SINGLE") {
        return;
    } else {
        var header = gsvgHelper.get("UIC-HEADER");
        var gradient = gsvgHelper.get("UIS-HEADER-BK-GRAD");
        var color1 = gsvgHelper.get("UIS-HEADER-BK-GRAD-COLOR1");
        var color2 = gsvgHelper.get("UIS-HEADER-BK-GRAD-COLOR2");
        if (!header) return;
        gsvgHelper.attr(gradient, "x2", direction == "VERTICAL" ? "0%" : "100%");
        gsvgHelper.attr(gradient, "y2", direction == "VERTICAL" ? "100%" : "0%");
        gsvgHelper.attr(color1, "stop-color", shexrgb);
        gsvgHelper.attr(color2, "stop-color", ehexrgb);
        gsvgHelper.attr(header, "fill", "url(#UIS-HEADER-BK-GRAD)");
    }
}

function api_setBackgroundColor(hexrgb) {
    if (!checkStrongDataType(USER_DATA_TYPE.STRING, hexrgb)) {
        errorOut("ESVG-00004", gRB.get("ESVG-00004", "_{0} 함수의 {1} 파라미터는 {2} 형식이어야 합니다."), ["api_setBackgroundColor", "hexrgb", "String"]);
    } else if (isHexaColor(hexrgb) == false) {
        errorOut("ESVG-00046", gRB.get("ESVG-00046", "_{0}(은)는 올바르지 않은 색상 표현입니다."), [hexrgb]);
    } else {
        var background = gsvgHelper.get("UIC-BACKGROUND");
        if (!background) return;
        gsvgHelper.attr(background, "fill", hexrgb);
    }
}

function api_setBackgroundImage(url, w, h) {
    if (!checkStrongDataType(USER_DATA_TYPE.STRING, url)) {
        errorOut("ESVG-00004", gRB.get("ESVG-00004", "_{0} 함수의 {1} 파라미터는 {2} 형식이어야 합니다."), ["api_setBackgroundImage", "url", "String"]);
    }
    if (!checkStrongDataType(USER_DATA_TYPE.INTEGER_WITH_ZERO, w)) {
        errorOut("ESVG-00004", gRB.get("ESVG-00004", "_{0} 함수의 {1} 파라미터는 {2} 형식이어야 합니다."), ["api_setBackgroundImage", "w", "정수(0 이상)"]);
    }
    if (!checkStrongDataType(USER_DATA_TYPE.INTEGER_WITH_ZERO, h)) {
        errorOut("ESVG-00004", gRB.get("ESVG-00004", "_{0} 함수의 {1} 파라미터는 {2} 형식이어야 합니다."), ["api_setBackgroundImage", "h", "정수(0 이상)"]);
    } else if (gvector.uitype === "SINGLE") {
        return;
    } else {
        var img = gsvgHelper.get("UIC-BACKGROUND-IMG");
        if (!img) return;
        gsvgHelper.attr(img, "width", w);
        gsvgHelper.attr(img, "height", h);
        gsvgHelper.attr(img, "layout-dx5", "x:50%-" + (w / 2) + "px; y:50%-" + (h / 2) + "px");
        gsvgHelper.attr(img, "xlink:href", url);
        updateUILayout(me);
    }
}

function api_setItemHeight(height) {
    if (!checkStrongDataType(USER_DATA_TYPE.INTEGER_WITH_ZERO, height)) {
        errorOut("ESVG-00004", gRB.get("ESVG-00004", "_{0} 함수의 {1} 파라미터는 {2} 형식이어야 합니다."), ["api_setItemHeight", "height", "정수(0 이상)"]);
    } else if (height < gMIN_LSTITEM_HEIGHT || height > gMAX_LSTITEM_HEIGHT) {
        errorOut("ESVG-00044", gRB.get("ESVG-00044", "_주어진 값[{0}]은 {1} 적합하지 않습니다."), [index, "헤더 높이(" + gMIN_LSTITEM_HEIGHT + "~" + gMAX_LSTITEM_HEIGHT + ")에"]);
    } else if (gvector.uitype === "TILE" || gvector.uitype === "SINGLE") {
        return;
    } else {
        gvector.fileItemHeight = height;
        gvector.itemTextBaseline = Math.floor(height / 2) + 6;
        var uitems = uitems = gsvgHelper.queryAll("#UIC-FILE-AREA .css-item");
        for (var i = 0, len = uitems.length, top = 0; i < len; i++) {
            top = i;
            gsvgHelper.attr(uitems[i], "y", top * gvector.fileItemHeight);
        }
        updateUILayout(me);
    }
}

function api_setHeaderFontName(font) {
    if (gvector.uitype != "LIST") return;
    var style = document.getElementById("UIS-HEADER-FONT-STYLE-NAME");
    if (!style) return;
    style.textContent = ".css-header-font-name { font-family: " + font + "; }";
}

function api_setHeaderFontColor(hexrgb) {
    if (gvector.uitype != "LIST") return;
    var style = document.getElementById("UIS-HEADER-FONT-STYLE-COLOR");
    if (!style) return;
    if (!hexrgb) hexrgb = "#666666";
    else if (!isHexaColor(hexrgb)) {
        errorOut("ESVG-00046", gRB.get("ESVG-00046", "_{0}(은)는 올바르지 않은 색상 표현입니다."), [hexrgb]);
        return;
    }
    style.textContent = ".css-header-font-color { fill: " + hexrgb + "; }";
}

function api_setItemFontName(font) {
    var style = document.getElementById("UIS-ITEM-FONT-STYLE-NAME");
    if (!style) return;
    style.textContent = ".css-item-font-name { font-family: " + font + "; }";
}

function api_setItemFontColor(hexrgb) {
    var style = document.getElementById("UIS-ITEM-FONT-STYLE-COLOR");
    if (!style) return;
    if (!hexrgb) hexrgb = "#595959";
    else if (!isHexaColor(hexrgb)) {
        errorOut("ESVG-00046", gRB.get("ESVG-00046", "_{0}(은)는 올바르지 않은 색상 표현입니다."), [hexrgb]);
        return;
    }
    style.textContent = ".css-item-font-color { fill: " + hexrgb + "; }";
}

function api_setStatusBarFontName(font) {
    if (gvector.uitype === "SINGLE") return;
    var style = document.getElementById("UIS-FOOTER-FONT-STYLE-NAME");
    if (!style) return;
    style.textContent = ".css-footer-font-name { font-family: " + font + "; }";
}

function api_setStatusBarFontColor(hexrgb) {
    if (gvector.uitype === "SINGLE") return;
    var style = document.getElementById("UIS-FOOTER-FONT-STYLE-COLOR");
    if (!hexrgb) hexrgb = "#666666";
    else if (!isHexaColor(hexrgb)) {
        errorOut("ESVG-00046", gRB.get("ESVG-00046", "_{0}(은)는 올바르지 않은 색상 표현입니다."), [hexrgb]);
        return;
    }
    style.textContent = ".css-footer-font-color { fill: " + hexrgb + "; }";
}

function api_setTileColumnCount(count) {
    if (gvector.uitype != "TILE") return;
    else if (!checkStrongDataType(USER_DATA_TYPE.INTEGER_WITH_ONE, count)) {
        errorOut("ESVG-00004", gRB.get("ESVG-00004", "_{0} 함수의 {1} 파라미터는 {2} 형식이어야 합니다."), ["api_setTileColumnCount", "count", "정수(1 이상)"]);
        return;
    } else {
        gvector.tileColumnCount = count;
        updateUILayout(me);
    }
}

function api_setDownloadButtonVisible(visible) {
    if (!checkStrongDataType(USER_DATA_TYPE.BOOLEAN, visible)) {
        errorOut("ESVG-00004", gRB.get("ESVG-00004", "_{0} 함수의 {1} 파라미터는 {2} 형식이어야 합니다."), ["api_setDownloadButtonVisible", "visible", "Boolean"]);
    } else if (gvector.uitype === "SINGLE") {
        return;
    } else {
        if (gvector.downloadButtonVisible === visible) return;
        gvector.downloadButtonVisible = (visible === true);
        var ops = gsvgHelper.queryAll(".css-item-op-down");
        if (!ops || ops.length == 0) return;
        for (var i = 0, len = ops.length, ui = null, item = null; i < len; i++) {
            ui = ops[i];
            item = ui.dataItem;
            if (item) {
                ui.style.display = (item.type == "VIRTUAL" && item.downUrl && gvector.downloadButtonVisible) ? "block" : "none";
            }
        }
    }
}

function api_setOpenButtonVisible(visible) {
    if (!checkStrongDataType(USER_DATA_TYPE.BOOLEAN, visible)) {
        errorOut("ESVG-00004", gRB.get("ESVG-00004", "_{0} 함수의 {1} 파라미터는 {2} 형식이어야 합니다."), ["api_setOpenButtonVisible", "visible", "Boolean"]);
    } else if (gvector.uitype === "SINGLE") {
        return;
    } else {
        if (gvector.openButtonVisible === visible) return;
        gvector.openButtonVisible = (visible === true);
        var ops = gsvgHelper.queryAll(".css-item-op-run");
        if (!ops || ops.length == 0) return;
        for (var i = 0, len = ops.length, ui = null, item = null; i < len; i++) {
            ui = ops[i];
            item = ui.dataItem;
            if (item) {
                ui.style.display = (item.type == "VIRTUAL" && item.openUrl && gvector.openButtonVisible) ? "block" : "none";
            }
        }
    }
}

function api_setItemBackColor(hexrgb) {
    var style = document.getElementById("UIS-ITEM-BACK-NORMAL-COLOR");
    if (!style) return;
    if (!hexrgb) hexrgb = "#fff";
    else if (!isHexaColor(hexrgb)) {
        errorOut("ESVG-00046", gRB.get("ESVG-00046", "_{0}(은)는 올바르지 않은 색상 표현입니다."), [hexrgb]);
        return;
    }
    style.textContent = ".css-item .css-item-back { fill: " + hexrgb + "; }";
    style = document.getElementById("UIS-ITEM-CHECKER-COLOR");
    if (!style) return;
    style.textContent = ".css-item .css-item-checker { fill: " + hexrgb + "; }";
}

function api_setGridLineColor(hexrgb) {
    var style = document.getElementById("UIS-ITEM-GRID-COLOR");
    if (!style) return;
    if (!hexrgb) hexrgb = "#d8d8d8";
    else if (!isHexaColor(hexrgb)) {
        errorOut("ESVG-00046", gRB.get("ESVG-00046", "_{0}(은)는 올바르지 않은 색상 표현입니다."), [hexrgb]);
        return;
    }
    style.textContent = ".css-item .css-item-grid-color { stroke: " + hexrgb + "; }";
}

function api_setGridLineVisible(visible) {
    var style = document.getElementById("UIS-ITEM-GRID");
    if (!style) return;
    style.textContent = ".css-item .css-item-grid { visibility: " + (visible === false ? "hidden" : "visible") + "; }";
}

function api_setFilterVisible(visible) {
    if (gvector.uitype === "SINGLE") {
        var style = document.getElementById("UIC-FILTER-TXT");
        if (!style) return;
        style.style.visibility = (visible === false ? "hidden" : "visible");
    } else {
        var style = document.getElementById("UIC-FILTER-GROUP");
        if (!style) return;
        style.style.visibility = (visible === false ? "hidden" : "visible");
    }
}

function api_setBorderColor(hexrgb) {
    if (!hexrgb) hexrgb = "#d8d8d8";
    else if (!isHexaColor(hexrgb)) {
        errorOut("ESVG-00046", gRB.get("ESVG-00046", "_{0}(은)는 올바르지 않은 색상 표현입니다."), [hexrgb]);
        return;
    }
    var target = gsvgHelper.get("UIC-OUTMOST-BORDER");
    if (!target) return;
    gsvgHelper.attr(target, "stroke", hexrgb);
}

function api_setHeaderLineColor(hexrgb) {
    if (!hexrgb) hexrgb = "#d8d8d8";
    else if (!isHexaColor(hexrgb)) {
        errorOut("ESVG-00046", gRB.get("ESVG-00046", "_{0}(은)는 올바르지 않은 색상 표현입니다."), [hexrgb]);
        return;
    }
    var target = gsvgHelper.get("UIC-HEADER-LN-BOTTOM");
    if (!target) return;
    gsvgHelper.attr(target, "stroke", hexrgb);
}

function api_setColumnLineColor(hexrgb) {
    if (!hexrgb) hexrgb = "#d8d8d8";
    else if (!isHexaColor(hexrgb)) {
        errorOut("ESVG-00046", gRB.get("ESVG-00046", "_{0}(은)는 올바르지 않은 색상 표현입니다."), [hexrgb]);
        return;
    }
    var target = gsvgHelper.get("UIC-HEADER-LN-SIZE");
    if (!target) return;
    gsvgHelper.attr(target, "stroke", hexrgb);
    target = gsvgHelper.get("UIC-HEADER-LN-OP");
    if (!target) return;
    gsvgHelper.attr(target, "stroke", hexrgb);
}

function api_setStatusBarLineColor(hexrgb) {
    if (!hexrgb) hexrgb = "#d8d8d8";
    else if (!isHexaColor(hexrgb)) {
        errorOut("ESVG-00046", gRB.get("ESVG-00046", "_{0}(은)는 올바르지 않은 색상 표현입니다."), [hexrgb]);
        return;
    }
    var target = gsvgHelper.get("UIC-FOOTER-LN-TOP");
    if (!target) return;
    gsvgHelper.attr(target, "stroke", hexrgb);
}

function api_useProgressDialog(enable) {
    gvector.useProgressDialog = (enable === true);
}

function api_isUsingProgressDialog() {
    return gvector.useProgressDialog;
}

function api_getSupportPHP() {
    return gfileEngine.isPHP;
}

function api_setSupportPHP(enable) {
    if (!checkStrongDataType(USER_DATA_TYPE.BOOLEAN, enable)) {
        errorOut("ESVG-00004", gRB.get("ESVG-00004", "_{0} 함수의 {1} 파라미터는 {2} 형식이어야 합니다."), ["api_setSupportPHP", "enable", "Boolean"]);
    } else {
        gfileEngine.isPHP = (enable === true);
    }
}

function api_setLimitMultiDownloadSize(size) {
    if (!checkStrongDataType(USER_DATA_TYPE.INTEGER_WITH_ZERO, size)) {
        errorOut("ESVG-00004", gRB.get("ESVG-00004", "_{0} 함수의 {1} 파라미터는 {2} 형식이어야 합니다."), ["api_setLimitDownloadSize", "size", "0 이상인 정수"]);
    } else {
        gfileEngine.limitMDSize = size;
    }
}

function api_getEnableColumnSorting() {
    return gvector.enableColumnSorting;
}

function api_setEnableColumnSorting(enable) {
    if (!checkStrongDataType(USER_DATA_TYPE.BOOLEAN, enable)) {
        errorOut("ESVG-00004", gRB.get("ESVG-00004", "_{0} 함수의 {1} 파라미터는 {2} 형식이어야 합니다."), ["api_setEnableColumnSorting", "enable", "Boolean"]);
    } else if (gvector.uitype === "TILE" || gvector.uitype === "SINGLE") {
        return;
    } else {
        var val = (enable === true);
        if (gvector.enableColumnSorting === val) return;
        gvector.enableColumnSorting = val;
        var region = gsvgHelper.get("#UIC-SORT-BUTTONS");
        if (gvector.enableColumnSorting) {
            gvector.sizeSortButtonWidth = gDEF_SIZESORTBUTTON_WIDTH;
            region.style.display = "block";
        } else {
            gvector.sizeSortButtonWidth = 0;
            region.style.display = "none";
        }
        updateUILayout(me);
    }
}

function api_setSortPriorityVirtualFile(enable) {
    if (!checkStrongDataType(USER_DATA_TYPE.BOOLEAN, enable)) {
        errorOut("ESVG-00004", gRB.get("ESVG-00004", "_{0} 함수의 {1} 파라미터는 {2} 형식이어야 합니다."), ["api_setSortPriorityVirtualFile", "enable", "Boolean"]);
    } else {
        gvector.sortPriorityVF = (enable === true);
    }
}

function api_getAutoSortingType() {
    return gvector.autoSortingType;
}

function api_setAutoSortingType(stype) {
    if (!checkStrongDataType(USER_DATA_TYPE.INTEGER_WITH_ZERO, stype)) {
        errorOut("ESVG-00004", gRB.get("ESVG-00004", "_{0} 함수의 {1} 파라미터는 {2} 형식이어야 합니다."), ["api_setAutoSortingType", "stype", "정수(0 이상)"]);
    } else if ([0, 1, 2].indexOf(stype) < 0) {
        errorOut("ESVG-00070", gRB.get("ESVG-00070", "_자동 정렬 방식은 0, 1, 2 중 하나이어야 합니다."));
    } else {
        gvector.autoSortingType = stype;
        if (stype === 0) return;
        var btnObj = gsvgHelper.get("UIC-HEADER-BK-NAME");
        if (btnObj) {
            if (typeof btnObj["data-sort-asc"] === "undefined") {
                btnObj["data-sort-asc"] = (stype === 1);
            }
        }
    }
}

function api_sortItems(colIndex, asc) {
    if (!checkStrongDataType(USER_DATA_TYPE.INTEGER_WITH_ZERO, colIndex)) {
        errorOut("ESVG-00004", gRB.get("ESVG-00004", "_{0} 함수의 {1} 파라미터는 {2} 형식이어야 합니다."), ["api_sortItems", "colIndex", "0 이상인 정수"]);
    } else {
        if (gvector.uitype == "LIST" && colIndex == 1) sortByName(asc);
        else if (gvector.uitype == "LIST" && colIndex == 2) sortBySize(asc);
        else if (gvector.uitype == "TILE") sortByName(asc);
        else return;
    }
}

function api_moveItemUp(index) {
    if (!checkStrongDataType(USER_DATA_TYPE.INTEGER_WITH_ZERO, index)) {
        errorOut("ESVG-00004", gRB.get("ESVG-00004", "_{0} 함수의 {1} 파라미터는 {2} 형식이어야 합니다."), ["api_moveItemUp", "index", "정수(0 이상)"]);
    } else if (index >= gsortedList.length || index < 0) {
        errorOut("ESVG-00006", gRB.get("ESVG-00006", "_주어진 순서[{0}]는 {1} 범위를 벗어났습니다."), [index, "항목"]);
    } else {
        moveUpAndDown(index, true);
    }
}

function api_moveItemDown(index) {
    if (!checkStrongDataType(USER_DATA_TYPE.INTEGER_WITH_ZERO, index)) {
        errorOut("ESVG-00004", gRB.get("ESVG-00004", "_{0} 함수의 {1} 파라미터는 {2} 형식이어야 합니다."), ["api_moveItemDown", "index", "정수(0 이상)"]);
    } else if (index >= gsortedList.length || index < 0) {
        errorOut("ESVG-00006", gRB.get("ESVG-00006", "_주어진 순서[{0}]는 {1} 범위를 벗어났습니다."), [index, "항목"]);
    } else {
        moveUpAndDown(index, false);
    }
}

function api_isPreviewEnable() {
    return gvector.enablePreview;
}

function api_setPreviewEnable(enable) {
    if (!checkStrongDataType(USER_DATA_TYPE.BOOLEAN, enable)) {
        errorOut("ESVG-00004", gRB.get("ESVG-00004", "_{0} 함수의 {1} 파라미터는 {2} 형식이어야 합니다."), ["api_setPreviewEnable", "enable", "boolean"]);
    } else {
        gvector.enablePreview = (enable === true);
    }
}

function api_getPreviewMethod() {
    return gvector.previewMethod;
}

function api_setPreviewMethod(method) {
    if (!checkStrongDataType(USER_DATA_TYPE.INTEGER_WITH_ONE, method)) {
        errorOut("ESVG-00004", gRB.get("ESVG-00004", "_{0} 함수의 {1} 파라미터는 {2} 형식이어야 합니다."), ["api_setPreviewMethod", "method", "integral number(over 0)"]);
    } else if ([1, 2].indexOf(method) < 0) {
        errorOut("ESVG-00072", gRB.get("ESVG-00072", "_미리보기 방식은 1, 2번 중 하나를 선택해야 합니다."));
    } else {
        gvector.previewMethod = method;
    }
}

function api_preview(index) {
    if (!checkStrongDataType(USER_DATA_TYPE.INTEGER_WITH_ZERO, index)) {
        errorOut("ESVG-00004", gRB.get("ESVG-00004", "_{0} 함수의 {1} 파라미터는 {2} 형식이어야 합니다."), ["api_preview", "index", "integral number(bigger or equal to 0)"]);
    } else if (index >= gsortedList.length || index < 0) {
        errorOut("ESVG-00006", gRB.get("ESVG-00006", "_주어진 순서[{0}]는 {1} 범위를 벗어났습니다."), [index, "item"]);
    } else if (gvector.enablePreview) {
        preview(index, gvector.previewMethod);
    }
}

function api_getPreviewBackgroundColor() {
    return gvector.previewBgColor;
}

function api_setPreviewBackgroundColor(hexrgb) {
    if (!isHexaColor(hexrgb)) {
        errorOut("ESVG-00046", gRB.get("ESVG-00046", "_{0}(은)는 올바르지 않은 색상 표현입니다."), [hexrgb]);
    } else {
        gvector.previewBgColor = hexrgb;
    }
}

function api_updateUI() {
    updateUILayout(me);
}

function api_getEnableDnd() {
    return gvector.enableDnd;
}

function api_setEnableDnd(enable) {
    if (!checkStrongDataType(USER_DATA_TYPE.BOOLEAN, enable)) {
        errorOut("ESVG-00004", gRB.get("ESVG-00004", "_{0} 함수의 {1} 파라미터는 {2} 형식이어야 합니다."), ["api_setEnableDnd", "enable", "Boolean"]);
    } else {
        gvector.enableDnd = (enable === true);
    }
}

function api_isUsingHDWhenSingle() {
    return gvector.useHDWhenSingle;
}

function api_setUsingHDWhenSingle(enable) {
    if (!checkStrongDataType(USER_DATA_TYPE.BOOLEAN, enable)) {
        errorOut("ESVG-00004", gRB.get("ESVG-00004", "_{0} 함수의 {1} 파라미터는 {2} 형식이어야 합니다."), ["api_setUsingHDWhenSingle", "enable", "Boolean"]);
    } else {
        gvector.useHDWhenSingle = (enable === true);
    }
}

function api_getCustomHeader(name) {
    if (!checkStrongDataType(USER_DATA_TYPE.STRING, name)) {
        errorOut("ESVG-00004", gRB.get("ESVG-00004", "_{0} 함수의 {1} 파라미터는 {2} 형식이어야 합니다."), ["api_getCustomHeader", "name", "String"]);
        return null;
    } else if (!name) {
        errorOut("ESVG-00082", gRB.get("ESVG-00082", "헤더 이름은 빈 문자열이거나 NULL일 수 없습니다."));
        return null;
    } else {
        if (gfileEngine.customHeaders.hasOwnProperty(name)) return gfileEngine.customHeaders[name];
        else return null;
    }
}

function api_setCustomHeader(name, value) {
    if (!checkStrongDataType(USER_DATA_TYPE.STRING, name)) {
        errorOut("ESVG-00004", gRB.get("ESVG-00004", "_{0} 함수의 {1} 파라미터는 {2} 형식이어야 합니다."), ["api_setCustomHeader", "name", "String"]);
    } else if (!name) {
        errorOut("ESVG-00082", gRB.get("ESVG-00082", "헤더 이름은 빈 문자열이거나 NULL일 수 없습니다."));
    } else if (!checkStrongDataType(USER_DATA_TYPE.STRING, value)) {
        errorOut("ESVG-00004", gRB.get("ESVG-00004", "_{0} 함수의 {1} 파라미터는 {2} 형식이어야 합니다."), ["api_setCustomHeader", "value", "String"]);
    } else if (value == null || typeof value == "undefined") {
        errorOut("ESVG-00083", gRB.get("ESVG-00083", "헤더 값은 NULL일 수 없습니다."));
    } else {
        gfileEngine.customHeaders[name] = value;
    }
}

function api_removeCustomHeader(name) {
    if (!checkStrongDataType(USER_DATA_TYPE.STRING, name)) {
        errorOut("ESVG-00004", gRB.get("ESVG-00004", "_{0} 함수의 {1} 파라미터는 {2} 형식이어야 합니다."), ["api_removeCustomHeader", "name", "String"]);
    } else if (!name) {
        errorOut("ESVG-00082", gRB.get("ESVG-00082", "헤더 이름은 빈 문자열이거나 NULL일 수 없습니다."));
    } else {
        if (gfileEngine.customHeaders.hasOwnProperty(name)) {
            delete gfileEngine.customHeaders[name];
        }
    }
}

function api_getTotalCustomHeaders(separator) {
    if (typeof separator == "undefined") {
        separator = "\n";
    } else if (!checkStrongDataType(USER_DATA_TYPE.STRING, separator)) {
        errorOut("ESVG-00004", gRB.get("ESVG-00004", "_{0} 함수의 {1} 파라미터는 {2} 형식이어야 합니다."), ["api_getTotalCustomHeaders", "separator", "String"]);
        return null;
    }
    var arr = [];
    for (var name in gfileEngine.customHeaders) {
        arr.push("" + name + ":" + gfileEngine.customHeaders[name]);
    }
    return arr.join(separator);
}

function api_getWithCredentials() {
    return gfileEngine.credential;
}

function api_setWithCredentials(isWith) {
    if (!checkStrongDataType(USER_DATA_TYPE.BOOLEAN, isWith)) {
        errorOut("ESVG-00004", gRB.get("ESVG-00004", "_{0} 함수의 {1} 파라미터는 {2} 형식이어야 합니다."), ["api_setWithCredentials", "isWith", "Boolean"]);
    } else {
        gfileEngine.credential = (isWith === true);
    }
}

function api_setSizeColumnVisible(visible) {
    if (!checkStrongDataType(USER_DATA_TYPE.BOOLEAN, visible)) {
        errorOut("ESVG-00004", gRB.get("ESVG-00004", "_{0} 함수의 {1} 파라미터는 {2} 형식이어야 합니다."), ["api_setSizeColumnVisible", "visible", "Boolean"]);
    } else if (gvector.uitype === "TILE" || gvector.uitype === "SINGLE") {
        return;
    } else {
        gvector.sizeColumnWidth = visible === true ? 70 : 0;
        var target = document.getElementById("UIC-HEADER-TXT-SIZE");
        if (target) target.style.visibility = (visible === true ? "visible" : "hidden");
        var style = document.getElementById("UIS-ITEM-SIZE-VISIBLE");
        style.textContent = ".css-item-size { display: " + (visible === true ? "block" : "none") + "; }";
        var icoAsc = gsvgHelper.get("UIC-SORT-BUTTON-SIZE-ASC"),
            icoDesc = gsvgHelper.get("UIC-SORT-BUTTON-SIZE-DESC");
        if (icoAsc && icoDesc) {
            icoAsc.style.display = "none";
            icoDesc.style.display = "none";
        }
        updateUILayout(me);
    }
}

function onErrorHandler(code, message, parameters) {
    errorOut(code, gRB.get(code, message), parameters);
}

function onUploadBeginHandler(upstatus) {
    onUploadProgressHandler(upstatus);
    setTimeout(function() {
        dispatchDEXTX5Event("uploadBegin", createDEXTX5Event("uploadBegin", {
            id: gvector.elementId
        }));
    }, 1);
}

function onUploadItemStartHandler(upstatus) {
    onUploadProgressHandler(upstatus);
    setTimeout(function() {
        dispatchDEXTX5Event("uploadItemStart", createDEXTX5Event("uploadItemStart", {
            id: gvector.elementId,
            itemId: upstatus.currentItem ? upstatus.currentItem.id : null
        }));
    }, 1);
}

function onUploadProgressHandler(upstatus) {
    if (!upstatus) return;
    guploadStatus.totalSize = upstatus.totalSize;
    guploadStatus.totalSendSize = upstatus.totalSendSize;
    guploadStatus.totalCount = upstatus.totalCount;
    guploadStatus.completeCount = upstatus.completeCount;
    guploadStatus.currentSize = upstatus.currentSize;
    guploadStatus.currentSendSize = upstatus.currentSendSize;
    guploadStatus.currentName = upstatus.currentName;
    guploadStatus.totalRate = upstatus.getTotalRate();
    guploadStatus.totalSpeed = upstatus.getTotalSpeed();
    guploadStatus.currentRate = upstatus.getCurrentRate();
    guploadStatus.currentSpeed = upstatus.getCurrentSpeed();
    guploadStatus.totalTime = upstatus.getTotalSendTime();
    guploadStatus.currentTime = upstatus.getCurrentSendTime();
    guploadStatus.remainedTotalTime = upstatus.getRemainedTotalTime();
    guploadStatus.remainedCurrentTime = upstatus.getRemainedCurrentTime();
}

function onUploadItemEndHandler(upstatus, responseText) {
    onUploadProgressHandler(upstatus);
    setTimeout(function() {
        dispatchDEXTX5Event("uploadItemEnd", createDEXTX5Event("uploadItemEnd", {
            id: gvector.elementId,
            itemId: upstatus.currentItem ? upstatus.currentItem.id : null,
            response: responseText
        }));
    }, 1);
}

function onUploadCompletehandler() {
    setTimeout(function() {
        dispatchDEXTX5Event("uploadCompleted", createDEXTX5Event("uploadCompleted", {
            id: gvector.elementId
        }));
    }, 1);
}

function onUploadCancelHandler() {
    setTimeout(function() {
        dispatchDEXTX5Event("uploadStopped", createDEXTX5Event("uploadStopped", {
            id: gvector.elementId
        }));
    }, 1);
}

function onDownloadBeginHandler(downstatus) {
    onDownloadProgressHandler(downstatus);
    setTimeout(function() {
        dispatchDEXTX5Event("downloadBegin", createDEXTX5Event("downloadBegin", {
            id: gvector.elementId
        }));
    }, 1);
}

function onDownloadItemStartHandler(downstatus) {
    onDownloadProgressHandler(downstatus);
    setTimeout(function() {
        dispatchDEXTX5Event("downloadItemStart", createDEXTX5Event("downloadItemStart", {
            id: gvector.elementId,
            itemId: downstatus.currentItem ? downstatus.currentItem.id : null
        }));
    }, 1);
}

function onDownloadProgressHandler(downstatus) {
    if (!downstatus) return;
    gdownloadStatus.totalSize = downstatus.totalSize;
    gdownloadStatus.totalReceiveSize = downstatus.totalSendSize;
    gdownloadStatus.totalCount = downstatus.totalCount;
    gdownloadStatus.completeCount = downstatus.completeCount;
    gdownloadStatus.currentSize = downstatus.currentSize;
    gdownloadStatus.currentReceiveSize = downstatus.currentSendSize;
    gdownloadStatus.currentName = downstatus.currentName;
    gdownloadStatus.totalRate = downstatus.getTotalRate();
    gdownloadStatus.totalSpeed = downstatus.getTotalSpeed();
    gdownloadStatus.currentRate = downstatus.getCurrentRate();
    gdownloadStatus.currentSpeed = downstatus.getCurrentSpeed();
    gdownloadStatus.totalTime = downstatus.getTotalSendTime();
    gdownloadStatus.currentTime = downstatus.getCurrentSendTime();
    gdownloadStatus.remainedTotalTime = downstatus.getRemainedTotalTime();
    gdownloadStatus.remainedCurrentTime = downstatus.getRemainedCurrentTime();
}

function onDownloadItemEndHandler(downstatus) {
    onDownloadProgressHandler(downstatus);
    setTimeout(function() {
        dispatchDEXTX5Event("downloadItemEnd", createDEXTX5Event("downloadItemEnd", {
            id: gvector.elementId,
            itemId: downstatus.currentItem ? downstatus.currentItem.id : null
        }));
    }, 1);
}

function onDownloadCompletehandler() {
    setTimeout(function() {
        dispatchDEXTX5Event("downloadCompleted", createDEXTX5Event("downloadCompleted", {
            id: gvector.elementId
        }));
    }, 1);
}

function onDownloadCancelHandler() {
    setTimeout(function() {
        dispatchDEXTX5Event("downloadStopped", createDEXTX5Event("downloadStopped", {
            id: gvector.elementId
        }));
    }, 1);
}

function onCompressBeginHandler() {
    setTimeout(function() {
        dispatchDEXTX5Event("compressBegin", createDEXTX5Event("compressBegin", {
            id: gvector.elementId
        }));
    }, 1);
}

function onCompressCompleteHandler() {
    setTimeout(function() {
        dispatchDEXTX5Event("compressCompleted", createDEXTX5Event("compressCompleted", {
            id: gvector.elementId
        }));
    }, 1);
}

function onCompressCancelHandler() {
    setTimeout(function() {
        dispatchDEXTX5Event("compressStopped", createDEXTX5Event("compressStopped", {
            id: gvector.elementId
        }));
    }, 1);
}
var gResizingThreshold = 0;
var gResizingTimerHandle = 0;

function onResizeHandler(evt) {
    gResizingThreshold += 1;
    if (!gResizingTimerHandle) {
        gResizingTimerHandle = setTimeout(function() {
            if (gResizingThreshold <= 0) {
                clearTimeout(gResizingTimerHandle);
                gResizingThreshold = 0;
                gResizingTimerHandle = 0;
                updateUILayout(me);
            } else {
                gResizingThreshold -= 2;
                setTimeout(arguments.callee, 50);
            }
        }, 50);
    }
}

function stringfyBound(t) {
    var bound = null;
    if ((typeof(DOMRect) != "undefined" && t instanceof DOMRect) || (typeof(ClientRect) != "undefined" && t instanceof ClientRect)) {
        bound = [t.left + "", t.top + "", t.width + "", t.height + ""];
    } else if (t instanceof SVGRect) {
        bound = [
            t.x.toString(), t.y.toString(), t.width + "", t.height + ""
        ];
    } else {
        bound = [t.x.baseVal.value + "", t.y.baseVal.value + "", t.width.baseVal.value + "", t.height.baseVal.value + ""];
    }
    return bound.join(",");
}
var gdbclickTargets = {};

function onItemClickHandler(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    if (gfileEngine.acting) {
        errorOut("ESVG-00024", gRB.get("ESVG-00024", "_파일을 전송하고 있는 상태입니다."));
        return;
    }
    var t = evt.currentTarget;
    var item = t.dataItem;
    if (!item) return;
    if (gdbclickTargets[item.id] === true) {
        gdbclickTargets[item.id] = false;
        setTimeout(function() {
            dispatchDEXTX5Event("itemdbclick", createDEXTX5Event("itemdbclick", {
                id: gvector.elementId,
                itemIndex: gsortedList.indexOf(item.id),
                itemId: item.id,
                itemType: item.type
            }));
        }, 1);
    } else {
        gdbclickTargets[item.id] = true;
        setTimeout(function() {
            gdbclickTargets[item.id] = false;
        }, 300);
        if (evt.ctrlKey) {
            if (existFileItem(item.id)) {
                unselectFileItem(item.id, true);
            } else {
                selectFileItem(item.id, true);
                setTimeout(function() {
                    dispatchDEXTX5Event("itemselect", createDEXTX5Event("itemselect", {
                        id: gvector.elementId,
                        itemIndex: gsortedList.indexOf(item.id),
                        itemId: item.id,
                        itemType: item.type
                    }));
                }, 1);
            }
        } else if (evt.shiftKey && gselectedList.length > 0) {
            var first = gselectedList[0];
            unselectAllFileItems(true);
            selectRangeByShift(first, item.id);
            setTimeout(function() {
                dispatchDEXTX5Event("itemselect", createDEXTX5Event("itemselect", {
                    id: gvector.elementId,
                    itemIndex: gsortedList.indexOf(item.id),
                    itemId: item.id,
                    itemType: item.type
                }));
            }, 1);
        } else {
            unselectAllFileItems(true);
            selectFileItem(item.id, true);
            setTimeout(function() {
                dispatchDEXTX5Event("itemselect", createDEXTX5Event("itemselect", {
                    id: gvector.elementId,
                    itemIndex: gsortedList.indexOf(item.id),
                    itemId: item.id,
                    itemType: item.type
                }));
            }, 1);
        }
    }
}

function getUIItemBound(item) {
    return {
        left: item.x.baseVal.value,
        top: item.y.baseVal.value,
        right: item.x.baseVal.value + item.width.baseVal.value,
        bottom: item.y.baseVal.value + item.height.baseVal.value
    };
}

function onFileItemKeyDownHandler(evt) {
    if (evt.defaultPrevented) {
        return;
    }
    var keyValue = evt.keyCode;
    evt.preventDefault();
    evt.stopPropagation();
    if (gfileEngine.acting) {
        errorOut("ESVG-00024", gRB.get("ESVG-00024", "_파일을 전송하고 있는 상태입니다."));
        return;
    }
    if (keyValue == 33 || keyValue == 34 || keyValue == 35 || keyValue == 36 || keyValue == 38 || keyValue == 40 || keyValue == 39 || keyValue == 37) {
        var first = null,
            last = null,
            fitems = null,
            sibling = null,
            area = gsvgHelper.get("UIC-FILE-AREA"),
            ch = gsvgHelper.attr(area, "height"),
            step = 0;
        if (gvector.uitype == "LIST") {
            step = Math.floor(ch / gvector.fileItemHeight) + 1;
        } else if (gvector.uitype == "TILE") {
            step = Math.floor(ch / gvector.fileItemHeight) * gvector.tileColumnCount + 1;
        }
        if (gselectedList.length > 0) {
            first = gsvgHelper.get(gselectedList[0]);
            last = gsvgHelper.get(gselectedList[gselectedList.length - 1]);
        } else {
            fitems = gsvgHelper.queryAll("#UIC-FILE-AREA .css-item");
            if (fitems.length > 0) {
                first = fitems.item(0);
                last = fitems.item(0);
            } else return;
        }
        if (keyValue == 40 || (keyValue == 39 && gvector.uitype == "TILE")) {
            sibling = last.nextSibling;
        } else if (keyValue == 38 || (keyValue == 37 && gvector.uitype == "TILE")) {
            sibling = last.previousSibling;
        } else if (keyValue == 35) {
            sibling = gsvgHelper.get(gsortedList[gsortedList.length - 1]);
        } else if (keyValue == 36) {
            sibling = gsvgHelper.get(gsortedList[0]);
        } else if (keyValue == 34) {
            sibling = last;
            for (var ncount = step; ncount > 0 && sibling; ncount--) {
                if (sibling.nextSibling && sibling.nextSibling.localName === "svg") {
                    sibling = sibling.nextSibling;
                } else break;
            }
        } else if (keyValue == 33) {
            sibling = last;
            for (var ncount = step; ncount > 0 && sibling; ncount--) {
                if (sibling.previousSibling && sibling.previousSibling.localName === "svg") {
                    sibling = sibling.previousSibling;
                } else break;
            }
        }
        if (!sibling) return;
        if (!sibling.getAttributeNS) return;
        var clss = sibling.getAttributeNS(null, "class");
        if (!clss || clss.indexOf("css-item") != 0) return;
        var bound = getUIItemBound(sibling);
        if (bound.bottom > (area.viewBox.baseVal.y + area.viewBox.baseVal.height)) {
            scrollTo(gsortedList.indexOf(sibling.id));
        } else if (bound.top < area.viewBox.baseVal.y) {
            scrollTo(gsortedList.indexOf(sibling.id));
        }
        unselectAllFileItems(true);
        if (evt.shiftKey) {
            var fbound = getUIItemBound(first);
            selectRangeByShift(first.id, sibling.id, fbound.top < bound.top);
        } else {
            selectFileItem(sibling.id, true);
        }
        setTimeout(function() {
            dispatchDEXTX5Event("itemselect", createDEXTX5Event("itemselect", {
                id: gvector.elementId,
                itemIndex: gsortedList.indexOf(sibling.id),
                itemId: sibling.id,
                itemType: sibling.type
            }));
        }, 1);
    } else if ((keyValue == 46 || keyValue == 8) && gvector.uitype != "SINGLE") {
        var dtargets = [];
        for (var i = 0, len = gselectedList.length, item = null; i < len; i++) {
            item = gfileEngine.ufiles.getItem(gselectedList[i]);
            if (!item) continue;
            else if (item.lock === true) {
                errorOut("ESVG-00052", gRB.get("ESVG-00052", "_잠겨 있는 항목이 존재하므로 삭제할 수 없습니다."));
                return;
            } else {
                dtargets.push(item.id);
            }
        }
        if (dtargets.length > 0) {
            removeFilesNUpdateUI(dtargets, false, true);
        } else {
            errorOut("ESVG-00038", gRB.get("ESVG-00038", "_삭제할 대상이 없습니다."));
        }
    }
}

function onRunFileHandler(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    if (gfileEngine.acting) {
        errorOut("ESVG-00024", gRB.get("ESVG-00024", "_파일을 전송하고 있는 상태입니다."));
        return;
    }
    var t = evt.currentTarget;
    if (t.correspondingUseElement) t = t.correspondingUseElement;
    var item = t.dataItem;
    if (item) {
        if (item.type != "VIRTUAL") {
            errorOut("ESVG-00041", gRB.get("ESVG-00041", "_가상 파일만 열 수 있습니다."));
        } else if (!item.openUrl) {
            errorOut("ESVG-00040", gRB.get("ESVG-00040", "_경로(다운로드, 열기)가 정의되지 않았습니다."));
        } else {
            gfileEngine.run(item.id);
        }
    }
}

function onDownloadFileHandler(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    if (gfileEngine.acting) {
        errorOut("ESVG-00024", gRB.get("ESVG-00024", "_파일을 전송하고 있는 상태입니다."));
        return;
    }
    var t = evt.currentTarget;
    if (t.correspondingUseElement) t = t.correspondingUseElement;
    var item = t.dataItem;
    if (item) {
        if (item.type != "VIRTUAL") {
            errorOut("ESVG-00031", gRB.get("ESVG-00031", "_가상 파일만 다운로드할 수 있습니다."));
        } else if (!item.downUrl) {
            errorOut("ESVG-00040", gRB.get("ESVG-00040", "_경로(다운로드, 열기)가 정의되지 않았습니다."));
        } else {
            if (gvector.useHDWhenSingle === true) {
                dispatchDEXTX5Event("downloadToHDForSingle", createDEXTX5Event("downloadToHDForSingle", {
                    id: gvector.elementId,
                    itemId: item.id
                }));
            } else {
                gfileEngine.download([item.id]);
            }
        }
    }
}

function onDeleteFileHandler(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    if (gfileEngine.acting) {
        errorOut("ESVG-00024", gRB.get("ESVG-00024", "_파일을 전송하고 있는 상태입니다."));
        return;
    }
    var t = evt.currentTarget;
    if (t.correspondingUseElement) t = t.correspondingUseElement;
    var item = t.dataItem;
    if (item && item.lock === false) {
        if (gvector.uitype == "SINGLE") {
            unsetUIItemForSingle();
        } else {
            removeFilesNUpdateUI([item.id], false, true);
        }
    }
}

function onFileCheckHandler(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    if (gfileEngine.acting) {
        errorOut("ESVG-00024", gRB.get("ESVG-00024", "_파일을 전송하고 있는 상태입니다."));
        return;
    }
    var t = evt.target;
    if (t.correspondingUseElement) t = t.correspondingUseElement;
    if (!t.dataItem) {
        if (!t.id || t.id != "UIC-HEADER-CHECKER-NOT" || t.id != "UIC-HEADER-CHECKER-CHK") {
            t = evt.currentTarget;
            if (t.correspondingUseElement) t = t.correspondingUseElement;
        }
    }
    if (t && t.dataItem) {
        t.dataItem.checked = !t.dataItem.checked;
        checkItem(t.dataItem);
    } else if (t.id === "UIC-HEADER-CHECKER-NOT") {
        for (var i = 0, len = gfileEngine.ufiles.length, item = null; i < len; i++) {
            item = gfileEngine.ufiles[i];
            item.checked = true;
            checkItem(item);
        }
    } else if (t.id === "UIC-HEADER-CHECKER-CHK") {
        for (var i = 0, len = gfileEngine.ufiles.length, item = null; i < len; i++) {
            item = gfileEngine.ufiles[i];
            item.checked = false;
            checkItem(item);
        }
    } else {
        return;
    }
    if (gsvgHelper.get("UIC-HEADER-CHECKER") && gfileEngine.ufiles.length > 0) {
        var count = 0,
            len = gfileEngine.ufiles.length;
        for (var i = 0, item = null; i < len; i++) {
            item = gfileEngine.ufiles[i];
            count += (item.checked ? 1 : 0);
        }
        gsvgHelper.get("UIC-HEADER-CHECKER-NOT").style.display = count == len ? "none" : "block";
        gsvgHelper.get("UIC-HEADER-CHECKER-CHK").style.display = count == len ? "block" : "none";
    }
}

function errorOut(cd, msg, parameters) {
    toggleJobWorking(false);
    var maked = parameters ? sformat(msg, parameters) : msg;
    setTimeout(function() {
        dispatchDEXTX5Event("error", createDEXTX5Event("error", {
            id: gvector.elementId,
            code: cd,
            message: maked
        }));
    }, 10);
}

function resetHtmlFiles() {
    var input;
    input = gsvgHelper.get("XHTML-INPUT-FILES");
    if (input && input.files && input.files.length > 0) {
        gsvgHelper.get("XHTML-FILE-FORM").reset();
    }
    input = gsvgHelper.get("XHTML-INPUT-FOLDER");
    if (input && input.files && input.files.length > 0) {
        gsvgHelper.get("XHTML-FILE-FORM").reset();
    }
}

function getCheckedItemIds() {
    var checkeds = [];
    gfileEngine.ufiles.forEach(function(v, i) {
        if (v.checked === true) checkeds.push(v.id);
    });
    return checkeds;
}

function queryItems(rettype, condition) {
    var targets = [];
    gfileEngine.ufiles.forEach(function(v, i) {
        if (isDefined(condition.lock) && condition.lock != v.lock) return;
        if (isDefined(condition.checked) && condition.checked != v.checked) return;
        if (isDefined(condition.type) && condition.type != v.type) return;
        if (isDefined(condition.status) && condition.status != v.status) return;
        if (rettype == "ID") targets.push(v.id);
        else if (rettype == "ITEM") targets.push(v);
    });
    return targets;
}

function checkNotAllowedFileExtension(list) {
    var al = [],
        nl = [];
    for (var i = 0, t = null, ext = null; i < list.length; i++) {
        t = list[i];
        ext = getFileExtension(t.name).toLowerCase();
        if (ext === "" && gvector.allowedNoExtension === false) {
            nl.push(t);
            continue;
        } else if (ext === ".") {
            nl.push(t);
            continue;
        }
        if (ext && gvector.filters.length > 0 && gvector.filters.indexOf(ext) < 0) {
            nl.push(t);
            continue;
        }
        if (ext && gvector.reversedFilters.length > 0 && gvector.reversedFilters.indexOf(ext) >= 0) {
            nl.push(t);
            continue;
        }
        al.push(t);
    }
    return {
        allowed: al,
        not: nl,
        getNotAllowedNames: function(splitter) {
            var str = "";
            this.not.forEach(function(v, i) {
                str += v.name + ((i + 1) < this.not.length ? splitter : "");
            });
            return str;
        }
    };
}

function checkEmptyFileInIE10(list) {
    var al = [],
        nl = [];
    var lessThanIE11 = (gbrowser.isIE === true && navigator.userAgent.indexOf(" MSIE ") >= 0);
    for (var i = 0; i < list.length; i++) {
        if (list[i].size == 0 && lessThanIE11) {
            nl.push(list[i]);
        } else {
            al.push(list[i]);
        }
    }
    return {
        allowed: al,
        not: nl,
        getNotAllowedNames: function(splitter) {
            var str = "";
            this.not.forEach(function(v, i) {
                str += v.name + ((i + 1) < this.not.length ? splitter : "");
            });
            return str;
        }
    };
}

function checkSmallerThanAllowedSize(list) {
    var al = [],
        nl = [];
    for (var i = 0; i < list.length; i++) {
        if (gvector.minFileSize >= 0 && gvector.minFileSize > list[i].size) {
            nl.push(list[i]);
        } else {
            al.push(list[i]);
        }
    }
    return {
        allowed: al,
        not: nl,
        getNotAllowedNames: function(splitter) {
            var str = "";
            this.not.forEach(function(v, i) {
                str += v.name + ((i + 1) < this.not.length ? splitter : "");
            });
            return str;
        }
    };
}

function checkBiggerThanAllowedSize(list) {
    var al = [],
        nl = [];
    for (var i = 0; i < list.length; i++) {
        if (gvector.maxFileSize >= 0 && gvector.maxFileSize < list[i].size) {
            nl.push(list[i]);
        } else {
            al.push(list[i]);
        }
    }
    return {
        allowed: al,
        not: nl,
        getNotAllowedNames: function(splitter) {
            var str = "";
            this.not.forEach(function(v, i) {
                str += v.name + ((i + 1) < this.not.length ? splitter : "");
            });
            return str;
        }
    };
}

function checkAllowedTotalSize(list) {
    var al = [],
        nl = [];
    var sum = gfileEngine.ufiles.getTotalSize(!gvector.maxTotalSizeWithVF);
    for (var i = 0; i < list.length; i++) {
        sum += list[i].size;
        if (gvector.maxTotalSize >= 0 && gvector.maxTotalSize < sum) {
            nl.push(list[i]);
        } else {
            al.push(list[i]);
        }
    }
    return {
        allowed: al,
        not: nl,
        getNotAllowedNames: function(splitter) {
            var str = "";
            this.not.forEach(function(v, i) {
                str += v.name + ((i + 1) < this.not.length ? splitter : "");
            });
            return str;
        }
    };
}

function checkAllowedCount(list) {
    var al = [],
        nl = [];
    var clen = gfileEngine.ufiles.getLength(!gvector.maxFileCountWithVF);
    for (var i = 0; i < list.length; i++) {
        clen += 1;
        if (gvector.maxFileCount >= 0 && gvector.maxFileCount < clen) {
            nl.push(list[i]);
        } else {
            al.push(list[i]);
        }
    }
    return {
        allowed: al,
        not: nl,
        getNotAllowedNames: function(splitter) {
            var str = "";
            this.not.forEach(function(v, i) {
                str += v.name + ((i + 1) < this.not.length ? splitter : "");
            });
            return str;
        }
    };
}

function isFileDuplication(file) {
    for (var i = 0, len = gfileEngine.ufiles.length, t = null; i < len; i++) {
        t = gfileEngine.ufiles[i];
        if (t.name.toLowerCase() == file.name.toLowerCase() && t.size == file.size && t.mdate.getTime() == file.lastModifiedDate.getTime()) {
            return true;
        }
    }
    return false;
}

function checkDuplication(list) {
    var al = [],
        nl = [];
    for (var i = 0, len = list.length; i < len; i++) {
        if (isFileDuplication(list[i])) {
            nl.push(list[i]);
        } else {
            al.push(list[i]);
        }
    }
    return {
        allowed: al,
        not: nl,
        getNotAllowedNames: function(splitter) {
            var str = "";
            this.not.forEach(function(v, i) {
                str += v.name + ((i + 1) < this.not.length ? splitter : "");
            });
            return str;
        }
    };
}

function isImageFile(file) {
    if (!file) return false;
    if (!isFile(file)) return false;
    var imgPattern = new RegExp("^image\/");
    return imgPattern.test(file.type);
}

function displayJobWorking(msg) {
    var txt = gsvgHelper.get("UIC-JOB-WORKING-TXT");
    gsvgHelper.replaceText(txt, msg);
}

function toggleJobWorking(show) {
    if (gvector.uitype === "SINGLE") return;
    var enableFilter = (gbrowser.isFirefox || gbrowser.isSafari || gbrowser.isOpera);
    if (enableFilter) {
        var blured = gsvgHelper.get("UIC-FILE-AREA");
        if (show) {
            gsvgHelper.attr(blured, "filter", "url(#UIS-BLURING-JOB)");
        } else {
            gsvgHelper.attr(blured, "filter", "");
        }
    } else {
        gsvgHelper.get("UIC-JOB-WORKING-BK").style.display = show ? "block" : "none";
    }
    var txt = gsvgHelper.get("UIC-JOB-WORKING-TXT");
    gsvgHelper.replaceText(txt, "");
    txt.style.display = show ? "block" : "none";
    gsvgHelper.replaceText(txt, "fill", enableFilter ? "#000" : "#fff");
}

function registerLocalFiles(list) {
    var clen = 0,
        rest = 0,
        alen = 0,
        ti = -1,
        rs = null,
        tempList = null;
    if (!dispatchDEXTX5Event("beforeItemsAdd", createDEXTX5Event("beforeItemsAdd", {
            id: gvector.elementId,
            count: list.length
        }))) return false;
    if (gvector.duplicable === false) {
        var rs = checkDuplication(list);
        if (rs.not.length > 0) {
            if (!gvector.filterSilence) {
                if ((list.length - rs.not.length) > 0) {
                    if (confirm(sformat(gRB.get("TSVG-00001", "_총 {0}개의 파일 중, {1}개의 파일이 중복 대상입니다.\n나머지 파일을 추가하시겠습니까?"), [list.length, rs.not.length]))) {
                        list = rs.allowed;
                    } else return false;
                } else {
                    alert(gRB.get("TSVG-00009", "_중복된 항목을 삭제하였습니다.\n추가할 항목이 없습니다."));
                    return false;
                }
            } else {
                errorOut("ESVG-00033", gRB.get("ESVG-00033", "_중복 파일을 허용하지 않습니다."));
                return false;
            }
        }
    }
    rs = checkNotAllowedFileExtension(list);
    if (rs.not.length > 0) {
        if (!gvector.filterSilence) {
            if ((list.length - rs.not.length) > 0) {
                if (confirm(sformat(gRB.get("TSVG-00002", "_총 {0}개의 파일 중, {1}개의 파일은 허용하지 않는 파일 형식입니다.\n나머지 파일을 추가하시겠습니까?"), [list.length, rs.not.length]))) {
                    list = rs.allowed;
                } else return false;
            } else {
                alert(gRB.get("TSVG-00010", "_허가되지 않은 확장자 파일이 삭제 되었습니다.\n추가할 항목이 없습니다."));
                return false;
            }
        } else {
            errorOut("ESVG-00010", gRB.get("ESVG-00010", "_허용되지 않는 파일 형식입니다."));
            return false;
        }
    }
    rs = checkEmptyFileInIE10(list);
    if (rs.not.length > 0) {
        if (!gvector.filterSilence) {
            if ((list.length - rs.not.length) > 0) {
                if (confirm(sformat(gRB.get("TSVG-00002", "_총 {0}개의 파일 중, {1}개의 파일은 허용하지 않는 파일 형식입니다.\n나머지 파일을 추가하시겠습니까?"), [list.length, rs.not.length]))) {
                    list = rs.allowed;
                } else return false;
            } else {
                alert(gRB.get("TSVG-00011", "_0 바이트 크기를 갖는 파일이 삭제 되었습니다.\n추가할 항목이 없습니다."));
                return false;
            }
        } else {
            errorOut("ESVG-00058", gRB.get("ESVG-00058", "_브라우저 제한 조건에 따라 0 바이트 크기를 갖는 파일은 추가할 수 없습니다."));
            return false;
        }
    }
    rs = checkSmallerThanAllowedSize(list);
    if (rs.not.length > 0) {
        if (!gvector.filterSilence) {
            if ((list.length - rs.not.length) > 0) {
                if (confirm(sformat(gRB.get("TSVG-00006", "_총 {0}개의 파일 중, {1}개의 파일은 개별 최소 크기보다 미만입니다.\n나머지 파일을 추가하시겠습니까?"), [list.length, rs.not.length]))) {
                    list = rs.allowed;
                } else return false;
            } else {
                alert(sformat(gRB.get("TSVG-00012", "_{0} 보다 작은 파일이 삭제 되었습니다.\n추가할 항목이 없습니다."), [gvector.minFileSize]));
                return false;
            }
        } else {
            errorOut("ESVG-00015", gRB.get("ESVG-00015", "_{0} 보다 작은 파일은 전송할 수 없습니다."), [gvector.minFileSize]);
            return false;
        }
    }
    rs = checkBiggerThanAllowedSize(list);
    if (rs.not.length > 0) {
        if (!gvector.filterSilence) {
            if ((list.length - rs.not.length) > 0) {
                if (confirm(sformat(gRB.get("TSVG-00003", "_총 {0}개의 파일 중, {1}개의 파일은 개별 최대 크기 제한을 초과했습니다.\n나머지 파일을 추가하시겠습니까?"), [list.length, rs.not.length]))) {
                    list = rs.allowed;
                } else return false;
            } else {
                alert(sformat(gRB.get("TSVG-00013", "_{0} 보다 큰 파일이 삭제 되었습니다.\n추가할 항목이 없습니다."), [gvector.maxFileSize]));
                return false;
            }
        } else {
            errorOut("ESVG-00008", gRB.get("ESVG-00008", "_{0} 보다 큰 파일은 전송할 수 없습니다."), [gvector.maxFileSize]);
            return false;
        }
    }
    rs = checkAllowedTotalSize(list);
    if (rs.not.length > 0) {
        if (!gvector.filterSilence) {
            if ((list.length - rs.not.length) > 0) {
                if (confirm(sformat(gRB.get("TSVG-00004", "_전송할 수 있는 전체 파일의 최대 크기를 넘었습니다.\n총 {0}개의 파일 중, {1}개의 파일만 추가하시겠습니까?"), [list.length, rs.allowed.length]))) {
                    list = rs.allowed;
                } else return false;
            } else {
                alert(sformat(gRB.get("TSVG-00014", "_전송할 수 있는 전체 파일의 최대 크기({0})를 넘었습니다.\n추가할 항목이 없습니다."), [gvector.maxTotalSize]));
                return false;
            }
        } else {
            errorOut("ESVG-00009", gRB.get("ESVG-00009", "_전송할 수 있는 전체 파일의 최대 크기는 {0}입니다."), [gvector.maxTotalSize]);
            return false;
        }
    }
    rs = checkAllowedCount(list);
    if (rs.not.length > 0) {
        if (!gvector.filterSilence) {
            if ((list.length - rs.not.length) > 0) {
                if (confirm(sformat(gRB.get("TSVG-00005", "_전송할 수 있는 최대 파일의 개수를 넘었습니다.\n총 {0}개의 파일 중, {1}개의 파일만 추가하시겠습니까?"), [list.length, rs.allowed.length]))) {
                    list = rs.allowed;
                } else return false;
            } else {
                alert(sformat(gRB.get("TSVG-00015", "_전송할 수 있는 파일의 최대 개수({0})를 넘었습니다.\n추가할 항목이 없습니다."), [gvector.maxFileCount]));
                return false;
            }
        } else {
            errorOut("ESVG-00007", gRB.get("ESVG-00007", "_전송할 수 있는 파일의 개수는 최대 {0}개 입니다."), [gvector.maxFileCount]);
            return false;
        }
    }
    if (gvector.uitype != "SINGLE") {
        toggleJobWorking(true);
    }
    asyncRegisterOneFile(document.createDocumentFragment(), list, 0, 0);
    return true;
}

function asyncRegisterOneFile(fragment, list, index, count) {
    if (!dispatchDEXTX5Event("itemAdding", createDEXTX5Event("itemAdding", {
            id: gvector.elementId,
            file: list[index]
        }))) {} else {
        var fitem = gfileEngine.addFile(list[index]),
            uitem = null;
        if (gvector.uitype != "SINGLE") {
            displayJobWorking(fitem.name);
        }
        fitem.onUpdated = function(t) {
            updateUIItem(t);
        };
        if (gvector.uitype == "SINGLE") {
            setUIItemForSingle(fitem);
        } else {
            uitem = createUIItem(fitem);
            fragment.appendChild(uitem);
            updateCurrentFilesInfo();
        }
        gsortedList.push(fitem.id);
        count++;
    }
    index++;
    if (index < list.length) {
        setTimeout(function() {
            asyncRegisterOneFile(fragment, list, index, count);
        }, 50);
    } else {
        resetHtmlFiles();
        if (gsvgHelper.get("UIC-HEADER-CHECKER") && gfileEngine.ufiles.length > 0) {
            var fcount = 0,
                len = gfileEngine.ufiles.length;
            for (var i = 0, item = null; i < len; i++) {
                item = gfileEngine.ufiles[i];
                fcount += (item.checked ? 1 : 0);
            }
            gsvgHelper.get("UIC-HEADER-CHECKER-NOT").style.display = fcount == len ? "none" : "block";
            gsvgHelper.get("UIC-HEADER-CHECKER-CHK").style.display = fcount == len ? "block" : "none";
        }
        if (gvector.uitype === "SINGLE") {
            updateUILayout(me);
        } else {
            gsvgHelper.get("UIC-FILE-AREA").appendChild(fragment);
            displayJobWorking("Relayout...");
            setTimeout(function() {
                if (gvector.autoSortingType > 0) {
                    //--**console.log("DX5: auto sorting... type=" + gvector.autoSortingType);
                    sortByName(gvector.autoSortingType == 1);
                }
                updateUILayout(me);
                toggleJobWorking(false);
            }, 50);
        }
        setTimeout(function() {
            dispatchDEXTX5Event("itemsAdded", createDEXTX5Event("itemsAdded", {
                id: gvector.elementId,
                count: count
            }));
        }, 100);
    }
}

function registerVirtualFiles(list) {
    toggleJobWorking(true);
    asyncRegisterOneVirtualFile(document.createDocumentFragment(), list, 0);
}

function asyncRegisterOneVirtualFile(fragment, list, index) {
    var fitem = gfileEngine.addFile(list[index]),
        uitem = null;
    displayJobWorking(fitem.name);
    uitem = createUIItem(fitem);
    fitem.onUpdated = function(t) {
        updateUIItem(t);
    };
    fragment.appendChild(uitem);
    updateCurrentFilesInfo();
    gsortedList.push(fitem.id);
    index++;
    if (index < list.length) {
        setTimeout(function() {
            asyncRegisterOneVirtualFile(fragment, list, index);
        }, 50);
    } else {
        if (gsvgHelper.get("UIC-HEADER-CHECKER") && gfileEngine.ufiles.length > 0) {
            var fcount = 0,
                len = gfileEngine.ufiles.length;
            for (var i = 0, item = null; i < len; i++) {
                item = gfileEngine.ufiles[i];
                fcount += (item.checked ? 1 : 0);
            }
            gsvgHelper.get("UIC-HEADER-CHECKER-NOT").style.display = fcount == len ? "none" : "block";
            gsvgHelper.get("UIC-HEADER-CHECKER-CHK").style.display = fcount == len ? "block" : "none";
        }
        gsvgHelper.get("UIC-FILE-AREA").appendChild(fragment);
        displayJobWorking("Relayout...");
        setTimeout(function() {
            if (gvector.autoSortingType > 0) {
                //--**console.log("DX5: auto sorting... type=" + gvector.autoSortingType);
                sortByName(gvector.autoSortingType == 1);
            }
            updateUILayout(me);
            toggleJobWorking(false);
        }, 50);
    }
}

function removeFilesNUpdateUI(arr, permanently, fireEvent) {
    var target, uitem, current, sibling, oEvt, id = "",
        real = [],
        count = 0;
    if (fireEvent === true && !dispatchDEXTX5Event("beforeItemsDelete", createDEXTX5Event("beforeItemsDelete", {
            id: gvector.elementId,
            arr: arr
        }))) return false;
    while (arr.length > 0) {
        id = arr.shift();
        if (fireEvent === true && !dispatchDEXTX5Event("itemDeleting", createDEXTX5Event("itemDeleting", {
                id: gvector.elementId,
                itemId: id
            }))) continue;
        target = gfileEngine.ufiles.getItem(id);
        if (target && target.lock != true) {
            gfileEngine.ufiles.removeById(id);
            if (target.type == "VIRTUAL" && permanently === false) {
                target.type = "DVIRTUAL";
                target.checked = false;
                gfileEngine.xfiles.push(target);
            }
        } else {
            continue;
        }
        real.push(id);
        count++;
        uitem = gsvgHelper.get(id);
        if (!uitem) continue;
        else current = uitem;
        var cx, cy, sx, sy;
        cx = current.x.baseVal.value;
        cy = current.y.baseVal.value;
        while (current.nextSibling) {
            sibling = current.nextSibling;
            sx = sibling.x.baseVal.value;
            sy = sibling.y.baseVal.value;
            sibling.x.baseVal.value = cx;
            sibling.y.baseVal.value = cy;
            cx = sx;
            cy = sy;
            current = sibling;
        }
        uitem.parentNode.removeChild(uitem);
        oEvt = uitem;
        if (oEvt) {
            oEvt.dataItem = null;
            oEvt.removeEventListener("click", onItemClickHandler);
        }
        oEvt = uitem.querySelector("#" + id + "-CHECKER");
        if (oEvt) {
            oEvt.dataItem = null;
            oEvt.removeEventListener("click", onFileCheckHandler);
        }
        oEvt = uitem.querySelector("#" + id + "-OPRUN");
        if (oEvt) {
            oEvt.dataItem = null;
            oEvt.removeEventListener("click", onRunFileHandler);
        }
        oEvt = uitem.querySelector("#" + id + "-OPDOWN");
        if (oEvt) {
            oEvt.dataItem = null;
            oEvt.removeEventListener("click", onDownloadFileHandler);
        }
    }
    gselectedList = SETOPS.minus(gselectedList, real);
    gsortedList = SETOPS.minus(gsortedList, real);
    if (gsvgHelper.get("UIC-HEADER-CHECKER") && gfileEngine.ufiles.length == 0) {
        gsvgHelper.get("UIC-HEADER-CHECKER-NOT").style.display = "block";
        gsvgHelper.get("UIC-HEADER-CHECKER-CHK").style.display = "none";
    }
    updateCurrentFilesInfo();
    updateUILayout(me);
    if (fireEvent === true) {
        setTimeout(function() {
            dispatchDEXTX5Event("itemsDeleted", createDEXTX5Event("itemsDeleted", {
                id: gvector.elementId,
                count: count
            }));
        }, 100);
    }
    return real.length > 0;
}

function checkItem(t) {
    if (checkStrongDataType(USER_DATA_TYPE.STRING, t)) {
        t = gfileEngine.ufiles.getItem(t);
    }
    if (t) {
        gsvgHelper.get(t.id + "-CHECKER-NOT").style.display = t.checked ? "none" : "block";
        gsvgHelper.get(t.id + "-CHECKER-CHK").style.display = t.checked ? "block" : "none";
        return true;
    } else {
        errorOut("ESVG-00011", gRB.get("ESVG-00011", "_파일 항목이 없어 체크/해지 작업을 할 수 없습니다."));
        return false;
    }
}

function loadParameters(svgParameters) {
    var defs = document.getElementsByTagName("defs");
    if (defs.length > 0) {
        var refs = defs[0].getElementsByTagName("ref");
        if (refs.length > 0) {
            for (var i = 0; i < refs.length; i++) {
                var defval = refs[i].getAttribute("default");
                if (!defval) {
                    defval = refs[i].firstChild ? refs[i].firstChild.nodeValue : "";
                }
                svgParameters[refs[i].getAttribute("param")] = defval;
            }
        }
    }
    var tokens = document.defaultView.location.href.split("?");
    if (tokens.length == 2) {
        var p = tokens[1].split(/&|;|#/);
        if (p.length > 0) {
            for (var i = 0; i < p.length; i++) {
                var vals = p[i].split("=");
                if (vals && vals.length == 2) svgParameters[unescape(vals[0])] = unescape(vals[1]);
            }
        }
    }
    if (document.defaultView.frameElement) {
        var params = document.defaultView.frameElement.getElementsByTagName("param");
        if (params.length > 0) {
            for (var i = 0; i < params.length; i++) {
                svgParameters[params[i].getAttribute("name")] = params[i].getAttribute("value");
            }
        }
    }
}

function createDEXTX5Event(name, attrs) {
    var evt = null;
    if (document.createEvent) {
        evt = document.createEvent("Event");
        evt.initEvent(name, true, true);
    } else {
        evt = document.createEventObject();
        evt.eventType = name;
    }
    for (var n in attrs) {
        evt[n] = attrs[n];
    }
    return evt;
}

function dispatchDEXTX5Event(name, evt) {
    var ret;
    try {
        if (document.dispatchEvent) {
            ret = document.dispatchEvent(evt);
        } else {
            ret = document.fireEvent("on" + name, evt);
        }
    } catch (e) {
        ret = false;
        errorOut("ESVG-00017", gRB.get("ESVG-00017", "_{0} 이벤트 호출 과정에서 오류가 발생했습니다./n{1}"), [name, e.message]);
    }
    return ret === false ? false : true;
}

function getIconFilename(filename, isBig) {
    var ix = filename.lastIndexOf("."),
        ext = (ix >= 0) ? filename.substring(ix + 1).toLowerCase() : "",
        svgname = "default";
    if (!ext) svgname = "default";
    else if (gvector.fileFormats.image.indexOf(ext) != -1) svgname = "image";
    else if (gvector.fileFormats.video.indexOf(ext) != -1) svgname = "movie";
    else if (gvector.fileFormats.audio.indexOf(ext) != -1) svgname = "music";
    else if (gvector.fileFormats.msdoc.indexOf(ext) != -1) svgname = "doc";
    else if (gvector.fileFormats.msxls.indexOf(ext) != -1) svgname = "xls";
    else if (gvector.fileFormats.msppt.indexOf(ext) != -1) svgname = "ppt";
    else if (gvector.fileFormats.archv.indexOf(ext) != -1) svgname = "zip";
    else if (gvector.fileFormats.exec.indexOf(ext) != -1) svgname = "exe";
    else if (gvector.fileFormats.html.indexOf(ext) != -1) svgname = "htm";
    else if (gvector.fileFormats.flash.indexOf(ext) != -1) svgname = "fla";
    else if (gvector.fileFormats.outlook.indexOf(ext) != -1) svgname = "pst";
    else if (gvector.fileFormats.document.indexOf(ext) != -1) svgname = "txt";
    else if (gvector.fileFormats.clang.indexOf(ext) != -1) svgname = "ccp";
    else if (gvector.fileFormats.cpplang.indexOf(ext) != -1) svgname = "cpp";
    else if (gvector.fileFormats.rubylang.indexOf(ext) != -1) svgname = "rb";
    else if (gvector.fileFormats.objclang.indexOf(ext) != -1) svgname = "objc";
    else if (gvector.fileFormats.javalang.indexOf(ext) != -1) svgname = "java";
    else if (gvector.fileFormats.etclang.indexOf(ext) != -1) svgname = "etclang";
    else if (gvector.fileFormats.font.indexOf(ext) != -1) svgname = "font";
    else if (gvector.fileFormats.adobePremiere.indexOf(ext) != -1) svgname = "pr";
    else if (gvector.fileFormats.adobeAfterEffect.indexOf(ext) != -1) svgname = "ae";
    else if (gvector.fileFormats.threeDimension.indexOf(ext) != -1) svgname = "3d";
    else if (gvector.fileFormats.asp.indexOf(ext) != -1) svgname = "asp";
    else if (gvector.fileFormats.data.indexOf(ext) != -1) svgname = "dat";
    else if (gvector.fileFormats.others.indexOf(ext) != -1) svgname = ext;
    else svgname = "default";
    return svgname + "_" + (isBig === true ? "big" : "small") + ".svg";
}

function createUIItem(item) {
    var uitem = null;
    switch (gvector.uitype) {
        case "LIST":
            uitem = makeUIItemForList(item);
            break;
        case "TILE":
            uitem = makeUIItemForTile(item);
            break;
    }
    return uitem;
}

function makeUIItemForList(item) {
    var hp = window.gsvgHelper;
    var gTop = gsortedList.length * gvector.fileItemHeight,
        area = hp.get("UIC-MAIN-AREA");
    var oItem = hp.create("svg", item.id, {
        "class": "css-item",
        x: 0,
        y: gTop,
        width: "100%",
        "layout-dx5": "height:{fileItemHeight};"
    });
    var oGroup = hp.create("g");
    oItem.appendChild(oGroup);
    var oTooltip = hp.create("title", undefined, undefined, hp.mkTextNode(item.name));
    oGroup.appendChild(oTooltip);
    var oBack = hp.create("rect", undefined, {
        "class": "css-item-back",
        x: 0,
        y: 0,
        width: "100%",
        height: "100%"
    });
    oGroup.appendChild(oBack);
    var oCheckerGroup = hp.create("g", item.id + "-CHECKER", {
        "class": "css-item-checker"
    });
    var oCheckerNot = hp.create("use", item.id + "-CHECKER-NOT", {
        "style": "display:" + (item.checked ? "none" : "block"),
        "xlink:href": "#UIS-CHECKER",
        x: 7,
        width: 16,
        height: 16,
        "layout-dx5": "y:50%-8.5px;"
    });
    var oCheckerChk = hp.create("use", item.id + "-CHECKER-CHK", {
        "style": "display:" + (item.checked ? "block" : "none"),
        "xlink:href": "#UIS-CHECKER-CHKED",
        x: 7,
        width: 16,
        height: 16,
        "layout-dx5": "y:50%-8.5px;"
    });
    if (gvector.checkerWidth === 0) gsvgHelper.attr(oCheckerGroup, "class", "hide", true);
    oCheckerGroup.appendChild(oCheckerNot);
    oCheckerGroup.appendChild(oCheckerChk);
    oGroup.appendChild(oCheckerGroup);
    var oIcon = hp.create("image", undefined, {
        width: 18,
        height: 19,
        "layout-dx5": "x:8px+{checkerWidth}; y:50%-10px",
        "xlink:href": "./assets/icons/" + getIconFilename(item.name)
    });
    oGroup.appendChild(oIcon);
    var oNameRegion = hp.create("svg", undefined, {
        "class": "css-item-name-svg",
        y: 0,
        height: "100%",
        "layout-dx5": "x:28px+{checkerWidth};width:100%-60px-28px-30px-{sizeColumnWidth}-{checkerWidth};"
    });
    oGroup.appendChild(oNameRegion);
    var oFilename = hp.create("text", undefined, {
        "class": "css-item-font-name css-item-font-color",
        x: 0,
        "layout-dx5": "y:{itemTextBaseline};",
        "font-size": "14px"
    }, hp.mkTextNode(item.name));
    oNameRegion.appendChild(oFilename);
    var oRun = hp.create("use", item.id + "-OPRUN", {
        "class": "css-item-op-run",
        style: "cursor:pointer;display:" + ((item.type == "VIRTUAL" && item.openUrl && gvector.openButtonVisible) ? "block" : "none"),
        "xlink:href": "#UIS-RUN",
        width: 16,
        height: 16,
        "layout-dx5": "x:100%-30px-{sizeColumnWidth}-40px; y:50%-8px;"
    });
    oGroup.appendChild(oRun);
    var oUpdown = hp.create("use", item.id + "-OPDOWN", {
        "class": "css-item-op-down",
        style: "cursor:pointer;display:" + ((item.type == "VIRTUAL" && item.downUrl && gvector.downloadButtonVisible) ? "block" : "none"),
        "xlink:href": "#UIS-DOWNLOAD",
        width: 16,
        height: 16,
        "layout-dx5": "x:100%-30px-{sizeColumnWidth}-20px; y:50%-8px;"
    });
    oGroup.appendChild(oUpdown);
    var oSize = hp.create("text", undefined, {
        "class": "css-item-size css-item-font-name css-item-font-color",
        "text-anchor": "end",
        "layout-dx5": "x:100%-38px; y:{itemTextBaseline};",
        "font-size": "14px"
    }, hp.mkTextNode(item.size < 0 ? "" : getFriendlySize(item.size)));
    oGroup.appendChild(oSize);
    var oStatus = hp.create("use", item.id + "-STATUS", {
        width: 16,
        height: 16,
        "layout-dx5": "x:100%-30px+7px; y:50%-8px;"
    });
    if (item.lock === true) {
        hp.attr(oStatus, "xlink:href", "#UIS-LOCK");
    } else if (item.status == "DONE") {
        hp.attr(oStatus, "xlink:href", "#UIS-UPDONE");
    } else if (item.type == "FILE" && item.status == "WAIT") {
        hp.attr(oStatus, "xlink:href", "#UIS-UPWAIT");
    } else {
        hp.attr(oStatus, "xlink:href", "#UIS-VFWAIT");
    }
    oGroup.appendChild(oStatus);
    var oBorder2 = hp.create("line", undefined, {
        "class": "css-item-grid css-item-grid-color",
        y1: 0,
        y2: "100%",
        "shape-rendering": "crispEdges",
        "stroke-width": 1,
        "layout-dx5": "x1:100%-30px-{sizeColumnWidth}; x2:100%-30px-{sizeColumnWidth};"
    });
    var oBorder3 = hp.create("line", undefined, {
        "class": "css-item-grid css-item-grid-color",
        y1: 0,
        y2: "100%",
        "shape-rendering": "crispEdges",
        "stroke-width": 1,
        "layout-dx5": "x1:100%-30px; x2:100%-30px;"
    });
    var oBorder4 = hp.create("line", undefined, {
        "class": "css-item-grid css-item-grid-color",
        x1: 0,
        y1: "100%",
        x2: "100%",
        y2: "100%",
        "shape-rendering": "crispEdges",
        "stroke-width": 1.5
    });
    oGroup.appendChild(oBorder2);
    oGroup.appendChild(oBorder3);
    oGroup.appendChild(oBorder4);
    oGroup.dataItem = item;
    oGroup.addEventListener("click", onItemClickHandler, false);
    oCheckerNot.dataItem = item;
    oCheckerChk.dataItem = item;
    oCheckerNot.addEventListener("click", onFileCheckHandler, false);
    oCheckerChk.addEventListener("click", onFileCheckHandler, false);
    oRun.dataItem = item;
    oRun.addEventListener("click", onRunFileHandler, false);
    oUpdown.dataItem = item;
    oUpdown.addEventListener("click", onDownloadFileHandler, false);
    oGroup.appendChild(oUpdown);
    return oItem;
}

function makeUIItemForTile(item) {
    var hp = window.gsvgHelper;
    var gTop = Math.floor(gsortedList.length / gvector.tileColumnCount) * gvector.fileItemHeight,
        gLeft = (Math.floor(gsortedList.length % gvector.tileColumnCount) * Math.floor(100 / gvector.tileColumnCount)) + "%",
        gRight = (((gsortedList.length % gvector.tileColumnCount) + 1) * Math.floor(100 / gvector.tileColumnCount)) + "%",
        gWidth = (Math.floor(100 / gvector.tileColumnCount)) + "%",
        area = hp.get("UIC-MAIN-AREA");
    var oItem = hp.create("svg", item.id, {
        "class": "css-item",
        x: gLeft,
        y: gTop,
        height: gvector.fileItemHeight,
        "layout-dx5": "width:" + gWidth
    });
    var oGroup = hp.create("g");
    oItem.appendChild(oGroup);
    var oTooltip = hp.create("title", undefined, undefined, hp.mkTextNode(item.name));
    oGroup.appendChild(oTooltip);
    var oBack = hp.create("rect", undefined, {
        "class": "css-item-back",
        x: 0,
        y: 0,
        width: "100%",
        height: "100%"
    });
    oGroup.appendChild(oBack);
    var oInfo = hp.create("g", undefined, {
        "class": "css-item-info"
    });
    var oThumb = hp.create("image", item.id + "-THUMB", {
        x: 15,
        y: 0,
        width: 60,
        height: gvector.fileItemHeight,
        preserveAspectRatio: "xMidYMid meet"
    });
    if (item.thumbnail) {
        hp.attr(oThumb, "xlink:href", item.thumbnail);
    } else if (isImageFile(item.ofile)) {
        var reader = new FileReader();
        reader.onload = (function(t) {
            return function(evt) {
                t.thumbnail = evt.target.result;
                hp.attr(oThumb, "xlink:href", t.thumbnail);
            };
        })(item);
        reader.readAsDataURL(item.ofile);
    } else {
        hp.attr(oThumb, "xlink:href", "./assets/icons/" + getIconFilename(item.name, true));
    }
    var oTextName = hp.create("text", undefined, {
        "class": "css-item-font-name css-item-font-color",
        x: 90,
        y: 37,
        "font-size": "12px"
    }, hp.mkTextNode(item.name));
    var oTextSize = hp.create("text", undefined, {
        "class": "css-item-font-name css-item-font-color",
        x: 90,
        y: 57,
        "font-size": "11px"
    }, hp.mkTextNode(item.size < 0 ? "Size undefined" : getFriendlySize(item.size)));
    var oTextDate = hp.create("text", undefined, {
        "class": "css-item-font-name css-item-font-color",
        x: 90,
        y: 77,
        "font-size": "11px"
    }, hp.mkTextNode(formatedDateTypeA(item.mdate)));
    oInfo.appendChild(oThumb);
    oInfo.appendChild(oTextName);
    oInfo.appendChild(oTextSize);
    oInfo.appendChild(oTextDate);
    oGroup.appendChild(oInfo);
    var oCheckerGroup = hp.create("g", item.id + "-CHECKER", {
        "class": "css-item-checker"
    });
    var oCheckerNot = hp.create("use", item.id + "-CHECKER-NOT", {
        "style": "display:" + (item.checked ? "none" : "block"),
        "xlink:href": "#UIS-CHECKER",
        y: 4,
        width: 18,
        height: 18,
        "layout-dx5": "x:100%-22px"
    });
    var oCheckerChk = hp.create("use", item.id + "-CHECKER-CHK", {
        "style": "display:" + (item.checked ? "block" : "none"),
        "xlink:href": "#UIS-CHECKER-CHKED",
        y: 4,
        width: 18,
        height: 18,
        "layout-dx5": "x:100%-22px"
    });
    if (gvector.checkerWidth === 0) hp.attr(oCheckerGroup, "class", "hide", true);
    oCheckerGroup.appendChild(oCheckerNot);
    oCheckerGroup.appendChild(oCheckerChk);
    oGroup.appendChild(oCheckerGroup);
    var oOperations = hp.create("svg", undefined, {
        "class": "css-item-op",
        x: 0,
        width: "100%",
        height: 32,
        "layout-dx5": "y:{fileItemHeight}-32px;"
    });
    var oRunIcon = hp.create("use", item.id + "-OPRUN", {
        "class": "css-item-op-run",
        style: "display:" + ((item.type == "VIRTUAL" && item.openUrl && gvector.openButtonVisible) ? "block" : "none") + "; cursor: pointer",
        y: 8,
        width: 16,
        height: 16,
        "xlink:href": "#UIS-RUN",
        "layout-dx5": "x:100%-62px"
    });
    oOperations.appendChild(oRunIcon);
    var oDownIcon = hp.create("use", item.id + "-OPDOWN", {
        "class": "css-item-op-down",
        style: "display:" + ((item.type == "VIRTUAL" && item.downUrl && gvector.downloadButtonVisible) ? "block" : "none") + "; cursor: pointer",
        y: 8,
        width: 16,
        height: 16,
        "xlink:href": "#UIS-DOWNLOAD",
        "layout-dx5": "x:100%-42px"
    });
    oOperations.appendChild(oDownIcon);
    var oStatusIcon = hp.create("use", item.id + "-STATUS", {
        y: 8,
        width: 16,
        height: 16,
        "layout-dx5": "x:100%-22px"
    });
    if (item.lock === true) {
        hp.attr(oStatusIcon, "xlink:href", "#UIS-LOCK");
    } else if (item.status == "DONE") {
        hp.attr(oStatusIcon, "xlink:href", "#UIS-UPDONE");
    } else if (item.type == "FILE" && item.status == "WAIT") {
        hp.attr(oStatusIcon, "xlink:href", "#UIS-UPWAIT");
    } else {
        hp.attr(oStatusIcon, "xlink:href", "#UIS-VFWAIT");
    }
    oOperations.appendChild(oStatusIcon);
    oGroup.appendChild(oOperations);
    var oBorderRight = hp.create("line", undefined, {
        "class": "css-item-grid css-item-grid-color",
        x1: "100%",
        y1: 0,
        x2: "100%",
        y2: gvector.fileItemHeight,
        "shape-rendering": "crispEdges",
        "stroke-width": 1.5
    });
    var oBorderBottom = hp.create("line", undefined, {
        "class": "css-item-grid css-item-grid-color",
        x1: 0,
        x2: "100%",
        y1: gvector.fileItemHeight,
        y2: gvector.fileItemHeight,
        "shape-rendering": "crispEdges",
        "stroke-width": 1.5
    });
    oGroup.appendChild(oBorderRight);
    oGroup.appendChild(oBorderBottom);
    oGroup.dataItem = item;
    oGroup.addEventListener("click", onItemClickHandler, false);
    oCheckerNot.dataItem = item;
    oCheckerChk.dataItem = item;
    oCheckerNot.addEventListener("click", onFileCheckHandler, false);
    oCheckerChk.addEventListener("click", onFileCheckHandler, false);
    oRunIcon.dataItem = item;
    oRunIcon.addEventListener("click", onRunFileHandler, false);
    oDownIcon.dataItem = item;
    oDownIcon.addEventListener("click", onDownloadFileHandler, false);
    return oItem;
}

function setUIItemForSingle(item) {
    var btnAdd = gsvgHelper.get("UIC-BTN-ADD"),
        region = gsvgHelper.get("UIC-FILENAME-REGION"),
        tooltip = gsvgHelper.get("UIC-TOOLTIP-TXT"),
        txt = gsvgHelper.get("UIC-FILENAME-TXT"),
        btnDelete = gsvgHelper.get("UIC-BTN-DELETE");
    filter = gsvgHelper.get("UIC-FILTER-TXT");
    btnAdd.style.cursor = "default";
    gsvgHelper.attr(btnAdd.querySelector("rect"), "fill", "#c8c8c8");
    gsvgHelper.attr(btnAdd.querySelector("use"), "fill", "#e4e4e4");
    gsvgHelper.replaceText(tooltip, item.name);
    gsvgHelper.replaceText(txt, item.name);
    btnDelete.dataItem = item;
    region.style.display = "block";
    filter.style.display = "none";
}

function unsetUIItemForSingle() {
    var btnAdd = gsvgHelper.get("UIC-BTN-ADD"),
        region = gsvgHelper.get("UIC-FILENAME-REGION"),
        tooltip = gsvgHelper.get("UIC-TOOLTIP-TXT"),
        txt = gsvgHelper.get("UIC-FILENAME-TXT"),
        btnDelete = gsvgHelper.get("UIC-BTN-DELETE");
    filter = gsvgHelper.get("UIC-FILTER-TXT");
    btnAdd.style.cursor = "pointer";
    gsvgHelper.attr(btnAdd.querySelector("rect"), "fill", "#65c3df");
    gsvgHelper.attr(btnAdd.querySelector("use"), "fill", "#fff");
    gsvgHelper.replaceText(tooltip, "");
    gsvgHelper.replaceText(txt, "");
    btnDelete.dataItem = null;
    region.style.display = "none";
    filter.style.display = "block";
    gselectedList = [];
    gsortedList = [];
    gfileEngine.ufiles.removeByIndex(0);
}

function updateUILayout(root) {
    if (!root) return;
    var style = getComputedStyle(root);
    if (!style) {
        //--**console.log("DX5: updateUILayout stopped because " + root.localName + "element not created");
        return;
    }
    var w = parseFloat(style.width) - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
    var h = parseFloat(style.height) - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);
    if (gvector.uitype == "LIST" || gvector.uitype == "TILE") {
        var area = gsvgHelper.get("UIC-FILE-AREA"),
            cw = gsvgHelper.attr(area, "width"),
            ch = gsvgHelper.attr(area, "height"),
            unit = gvector.fileItemHeight,
            uitems = gsvgHelper.queryAll("#UIC-FILE-AREA .css-item"),
            len = uitems.length,
            trow = 0;
        if (gvector.uitype == "LIST") {
            trow = len;
        } else if (gvector.uitype == "TILE") {
            if (gvector.tileColumnCount < 2) gvector.tileColumnCount = 1;
            trow = (len % gvector.tileColumnCount == 0) ? len / gvector.tileColumnCount : parseInt(len / gvector.tileColumnCount, 10) + 1;
        }
        var th = trow * unit;
        if (ch < th) {
            gvector.vscrollbarWidth = 15;
        } else {
            gvector.vscrollbarWidth = 0;
        }
    }
    travelNUpdateLayout(gsvgHelper.get("UIC-MAIN-AREA"), w, h);
}

function updateUIItem(item) {
    if (gvector.uitype == "LIST") {
        var op = gsvgHelper.get(item.id + "-STATUS");
        if (op.correspondingUseElement) op = op.correspondingUseElement;
        if (item.lock === true) {
            gsvgHelper.attr(op, "xlink:href", "#UIS-LOCK");
        } else if (item.status == "DONE") {
            gsvgHelper.attr(op, "xlink:href", "#UIS-UPDONE");
        } else if (item.type == "FILE" && item.status == "WAIT") {
            gsvgHelper.attr(op, "xlink:href", "#UIS-UPWAIT");
        } else {
            gsvgHelper.attr(op, "xlink:href", "#UIS-VFWAIT");
        }
        op = gsvgHelper.get(item.id + "-OPRUN");
        op.style.display = (item.type == "VIRTUAL" && item.openUrl) ? "block" : "none";
        op = gsvgHelper.get(item.id + "-OPDOWN");
        op.style.display = (item.type == "VIRTUAL" && item.downUrl) ? "block" : "none";
    } else if (gvector.uitype == "TILE") {
        var op = gsvgHelper.query("#" + item.id + "-STATUS");
        if (op.correspondingUseElement) op = op.correspondingUseElement;
        if (item.lock === true) {
            gsvgHelper.attr(op, "xlink:href", "#UIS-LOCK");
        } else if (item.status == "DONE") {
            gsvgHelper.attr(op, "xlink:href", "#UIS-UPDONE");
        } else if (item.type == "FILE" && item.status == "WAIT") {
            gsvgHelper.attr(op, "xlink:href", "#UIS-UPWAIT");
        } else {
            gsvgHelper.attr(op, "xlink:href", "#UIS-VFWAIT");
        }
        op = gsvgHelper.get(item.id + "-OPRUN");
        op.style.display = (item.type == "VIRTUAL" && item.openUrl) ? "block" : "none";
        op = gsvgHelper.get(item.id + "-OPDOWN");
        op.style.display = (item.type == "VIRTUAL" && item.downUrl) ? "block" : "none";
    } else if (gvector.uitype == "SINGLE") {
        var op = gsvgHelper.get("UIC-BTN-DELETE");
        if (op.correspondingUseElement) op = op.correspondingUseElement;
        if (item.lock === true) {
            gsvgHelper.attr(op, "xlink:href", "#UIS-LOCK");
        } else if (item.status == "DONE") {
            gsvgHelper.attr(op, "xlink:href", "#UIS-UPDONE");
        } else {
            gsvgHelper.attr(op, "xlink:href", "#UIS-REMOVE");
        }
    }
}

function travelNUpdateLayout(target, w, h) {
    if (target.localName != "g") {
        var layout = target.getAttributeNS(null, "layout-dx5"),
            v = 0;
        if (layout) {
            layout = parseLayoutStyle(layout);
            for (var n in layout) {
                v = computeExpressionUseCacheFunction(target, n, layout[n], (["x", "x1", "x2", "cx", "dx", "width"].indexOf(n) >= 0 ? w : h), gvector);
                if ((n == "width" || n == "height") && v < 0) v = 0;
                if (n == "width") w = v;
                else if (n == "height") h = v;
                target.setAttributeNS(null, n, v);
            }
        }
        w = (target.width && typeof(target.width.baseVal) != "undefined") ? target.width.baseVal.value : w;
        h = (target.height && typeof(target.height.baseVal) != "undefined") ? target.height.baseVal.value : h;
    }
    if (target.id == "UIC-FILE-AREA") {
        var from = (target.viewBox.baseVal ? target.viewBox.baseVal.y : 0),
            trow = 0,
            len = gsortedList.length,
            columns = gvector.tileColumnCount;
        if (gvector.uitype == "LIST") {
            trow = len;
        } else if (gvector.uitype == "TILE") {
            if (columns < 2) columns = 1;
            trow = (len % columns == 0) ? len / columns : parseInt(len / columns, 10) + 1;
        }
        var th = trow * gvector.fileItemHeight;
        if (th < from) from = from - h;
        if (th < h) from = 0;
        if (from < 0) from = 0;
        gsvgHelper.attr(target, "viewBox", "0 " + from + " " + w + " " + h);
    }
    for (var i = 0, len = target.childNodes.length, child = null; i < len; i++) {
        child = target.childNodes[i];
        if (child.nodeType === 1) {
            travelNUpdateLayout(child, w, h);
        }
    }
}

function updateFilterInfo() {
    var tokens = [];
    var str = "";
    if (gvector.uitype != "SINGLE" && gvector.maxFileCount >= 0) {
        str = gvector.maxFileCount + (gvector.maxFileCount == 0 ? " File" : " Files");
        tokens.push(str);
    }
    var fsize = "";
    if (gvector.minFileSize >= 0) {
        str = getFriendlySize(gvector.minFileSize);
        fsize = str + "~";
    }
    if (gvector.maxFileSize >= 0) {
        str = getFriendlySize(gvector.maxFileSize);
        tokens.push(fsize + str);
    } else if (fsize) {
        tokens.push(fsize);
    }
    if (gvector.uitype != "SINGLE" && gvector.maxTotalSize >= 0) {
        str = getFriendlySize(gvector.maxTotalSize) + "(A)";
        tokens.push(str);
    }
    if (tokens.length > 0) {
        gsvgHelper.replaceText(gsvgHelper.get("UIC-FILTER-TXT"), tokens.join(" / "));
    } else {
        gsvgHelper.replaceText(gsvgHelper.get("UIC-FILTER-TXT"), gRB.get("RB-LIST-MAIN-0003", "_필터없음"));
    }
}

function updateCurrentFilesInfo() {
    if (gvector.uitype == "SINGLE") return;
    var cnt = gfileEngine.ufiles.length;
    var size = gfileEngine.ufiles.getTotalSize(false);
    var strCount = cnt == 0 ? "0 File" : cnt + " Files";
    var strSize = size == 0 ? "0 Byte" : getFriendlySize(size);
    gsvgHelper.replaceText(gsvgHelper.get("UIC-FOOTER-CURINFO"), strSize + " / " + strCount);
}

function scrollRegion(action) {
    var area = gsvgHelper.get("UIC-FILE-AREA"),
        cw = gsvgHelper.attr(area, "width"),
        ch = gsvgHelper.attr(area, "height"),
        from = (area.viewBox.baseVal ? area.viewBox.baseVal.y : 0),
        to = 0,
        temp = 0,
        frameId, isBelow;
    if (action == "up") {
        temp = from - Math.floor(ch * 2 / 3);
        to = temp < 0 ? 0 : temp;
        isBelow = false;
    } else if (action == "down") {
        var th = 0;
        if (gvector.uitype == "LIST") {
            th = gsortedList.length * gvector.fileItemHeight;
        } else if (gvector.uitype == "TILE") {
            th = Math.floor(gsortedList.length / gvector.tileColumnCount) * gvector.fileItemHeight;;
        } else return;
        temp = from + Math.floor(ch * 2 / 3);
        if (temp > th) return;
        to = temp;
        isBelow = true;
    } else return;

    function doScrollAnimation() {
        if ((isBelow && from > to) || (!isBelow && from < to)) {
            from = to;
            gsvgHelper.attr(area, "viewBox", "0 " + from + " " + cw + " " + ch);
            cancelAnimationFrame(frameId);
            return;
        }
        gsvgHelper.attr(area, "viewBox", "0 " + from + " " + cw + " " + ch);
        from += (isBelow ? 20 : -20);
        frameId = requestAnimationFrame(doScrollAnimation);
    }
    frameId = requestAnimationFrame(doScrollAnimation);
}

function scrollTo(elementIndex) {
    var area = gsvgHelper.get("UIC-FILE-AREA"),
        cw = gsvgHelper.attr(area, "width"),
        ch = gsvgHelper.attr(area, "height"),
        unit = gvector.fileItemHeight,
        dist = 0;
    if (gvector.uitype == "LIST") {
        dist = elementIndex;
    } else if (gvector.uitype == "TILE") {
        dist = Math.floor(elementIndex / gvector.tileColumnCount);
    } else return;
    var from = (area.viewBox.baseVal ? area.viewBox.baseVal.y : 0),
        to = (dist * unit),
        frameId, isBelow = from < to;
    if (Math.abs(from - to) <= 1000) {
        function doScrollAnimation() {
            if ((isBelow && from > to) || (!isBelow && from < to)) {
                from = to;
                gsvgHelper.attr(area, "viewBox", "0 " + from + " " + cw + " " + ch);
                cancelAnimationFrame(frameId);
                return;
            }
            gsvgHelper.attr(area, "viewBox", "0 " + from + " " + cw + " " + ch);
            from += (isBelow ? 20 : -20);
            frameId = requestAnimationFrame(doScrollAnimation);
        }
        frameId = requestAnimationFrame(doScrollAnimation);
    } else {
        gsvgHelper.attr(area, "viewBox", "0 " + to + " " + cw + " " + ch);
    }
}

function existFileItem(id) {
    for (var i = 0; i < gselectedList.length; i++) {
        if (gselectedList[i] == id) return true;
    }
    return false;
}

function animateTileItem(id) {
    var svg = gsvgHelper.query("#" + id),
        grp = gsvgHelper.query("#" + id + " .css-item-info"),
        ypos = 0,
        frameId = 0;

    function doScrollAnimation(timestamp) {
        if (ypos < -13) {
            gsvgHelper.attr(svg, "class", "selected", true);
            cancelAnimationFrame(frameId);
            return;
        }
        ypos--;
        grp.transform.baseVal.getItem(0).setTranslate(0, ypos);
        frameId = requestAnimationFrame(doScrollAnimation);
    }
    frameId = requestAnimationFrame(doScrollAnimation);
}

function selectFileItem(id, stopDrawing) {
    if (gselectedList.indexOf(id) >= 0) return;
    gselectedList.push(id);
    var item = gsvgHelper.get(id);
    gsvgHelper.attr(item, "class", "selected", true);
    if (!stopDrawing) {
        updateUILayout(me);
    }
}

function unselectFileItem(id, stopDrawing) {
    var index = gselectedList.indexOf(id);
    if (index >= 0) {
        gselectedList.splice(index, 1);
        var items = gsvgHelper.queryAll("#" + id);
        for (var i = 0; i < items.length; i++) {
            gsvgHelper.removeAttr(items[i], "class", "selected");
        }
        if (!stopDrawing) {
            updateUILayout(me);
        }
    }
}

function selectAllFileItems(stopDrawing) {
    gselectedList = [];
    var items = gsvgHelper.queryAll(".css-item");
    for (var i = 0, len = items.length, t = null; i < len; i++) {
        t = items[i];
        gsvgHelper.attr(t, "class", "selected", true);
        gselectedList.push(t.id);
    }
    if (!stopDrawing) {
        updateUILayout(me);
    }
}

function unselectAllFileItems(stopDrawing) {
    var items = gsvgHelper.queryAll(".css-item");
    for (var i = 0; i < items.length; i++) {
        gsvgHelper.removeAttr(items[i], "class", "selected");
    }
    gselectedList = [];
    if (!stopDrawing) {
        updateUILayout(me);
    }
}

function selectRangeByShift(start, end, isBelow) {
    var range = false;
    selectFileItem(start, true);
    if (start == end) return;
    var fitems = document.querySelectorAll("#UIC-FILE-AREA .css-item");
    var current = null;
    for (var i = 0; i < fitems.length; i++) {
        current = isBelow ? fitems[i] : fitems[fitems.length - 1 - i];
        if (range === false && (current.id == start || current.id == end)) {
            range = true;
        } else if (range === true && (current.id == start || current.id == end)) {
            break;
        } else if (range == true) {
            selectFileItem(current.id, true);
        }
    }
    selectFileItem(end, true);
}

function sortItems(name, type, dir) {
    var hp = window.gsvgHelper;
    var parent = hp.get("#UIC-FILE-AREA");
    var items = Array.from(hp.queryAll(".css-item"));
    var comparer;
    if (type == "S") comparer = window.compareString;
    else if (type == "N") comparer = window.compareNumber;
    else return;
    var sorting = (dir == "asc") ? function(a, b) {
        return comparer(a, b);
    } : function(a, b) {
        return comparer(b, a);
    };
    items.sort(function(x1, x2) {
        var i1 = x1.querySelector("svg>g").dataItem;
        var i2 = x2.querySelector("svg>g").dataItem;
        if (gvector.sortPriorityVF === true) {
            var at = i1["type"];
            var bt = i2["type"];
            if (at == "VIRTUAL" && bt == "FILE") return -1;
            else if (at == "FILE" && bt == "VIRTUAL") return 1;
            else return sorting(i1[name], i2[name]);
        } else return sorting(i1[name], i2[name]);
    });
    while (parent.childNodes.length > 1 && parent.lastChild.nodeName == "svg") {
        parent.removeChild(parent.lastChild);
    }
    gsortedList = [];
    for (var i = 0, len = items.length, t = null; i < len; i++) {
        t = items[i];
        gsortedList.push(t.id);
        if (gvector.uitype == "LIST") {
            hp.attr(t, "y", i * gvector.fileItemHeight);
        } else if (gvector.uitype == "TILE") {
            hp.attr(t, "x", (Math.floor(i % gvector.tileColumnCount) * Math.floor(100 / gvector.tileColumnCount)) + "%");
            hp.attr(t, "y", Math.floor(i / gvector.tileColumnCount) * gvector.fileItemHeight);
        }
        parent.appendChild(t);
    }
}

function sortByName(asc) {
    var btnObj = gsvgHelper.get("UIC-HEADER-BK-NAME");
    if (btnObj) {
        if (typeof btnObj["data-sort-asc"] === "undefined") {
            btnObj["data-sort-asc"] = false;
        }
        btnObj["data-sort-asc"] = isDefined(asc) == false ? !btnObj["data-sort-asc"] : asc;
        asc = btnObj["data-sort-asc"];
        var icoAsc = gsvgHelper.get("UIC-SORT-BUTTON-NAME-ASC"),
            icoDesc = gsvgHelper.get("UIC-SORT-BUTTON-NAME-DESC");
        if (icoAsc && icoDesc) {
            icoAsc.style.display = asc ? "block" : "none";
            icoDesc.style.display = asc ? "none" : "block";
        }
    } else if (isDefined(asc) == false) {
        return;
    }
    sortItems("name", "S", asc ? "asc" : "desc");
}

function sortBySize(asc) {
    var btnObj = gsvgHelper.get("UIC-HEADER-BK-SIZE");
    if (btnObj) {
        if (typeof btnObj["data-sort-asc"] === "undefined") {
            btnObj["data-sort-asc"] = false;
        }
        btnObj["data-sort-asc"] = isDefined(asc) == false ? !btnObj["data-sort-asc"] : asc;
        asc = btnObj["data-sort-asc"];
        var icoAsc = gsvgHelper.get("UIC-SORT-BUTTON-SIZE-ASC"),
            icoDesc = gsvgHelper.get("UIC-SORT-BUTTON-SIZE-DESC");
        if (icoAsc && icoDesc) {
            icoAsc.style.display = asc ? "block" : "none";
            icoDesc.style.display = asc ? "none" : "block";
        }
    } else if (isDefined(asc) == false) {
        return;
    }
    sortItems("size", "N", asc ? "asc" : "desc");
}

function moveUpAndDown(index, isUp) {
    if (index === (isUp ? 0 : gsortedList.length - 1)) return;
    var dindex = index + (isUp ? -1 : 1);
    var sid = gsortedList[index];
    var did = gsortedList[dindex];
    var hp = window.gsvgHelper;
    var parent = hp.get("#UIC-FILE-AREA");
    var sitem = parent.querySelector(getIdSharp(sid, true));
    var ditem = parent.querySelector(getIdSharp(did, true));
    parent.removeChild(ditem);
    if (isUp) parent.insertBefore(ditem, sitem.nextSibling);
    else parent.insertBefore(ditem, sitem);
    if (gvector.uitype == "LIST") {
        var tempY = hp.attr(sitem, "y");
        hp.attr(sitem, "y", hp.attr(ditem, "y"));
        hp.attr(ditem, "y", tempY);
    } else if (gvector.uitype == "TILE") {
        var tempX = hp.attr(sitem, "x");
        hp.attr(sitem, "x", hp.attr(ditem, "x"));
        hp.attr(ditem, "x", tempX);
        var tempY = hp.attr(sitem, "y");
        hp.attr(sitem, "y", hp.attr(ditem, "y"));
        hp.attr(ditem, "y", tempY);
    }
    var tempA = gsortedList[index];
    gsortedList[index] = gsortedList[dindex];
    gsortedList[dindex] = tempA;
}

function preview(index, method) {
    var item = gfileEngine.ufiles.getItem(gsortedList[index]);
    var bgstr = hexColorToRgba(gvector.previewBgColor, 0.75);
    if (isImageFile(item.ofile) == false) {
        errorOut("ESVG-00073", gRB.get("ESVG-00073", "_미리보기에 유효하지 않은 형식입니다."));
        return;
    }
    if (["image/jpeg", "image/pjpeg", "image/gif", "image/bmp", "image/x-windows-bmp", "image/png", "image/svg+xml"].indexOf(item.ofile.type.toLowerCase()) < 0) {
        errorOut("ESVG-00073", gRB.get("ESVG-00073", "_미리보기에 유효하지 않은 형식입니다."));
        return;
    }
    if (gvector.uitype == "TILE") {
        dispatchDEXTX5Event("preview", createDEXTX5Event("preview", {
            id: gvector.elementId,
            itemIndex: index,
            itemId: item.id,
            method: method,
            itemSource: item.thumbnail,
            backColor: bgstr
        }));
    } else {
        var reader = new FileReader();
        reader.onerror = function(evt) {
            errorOut("ESVG-00073", gRB.get("ESVG-00073", "_미리보기에 유효하지 않은 형식입니다."));
        };
        reader.onload = (function(t, i, m) {
            return function(evt) {
                dispatchDEXTX5Event("preview", createDEXTX5Event("preview", {
                    id: gvector.elementId,
                    itemIndex: i,
                    itemId: t.id,
                    method: m,
                    itemSource: evt.target.result,
                    backColor: bgstr
                }));
            };
        })(item, index, method);
        reader.readAsDataURL(item.ofile);
    }
}

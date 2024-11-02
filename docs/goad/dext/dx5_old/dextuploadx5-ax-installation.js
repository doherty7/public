/*
 * DEXTUploadX5 - main library
 * http://www.dextsolution.com
 *
 * Copyright DEVPIA Inc.
 */
;; (function (win) { function AXFiltering() { if (false == (!!document.documentMode)) { return "unsupported"; } if (typeof window.external.msActiveXFilteringEnabled == "unknown") { return (window.external.msActiveXFilteringEnabled() ? true : false); } else { return false; } } win["checkDEXTUploadX5IEClient"] = function (inst, noti) { var doc = win.document; var filtered = AXFiltering(); if (filtered) { if (filtered === "unsupported" && typeof noti === "function") { noti("Current browser does not support the ActiveX."); } else if (filtered === true && typeof noti === "function") {
noti("Current browser is filtering ActiveX object; disable."); } return; } win.cbInstall4DX5IEClient = typeof inst === "function" ? inst : function (ver) {}; win.cbNotInst4DX5IEClient = typeof noti === "function" ? noti : function () {}; doc.createElement("div").innerHTML = "" + "<object classid=\"CLSID:A0C72065-9C0A-4570-A4ED-3AB5D4951B20\" width=\"0\" height=\"0\" " +  "onerror=\"this.dextuploadx5NotInstalled = true;window.cbNotInst4DX5IEClient();\" " + "onreadystatechange=\"if (!this.dextuploadx5NotInstalled) { window.cbInstall4DX5IEClient(this.getVersion()); }\"></object>"; };
})(window); 
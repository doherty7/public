/**
 * IssgaUtil 공통 모듈을 설정한다.
 * 작성자 : 한현욱
 * 작성일 : 2018-09-20
 */
$(function () {
    // console.log('===> IssgaUtil.actionEventKey() call.');
    // IssgaUtil.actionEventKey();
});

IssgaUtil = {

    /**
     * ajax call
     * 작성자 : 한현욱
     * 작성일 : 2018-09-20
     * params : method(GET,POST,PUT,DELETE), url, params, callback
     * ex)
     IssgaUtil.alert('hell');
     */
    alert: function (message) {
        alert(message);
    },

    ajax: {
        /**
         * ajax call
         * 작성자 : 한현욱
         * 작성일 : 2018-09-20
         * params : method(GET,POST,PUT,DELETE), url, params, callback
         * ex)
         IssgaUtil.ajax.get('/sampleDataMap.do', {}, function(code, data){
           });
         */
        call: function (method, dataType, url, params, callback, load) {

            // 비동기 함수 사용시 로딩바 사용유무 (default : ture)
            // 2019.06.05 추가 by 강민석
            var fvLoad = (typeof (load) == "boolean") ? load : true;

            //--**  loading 처리
            if (fvLoad !== false) {
                gfnLoadingStart();
            }

            resultCode = 0;
            $.ajax({
                type: method, //GET, POST
                url: url,
                data: params,
                dataType: dataType, //xml, json, html, text
                error: function (eobj) {

                    IssgaUtil.ajax.errorMessage(eobj);

                    if (fvLoad !== false) {
                        gfnLoadingEnd();
                    }
                },
                success: function (data) {
//                    $("#dataArea").html(data) ;
                    resultCode = 1;
                    callback(resultCode, data);
                    if (fvLoad !== false) {
                        gfnLoadingEnd();
                    }
                },
            });
        },

        errorMessage:
            function (eobj) {
                if (eobj.responseText) {
                    var mids = eobj.responseText.indexOf("[MESSAGEID]");
                    var mide = eobj.responseText.indexOf("[MESSAGEID-END]");
                    var mid = eobj.responseText.substring(mids + 11, mide);
                    mids = eobj.responseText.indexOf("[MESSAGE]");
                    mide = eobj.responseText.indexOf("[MESSAGE-END]");
                    var msg = eobj.responseText.substring(mids + 9, mide);
                    if (!$U.isNullOrEmpty(msg) && msg !== "null" && msg !== "NULL") {
                        alert("데이타 처리중 오류가 발생했습니다.\r\n" + msg + ($U.isNullOrEmpty(mid) ? "" : "(" + mid + ")") + "\r\n" + "관리자에게 문의하세요");
                    } else {
                        alert('데이타 처리중 오류가 발생했습니다.\r\n관리자에게 문의하세요');
                    }

                } else {
                    alert('데이타 처리중 오류가 발생했습니다.\r\n관리자에게 문의하세요');
                }
            },

        /**
         * ajax get 호출
         * 작성자 : 한현욱
         * 작성일 : 2018-09-20
         * params : url, params, callback
         * ex)
         IssgaUtil.ajax.get('/sampleDataMap.do', {}, function(code, data){
           });
         */
        get: function (url, params, callback, load) {
            IssgaUtil.ajax.call('GET', 'json', url, params, callback, load);
        },
        /**
         * ajax post 호출
         * 작성자 : 한현욱
         * 작성일 : 2018-09-20
         * params : url, params, callback
         * ex)
         IssgaUtil.ajax.post('/sampleDataMap.do', {}, function(code, data){
           });
         */
        post: function (url, params, callback, load) {
            IssgaUtil.ajax.call('POST', 'json', url, params, callback, load);
        },

        /**
         * HTML 페이지 호출
         * 작성자 : 한현욱
         * 작성일 : 2018-09-20
         * params : url, callback
         * ex)
         IssgaUtil.ajax.page('/sampleDataMap.do', {}, function(code, data){
           });
         */
        page: function (url, callback, load) {
            IssgaUtil.ajax.call('GET', 'html', url, {}, callback, load);
        },
    },

    /**
     * goMenuPage
     * 작성자 : 한현욱
     * 작성일 : 2018-09-20
     * params : menuId, url
     * ex) IssgaUtil.goMenuPage(menuId, url);
     */
    goMenuPage: function (menuId, url, pMenuId, topchk, menuchk, event) {
        if (url == '?') {
            alert('준비중인 메뉴입니다.')
            return;
        }

        /*
        var ev = window.event || event;
        try {
            ev.preventDefault();
            ev.stopImmediatePropagation();
        } catch (e) {
            ev.returnValue = false;
        }
        */

        //--**	form
        var f = $hD("form[name=cmMenuListForm]");

        if (url.indexOf("?") > -1) {
            var p = url.substr(url.indexOf("?") + 1);
            url = url.substr(0, url.indexOf("?"));
            $hD("input[name=p]", f).value = p.substr(p.indexOf("=") + 1);
        }

        $hD("input[name=menuId]", f).value = menuId;
        $hD("input[name=pMenuId]", f).value = $U.nvl(pMenuId, $hD("input[name=pMenuId]", f).value);
        $hD("input[name=url]", f).value = url;

        var tchk = $U.isNull(topchk) ? false : topchk;
        var mchk = $U.isNull(menuchk) ? false : menuchk;
        var connectionchk = url.indexOf("connector/eps.do") > -1;

        //--**	popup option 이 "Y" 인경우 팝업으로 화면에 전개함
        if (!tchk && $hD("input[name=newPopupCheck]", f).value === "Y") {

            $hD("input[name=popupYN]", f).value = "Y";
            var w = screen.width < 1240 ? screen.width : 1240;
            var h = screen.height < 900 ? screen.height : 900;
            var title = "_POPUP_KPF_CONTENT";
            var po = this.popupDetail("", title, w, h, "yes", "no");
            f.action = connectionchk === true ? $U.nvl(_GLOVAL_HOME_NOHTTPS_XXX, "") + url : $U.nvl(_GLOVAL_HOME_XXX, "") + url;
            f.target = title;
            f.submit();

            po.focus();
            po.focus();

            //--**	popup option 이 "P" 인경우 메뉴 오픈 팝업으로 화면에 전개함
        } else if (mchk) {

            var w = screen.width;
            var h = screen.height;
            var title = "_POPUP_KPF_MENUON_CONTENT";
            var po = this.popupDetail("about:blank", title, w, h, "yes", "no");
            f.action = url;
            f.target = title;
            f.submit();

            po.focus();
            po.focus();

        } else {

            $hD("input[name=popupYN]", f).value = "N";
            f.action = connectionchk === true ? $U.nvl(_GLOVAL_HOME_NOHTTPS_XXX, "") + url : $U.nvl(_GLOVAL_HOME_XXX, "") + url;
            f.target = "_self";
            f.submit();

        }

        return false;
    },

    /**
     * goMenuPage
     * 작성자 : ABC
     * 작성일 : 2018-10-17
     * params : menuId, url
     * ex) IssgaUtil.goMenuPage(menuId, url);
     * FLAG : 전체(A), 선택(S)
     */
    getCode: function (stdCodeEnm, callback, flag, jobId) {
        resultCode = 0;
        if (gfn_isNull(jobId)) jobId = -1;
        $.ajax({
            type: 'POST',
            url: $U.nvl(_GLOVAL_HOME_XXX, "") + '/cm/comm/getCode.ajax',
            data: {
                'STD_CODE_ENM': stdCodeEnm
            },
            dataType: 'json',
            error: function () {
            },
            success: function (data) {
                resultCode = 1;

                var resultData = [];
                if (flag != '') {
                    resultData.push({"label": flag, "code": ""});
                }

                $.each(data, function (i, v) {
                    resultData.push({"label": v.cmnNm, "code": v.cmnCd});
                });
                //console.log(resultData);

                callback(resultCode, resultData, jobId);
            }
        });
    },

    /**
     * goMenuPage
     * 작성자 : ABC
     * 작성일 : 2018-10-17
     * params : menuId, url
     * ex) IssgaUtil.goMenuPage(menuId, url);
     * FLAG : 전체(A), 선택(S)
     */
    getCode2: function (upCommCd, callback, flag, jobId) {
        resultCode = 0;
        if (gfn_isNull(jobId)) jobId = -1;
        $.ajax({
            type: 'POST',
            url: '/cm/comm/selectCommStdList.ajax',
            data: {
                'upCommCd': upCommCd
            },
            dataType: 'json',
            error: function () {
            },
            success: function (data) {
                resultCode = 1;

                var resultData = [];
                if (flag != '') {
                    resultData.push({"label": flag, "code": ""});
                }

                $.each(data.list, function (i, v) {
                    resultData.push({"label": v.commNm, "code": v.commCd});
                });
                //console.log(resultData);

                callback(resultCode, resultData, jobId);
            }
        });
    },

    /**
     * goMenuPage
     * 작성자 : ABC
     * 작성일 : 2018-10-17
     * params : menuId, url
     * ex) IssgaUtil.getCodeYn();
     */
    getCodeYn: function () {
        return [{label: 'Y', code: 'Y'}, {label: 'N', code: 'N'}];
    },

    /**
     * goMenuPage
     * 작성자 : ABC
     * 작성일 : 2018-10-24
     * params : '팝업 주소', '팝업창 이름', '팝업창 설정'
     * ex) IssgaUtil.popup();
     */
    popup: function (formId, title, url, w, h, params) {

        // var popOption = "width="+parseInt(w)+", height="+parseInt(h)+", resizable=no, scrollbars=yes, status=no;"; //팝업창 옵션(optoin)
        title = title + "(" + XyGetCurrentDateTime("-").replace(" ", "_") + ")";

        var _popId = this.popupDetail("", title, w, h, "yes", "no");

        if ($U.isNull(_popId)) {
            alert("사이트에 대한 팝업차단을 해지하여 주시기 바랍니다...");
            return;
        }

        formId = $U.isNullOrEmpty(formId) ? "kpfPopupForm" : formId;
        $.each(params, function (i, v) {
            $("#" + formId).find("#" + i).val(v);
        });

        var f = $hD("#" + formId);

        f.action = url;
        f.target = title;
        f.method = "post";
        f.submit();

        _popId.focus();
        _popId.focus();

        return _popId;
    },

    popupDetail: function (vUrl, vWinName, vWidth, vHeight, vScrollYN, vResizeYN) {
        var w = vWidth;
        var h = vHeight;
        w = window.screen.availWidth < w ? window.screen.availWidth - 10 : w;
        h = window.screen.availHeight < h ? window.screen.availHeight - 10 : h;
        var curX = window.screenLeft;
        var curY = window.screenTop;

        //var curWidth   =   document.body.clientWidth;
        //var curHeight  =   document.body.clientHeight;
        var nLeft = curX + 10;//(curWidth / 2) - (w / 2);
        var nTop = curY + 10;//(curHeight / 2) - (h / 2);
        var param = "height=" + vHeight +
            ",width=" + vWidth +
            ",left=" + nLeft +
            ",top=" + nTop +
            ",scrollbars=" + ($U.isNull(vScrollYN) ? "no" : vScrollYN) +
            ",resizable=" + ($U.isNull(vResizeYN) ? "no" : vResizeYN);
        return window.open(vUrl, vWinName, param);
    },

    //--**	기존 window.open 을 변경함
    popupDetailEx: function (vUrl, vWinName, p) {
        var curX = window.screenLeft;
        var curY = window.screenTop;
        var nLeft = curX + 10;//(curWidth / 2) - (w / 2);
        var nTop = curY + 10;//(curHeight / 2) - (h / 2);
        var param = $U.format("left={0},top={1},{2}", nLeft, nTop, p);
        return window.open(vUrl, vWinName, param);
    },

    /**
     * actionEventKey
     * 작성자 : 강민석
     * 작성일 : 2019-03-26
     * params :
     * ex) IssgaUtil.actionEventKey();
     * 서브밋 사용시 : input type = text 속성에 data-key="enter"      추가
     * 그리드 사용시 : input type = text 속성에 data-key="grid_enter" 추가
     * 데이트 사용시 : <ipt:iptDate/> tag 사용시 data-key="date" 속성 포함
     *
     * 추가 : 화면에 그리드가 여러 개일 경우 index 넣어서 각각의 그리드에서 엔터키로 검색되도록 // 2019-12-06 김상책
     */
    actionEventKey: function () {
        var orgDtValue;
        $('input[type=text]').on({
            // ----------------------------------------------------------------------------
            "keydown": function (e) {
                if (!gfn_WIN_keyupchk(e)) {
                    return false;
                }
                return true;
            },
            "keyup": function (e) {

                var keyCode = e.which ? e.which : e.keyCode;
                var dataCode = e.target.getAttribute('data-key');

                if (dataCode == "grid_enter") {

                    var gridIndex = e.target.getAttribute('data-grid-index');

                    // 그리드조회
                    var gridLen = _grid.length;
                    if (gridLen > 0) {
                        var obj = IssgaUtil.isEmpty(gridIndex) ? _grid[0] : _grid[gridIndex];
                        if (keyCode == 13) {
                            e.stopPropagation();
                            e.preventDefault();
                            obj.search();
                            return false;
                        }
                    }
                } else if (dataCode == "number") {

                    if (e.ctrlKey && keyCode == 65 || !e.ctrlKey && keyCode == 17) {
                        e.stopPropagation();
                        e.preventDefault();
                        return false;
                    }
                    if (this.value != "0") {
                        this.value = this.value.replace(/[^0-9]/g, '');
                        this.value = this.value.replace(/,/g, '');
                        $(this).val(this.value.replace(/\B(?=(\d{3})+(?!\d))/g, ","));
                        $(this).val(this.value.replace(/(^0+)/, ""));
                    }
                    return false;

                } else if (dataCode == "date") {
                    //issgaCommon.js 참조
                    // 데이트 포맷형식 체크
                    gfn_auto_date_format(this);
                    return false;
                }

                return true;
            },
            // ----------------------------------------------------------------------------
            "focus": function (e) {
                e.stopPropagation();
                e.preventDefault();
                var keyCode = e.which ? e.which : e.keyCode;
                var dataCode = e.target.getAttribute('data-key');

                if (dataCode == "number") {
                    if (this.value != "0") {
                        this.value = this.value.replace(/[^0-9]/g, '');
                        this.value = this.value.replace(/,/g, '');
                        $(this).val(this.value.replace(/\B(?=(\d{3})+(?!\d))/g, ","));
                        $(this).val(this.value.replace(/(^0+)/, ""));
                    }
                    return false;
                } else if (dataCode == "date") {
                    var dtVal = $(this).val();
                    if (dtVal != "") {
                        var date_pattern = /^(19|20)\d{2}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[0-1])$/;
                        if (date_pattern.test(dtVal)) {
                            orgDtValue = this.value;
                            return false;
                        } else {
                            //$(this).val("");
                        }
                    }
                }
                return true;

            },
            // ----------------------------------------------------------------------------
            "blur": function (e) {
                e.stopPropagation();
                e.preventDefault();
                var keyCode = e.which ? e.which : e.keyCode;
                var dataCode = e.target.getAttribute('data-key');

                if (dataCode == "number") {
                    // 금액에 콤마제거
                    // -------------------------------------------------
                    //$(this).val($(this).val().replace(/,/g,''));
                    //$(this).val(this.value.replace(/(^0+)/, ""));
                    //return false;
                    // -------------------------------------------------
                } else if (dataCode == "date") {
                    var dtVal = $(this).val();
                    if (dtVal != "") {
                        var date_pattern = /^(19|20)\d{2}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[0-1])$/;
                        console.log(date_pattern.test(dtVal));
                        if (!date_pattern.test(dtVal)) {
                            $(this).val(orgDtValue);
                            $(this).focus();
                            return false;
                        }
                    }
                }
                return true;
            },
            "change": function (e) {
                // console.log('change');
            }
            // --------------------------------------
        });
    },

    isEmpty: function (str) {
        if (typeof str == "undefined" || str == null || str == "")
            return true;
        else
            return false;
    },

    SHA256: function (s) {

        var chrsz = 8;
        var hexcase = 0;

        function safe_add(x, y) {
            var lsw = (x & 0xFFFF) + (y & 0xFFFF);
            var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
            return (msw << 16) | (lsw & 0xFFFF);
        }

        function S(X, n) {
            return (X >>> n) | (X << (32 - n));
        }

        function R(X, n) {
            return (X >>> n);
        }

        function Ch(x, y, z) {
            return ((x & y) ^ ((~x) & z));
        }

        function Maj(x, y, z) {
            return ((x & y) ^ (x & z) ^ (y & z));
        }

        function Sigma0256(x) {
            return (S(x, 2) ^ S(x, 13) ^ S(x, 22));
        }

        function Sigma1256(x) {
            return (S(x, 6) ^ S(x, 11) ^ S(x, 25));
        }

        function Gamma0256(x) {
            return (S(x, 7) ^ S(x, 18) ^ R(x, 3));
        }

        function Gamma1256(x) {
            return (S(x, 17) ^ S(x, 19) ^ R(x, 10));
        }

        function core_sha256(m, l) {

            var K = new Array(0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5, 0x3956C25B, 0x59F111F1,
                0x923F82A4, 0xAB1C5ED5, 0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3,
                0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174, 0xE49B69C1, 0xEFBE4786,
                0xFC19DC6, 0x240CA1CC, 0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA,
                0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7, 0xC6E00BF3, 0xD5A79147,
                0x6CA6351, 0x14292967, 0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13,
                0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85, 0xA2BFE8A1, 0xA81A664B,
                0xC24B8B70, 0xC76C51A3, 0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070,
                0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5, 0x391C0CB3, 0x4ED8AA4A,
                0x5B9CCA4F, 0x682E6FF3, 0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208,
                0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2);

            var HASH = new Array(0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F,
                0x9B05688C, 0x1F83D9AB, 0x5BE0CD19);

            var W = new Array(64);
            var a, b, c, d, e, f, g, h, i, j;
            var T1, T2;

            m[l >> 5] |= 0x80 << (24 - l % 32);
            m[((l + 64 >> 9) << 4) + 15] = l;

            for (var i = 0; i < m.length; i += 16) {
                a = HASH[0];
                b = HASH[1];
                c = HASH[2];
                d = HASH[3];
                e = HASH[4];
                f = HASH[5];
                g = HASH[6];
                h = HASH[7];

                for (var j = 0; j < 64; j++) {
                    if (j < 16) W[j] = m[j + i];
                    else W[j] = safe_add(safe_add(safe_add(Gamma1256(W[j - 2]), W[j - 7]), Gamma0256(W[j - 15])), W[j - 16]);

                    T1 = safe_add(safe_add(safe_add(safe_add(h, Sigma1256(e)), Ch(e, f, g)), K[j]), W[j]);
                    T2 = safe_add(Sigma0256(a), Maj(a, b, c));

                    h = g;
                    g = f;
                    f = e;
                    e = safe_add(d, T1);
                    d = c;
                    c = b;
                    b = a;
                    a = safe_add(T1, T2);
                }

                HASH[0] = safe_add(a, HASH[0]);
                HASH[1] = safe_add(b, HASH[1]);
                HASH[2] = safe_add(c, HASH[2]);
                HASH[3] = safe_add(d, HASH[3]);
                HASH[4] = safe_add(e, HASH[4]);
                HASH[5] = safe_add(f, HASH[5]);
                HASH[6] = safe_add(g, HASH[6]);
                HASH[7] = safe_add(h, HASH[7]);
            }
            return HASH;
        }

        function str2binb(str) {
            var bin = Array();
            var mask = (1 << chrsz) - 1;
            for (var i = 0; i < str.length * chrsz; i += chrsz) {
                bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - i % 32);
            }
            return bin;
        }

        function Utf8Encode(string) {
            string = string.replace(/\r\n/g, "\n");
            var utftext = "";

            for (var n = 0; n < string.length; n++) {

                var c = string.charCodeAt(n);

                if (c < 128) {
                    utftext += String.fromCharCode(c);
                } else if ((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                } else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }

            }

            return utftext;
        }

        function binb2hex(binarray) {
            var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
            var str = "";
            for (var i = 0; i < binarray.length * 4; i++) {
                str += hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8 + 4)) & 0xF) +
                    hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8)) & 0xF);
            }
            return str;
        }

        s = Utf8Encode(s);
        return binb2hex(core_sha256(str2binb(s), s.length * chrsz));
    },
	_textarea : $('<textarea/>'),
	decodeHtmlEntity : function(v){
		if(v && v.indexOf('＆') > -1){
			v = v.replace(/＆/g, '&');
		}
		return this._textarea.html(v).text();
	}

}

//-------------------------------------------------------
// HTML Form Serialize 처리
//-------------------------------------------------------
jQuery.fn.serializeObject = function () {
    var obj = null;
    try {
        if (this[0].tagName && this[0].tagName.toUpperCase() == "FORM") {
            var disabled = this.find(':input:disabled').removeAttr('disabled');
            var arr = this.serializeArray();
            if (arr) {
                obj = {};
                jQuery.each(arr, function () {
                    obj[this.name] = this.value;
                });
            }
            disabled.attr('disabled', 'disabled');
        }
    } catch (e) {
        alert(e.message);
    } finally {
    }
    return obj;
}


//로그인 세션 만료 ajax 처리
$.ajaxSetup({
    complete: function (data) {
        //if(typeof data.responseJSON === 'undefined' || typeof data.responseJSON.resultCd === 'undefined') return;
        if ($U.isNull(data.responseJSON)) return;
        if ($U.isNull(data.responseJSON.resultCd)) return;

        var loginUrl = '/cm/comm/issloginUsr.do';

        if (data.responseJSON.resultCd == '990') {
            alert(data.responseJSON.resultMsg);		//세션이 만료되어 로그인 화면으로 돌아갑니다.
            if (opener != null) {
                opener.location.href = loginUrl;
                self.close();
            } else {
                location.href = loginUrl;
            }
        }
    }
});

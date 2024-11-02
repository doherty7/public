/**
 *
 * 광고 지표 공통 유틸
 *
 */


// 매체구분별 컬럼 정보 가져오기
function getMdiaClsColumn (mdiaCls, sType, readOnly) {
    var sType = sType || 'DATA';
    var readOnly = readOnly || false;
	// 컬럼 정보(인쇄)
	var COLUMNS = {
		'CHK': { 'Header': {'Value': '', 'IconAlign': 'Center'}, 'Type': 'Bool', 'Name': 'CHK', 'Width': 50, 'CanEdit': 1, 'CanSort': 0,  'NoChanged': 1 },
		'SEQ': { 'Header': ['순번'], 'Name': 'SEQ', 'Type': 'Int', 'Width': 70 },
        'status': { 'Header': ['상태'], 'Name': 'status', 'Type': 'Text', 'Width': 85 },
		'idcrYear': { 'Header': ['지표연도'], 'Name': 'idcrYear', 'Type': 'Text', 'Width': 95, 'Required': 1 },
		'mdiaNm': { 'Header': ['매체명'], 'Name': 'mdiaNm', 'Type': 'Text', 'Width': 150, 'Required': 1 },
		'mdiaCd': { 'Header': ['매체코드'], 'Name': 'mdiaCd', 'Type': 'Text', 'Width': 100, 'Visible': 0, 'Required': 1 },
		'mdiaCorpNm': { 'Header': ['매체사명'], 'Name': 'mdiaCorpNm', 'Type': 'Text', 'Width': 150, 'Required': 1 },
		'mdiaCorpCd': { 'Header': ['매체사코드'], 'Name': 'mdiaCorpCd', 'Type': 'Text', 'Width': 120, 'Visible': 0, 'Required': 1 },
		'mdiaClsNm': { 'Header': ['분류'], 'Name': 'mdiaClsNm', 'Type': 'Text', 'Width': 100, 'Visible': 0 },
		'mdiaCls': { 'Header': ['분류코드'], 'Name': 'mdiaCls', 'Type': 'Text', 'Width': 80, 'Visible': 0, 'Required': 1 },
		'jobMdiaCls': { 'Header': ['매체구분코드'], 'Name': 'jobMdiaCls', 'Type': 'Text', 'Width': 80, 'Visible': 0, 'Required': 1 },
		'utlzRate': { 'Header': ['열독률'], 'Name': 'utlzRate', 'Type': 'Float', 'Width': 180, 'CanEdit': 1, 'CanEmpty': 1, 'Format': '#,##0.################', 'EditFormat': '#,##0.################' },
		// 'utizSct': { 'Header': ['열독률구간'], 'Name': 'utizSct', 'Type': 'Int', 'Width': 90, 'CanEdit': 1, 'CanEmpty': 1 },
		'prSprtYn': { 'Header': ['우선지원여부(우선지원대상자여부)'], 'Name': 'prSprtYn', 'Type': 'Enum', 'Width': 140, 'CanEdit': 1, 'Enum': '|예|아니요', 'EnumKeys': '|Y|N', 'Required': 0 },
		'pacCnt': { 'Header': ['언론중재위 중재 건수'], 'Name': 'pacCnt', 'Type': 'Int', 'Width': 140, 'CanEdit': 1 , 'CanEmpty': 1 },
		'mdiaDlbrYn': { 'Header': ['신문윤리위 서약 참여 여부'], 'Name': 'mdiaDlbrYn', 'Type': 'Enum', 'Width': 140, 'CanEdit': 1, 'Enum': '|예|아니요', 'EnumKeys': '|Y|N', 'Required': 0 },
		'mdiaDlbrCnt': { 'Header': ['신문윤리위 심의 건수'], 'Name': 'mdiaDlbrCnt', 'Type': 'Int', 'Width': 140, 'CanEdit': 1, 'CanEmpty': 1 },
		'dlbrYn': { 'Header': ['광고자율심의기구 심의 여부'], 'Name': 'dlbrYn', 'Type': 'Enum', 'Width': 140, 'CanEdit': 1, 'Enum': '|예|아니요', 'EnumKeys': '|Y|N', 'Required': 0 },
		'dlbrCnt': { 'Header': ['광고자율심의기구 심의 건수'], 'Name': 'dlbrCnt', 'Type': 'Int', 'Width': 140, 'CanEdit': 1, 'CanEmpty': 1 },
		'edtBrdStat': { 'Header': ['편집위원회 설치·운영 여부'], 'Name': 'edtBrdStat', 'Type': 'Text', 'Width': 140 },
		'rdrCmtStat': { 'Header': ['독자(권익)위원회 설치·운영여부'], 'Name': 'rdrCmtStat', 'Type': 'Text', 'Width': 140 },
		'nrmlIssYn': { 'Header': ['정상발행여부'], 'Name': 'nrmlIssYn', 'Type': 'Text', 'Width': 140 },
		'insrPayYn': { 'Header': ['보험납부여부(4대보험)'], 'Name': 'insrPayYn', 'Type': 'Text', 'Width': 140 },
		'taxPayYn': { 'Header': ['제세납부여부'], 'Name': 'taxPayYn', 'Type': 'Text', 'Width': 140 },
		'lawVltCnt': { 'Header': ['법령위반건수'], 'Name': 'lawVltCnt', 'Type': 'Int', 'Width': 140, 'CanEmpty': 1 },
		'areaNm': { 'Header': ['지역'], 'Name': 'areaNm', 'Type': 'Text', 'Width': 140 },
	};

    // 자료 or 이력
    if (sType === 'DATA') delete COLUMNS['status'];
    else delete COLUMNS['CHK'];

    // 읽기 전용
    if (readOnly === true) {
        delete COLUMNS['CHK'];
        /*
        for (var [key, value] of Object.entries(COLUMNS)) {
            COLUMNS[key]['Required'] = 0;
            COLUMNS[key]['CanEdit'] = 0;
        }
        */
        $.each(COLUMNS, function(key, value) {
            COLUMNS[key]['Required'] = 0;
            COLUMNS[key]['CanEdit'] = 0;
        });
    }

	// 매체구분별 컬럼 구조 정보
	var COLUMN_INFO = {
		'COMMON_DATA': ['CHK', 'SEQ', 'idcrYear', 'mdiaNm', 'mdiaCd', 'mdiaCorpNm', 'mdiaCorpCd', 'mdiaClsNm', 'mdiaCls', 'jobMdiaCls'],
        'COMMON_HIST': ['SEQ', 'status', 'idcrYear', 'mdiaNm', 'mdiaCd', 'mdiaCorpNm', 'mdiaCorpCd', 'mdiaClsNm', 'mdiaCls', 'jobMdiaCls'],
		'BTV': ['utlzRate', /*'utizSct',*/ 'pacCnt', 'rdrCmtStat', 'nrmlIssYn', 'insrPayYn', 'taxPayYn', 'lawVltCnt', 'areaNm'],
		'BRD': ['utlzRate', /*'utizSct',*/ 'pacCnt', 'rdrCmtStat', 'nrmlIssYn', 'insrPayYn', 'taxPayYn', 'lawVltCnt', 'areaNm'],
		'BSO': ['utlzRate', /*'utizSct',*/ 'pacCnt', 'rdrCmtStat', 'nrmlIssYn', 'insrPayYn', 'taxPayYn', 'lawVltCnt', 'areaNm'],
		'BIP': ['utlzRate', /*'utizSct',*/ 'pacCnt', 'nrmlIssYn', 'insrPayYn', 'taxPayYn', 'lawVltCnt', 'areaNm'],
		'INSP': ['utlzRate', /*'utizSct',*/ 'pacCnt', 'mdiaDlbrYn', 'mdiaDlbrCnt', 'rdrCmtStat', 'nrmlIssYn', 'insrPayYn', 'taxPayYn', 'lawVltCnt', 'areaNm'],
		'IPTL': ['utlzRate', /*'utizSct',*/ 'pacCnt', 'rdrCmtStat', 'nrmlIssYn', 'insrPayYn', 'taxPayYn', 'lawVltCnt', 'areaNm'],
		'IETC': ['utlzRate', /*'utizSct',*/ 'nrmlIssYn', 'insrPayYn', 'taxPayYn', 'lawVltCnt', 'areaNm'],
		'OUTA': [/*'utlzRate',*/ /*'utizSct',*/ 'nrmlIssYn', 'insrPayYn', 'taxPayYn', 'lawVltCnt', 'areaNm']
	};

	// 매체구분별 텍스트 정보
	var TEXT_INFO = {
		'utlzRate': {
			'PNSP': '열독률',
			'PMGZ': '열독률',
			'BTV': '시청률',
			'BRD': '청취율',
			'BSO': '유료가입자수',
			'BIP': '유료가입자수',
			'INSP': '월방문자수',
			'IPTL': '월방문자수',
			'IETC': '월방문자수',
			'OUTA': '유동인구수'
		},
		'rdrCmtStat': {
			'PNSP': '독자(권익)위원회',
			'PMGZ': '독자(권익)위원회',
			'BTV': '시청자위원회',
			'BRD': '시청자위원회',
			'BSO': '시청자위원회',
			'BIP': '',
			'INSP': '독자(권익)위원회',
			'IPTL': '독자(권익)위원회',
			'IETC': '',
			'OUTA': ''
		},
		'mdiaDlbr': {
			'PNSP': '신문윤리위',
			'PMGZ': '신문윤리위',
			'INSP': '인터넷신문위'
		}
	};

	var result = [];
    $.each(COLUMNS, function(key, value) {
		// 인쇄인경우
        if ($.inArray(mdiaCls, ['PNSP', 'PMGZ']) > -1) {
            result.push(value);
		} else {
			if ($.inArray(key, COLUMN_INFO['COMMON_' + sType]) > -1 || $.inArray(key, COLUMN_INFO[mdiaCls]) > -1) {
				// 매체별 텍스트 변경
				if (key === 'utlzRate') {
					value['Header'] = [TEXT_INFO.utlzRate[mdiaCls]];
				} else if (key === 'utizSct') {
					value['Header'] = [TEXT_INFO.utlzRate[mdiaCls] + ' 구간'];
				} else if (key === 'rdrCmtStat') {
					value['Header'] = [TEXT_INFO.rdrCmtStat[mdiaCls] + ' 설치·운영여부'];
				} else if (key === 'mdiaDlbrYn') {
					value['Header'] = [TEXT_INFO.mdiaDlbr[mdiaCls] + ' 서약 참여 여부'];
				} else if (key === 'mdiaDlbrCnt') {
					value['Header'] = [TEXT_INFO.mdiaDlbr[mdiaCls] + ' 심의 건수'];
				}
				result.push(value);
			}
		}
    });
    // 마지막 컬럼들 추가
    if (sType === 'HIST') {
        var lastCols = [
            { 'Header': ['등록자'], 'Name': 'insId', 'Type': 'Text', 'Width': 100 },
		    { 'Header': ['등록일'], 'Name': 'insDt', 'Type': 'Text', 'Width': 110, 'Extend': idcrUtil.datefmt },
		    { 'Header': ['수정자'], 'Name': 'uptId', 'Type': 'Text', 'Width': 100 },
		    { 'Header': ['수정일'], 'Name': 'uptDt', 'Type': 'Text', 'Width': 110, 'Extend': idcrUtil.datefmt }
        ];
        $.each(lastCols, function(index, item) {
            result.push(item);
        });
    }
	return result;
};

var idcrUtil = {
	datefmt: {
		'Type': 'Date', 'Format': 'yyyy-MM-dd', 'DataFormat': 'yyyy/MM/dd', 'EditFormat': 'yyyy/MM/dd'
	},
    startLoading() {
        $hD('.box_loading').style.display = 'block';
    },
    endLoading() {
        $hD('.box_loading').style.display = 'none';
    },
    /**
     * 매체-매체사 선택 팝업
     * @param {Object} param
     *
     */
    openMdiaPopup (param) {
        var defaultOptions = {userType: 'BO', adTypeDev: '', mdiaGb: '', mdiaCd: '', callbackFncNm: ''};
        // Object.assign(defaultOptions, param);
        $.extend(defaultOptions, param);

        var FORM_NAME = '_mdiaForm';
        if (!document.querySelector('#' + FORM_NAME)) {
            var form = document.createElement('form');
            form.setAttribute('charset', 'UTF-8');
            form.setAttribute('method', 'post');
            form.setAttribute('id', FORM_NAME);
            form.setAttribute('name', FORM_NAME);
            $.each(defaultOptions, function(key, value) {
                var hiddenField = document.createElement('input');
                hiddenField.setAttribute('type', 'hidden');
                hiddenField.setAttribute('name', key);
                hiddenField.setAttribute('id', key);
                hiddenField.setAttribute('value', '');
                form.appendChild(hiddenField);
            });
            /*
            for (var [key, value] of Object.entries(defaultOptions)) {
                var hiddenField = document.createElement('input');
                hiddenField.setAttribute('type', 'hidden');
                hiddenField.setAttribute('name', key);
                hiddenField.setAttribute('id', key);
                hiddenField.setAttribute('value', '');
                form.appendChild(hiddenField);
            }
            */
            document.body.appendChild(form);
        }
        IssgaUtil.popup(FORM_NAME, '매체 검색', '/bo/idcr/comm/mdiaSearchListPop.do', '1280', '890', defaultOptions);
    },
    /**
     * 체크 박스 '전체'클릭 이벤트 적용
     * @param {String} className
     * @param {String} allValue
     * @returns
     */
    checkboxAllClick (className, allValue) {
        var className = className || '';
        var allValue = allValue || '';
        if (!className) return;

        var isAll = function(ele) {
            return $(ele).val() === allValue;
        }

        $('.' + className).click(function () {
            var isChecked = $(this).is(':checked') === true;
            if (isAll(this)) {
                $('.' + className).each(function () {
                    this.checked =isChecked
                });
            } else {
                var isCheckAll = true;
                $('.' + className).each(function () {
                    if (!isAll(this)) {
                        isCheckAll = this.checked;
                        if (!this.checked) return false;
                    }
                });
                $('.' + className).each(function () {
                    if (isAll(this)) {
                        this.checked = isCheckAll;
                        return false;
                    }
                });
            }
        });
    },
    /**
     * 체크된 값 리턴
     * @param {String} className
     * @param {String} allValue
     * @returns {String} value1,value2, ...
     */
    getCheckboxValues (className, allValue) {
        var className = className || '';
        var allValue = allValue || null;
        if (!className) return;
        var isAll = function(ele) {
            return $(ele).val() === allValue;
        }
        var values = [];
        $('.' + className).each(function () {

            if (this.checked) {
                var v = $(this).val();
                if (isAll(this)) {
                    values = [v];
                    return false;
                } else {
                    values.push(v);
                }
            }

        });
        return values.toString();
    },
    /**
     * 체크박스 초기화
     * @param {String} className
     * @param {Booelan} isChecked
     * @returns
     */
    checkboxReset (className, isChecked) {
        var className = className || '';
        var isChecked = isChecked || false;
        if (!className) return;
        $('.' + className).each(function () {
            this.checked = isChecked
        });
    },
    /**
     * Json 직렬화
     * @param {Object} jsonData
     * @returns {Object}
     */
    getJsonToSerialize (jsonData) {
        var FORM_NAME = '_tempForm';
        var INPUT_NAME = 'gridData';
        if (!document.querySelector('#'+ INPUT_NAME)) {
            var form = document.createElement('form');
            form.setAttribute('charset', 'UTF-8');
            form.setAttribute('method', 'POST');
            form.setAttribute('id', FORM_NAME);
            form.setAttribute('name', FORM_NAME);

            var hiddenField = document.createElement('input');
            hiddenField.setAttribute('type', 'hidden');
            hiddenField.setAttribute('name', INPUT_NAME);
            hiddenField.setAttribute('id', INPUT_NAME);
            hiddenField.setAttribute('value', '');
            form.appendChild(hiddenField);

            document.body.appendChild(form);
        }

        var gridListToString = JSON.stringify(jsonData);
		$('#' + INPUT_NAME).val(gridListToString);
        var $form = $('#' + INPUT_NAME).closest('form');
        return $form.serialize();
    },
    /**
     *
     * @param {Object} sheet
     * @param {String} actionType
     * @param {Fcuntion} okFnc
     * @param {Function} cancelFnc
     * @returns
     */
    confirm (sheet, actionType, okFnc, cancelFnc) {
        var okFnc = okFnc || null;
        var cancelFnc = cancelFnc || null;
        if (!sheet) return;
        var msg = '저장';
        switch (actionType) {
            case 'S': msg = '저장하시겠습니까?'; break;
            case 'U': msg = '변경하시겠습니까?'; break;
            case 'D': msg = '삭제하시겠습니까?'; break;
            default: msg = '';

        }
        if (!msg) msg = actionType;
        sheet.showMessageTime({
             message: "<span style='color:black'>" + msg + "</span>",
             buttons: ['확인', '취소'],
             func: function (args) {
                if (args === 1) {
                    if (typeof okFnc === 'function') {
                        okFnc();
                    }
                } else if (args==2){
                    if (typeof cancelFnc === 'function') {
                        cancelFnc();
                    }
                }
            }
        });

    },
    selectDelete (sheet, checkedColName, action) {
        var checkedColName = checkedColName || 'CHK';
        var rows = sheet.getRowsByChecked(checkedColName);
		if (rows.length === 0) return 0;
        $.each(rows, function(index, row) {
            row['Deleted'] = action;
        });
		sheet.renderBody();
		sheet.setAllCheck(checkedColName, 0);
        return rows.length;

    },
    /**
     * 선택 삭제
     * @param {Object} sheet
     * @param {String} checkedColName
     */
    selectRemove (sheet, checkedColName) {
        var checkedColName = checkedColName || 'CHK';
        return this.selectDelete(sheet, checkedColName, 1);
    },
    /**
     * 선택 삭제 취소
     * @param {Object} sheet
     * @param {String} checkedColName
     */
     selectRemoveCancel (sheet, checkedColName) {
        var checkedColName = checkedColName || 'CHK';
        return this.selectDelete(sheet, checkedColName, 0);
    },
    /**
     * 레이어 팝업 열기
     */
    openLayerPopup () {
        $('.idcrLayerPopup').css('display', 'block');
        $('.dim_bg').css('display', 'block');
    },
    /**
     * 레이어 팝업 닫기
     */
    closeLayerPopup () {
        $('.idcrLayerPopup').css('display', 'none');
        $('.dim_bg').css('display', 'none');
    },
    /**
     * 파일 객체 얻기
     * @param {String} fileId
     * @returns
     */
    getFiles(fileId) {
        var fileInput = document.querySelector('#'+ fileId);
        if (!fileInput) return null;
        var files = fileInput.files;
        return files.length === 0 ? null : files.length === 1 ? files[0] : files;
    },
    /**
     * 파일 확장자 얻기
     * @param {File} file
     * @returns
     */
    getFileExt (file) {
        if (!file) return;
        var fileName =file.name;
        var fileExt = fileName.lastIndexOf('.');
        return fileName.substring(fileExt + 1, fileName.length).toLowerCase();
    },
    /**
     * 파일 초기화
     * @param {*} fileId
     *
     */
    fileReset (fileId) {
        if (/(MSIE|Trident)/.test(navigator.userAgent)) {
            $('#'+ fileId).replaceWith($('#'+ fileId).clone(true));
        } else {
            $('#'+ fileId).val('');
        }
    },
    /**
     * 엑셀 업로드 클릭
     *
     */
    batchUploadClick() {
        idcrUtil.openLayerPopup();
    },
    /**
     * 엑셀 닫기 클릭
     *
     */
     batchUploadClose() {
        idcrUtil.fileReset('uploadExcelFile');
        $('#logText').val('');
        idcrUtil.checkboxReset('updateColumns', true);
        idcrUtil.closeLayerPopup();
        if (typeof doSearch === 'function') {
            doSearch();
        } else if ($('#btn_search').length > 0) {
            $('#btn_search').click();
        }
    },
    /**
     * 엑셀 업로드
     *
     */
     batchUpload(batchType) {
        batchType = batchType || '';
        var file = idcrUtil.getFiles('uploadExcelFile');
        if (!file) {
            alert('파일을 첨부하세요.');
            return;
        }
        var ALLOW_EXT = ['xls', 'xlsx'];
        var msg = '확장자가 xls 또는 xlsx 파일만 업로드 가능합니다.';
        var ext = idcrUtil.getFileExt(file);
        if ($.inArray(ext, ALLOW_EXT) < 0) {
            alert(msg);
        }
        var idcrYear = $('#excelUploadForm input[name=idcrYear]').val();
        var jobMdiaCls = $('#excelUploadForm input[name=jobMdiaCls]').val();
        var mdiaCls = $('#excelUploadForm input[name=mdiaCls]').val();

        if (batchType === 'utlz') {
            if (!idcrYear) {
                alert('지표년도 정보가 없습니다.');
                return;
                }
        }
        if (!jobMdiaCls) {
            alert('매체구분 정보가 없습니다.');
            return;
            }
            if (!mdiaCls) {
            alert('매체분류 정보가 없습니다.');
            return;
            }

            var URL = '/bo/idcr/comm/' + mdiaCls.toLowerCase() + '/' + batchType;
            if (batchType === 'utlz') {
            IssgaUtil.ajax.post(URL + '/check/batch.ajax', {idcrYear}, function(code, data) {
                if (data.hasUtlz === true) {
                    if (confirm('기존 데이터를 삭제하고 새로 등록하시겠습니까?')) {
                        setTimeout(function() {
                            idcrUtil.batchUploadProc(batchType, URL);
                        },1530)
                    }
                } else {
                    idcrUtil.batchUploadProc(batchType, URL);
                }
            });
        } else {
            idcrUtil.batchUploadProc(batchType, URL);
        }
    },
    /**
     * 엑셀 업로드 실행
     *
     */
    batchUploadProc(batchType, url) {
        if (batchType !== 'utlz') {
            var mdiaDlbrAllYn = $('#mdiaDlbrAllYnUpdate').is(':checked') ? 'Y' : 'N';
            $('#mdiaDlbrYnUpdate').val(mdiaDlbrAllYn);
            $('#mdiaDlbrCntUpdate').val(mdiaDlbrAllYn);
            var dlbrAllYn = $('#dlbrAllYnUpdate').is(':checked') ? 'Y' : 'N';
            $('#dlbrYnUpdate').val(dlbrAllYn);
            $('#dlbrCntUpdate').val(dlbrAllYn);
        }
        $('#excelUploadForm').ajaxSubmit({
            url: url + '/batch.ajax',
            type: 'post',
            dataType: 'json',
            beforeSubmit: function () {
                idcrUtil.startLoading();
            },
            success: function (result) {
                if (result.resultCd === 'SUCCESS') {
                    $('#logText').val('[' + result.resultCd + '] ' + result.resultMsg);
                    idcrUtil.fileReset('uploadExcelFile');
                } else if (result.resultCd === 'ERROR') {
                    if (result.errorList && result.errorList.length > 0) {
                        var log = '[' + result.resultCd + '] ' + result.resultMsg + '(' + result.errorList.length + '건)'+'\n';
                        $.each(result.errorList, function(index, item) {
                            log += item.row +'행 ' + item.column + ': ' + item.msg + '\n';
                        });
                        $('#logText').val(log);
                    } else {
                        $('#logText').val('[' + result.resultCd + '] ' + result.resultMsg);
                    }
                } else {
                    $('#logText').val('[ERROR] 에러가 발생했습니다.');
                }
            },
            error: function () {
                idcrUtil.endLoading();
            },
            complete: function () {
                idcrUtil.endLoading();
            }
        });
    },
    /**
     * 엑셀 업로드 초기화
     *
     */
    batchInit (batchType) {
        var batchType = batchType || '';
        // 파일 초기화
        $('#fileReset').click(function() {
            idcrUtil.fileReset('uploadExcelFile');
            $('#logText').val('');
        });

        // 파일 변경
        $('#uploadExcelFile').change(function () {
            $('#logText').val('');
        });
    },
    /**
     * 엑셀 다운로드 시간
     * @returns
     */
    getExcelDate() {
        var today = new Date();
        var year = today.getFullYear();
        var month = ('0' + (today.getMonth() + 1)).slice(-2);
        var day = ('0' + today.getDate()).slice(-2);
        var dateString = year + '' + month  + '' + day;

        var hours = ('0' + today.getHours()).slice(-2);
        var minutes = ('0' + today.getMinutes()).slice(-2);
        var seconds = ('0' + today.getSeconds()).slice(-2);
        var timeString = hours + '' + minutes  + '' + seconds;

        return dateString + timeString;
    }

};
/**
 *
 * 정부광고 모니터링 내역 공통 유틸
 *
 */

var mntrUtil = {

    startLoading() {
        $hD('.box_loading').style.display = 'block';
    },
    endLoading() {
        $hD('.box_loading').style.display = 'none';
    },
    /**
     * 레이어 팝업 열기
     */
    openLayerPopup1 () {
        $('#mntrLayerPopup1').css('display', 'block');
        $('.dim_bg').css('display', 'block');
    },
    
    openLayerPopup2 () {
        $('#mntrLayerPopup2').css('display', 'block');
        $('.dim_bg').css('display', 'block');
    },
    
    /**
     * 레이어 팝업 닫기
     */
    closeLayerPopup () {
        $('.mntrLayerPopup').css('display', 'none');
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

    /**
     * 엑셀 닫기 클릭
     *
     */
     batchUploadClose() {
        mntrUtil.fileReset('uploadExcelFile');
        $('#logText').val('');
        mntrUtil.closeLayerPopup();
        if (typeof doSearch === 'function') {
            doSearch();
        } else if ($('#gridSearch').length > 0) {
            $('#gridSearch').click();
        }
    },
    /**
     * 엑셀 업로드
     *
     */
     batchUpload() {
        var file = mntrUtil.getFiles('uploadExcelFile');
        if (!file) {
            alert('파일을 첨부하세요.');
            return;
        }
        var ALLOW_EXT = ['xls', 'xlsx'];
        var msg = '확장자가 xls 또는 xlsx 파일만 업로드 가능합니다.';
        var ext = mntrUtil.getFileExt(file);
        if ($.inArray(ext, ALLOW_EXT) < 0) {
            alert(msg);
        }
        var mntrYear = $('#regMntrYear').val();
        var half = $('#regHalf').val();

        if (!mntrYear) {
            alert('지표년도 정보가 없습니다.');
            return;
        }

        if (!half) {
            alert('분기 정보가 없습니다.');
            return;
        }

        var URL = '/v02/bo/adMntr/excelUpload.ajax';  
		mntrUtil.batchUploadProc(URL);	
    },
    /**
     * 엑셀 업로드 실행
     *
     */
    batchUploadProc(url) {
        $('#excelUploadForm').ajaxSubmit({
            url: url,
            type: 'post',
            dataType: 'json',
            beforeSubmit: function () {
                mntrUtil.startLoading();
            },
            success: function (result) {
                if (result.resultCd === 'SUCCESS') {
                    $('#logText').val('[' + result.resultCd + '] ' + result.resultMsg);
                    mntrUtil.fileReset('uploadExcelFile');
                } else if (result.resultCd === 'ERROR') {
                    if (result.errorList && result.errorList.length > 0) {
                        var log = '[' + result.resultCd + '] ' + result.resultMsg + '(' + result.errorList.length + '건)'+'\n';
                        $.each(result.errorList, function(index, item) {
                            log += '일련 번호 :' +item.no +' '+ item.colName + ': ' + item.msg + '\n';
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
                mntrUtil.endLoading();
            },
            complete: function () {
                mntrUtil.endLoading();
            }
        });
    },
    /**
     * 엑셀 업로드 초기화
     *
     */
    batchInit () {
        // 파일 초기화
        $('#fileReset').click(function() {
            mntrUtil.fileReset('uploadExcelFile');
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
/*=================================================================================
 *	파 일 명		: IMS_Config.js
 *	작성목적		: Config 함수
 *	작 성 자		: 이상준
 *	최초작성일		: 2014.11.06
 *	최종작성일		:
 *	수정내역		:
 *					2018.03.15	이상준	xgrid default row count 추가
=================================================================================*/

var IMS_config = {
    path: ""
    , calendardiv: "-"
    , loadingon: ""
    , loadingoff: ""
    , alertfunc: "ims_message_alert"
    , errorfunc: "ims_error_alert"
    , wsocketurl: ""	//	"ws://localhost:8088/ims/wsocket"
    , userid: ""
    , username: ""
    , usercharac: ""
    , chattingimg: "/IMS02/module/html/images/chatting/ims_chatting.png"
//	, 	rowspanCorrectValue	:	7	//--**		ims_grid
//	, 	resizeCorrectValue	:	4		//--**		ims_grid
    , G2_defaultrowcnt: 100	//--**	XG Grid default row count
    , encode: false			//--**	web.xml 에서 encoding filter 작동되므로 false 처리
    , messageType: "json"	//--**	Ajax 의 메시지 타입 정의
    , dbnullType: "NVL({0},'NULL')"
    , gologin: "/login"
    , seperator: "§Å§"
    , shutdowntime: "2020/11/14 12:00:00"
};

var sessionTimeOut = 60;

//--**	message alert
function ims_message_alert(m) {
    alert(m);
}

//--**	error alert
function ims_error_alert(m) {
    alert(m);
}

Date.prototype.isValid = function () {

    // If the date object is invalid it
    // will return 'NaN' on getTime()
    // and NaN is never equal to itself.
    return this.getTime() === this.getTime();
};

//--**	shutdown check
// var _ims_shutdown_template = "<div id='ims_shutdown_template' style='text-align:center;display:none;position:absolute;top:2px;left:40%;overflow:hidden;font-size:13px;font-weight:bolder;color:#d56a00'></div>";
var _ims_shutdown_template = "<div id='ims_shutdown_template' style='text-align:center;display:none;position:absolute;top:2px;left:40%;overflow:hidden;font-size:13px;font-weight:bold;color:white;z-index: 999999999999;'></div>";
var _session_extend_btn = '';
setInterval(function () {

    //--**	template 가 없는 경우 template insert
    var sobj = $hD("#ims_shutdown_template");
    if ($U.isNull(sobj)) {
        document.body.insertAdjacentHTML("beforeend", _ims_shutdown_template);
        sobj = $hD("#ims_shutdown_template");
    }

    //--**	ims_config 에 값이 없으면 return
    if ($U.isNullOrEmpty(IMS_config.shutdowntime)) {
        sobj.style.display = "none";
        return;
    }

    //--**	ims_config 와 값을 비교하여 30분 이내면 화면 출력함
    var diffDate_1 = new Date();
    var diffDate_2 = new Date(IMS_config.shutdowntime);
    var sInTime = new Date(S_IN_TIME);

    var time01 = diffDate_1.getTime();
    var time02 = diffDate_2.getTime();
    var time03 = sInTime.getTime();

    if (isNaN(time03)) {
        return;
    }

    //--**	시간이 지나면 삭제함
    if (time01 > time02) {
        sobj.style.display = "none";
        return;
    }

    var diff = Math.abs(time02 - time01);
    diff = Math.ceil(diff / (1000 * 60));	//--	분

    var diff2 = Math.abs(time03 - time01);
    diff2 = Math.ceil(diff2 / (1000 * 60));	//--	분
    diff2 = sessionTimeOut - diff2;

    //--**	30 분전에 나타남
    if (diff > 30) {
        sobj.style.display = "none";
        return;
    }

    sobj.style.display = "block";
    sobj.innerHTML = $U.format("현재시간은 {0}입니다.<br/>[ <font style='color:white;font-size:15px'>{1}</font> ] 분후 세션이 종료될 예정입니다.<br/> ** 정보 유실이 발생할수 있습니다. 주의하시기 바랍니다  **"
        , diffDate_1.toString().replace("GMT+0900 (한국 표준시)", "")
        , diff
    );

    // if( diff2 < 1 ){
    // 	console.log(diff2);
    // 	if(window.location.href.indexOf('popup')>-1){
    // 		window.open('', '_self', '');
    // 		window.close();
    // 	} else {
    // 		location.href = "/cm/comm/actionLogout.do";
    // 	}
    // 	return;
    // }

}, 3000);

function removeBtn(sessionUserId, stopYn) {

    var btnShowYn = ['등록', '수정', '승인', '매체', '중지', '저장', '선택', '위임', '권한', '회수', '다음'];

    // 문체부 설정
    var btnShowYnE = [
        '접수', '승인', '반려', '등록', '작성'
        , '수정', '이메일', '발송', '지정', '저장'
        , '행', '일괄', '선택 접수', '선택접수', '삭제'// '선택 다운로드' 때문에 '선택'으로 못하고 '선택 접수', '선택접수'로 나눔
        , '다음', '시안', '마감일', 'SMS', '중인' // '작성중인','작성 중인'
        , '완료', '취소'
    ];

    if (sessionUserId == 'E1234567') {
        stopYn = 'E';
    }

    var obj = $('.stopYn');
    var arr;
    if (stopYn == 'Y') {

        arr = btnShowYn;

    } else if (stopYn == 'E') {

        arr = btnShowYnE;

    } else {
        console.log('stopYn - N');
        arr = [];
    }

    $.each(obj, function (i, v) {
        for (var j = 0; j < arr.length; j++) {

            if (v.text.indexOf(arr[j]) > -1) {
                $(this).hide();
                break;
            }

        }
    });

}

// 호환성보기 체크유무 판단 test
function detectIE() {

    var agent = navi.userAgent.toLowerCase();

    if (agent.indexOf('msie') == -1 && agent.indexOf('trident') == -1) return;

    if (agent.indexOf('msie 7') > -1 && agent.indexOf('trident') > -1) {

        var bStyle = document.body.style;
        var canvas = document.createElement('canvas');

        if (!('getContext' in canvas)) return 8;
        if (!('msTransition' in bStyle) && !('transition' in bStyle)) return 9;
        if (!canvas.getContext('webgl')) return 10;
        return 11;

    } else {

        if (agent.indexOf('msie') == -1) return 11;
        return parseFloat(/msie ([d]+)/.exec(agent)[1]);

    }
}

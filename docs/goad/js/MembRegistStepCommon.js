
var timeChk = 0;
var idchk = 0;

document.onkeydown = function () {
	var backspace = 8;
	var t = document.activeElement;
	if (event.keyCode == backspace) {
		if (t.tagName == "SELECT")
			return false;
		if (t.tagName == "INPUT" && t.getAttribute("readonly") == "")
			return false;
	    }
}
function fn_selectUsrIdChk() {
	var emailPre = $('#userEmail1').val();
	var emailPost = $('#userEmail2').val();

	var loopResult = true;
    var allIds1 = [ emailPre, emailPost ];
    for (var i = 0; i < allIds1.length; i++) {
        loopResult = gfn_isNulll(allIds1[i]);
        if(!loopResult){
            alert(copEmailAdres + cmRquirdMsg);
            return false;
            break;
        }
    }

    var param = {
					'emailPre' : emailPre,
					'emailPost': emailPost
    			};

    IssgaUtil.ajax.post("/cm/memb/selectUsrIdCheck.ajax", param, function(result, data){
    	if (data > 0) {
            alert(errCmDupId);
            $("#userEmail1").focus();
            idchk = 0;
        } else {
            alert(errCmAvlableId);
            $('#sendAuthMail').css('display', 'inline-block');
            idchk = 1;
        }
    });
	return false;
}

function fn_sendAuthMail() {
	var emailPre = $('#userEmail1').val();
	var emailPost = $('#userEmail2').val();
	var emailAddr = $('#userEmail1').val() + "@" + $('#userEmail2').val();
	var usrHnm = $('#usrHnm').val();
	var reqCols = { "userEmail1":"메일주소1", "userEmail2":"메일주소2", "userHnm":"이름" };

    var reqColsNm = "";
    $.map( reqCols, function(v,i){
        if($("#"+i).val() == ""){
            reqColsNm += v + ", ";
        }
    });

    if(reqColsNm != ""){
        reqColsNm = reqColsNm.substring(0,reqColsNm.length-2);
        alert(reqColsNm + cmRquirdMsg);
        return;
    }

    if (timeChk == 1) {
    	alert("이미 인증 메일 발송을 완료했습니다. 메일을 확인해 주세요.\n메일 재발송은 최초 발송 30초 후에 가능합니다.");
    	return false;
    }

	$('#userEmail1').prop('readonly', true);
	$('#userEmail2').prop('readonly', true);
	$('#userEmail3').css('display', 'none');
    $('#sendAuthMail').css('display', 'none');
    alert("인증 메일을 발송합니다.");

    var param =  {
			'sndngTmplatSeq' : "136",
			'rcverEmail'     : emailAddr,
			'emailPre'       : emailPre,
			'emailPost'      : emailPost,
			'rcverNm'        : usrHnm
		};

    IssgaUtil.ajax.post("/cm/memb/sendAuthMail.ajax", param, function(result, data){
    	console.log(data);

		alert(data.rcverEmail + "로 인증메일을 발송했습니다.\n 확인해 주시기 바랍니다.");

		$('#selectUsrIdChk').css('display', 'none');
		$('#notice').html('* 위 주소로 인증메일이 발송된 상태입니다.');
		$('#changeMailAddr').css('display', 'inline-block');

		timeChk = 1;
		setTimeout("fn_timerTest()", 30000);
    });


}
function fn_submit(){

	var usrDcd = $('#usrDcd').val();
	var usrPwdChk = $("#userPassword").val();
	var usrPwd = 	$("#userPasswordChk").val();

	var reqCols1 = [ "affiliated" ];
	var reqCols2 = [ "c_tell1", "c_tell2", "c_tell3" ];
	var reqCols3 = [ "c_mobile1", "c_mobile2", "c_mobile3" ];
	var reqCols4 = [ "userEmail1", "userEmail2" ];
	var reqCols5 = [ "affiNm" ];
    var arr = [ reqCols3, reqCols4 ];
	var arr2 = [ "휴대폰번호", "이메일주소" ];
	if ( 'AD' == usrDcd || 'MD' == usrDcd || 'CO' == usrDcd ) {
	    arr.unshift(reqCols1, reqCols2);
		arr2.unshift("소속부서", "부서연락처");
	} else {
		arr.unshift(reqCols5, reqCols1);
		arr2.unshift("소속기관", "소속부서");
	}
    var reqColsNm = "";
    $.map( arr, function(v,j) {
    	var tmp = arr[j];
    	var tmp2 = "";
        $.map( tmp, function(v,i){
            if($("#"+v).val() == ""){
                tmp2 = arr2[j] + ", ";
            }
        });
        reqColsNm += tmp2;
    });
    if(reqColsNm != ""){
        reqColsNm = reqColsNm.substring(0,reqColsNm.length-2);
        alert(reqColsNm + cmRquirdMsg);
        return;
    }

    if ( 'MD' == usrDcd || 'CO' == usrDcd ) {
    	reqCols2.push("c_tell4");
	}
    var arr3 = [ reqCols3 ];
    var arr4 = [ '휴대폰 번호' ];
    if ( 'AD' == usrDcd || 'MD' == usrDcd || 'CO' == usrDcd ) {
	    arr3.unshift(reqCols2);
		arr4.unshift("부서연락처");
	}
    reqColsNm = "";
    $.map( arr3, function(v,j) {
    	var tmp = arr3[j];
    	var tmp2 = "";
        $.map( tmp, function(v,i){
        	var check = /[^0-9]/gi;
        	var str = $("#"+v).val();
            if( (typeof str != 'undefined' || str != '') && check.test(str) ){
                tmp2 = arr4[j] + ", ";
            }
        });
        reqColsNm += tmp2;
    });
    if(reqColsNm != ""){
        reqColsNm = reqColsNm.substring(0,reqColsNm.length-2);
        alert(reqColsNm + "에는 숫자만 입력할 수 있습니다.");
        return;
    }

    if ( usrPwdChk == "" || usrPwd == "" || usrPwdChk != usrPwd ){
        alert(faUsrPwdUpt2);
        return false;
    }

    var allIds3 = [ usrPwd, usrPwdChk ];
    for (var i = 0; i < allIds3.length; i++) {
    	loopResult = isPwdOkay(allIds3[i]);
        if(!loopResult){
            alert(errPwdMin);
            return false;
            break;
        }
    }

    fn_insertRgstFrm();
}
function gfn_isNulll(input) {
       if (input == null || input == ""){
             return false;
       }else{
             return true;
       }
}
function gfn_isNum(str) {
	var check = /[0-9]/;
    return check.test(str);
}

function isPwdOkay(str){
	var check = /^(?=.*[a-zA-Z])(?=.*[!@#$%^~*+=-])(?=.*[0-9]).{8,30}$/;
	return check.test(str);
}

function fn_goBackFrm() {
	document.backFrm.action = '/cm/memb/cmMembRegistStep3.do';
    document.backFrm.submit();
}

function fn_insertRgstFrm() {
	var emailPre = $('#userEmail1').val();
	var emailPost = $('#userEmail2').val();
	var param = {
				  'emailPre'  : emailPre
			    , 'emailPost' : emailPost
		};

	IssgaUtil.ajax.post("/cm/memb/selectMailCode.ajax", param, function(result, data){

		if ( data.sAuthYn == 'N') {
			alert("메일 인증이 완료되지 않았거나, 아이디가 중복되었습니다.\n아이디(메일 주소)를 확인하세요.");
			return false;
		} else if (data.sAuthYn == 'Y') {
			document.rgstFrm.action = '/cm/memb/cmMembRegistStepM5.do';
	        document.rgstFrm.submit();
		}
    });

}
function fn_changeMailAddr() {
	$('#userEmail1').removeAttr('readonly');
    $('#userEmail2').removeAttr('readonly');
    $('#userEmail3').css('display', 'inline-block');
    $('#selectUsrIdChk').css('display', 'inline-block');
    $('#notice').html('* 이메일 주소를 아이디로 사용합니다. 정확한 이메일 주소를 입력하여 주십시오.');
    $('#sendAuthMail').css('display', 'none');
    $('#changeMailAddr').css('display', 'none');
}
function fn_timerTest() {
	timeChk = 0;
}
$(document).ready(function(){
	// 검증에 사용할 함수명들을 배열에 담아준다.
	//var idFuncArray = ["isAlphabetForSpan", "spaceCheck"];
	// 1. span태그 obj, 2. input태그 obj, 3. 위에서 정의한 함수명 배열, 4. 검증에 걸렸을 때 나타날 텍스트, 5. 검증을 통과했을 때 나타날 텍스트, 6. span태그의 좌측 폭 위치.
	//spanValidation($("#idSpan"), $("#id"), idFuncArray, "아이디는 영문으로 공백없이 입력하십시오!", "사용 가능한 형식의 아이디입니다.", "15px");
	var chkPwd1 = ["spaceCheck", "isPwdOkay"];
    var chkPwd2 = ["spaceCheck", "isPwdSame"];
    spanValidation($("#spPwd"), $("#userPassword"), chkPwd1, "영문, 숫자, 특수문자 포함 8자 이상 30자 이하로 입력하세요.", " ", "15px");
    spanValidation($("#spPwdChk"), $("#userPasswordChk"), chkPwd2, "입력한 비밀번호와 일치하지 않습니다.", " ", "15px");
});

function spanValidation(spanObj, inputObj, validFuncArray, redMsg, greenMsg, marginLeftPx){
	spanObj.css("margin-left", marginLeftPx); // span태그의 좌측 폭을 설정해준다.
	
	var confirmCheck = false; // 검증에 통과 여부에 사용할 flag
	
	spanObj.hide(); // span태그를 숨긴다.
	
	inputObj.bind('focusin keyup', function(){ // input태그에 포커스가 들어오거나 키가 눌렸을 때 실행됨
		var inputValue = inputObj.val();
		
		var funcResult = true; // 함수 실행 결과를 담을 flag
		
		for(i=0; i<validFuncArray.length; i++){ // 검증에 사용할 함수명 배열을 반복문으로 돌린다.
			var funcName = validFuncArray[i]; // 배열에서 함수명을 하나씩 뽑아낸다. 
			var funcObj = window[funcName]; // 함수명(string)을 객체(object)로 받는다.
			funcResult = funcObj(inputValue); // 해당 함수를 실행하여 결과값(true/false)을 변수에 담는다. 만약 함수 하나라도 통과를 하지 못하면 false가 된다.
			if(!funcResult){ // 검증에 통과하지 못한 함수가 있을 경우 반복문 탈출
				break;
			}
		}
		
		if(!funcResult){ // 검증에 통과하지 못했을 때,
			spanObj.show(); // span태그 보여준다.
			spanObj.removeClass('greenText'); // span태그에 greenText 클래스를 삭제한다.
			spanObj.addClass('redText'); // span태그에 redText 클래스를 추가한다.
			
			spanObj.text(""); //  span태그의 텍스트를 지운다.
			spanObj.append(redMsg); // span태그에  검증에 통과하지 못했을 때 나타나는 텍스트를 넣는다.
			
			confirmCheck = false; // 검증 통과 여부 flag에 false를 대입한다.
		}else{ // 검증에 통과했을 때,
			spanObj.show();
			spanObj.removeClass('redText');
			spanObj.addClass('greenText');
			
			spanObj.text("");
			spanObj.append(greenMsg);
			
			confirmCheck = true;
		}
		
	});
	
	inputObj.focusout(function(){ // 포커스가 input태그에서 벗어났을 때 실행,
		var inputValue = inputObj.val();
		if(confirmCheck || inputValue == ""){ // 검증에 통과를 했거나 input태그에 입력 값이 없을 경우,
			spanObj.hide(); // span태그를 숨긴다.
		}
	});
}
function rmvNotNum(str){
	var check = /^[0-9]{2,4}$/;
	if(check.test(str)){
		return str.remove();
	}
	return true;
}

// 영문만 입력받도록 검증
function isAlphabetForSpan(str){
	var check = /^[A-Za-z\s]/;
	if(check.test(str)){
		return false;
	}
	return true;
}

// 영문과 숫자 
function isAlphabetNumOkay(str){
	var check = /^[a-zA-Z0-9]{3,15}$/; // emailAddr1 영문과 숫자 3~15자리까지
	if(check.test(str)){
		return false;
	}
	return true;
}

// emailAddr2 적합한 형식인지.
function isEmailOkay(str){
	var check = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]$/i;
	if(check.test(str)){
		return false;
	}
	return true;
}

// 패스워드 영문과 숫자 특수문자
function isPwdOkay(str){
	var check = /^(?=.*[a-zA-Z])(?=.*[!@#$%^~*+=-])(?=.*[0-9]).{8,30}$/;
	if(!check.test(str)){
		return false;
	}
	return true;
}
function isPwdSame(str){
	if($("#userPassword").val() != $("#userPasswordChk").val()){
		return false;
	}
	return true;
}
// 공백 허용하지 않도록 검증
function spaceCheck(inputVal){
	var invalid = " ";
	
	if(inputVal.indexOf(invalid) > -1){
		return false;
	}else if(inputVal.length < 1){
		return false;
	}else{
		return true;
	}
}
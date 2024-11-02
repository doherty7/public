/**
 * IssgaUtil 공통 함수를 설정한다. 
 * 작성자 : ABC devTeam
 * 작성일 : 2018-10-10
 * 
---------------------------------------------------------------
gfn_isNull             : 입력값이  null 인지 체크한다
gfn_isEmpty            : 입력값이 스페이스 이외의 의미있는 값이 있는지 체크한다
gfn_containsChars      : 입력값이 특정 문자만으로 되어있는지 체크(특정문자를 허용하고 싶지 않을때 사용)
gfn_containsCharsOnly  : 입력값이 특정 문자만으로 되어있는지 체크(특정문자만을 허용하려 할때 사용)
gfn_isAlphabet         : 입력값이 알파벳인지 체크
gfn_isUpperCase        : 입력값이 알파벳 대문자인지 체크한다
gfn_isLowerCase        : 입력값이 알파벳 소문자인지 체크한다
gfn_isNumber           : 입력값이 숫자만 있는지 체크한다.
gfn_isAlphaNum         : 입려값이 알파벳, 숫자로 되어있는지 체크한다
gfn_isNumDash          : 입력값이 숫자, 대시"-" 로 되어있는지 체크
gfn_isNumComma         : 입력값이 숫자, 콤마',' 로 되어있는지 체크한다
gfn_isValidFormat      : 입력값이 사용자가 정의한 포맷 형식인지 체크(Reqular expression) 참고
gfn_isValidEmail       : 입력값이 이메일 형식인지 체크한다
gfn_isValidPhone       : 입력값이 전화번호 형식(숫자-숫자-숫자)인지 체크한다
gfn_getByteLength      : 입력값의 바이트 길이를 리턴한다.
gfn_removeComma        : 입력값에서 콤마를 없앤다
gfn_hasCheckedRadio    : 선택된 라디오버튼이 있는지 체크한다
gfn_hasCheckedBox      : 선택된 체크박스가 있는지 체크
gfn_htmlspecialcharsDecode : HTML 특수문자 DECODE
gfn_setTermCalendar    : 선택된 From ~ to 정합성 체크한다.
gfn_dateDiff           : 두개의 날짜를 비교하여 차이를 알려준다.(ex:2018-01-01)
gfn_toDay              : PC의 오늘날짜를 가져온다.
gfn_todayFormat        : PC의 오늘날짜를 yyyy-mm-dd- 와 같은 형식으로 가져온다.
gfn_left               : 문자열의 왼쪽부분을 지정한 길이만큼 Return 한다.      
gfn_right              : 문자열의 오른쪽부분을 지정한 길이만큼 Return 한다.      
gfn_getByteAsStr       : 문자열의 byte를 구한다.(한글2byte로 강제지정)
gfn_cutStrSoByte       : 문자열을 지정한 byte만큼 자른다.
gfn_numberWithCommas   : 콤마표시(화폐단위)

gfn_getNewDate         : 오늘기준으로 입력받은 숫자의 년월일을 문자열로 반환한다.
gfn_getOneDate         : 해당월의 첫날을 년월일 문자열로 반환한다.
gfn_getAddMonth        : 오늘기준으로 입력받은 숫자의 월차이를 년월 문자열로 반환한다.
gfn_getYearMonth       : 오늘기준으로 입력받은 날짜의 년월을 문자열로 반환한다.
gfn_getLastDay         : 오늘기준으로 입력받은 날짜의 마지막일를 문자열로 반환한다.
gfn_getDayOfMonth      : 입력받은 해당 년월의 일수를 반환다.
gfn_auto_date_format   :
gfn_getWBetDayList     : 입력받은 시작일 종료일 요일의 월일목록을 반환한다.
gfn_getBetWeekList     : 입력받은 시작일 종료일의 요일목록을 중복없이 반환한다.
--------------------------------------------------------------- 
 * 
 **/

/**
 * 입력값이  null 인지 체크한다
 */

function gfn_isNull(input){

       if (input.value == null || input.value == ""){

             return true;

       }else{

             return false;

       }

}

/**
 * 입력값이 스페이스 이외의 의미있는 값이 있는지 체크한다
 * if (isEmpty(form.keyword)){
 *       alert('값을 입력하여주세요');
 * }
 */

function gfn_isEmpty(input){

       if (input.value == null || input.value.replace(/ /gi,"") == ""){

             return true;

       }else{

             return false;

       }

}

/**

 * 입력값에 특정 문자가 있는지 체크하는 로직이며

 * 특정문자를 허용하고 싶지 않을때 사용할수도 있다

 * if (containsChars(form.name, "!,*&^%$#@~;")){

 *       alert("특수문자를 사용할수 없습니다");

 * }

 */

function gfn_containsChars(input, chars){

       for (var i=0; i < input.value.length; i++){

             if (chars.indexOf(input.value.charAt(i)) != -1){

                    return true;

             }

       }

       return false;

}

/**

 * 입력값이 특정 문자만으로 되어있는지 체크하며

 * 특정문자만을 허용하려 할때 사용한다.

 * if (containsChars(form.name, "ABO")){

 *    alert("혈액형 필드에는 A,B,O 문자만 사용할수 있습니다.");

 * }

 */

function gfn_containsCharsOnly(input, chars){

       for (var i=0; i < input.value.length; i++){

             if (chars.indexOf(input.value.charAt(i)) == -1){

                    return false;

             }

       }

       return true;

}

/**

 * 입력값이 알파벳인지 체크

 * 아래 isAlphabet() 부터 isNumComma()까지의 메소드가 자주 쓰이는 경우에는

 * var chars 변수를 global 변수로 선언하고 사용하도록 한다.

 * var uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

 * var lowercase = "abcdefghijklmnopqrstuvwxyz";

 * var number = "0123456789";

 * function isAlphaNum(input){

 *       var chars = uppercase + lowercase + number;

 *    return containsCharsOnly(input, chars);

 * }

 */

function gfn_isAlphabet(input){

       var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

       return gfn_containsCharsOnly(input, chars);

}

/**
 * 입력값이 알파벳 대문자인지 체크한다
 */

 function gfn_isUpperCase(input){

       var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

       return gfn_containsCharsOnly(input, chars);

 }

/**
 * 입력값이 알파벳 소문자인지 체크한다
 */

function gfn_isLowerCase(input){

       var chars = "abcdefghijklmnopqrstuvwxyz";

       return gfn_containsCharsOnly(input, chars);

}

/**
 * 입력값이 숫자만 있는지 체크한다.
 */

function gfn_isNumber(input){

       var chars = "0123456789";

       return gfn_containsCharsOnly(input, chars);

}

/**
 * 입려값이 알파벳, 숫자로 되어있는지 체크한다
 */

function gfn_isAlphaNum(input){

       var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

       return gfn_containsCharsOnly(input, chars);

}

/**

 * 입력값이 숫자, 대시"-" 로 되어있는지 체크한다

 * 전화번호나 우편번호, 계좌번호에 -  체크할때 유용하다

 */

function gfn_isNumDash(input){

       var chars = "-0123456789";

       return gfn_containsCharsOnly(input, chars);

}

/**
 * 입력값이 숫자, 콤마',' 로 되어있는지 체크한다
 */

function gfn_isNumComma(input){

       var chars = ",0123456789";

       return gfn_containsCharsOnly(input, chars);

}

/**
 * 입력값이 사용자가 정의한 포맷 형식인지 체크
 * 자세한 format 형식은 자바스크립트의 'reqular expression' 참고한다
 */

function gfn_isValidFormat(input, format){

	
	
	
	
       if (input.value.search(format) != -1){

             return true; // 올바른 포멧형식

       }     

       return false;

}

/**
 * 입력값이 이메일 형식인지 체크한다
 * if (!isValidEmail(email)){
 *       alert("올바른 이메일 주소가 아닙니다");
 * }
 */
function gfn_isValidEmail(inputVal){

	var format = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;

   	if(format.test(inputVal)){
		
   		return true;
	}
	
   	return false;
}

/**
 * 입력값이 전화번호 형식(숫자-숫자-숫자)인지 체크한다
 */

function gfn_isValidPhone(input){

       var format = /^(\d+)-(\d+)-(\d+)$/;

       return gfn_isValidFormat(input, format);

}

/**
 * 입력값의 바이트 길이를 리턴한다.
 * if (getByteLength(form.title) > 100){
 *    alert("제목은 한글 50자 (영문 100자) 이상 입력할수 없습니다");
 * }
 */

function gfn_getByteLength(input){

       var byteLength = 0;

       for (var inx = 0; inx < input.value.charAt(inx); inx++)     {

             var oneChar = escape(input.value.charAt(inx));

             if (oneChar.length == 1){

                    byteLength++;

             }else if (oneChar.indexOf("%u") != -1){

                    byteLength += 2;

             }else if (oneChar.indexOf("%") != -1){

                    byteLength += oneChar.length / 3;

             }

       }

       return byteLength;

}

/**
 * 입력값에서 콤마를 없앤다
 */

function gfn_removeComma(input){

       return input.value.replace(/,/gi,"");

}
/**
 * 입력값에서 특수문자를 없앤다
 */

function gfn_removeDash(input){
	var regExp = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi;
	
	return input.replace(regExp,"");
	
}

/**
 * 선택된 라디오버튼이 있는지 체크한다
 */

function gfn_hasCheckedRadio(input){

       if (input.length > 1){

             for (var inx = 0; inx < input.length; inx++){

                    if (input[inx].checked) return true;

             }

       }else{

             if (input.checked) return true;

       }

       return false;

}

/**
 * 선택된 체크박스가 있는지 체크
 */

function gfn_hasCheckedBox(input){

       return gfn_hasCheckedRadio(input);

}

/**
 * HTML 특수문자 DECODE
 */
function gfn_htmlspecialcharsDecode(text)
{
   var replacements = Array("&", "<", ">", '"', "'");
   var chars = Array("&amp;", "&lt;", "&gt;", "&quot;", "'");
   for (var i=0; i<chars.length; i++)
   {
       var re = new RegExp(chars[i], "gi");
       if(re.test(text))
       {
           text = text.replace(re, replacements[i]);
       }
   }
   return text;
}

/**
 * 달력 기간 범위 설정(from ~ to) 
 */
function gfn_setTermCalendar(bgnId, endId){
    $(bgnId).datepicker("option", "maxDate", $(endId).val());
    $(endId).datepicker("option", "minDate", $(bgnId).val());
    $(bgnId).datepicker("option", "onClose", function(selectedDate){console.log(selectedDate)
        $(endId).datepicker( "option", "minDate", selectedDate );
    });
    $(endId).datepicker("option", "onClose", function(selectedDate){
        $(bgnId).datepicker("option", "maxDate", selectedDate);
    });
}


//두개의 날짜를 비교하여 차이를 알려준다.
function gfn_dateDiff(_date1, _date2) {
    
	var diffDate_1 = _date1 instanceof Date ? _date1 : new Date(_date1.replace(/-/g,"/"));
    var diffDate_2 = _date2 instanceof Date ? _date2 : new Date(_date2.replace(/-/g,"/"));

    diffDate_1 = new Date(diffDate_1.getFullYear(), diffDate_1.getMonth(), diffDate_1.getDate());
    diffDate_2 = new Date(diffDate_2.getFullYear(), diffDate_2.getMonth(), diffDate_2.getDate());

    var diff = diffDate_2.getTime() - diffDate_1.getTime();
    diff = Math.ceil(diff / (1000 * 3600 * 24));

    return diff;
}


/* 해당 PC의 오늘 날짜를 가져온다.*/  
function gfn_toDay()                                           
{
	var strToday = "";                                           
	var objDate = new Date();                                    
	var strToday  = objDate.getFullYear() + "";                  
	strToday += gfn_right("0" + (objDate.getMonth() + 1), 2);    
	strToday += gfn_right("0" + objDate.getDate(), 2);           
 
	return strToday;                                             
}

/* 해당 pc 의 오늘 날짜를 yyyy-mm-dd 와 같은 형식으로 가져온다.*/
function gfn_todayFormat(){
    var strToday    = "";
    var date    = new Date(); 
    var year    = date.getFullYear(); 
    var month   = new String(date.getMonth()+1); 
    var day     = new String(date.getDate()); 
    
    strToday = year + "-" + (month>=10?month:"0"+month) + "-" + (day>=10?day:"0"+day);
    
    return strToday;
}

/*--------------------------------------------------------------------------------------------------
 * Desc      : 문자열의 왼쪽부분을 지정한 길이만큼 Return 한다.      
 * Argument  :  strString	오른부분을 얻어올 원본 문자열        
				nSize		얻어올 크기. [Default Value = 0]    
 * Return    :  rtnVal 	왼쪽 부분이 얻어진 문자열       
 *-------------------------------------------------------------------------------------------------*/                                                          
function gfn_left(strString, nSize)                            
{
	var rtnVal = "";                                             
    if(nSize > String(strString).length || nSize == null){                                                          
        rtnVal = strString;                                    
    }else{                                                   
        rtnVal = strString.substring(0, nSize);                
	}                                                            
    return rtnVal;                                             
}


/*--------------------------------------------------------------------------------------------------
 * Desc      : 문자열의 오른쪽부분을 지정한 길이만큼 Return 한다.      
 * Argument  :  strString	오른부분을 얻어올 원본 문자열  
				nSize 	얻어올 크기. [Default Value = 0]    
 * Return    :  rtnVal 	오른쪽 부분이 얻어진 문자열     
 *-------------------------------------------------------------------------------------------------*/                                                           
function gfn_right(strString, nSize)                           
{
    var nStart = String(strString).length;                     
    var nEnd = Number(nStart) - Number(nSize);                 
    var rtnVal = strString.substring(nStart, nEnd);            
 
    return rtnVal;                                             
}


/**
 * 문자열의 byte를 구한다.(한글2byte로 강제지정)
 */
function gfn_getByteAsStr(str){
	var result = 0;
	for(var i = 0; i < str.length; i++) {
	    if(escape(str.charAt(i)).length >= 4)
	        result += 2;
	    else if(escape(str.charAt(i)) == "%A7")
	    	result += 2;
	    else if(escape(str.charAt(i)) != "%0D")
	        result++;
	}
	return result;
}

/**
 * 문자열의 byte를 구한다.(한글3byte로 강제지정)
 */
function gfn_getByteAsStrOracle(str){
    var result = 0;
    for(var i = 0; i < str.length; i++) {
        if(escape(str.charAt(i)).length >= 4)
            result += 3;
        else if(escape(str.charAt(i)) == "%A7")
            result += 3;
        else if(escape(str.charAt(i)) != "%0D")
            result++;
    }
    return result;
}

/**
 * 문자열을 지정한 byte만큼 자른다.
 */
function gfn_cutStrSoByte(str, length){
	if (str == null || str.length == 0) {
        return "";
    }
    var size = 0;
    var rIndex = str.length;
    
    for ( var i = 0; i < str.length; i++) {
        size += gfn_getByteAsStr(str.charAt(i));
        if(size == length) {
            rIndex = i + 1;
            break;
        }else if(size > length){
            rIndex = i;
            break;
        }
    }
    return str.substring(0, rIndex);
}

/**
 * 콤마표시(화폐단위)
 */
function gfn_numberWithCommas(str) {
    return str.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


/*--------------------------------------------------------------------------------------------------
 * Desc      : 오늘날짜를 문자열로 반환한다. (YYYYMMDD)
 * Argument  : diff 값이 있으면 오늘날짜 기준으로 차이를 구한다.  
 *             예) gfn_getDate() : 금일, gfn_getDate(5) : 금일기준 5일이후, gfn_getDate(-5) : 금일기준 5일이전
 * Return    :  rtnVal  날짜문자열을 반환한다.
 *-------------------------------------------------------------------------------------------------*/
function gfn_getNewDate(diff,dash) {
    var today = "";
    var date  = new Date();
    // 차이값이 존재할경우
    if(diff != undefined) {
        // 스트링 형태이면 넘버로 치환
        if(diff != "F"){
            if(typeof diff == 'string'){
                diff = Number(diff);
                date.setDate(date.getDate() + diff);
            } else
            if(typeof diff == 'number'){
                date.setDate(date.getDate() + diff);
            } else
            if(typeof diff == 'boolean'){
                dash = diff;
            }
        }
    }
    
    // dash 값이 존재하면
    if(dash != undefined) {
        if(typeof dash == 'boolean'){
            dash = dash;
        } else {
            dash = false;
        }
    }
    
    var year  = date.getFullYear(); 
    var month = new String(date.getMonth()+1); 
    var day   = new String(date.getDate()); 
    
    if(diff == "F"){
        day = "1";
    }
    
    if(month.length == 1){
        month = "0" + month; 
    } 
    
    if(day.length == 1){
        day = "0" + day; 
    } 
    
    if(dash){
        today = year + "-" + month + "-" + day;
    } else {
        today = year + ""  + month + ""  + day;
    }
    return today;
}

function gfn_getOneDate(dash){
    return gfn_getNewDate('F',dash);
}

/*--------------------------------------------------------------------------------------------------
 * Desc      : 오늘날짜기준으로 해당월을 문자열로 반환한다. (YYYYMMDD)
 * Argument  : diff 값이 있으면 오늘날짜 기준으로 차이를 구한다.  
 *             예) gfn_getAddMonth() : 금일, gfn_getAddMonth(5) : 금일기준 5달이후, gfn_getAddMonth(-5) : 금일기준 5달이전
 * Return    :  rtnVal  날짜문자열을 반환한다.
 *-------------------------------------------------------------------------------------------------*/
function gfn_getAddMonth(diff,dash) {
    var today = "";
    var date  = new Date();
    var day   = new String(date.getDate()); 
    if(day.length == 1){
        day = "0" + day; 
    } 
    
    if(typeof diff == 'boolean'){
        dash = diff;
        if(dash){
            today = gfn_getYearMonth(0,dash) + "-" + day;
        } else {
            today = gfn_getYearMonth(diff,dash) + "" + day;
        }
    } else {
        if(dash){
            today = gfn_getYearMonth(diff,dash) + "-" + day;
        } else {
            today = gfn_getYearMonth(diff,dash) + "" + day;
        }
    }
    return today;
}

/*--------------------------------------------------------------------------------------------------
 * Desc      : 년월을 문자열로 반환한다. (YYYYMM)
 * Argument  : diff 값이 있으면 오늘날짜 기준으로 차이를 구한다.  
 *             예) gfn_getYearMonth() : 금일, gfn_getYearMonth(5) : 금일기준 5달이후, gfn_getYearMonth(-5) : 금일기준 5일이전
 * Return    :  rtnVal  날짜문자열을 반환한다.
 *-------------------------------------------------------------------------------------------------*/
function gfn_getYearMonth(diff,dash) {
    var ym   = "";
    var date = new Date();
    if(diff != undefined) {
        if(typeof diff != 'string' && typeof diff != 'boolean'){
            date.setMonth(date.getMonth() + diff);
        } else {
            if(typeof diff == 'boolean'){
                dash = diff;
            }
        }
    };
    var year  = date.getFullYear();
    var month = new String(date.getMonth() + 1); 
    
    // 한자리수일 경우 0을 채워준다. 
    if(month.length == 1){
        month = "0" + month; 
    } 
    
    if(dash){
        ym = year + "-" + month;
    } else {
        ym = year + "" + month;
    }
    return ym;
}

/*--------------------------------------------------------------------------------------------------
 * Desc      : 입력받은 문자열의 마지막일을 반환한다 반환한다. (YYYYMMDD)
 * Argument  : diff 값이 있으면 오늘날짜 기준으로 차이를 구한다.  
 *             예) gfn_getYearMonth() : 금일, gfn_getYearMonth(5) : 금일기준 5달이후, gfn_getYearMonth(-5) : 금일기준 5일이전
 * Return    :  rtnVal  날짜문자열을 반환한다.
 *-------------------------------------------------------------------------------------------------*/
function gfn_getLastDay(diff,dash){
    var date  = new Date();
    var year  = "";
    var month = "";
    var day   = "";
    var rtn   = "";
    if(diff != undefined) {
        
        if(typeof diff == 'boolean'){
            dash = diff;
            year  = date.getFullYear();
            month = new String(date.getMonth()+1);
            day   = new String(date.getDate());
        } else {
            var datePattern = /^(19|20)\d{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[0-1])$/;
            if(datePattern.test(diff)){
                if(typeof diff == 'string'){
                    year  = diff.substr(0, 4);
                    month = diff.substr(4, 2);
                    day   = diff.substr(6);
                } else
                if(typeof diff == 'number'){
                    diff = new String(diff);
                    year  = diff.substr(0, 4);
                    month = diff.substr(4, 2);
                    day   = diff.substr(6);
                }
            } else {
                alert("비교하려는 날짜 형식이 유효하지 않습니다.");
                return "";
            }
        }
    } else {
        year  = date.getFullYear();
        month = new String(date.getMonth()+1);
        day   = new String(date.getDate());
    }
    
    date  = new Date(year, month, 0);
    year  = date.getFullYear();
    month = new String(date.getMonth()+1);
    day   = new String(date.getDate());
    
    // 한자리수일 경우 0을 채워준다. 
    if(month.length == 1){
        month = "0" + month; 
    }
    if(day.length == 1){
        day = "0" + day; 
    }
    
    // dash 값이 존재하면
    if(dash != undefined) {
        if(typeof diff == 'boolean'){
            dash = dash;
        }
    } else {
        dash = false;
    }
    
    if(dash){
        rtn = year + "-" + month + "-" + day;
    } else {
        rtn = year + month + day;
    }
    
    return rtn;
}

/*--------------------------------------------------------------------------------------------------
 * Desc      : 입력받은 해당 년월의 일수를 반환다.
 * Argument  : year,month
 *             예) gfn_getDayOfMonth(2019,6)
 * Return    :  rtnVal  일수
 *-------------------------------------------------------------------------------------------------*/
function gfn_getDayOfMonth(year,month) {
    return 32 - new Date(year, month-1, 32).getDate();
}
/*--------------------------------------------------------------------------------------------------
 * Desc      : 날짜형식[YYYY-MM-DD] Auto Format 
 * Argument  : Input Tab의 this 객체변수 
 *             예) <input type="text" id="date01" onKeydown="gfn_auto_date_format(this);" maxlength="10" />
 * Return    : 이벤트 계속/취소여부
 *-------------------------------------------------------------------------------------------------*/
function gfn_auto_date_format( obj ){
    var num_arr = [ 
        96, 97, 98, 99, 100, 101, 102, 103, 104, 105,       // Num Lock
        48, 49, 50, 51, 52, 53, 54, 55, 56, 57              // 0~9
        ,189                                                // '-'
    ]
    var key_code = ( event.which ) ? event.which : event.keyCode;       // 브라우져 호환성
    window.title = key_code;
    if(key_code == 8) return true;
    
    if( num_arr.indexOf(  key_code  ) == -1 ){
        if(event.preventDefault){                           // IE 11 호환성(전용).
            event.preventDefault();
        } else {
            event.returnValue = false;
        }
    }else{
    	if(key_code != 189 ) {								// '-'
    	    var len = obj.value.length;
            if( len == 4 ) obj.value += "-";
            if( len == 7 ) obj.value += "-";
    	}
        return true;
    }
}

/*--------------------------------------------------------------------------------------------------
 * Desc      : 시작일 종료일 사이에 입력받은 요일의 월일 목록 반환
 * Argument  : pBDt:문자열 , pEDt:문자열 , pWeek:배열
 *             예) gfn_getWBetDayList('2019-07-01','2019-07-31', ['월','수']);
 * Return    : 입력받은 날짜와 요일의 해당 월일 목록을 반환한다.
 *-------------------------------------------------------------------------------------------------*/
function gfn_getWBetDayList(pBDt, pEDt, pWeek){
    // 결과값
    var listDate = new Array();
    
    if(IssgaUtil.isEmpty(pBDt))  return listDate;
    if(IssgaUtil.isEmpty(pEDt))  return listDate;
    if(IssgaUtil.isEmpty(pWeek)) return listDate;
    
    if(typeof pBDt  != "string" ) return listDate;
    if(typeof pEDt  != "string" ) return listDate;
    if(typeof pWeek != "object" ) return listDate;
    
    pBDt = (pBDt.length == 8 ? (pBDt.substr(0,4)+'-'+pBDt.substr(4,2)+'-'+pBDt.substr(6,2)) : pBDt); 
    pEDt = (pEDt.length == 8 ? (pEDt.substr(0,4)+'-'+pEDt.substr(4,2)+'-'+pEDt.substr(6,2)) : pEDt);
    
    var weekList = new Array("일","월","화","수","목","금","토");
    var dateMove = new Date(pBDt.replace(/-/g,"/"));
    var pSDt = pBDt; 
    if (pSDt == pEDt) {
        //var pSDt  = dateMove.toISOString().slice(0,10);
        //var pBDw  = weekList[new Date(pSDt).getDay()];
        //var rltDt = pSDt.replace(/-/g,'').substr(4);
        //listDate.push(rltDt);
        //listDate.push(rltDt + "("+pBDw+")");
        return listDate;
    } else {
        for(var i=0; i<pWeek.length; i++){
            while(pSDt < pEDt) {
                // console.log(pSDt , ' < ' , pEDt);
                var pSDt = dateMove.toISOString().slice(0, 10);     // 시작일 일자
                var pBDw = weekList[new Date(pSDt.replace(/-/g,"/")).getDay()];       // 시작일 요일
                if(!IssgaUtil.isEmpty(pBDw == pWeek[i])){
                    var rltDt = pSDt.replace(/-/g,'').substr(4);
                    listDate.push(rltDt);
                    // 테스트 확인용
                    // listDate.push(rltDt + "("+pBDw+")");
                }
                dateMove.setDate(dateMove.getDate() + 1);
            }
        pSDt = pBDt;
        dateMove = new Date(pBDt.replace(/-/g,"/"));
        }
    }
    return listDate;
}

/*--------------------------------------------------------------------------------------------------
 * Desc      : 시작일 종료일 사이에 지정된 요일 목록 반환
 * Argument  : 
 *             예) 
 * Return    : 입력받은 날짜의 해당 요일 목록을 반환한다.
 *-------------------------------------------------------------------------------------------------*/
function gfn_getBetWeekList(pBDt, pEDt, pRmk){
    // 결과값
    var listDate = new Array();
    
    if(IssgaUtil.isEmpty(pBDt))  return listDate;
    if(IssgaUtil.isEmpty(pEDt))  return listDate;
    if(IssgaUtil.isEmpty(pRmk))  return listDate;

    return listDate;
}
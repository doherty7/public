/**
 *	작성자	:	이상준
 *	작성일	:	2019.06.21
 *	Desc	:	kpf 공통 END 함수
 *	이 력		===================================================
 *
 */


//----------------------------------------------------------------------------------------------
//	엑셀 다운로드
setTimeout(function(){	gfnLoadingEnd();	gfnExcelDownloadObjMatch();	},	1000);
setTimeout(function(){	gfnLoadingEnd();	gfnExcelDownloadObjMatch();	},	2000);
setTimeout(function(){	gfnLoadingEnd();	gfnExcelDownloadObjMatch(); },	3000);

//--**	Excel Download match
function gfnExcelDownloadObjMatch(){

	try{ grid.gridRoot.excelExportSave  = function(a,b){ 	gfnExcelDownloadV02_01(); 	}	} catch(e){};
	try{ grid1.gridRoot.excelExportSave = function(a,b){	gfnExcelDownloadV02_02();	}	} catch(e){};
	try{ grid2.gridRoot.excelExportSave = function(a,b){	gfnExcelDownloadV02_03();	}	} catch(e){};
	try{ grid3.gridRoot.excelExportSave = function(a,b){	gfnExcelDownloadV02_04();	}	} catch(e){};

}

//--**	Excel Download 룰 위해 공용으로 개발
function gfnExcelDownloadV02_01(){
	gfnExcelDownloadV02(grid);
}
function gfnExcelDownloadV02_02(){
	gfnExcelDownloadV02(grid1);
}
function gfnExcelDownloadV02_03(){
	gfnExcelDownloadV02(grid2);
}
function gfnExcelDownloadV02_04(){
	gfnExcelDownloadV02(grid3);
}
function gfnExcelDownloadV02_05(){
	gfnExcelDownloadV02(grid_hidden);
}

//--**	Excel Download 룰 위해 공용으로 개발
function gfnExcelDownloadV02(pooo){

	//--**	loading
	gfnLoadingStart(2);

	//--**	form 선언
	var f = $hD("#excelDownloadForm");

	//--**	input hidden 삭제
	var doo = $hA("input[type=hidden]", f);
	for (var x=doo.length-1; x > -1; x-=1){
		$U.remove(doo[x]);
	}

	//--**	input hidden 생성
	var coo = $hD("#"+pooo.formId).serialize()+"&url=&columns=&filenm=";

	//--**	checkbox 인경우 처리
	var allobj 	= 	$hA("input[type=checkbox]", $hD("#"+pooo.formId));
	var sname	=	"";
	for (var i=0,ooo; ooo=allobj[i]; i+=1){
		if ((sname+",").indexOf(ooo.name+",") > -1) continue;
		sname += (sname === "" ? "" : ",") + ooo.name;
	}

	var strparam 	= 	"";
	var strval		=	"";
	var arrname 	= 	sname.split(",");
	var jgs			=	"";

	for (var i=0,ooo; ooo=arrname[i]; i+=1){
		var xoo 	= 	$hA("input[name="+ooo+"]", $hD("#"+pooo.formId));
		strval		=	""
		for (var q=0,wooo; wooo=xoo[q]; q+=1){
			if (wooo.checked === true){
				strval	+=	(strval === "" ? "" : "|" ) +	wooo.value;
			}
		}
		jgs	=	new RegExp(ooo,"g");
		coo	=	coo.replace(jgs,ooo+"xxx");
		strparam	+=	"&" + ooo + "=" + strval;
	}
	coo	+=	strparam;

	var soo = coo.split("&");
	for (var i=0,oooo; oooo=soo[i]; i+=1){
		var ssoo	=	oooo.split("=");
		var cobj 	= 	document.createElement("input");
		cobj.type	=	"hidden";
		cobj.name	=	ssoo[0];
		cobj.value	=	ssoo[1];
		f.appendChild(cobj);
	}
	$hD("input[name=url]",f).value 		= 	pooo.url;
	$hD("input[name=columns]",f).value 	= 	pooo.columns;
	$hD("input[name=filenm]",f).value	=	pooo.dataGrid.exportFileName;

	f.target	=	"excelDownloadFrame";
	f.action	=	"/v02/cm/excel/download.do";
	f.submit();

}
//----------------------------------------------------------------------------------------------

//----------------------------------------------------------------------------------------------
//	Start
$(document).ready(function(){
	gfnCssMaking();
});
//----------------------------------------------------------------------------------------------

//----------------------------------------------------------------------------------------------
//	구 화면 버튼등 강제 처리

var btn_temp	=	"<div class=\"{1}\">"
				+	"	<a href=\"#\" onclick=\"{0}\" class=\"btn_basic\" id=\"btn_search_lsj01\">검색</a>"
				+	"	<a href=\"#\" onclick=\"gfnSearchboxClear();\" class=\"btn_line\" id=\"btn_reset_lsj01\">초기화</a>"
				+	"</div>";

var targetObj	=	null;
//--**	조회버튼 생성
function gfnCssMaking(){
	$U.each($hA(".searchBox img"), function(ooo){

		if (ooo.src.indexOf("searchBtn.png") > -1){

			//--**	btn_area 가 있는경우 skip
			if (!$U.isNull($hD(".btn_area"))){
				return;
			}

			if (!$U.isNull($hD(".btn_area2"))){
				return;
			}

			ooo.parentElement.style.display	=	"none";
			var f 	=	$U.get(ooo.parentElement,"onclick");

			//--**	.searchBox 하단에 insert
			if (!$U.isNull($hD(".borderSearchBox"))){
				var h	=	$U.format(btn_temp,f,"btn_area");
				$hD(".borderSearchBox").insertAdjacentHTML("afterend", h);
				$hD(".borderSearchBox").style.marginBottom	=	"15px";
				targetObj	=	$hD(".borderSearchBox");
				return;
			}

			if (!$U.isNull($hD(".BOSearchBoxDetail"))){
				var h	=	$U.format(btn_temp,f,"btn_area2");
				$hD(".BOSearchBoxDetail").insertAdjacentHTML("afterend", h);
				$hD(".BOSearchBoxDetail").style.marginBottom	=	"15px";
				targetObj	=	$hD(".BOSearchBoxDetail");
				return;
			}

			if (!$U.isNull($hD(".borderSearchBoxDetail"))){
				var h	=	$U.format(btn_temp,f,"btn_area2");
				$hD(".borderSearchBoxDetail").insertAdjacentHTML("afterend", h);
				$hD(".borderSearchBoxDetail").style.marginBottom	=	"15px";
				targetObj	=	$hD(".borderSearchBoxDetail");
				return;
			}


		}

	});


	//--**	목록 버툰 처리
	/*
	$U.each($hA(".btn"), function(ooo){
		if (ooo.innerHTML === "목록" || ooo.innerHTML === "취소"){
			ooo.className	=	"btn_line";
		}
	});
	*/

}

//--**	검색영역 내 clear
function gfnSearchboxClear(tooo){
	var obj 	=	$U.isNull(tooo) ? $hA("*", targetObj) : $hA("*", $hD("."+tooo)) ;
	for (var i=0,ooo;ooo=obj[i];i+=1){

		if (ooo.tagName === "INPUT"){
			switch($U.get(ooo,"type")){
			case "password" :
			case "hidden" :
			case "text" :
				ooo.value	=	"";
				break;

			case "checkbox" :
			case "radio" :
				$hA("input[name="+ooo.name+"]")[0].checked	=	true;
				break;

			case "select" :
				$hA("input[name="+ooo.name+"] option")[0].selected	=	true;
				break;
			}

		}

		if (ooo.tagName === "SELECT"){
			$hA("select[name="+ooo.name+"] option")[0].selected	=	true;
		}

		if (ooo.tagName === "TEXTAREA"){
			ooo.value	=	"";
		}
	}

}


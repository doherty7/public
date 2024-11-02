/**
 *	작성자	:	이상준
 *	작성일	:	2019.05.02
 *	Desc	:	kpf 공통 함수 총괄
 *	이 력		===================================================
 *
 */

var _DEXTUPLOAD_ID	=	[];

function XyGetCurrentDateTime(div){
	var today = new Date(),dd,mm,yyyy,hh,mi,ss;
	try{
		yyyy	= 	today.getFullYear();
		mm 		= 	today.getMonth()+1; //January is 0!
		dd 		= 	today.getDate();

		dd		= 	(dd<10 ? '0' : "") + dd;
		mm		=	(mm<10 ? '0' : "") + mm;

		hh 		= 	today.getHours();
		mi 		= 	today.getMinutes();
		ss 		= 	today.getSeconds();

		hh		= 	(hh<10 ? '0' : "") + hh;
		mi		=	(mi<10 ? '0' : "") + mi;
		ss		=	(ss<10 ? '0' : "") + ss;

		return yyyy + div + mm + div + dd + " " + hh + ":" + mi + ":"+ ss ;
	} catch(e){
		alert("[yGetCurrentDateTime]"+e);
	} finally{
		today 	= 	null;
		dd		=	null;
		mm		=	null;
		yyyy	=	null;
	}
}

//----------------------------------------------------------------------------------------------
//	include
var t = XyGetCurrentDateTime("-").replace(" ","_");

document.writeln("<script type=\"text/javascript\" src=\""+_GLOVAL_HOME_XXX+"/IMS02/custom/IMS_Config.js?ver="+t+"\"></script>");
document.writeln("<script type=\"text/javascript\" src=\""+_GLOVAL_HOME_XXX+"/IMS02/module/js/json3.js?ver="+t+"\"></script>");  
document.writeln("<script type=\"text/javascript\" src=\""+_GLOVAL_HOME_XXX+"/IMS02/module/js/IMS_Z_Selector.js?ver="+t+"\"></script>");  
document.writeln("<script type=\"text/javascript\" src=\""+_GLOVAL_HOME_XXX+"/IMS02/module/js/IMS_Z_Common.js?ver="+t+"\"></script>");  
document.writeln("<script type=\"text/javascript\" src=\""+_GLOVAL_HOME_XXX+"/IMS02/module/js/IMS_$U.js?ver="+t+"\"></script>");  
document.writeln("<script type=\"text/javascript\" src=\""+_GLOVAL_HOME_XXX+"/IMS02/module/js/IMS_$G.js?ver="+t+"\"></script>");  
document.writeln("<script type=\"text/javascript\" src=\""+_GLOVAL_HOME_XXX+"/IMS02/module/js/IMS_Z_Loading.js?ver="+t+"\"></script>");  
document.writeln("<script type=\"text/javascript\" src=\""+_GLOVAL_HOME_XXX+"/IMS02/module/js/IMS_Z_Alert.js?ver="+t+"\"></script>");  
document.writeln("<script type=\"text/javascript\" src=\""+_GLOVAL_HOME_XXX+"/IMS02/module/js/IMS_Z_Common.js?ver="+t+"\"></script>"); 
document.writeln("<script type=\"text/javascript\" src=\""+_GLOVAL_HOME_XXX+"/IMS02/module/js/IMS_Z_Cookie.js?ver="+t+"\"></script>");  
document.writeln("<script type=\"text/javascript\" src=\""+_GLOVAL_HOME_XXX+"/IMS02/module/js/IMS_Z_DragDrop.js?ver="+t+"\"></script>");  
document.writeln("<script type=\"text/javascript\" src=\""+_GLOVAL_HOME_XXX+"/IMS02/module/js/IMS_$A.js?ver="+t+"\"></script>");  
document.writeln("<script type=\"text/javascript\" src=\""+_GLOVAL_HOME_XXX+"/IMS02/module/js/IMS_$P.js?ver="+t+"\"></script>");  
document.writeln("<script type=\"text/javascript\" src=\""+_GLOVAL_HOME_XXX+"/IMS02/module/js/IMS_$H.js?ver="+t+"\"></script>");  
document.writeln("<script type=\"text/javascript\" src=\""+_GLOVAL_HOME_XXX+"/IMS02/module/js/IMS_$V.js?ver="+t+"\"></script>");  
document.writeln("<script type=\"text/javascript\" src=\""+_GLOVAL_HOME_XXX+"/IMS02/module/js/IMS_Z_EventBinding.js?ver="+t+"\"></script>"); 
document.writeln("<script type=\"text/javascript\" src=\""+_GLOVAL_HOME_XXX+"/IMS02/module/js/IMS_Z_Prototype.js?ver="+t+"\"></script>"); 
document.writeln("<script type=\"text/javascript\" src=\""+_GLOVAL_HOME_XXX+"/IMS02/module/html/font-awesome/5.5.0/js/all.js?ver="+t+"\"></script>");
document.writeln("<script type=\"text/javascript\" src=\""+_GLOVAL_HOME_XXX+"/IMS02/module/component/file/F2/IMS_F2.js?ver="+t+"\"></script>"); 
document.writeln("<script type=\"text/javascript\" src=\""+_GLOVAL_HOME_XXX+"/IMS02/module/component/calendar/calendar.js?ver="+t+"\"></script>"); 
document.writeln("<script type=\"text/javascript\" src=\""+_GLOVAL_HOME_XXX+"/IMS02/module/component/grid/G2/IMS_G2.js?ver="+t+"\"></script>");  

//----------------------------------------------------------------------------------------------

//----------------------------------------------------------------------------------------------
//	Loading

//--**	Loading start
function gfnLoadingStart(opt){
	$hD(".box_loading").style.display = "block";
	_EXCEL_ONLOAD_CHECK	=	false;
	setTimeout(function(){
		gfnLoadingEnd(opt);
	},1500);
}

var_EXCEL_ONLOAD_CHECK	=	false;
//--**	Loading end
function gfnLoadingEnd(opt){
	
	if (opt === 2){
		$A.call({url:"/v02/cm/excel/check.ajax"},function(d){
			//$hD(".box_loading span").innerHTML = d;
			console.log(d);
			if (d.indexOf("[END]") > -1){
				$hD(".box_loading").style.display = "none";
				_EXCEL_ONLOAD_CHECK	=	false;
				//$hD(".box_loading span").innerHTML	=	"";
			
			} else if (d.indexOf("[ERROR]") > -1){
				$hD(".box_loading").style.display = "none";
				_EXCEL_ONLOAD_CHECK	=	false;
				//$hD(".box_loading span").innerHTML	=	"";
			
			} else {
				
				setTimeout(function(){
					gfnLoadingEnd(opt);
				},100);
				
			}
			
		},function(e){
			$hD(".box_loading").style.display = "none";
			_EXCEL_ONLOAD_CHECK	=	false;
			alert(e);
			//$hD(".box_loading span").innerHTML	=	"";
			return false;
		})
		
	} else {
		
		if (	document.readyState === "complete"	){
				$hD(".box_loading").style.display = "none";
				_EXCEL_ONLOAD_CHECK	=	false;
				return;
			}
		
		/*if (	!$U.isNull($hD("#excelDownloadFrame")) 
				&& 	!$U.isNull($hD("#excelDownloadFrame").contentWindow.document) 
				&& 	$hD("#excelDownloadFrame").contentWindow.document.readyState === "complete"){
				$hD(".box_loading").style.display = "none";
				_EXCEL_ONLOAD_CHECK	=	false;
				return;
			}
		*/
		setTimeout(function(){
			gfnLoadingEnd(opt);
		},1000);
	}
	
	
	
}

function gfnExcelIframeCheck(){
	_EXCEL_ONLOAD_CHECK	=	true;	
}

//----------------------------------------------------------------------------------------------

//----------------------------------------------------------------------------------------------
//	Start
$(document).ready(function(){
	gfnPreloadElement();

});
//----------------------------------------------------------------------------------------------

//----------------------------------------------------------------------------------------------
//	Preload
function gfnPreloadElement(){
    setTimeout(function(){

    	$(".datePicker").keyup(function(event){
            var regexp = /[^0-9:\-]/gi;
            v = $(this).val();
            if( regexp.test(v) ) {
                alert("숫자만 입력하세요.");
                $(this).val(v.replace(regexp,''));
            }
        });

        $('.numberOnly').keyup(function(){
            var regexp = /[^0-9:\-]/gi;
            var value = $(this).val();
            if( regexp.test(value) ) {
                $(this).val(value.replace(regexp, ''));
            }
        });

    },100);

}
//----------------------------------------------------------------------------------------------

//----------------------------------------------------------------------------------------------
//	item click decoration
function gfnGridItemClickDecoration(item, value, column){
	return '<a class="gridLink" href="#none">' + value + '</a>';
}
//----------------------------------------------------------------------------------------------

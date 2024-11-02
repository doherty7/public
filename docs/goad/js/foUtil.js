var FoUtil = {
		
		/** 매체가 수정가능 상태인가? */
		isEnableMediaProcces : function(status){
			var enableMediaProccesList = ["M00"];
			if($.inArray(status, enableMediaProccesList) > -1){
				return true;
			}else{
				return false;
			}
		},
		
		/** 입력한 광고유형코드가 매체유형에 속해있는가? */
		isMediaOfType : function(adTypeDev){
			var mediaCodeList = ["ISS031101", "ISS031102", "ISS031103", "ISS031104", "ISS031105", "ISS031106"];
			if($.inArray(adTypeDev, mediaCodeList) > -1){
				return true;
			}else{
				return false;
			}
		},
		
		/** 의뢰 이력 팝업 호출 */
		openAdHistoryPop : function(){
		    var param = {adRqstNo:$("#adHistoryFrm").find("#adRqstNo").val()};
		    IssgaUtil.popup("adHistoryFrm", "의뢰 히스토리", "/popup/ad/adHistoryPopup.do", "940", "700", param);
		},

		/** 오즈 레포트 팝업 호출 */
		openOzPrint : function(){ //오즈리포트 팝업호출(광고의뢰서)
			if($("#ozPopForm").find("#sealYn").val() == "N"){
				alert("직인이 포함되어 있지 않은 정부광고 요청서 파일입니다.");
			}
		    var params = {
		            ozrName: "/advertisingRequest.ozr", //ozr 파일명
		            odiName: "advertisingRequest", //ozr 파일명
		            //ozrParam: "${param.adRqstNo }"         //odi 파라미터값
		    };
		    objPopId = IssgaUtil.popup("ozPopForm", "광고의뢰서", "/cm/comm/ozView.do", 900, 1000, params);
		}
}
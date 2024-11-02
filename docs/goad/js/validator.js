var Validator = {
	run : function(op){
		this.op = op || {};
		this.op.scope = op.scope || "";
		this.op.rules = op.rules || "";

		var target;
		var title = "title";
		
		if(this.op.scope){
			target = $(this.op.scope);
		}else{
			target = $(document);
		}
		
		for(key in this.op.rules){
			var element = $(target).find("[name=" + key + "]");
			
			var rule = this.op.rules[key];
			for(r in rule){
				if(r == title){continue; }
				
				var nodeName = element[0].nodeName.toUpperCase();
				var type = element[0].type.toUpperCase();
				var tag = "";
				if(nodeName == "INPUT"){
					tag = type;
				}else{
					tag = nodeName;
				}
				
				if(r == "isRequired"){
					if(!this.rules[r][tag](element, rule[r])){
						alert(this.message[r][tag](this.op.rules[key][title], rule[r]))
						element.focus();
						return false;
					}
				}else{
					if(!this.rules[r](element, rule[r])){
						alert(this.message[r](this.op.rules[key][title], rule[r]))
						element.focus();
						return false;
					}
				}
			}
		}
		return true;
	},
	rules : {
		isRequired : {
			"TEXT" : function(e, v){
				if(!v){return true; }
				if($(e).val() == null || $(e).val().trim() == ""){
					return false;
				}else{
					return true;
				}
			},
			"RADIO" : function(e, v){
				if(!v){return true; }
				
				if($(e).filter(":checked").val() == null || $(e).filter(":checked").val() == ""){
					return false;
				}else{
					return true;
				}
			},
			"SELECT" : function(e, v){
				if(!v){return true; }
				
				if($(e).find("option:selected").val() == null || $(e).find("option:selected").val() == ""){
					return false;
				}else{
					return true;
				}
			},
			"CHECKBOX" : function(e, v){
				if(!v){return true; }
				
				if($(e).filter(":checked").length <= 0){
					return false;
				}else{
					return true;
				}
			},
			"TEXTAREA" : function(e, v){
				if(!v){return true; }
				if($(e).val() == null || $(e).val().trim() == ""){
					return false;
				}else{
					return true;
				}
			},
			"HIDDEN" : function(e, v){
				if(!v){return true; }
				if($(e).val() == null || $(e).val().trim() == ""){
					return false;
				}else{
					return true;
				}
			},
			"PASSWORD" : function(e, v){
				if(!v){return true; }
				if($(e).val() == null || $(e).val().trim() == ""){
					return false;
				}else{
					return true;
				}
			},
		},
		minLength : function(e, v){
			if($(e).val().length < v){ return false;
			}else{ return true;	}
		},
		maxLength : function(e, v){
			if($(e).val().length > v){ return false;
			}else{ return true;	}
		},
		minByte : function(e, v){
			var bt = gfn_getByteAsStr($(e).val());
			if(parseInt(bt) < parseInt(v)) return false;
			else return true;
		},
		maxByte : function(e, v){
			var bt = gfn_getByteAsStr($(e).val());
			if(parseInt(bt) > parseInt(v)) return false;
			else return true;
		},
		minValue : function(e, v){
			if(!v){return true; }
			if( $(e).val() == "" ) return true;	// 없으면 통과
			if( $(e).val() >= v ) return true;
			else return false;
		},
		maxValue : function(e, v){
			if(!v){return true; }
			if( $(e).val() == "" ) return true;	// 없으면 통과
			if( $(e).val() <= v ) return true;
			else return false;
		},
		
		
		/*************************** TO DO .. 1. 대수문자 구분 => 삭제예정 .. Start *********************************/
		minlength : function(e, v){
			if($(e).val().length < v){ return false;
			}else{ return true;	}
		},
		maxlength : function(e, v){
			if($(e).val().replace(/,/g,'').length > v){ return false;
			}else{ return true;	}
		},
		minbyte : function(e, v){
			var bt = gfn_getByteAsStr($(e).val());
			if(parseInt(bt) < parseInt(v)) return false;
			else return true;
		},
		maxbyte : function(e, v){
			var bt = gfn_getByteAsStr($(e).val());
			if(parseInt(bt) > parseInt(v)) return false;
			else return true;
		},
		minvalue : function(e, v){
			if(!v){return true; }
			if( $(e).val() == "" ) return true;	// 없으면 통과
			if( $(e).val() >= v ) return true;
			else return false;
		},
		maxvalue : function(e, v){
			if(!v){return true; }
			if( $(e).val() == "" ) return true;	// 없으면 통과
			if( $(e).val() <= v ) return true;
			else return false;
		},
		/*************************** TO DO .. 1. 대수문자 구분 => 삭제예정 .. End *********************************/
		
		isNumeric : function(e, v){
			if(!v){return true; }
			if( $(e).val() == "" ) return true;	// 없으면 통과 ++++++++++++++++++++++++++++++++++++++
			if(isNaN($(e).val().replace(/,/g,''))){
				return false;
			}else{
				return true;
			}
		},
		isDate : function(e, v){
			if(!v){return true; }
			if( $(e).val() == "" ) return true;	// 없으면 통과
			return (/^(19|20)\d{2}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[0-1])$/).test($(e).val());
		},
		isEmail : function(e, v){
			if(!v){return true; }
			if( $(e).val() == "" ) return true;	// 없으면 통과
			return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test($(e).val());

		},
		isTelNo  : function(e, v){
			if(!v){return true; }
			if( $(e).val() == "" ) return true;	// 없으면 통과
			// return /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/.test($(e).val());	// +XX XXXX XXXX 
			return /^\(?([0-9]{2,3})\)?[-. ]?([0-9]{3,4})[-. ]?([0-9]{4})$/.test($(e).val());	// XXX XXX XXXX 
		},
		isPwd : function(e, v){
			if(!v){return true; }
			if( $(e).val() == "" ) return true;	// 없으면 통과
			return /^(?=.*[0-9])(?=.*[!@#$%^&*_])[a-zA-Z0-9!@#$%^&*_]{8,30}$/.test($(e).val());  // 영문&숫자&특수문자(!@#$%^&*_) 3가지 혼합, 8~30자
		},
		isUrl : function(e, v){
			if(!v){return true; }
			if( $(e).val() == "" ) return true;	// 없으면 통과
			return /^(((http(s?))\:\/\/)?)([0-9a-zA-Z\-]+\.)+[a-zA-Z]{2,6}(\:[0-9]+)?(\/\S*)?/.test($(e).val());
		},
		isBnk : function(e, v){
			// 전화번호 + 계좌번호 형식
			if(!v){return true; }
			if( $(e).val() == "" ) return true;	// 없으면 통과
			//return /^\(?([0-9]{2,6})\)?[-. ]?([0-9]{2,6})[-. ]?([0-9]{2,6})[-. ]?([0-9]{2,6})$/.test($(e).val());
			//return /^(([0-9]{2,6})[-. ])?([0-9]{2,6})[-. ]([0-9]{2,6})[-. ](([0-9]{1,6})[-. ]?)$/.test($(e).val());
			return /^(([0-9]{2,6})[-. ])?([0-9]{2,6})[-. ]([0-9]{2,6})[-. ](([0-9]{1,6}))$/.test($(e).val());
		},
		isCard : function(e, v){	
			// 카드번호 : 0000-0000-0000-0000
			if(!v){return true; }
			if( $(e).val() == "" ) return true;	// 없으면 통과
			return /^([0-9]{4})[-.]([0-9]{4})[-.]([0-9]{4})[-.]([0-9]{4})$/.test($(e).val());
		},
		isCorpNo : function(e, v){
			// 사업자등록번호 : 000-00-00000
			if(!v){return true; }
			if( $(e).val() == "" ) return true;	// 없으면 통과
			return /^([0-9]{3})[-.]([0-9]{2})[-.]([0-9]{6})$/.test($(e).val());
		},
		isCorpBodyNo : function(e, v){	
			// 법인등록번호 000000-0000000
			if(!v){return true; }
			if( $(e).val() == "" ) return true;	// 없으면 통과
			return /^([0-9]{6})[-. ]([0-9]{7})$/.test($(e).val());
		},
		isJumin : function(e, v){	
			// 주민등록번호  000000-[1|2|3|4|5|6|7|8]000000
			if(!v){return true; }
			if( $(e).val() == "" ) return true;	// 없으면 통과
			return /^([0-9]{6})[-. ][1|2|3|4|5|6|7|8]([0-9]{6})$/.test($(e).val());
			//return /^([0-9]{6})[-. ]([0-9]{7})$/.test($(e).val());
		},
		
		
	}
	, message : {
		isRequired : {
			"TEXT" : function(t, v){
				return t + "은(는) 필수 입력 항목입니다.";
			},
			"RADIO" : function(t, v){
				return t + "은(는) 필수 선택 항목입니다.";
			},
			"SELECT" : function(t, v){
				return t + "은(는) 필수 선택 항목입니다.";
			},
			"CHECKBOX" : function(t, v){
				return t + "은(는) 필수 선택 항목입니다.";
			},
			"TEXTAREA" : function(t, v){
				return t + "은(는) 필수 입력 항목입니다.";
			},
			"HIDDEN" : function(t, v){
				return t + "은(는) 필수 입력 항목입니다.";
			},
			"PASSWORD" : function(t, v){
				return t + "은(는) 필수 입력 항목입니다.";
			},
		},
		minLength : function(t, v){
			return t + "은(는) 최소 " + v + "자 이상 입력 해야합니다.";
		},
		maxLength : function(t, v){
			return t + "은(는) 최대 " + v + "자까지 입력 가능합니다.";
		},
		minByte : function(t, v){
			return t + "은(는) 최소 " + v + "Byte 이상 입력 해야합니다.";
		},
		maxByte : function(t, v){
			return t + "은(는) 최대 " + v + "Byte까지 입력 가능합니다.";
		},
		minValue : function(t, v){
			return t + "을(를) 확인해 주세요.";
		},
		maxValue : function(t, v){
			return t + "을(를) 확인해 주세요.";
		},
		
		/*************************** TO DO .. 1. 대수문자 구분 => 삭제예정 .. Start *********************************/
		minlength : function(t, v){
			return t + "은(는) 최소 " + v + "자 이상 입력 해야합니다.";
		},
		maxlength : function(t, v){
			return t + "은(는) 최대 " + v + "자까지 입력 가능합니다.";
		},
		minbyte : function(t, v){
			return t + "은(는) 최소 " + v + "Byte 이상 입력 해야합니다.";
		},
		maxbyte : function(t, v){
			return t + "은(는) 최대 " + v + "Byte까지 입력 가능합니다.";
		},
		minvalue : function(t, v){
			return t + "을(를) 확인해 주세요.";
		},
		maxvalue : function(t, v){
			return t + "을(를) 확인해 주세요.";
		},
		/*************************** TO DO .. 1. 대수문자 구분 => 삭제예정 .. End *********************************/
		
		
		isNumeric : function(t, v){
			return t + "은(는) 숫자만 입력 가능합니다.";
		},
		isDate : function(t, v){
			return t + "은(는) [YYYY-MM-DD]형식으로 입력 가능합니다.";
		},
		isEmail : function(t, v){
			return t + " 형식이 올바르지 않습니다.";
		},
		isTelNo : function(t, v){
			return t + " 형식이 올바르지 않습니다.";
		},
		isPwd : function(t, v){
			return t + "는 영문&숫자&특수문자(!@#$%^&*_) 3가지 혼합, 8~30자까지 허용 됩니다.";
		},
		isUrl : function(t, v){
			return t + "은(는) 올바른 형식이 아님니다.";
		},
		isBnk : function(t, v){
			return t + "은(는) 올바른 형식이 아님니다.";
		},
		isCard : function(t, v){
			return t + "은(는) 올바른 형식이 아님니다.";
		},
		isCorpNo : function(t, v){
			return t + "은(는) 올바른 형식이 아님니다.";
		},
		isCorpBodyNo : function(t, v){
			return t + "은(는) 올바른 형식이 아님니다.";
		},
		isJumin : function(t, v){
			return t + "은(는) 올바른 형식이 아님니다.";
		},
	}
};
/*=================================================================================
 *	파 일 명	: IMS_$V.js
 *	작성목적	: validate  
 *	작 성 자	: 이상준
 *	Description	
 *				기본적으로 form 정보의 인자중 커스텀 태그를 사용하여 검증
 *				인자	:	form
 *				태그	:	validate	
 *							check 	-> 	검증 여부 true인경우에만 검증 ( 사용안함 )
 *							type	->	notnull, max, min, number, calendar, notnumber 등으로 사용 , 로 멀티 처리
 *							length 	->	max, min 시    		
 *						
 *	수정내역	:
=================================================================================*/


var $V = {
		//--**	validate 수행
		validate	:	
			function(ooo){
				var t,v,vv,tp,oform,otype,regExp;
				
				try{
					
					oform = typeof(ooo) === "string" ? $hD("form[name="+ooo+"]") : ooo;
					
					//--**	검증
					if ($U.isNull(oform)){
						alert("검증 대상이 NULL입니다.\r\n검증대상을 확인하세요");
						return;
					}
					
					//--**	validate 태그가 있는 경우 validate 수행
					t	=	$hA("*",oform);
					for (var i=0,o; o=t[i]; i+=1){
						
						//--**	검증여부 확인
						if ($U.isNull($U.get(o,"validate"))) continue;
						vv	=	$U.get(o,"validate");
						vv	=	vv.replace(/{/g,"{\"").replace(/:/g,"\":\"").replace(/,/g,"\",\"").replace(/}/g,"\"}");
						vv	=	JSON.parse(vv);
						
						//--**	타입별로 값을 가져온다
						tp = $U.get(o,"type");
						switch(o.tagName){
						case "INPUT"  :
							if (tp === "text"){				v	=	o.value;
							} else if (tp === "hidden"){	v	=	o.value;
							} else if (tp === "password"){	v	=	o.value;
							} else if (tp === "tel"){		v	=	o.value;
							} else if (tp === "email"){		v	=	o.value;
							} else if (tp === "number"){	v	=	o.value;
							} else if (tp === "date"){		v	=	o.value;
							} else if (tp === "checkbox"){	v	=	o.checked ? o.value : "";
							} else if (tp === "radio"){		v	=	o.checked ? o.value : "";
							}
							break;
						case "TEXTAREA"  :
							v	=	o.value;
							break;
						case "SELECT"  :
							v	=	o.options[o.selectedIndex].value;
							break;
						}
						
						//--**	validate 분석
						otype = vv.type.toLowerCase().split(",");
						for (var aaa=0,tooo; tooo=otype[aaa]; aaa+=1){
							switch(tooo){
							case "notnull"	:	//	null 여부 검증	
								if ($U.isNullOrEmpty(v)){
									alert("해당 값이 널이거나 빈값일수 없습니다");
									o.focus();
									try{ o.select(); } catch(e){};
									return false;
								}
								break;
							case "max"	:	//	최대값
								if (vv.length > v.length){
									alert("해당 값은 최대값이  "+vv.length+" 입니다");
									o.focus();
									try{ o.select(); } catch(e){};
									return false;
								}
								break;
							case "min"	:	//	최소값
								if (vv.length < v.length){
									alert("해당 값은 최소값이  "+vv.length+" 입니다");
									o.focus();
									try{ o.select(); } catch(e){};
									return false;
								}
								break;
							case "number"	:	//	숫자
								regExp	=	/^[0-9]+$/;
								if (!regExp.test(v)){
									alert("해당 값은 숫자여야 합니다");
									o.focus();
									try{ o.select(); } catch(e){};
									return false;
								}
								break;
							}
						}
						
						//--**	특수 타입인 경우 validate 체크
						switch(o.tagName){
						case "INPUT"  :
							if (tp === "tel"){		
								regExp	=	/^\d{2,3}-\d{3,4}-\d{4}$/;	//	일반전화번호 	.. 휴대폰인 경우 /^01([0|1|6|7|8|9]?)-?([0-9]{3,4})-?([0-9]{4})$/;
								if (!regExp.test(v)){
									alert("전화번호 양식이 틀립니다.");
									o.focus();
									o.select();
									return false;
								}
								break;
							} else if (tp === "email"){		
								regExp	=	/^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i; 
								if (!regExp.test(v)){
									alert("이메일 양식이 틀립니다.");
									o.focus();
									o.select();
									return false;
								}
								break;
							} else if (tp === "number"){	
								regExp	=	/^[0-9]+$/;
								if (!regExp.test(v)){
									alert("숫자만 입력되어야 합니다.");
									o.focus();
									o.select();
									return false;
								}
								break;
							} else if (tp === "date"){		
								regExp	=	/^(19|20)\d{2}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[0-1])$/;
								if (!regExp.test(v)){
									alert("날자 형식이 틀립니다.");
									o.focus();
									o.select();
									return false;
								}
								break;
							}
							break;
						}
					}
					return true;
					
				} catch(e){
					alert("[ $V > validate ]" + e);
				} finally {
					t	=	null;
					v	=	null;
					vv	=	null;
					tp	=	null;
					oform	=	null;
					otype	=	null;
					regExp	=	null;
				}
			
			}
}

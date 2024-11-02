/*=================================================================================
 *	파 일 명		: IMS_$H.js
 *	작성목적		: 공통 $H 함수 - Form , input Tag 관련 
 *	작 성 자		: 이상준
 *	최초작성일		: 2013.04.16
 *	최종작성일		:
 *	수정내역		:
 *				
 *				
 *					
=================================================================================*/

var $H = {
		
	//-------------------------------------------------------
	//	input auto resize
	//-------------------------------------------------------
		autofit:
			function(obj,opt){
				var w,l,r,t,b,c;
				try{
					for (var i=0,ooo;ooo=obj[i];i+=1){
						//--**	오브젝트가 1개 이상인 경우 pass
						c = $hA("input",ooo.parentElement).length + $hA("select",ooo.parentElement).length;
						if (c > 1) continue; 
						//--**	autofit attribute 가 NO 인경우 패스
						//--**	type이 button 인경우 pass
						if ($U.nvl($U.get(ooo,"autofit"),"").toUpperCase() === "NO") continue;
						if ($U.get(ooo,"type").toUpperCase() === "BUTTON") continue;
						w	=	ooo.parentElement.offsetWidth;
						l	=	$U.nvl(opt.left,0);
						r	=	$U.nvl(opt.right,0);
						t	=	$U.nvl(opt.top,0);
						b	=	$U.nvl(opt.bottom,0);
						ooo.style.width	= (w - l - r) + "px";
						if (t !==0 ) ooo.style.marginTop = t +"px"; 
						if (b !==0 ) ooo.style.marginBottom = b +"px"; 
					}
				} catch(e){
					alert("$H > autofit : " + e);
					
				} finally {
					w	=	null;
					l	=	null;
					r	=	null;
					t	=	null;
					b	=	null;
					c	=	null;
				}
			}
	//-------------------------------------------------------
	//	Form mode 변경
	//-------------------------------------------------------
	,	modeset:
			function(obj,opt){
				
				var allobj,bc,ds,ps,oform;
				try{
					oform = typeof(obj) === "string" ? $hLD("form[name="+obj+"]") : obj;
					if ($U.isNull(oform)){
						oform = document;
					}

					bc 	= 	(opt.mode === "VIEW" ? "transparent" : ""); 
					ds	=	(opt.mode === "VIEW" ? "none" : "");
					allobj = $hA("*", oform);
					
					for (var i=0,ooo;ooo=allobj[i];i+=1){
						
						//--**	modeapply NO 인경우 적용안함
						if ($U.get(ooo,"modeapply") === "NO"){
							continue;
						}
						
						if (opt.mode === "VIEW"){
							ps	=	"";
						} else {
							$U.set(ooo,"placeholder2",$U.nvl($U.get(ooo,"placeholder"),""));
							ps	=	$U.get(ooo,"placeholder2");
						}
						
						
						if (ooo.tagName === "INPUT"){
							switch($U.get(ooo,"type")){
							case "text" :
								ooo.style.borderColor	=	bc;
								if (opt.mode === "VIEW"){
									$U.set(ooo,"readonly",true);
								} else {
									if ( $U.get(ooo,"readonly") !== true && $U.get(ooo,"readonly") !== "readonly"){
										$U.del(ooo,"readonly");
									} 
								}
								$U.set(ooo,"placeholder",ps);
								break;
								
							case "checkbox" :
							case "radio" :
								$U.set(ooo,"disabled",opt.mode === "VIEW");
								break;
								
							case "select" :
								$U.set(ooo,"disabled",opt.mode === "VIEW");
								$U.set(ooo,"placeholder",ps);
								break;
								
							case "button" :
								ooo.style.display	=	ds;
								break;
							}
							
						}
						
						if (ooo.tagName === "SELECT"){
							$U.set(ooo,"disabled",opt.mode === "VIEW");
							$U.set(ooo,"placeholder",ps);
						}
						
						if (ooo.tagName === "TEXTAREA"){
							$U.set(ooo,"disabled",opt.mode === "VIEW");
							$U.set(ooo,"placeholder",ps);
						}

						if (ooo.tagName === "BUTTON"){
							ooo.style.display	=	ds;
						}
					
					
					}
				//} catch(e){
				//	alert("$H > modeset : " + e);
					
				} finally {
					bc	=	null;
					ds	=	null;
					ps	=	null;
					allobj = null;
					oform	=	null;
				}
			}

	//-------------------------------------------------------
	//	Form data sync
	//	console.log("KEY : " +key + ", VALUE = " + data[key] + ", TYPE : " + $U.get(ooo[0],"type"));
	//-------------------------------------------------------
	,	datasync:
			function(pobj,data){
				
				var ooo,oform,ichk;
				try{
					
					oform = typeof(pobj) === "string" ? $hLD("form[name="+pobj+"]") : pobj;
					if ($U.isNull(oform)){
						oform = document;
					}
					
					ichk	=	0;
					for (var key in data){
						
						for (var qwer=0; qwer<4; qwer+=1){
							
							switch(qwer){
							case 0 : 
								ooo = $hA("input[name="+key+"]", oform);
								break;
							case 1 : 
								ooo = $hA("select[name="+key+"]", oform);
								break;
							case 2 : 
								ooo = $hA("textarea[name="+key+"]", oform);
								break;
							case 3 : 
								ooo = $hA("span[name="+key+"]", oform);
								break;
							}

							if ($U.isNull(ooo) || ooo.length === 0) continue;
							if (ooo[0].tagName.toUpperCase() === "INPUT"){
								switch($U.get(ooo[0],"type")){
								case "date" :
								case "email" :
								case "number" :
								case "tel" :
								case "password" :
								case "hidden" :
								case "text" :
									ooo[0].value	=	data[key];
									break;
								case "select" :
									for(var xx=0,soo;soo=ooo[0].options[xx];xx+=1){
										if (soo.value === data[key]){
											soo.checked	=	true;
											break;
										}
									}
									break;
								case "radio" :
									for(var xx=0,roo;roo=ooo[xx];xx+=1){
										if (roo.value === data[key]){
											roo.checked	=	true;
											break;
										}
									}
									break;
								case "checkbox" :
									for(var xx=0,roo;roo=ooo[xx];xx+=1){
										if (roo.value === data[key]){
											roo.checked	=	true;
											break;
										}
									}
									break;
								}
							
							} else if (ooo[0].tagName.toUpperCase() === "SELECT"){
								
								for(var xx=0,soo;soo=ooo[0].options[xx];xx+=1){
									if (soo.value === data[key]){
										soo.selected =	true;
										break;
									}
								}
							
							} else if (ooo[0].tagName.toUpperCase() === "TEXTAREA"){
								ooo[0].value	=	data[key];
								
							} else if (ooo[0].tagName.toUpperCase() === "SPAN"){
								ooo[0].innerHTML =	data[key];
								
							}
							
						}
						
					}
					
				} catch(e){
					alert("$H > datasync : " + e);
					
				} finally {
					
					ooo	=	null;
				}
				
			}

};	


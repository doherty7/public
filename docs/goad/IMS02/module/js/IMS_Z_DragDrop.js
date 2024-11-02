/*=================================================================================
 *	파 일 명	: IMS_XR_DragDrop.js
 *	작성목적	: HTML5 Drag & Drop 관련 함수
 *	작 성 자	: 이상준
 *	최초작성일	: 2018.03.09
 *	최종작성일	:
 *	수정내역	:
 *				
 *				
=================================================================================*/

//===================================================================
//	DragDrop 
//===================================================================
var XDropDrag = {
		
		StartX		:	0
	,	StartY		:	0	
	,	target		:	null
	,	gubun		:	null
		
	//-------------------------------------------------------
	//	drag
	//-------------------------------------------------------
	,	drag	:
			function(ev,g){
				var e = ev || window.event;
				try{
					$U.eventbind(document, "onmousemove",	XDropDrag.over );
					$U.eventbind(document, "onmouseup", 	XDropDrag.drop );
					XDropDrag.gubun		=	g;	
					XDropDrag.StartX	=	_MOUSE_POSITION.x;	
					XDropDrag.StartY	=	_MOUSE_POSITION.y;	
					XDropDrag.target	=	(e.srcElement||e.target).parentElement;
				} catch(e){
					console.log("[ XDropDrag || drag ] " + e);
				} finally{
					e.preventDefault();
					e	=	null;
				}
			}
	
	//-------------------------------------------------------
	//	over
	//-------------------------------------------------------
	,	over	:
			function(ev){
				
				var w,wo,e = ev || window.event;
				try{
					
					w	=	parseInt(XDropDrag.target.style.width)||XDropDrag.target.offsetWidth;
					
					//--**	구분별 처리 
					//--**	G2_HEAD_RESIZE	->	G2 헤더 사이즈 조정
					switch(XDropDrag.gubun){
						case "G2_HEAD_RESIZE"	:	
							wo	=	XDropDrag.target.parentElement.parentElement.parentElement;
							w	=	parseInt(wo.style.width)||wo.offsetWidth;
							document.body.style.cursor	=	"w-resize";
							wo.style.width	=	( w +	e.clientX -	XDropDrag.StartX ) + "px";
							break;
					}
					
					XDropDrag.StartX	=	_MOUSE_POSITION.x;	
					XDropDrag.StartY	=	_MOUSE_POSITION.y;	
				} catch(e){
					console.log("[ XDropDrag || over ] " + e);
				} finally{
					e.preventDefault();
					w	=	null;
					e	=	null;
					wo	=	null;
				}
				
			}
		
	//-------------------------------------------------------
	//	drag
	//-------------------------------------------------------
	,	drop	:
			function(ev){
				$U.eventunbind(document, "onmousemove",	XDropDrag.over );
				$U.eventunbind(document, "onmouseup", 	XDropDrag.drop );
				document.body.style.cursor	=	"";
				
			}
		
};	


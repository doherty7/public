/*=================================================================================
 *	파 일 명		: IMS_G2.js
 *	작성목적		: G2 관련 함수
 *	작 성 자		: 이상준
 *	최초작성일		: 2018.03.08
 *	최종작성일		:
 *	수정내역		:
 *				2018-03-08		이상준		기존 IMS_Grid 를 테이블 기반으로 재개발
=================================================================================*/

//===================================================================
//	G2 
//===================================================================

var G2Object = [];
var G2_FRAME_TEMPLATE 	=	null;
var G2_PAGE_TEMPLATE	= 	null;
var G2_KEYCHECK_TEMPLATE  =	"<span class='keycheck' name='{0}' field='{1}' keycheck='{2}'>"
						+	"{3}&nbsp;&nbsp;"
						+	"{4}&nbsp;&nbsp;"
						+	"<a onclick='$U.remove(this.parentNode)'><i class='far fa-times-circle'></i></a>"
						+	"</span>";
var G2_SORT_TEMPLATE	=	"<span class='sort' name='{0}' field='{1}' sort='{2}'>"
						+	"{3}&nbsp;&nbsp;"
						+	"<a onclick='_sort_change(this)'>{4}</a>&nbsp;&nbsp;"
						+	"<a onclick='$U.remove(this.parentNode)'><i class='far fa-times-circle'></i></a>"
						+	"</span>";
var G2_FILTER_TEMPLATE	=	"<span class='filter' name='{0}' field='{1}' filter='{2}'>"
						+	"{3}&nbsp;&nbsp;"
						+	"{4}&nbsp;&nbsp;"
						+	"<a onclick='$U.remove(this.parentNode)'><i class='far fa-times-circle'></i></a>"
						+	"</span>";


//--**	G2 템플릿 초기화
function G2_begin(){
	if ($U.isNull(G2_FRAME_TEMPLATE)){
		$U.load(IMS_config.path +"/IMS02/module/template/grid/G2_frame.html", function(d){ G2_FRAME_TEMPLATE = d; });
		$U.load(IMS_config.path +"/IMS02/module/template/grid/G2_page.html", function(d){ G2_PAGE_TEMPLATE = d; });
		$U.load(IMS_config.path +"/IMS02/module/template/frame/frame_$P.html");
		$U.load(IMS_config.path +"/IMS02/module/template/grid/G2_popup.html");
	}
}

//--**	G2 그리드 오브젝트
function G2(xoo,option,param,initoption){
	
	//-------------------------------------------------------
	//	loading
	//-------------------------------------------------------
	this.loading = function(v){
		if (v === true){
			this.loader.style.display =	"block";
		} else {
			var ooo = this;
			setTimeout(function(){	
				ooo.loader.style.display =	"none";
				ooo = null;
			},100);
		}
	}
	
	//-------------------------------------------------------
	//	headergroup 설정
	//-------------------------------------------------------
	this.headergroupset = function(s){
		var r="",v,sv ;
		v	=	s.split("}");
		for (var i=0,o;o=v[i];i+=1){
			if ( $U.isNullOrEmpty(o)) continue;
			o	=	o.substring(o.indexOf("{")+1);
			sv	=	o.split(",");
			for (var j=0,oo;oo=sv[j];j+=1){
				r	+=	(j===0 ? "{" : "") + '"' + oo.replace("=",'":"') + '",';
			}	
			r	+= 	"},";
		}
		
		r	=	"[" + r.substring(0,r.length-1) + "]";
		r	=	r.replace(/",}/g,'"}');
		r	=	r.replace(/ "|" /g,'"');
		return r;
	}
	
	//-------------------------------------------------------
	//	header 설정
	//-------------------------------------------------------
	this.headerset = function(s){
		
		//--**	기본 헤더 삽입
		s	=	"{ title=, id=g2check, width=20, align=center, type=G2checkbox }" + s;
		return this.headergroupset(s);
		
	}
	
	//-------------------------------------------------------
	//	create
	//-------------------------------------------------------
	this.create	=	function(){
		
		var f01="", f02="", f03="", f04="", f05="", f06="", f07="", f08="", f09="", f10="", f11="";
		var fftd="", fnftd="", fmin=0, fmin2=0, fh=[], ho, fdivw=0;
		var temptd	=	"<td style=\"{0}height:{1}px;line-height:{1}px;text-align:{2}\" click='{3}' class='{4}' colidx='{5}' colname='{6}'>{7}</td>";
		var tempcol	=	"<col style=\"width:{0};\">";
		var tempth	=	"<th xg-field=\"{0}\" style=\"height:{1}px;line-height:{1}px;{2}\">"
					+	"{3}<div class='resize' onmousedown=\"XDropDrag.drag(event,'G2_HEAD_RESIZE')\"></th>";
		try{
			
			//--**	thead
			for (var i=0,j=Number(this.fixCnt); i<j; i+=1){
				ho	=	this.header[i];
				fh.push( ho["hiddenYN"] );
				fmin += Number(fh[i] === "Y" ? "0" : ho["width"] );
				f02	+=  $U.format(tempcol, (fh[i] === "Y" ? "0; display:none" : ho["width"] + "px" ) );
				f03	+=	$U.format(tempth, 	ho["id"]
										, 	this.headerHeight
										, 	(fh[i] === "Y" ? "display:none" : "")
										, 	this.setvalue({type:ho["type"],data:"<span>" + ho["title"] + "</span>"}) );
				fdivw	+=	(ho["hiddenYN"] === "Y" ? 0 : Number(ho["width"])); 	
			}
			for (var i=Number(this.fixCnt),j= this.header.length; i<j; i+=1){
				ho	=	this.header[i];
				fh.push( ho["hiddenYN"] );
				fmin2 += Number(fh[i] === "Y" ? "0" : ho["width"] );
				f06	+=  $U.format(tempcol, (fh[i] === "Y" ? "0; display:none" : ho["width"] + "px" ));
				f07	+=	$U.format(tempth, 	ho["id"]
										, 	this.headerHeight
										, 	(fh[i] === "Y" ? "display:none" : "")
										, 	this.setvalue({type:ho["type"],data:"<span>" + ho["title"] + "</span>"}) );
			}
			
			//--**	tbody
			f01	=	(Number(this.fixCnt) === 0 ? "nondisplay" : "");
			
			for (var i=0,j=Number(this.fixCnt); i<j; i+=1){
				ho	=	this.header[i];
				fftd	+=	$U.format(temptd, 	(fh[i] === "Y" ? "display:none;" : "")
											, 	this.rowHeight
											, 	$U.nvl(ho["align"],"center")
											,	$U.isNullOrEmpty(ho["click"]) ? "" : ho["click"]
											,	$U.isNullOrEmpty(ho["click"]) ? "" : "clickstyle"
											,	i
											,	ho["id"]
											, 	this.setvalue({	type:ho["type"], data:"&nbsp;" }) );
			}
			for (var i=Number(this.fixCnt),j= this.header.length; i<j; i+=1){
				ho	=	this.header[i];
				fnftd	+=	$U.format(temptd, 	(fh[i] === "Y" ? "display:none;" : "")
											, 	this.rowHeight
											, 	$U.nvl(ho["align"],"center")
											,	$U.isNullOrEmpty(ho["click"]) ? "" : ho["click"]
											,	$U.isNullOrEmpty(ho["click"]) ? "" : "clickstyle"
											,	i
											,	ho["id"]
											, 	this.setvalue({type:ho["type"],data:"&nbsp;"}) );
			}

			for (var i=0,j= Number(this.viewRowCnt) ; i<j; i+=1){
				f05	+=	$U.format("<tr idx='{0}'>{1}</tr>",i,fftd);
				f09	+=	$U.format("<tr idx='{0}'>{1}</tr>",i,fnftd);
			}
			
			//--**	headgroup	
			if (this.headerRowCnt !== 1){
				for (var xxx=0,yyy=this.headerRowCnt-1; xxx<yyy; xxx+=1){
					f10 += "<tr>"+ f03 +"</tr>"; 
					f11 += "<tr>"+ f07 +"</tr>"; 
				}
			}

			$U.html( this.G2o.parentElement, $U.format(	G2_FRAME_TEMPLATE, this.id, f01, f02, f10, f03, f04, f05, f06, f11, f07, f08, f09));
		
		} catch(e){
			alert("[ G2 || create ]" + e);
		} finally {
			
			//--**	오브젝트 세팅
			this.G2o	=	$hD("#" + this.id);	
			this.fdiv	=	$hD("div[name='FixedDiv']", 	this.G2o);
			this.nfdiv	=	$hD("div[name='NonFixedDiv']", 	this.G2o);
			this.loader	=	$hD("div[name='G2_loader']",	this.G2o);
			this.footer	=	$hD("div[name='G2_footer']",	this.G2o);
			this.scroller 		=	$hD("div[name='G2_scroll']",	this.G2o);
			this.funcdiv  		= 	$hD("div[name='FunctionDiv']",	this.G2o);	
			this.functionarea	=	$hD("div[name='FunctionArea']",	this.G2o);	
			this.fdiv.style.width	=	fdivw + "px";	
			
			//--**	event 세팅
			var ooo = this;
			$U.eventbind( $hD("div[name='FunctionArea']", this.funcdiv), "onclick", function(evt){ if (this === (evt.target || evt.srcElement)) { ooo.call(ooo.param); }});	
			$U.eventbind( $hD("a[name='excelexec']",	this.funcdiv), "onclick", function(){ ooo.excel(); });	
			$U.eventbind( $hA("th span", this.fdiv), "onclick", function(){ ooo.popup(this); });	
			$U.eventbind( $hA("th span", this.nfdiv), "onclick", function(){ ooo.popup(this); });	
			$U.eventbind( this.fdiv, "onmousewheel", function(e){ ooo.mousewheel(e); });	
			$U.eventbind( this.nfdiv, "onmousewheel", function(e){ ooo.mousewheel(e); });	
	    	if (IDV_BROWSER.NAME === "firefox"){
				$U.eventbind( this.fdiv, "onDOMMouseScroll", function(e){ ooo.mousewheel(e); });	
				$U.eventbind( this.nfdiv, "onDOMMouseScroll", function(e){ ooo.mousewheel(e); });	
	    	}
			$U.eventbind( $hA("table tbody tr", this.fdiv), "onmouseover", function(){ ooo.trmouseover(this); });
			$U.eventbind( $hA("table tbody tr", this.nfdiv), "onmouseover", function(){ ooo.trmouseover(this); });
			$U.eventbind( $hA("table tbody tr", this.fdiv), "onmouseout", function(){ ooo.trmouseout(this); });
			$U.eventbind( $hA("table tbody tr", this.nfdiv), "onmouseout", function(){ ooo.trmouseout(this); });

			$U.eventbind( $hA("table thead .G2checkbox", this.fdiv), "onchange", function(e){ ooo.G2checkboxheadclick(this,e); });
			$U.eventbind( $hA("table thead .G2checkbox", this.nfdiv), "onchange", function(e){ ooo.G2checkboxheadclick(this,e); });
			
			$U.eventbind( $hA("table tbody tr td", this.fdiv), "onclick", function(){ ooo.tdclick(this); });
			$U.eventbind( $hA("table tbody tr td", this.nfdiv), "onclick", function(){ ooo.tdclick(this); });
			
			$hD("table[name='NonFixedTable']", this.G2o).style.minWidth = fmin2 + "px"; 

			//--**	header group 세팅	
			if (this.headergroup.length > 0){
				
				for (var i=0,j=this.headergroup.length; i<j; i+=1){
					ho = this.headergroup[i];
					
					//--**	colspan,row,cell 은 필수, rowspan 은 선택
					if ($U.isNull(ho["colspan"])){
						alert("colspan 은 필수입니다");
						break;
					}
					if ($U.isNull(ho["row"])){
						alert("row 는 필수입니다");
						break;
					}
					if ($U.isNull(ho["cell"])){
						alert("cell 은 필수입니다");
						break;
					}
					
					//--**　	대상선정
					//--**	시작 cell 의 위치에 따라 대상 선정
					f03	=	Number(ho["cell"]) < Number(this.fixCnt) ? Number(ho["cell"]) : Number(ho["cell"]) - Number(this.fixCnt);
					fh	=	Number(ho["cell"]) < Number(this.fixCnt) ? this.fdiv : this.nfdiv;
					f01	=	$hA("table thead tr", fh)[Number(ho["row"])];
					f02	=	$hA("th", f01);
					f04	=	f03 + Number(ho["colspan"]) > f02.length ?  f02.length - f03 : ho["colspan"];
					$U.set(f02[f03],"colspan", f04 );
					$U.settext(f02[f03],ho["title"]);
					
					//--**	중복되는 cell 의 display 를 none 으로 처리
					for (var aaa=f03+1,bbb=f03+Number(f04); aaa<bbb; aaa+=1){
						$U.set(f02[aaa],"style", "display:none");
					}
				}
				
				//--**	하위 같은 로우끼리 처리 할것
				for (var eee=0; eee<2; eee+=1){
					f01 = 	$hA("table thead tr th", (eee===0 ? this.fdiv : this.nfdiv));
					f02	=	(f01.length/Number(this.headerRowCnt));
					for (var xxx=0,yyy=f01.length-f02; xxx<yyy; xxx+=1){
						if (f01[xxx].style.display	===	"none") continue;
						for (var kkk=1,ggg=(this.headerRowCnt - (xxx / f02)); kkk<ggg; kkk+=1){
							if ( $U.text(f01[xxx]) ===  $U.text(f01[kkk*f02+xxx])){
								f01[kkk*f02+xxx].style.display = "none";
								f04 = $U.nvl($U.get(f01[xxx],"rowspan"),1);
								$U.set(f01[xxx],"rowspan",f04+1);
							} 
						}
					}
				}
			}
			
			G2Object.push(this);

			f01	=	null;
			f02	=	null;
			f03	=	null;
			f04	=	null;
			f05	=	null;
			f06	=	null;
			f07	=	null;
			f08	=	null;
			f09	=	null;
			f10	=	null;
			f11	=	null;
			fftd	=	null;
			fnftd	=	null;
			fmin  	= 	null;
			fmin2  	= 	null;
			fh		=	null;
			ho 		=	null;
			fdivw	=	null;
			temptd	=	null;
			tempcol	=	null;
			tempth	=	null;
		
		}

	}

	//-------------------------------------------------------
	//	resize
	//-------------------------------------------------------
	this.resize	=	function(){
		if ($U.isNull(this.G2o)){ 
			return;
		}
		
		var po,hh,rh,ih,ctext,hpos,hpos2,fttr,nfttr,harr,ftth,nftth,mval,rspan;

		try{
			
			po	=	this.G2o.parentElement;
			ih	= 	$U.getposition($hD("table", this.nfdiv)).h + 17;	// 하단 스크롤 감안	(hh * Number(this.headerRowCnt)) + (rh * Number(this.viewRowCnt)) 
			
			this.nfdiv.style.left	=	this.fdiv.offsetWidth + "px";
			this.nfdiv.style.height	=	ih + "px";
			ih	+= 	$U.getposition(this.footer).h /*.offsetHeight*/ + $U.getposition(this.funcdiv).h ; // .offsetHeight;	
			
			//--**	height 관련 삭제
			ctext	=	po.style.cssText.toLowerCase();
			hpos	=	ctext.indexOf("height");
			if (hpos > -1){
				hpos2	=	ctext.substr(hpos).indexOf(";");
				if (hpos2 === -1){
					hpos2	=	ctext.legnth;	
				}
			
				ctext	=	po.style.cssText.substr(0,(hpos === 0 ? 0 : hpos-1)) 
						+	po.style.cssText.substr(hpos2+1);
				po.style.cssText	=	ctext;
			}
			
			//--**	height 강제 처리
			po.style.cssText	+=	";height:" + ih + "px!important;";
			
			//--**	scroller 위치 조정
			this.scroller.style.top		= $U.getposition(this.funcdiv).h + $U.getposition($hD("table thead", this.nfdiv)).h  + "px";	
			this.scroller.style.height	= $U.getposition($hD("table tbody", this.nfdiv)).h - 1 + "px";	//--**	w scroller 감안	
			
			//--**	fixdiv thead tr 과 nfixdiv thead tr sync
			if (this.fixCnt > 0){
				
				fttr	=	$hA("table thead tr", this.fdiv);
				nfttr	=	$hA("table thead tr", this.nfdiv);
				harr	=	new Array();
				
				//--**	fixed 와 nonfixed th 의 값을 구한다
				for (var m=0,n=this.headerRowCnt;m<n;m+=1){
					
					ftth	=	$hA("th", fttr[m]);
					nftth	=	$hA("th", nfttr[m]);
					mval	=	0;
					
					for (var xx=0,ftthoo;ftthoo=ftth[xx];xx+=1){
						rspan	=	$U.get(ftthoo,"rowspan");
						rspan	=	$U.isNull(rspan) ? 1 : Number(rspan);
						if (rspan > 1){ continue; }
						mval = ftthoo.offsetHeight > mval ? ftthoo.offsetHeight : mval;
					}
					for (var xx=0,nftthoo;nftthoo=nftth[xx];xx+=1){
						rspan	=	$U.get(nftthoo,"rowspan");
						rspan	=	$U.isNull(rspan) ? 1 : Number(rspan);
						if (rspan > 1){ continue; }
						mval = nftthoo.offsetHeight > mval ? nftthoo.offsetHeight : mval;
					}
					harr.push(mval - IMS_config.G2_headHeightChai);
				}	
				
				//--**	setting
				for (var m=0,n=this.headerRowCnt;m<n;m+=1){
					ftth	=	$hA("th", fttr[m]);
					nftth	=	$hA("th", nfttr[m]);
					
					for (var xx=0,ftthoo;ftthoo=ftth[xx];xx+=1){
						rspan	=	$U.get(ftthoo,"rowspan");
						rspan	=	$U.isNull(rspan) ? 1 : Number(rspan);
						mval	=	0;
						for (var kk=m,ff=m+rspan;kk<ff;kk+=1){
							mval	+=	harr[kk];
						}
						ftthoo.style.height	=	mval + ((rspan-1) * IMS_config.G2_headHeightChai) + "px";
					}
					for (var xx=0,nftthoo;nftthoo=nftth[xx];xx+=1){
						rspan	=	$U.get(nftthoo,"rowspan");
						rspan	=	$U.isNull(rspan) ? 1 : Number(rspan);
						mval	=	0;
						for (var kk=m,ff=m+rspan;kk<ff;kk+=1){
							mval	+=	harr[kk];
						}
						nftthoo.style.height	=	mval + ((rspan-1) * IMS_config.G2_headHeightChai) + "px";
					}
				}
			}
			
		} catch(e){
			alert("[ XGid || resize ]" + e);
		} finally {
				po	=	null
			,	hh	=	null
			,	rh	=	null
			,	ih	=	null
			,	ctext	=	null
			,	hpos	=	null
			,	hpos2	=	null
			,	fttr	=	null
			,	nfttr	=	null
			,	harr	=	null
			,	ftth	=	null
			,	nftth	=	null	
			,	mval	=	null
			,	rspan	=	null;
		}
	}
	
	//-------------------------------------------------------
	//	excel download
	//-------------------------------------------------------
	this.excel	=	function(){

		var p,f,title,data,header,headergroup,headerrowcnt,input_t,input_d,input_h,input_hg,input_h, vform, vframe;
		try{
			title		=	encodeURIComponent(this.id);
			data		=	encodeURIComponent(JSON.stringify(this.data));
			header		=	encodeURIComponent(JSON.stringify(this.header));
			headergroup	=	encodeURIComponent(JSON.stringify(this.headergroup));
			headerrowcnt =	encodeURIComponent(this.headerRowCnt);
			
			vframe	= $hD("#_IMS_GRID_G2_TOEXCEL_TARGET_FRAME");
			if ($U.isNull(vframe)){
				f	=	document.createElement("iframe");
				f.id	=	"_IMS_GRID_G2_TOEXCEL_TARGET_FRAME";
				f.name	=	"_IMS_GRID_G2_TOEXCEL_TARGET_FRAME";
				f.style.display	= "none";
				document.body.appendChild(f);
				vframe	= $hD("#_IMS_GRID_G2_TOEXCEL_TARGET_FRAME");
			}
			
			vform = $hD("#_IMS_GRID_G2_TOEXCEL_FORM");
			if ($U.isNull(vform)){
				f	=	document.createElement("form");
				f.action	=	"/ImsExcel";
				f.method	=	"post";
				f.target	=	"_IMS_GRID_G2_TOEXCEL_TARGET_FRAME";
				f.id		=	"_IMS_GRID_G2_TOEXCEL_FORM";
				
				input_t			=	document.createElement("input");
				input_t.type	=	"hidden";
				input_t.name	=	"_IMS_GRID_TOEXCEL_TITLE";
				input_t.id		=	"_IMS_GRID_TOEXCEL_TITLE";
				
				input_d			=	document.createElement("input");
				input_d.type	=	"hidden";
				input_d.name	=	"_IMS_GRID_TOEXCEL_DATA";
				input_d.id		=	"_IMS_GRID_TOEXCEL_DATA";
				
				input_h			=	document.createElement("input");
				input_h.type	=	"hidden";
				input_h.name	=	"_IMS_GRID_TOEXCEL_HEADER";
				input_h.id		=	"_IMS_GRID_TOEXCEL_HEADER";
				
				input_hg		=	document.createElement("input");
				input_hg.type	=	"hidden";
				input_hg.name	=	"_IMS_GRID_TOEXCEL_HEADERGROUP";
				input_hg.id		=	"_IMS_GRID_TOEXCEL_HEADERGROUP";
				
				input_hc		=	document.createElement("input");
				input_hc.type	=	"hidden";
				input_hc.name	=	"_IMS_GRID_TOEXCEL_HEADER_ROWCNT";
				input_hc.id		=	"_IMS_GRID_TOEXCEL_HEADER_ROWCNT";
				
				f.appendChild(input_t);						
				f.appendChild(input_d);						
				f.appendChild(input_h);						
				f.appendChild(input_hg);						
				f.appendChild(input_hc);						
				
				document.body.appendChild(f);
				
				vform = $hD("#_IMS_GRID_G2_TOEXCEL_FORM");
				
			}
			
			$hD("#_IMS_GRID_TOEXCEL_TITLE", vform).value	=	title;
			$hD("#_IMS_GRID_TOEXCEL_DATA",  vform).value	=	data;
			$hD("#_IMS_GRID_TOEXCEL_HEADER", vform).value	=	header;
			$hD("#_IMS_GRID_TOEXCEL_HEADERGROUP", vform).value	=	headergroup;
			$hD("#_IMS_GRID_TOEXCEL_HEADER_ROWCNT", vform).value	=	headerrowcnt;
			
			vform.submit();
			
		} catch(e){
			alert("[G2 > TOEXCEL] " + e);
		} finally {
			p	=	null;
			f	=	null;
			title	=	null;
			data	=	null;
			header	=	null;
			headerrowcnt	=	null;
			input_t	=	null;
			input_d	=	null;
			input_h	=	null;
			input_hg =	null;
			vform	=	null;
			vframe	=	null;
		}
	}
	
	//-------------------------------------------------------
	//	Data Call
	//-------------------------------------------------------
	this.call	=	function(param){
		
 		//--**	검색 시작 Time
		this.stime	=	new Date().getTime();
		
		this.loading(true);
		
		this.rowFirst	=	((parseInt(this.page)-1) * parseInt(this.pageRowCnt));
		this.rowLast	=	((parseInt(this.page) * parseInt(this.pageRowCnt)));
		this.topRow		=	1;
		this.param		=	param;
		
		var p 	= 	"page=" 		+ 	this.page 
				+	"&pageRowCnt=" 	+	this.pageRowCnt
				+	"&rowFirst=" 	+	this.rowFirst 
				+	"&rowLast=" 	+ 	this.rowLast
				+	"&sort="		+	this.sortset()
				+	"&filter="		+	this.filterset()
				+	"&keycheck="	+	this.keycheckset()
				+	"&getdata=*"	
				+	"&groupby="		
				+	"&"+ this.param;
		
		var ooo = this;
		
		$A.call({url:this.url,param:p,ptype:"string"}, function(data){
			
			//--**	로딩 닫기
			ooo.loading(false);
			
			//--**	data set
			ooo.data	=	data;
			
			//--**	paging 처리
			ooo.paging();
			
			//--**	데이타 처리
			ooo.setting();

			//--**	종료시간
			ooo.etime	=	new Date().getTime();
			
			//--**	information display
			ooo.information("검색에 " + ((ooo.etime - ooo.stime) /1000) + "초가 소요되었습니다...");
			
			//--**	success
			ooo.success();
			
			//--**	resize
			ooo.resize();			
		
		} , function(){ 
			
			ooo.loading(false); 
			ooo.information("검색시 문제가 발생하였습니다..."); 
			
			//--**	fail
			ooo.fail();
		
			//--**	resize
			ooo.resize();			
		} );
		
	}
	
	//-------------------------------------------------------
	//	Data load
	//-------------------------------------------------------
	this.load	=	function(data){
		
		this.stime	=	new Date().getTime();
		this.loading(true);
		this.loading(false);
		this.data	=	$U.isNull(data) ? this.data : data;
		this.data.total	=	this.data.rows.length;
		this.data.pagetotal	=	(this.data.rows.length / this.pageRowCnt) + 1;
		this.paging();
		this.setting();
		this.etime	=	new Date().getTime();
		this.information("검색에 " + ((ooo.etime - ooo.stime) /1000) + "초가 소요되었습니다...");
		this.success();
		
	}
	
	//-------------------------------------------------------
	//	reload
	//-------------------------------------------------------
	this.reload	=	function(){
		this.call(this.param)
	}
	
	//-------------------------------------------------------
	//	Paging 처리
	//-------------------------------------------------------
	this.paging	=	function(){
		
		var pt,cbp2,cbp1,cp,cap1,cap2;
		try{
			
			//--**	paging 처리
			cp		=	parseInt(this.data.page);
			cbp2	=	cp - 2 < 1 ? "" : "<span name='no'>" + (cp - 2) + "</span>&nbsp;" ; 
			cbp1	=	cp - 1 < 1 ? "" : "<span name='no'>"+ (cp - 1) + "</span>&nbsp;" ;
			cap1	=	cp + 1 > parseInt(this.data.pagetotal) ? "" : "&nbsp;<span name='no'>" + (cp + 1) + "</span>&nbsp;";
			cap2	=	cp + 2 > parseInt(this.data.pagetotal) ? "" : "<span name='no'>" + (cp + 2) + "</span>";
			
			//--**	통 갯수가 rowLast 보다 작을 경우 rowLast 값을 변경
			this.rowLast	=	Number(this.data.total) < Number(this.rowLast) ? this.data.total : this.rowLast;
			
			pt	=	$U.format(	G2_PAGE_TEMPLATE 
								,	$U.tocurrency(this.data.total)
								,	this.rowFirst + "-" + this.rowLast
								,	this.pageRowCnt
								,	cbp2 + cbp1 + "<font>" + cp + "</font>" + cap1 + cap2 
								, 	parseInt(this.data.pagetotal) > 1 ? "1-" + this.data.pagetotal : "1"
								,	cp	
								)	
			$U.html(this.footer, pt);
			
			var ooo = this;
			
			//--**	page 이벤트 처리
			$U.eventbind($hA("input[name=viewcount]",this.footer), "onchange", function(){ ooo.pageRowCnt = this.value });
			$U.eventbind($hA("input[name=gopage]",this.footer), "onchange", function(){ ooo.page = Number(ooo.data.pagetotal) < Number(this.value) ? ooo.data.pagetotal : this.value; });
			$U.eventbind($hA("a",this.footer)[0], "onclick", function(){ ooo.call(ooo.param); });
			$U.eventbind($hA("a",this.footer)[1], "onclick", function(){ ooo.page = 1; ooo.call(ooo.param); });
			$U.eventbind($hA("a",this.footer)[2], "onclick", function(){ ooo.page = parseInt(ooo.page) - 1 < 1 ? 1 : parseInt(ooo.page) - 1; ooo.call(ooo.param); });
			$U.eventbind($hA("a",this.footer)[3], "onclick", function(){ ooo.page = parseInt(ooo.page) + 1 > ooo.data.pagetotal ? ooo.data.pagetotal : parseInt(ooo.page) + 1; ooo.call(ooo.param); });
			$U.eventbind($hA("a",this.footer)[4], "onclick", function(){ ooo.page = ooo.data.pagetotal; ooo.call(ooo.param); });
			$U.eventbind($hA("a",this.footer)[5], "onclick", function(){ ooo.call(ooo.param); });
			$U.eventbind($hA("span[name=no]",this.footer), "onclick", function(){ ooo.page = this.innerHTML; ooo.call(ooo.param); });
			
			this.G2info	=	$hD("div[name=G2info]", this.footer);
			
		}catch(e){
			alert("[ G2 > paging ]" + e);
		}finally{
			pt		=	null;
			cbp2	=	null;
			cbp1	=	null;
			cp		=	null;
			cap1	=	null;
			cap2	=	null;
		}
		
	}

	//-------------------------------------------------------
	//	G2 의 정보 display
	//-------------------------------------------------------
	this.information =	function(s){

		if ($U.isNull(this.G2info)) return;
		if ($U.isNullOrEmpty(s)) return;
		this.G2info.innerHTML	=	s;
		
		//--**	5초후 information 삭제
		var oinfo = this.G2info;
		setTimeout(function(){ oinfo.innerHTML	=	""; },5000);
		
	}
	
	//-------------------------------------------------------
	//	스크롤바 , data 처리
	//-------------------------------------------------------
	this.setting =	function(){
		
		this.scrollsetting();
		this.datasetting();
		
	}
	
	//-------------------------------------------------------
	//	스크롤바  처리
	//-------------------------------------------------------
	this.scrollsetting =	function(){
		
		var hh,rh,fh;
		try{
			
			hh = $U.getposition($hD("table thead", this.nfdiv)).h; //[0].offsetHeight;	//--**	첫 헤더는 항상 선택 라인이므로 headerrowcnt 적용 안함 * this.headerRowCnt;
			rh = $U.getposition($hA("table tbody tr td", this.nfdiv)[0]).h;
			
			//--**	scroller 처리
			this.scroller.style.display	= this.data.rows.length > Number(this.viewRowCnt) ? "block" : "none";	
			this.scroller.style.top		= $U.getposition(this.funcdiv).h + hh  + "px";	
			this.scroller.style.height	= $U.getposition($hD("table tbody", this.nfdiv)).h - 1 + "px";	//--**	w scroller 감안	
			$hD("div[name=G2_scroll_detail]", this.scroller).style.height	=	(rh * this.data.rows.length ) + "px";
			
			//--**	scroll event bind.....
			var ooo = this;
			$U.eventbind(this.scroller, "onscroll", function(){ ooo.datasetting(); });
			
		}catch(e){
			alert("[ G2 > scrollsetting ]" + e);
		}finally{
			hh	=	null;	
			rh	=	null;	
		}
		
	}
	
	//-------------------------------------------------------
	//	top row 정보 처리
	//-------------------------------------------------------
	this.toprowset = function(){
		
		var t,rh;
		
		try{
			
			if ($U.isNull($hD("span[name=viewtop]", this.G2o))){
				return;
			}
			
			t	=	this.scroller.scrollTop + 1;
			rh 	= 	$hA("table tbody tr td", this.nfdiv)[0].offsetHeight;
			this.topRow	=	Math.ceil(t / rh);
			$hD("span[name=viewtop]", this.G2o).innerHTML	=	Number(this.topRow) + Number(this.rowFirst);	
			
		}catch(e){
			alert("[ G2 > toprowset ]" + e);
		}finally{
			t	=	null;
			rh	=	null;
		}
		
	}
	
	//-------------------------------------------------------
	//	value 처리
	//-------------------------------------------------------
	this.setvalue = function(v){
		var r=v.data;
		switch (v.type){
			case "G2checkbox" :	 
				r = $U.format("<input type='checkbox' class='G2checkbox' {0} >", (v.data === true ? "checked" : "" ));	
				break;	
			default :
				if (!$U.isNullOrEmpty(v.formatter)){
					r = window[v.formatter](v.data,v.alldata);
				}
				break;
		}
		return r;
	}

	//-------------------------------------------------------
	//	G2 header checkbox 를 클릭시..
	//-------------------------------------------------------
	this.G2checkboxheadclick = function(oo,e){
		
		try{
			for (var tt=0,ttoo;ttoo=this.data.rows[tt];tt+=1){
				ttoo["g2check"] = oo.checked === true ? true: "";
			}
			this.datasetting();
		
		} catch(e){
			alert("[ G2 > G2checkboxheadclick ]" + e);
		} finally {
		}
		
	}

	//-------------------------------------------------------
	//-------------------------------------------------------
	//--**	EVENT	
	//-------------------------------------------------------
	//-------------------------------------------------------
	
	//-------------------------------------------------------
	//	G2 checkbox 를 클릭시..
	//-------------------------------------------------------
	this.G2checkboxclick = function(oo){
		
		var didx,rdata;
		try{
			
			didx = Number($U.get(oo.parentElement.parentElement, "dataidx"));
			rdata =	this.data.rows[didx];
			rdata["g2check"] = rdata["g2check"] === true ? "" : true;
			this.datasetting();
			
		} catch(e){
			alert("[ G2 > G2checkboxclick ]" + e);
		
		} finally {
			didx	=	null;
			rdata	=	null;
		}
		
	}
		
	//-------------------------------------------------------
	//	횔 스크롤시
	//-------------------------------------------------------
	this.mousewheel = function(e){
		
		var ev = e || window.event;
		
		//--**	event 전파 방지 IE 오류 처리
		try{
			e.preventDefault();
			e.stopPropagation();
		} catch(e){
		}
		
		//e.defaultPrevented	=	true;
		//e.returnValue	=	false;
		//e.cancelBubble 	= 	true;
		
		// console.log( "check01=" + ev.wheelDelta);
		// console.log( "check02=" + (-40 * ev.detail));
		
		var check = Math.abs(ev.wheelDelta || -40 * ev.detail);
		check	=	check === 120 ? 120 : 0;
		
		//--**	IE 버전별 
		//--**	IE 11 이하 -> 8 배
		var v = 8;
		/*
		if ( IDV_BROWSER.IE === "Y"){
			if (IDV_BROWSER.VER < 12){
				v = 8;
			}
		}
		*/
		
		//--**	위아래 4줄씩 이동
		var k = this.viewRowCnt/2; //(parseInt(this.scroller.offsetHeight) / this.viewRowCnt) / 10;
		if ((ev.wheelDelta || -40 * ev.detail) >= check ){	//	wheel 올림
			this.scroller.scrollTop -= (k * v);
		} else if ((ev.wheelDelta || -40 * ev.detail) <= (-1 * check) ) {	//	wheel 내림
			this.scroller.scrollTop += (k * v);
		}
		
		this.datasetting();
		
		return false;
	}	
	
	//-------------------------------------------------------
	//	tr mouseover 시 
	//-------------------------------------------------------
	this.trmouseover = function(oo){
		
		var idx = Number($U.get(oo,"idx"));
		$U.set($hA("table tbody tr", this.fdiv)[idx], "class" , "over");
		$U.set($hA("table tbody tr", this.nfdiv)[idx], "class" , "over");
		
	}	
	
	//-------------------------------------------------------
	//	tr mouseout 시 
	//-------------------------------------------------------
	this.trmouseout = function(oo){
		
		var idx = Number($U.get(oo,"idx"));
		$U.set($hA("table tbody tr", this.fdiv)[idx], "class" , "out");
		$U.set($hA("table tbody tr", this.nfdiv)[idx], "class" , "out");
		
	}	
	
	//-------------------------------------------------------
	//	td click 시 
	//-------------------------------------------------------
	this.tdclick = function(oo){

		//--**	click 이벤트가 없으면 pass
		if ($U.isNullOrEmpty($U.get(oo,"click"))) return;
		
		var didx,rdata;
		try{
			
			didx = Number($U.get(oo.parentElement, "dataidx"));
			rdata =	this.data.rows[didx];
			window[$U.get(oo,"click")](rdata[$U.get(oo,"colname")], rdata);
			
		} catch(e){
			//alert("[ G2 > tdclick ]" + e);
			console.log("EE=[" + $U.get(oo,"click")  + "], error=" + e);
		} finally {
			didx	=	null;
			rdata	=	null;
		}
		
	}	
	
	//-------------------------------------------------------
	//-------------------------------------------------------
	//--**	EVENT END
	//-------------------------------------------------------
	//-------------------------------------------------------
	
	//-------------------------------------------------------
	//	data 처리
	//-------------------------------------------------------
	this.datasetting =	function(){
		
		var ooo = this;
		setTimeout(function(){ooo.datasettingdetail()}, 1);
	
	}
	//-------------------------------------------------------
	//	data 처리 detail
	//-------------------------------------------------------
	this.datasettingdetail  = function(){
		
		var fttr,nfttr,rs,rdata,otd, ho;
		try{
			
			//--**	cell clear..
			this.cellclear();
			
			//--**	toprow를 구한다
			this.toprowset();
			
			if ($U.isNull(this.data)){
				return;
			}
			
			if (this.data.rows.length === 0){
				
				//--**	information display
				this.information("해당 조건에 대한 데이타가 존재하지 않습니다...");
				return;
			}

			//--**	table tr set
			fttr	=	$hA("table tbody tr", this.fdiv);
			nfttr	=	$hA("table tbody tr", this.nfdiv);
			rs		=	this.data.rows.length < this.viewRowCnt ? this.data.rows.length : this.viewRowCnt ;
			
			//--**	데이타를 화면에 write 한다.
			for (var qq=0,ww=rs; qq<ww; qq+=1){
				
				rdata =	this.data.rows[Number(this.topRow)+qq-1];
				if ($U.isNullOrEmpty(rdata)){
					continue;
				} 
				
				otd = $hA("td", fttr[qq]);
				for (var i=0,j=Number(this.fixCnt); i<j; i+=1){
					ho	=	this.header[i];
					otd[i].innerHTML = this.setvalue({	type : ho["type"]
													, 	data : $U.nvl(rdata[ho["id"]],"")  
													, 	alldata : rdata
													, 	formatter : ho["formatter"]} );
					$U.set(otd[i], "title", otd[i].innerHTML);
					if (i === 0) $U.set(otd[0].parentElement,"dataidx",this.topRow+qq-1);
				}
				
				
				otd = $hA("td", nfttr[qq]);
				for (var i=Number(this.fixCnt),j= this.header.length; i<j; i+=1){
					ho	=	this.header[i];
					otd[i-Number(this.fixCnt)].innerHTML = this.setvalue({	type : ho["type"]
																		, 	data : $U.nvl(rdata[ho["id"]],"")
																		, 	alldata : rdata
																		, 	formatter : ho["formatter"]} );
					$U.set(otd[i-Number(this.fixCnt)], "title", otd[i-Number(this.fixCnt)].innerHTML);
					if (i-Number(this.fixCnt) === 0) $U.set(otd[0].parentElement,"dataidx",this.topRow+qq-1);
				}
			}

			this.rowspanproc(); 

		}catch(e){
			alert("[ G2 > datasetting ]" + e);
		
		}finally{
			
			var ooo = this;
			$U.eventbind( $hA("table tbody tr .G2checkbox", this.fdiv), "onclick", function(){ ooo.G2checkboxclick(this); });
			$U.eventbind( $hA("table tbody tr .G2checkbox", this.nfdiv), "onclick", function(){ ooo.G2checkboxclick(this); });
			
			fttr	=	null;
			nfttr	=	null;
			rs		=	null;
			rdata	=	null;
			otd		=	null;
			ho		=	null;
		}
		
	}
	
	//-------------------------------------------------------
	//	rowspan 처리
	//-------------------------------------------------------
	this.rowspanproc = function(){
		
		if (this.rowSpan === ""){
			return;
		}
		
		var p, ra;
		try{
			p 	=	new Array();
			ra	=	this.rowSpan.split(",");
			for (var rr=0,rroo; rroo=ra[rr]; rr+=1){
				if (Number(rroo) >= this.fixCnt){
					p.push({"tab": $hD("table tbody", this.nfdiv), "col" : Number(rroo) - this.fixCnt });	
				} else {
					p.push({"tab": $hD("table tbody", this.fdiv), "col" : Number(rroo) });	
				}
			}
			yTableRowSpanSetForMulti( p, 0 );	
			
		} catch(e){
			alert("[ G2 > rowspanproc ]" + e);
		
		} finally {
				p	=	null
			,	ra	=	null;
		}
	}	
	
	//-------------------------------------------------------
	//	cell clear
	//-------------------------------------------------------
	this.cellclear = function(){

		var fttr,nfttr,otd;
		try{
		
			fttr	=	$hA("table tbody tr", this.fdiv);
			nfttr	=	$hA("table tbody tr", this.nfdiv);
			for (var qq=0,ww=this.viewRowCnt; qq<ww; qq+=1){
				otd = $hA("td", fttr[qq]);
				for (var i=0,j=Number(this.fixCnt); i<j; i+=1){
					otd[i].innerHTML = "";
				}
				otd = $hA("td", nfttr[qq]);
				for (var i=Number(this.fixCnt),j= this.header.length; i<j; i+=1){
					otd[i-Number(this.fixCnt)].innerHTML = "";
				}
			}
		
		}catch(e){
			alert("[ G2 > cellclear ]" + e);
		
		}finally{
			
			fttr	=	null;
			nfttr	=	null;
			otd		=	null;
		}
		
	}
	
	//-------------------------------------------------------
	//	sort, filter 템플릿 오픈
	//-------------------------------------------------------
	this.popup = function(o){
		
		var fv = $U.get(o.parentElement,"xg-field");
		var ooo = this;
		
		new $P({	target		:	ooo
				,	template	:	"#template_G2_sortfilter"
				,	title		:	"G2 Sort / Filter"
				,	button		:	"Search,Cancel"		//	Save, Delet	e, Confirm, Select, Search, Cancel	중 선택
				,	afterOpen	:	function(poo){
						
						var fao,fd,p,ao,s,lvv,uvv;
						try{
							
							//--**	button event binding
							//$U.eventbind(poo.buttonobj["Confirm"], "onclick", function(){ poo.close(); });
							$U.eventbind(poo.buttonobj["Search"], "onclick", function(){ poo.attr.target.call(poo.attr.target.param); poo.close(); });
							$U.eventbind(poo.buttonobj["Cancel"], "onclick", function(){ poo.close(); });
							$U.eventbind($hA("section[name=G2_popup_sortarea] span a", poo.olayer), "onclick" , function(){ poo.attr.target.popupsortclick(this,fv); });
							$U.eventbind($hA("section[name=G2_popup_keycheckarea] input", poo.olayer), "onkeyup" , function(){ poo.attr.target.popupkeycheckup(this,fv); });
							
							//--**	keycheck 여부를 확인
							fao = $U.find($hA("span",poo.attr.target.functionarea),"name","keycheck_"+fv);
							if (!$U.isNull(fao)){
								ao 	= 	$hA("a",fao)[0];
								$hD("input[name=keycheckvalue]",poo.olayer).value	=   ao.innerHTML;
							}
							
							//--**	sort 여부를 확인
							fao = $U.find($hA("span",poo.attr.target.functionarea),"name","sort_"+fv);
							if (!$U.isNull(fao)){
								if ($U.get(fao,"sort") === "ASC"){
									$hD("a[name=sortdown]",poo.olayer).className	=	"sel";
								} else {
									$hD("a[name=sortup]",poo.olayer).className	=	"sel";
								}
							}
							
							//--**	filter 여부를 확인
							fao = $U.find($hA("span",poo.attr.target.functionarea),"name","filter_"+fv);
							if (!$U.isNull(fao)){
								ao 	= 	$hA("a",fao);
								s	=	"";
								for (var op=0,ol=ao.length-1;op<ol;op+=1){
									s	+=	ao[op].outerHTML;
								}
								$hD("div[name=filtercaption]",poo.olayer).innerHTML	= s;
								$U.eventbind($hA("div[name=filtercaption] a", poo.olayer), "onclick", function(){ $U.remove(this); poo.attr.target.popupfilterreset(poo.olayer,fv); } )
								
							}
							
							$hD("article h2",poo.olayer).innerHTML	=	o.innerHTML;

							var fd = $U.CamelToUnder(fv);
							
							var p 	= 	"page=" 		+ 	"1" 
									+	"&pageRowCnt=" 	+	"100000000"
									+	"&rowFirst=" 	+	"0" 
									+	"&rowLast=" 	+ 	"100000000"
									+	"&sort="		
									+	"&filter="		
									+	"&keycheck="		
									+	"&getdata="		+	"g2total,"+fd
									+	"&groupby="		+	"GROUP BY " + fd 
									+	"&"+ this.param;
							
							$A.call({url:poo.attr.target.url,param:p,ptype:"string"}, function(data){
								
								if (data.rows.length > 1000){
									//alert("Filter 항목이 1000개를 초과합니다.\r\n1000개 까지만 Filter 처리가 가능합니다");
									$hD("div[name=filterarea]",poo.olayer).innerHTML  =	"Filter 항목이 1000개를 초과합니다.<br>1000개 까지만 Filter 처리가 가능합니다<br>조회기능을 이용하세요";
									$hD("div[name=filtercount]",poo.olayer).innerHTML =	"total : - " ;
								} else {
									var s="";
									try{
										
										data.rows.sort(function(a,b){
											lvv = a[fv.toLowerCase()]||a[fv.toUpperCase()];
											uvv = b[fv.toLowerCase()]||b[fv.toUpperCase()];
											return lvv > uvv;
										});
										
										data.rows.sort();
										
										for (var f=0,goo;goo=data.rows[f];f+=1){
											lvv = goo[fv.toLowerCase()]||goo[fv.toUpperCase()];
											lvv = $U.isNullOrEmpty(lvv) ? "NULL" : lvv;  
											s	+=	"<a>"+ lvv + "</a>"
										}
										
										$hD("div[name=filterarea]",poo.olayer).innerHTML =	s;
										$hD("div[name=filtercount]",poo.olayer).innerHTML =	"total : " + data.rows.length;
										$U.eventbind($hA("div[name=filterarea] a", poo.olayer), "onclick" , function(){ poo.attr.target.popupfilterclick(this,fv); });
										
									} finally{
										s	=	null;
									}
								}
								
							});
							
							
						} catch(e){
							alert("[ G2 > popup ]" + e);
						} finally {
							fao	=	null;
							fd	=	null;
							p	=	null;
							ao	=	null;
							s	=	null;
							lvv	=	null;
							uvv	=	null;
						}	
					
					}	
				},{w:700,h:540,mw:300,mh:300}
		);
		
	}
	
	//-------------------------------------------------------
	//	popup keycheck keyup
	//-------------------------------------------------------
	this.popupkeycheckup = function(koo,fv){
		
		var obj,o;
		try{
			//--**	G2에 세팅
			o = $U.find(this.header,"id",fv);
			$U.remove($U.find($hA("span",this.functionarea),"name","keycheck_" + fv));
			this.functionarea.innerHTML += $U.format(G2_KEYCHECK_TEMPLATE, "keycheck_" +fv, o.id, "", o.title, "<a>" + koo.value + "</a>");
			$U.eventbind($hA(".keycheck > a", this.functionarea), "onclick", function(){ $U.remove(this); } );
			
		} catch(e){
			alert("[ G2 > keycheck ] " + e);
		} finally {
			obj		=	null;
			o		=	null;
		}
		
	}
	
	//-------------------------------------------------------
	//	init key make
	//-------------------------------------------------------
	this.initkeymake = function(){
		
		var obj,o;
		try{

			//--**	G2에 세팅
			if ($U.isNull(this.initkey.length)){
				
				o = $U.find(this.header,"id",this.initkey.keyid);
				this.functionarea.innerHTML += $U.format(G2_KEYCHECK_TEMPLATE, "keycheck_" +this.initkey.keyid, o.id, "", o.title, "<a>" + this.initkey.keyvalue + "</a>");
				$U.eventbind($hA(".keycheck > a", this.functionarea), "onclick", function(){ $U.remove(this); } );
				
			} else {
				for (var i=0,jsono; jsono=this.initkey[i]; i+=1){
					
					o = $U.find(this.header,"id",jsono.keyid);
					this.functionarea.innerHTML += $U.format(G2_KEYCHECK_TEMPLATE, "keycheck_" +jsono.keyid, o.id, "", o.title, "<a>" + jsono.keyvalue + "</a>");
					$U.eventbind($hA(".keycheck > a", this.functionarea), "onclick", function(){ $U.remove(this); } );
				
				}	
			}
			
		} catch(e){
			alert("[ G2 > initkeymake ] " + e);
		} finally {
			obj		=	null;
			o		=	null;
		}
		
	}
	
	//-------------------------------------------------------
	//	popup sortclick
	//-------------------------------------------------------
	this.popupsortclick = function(soo,fv){
		
		var obj,o,stype,itag;
		try{
			$U.remove($U.find($hA("span",this.functionarea),"name","sort_" + fv));
			if (soo.className === "nosel"){
				$hA("a",soo.parentElement)[0].className = "nosel";
				$hA("a",soo.parentElement)[1].className = "nosel";
				soo.className	=	"sel";
				o = $U.find(this.header,"id",fv);
				if (soo.name === "sortdown"){
					stype	=	"ASC";
					itag	=	"<i class='fas fa-sort-alpha-down'></i>";					
				} else {
					stype	=	"DESC";
					itag	=	"<i class='fas fa-sort-alpha-up'></i>";					
				}
				this.functionarea.innerHTML += $U.format(G2_SORT_TEMPLATE, "sort_" + fv, o.id, stype, o.title, itag);
				
			} else {
				soo.className	=	"nosel";
			}
			
		} catch(e){
			alert("[ G2 > popupsortclick ] " + e);
		} finally {
			obj		=	null;
			o		=	null;
			stype	=	null;
			itag	=	null;
		}
		
	}
	
	//-------------------------------------------------------
	//	init sort make
	//-------------------------------------------------------
	this.initsortmake = function(){
		
		var obj,o,stype,itag,jsono;
		try{
			
			if ($U.isNull(this.initsort.length)){
				
				o = $U.find(this.header,"id",this.initsort.sortid);
				if (this.initsort.sorttype.toUpperCase() === "ASC"){
					stype	=	"ASC";
					itag	=	"<i class='fas fa-sort-alpha-down'></i>";					
				} else {
					stype	=	"DESC";
					itag	=	"<i class='fas fa-sort-alpha-up'></i>";					
				}
				this.functionarea.innerHTML += $U.format(G2_SORT_TEMPLATE, "sort_" + this.initsort.sortid, o.id, stype, o.title, itag);
				
			} else {

				for (var i=0,jsono; jsono=this.initsort[i]; i+=1){
					o = $U.find(this.header,"id",jsono.sortid);
					if (jsono.sorttype.toUpperCase() === "ASC"){
						stype	=	"ASC";
						itag	=	"<i class='fas fa-sort-alpha-down'></i>";					
					} else {
						stype	=	"DESC";
						itag	=	"<i class='fas fa-sort-alpha-up'></i>";					
					}
					this.functionarea.innerHTML += $U.format(G2_SORT_TEMPLATE, "sort_" + jsono.sortid, o.id, stype, o.title, itag);
				}
			};
				
		} catch(e){
			alert("[ G2 > initsortmake ] " + e);
		} finally {
			obj		=	null;
			o		=	null;
			stype	=	null;
			itag	=	null;
			jsono	=	null;
		}
		
	}
	
	//-------------------------------------------------------
	//	popup filterclick
	//-------------------------------------------------------
	this.popupfilterclick = function(foo,fv){
		
		var obj,txt,oxo,o;
		try{
			
			//--**	popup 화면에 세팅
			obj = foo.parentElement.parentElement;
			txt	= foo.innerHTML;	
			oxo = $U.find($hA("div[name=filtercaption] a", obj),"name",txt);
			if (!$U.isNull(oxo)){
				$U.remove(oxo);
			}
			
			$hD("div[name=filtercaption]", obj).innerHTML += $U.format("<a name='{0}'>{0}</a>", txt);
			
			var ooo = this;
			$U.eventbind($hA("div[name=filtercaption] a", obj), "onclick", function(){ $U.remove(this); ooo.popupfilterreset(foo.parentElement.parentElement, fv); } )
			
			//--**	G2에 세팅
			o = $U.find(this.header,"id",fv);
			$U.remove($U.find($hA("span",this.functionarea),"name","filter_" + fv));
			this.functionarea.innerHTML += $U.format(G2_FILTER_TEMPLATE, "filter_" +fv, o.id, "", o.title, $hD("div[name=filtercaption]", obj).innerHTML);
			$U.eventbind($hA(".filter > a", this.functionarea), "onclick", function(){ $U.remove(this); } );
			
		} catch(e){
			alert("[ G2 > popupfilterclick ] " + e);
		} finally {
			obj	=	null;
			txt	=	null;
			oxo	=	null;
			o	=	null;
		}
	
	}
	
	//-------------------------------------------------------
	//	init filter make
	//-------------------------------------------------------
	this.initfiltermake = function(){
		
		var o,aoo,foo;
		try{
			if ($U.isNull(this.initfilter.length)){
				
				aoo = this.initfilter.filter.split("$^$");
				foo = "";
				for (var i=0,oooo;oooo=aoo[i];i+=1){
					foo += "<a name='"+oooo+"'>" + oooo + "</a>"
				}
				
				//--**	G2에 세팅
				o = $U.find(this.header,"id",this.initfilter.filterid);
				$U.remove($U.find($hA("span",this.functionarea),"name","filter_" + this.initfilter.filterid));
				this.functionarea.innerHTML += $U.format(G2_FILTER_TEMPLATE, "filter_" + this.initfilter.filterid, o.id, "", o.title, foo );
				$U.eventbind($hA(".filter > a", this.functionarea), "onclick", function(){ $U.remove(this); } );
				
			} else {
				for (var i=0,jsono; jsono=this.initfilter[i]; i+=1){

					aoo = jsono.filter.split("$^$");
					foo = "";
					for (var ii=0,oooo;oooo=aoo[ii];ii+=1){
						foo += "<a name='"+oooo+"'>" + oooo + "</a>"
					}
					
					//--**	G2에 세팅
					o = $U.find(this.header,"id",jsono.filterid);
					$U.remove($U.find($hA("span",this.functionarea),"name","filter_" + jsono.filterid));
					this.functionarea.innerHTML += $U.format(G2_FILTER_TEMPLATE, "filter_" + jsono.filterid, o.id, "", o.title, foo );
					$U.eventbind($hA(".filter > a", this.functionarea), "onclick", function(){ $U.remove(this); } );
				
				}	
			}
			
			
		} catch(e){
			alert("[ G2 > initfiltermake ] " + e);
		} finally {
			o	=	null;
			aoo =	null;
			foo = 	null
		}
	
	}

	//-------------------------------------------------------
	//	popup filterreset
	//-------------------------------------------------------
	this.popupfilterreset = function(foo,fv){
		
		var obj,o;
		try{
			
			obj = foo;
			
			//--**	G2에 세팅
			o = $U.find(this.header,"id",fv);
			$U.remove($U.find($hA("span",this.functionarea),"name","filter_" + fv));
			if ($U.isNullOrEmpty($hD("div[name=filtercaption]", obj).innerHTML)) return;
			this.functionarea.innerHTML += $U.format(G2_FILTER_TEMPLATE, "filter_" +fv, o.id, "", o.title, $hD("div[name=filtercaption]", obj).innerHTML);
			
		} catch(e){
			alert("[ G2 > popupfilterreset ] " + e);
		} finally {
			obj	=	null;
			o	=	null;
		}
	
	}

	//-------------------------------------------------------
	//	keycheck setting
	//-------------------------------------------------------
	this.keycheckset = function(){
		var r="",o,ao;
		try{
			o	=	$hA(".keycheck",this.functionarea);
			if (o.length === 0) return "";
			r	=	"";
			for (var rr=0,soo;soo=o[rr]; rr+=1){
				r	+=	" AND " + $U.format(IMS_config.dbnullType,$U.CamelToUnder($U.get(soo,"field"))) + " LIKE '##" +  $hA("a",soo)[0 ].innerHTML + "##' " ;
			}
			return this.dataconversion(r);
		} catch(e){
			alert("[ G2 > keycheckset ]" + e)
		} finally {
			r	=	null;
			o	=	null;
		}
		
	}
	
	//-------------------------------------------------------
	//	sort setting
	//-------------------------------------------------------
	this.sortset = function(){
		var r="",o;
		try{
			o	=	$hA(".sort",this.functionarea);
			if (o.length === 0) return "";
			r	=	"ORDER BY ";
			for (var rr=0,soo;soo=o[rr]; rr+=1){
				r	+=	(rr===0 ? "" : "," ) + $U.CamelToUnder($U.get(soo,"field")) + " " +  $U.get(soo,"sort");
			}
			return this.dataconversion(r);
		} catch(e){
			alert("[ G2 > sortset ]" + e)
		} finally {
			r	=	null;
			o	=	null;
		}
	
	}
	
	//-------------------------------------------------------
	//	filter setting
	//-------------------------------------------------------
	this.filterset = function(){
		var r="",o,ao;
		try{
			o	=	$hA(".filter",this.functionarea);
			if (o.length === 0) return "";
			r	=	"";
			for (var rr=0,soo;soo=o[rr]; rr+=1){
				r	+=	" AND " + $U.format(IMS_config.dbnullType,$U.CamelToUnder($U.get(soo,"field"))) + " IN ( " ;
				ao	=	$hA("a",soo);
				for (var xx=0,yy=ao.length-1;xx<yy; xx+=1){
					r	+= (xx===0? "" : ",") + "'" + $U.get(ao[xx],"name") + "'";
				}
				r += ") ";
			}
			return this.dataconversion(r);
		} catch(e){
			alert("[ G2 > sortset ]" + e)
		} finally {
			r	=	null;
			o	=	null;
		}
		
	}
	
	//-------------------------------------------------------
	//	data conversion
	//-------------------------------------------------------
	this.dataconversion = function(idata){
		idata	=	idata.replace(/&amp;/g,"^^AMP^^");
		return idata;
	}
	
	//-------------------------------------------------------
	//-------------------------------------------------------
	//--**	data external getting 
	//-------------------------------------------------------
	//-------------------------------------------------------

	//-------------------------------------------------------
	//	check data getting
	//-------------------------------------------------------
	this.getcheckdata = function(){
		var redata;
		try{
			
			redata	=	[];
			for (var i=0,ooo; ooo=this.data.rows[i]; i+=1){
				if (ooo["g2check"] === true ){
					redata.push(ooo);	
				};
			}
			return redata;
			
		} catch(e){
			alert("[ G2 > getcheckdata ]" + e);
		} finally {
			redata	=	null;
		}
	}
	
	//-------------------------------------------------------
	//	check data setting
	//-------------------------------------------------------
	this.setcheckdata = function(obj,key){
		try{
			
			for (var x=0,okey; okey=obj[x]; x+=1){
				for (var i=0,ooo; ooo=this.data.rows[i]; i+=1){
					if (ooo[key] == okey ){	//--**	값만 비교하도록 
						ooo["g2check"] = true;
						break;
					};
				}
			}
			this.datasetting();
			
		} catch(e){
			alert("[ G2 > setcheckdata ]" + e);
		} finally {
		}
	}
	
	//-------------------------------------------------------
	//	data getting	
	//	{ keyid	:	"",	keyvalue	:	"",	targetid	:	"",	targetvalue	:	"" }		
	//	keyid		:	로우를 찾는데 사용할 KEY ID
	//	keyvalue	:	로우를 찾는데 사용할 KEY VALUE
	//	targetid	:	변경할  ID
	//	targetvalue	:	변경할  VALUE
	//-------------------------------------------------------
	this.datasetbykey = function(p){
		try{
			for (var i=0,ooo; ooo=this.data.rows[i]; i+=1){
				if (ooo[p.keyid] === p.keyvalue ){
					ooo[p.targetid]	=	p.targetvalue;
					break;
				};
			}
			this.datasetting();
		} catch(e){
			alert("[ G2 > datasetbykey ]" + e);
		} finally {
		}
	}
	
	//-------------------------------------------------------
	//	success func
	//-------------------------------------------------------
	this.success = function(){
		if ($U.isNullOrEmpty(this.option.success)) return;
		this.option.success();
	}
	
	//-------------------------------------------------------
	//	fail func
	//-------------------------------------------------------
	this.fail = function(){
		if ($U.isNullOrEmpty(this.option.fail)) return;
		this.option.fail();
	}
	
	//-------------------------------------------------------
	//	Memory Release
	//-------------------------------------------------------
	this.release = function(){
		this.G2o		=	null;
		this.id			=	null;
		this.url		=	null;
		this.headerHeight	=	null;
		this.headerRowCnt	=	null;
		this.rowHeight	=	null;
		this.pageRowCnt	=	null;
		this.viewRowCnt	=	null;
		this.fixCnt		=	null;
		this.rowSpan	=	null;
		this.mode		=	null;
		this.headergroup	=	null;
		this.header		=	null;
		this.group		=	null;
		this.page		=	null;
		this.loader		=	null;
		this.sort		=	null;
		this.filter		=	null;
		this.rowFirst	=	null;
		this.rowLast	=	null;
		this.funcdiv	=	null;	
		this.fdiv		=	null;
		this.nfdiv		=	null;
		this.footer		=	null;
		this.scroller	=	null;
		this.topRow		=	null;
		this.data		=	null;
		this.G2info		=	null;
		this.stime		=	null;
		this.etime		=	null;
		this.functionarea	=	null;
		this.param		=	null;
		this.success	=	null;
		this.fail		=	null;
		this.option		=	null;
		this.initoption	=	null;
		this.initsort	=	null;
		this.initfilter	=	null;
		this.initkey	=	null;
		this.G2frame	=	null;
	}
	
	//-------------------------------------------------------
	//	G2 remove
	//-------------------------------------------------------
	this.remove = function(){
		var poo = this.G2o.parentElement;
		var frame = this.G2frame;
		$U.remove(this.G2o);
		this.release();
		poo.innerHTML = frame;
	}
	
	if ($U.isNull(xoo)) return;
	
	//--**	Attribute define
	this.G2o			=	xoo;
	this.G2frame		=	xoo.outerHTML;
	this.id				=	xoo.getAttribute("id");
	this.url			=	xoo.getAttribute("url");
	this.pageNaviYN		=	xoo.getAttribute("pageNaviYN");
	this.headerHeight	=	xoo.getAttribute("headerHeight");
	this.headerRowCnt	=	xoo.getAttribute("headerRowCnt"); 
	this.rowHeight		=	xoo.getAttribute("rowHeight");
	this.pageRowCnt		=	xoo.getAttribute("pageRowCnt");
	this.viewRowCnt		=	xoo.getAttribute("viewRowCnt");
	this.fixCnt		=	xoo.getAttribute("fixCnt");
	this.rowSpan	=	xoo.getAttribute("rowSpan"); 
	this.mode		=	xoo.getAttribute("mode");
	this.headergroup	=	JSON.parse( this.headergroupset(xoo.getAttribute("headergroup")) );
	this.header		=	JSON.parse( this.headerset(xoo.getAttribute("header")) );
	this.group		=	xoo.getAttribute("group");
	this.page		=	xoo.getAttribute("page");
	this.loader		=	null;
	this.sort		=	null;
	this.filter		=	null;
	this.rowFirst	=	null;
	this.rowLast	=	null;
	this.funcdiv	=	null;	
	this.fdiv		=	null;
	this.nfdiv		=	null;
	this.footer		=	null;
	this.scroller	=	null;
	this.topRow		=	null;
	this.data		=	null;
	this.G2info		=	null;
	this.stime		=	null;
	this.etime		=	null;
	this.functionarea	=	null;
	this.param		=	param;
	this.option		=	option;
	this.initoption	=	initoption;
	this.initkey	=	$U.isNull(initoption) ? null : initoption.initkey;
	this.initsort	=	$U.isNull(initoption) ? null : initoption.initsort;
	this.initfilter	=	$U.isNull(initoption) ? null : initoption.initfilter;
	
	//--**	validate
	if ($U.isNullOrEmpty(this.id)){
		alert("id is necessary !!!!");
		return;
	}
	if ($U.isNullOrEmpty(this.url)){
		alert("url is necessary !!!!");
		return;
	}
	if ($U.isNullOrEmpty(this.header)){
		alert("header info is necessary !!!!");
		return;
	}
	this.headerHeight	=	$U.isNullOrEmpty(this.headerHeight) ? "30" : this.headerHeight;
	this.headerRowCnt	=	$U.isNullOrEmpty(this.headerRowCnt) ? "1" : this.headerRowCnt;
	this.rowHeight		=	$U.isNullOrEmpty(this.rowHeight) ? "25" : this.rowHeight;
	this.pageRowCnt		=	$U.isNullOrEmpty(this.pageRowCnt) ? IMS_config.G2_defaultrowcnt : this.pageRowCnt;
	this.viewRowCnt		=	$U.isNullOrEmpty(this.viewRowCnt) ? "20" : this.viewRowCnt;
	this.fixCnt			=	$U.isNullOrEmpty(this.fixCnt) ? "0" : this.fixCnt;
	this.rowSpan		=	$U.isNullOrEmpty(this.rowSpan) ? "" : this.rowSpan;
	this.mode			=	$U.isNullOrEmpty(this.mode) ? "view" : this.mode;
	this.page			=	$U.isNullOrEmpty(this.page) ? "1" : this.page;
	
	//--**	생성 수행
	this.create();
	
	//--**	사이즈 조정
	this.resize();
	
	//--**	초기 key 값이 있을경우 처리 
	//--**	{keyid:,keyvalue: }
	if (!$U.isNull(this.initkey)){
		this.initkeymake();
	}
	
	//--**	초기 sort 값이 있을경우 처리 
	//--**	{sortid:,sorttype:}
	if (!$U.isNull(this.initsort)){
		this.initsortmake();
	}
	
	//--**	초기 filter 값이 있을경우 처리 
	//--**	{filterid:,filter:}
	if (!$U.isNull(this.initfilter)){
		this.initfiltermake();
	}
	
	//--**	초기검색인 경우 검색 수행
	if (option.InitialSearch){
		this.call(this.param);
	}
	
}

$U.eventbind( window, "onresize",	function(){
	if ($U.isNull(G2Object)) {
		return;
	}
	for (var vv=0,ooo; ooo=G2Object[vv]; vv+=1){
		ooo.resize();
	}
} );

$U.eventbind( window, "onbeforeunload",	function(){
	if ($U.isNull(G2Object)) {
		return;
	}
	for (var vv=0,ooo; ooo=G2Object[vv]; vv+=1){
		ooo.release();
		$U.remove(ooo);
	}
	G2Object	=	null;
} );


//--**	로컬 함수 로서 소트의 ASC DESC 변경
function _sort_change(obj){
	if ($U.get(obj.parentNode, "sort") === "ASC"){
		$U.set(obj.parentNode, "sort" ,"DESC");
		obj.innerHTML = "<i class='fas fa-sort-alpha-up'></i>";
	} else {
		$U.set(obj.parentNode, "sort" ,"ASC");
		obj.innerHTML = "<i class='fas fa-sort-alpha-down'></i>";
	}
}


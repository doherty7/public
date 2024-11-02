function lnbEvent(){
	var $lnbEvent = $('.lnbEvent');
	var dt = $lnbEvent.find('dt');
	var dd = $lnbEvent.find('dd');

	$(document).on({
		click: function(e){
			e.preventDefault()
			var $this = $(this);
			dt.removeClass('on')
			if( $this.next('dd').css('display')== 'none' ){
				dd.slideUp();
				$this.next('dd').slideDown().end().addClass('on');
			}else{
				$this.next('dd').slideUp();
			}
		}
	}, '.lnbEvent dt')

};

function Folnb(){
	var $FoContainer = $('.FoContainer');
	var $Folnb = $('#Folnb');
	var $FoContainerH = $FoContainer.height();
	$Folnb.height($FoContainerH);
	$(document).on({
		click: function(e){
			e.preventDefault()
			var $this = $(this);
			if( $FoContainer.hasClass('on') ){
				$FoContainer.removeClass('on');
			}else{
				$FoContainer.addClass('on')
			}
		}
	}, '#Folnb .folnbBtn');
}

function Folnb(){
	var $FoContainer = $('.FoContainer');
	var $Folnb = $('#Folnb');
	var $FoContainerH = $FoContainer.height();
	$Folnb.height($FoContainerH);
	$(document).on({
		click: function(e){
			e.preventDefault()
			var $this = $(this);
			if( $FoContainer.hasClass('on') ){
				$FoContainer.removeClass('on');
			}else{
				$FoContainer.addClass('on')
			}
		}
	}, '#Folnb .folnbBtn');
}

/**
 * 기능명 : 관리자 왼쫀 메뉴 활성화 제어
 * 작성자 : 강민석
 * 작성일 : 2018.03.12
 * 설명 : 브라우져 문서 스캔시 관리자클래스 요소가 존재하면 동작한다.
 * @returns
 */
function Adminlnb(){
	
	var popupYN	=	$U.isNull($hD("#Adminlnb")) ? false : $hD("#Adminlnb").style.display === "none";
	if (popupYN){
		return;
	}
	
	var ElementLength	= $hA('.adminContainer').length;
	//console.log('ElementLength : ' , ElementLength);
	if(ElementLength > 0){
		var $AdminContainer = $('.adminContainer');
		var $Adminlnb = $hD('#Adminlnb');
		var $AdminContainerH = $AdminContainer.height();
		var frametd = $hA("#frameTable tbody td");
		$U.set($Adminlnb, "style", "height:" + $AdminContainerH + "px");
		$(document).on({
			click: function(e){
				e.preventDefault();
				var $this = $(this);
				if( $AdminContainer.hasClass('on') ){
					$AdminContainer.removeClass('on');
					$U.set($Adminlnb, "style", "height:" + $AdminContainerH + "px;display:none;");
					$this.html("<i class='fas fa-chevron-right'></i>");
					frametd[0].style.width = "0px";
				}else{
					$AdminContainer.addClass('on')
					$U.set($Adminlnb, "style", "height:" + $AdminContainerH + "px;display:;");
					$this.html("<i class='fas fa-chevron-left'></i>");
					frametd[0].style.width = "100px";
				}
			}
		}, '.adminLnbBtn');
	}
}

$(function(){
	new lnbEvent();// lnb 이벤트
	new Folnb();
	new Adminlnb();

	function mailSelect(){
	   var $userEmail = $('.selectMail'),
		    $this,
		    $mailAdress = $('.mailAdress');

	   $userEmail.change(function(){ 
		    $this = $(this);
			$this.find('option:selected').each(function (){
			 
			 if( $(this).val() == '1'){ //직접입력일 경우
					
				$this.parents('.selectbox')
					  .prev('.mailAdress')
					  .focus()
					  .val('')
				      .attr('readonly',false);
			 }else{ //직접입력이 아닐경우
				
				$this.parents('.selectbox')
					  .prev('.mailAdress')
					  .val($this.find('option:selected').text())
				      .attr('readonly',true);
			 }

		  });

	   });
	
	}
	
	new mailSelect();

	var fileTarget = $('.filebox .upload-hidden');

    fileTarget.on('change', function(){
        if(window.FileReader){
            var filename = $(this)[0].files[0].name;
        } else {
            var filename = $(this).val().split('/').pop().split('\\').pop();
        }

        $(this).siblings('.upload-name').val(filename);
    });

    /* table mouse on - 20190329 추가 */
	var $tbl_hover = $(".tbl_list tr");
	$tbl_hover.hover(function(){
		$tbl_hover.removeClass("on");
		$(this).addClass("on");
	}, function(){
		$tbl_hover.removeClass("on");
	});
})

//--**	2019.04.29	이상준 추가
var $U = {

		tocurrency	:
			function(num){
				var deg;
				try{
					num = typeof num ===  "number" ? num.toString() : num ;
					num	= num.replace(/,|-/g,"");
					num = typeof(num) === "string" ? Number(num) : num ;
					if (num.toString().indexOf(".")>-1){
						deg	=	"." + num.toString().split(".")[1];
					} else {
						deg =	"";
					}
					return num.toLocaleString().split(".")[0] + deg;
					
				} catch(e){
					alert("[tocurrency]" + e);
				} finally{
					deg	=	null;
				}
			}
}


/*


$(document).ready(function(){
	 var selectTarget = $('.selectbox select');

	 selectTarget.on('blur', function(){
	   $(this).parent().removeClass('focus');
	 });

  selectTarget.change(function(){
    var select_name = $(this).children('option:selected').text();

  $(this).siblings('label').text(select_name);
  });
});
*/


/* 로드시 전체 select 체크 후 라벨에 적용*/

/*
$(window).load(function(){
	 var selectTarget = $('.selectbox select');

	selectTarget.each(function(){
		 var select_name = $(this).children('option:selected').text();
		 $(this).siblings('label').text(select_name);
	})
})*/
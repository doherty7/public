
$(function () {
	// 헤시값을 메뉴로 동일하게 전달합니다.
	if (location.hash) {
		var iframes = document.getElementsByTagName("iframe");
		if (iframes && iframes.length > 0) {
			iframes[0].src = iframes[0].src + location.hash;
		}
	}
	// 메뉴 버튼
	var btnMenu = document.querySelector("#btn-mobile-menu");
	if (btnMenu) {
		btnMenu.addEventListener("click", function (evt) {
			var snb = document.querySelector(".snb");
			var isVisible = snb.className.indexOf(" visible") >= 0;
			if (!snb) return;
			if (isVisible) {
				snb.className = "snb";
			} else {
				snb.className = "snb visible";
			}
		}, false);
	}

	if (window.addEventListener) {
		window.addEventListener("message", function (evt) {		
			document.location.href = evt.data;
		}, false);
	}

	// syntax highlighting
	prettyPrint();
});
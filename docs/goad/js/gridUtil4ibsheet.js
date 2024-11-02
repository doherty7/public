var _sheet = [];
var SHEET;
var GRID_EXL_URL = ""; //ie9 호환을 위한 첨부파일 url
$(document).ready(function () {
    SHEET = function (gridId, op) {
        //rMateGridH5에서 그리드 생성 준비가 완료될 경우 호출할 함수를 지정합니다.
        var _this = this;
        _sheet.push(this);
        this.gridApp;
        this.gridRoot;
        this.dataGrid;
        this.collection;
        this.jsVars = "rMateOnLoadCallFunction=" + gridId + ".gridReadyHandler&showLoadingBar=true";
        this.gridId = gridId;
        this.gridIdPrefix = "_id";

        // 상세화면에서 뒤로가기 시 페이지 번호를 유지하기 위한 변수
        this.isLoad = false;
        this.gridCurrentPageId = "gridCurrentPage_" + location.href + "_" + this.gridId;
        this.gridRowsPerPageId = "gridRowsPerPage_" + location.href + "_" + this.gridId;

        this.op = op || {};
        this.url = op.url;
        this.columns = op.columns;
        this.formId = op.formId || "";
        this.param = op.param || "";
        
        // 페이징 네비게이션
        this.isPaging = op.pagingId ? true : false;
        this.pagingId = op.pagingId || "";

        // 한페이지에 노출할 갯수를 지정하는 콤보박스 태그
        this.isPagingUnit = op.pagingUnitId ? true : false;
        this.pagingUnitId = op.pagingUnitId || "";
        this.pagingUnitList = op.pagingUnitList || [10, 20, 30, 40];

        // 총 카운트
        this.isTotalCount = op.totalCountId ? true : false;
        this.totalCountId = op.totalCountId || "";

        // excel
        this.progressBar;
        this.isExcelExport = op.isExcelExport || false;

        // 셀클릭 콜백함수
        this.callbackItemClickHandler = op.callbackItemClickHandler || "";

        // 페이징 관련 자바스크립트
        this.gridTotalRowCount = 0;    // 전체 데이터 건수 - html이 서버에서 작성될때 반드시 넣어줘야 하는 변수입니다.
        this.gridRowsPerPage = op.gridRowsPerPage || 10;   // 1페이지에서 보여줄 행 수
        this.gridViewPageCount = op.gridViewPageCount || 10;     // 페이지 네비게이션에서 보여줄 페이지의 수
        this.gridCurrentPage = 1;    // 현재 페이지
        this.gridTotalPage = Math.ceil(this.gridTotalRowCount + 1 / this.gridRowsPerPage); // 전체 페이지 계산

        // 화면에 표시할 맨앞으로 와 맨뒤로, 앞으로, 뒤로 문구 - 이미지를 쓸 경우 img 태그로 대체
        this.gridStartTxt = "≪";
        this.gridEndTxt = "≫";
        this.gridPrevTxt = "◀";
        this.gridNextTxt = "▶";
        this.gridPageGapTxt = " ";   // 페이지 사이의 구분을 위한 문자 - 사용하지 않을 경우 공백을 넣습니다.

        // 트리변수
        this.isTreeData = op.isTreeData || false;
        this.levelFieldName = op.levelFieldName;
        this.childrenAttributeName = "children";

        // ibsheet ID
        this.sheetId = _this.gridId + _this.gridIdPrefix;

        //그리드 상세 화면 진입 여부
        this.isGoDetail = false;

        //높이 지정 관련 옵션 추가 로직
        this.gridForceHeight = op.gridForceHeight || '100%';
        
        // 그리드 생성
        this.init = function () {
            this.drawPaging();
            this.drawPagingUnit();
            IBSheet.create({
                id: this.gridId + this.gridIdPrefix,
                el: this.gridId,
                options: op.columns
            });
        }

        // 그리드 생성 콜백함수
        this.gridReadyHandler = function (gridId) {
//            _this.gridApp = document.getElementById(gridId);  // 그리드를 포함하는 div 객체
//            _this.gridRoot = _this.gridApp.getRoot();   // 데이터와 그리드를 포함하는 객체
//
//            _this.gridApp.setDataType("json");
//            _this.gridApp.setLayout(_this.columns);

//            _this.gridRoot.addEventListener("layoutComplete", _this.layoutCompleteHandler);
//            _this.gridRoot.addEventListener("itemDataChanged", _this.itemDataChanged);
        }

        // 검색
        this.search = function () {
            var loadSearch = setInterval(function () {
                //ibsheet 객체가 생성되었는지 확인
                if (typeof window[_this.sheetId] != "undefined" && window[_this.sheetId]["initFinished"]) {
                    clearInterval(loadSearch);
                    _this.search();
                }
            }, 10);
            this.search = function () {
                if (this.isPaging) {
                    this.gridCurrentPage = 1;

                    // 상세화면에서 뒤로가기 버튼을 통해 진입한 경우 로컬스토리지의 값을 이용한다.
                    if (!this.isLoad) {
                        this.gridCurrentPage = (localStorage.getItem(this.gridCurrentPageId) == null || localStorage.getItem(this.gridCurrentPageId) == 'null') ? this.gridCurrentPage : localStorage.getItem(this.gridCurrentPageId);
                        this.gridRowsPerPage = (localStorage.getItem(this.gridCurrentPageId) == null || localStorage.getItem(this.gridRowsPerPageId) == 'null') ? this.gridRowsPerPage : localStorage.getItem(this.gridRowsPerPageId);
                        this.isLoad = true;
                    }
                    this.gridMovePage(this.gridCurrentPage);

                } else {
                    this.gridSearch();
                }

                //this.gridRoot.addEventListener("dataComplete", this.dataCompleteHandler);

            }
        }

        this.layoutCompleteHandler = function (event) {

            _this.dataGrid = _this.gridRoot.getDataGrid();  // 그리드 객체

            if (typeof _this.callbackItemClickHandler == "function") {
                _this.dataGrid.addEventListener("itemClick", _this.itemClickHandler);
            }

            // 엑셀다운로드 관련 이벤트
            if (_this.isExcelExport) {
                _this.dataGrid.addEventListener("exportSaveComplete", _this.exportSaveCompleteHandler);
                _this.dataGrid.addEventListener("exportSaveError", _this.exportSaveCompleteHandler);
                _this.dataGrid.addEventListener("progress", _this.exportProgressHandler);
            }

        }

        // 그리드 셀값 직접 변경 이벤트
        this.itemDataChanged = function (event) {
            console.log(_this.gridId, "itemDataChanged");
        }

        // 데이타 setting 후 이벤트(search 등)
        this.dataCompleteHandler = function (event) {
            console.log(_this.gridId, "dataCompleteHandler");
        }

        // 셀클릭 이벤트
        this.itemClickHandler = function (event) {

            var rowIndex = event.rowIndex;
            var columnIndex = event.columnIndex;
            var dataRow = _this.gridRoot.getItemAt(rowIndex);

            // 컬럼중 숨겨진 컬럼(visible false인 컬럼)이 있으면 getDisplayableColumns()를 사용하여 컬럼을 가져옵니다.
            var column = _this.dataGrid.getDisplayableColumns()[columnIndex];
            var dataField = column.getDataField();

            _this.clickData = dataRow[dataField];

            dataRow.gridId = _this.gridId; // 반환값에 그리드id 추가

            _this.callbackItemClickHandler(dataRow);

        }

        // 엑셀 다운로드 완료 이벤트
        this.exportSaveCompleteHandler = function (event) {
            console.log(_this.gridId, "exportSaveCompleteHandler");
            _this.gridRoot.removeProgressBar();
            _this.dataGrid.setEnabled(true);
        }

        // export시 작업진행 상태를 progressBar에 반영합니다.
        this.exportProgressHandler = function (event) {
            var percent = Math.floor(event.bytesLoaded / event.bytesTotal * 100);

            _this.dataGrid.setEnabled(false);
            _this.gridRoot.addProgressBar();
            _this.progressBar = _this.gridRoot.getProgressBar();
            _this.progressBar.setProgress(percent, 100);
            _this.progressBar.setLabel("Processing " + percent + "%");

            if (percent == 100) {
                _this.gridRoot.removeProgressBar();
                _this.dataGrid.setEnabled(true);
            }

        }

        this.showLoadingBar = function () {
            window[_this.sheetId].showMessage("데이터를 조회 중입니다...");
            //_this.dataGrid.setEnabled(false);
            //_this.gridRoot.addLoadingBar();
        }

        this.hideLoadingBar = function () {
            window[_this.sheetId].hideMessage();
//            _this.dataGrid.setEnabled(true);
//            _this.gridRoot.removeLoadingBar();
        }

        // 그리드 검색 이벤트
        this.gridSearch = function (addParam) {

            var data = null;

            //2021.10.14 검색 공백 제거
            if (_this.formId) {
            	var arr = $("#" + _this.formId + " input[type=text]");
            	for(var i = 0; i< arr.length; i++){
            		if(!$(arr[i]).hasClass("hasDatepicker")){
            			var text = $(arr[i]).val();
            			text = text.trim();
            			$(arr[i]).val(text);
            		}
            	}
            	data = $("#" + _this.formId).serialize();
            }
            /*if (_this.formId) {
                data = $("#" + _this.formId).serialize();
            }*/
            if (_this.param) {
                data = data + "&" + $.param(_this.param);
            }
            if (addParam) {
                data = data + addParam;
            }

            //rowSize 변경하기
            data = data.split("&").map(function (item) {
                if (item.indexOf("rowSize=") == 0) {
                    item = "rowSize=100000";
                }
                return item;
            }).join("&");

            _this.showLoadingBar();
            $.ajax({
                url: _this.url,
                dataType: "json",
                type: "post",
                data: data,
                success: function (result) {

                    if (_this.isPaging) {
                        window[_this.sheetId].PageLength = $("#unitSelect_grid").val();
                        _this.setGridPagingData(result)
                    } else {
                        _this.setGridData(result)
                    }

                    try {
                        if (!$U.isNull(result.data2)) {
                            fnGrdRslt(result.data2);
                        }
                    } catch (e) {
                    }

                    _this.hideLoadingBar();

                    _this.gridScreenResize();

                },
                error: function () {
                    _this.hideLoadingBar();
                }
            })
        }

        // 그리드 페이징 네비게이션 클릭 이벤트
        this.gridMovePage = function (goPage) {
            this.gridCurrentPage = goPage;

            var pageCount = this.gridRowsPerPage * this.gridCurrentPage - this.gridRowsPerPage;
            var addParam = "&" + $.param({pageCount: pageCount, rowSize: this.gridRowsPerPage});

            localStorage.setItem(this.gridCurrentPageId, this.gridCurrentPage);
            localStorage.setItem(this.gridRowsPerPageId, this.gridRowsPerPage);

            this.gridSearch(addParam);

        }

        this.convertToHierarchy = function (levelFieldName, childrenAttributeName, arr) {
            var fldNm = levelFieldName;
            var childrenAttrNm = childrenAttributeName;
            var src = arr;
            var treeArr = [];
            var lookup = {};
            var key = 0, currentArr, lastRow;

            for (var i = 0; i < arr.length; i++) {
                var row = src[i];
                var k = row[fldNm];
                if (k == key) {
                    currentArr.push(row);
                } else if (k == 1) {
                    treeArr.push(row);
                    currentArr = treeArr;
                    lookup[k] = {parent: currentArr};
                } else if (k > key) {
                    if (!lastRow[childrenAttrNm])
                        lastRow[childrenAttrNm] = [];
                    lastRow[childrenAttrNm].push(row);
                    currentArr = lastRow[childrenAttrNm];
                    lookup[k] = {parent: currentArr};
                } else {
                    currentArr = lookup[k].parent;
                    currentArr.push(row);
                }
                lastRow = row;
                key = k;
            }

            return treeArr;

        }

        this.setGridData = function (data) {
            var gridListData;
            if (_this.isTreeData) {
//                gridListData = _this.convertToHierarchy(_this.levelFieldName, _this.childrenAttributeName, data.list);
                data.list.map(function (item) {
                    item["Level"] = item[_this.levelFieldName];
                });
                gridListData = IBSheet.v7.convertTreeData(data.list);
            } else {
                gridListData = data.list;
            }
            window[this.sheetId].loadSearchData({"data": data.list});
//            this.gridApp.setData(gridListData);
            if (typeof data.list !== 'undefined'){
                this.setTotalCount(data.list.length);
            }
            
            //2021.08.23 데이터 양이 적을 시 동적으로 높이 조절.
            //데이터 총 개수 구해지면 높이 재조절.
            this.changePageRowSize(document.getElementById('unitSelect_' + this.gridId));
        }

        this.setGridPagingData = function (data) {
            //this.gridApp.setData(data.list);
            window[this.sheetId].loadSearchData({"data": data.list});

            this.setTotalCount(data.listCount);
            this.gridTotalRowCount = data.listCount;
            this.gridTotalPage = Math.ceil(this.gridTotalRowCount / this.gridRowsPerPage); // 전체 페이지 계산
            this.drawGridPagingNavigation(this.gridCurrentPage);
            
            //2021.08.23 데이터 양이 적을 시 동적으로 높이 조절.
            //데이터 총 개수 구해지면 높이 재조절.
            this.changePageRowSize(document.getElementById('unitSelect_' + this.gridId));
        }

        this.setTotalCount = function (totalCount) {
            if (this.isTotalCount) {
                var totalCount = totalCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                $("#" + this.totalCountId).text(totalCount);
            }
        }

        // 페이징 노출 갯수 콤보박스 태그 생성 >> 페이징 아닌 단순 시트 height 조절기능으로 변경
        this.drawPagingUnit = function () {
            if (this.isPagingUnit) {
                var storageSize = localStorage.getItem(this.gridRowsPerPageId);
                var select_cnt = 20;
                var str = "";
                str += "<label for=\"unitLabel_" + this.gridId + "\">" + (storageSize == null ? 10 : storageSize) + "개씩 보기</label>"
                str += "<select id=\"unitSelect_" + this.gridId + "\" onchange=\"" + this.gridId + ".changePageRowSize(this); return false;\">";
                for (var i = 0; i < this.pagingUnitList.length; i++) {
                    var size = this.pagingUnitList[i];
                    str += "<option value=\"" + size + "\" " + (storageSize == size ? "selected" : "") + ">" + size + "개씩 보기</option>";

                    if (i == 0) {
                        if (storageSize == null) {
                            select_cnt = size;
                        } else {
                            select_cnt = storageSize;
                        }
                    }
                }
                str += "</select>";
                $("#" + this.pagingUnitId).html(str);
                
                var height = 120 + (30 * select_cnt);
                $('#' + this.gridId).parent().css("height", height);
            }
        }

        // 페이징 콤보박스 체인지 이벤트
        this.changePageRowSize = function (obj) {
            var select_name = $(obj).children('option:selected').text();
            
            $(obj).siblings('label').text(select_name);
            //시트 객체 높이 변경
            var select_cnt = $(obj).val();
            //var height = 120 + (30.5 * select_cnt);
            // ibsheer의 경우 사이즈가 맞지 않아 강제로 height 사이즈 조정
            var height = 0;
            
            //2021.08.23 데이터 양이 적을 시 동적으로 높이 조절.
            var cnt = window[this.sheetId].getDataRows().length;

            var headerRows = window[this.sheetId].getHeaderRows();

            if(select_name == ""){
            	if(parseInt(cnt) > 10){
            		height = 420;
            	}else{
            		if(parseInt(cnt) == 0){
            			height = 131;
            		}else{
            			height = 84 + (30 * cnt);
            		}
            	}
            }else{
            	if(parseInt(cnt) == 0){
            		height = 131;
            	}else if (parseInt(cnt) <= parseInt(select_cnt)){
            		height = 84 + (30 * cnt);
            	}else if(parseInt(cnt) > parseInt(select_cnt)) {
            		switch(select_cnt){
            		case "10" : height = 420; break;
            		case "20" : height = 720; break;
            		case "40" : height = 1330; break;
            		case "60" : height = 1940; break;
            		default :   height = 120 + (30.5 * select_cnt); break;
            		}
            	}
            }
            
            //헤더가 두 줄 이상으로 병합 되었을 시
            if(headerRows.length > 1){
    			height += (34*(headerRows.length-1));
    		}
            
            //스크롤바 없을 시 높이 감소
            var scroll = document.getElementsByClassName('IBHScrollMid');
            var td = scroll[0].parentNode;
            var tr = td.parentNode;
            
            if($(tr).css("display") == 'none'){
            	height -= 18;
            }
            
            //필터 없을 시 높이 감소
            if(window[this.sheetId].Rows["Filter"]["Visible"] == 0){
            	height -= 30;
            }
            
            //합계 행 존재 시 높이 증가
            if(window[this.sheetId].Rows["FormulaRow"]["Visible"] == 1){
            	height += 30;
            }
            
            //그리드 내부가 외부 넓이와 비슷 한경우 세로 스크롤생성 하면서 1개 결과시 가림수정
            var giRwWid = window[this.sheetId].ColNames[1].Width;
            var giToTalWid = document.getElementById(this.gridId).offsetWidth;
            if(giRwWid < giToTalWid && (giToTalWid - giRwWid < 30)){
                height += 2;
            }

            $('#' + this.gridId).parent().css("height", height);

            //시트 페이지 사이즈 변경
            window[this.sheetId].updateClientPaging(select_cnt);

            //페이지 변경시 첫페이지로 이동
            window[this.sheetId].goToPageByIndex(1);

            //하단 페이지 인덱스 수정
            this.gridRowsPerPage = $(obj).val();
            this.gridCurrentPage = 1;
            this.gridTotalPage = Math.ceil(this.gridTotalRowCount / this.gridRowsPerPage);
            this.drawGridPagingNavigation(this.gridCurrentPage);

        }

        //--**	이상준 추가 화면 리사이즈 처리
        this.gridScreenResize = function () {

            //20200729 shkim 일단 막자.
            return;

            var total = $U.isNullOrEmpty(this.totalCountId) ? 0 : Number($hD("#" + this.totalCountId).innerHTML.replace(/,/g, ""));

            //--**	hscroll 확인
            var w = this.gridRoot._sheet._displayWidth;
            var warr = this.gridRoot._sheet._hscrollColumns;
            var ichk = 0;
            for (var qqqq = warr.length - 1, qooo; qooo = warr[qqqq]; qqqq -= 1) {
                if (qooo > w) {
                    ichk = 1;
                    break;
                }
            }

            //--**
            if (this.isPagingUnit) {

                var irow = parseInt(this.gridRowsPerPage);
                irow = (total !== 0 && total < irow) ? total : irow;
                var iheight = ((irow + ichk) * this.gridRoot._sheet._rowHeight) + this.gridRoot._sheet._headerHeight + 15;
                var gobj = $hD("#" + this.gridId);
                var robj = $hA(".rMateH5__Root", gobj)[0];
                var dobj = $hA(".rMateH5__rMateGrid .rMateH5__DataGrid", gobj)[0];

                gobj.style.height = iheight + "px";
                robj.style.height = iheight + "px";
                dobj.style.height = iheight + "px";
            }
        }

        // 페이징 네비게이션 태그 생성
        this.drawPaging = function () {
            if (this.isPaging) {
                $("#" + this.pagingId).empty();
            }
        }
        // 페이징
        this.sheetMovePage = function (pageIdx) {
            window[this.sheetId].goToPageByIndex(pageIdx);
            this.drawGridPagingNavigation(pageIdx);
        }

        // 주어진 페이지 번호에 따라 페이지 네비게이션 html을 만들고 gridPageNavigationDiv에 innerHTML로 넣어줍니다.
        this.drawGridPagingNavigation = function (goPage) {
            //소팅 캔슬시 goPage가 0으로 들어옴.
            if (goPage == 0) goPage = 1;

            var pagingTag = document.getElementById(this.pagingId);
            
            //2021.08.23 : 페이징 없으면 pagingTag 가 null이라 오류 발생. null 아닌 경우에만 처리.
            if(pagingTag != null){
            	if (this.gridTotalPage == 0) {
            		pagingTag.innerHTML = "<span class='gridPagingDisable'>" + this.gridStartTxt + "</span> <span class='gridPagingDisable'>" + this.gridPrevTxt + "</span> <span class='gridPagingDisable'>" + this.gridNextTxt + "</span> <span class='gridPagingDisable'>" + this.gridEndTxt + "</span>";
            		return;
            	}
            	
            	var retStr = "";
            	var prepage = parseInt((goPage - 1) / this.gridViewPageCount) * this.gridViewPageCount;
            	var nextpage = ((parseInt((goPage - 1) / this.gridViewPageCount)) * this.gridViewPageCount) + this.gridViewPageCount + 1;
            	
            	// 맨앞으로
            	retStr += "<span class=";
            	if (goPage > 1) {
            		retStr += "'gridPagingMove'><a href='javascript:" + this.gridId + ".sheetMovePage(1)'>" + this.gridStartTxt + "</a></span> ";
            	} else {
            		retStr += "'gridPagingDisable'>" + this.gridStartTxt + "</span> ";
            	}
            	
            	// 앞으로
            	retStr += "<span class=";
            	if (goPage > this.gridViewPageCount) {
            		retStr += "'gridPagingMove'><a href='javascript:" + this.gridId + ".sheetMovePage(" + prepage + ")'>" + this.gridPrevTxt + "</a></span>&nbsp; ";
            	} else {
            		retStr += "'gridPagingDisable'>" + this.gridPrevTxt + "</span>&nbsp; ";
            	}
            	
            	for (var i = (1 + prepage); i < this.gridViewPageCount + 1 + prepage; i++) {
            		if (goPage == i) {
            			retStr += "<span class='gridPagingCurrent'>";
            			retStr += i;
            			retStr += "</span>";
            		} else {
            			retStr += "<span>";
            			retStr += "<a href='javascript:" + this.gridId + ".sheetMovePage(" + i + ")'>" + i + "</a>";
            			retStr += "</span>";
            		}
            		
            		if (i >= this.gridTotalPage) {
            			retStr += " ";
            			break;
            		}
            		
            		if (i == this.gridViewPageCount + prepage)
            			retStr += " ";
            		else
            			retStr += this.gridPageGapTxt;
            	}
            	
            	// 뒤로
            	retStr += "&nbsp;<span class=";
            	if (nextpage <= this.gridTotalPage) {
            		retStr += "'gridPagingMove'><a href='javascript:" + this.gridId + ".sheetMovePage(" + nextpage + ")'>" + this.gridNextTxt + "</a></span> ";
            	} else {
            		retStr += "'gridPagingDisable'>" + this.gridNextTxt + "</span> ";
            	}
            	
            	// 맨뒤로
            	retStr += "<span class=";
            	if (goPage != this.gridTotalPage) {
            		retStr += "'gridPagingMove'><a href='javascript:" + this.gridId + ".sheetMovePage(" + this.gridTotalPage + ")'>" + this.gridEndTxt + "</span>";
            	} else {
            		retStr += "'gridPagingDisable'>" + this.gridEndTxt + "</span>";
            	}
            	pagingTag.innerHTML = retStr;
            }
        }
    }
});

$(window).on('beforeunload', function (event) {
    if (typeof _sheet !== 'undefined' && _sheet.length > 0) {
        for (var i = 0; i < _sheet.length; i++) {
            if (!_sheet[i].isGoDetail) {
                localStorage.setItem(_sheet[i].gridCurrentPageId, null);
            }
        }
    }
});

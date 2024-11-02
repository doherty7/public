
rMateGridH5.style31 = {
	DataGrid : {
		Styles : {
			alternatingItemColors: ["#FFFFFF", "#F9F9F9"],
			fontSize : "12px",
			border : "#555555 solid 1px",
			headerColors: ["#6E7376", "#6E7376"],
			headerSeparatorColor: "#AAB3B3",
			headerHorizontalSeparatorColor: "#AAB3B3",
			horizontalGridLineColor: "#CCCCCC",
			headerPaddingTop : 3,
			headerPaddingBottom : 3,
			headerBorderTopWidth : 0,
			headerBorderBottomWidth : 0,
			headerRollOverColor: "#C6C6C5",
			lockedLineColor: "#BBBBBB",
			rollOverColor: "#C6C6C5",
			selectionColor: "#A9CD31",
			paddingTop : 3,
			paddingBottom : 3,
			verticalGridLineColor : "#E7EBEF",
			textRollOverColor: "#FFFFFF", // "#2B333C",
			textSelectedColor: "#FFFFFF" // "#2B333C"
		}
	},
	DataGridColumn : {
		Styles : {
			paddingLeft : "5px",
			paddingRight : "3px"
		}
	},
	DataGridSortItemRenderer : {
		Constants : {
			UP_ICON_NAME : "up-arrow-white.png",
			DOWN_ICON_NAME : "down-arrow-white.png"
		}
	},
	Styles : {
		rMateDataGridHeaderStyles : {
			color : "#FFFFFF"
		}
	},
};


rMateGridH5.style31 = {
	ResourceBundle : {
		"ko-KR" : {
			shared : {
				"dateFormat":"YYYY-MM-DD"
			},
			controls : {
				"firstDayOfWeek" : 0,
				"dayNamesShortest" : "일,월,화,수,목,금,토"
			}
		}
	}
};

rMateGridH5.setConfig(rMateGridH5.style31);
rMateGridH5.setAssetsPath("/lib/rMate/rMateGridH5/Assets/")

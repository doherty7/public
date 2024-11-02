
    
var layouts = { 
	"Accessibility_Selector_CheckBoxItem" : "<rMateGrid>\
		<NumberFormatter id=\"numfmt\" useThousandsSeparator=\"true\"/>\
		<DataGrid id=\"dg1\" horizontalScrollPolicy=\"auto\" verticalAlign=\"middle\" selectionMode=\"multipleRows\" textAlign=\"center\">\
			<columns>\
	<!--\n\
	DataGridSelectorColumn 클래스를 사용하여 사용자의 행 선택용 컬럼을 만들 수 있습니다\n\
	allowAllSelection: 헤더의 CheckBox를 통해 전체를 선택 또는 해제할 수 있는 기능을 제공할 지 여부. (\"true\",\"false\"중 택일 기본값 \"true\")\n\
	allowMultipleSelection: 여러 행 선택가능여부 조정 (\"true\",\"false\"중 택일 기본값 \"true\")\n\
	-->\n\
				<DataGridSelectorColumn id=\"selector\" width=\"40\" textAlign=\"center\" backgroundColor=\"#EDEDF0\"/>\
				<DataGridColumn dataField=\"From\" width=\"80\"/>\
				<DataGridColumn dataField=\"Subject\" width=\"150\"/>\
				<DataGridColumn dataField=\"ReceiveDate\" headerText=\"Receive\"/>\
				<DataGridColumn dataField=\"CC\"/>\
				<DataGridColumn dataField=\"Level\" width=\"90\" textAlign=\"right\"/>\
				<DataGridColumn dataField=\"Length\" textAlign=\"right\" formatter=\"{numfmt}\"/>\
				<DataGridColumn dataField=\"AttachCount\" textAlign=\"right\" formatter=\"{numfmt}\"/>\
			</columns>\
		</DataGrid>\
	</rMateGrid>\
	",
	"basic" : "<rMateGrid>\
		<NumberFormatter id=\"numfmt\" useThousandsSeparator=\"true\"/>\
		<DataGrid id=\"dg1\" horizontalScrollPolicy=\"auto\" verticalAlign=\"middle\" selectionMode=\"singleRow\" textAlign=\"center\">\
			<columns>\
	<!--\n\
	DataGridSelectorColumn 클래스를 사용하여 사용자의 행 선택용 컬럼을 만들 수 있습니다\n\
	allowAllSelection: 헤더의 CheckBox를 통해 전체를 선택 또는 해제할 수 있는 기능을 제공할 지 여부. (\"true\",\"false\"중 택일 기본값 \"true\")\n\
	allowMultipleSelection: 여러 행 선택가능여부 조정 (\"true\",\"false\"중 택일 기본값 \"true\")\n\
	-->\n\
				<DataGridColumn dataField=\"CODE_ID\" headerText='코드 아이디' width=\"120\"/>\
				<DataGridColumn dataField=\"CODE_ID_NM\" headerText='코드 아이디 명' width=\"150\"/>\
				<DataGridColumn dataField=\"CL_CODE\" headerText='코드' width=\"150\"/>\
				<DataGridColumn dataField=\"CODE_ID_DC\" headerText=\"상세 설명\"/>\
			</columns>\
		</DataGrid>\
	</rMateGrid>\
	"
	,"edit" : "<rMateGrid>\
		<ContextMenu id=\"cMenu\">\
			<ContextMenuItem caption=\"Insert Row\"/>\
			<ContextMenuItem caption=\"Delete Row\"/>\
		</ContextMenu>\
		<NumberFormatter id=\"numfmt\" useThousandsSeparator=\"true\"/>\
		<DataGrid id=\"dg1\" contextMenu=\"{cMenu}\" horizontalScrollPolicy=\"auto\" verticalAlign=\"middle\" selectionMode=\"multipleRows\" textAlign=\"center\" editable=\"true\">\
			<columns>\
	<!--\n\
	DataGridSelectorColumn 클래스를 사용하여 사용자의 행 선택용 컬럼을 만들 수 있습니다\n\
	allowAllSelection: 헤더의 CheckBox를 통해 전체를 선택 또는 해제할 수 있는 기능을 제공할 지 여부. (\"true\",\"false\"중 택일 기본값 \"true\")\n\
	allowMultipleSelection: 여러 행 선택가능여부 조정 (\"true\",\"false\"중 택일 기본값 \"true\")\n\
	-->\n\
				<DataGridColumn dataField=\"CODE_ID\" headerText='코드 아이디' width=\"120\" editable='false'/>\
				<DataGridColumn dataField=\"CODE_ID_NM\" headerText='코드 아이디 명' width=\"150\"/>\
				<DataGridColumn dataField=\"CL_CODE\" headerText='코드' width=\"150\"/>\
				<DataGridColumn dataField=\"CODE_ID_DC\" headerText=\"상세 설명\"/>\
			</columns>\
		</DataGrid>\
	</rMateGrid>\
	"
}
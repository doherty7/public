(function () {
    var messages = {
        "message.alert.alreadyRegisteredName": "Tên đã được đăng ký.",
        "message.alert.beforeExpiredLicense": "Giấy phép Synap Editor hết hạn trong ${} ngày nữa. Làm ơn lấy chìa khóa xe mới.",
        "message.alert.cannotInsertFileInTheArea": "Không thể chèn tệp vào khu vực.",
        "message.alert.cannotUseImport": "Chức năng nhập không có sẵn.",
        "message.alert.duplicatedId": "Id trùng lặp",
        "message.alert.enterUrl": "Hãy nhập URL.",
        "message.alert.failedAutoSave": "Không thể lưu tự động",
        "message.alert.failedEditorInitialize": "Không thể tìm thấy yếu tố tương ứng với Editor ID.",
        "message.alert.failedOpenDocument": "Mở văn bản không thành công.",
        "message.alert.failedOpenLayout": "Mở layout không thành công.",
        "message.alert.failedOpenTemplate": "Mở Template không thành công.",
        "message.alert.failedUploadPartial": "Không thể chèn tệp có định dạng không được hỗ trợ hoặc tệp có dung lượng quá tải.",
        "message.alert.fileSizeExceeded": "Kích cỡ tệp quá lớn.",
        "message.alert.hasHiddenCells": "Có các ô ẩn trong khu vực được chọn.",
        "message.alert.incorrectUsage": "Cách sử dụng không chính xác.",
        "message.alert.insertFile": "Hãy chèn tệp.",
        "message.alert.invalidLicense": "License không hợp lệ.",
        "message.alert.invalidSourceCode": "Source code không đúng.",
        "message.alert.noContents": "Nội dung của tài liệu trong lựa chọn bị thiếu.",
        "message.alert.notFoundConfig": "Không thể tìm thấy thông tin Config.",
        "message.alert.notFoundLicense": "Không thể tìm thấy thông tin License.",
        "message.alert.notSelectedImportArea": "Không có khu vực đã được chọn.",
        "message.alert.notSupportedFile": "Tệp không được hỗ trợ.",
        "message.alert.nothingToDelete": "Không có thông tin để xóa.",
        "message.alert.nothingToRecover": "Không có thông tin để khôi phục.",
        "message.alert.pasting": "Dán...",
        "message.alert.rendering": "Rendering...",
        "message.alert.replaceAll": "Tổng cộng có #{totals} trường hợp đã được sửa.",
        "message.alert.testLicense": "Đây là một giấy phép thử nghiệm.",
        "message.alert.unableUploadFile": "Không thể tải tệp lên.",
        "message.alert.uploadingDocument": "Tải lên tài liệu...",
        "message.alert.uploadingFile": "Tải tệp lên...",
        "message.alert.xfdCol": "Các hàng hoặc cột trong tài liệu được mở rộng đến giá trị lớn nhất của chúng (1048576, XFD). <br> Để chỉnh sửa suôn sẻ, hãy kết thúc vùng bằng # {endCell}. <br> Vui lòng đặt lại khu vực nếu cần thiết.",
        "message.confirm.append": "Nối",
        "message.confirm.chooseImportMethod": "Vui lòng chọn phương thức nhập.",
        "message.confirm.delete": "Bạn có muốn xóa?",
        "message.confirm.notifyCellCountLimit1": "Chỉnh sửa có thể không trơn tru vì có quá nhiều tế bào. Bạn có muốn mở tài liệu?",
        "message.confirm.notifyCellCountLimit2": "Trình duyệt của bạn có thể dừng lại vì có quá nhiều ô. Bạn có muốn mở tài liệu?",
        "message.confirm.openDocument": "Bạn có muốn mở văn bản?",
        "message.confirm.overwrite": "Ghi đè",
        "message.error.cellEndValueError": "Giá trị bắt đầu không thể lớn hơn giá trị cuối.",
        "message.error.cellValueError": "Loại không hợp lệ.",
        "message.error.editInException": "Xảy ra lỗi",
        "message.label.DivProperties": "Thuộc tính Layer.",
        "message.label.ImageProperties": "Thuộc tính ảnh",
        "message.label.VideoProperties": "Thuộc tính video",
        "message.label.about": "Thông tin SynapEditor",
        "message.label.absolutePositionDiv": "Vẽ Layer",
        "message.label.align": "Căn chỉnh",
        "message.label.alt": "Tất cả văn bản",
        "message.label.auto": "Tự động",
        "message.label.autoSelect": "Tự động lựa chọn",
        "message.label.availableFileFormats": "Định dạng sẵn có",
        "message.label.background": "Nền",
        "message.label.backgroundColor": "Màu nền",
        "message.label.blackCircle": "Vòng tròn đen",
        "message.label.blackDiamond": "Kim cương đen",
        "message.label.blackSquare": "Hình vuông đen",
        "message.label.block": "Khối",
        "message.label.blockDiv": "Layer",
        "message.label.bold": "In đậm",
        "message.label.bookmark": "Đánh dấu trang",
        "message.label.borderColor": "Màu đường viền",
        "message.label.borderStyle": "Kiểu đường viền",
        "message.label.borderWidth": "Độ dày đường viền",
        "message.label.bottom": "Bên dưới",
        "message.label.bottomAlign": "Căn chỉnh dưới",
        "message.label.bringForward": "Mang về phía trước",
        "message.label.bringToFront": "Mang ra phía trước",
        "message.label.bulletedList": "Ký hiệu gạch đầu dòng",
        "message.label.caption": "Chú thích",
        "message.label.cellProperties": "Thuộc tính ô",
        "message.label.cellSize": "Độ lớn ô",
        "message.label.cellSizeEqual": "Đồng nhất độ lớn ô",
        "message.label.centerAlign": "Căn giữa",
        "message.label.clearArea": "khu vuc sach se",
        "message.label.clearAreaAll": "Xóa toàn bộ khu vực",
        "message.label.columnWidthEqual": "Đồng nhất độ lớn cột",
        "message.label.contain": "Contain",
        "message.label.containAndCover": "Contain, Cover",
        "message.label.contentsProperties": "Thuộc tính khu vực nội dung",
        "message.label.conversion": "Chuyển đổi",
        "message.label.copy": "Sao chép",
        "message.label.copyRunStyle": "Sao chép định dạng",
        "message.label.cover": "Cover",
        "message.label.coverAndContain": "Cover, Contain",
        "message.label.custom": "tập quán",
        "message.label.customParagraphStyle": "Định dạng đoạn văn bản tùy chỉnh",
        "message.label.customRunStyle": "Định dạng phông chữ tùy chỉnh",
        "message.label.cut": "Cắt",
        "message.label.dashedBorder": "Đường nét đứt",
        "message.label.decreaseIndent": "Thụt đầu dòng",
        "message.label.defaultKey": "Mặc định",
        "message.label.deleteCol": "Xóa cột",
        "message.label.deleteDiv": "Xóa layer",
        "message.label.deleteImage": "Xóa Image",
        "message.label.deleteRow": "Xóa hàng",
        "message.label.deleteShape": "Delete Shape",
        "message.label.deleteTable": "Xóa bảng",
        "message.label.deleteVideo": "Xóa Video",
        "message.label.desktop": "máy tính để bàn",
        "message.label.dottedBorder": "Đường chấm chấm",
        "message.label.doubleBorder": "Đường đôi",
        "message.label.file": "Tệp",
        "message.label.findReplace": "Tìm và thay thế",
        "message.label.fitWidth": "Chỉnh theo chiều rộng",
        "message.label.fixed": "Cố định",
        "message.label.fontBackgroundColor": "Màu nền font chữ",
        "message.label.fontColor": "Màu font chữ",
        "message.label.fontFamily": "Kiểu chữ",
        "message.label.fontSize": "Cỡ chữ",
        "message.label.fullScreen": "Toàn màn hình",
        "message.label.growFont": "To hơn một cỡ",
        "message.label.guide": "Xem/ Ẩn Editing Guide",
        "message.label.heading": "Tiêu đề",
        "message.label.heading1": "Tiêu đề 1",
        "message.label.heading2": "Tiêu đề 2",
        "message.label.heading3": "Tiêu đề 3",
        "message.label.heading4": "Tiêu đề 4",
        "message.label.heading5": "Tiêu đề 5",
        "message.label.heading6": "Tiêu đề 6",
        "message.label.help": "Hỗ trợ",
        "message.label.hide": "Ẩn đi",
        "message.label.horizontalLine": "Hàng ngang",
        "message.label.image": "Hình ảnh",
        "message.label.inTableCell": "Chèn vào trong ô",
        "message.label.increaseIndent": "Thụt lề",
        "message.label.increaseQuote": "Cỡ chữ",
        "message.label.inlineBlock": "Inline Block",
        "message.label.inlineTable": "Inline Table",
        "message.label.insertCol": "Chèn cột",
        "message.label.insertFormula": "Chèn công thức",
        "message.label.insertRow": "Chèn hàng",
        "message.label.italic": "In nghiêng",
        "message.label.justifyAlign": "Dàn đều chữ sang hai bên lề",
        "message.label.layout": "Bố trí",
        "message.label.left": "Bên trái",
        "message.label.leftAlign": "Căn lề trái",
        "message.label.lineSpacing": "Khoảng cách dòng",
        "message.label.link": "liên kết",
        "message.label.loadAutoSaveDoc": "Gọi tệp lưu tự động",
        "message.label.lockRatio": "Duy trì",
        "message.label.lowerCase": "Chuyển thành chữ thường",
        "message.label.maximumFileSize": "Kích thước tối đa",
        "message.label.mergeCell": "Gộp ô",
        "message.label.middle": "Giữa",
        "message.label.middleAlign": "Căn giữa",
        "message.label.mobile": "di động",
        "message.label.more": "Nhiều hơn",
        "message.label.multilevelList": "Danh sách đa cấp độ",
        "message.label.new": "Văn bản mới",
        "message.label.noBorder": "Không có đường viền",
        "message.label.noRepeat": "Không lặp lại",
        "message.label.none": "Không có",
        "message.label.normal": "Giá trị cơ bản",
        "message.label.numberFormat": "Định dạng số",
        "message.label.numberFormatAccounting": "₫(1,234.12) (Kế toán)",
        "message.label.numberFormatCurrency": "₫1,234.12 (Tiền tệ)",
        "message.label.numberFormatDate": "2019-04-22 (Ngày)",
        "message.label.numberFormatNumber1": "1,234 (Con số)",
        "message.label.numberFormatNumber2": "1,234.12 (Con số)",
        "message.label.numberFormatPercent1": "12% (Phần trăm)",
        "message.label.numberFormatPercent2": "12.34% (Phần trăm)",
        "message.label.numberFormatScientific": "123E+03 (Thuộc về khoa học)",
        "message.label.numberFormatText": "1234 (Văn bản thô)",
        "message.label.numberFormatTime": "11:10:10 PM (Thời gian)",
        "message.label.numberedList": "Ký hiệu đánh số đầu dòng",
        "message.label.objAlign": "Sắp xếp",
        "message.label.objAlignBottom": "Căn chỉnh dưới",
        "message.label.objAlignCenter": "Căn chỉnh dàn đều sang hai bên",
        "message.label.objAlignLeft": "Căn chỉnh bên trái",
        "message.label.objAlignMiddle": "Căn chỉnh giữa",
        "message.label.objAlignNone": "Không",
        "message.label.objAlignRight": "Căn chỉnh bên phải",
        "message.label.objAlignTop": "Căn chỉnh trên",
        "message.label.objFloatLeft": "Nổi trái",
        "message.label.objFloatRight": "Nổi phải",
        "message.label.open": "Mở ra",
        "message.label.openLink": "Mở đường dẫn",
        "message.label.originSize": "Kích thước gốc",
        "message.label.overwrite": "Ghi đè",
        "message.label.overwriteContents": "Chỉ ghi đè nội dung",
        "message.label.pageBreak": "Tách trang",
        "message.label.paragraph": "Đoạn",
        "message.label.paragraphProperties": "Thuộc tính đoạn",
        "message.label.paste": "Dán",
        "message.label.pasteAsHtml": "Dán dưới dạng HTML",
        "message.label.pasteAsImage": "Dán dưới dạng hình ảnh",
        "message.label.pasteRunStyle": "Dán định dạng",
        "message.label.preview": "Xem trước",
        "message.label.print": "In",
        "message.label.quote": "Dấu ngoặc kép",
        "message.label.redo": "Lặp lại thao tác",
        "message.label.removeRunStyle": "Xóa định dạng",
        "message.label.repeat": "Lặp lại",
        "message.label.repeatX": "Lặp lại theo chiều ngang",
        "message.label.repeatY": "Lặp lại theo chiều dọc",
        "message.label.responsive": "phản ứng nhanh nhẹn",
        "message.label.right": "Bên phải",
        "message.label.rightAlign": "Căn phải",
        "message.label.rotateLeft": "Xoay sang trái",
        "message.label.rotateRight": "Xoay sang phải",
        "message.label.round": "Lặp lại - Mở rộng",
        "message.label.rowHeightEqual": "Đồng nhất độ cao hàng",
        "message.label.ruler": "Cây thước",
        "message.label.scroll": "cuộn",
        "message.label.selectAll": "Chọn tất cả",
        "message.label.selectAllBorder": "Tất cả đường viền",
        "message.label.selectBorder": "Đường viền",
        "message.label.selectBottomBorder": "Đường viền phía dưới",
        "message.label.selectInnerBorder": "Đường viền bên trong",
        "message.label.selectInnerHorizontalBorder": "Đường ngang bên trong",
        "message.label.selectInnerVerticalBorder": "Đường dọc bên trong",
        "message.label.selectLeftBorder": "Đường viền bên trái",
        "message.label.selectNone": "Không chọn",
        "message.label.selectOuterBorder": "Đường viền bên ngoài",
        "message.label.selectRightBorder": "Đường viền bên phải",
        "message.label.selectTopBorder": "Đường viền phía trên",
        "message.label.selectionMode": "Chế độ lựa chọn",
        "message.label.sendBackward": "Gửi trở lại",
        "message.label.sendToBack": "Gửi lại",
        "message.label.set": "Thiết lập",
        "message.label.setHorizontal": "Thiết lập theo hàng ngang",
        "message.label.setStartNumber": "Chỉ định số bắt đầu",
        "message.label.setVertical": "Thiết lập theo hàng dọc",
        "message.label.shortcut": "Phím tắt",
        "message.label.shrinkFont": "Thu nhỏ hơn một cỡ",
        "message.label.solidBorder": "Đường vẽ liền",
        "message.label.sourceCode": "Xem nguồn",
        "message.label.space": "Lặp lại - Khoảng trống",
        "message.label.splitCell": "Phân chia ô",
        "message.label.strike": "Gạch ngang chữ",
        "message.label.subscript": "Đánh chỉ số dưới",
        "message.label.superscript": "Đánh chỉ số trên",
        "message.label.table": "Bảng",
        "message.label.tableProperties": "Thuộc tính bảng",
        "message.label.tablet": "Máy tính bảng",
        "message.label.targetBlank": "Trang mới (_blank)",
        "message.label.targetParent": "Trang gốc (_parent)",
        "message.label.targetSelf": "Cùng trang (_self)",
        "message.label.targetTop": "Trang trên cùng (_top)",
        "message.label.template": "Biểu mẫu",
        "message.label.titleCase": "Chuyển chữ cái đầu từ thành viết hoa",
        "message.label.toggleCase": "Chuyển chữ cái thường, chữ viết hoa",
        "message.label.top": "Trên",
        "message.label.topAlign": "Căn chỉnh trên",
        "message.label.underline": "Gạch chân",
        "message.label.undo": "Hủy thao tác",
        "message.label.unlink": "Bỏ liên kết",
        "message.label.unset": "Hủy",
        "message.label.upperCase": "Chuyển thành chữ viết hoa",
        "message.label.verticalAlign": "Căn chỉnh theo hàng dọc",
        "message.label.video": "chiếu phim",
        "message.label.whiteCircle": "Vòng tròn màu trắng",
        "message.menu.align": "Căn chỉnh",
        "message.menu.cell": "Ô",
        "message.menu.column": "Cột",
        "message.menu.conversion": "Chuyển đổi",
        "message.menu.edit": "Chỉnh sửa",
        "message.menu.file": "Tệp",
        "message.menu.format": "Định dạng",
        "message.menu.help": "Hỗ trợ",
        "message.menu.insert": "Chèn",
        "message.menu.list": "Lời mở đầu",
        "message.menu.numberFormat": "định dạng số",
        "message.menu.paragraph": "Đoạn",
        "message.menu.row": "Hàng",
        "message.menu.table": "Bảng",
        "message.menu.tools": "Công cụ",
        "message.menu.view": "Xem",
        "message.placeholder.formula": "ex) SUM(A1:B2) + C3",
        "message.shortcut.copy": "Sao chép",
        "message.shortcut.cut": "Cắt",
        "message.shortcut.deleteLeft": "Xóa (bên trái)",
        "message.shortcut.deleteLeftLine": "Xóa dòng",
        "message.shortcut.deleteLeftWord": "Xóa từ (bên trái)",
        "message.shortcut.deleteRight": "Xóa (bên phải)",
        "message.shortcut.deleteRightWord": "Xóa từ (bên phải)",
        "message.shortcut.findAndReplace": "Tìm và thay thế",
        "message.shortcut.link": "Chèn đường dẫn (chỉnh sửa)",
        "message.shortcut.open": "Mở",
        "message.shortcut.openLink": "Mở đường dẫn",
        "message.shortcut.pageBreak": "Tách trang",
        "message.shortcut.paste": "Xóa",
        "message.shortcut.print": "In",
        "message.shortcut.redo": "Lặp lại thao tác",
        "message.shortcut.undo": "Hủy thao tác",
        "message.template.Hyperlink": "Hyperlink",
        "message.template.about": "Thông tin",
        "message.template.alert": "Thông báo",
        "message.template.align": "Căn chỉnh",
        "message.template.allTemplate": "Tất cả biểu mẫu",
        "message.template.alt": "Text thay thế",
        "message.template.arrangement": "Sắp xếp",
        "message.template.autoSaveDocument": "Tệp tự động lưu",
        "message.template.background": "Nền",
        "message.template.backgroundColor": "Màu nền",
        "message.template.bookmark": "Đánh dấu trang",
        "message.template.borderAndBackground": "Đường viền và nền",
        "message.template.borderColor": "Màu viền",
        "message.template.borderStyle": "Kiểu đường viền",
        "message.template.borderWidth": "Độ dày đường viền",
        "message.template.bottom": "Bên dưới",
        "message.template.bottomMargin": "Khoảng cách lề dưới",
        "message.template.cancel": "Hủy",
        "message.template.caption": "Phụ đề",
        "message.template.caseSensitivity": "Phân loại chữ thường, chữ viết hoa",
        "message.template.category": "thể loại",
        "message.template.cellProperties": "Thuộc tính ô",
        "message.template.characterSpacing": "Khoảng cách giữa các chữ",
        "message.template.class": "Class",
        "message.template.close": "Đóng",
        "message.template.colorPicker": "Color Picker",
        "message.template.company": "Tên công ty",
        "message.template.confirm": "Xác nhận",
        "message.template.contentsProperties": "Thuộc tính khu vực nội dung",
        "message.template.copyright": "Copyright ⓒ Synapsoft Corp. All rights reserved.",
        "message.template.delete": "Xóa",
        "message.template.description": "Mô tả",
        "message.template.display": "Hiển thị",
        "message.template.divMinHeight": "Áp dụng chiều cao nội dung",
        "message.template.divProperties": "Thuộc tính Layer.",
        "message.template.element": "Yếu tố",
        "message.template.endCell": "Ô cuối cùng",
        "message.template.etc": "Khác",
        "message.template.fileUpload": "Tải tệp lên",
        "message.template.find": "Tìm kiếm",
        "message.template.findAndReplace": "Tìm và thay thế",
        "message.template.findContent": "Nội dung tìm kiếm",
        "message.template.findOption": "Tùy chọn tìm kiếm",
        "message.template.height": "Chiều cao",
        "message.template.hexColor": "Màu HEX",
        "message.template.horizontalAlign": "Căn chỉnh ngang",
        "message.template.horizontalPosition": "Vị trí nằm ngang",
        "message.template.id": "ID",
        "message.template.ignore": "Bỏ qua",
        "message.template.imageProperties": "Thuộc tính ảnh",
        "message.template.imageUpload": "Tải ảnh lên",
        "message.template.indentation": "Thụt lề",
        "message.template.insert": "chèn",
        "message.template.insertAll": "Chèn tất cả",
        "message.template.insertionMethod": "Phương thức chèn",
        "message.template.layout": "Dàn trang",
        "message.template.left": "Bên trái",
        "message.template.leftMargin": "Khoảng cách lề trái",
        "message.template.license": "Bản quyền",
        "message.template.likeLetter": "Like Letter",
        "message.template.linkDescription": "Mô tả đường dẫn",
        "message.template.margin": "Căn chỉnh lề",
        "message.template.middle": "Giữa",
        "message.template.modify": "Chỉnh sửa",
        "message.template.more": "Nhiều hơn",
        "message.template.next": "Tiếp theo",
        "message.template.noLineBreak": "Không ngắt dòng",
        "message.template.none": "Không có",
        "message.template.notSupportedObject": "Khách thể không được hỗ trợ.",
        "message.template.numberOfColumns": "Số lượng cột",
        "message.template.numberOfRows": "Số lượng hàng",
        "message.template.ok": "Xác nhận",
        "message.template.open": "Mở",
        "message.template.otherColor": "Màu khác",
        "message.template.overflow": "Overflow",
        "message.template.padding": "Khoảng cách bên trong",
        "message.template.paragraphProperties": "Thuộc tính đoạn",
        "message.template.paste": "Dán",
        "message.template.pasteMessage": "Do cài đặt bảo mật của trình duyệt, bạn không thể truy cập tài liệu trực tiếp trên bảng tạm. Vui lòng dán lại vào cửa sổ này.",
        "message.template.prev": "Quay lại",
        "message.template.preview": "Xem trước",
        "message.template.recentColor": "Màu sử dụng gần đây",
        "message.template.reference": "Tham khảo",
        "message.template.releaseDate": "Ngày cập nhật",
        "message.template.removeBackground": "Bỏ nền",
        "message.template.repeat": "Lặp lại",
        "message.template.replace": "Thay đổi",
        "message.template.replaceAll": "Thay thế tất cả",
        "message.template.replaceContent": "Nội dung sẽ thay đổi",
        "message.template.responsiveView": "Chế độ xem đáp ứng",
        "message.template.restore": "Khôi phục",
        "message.template.right": "Bên phải",
        "message.template.rightMargin": "Khoảng cách lề phải",
        "message.template.select": "Lựa chọn",
        "message.template.selectImportArea": "Chọn khu vực nhập khẩu",
        "message.template.setScope": "Thiết lập Scope",
        "message.template.setStartNumber": "Chỉ định số bắt đầu",
        "message.template.sheetName": "Tên tờ",
        "message.template.shortcut": "Phím tắt",
        "message.template.size": "Kích thước",
        "message.template.sourceCode": "Mã nguồn",
        "message.template.splitCell": "Phân chia ô",
        "message.template.startCell": "Bắt đầu di động",
        "message.template.startNumber": "Số bắt đầu",
        "message.template.style": "Kiểu",
        "message.template.table": "Bảng",
        "message.template.tableLayout": "Layout bảng",
        "message.template.tableProperties": "Thuộc tính bảng",
        "message.template.tableTitle": "Tiêu đề bảng",
        "message.template.targetFrame": "Khung đối tượng",
        "message.template.template": "Biểu mẫu",
        "message.template.text": "Văn bản",
        "message.template.title": "Tiêu đề",
        "message.template.titleCell": "Ô tiêu đề",
        "message.template.titleExpose": "Thể hiện tiêu đề",
        "message.template.top": "Phía trên",
        "message.template.topMargin": "Khoảng cách lề trên",
        "message.template.transparency": "minh bạch",
        "message.template.unit": "đơn vị",
        "message.template.url": "URL",
        "message.template.version": "Phiên bản",
        "message.template.verticalAlign": "Căn chỉnh hàng dọc",
        "message.template.verticalPosition": "Vị trí thẳng đứng",
        "message.template.videoProperties": "Thuộc tính video",
        "message.template.videoUpload": "Tải video lên",
        "message.template.width": "Bề rộng",
        "message.template.word": "Nhấn vào đây hoặc Drag & Drop tệp.",
        "message.template.wordSpacing": "Khoảng cách chữ"
    };

    (window.SE_LOCALE_MESSAGES = window.SE_LOCALE_MESSAGES || {})['vi'] = messages;
})();
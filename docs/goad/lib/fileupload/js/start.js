$(document).ready(function(){
	$('.fileupload').each(function () {
	    $(this).fileupload({
	        dropZone: $(this),
	        url:"/cm/file/uploadFile.do",
	        autoUpload: true,
	        /*done: function (e, data) {
                console.log("done>>", e, data)

            },*/
         // Callback for failed (abort or error) uploads:
            /*fail: function (e, data) {

            },*/
	        //maxNumberOfFiles:1,
            acceptFileTypes: /(\.|\/)(gif|jpe?g|png|ppt|pptx|doc|docx|xls|xlsx|pdf|zip|hwp|txt|bmp|ai)$/i,
            maxFileSize:31457280,
            messages: {
                acceptFileTypes: '허용된 파일 형식이 아닙니다.',
                maxNumberOfFiles: '업로드 가능한 파일의 수를 초과 하였습니다.',
                maxFileSize: '해당 파일은 30MB를 초과합니다.',
                minFileSize: 'File is too small'
            },
	        /* progress: function (e, data) {
                console.log("progressall", e, data)
                if (e.isDefaultPrevented()) {
                    return false;
                }
                var progress = Math.floor(data.loaded / data.total * 100);
                $("#progress").text(progress);
	        }, */
	        //maxFileSize: 1,
	        /* add: function (e, data) {
	        	console.log("add")
	        	console.log(e, data)
	            var jqXHR = data.submit()
	                .success(function (result, textStatus, jqXHR) {
	                	console.log("success")
	                	console.log(result, textStatus, jqXHR)
	                })
	                .error(function (jqXHR, textStatus, errorThrown) {
                        console.log("error")
                        console.log(jqXHR, textStatus, errorThrown)
                    })
	                .complete(function (result, textStatus, jqXHR) {
                        console.log("complete")
                        console.log(result, textStatus, jqXHR)
                    });
	        } */
	    }).bind('fileuploadadd', function (e, data) {
	        console.log('fileuploadadd');
	    }).bind('fileuploadprogress', function (e, data) {
	        // Log the current bitrate for this upload:
	        console.log("fileuploadprogress>>")
	        console.log(data.bitrate);
	    });;
	});
});

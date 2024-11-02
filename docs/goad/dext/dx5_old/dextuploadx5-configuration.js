/*
 * DEXTUploadX5 Configuration javascript file
 * Copyright DEVPIA Inc.
 */
;
;(function (win) {

    if (!location.origin) location.origin = location.protocol + "//" + location.host;

    win.dextuploadx5Configuration = {

        // 제품의 인증키 문자열입니다.
        // 파일을 업로드하기 위해서는 반드시 인증키 문자열이 있어야 합니다.
        // example) authkey: "jn+xziPdVh6f5KN17uFHd.....암호화된 문자열입니다.....I9r5XGfwxQ="
        //authkey: "",

        //--**	운영 www.goad.or.kr web.xml 동기화
        authkey_r: "2lrvMVrERxl7ksMyxXddMRKC9++7EQSryU9nz/vv135DNMxzyGyN+dwvNpeNcBQe0OXYfcpYhiYNY+jw6pqPnEk4yp0r4+4MFjypAWw8xRxsynkip86QuM+ktYQ4EBtNXwYSY6wdGGgeTkPGvCT3/gfVfkGUrt2dPaj2U1nlX1E=",

        //--**	statging 서버 2020-12-03 ~ 2021-01-02
        authkey_s: "iplTQYeZZ6PzEuBSRsZ9EQcMO/d93MeR15HZyJVf8686XFpbqY5j7hlz1k4V8vtchpWgE2tmQwsDLtEpntkntLLslthlG3ou50L5P7/U3PwZtoaECj3qUMrHqzC9Qn9OMVly5ArelHJaVwNRaYZLpEYMOIbT9cn2y4MHRTbLVmo=",

        //--**	local localhost	2020-12-03 ~ 2021-01-02
        authkey_l: "mgk1yjBEvtKZxOFDOn2klb4HtXHhsxCKILQrUs2u5DeN+Ft79AKWCRFyUWYkPZB0PZore8ieUaZwSOr/1XFXmiYo4U5BezFVlmTSfrV9GGFEut8H8ZyY7tCqatwh/SyRgODcXL7DUYGqSy1IfMXaw1ADae13rH5jkFcRpysBPUU=",

        authkey: "2lrvMVrERxl7ksMyxXddMRKC9++7EQSryU9nz/vv135DNMxzyGyN+dwvNpeNcBQe0OXYfcpYhiYNY+jw6pqPnEk4yp0r4+4MFjypAWw8xRxsynkip86QuM+ktYQ4EBtNXwYSY6wdGGgeTkPGvCT3/gfVfkGUrt2dPaj2U1nlX1E=",
        //--**	스테이징 추후 받을것 web.xml 동기화
        // authkey: "2lrvMVrERxl7ksMyxXddMRKC9++7EQSryU9nz/vv135DNMxzyGyN+dwvNpeNcBQe0OXYfcpYhiYNY+jw6pqPnEk4yp0r4+4MFjypAWw8xRxsynkip86QuM+ktYQ4EBtNXwYSY6wdGGgeTkPGvCT3/gfVfkGUrt2dPaj2U1nlX1E=",

        // 사용하고자 하는 제품의 명시 버전입니다.
        // 1) multi 제품의 경우
        //   설치형 제품이 아니므로, 리소스를 그대로 사용합니다.
        // 2) ie 제품의 경우
        //   설치 버전 확인 불가: 명시된 버전을 다운로드할 수 있는 다운로드 페이지(ieDownloadURL을 참고)로 이동합니다.
        //   설치 버전 >= 명시 버전: 설치된 제품을 그대로 사용합니다.
        //   설치 버전 < 명시 버전: 명시된 버전을 다운로드할 수 있는 다운로드 페이지로 이동합니다.
        // 3) HD 응용프로그램의 경우
        //   설치 버전 확인 불가: 명시된 버전을 다운로드할 수 있는 다운로드 페이지(hdDownloadURL을 참고)로 이동합니다.
        //   설치 버전 >= 명시 버전: 설치된 제품을 그대로 사용합니다.
        //   설치 버전 < 명시 버전: 제품 업데이트(hd32UpdateURL, hd64UpdateURL을 참고)를 시도합니다.
        version: "3.1.1.0",

        // 패스란 제품 리소스의 위치를 말합니다.
        // 반드시 스키마(http, https)를 포함한 전체 path를 설정해주셔야 합니다.
        // 절대로 상대경로를 입력하지 마십시오.
        // 전제 경로 예제: "http://www.sample.com/dx5/"
        // 동일 도메인이라면: location.origin + "/dx5/"
        //productPath: location.origin + "/sample_x5_nj_spring_ko/dx5/",
        productPath: location.origin + "/dext/dx5/",

        // ie 버전을 사용하는 경우, 제품이 설치되지 않았을 때, 제품을 다운로드할 수 있는 페이지로 이동시킵니다.
        // 다운로드 페이지 경로는 반드시 productPath 하위에 존재할 필요가 없으며, 주어진 환경에 따라 커스터마이징하여 사용하십시오.
        // 절대로 상대경로를 입력하지 마십시오.
        // 전제 경로 예제: "http://www.sample.com/dx5/client/dextuploadx5-ax-download.html"
        // 동일 도메인이라면: location.origin + "/dx5/client/dextuploadx5-ax-download.html"
        //ieDownloadURL: location.origin + "/sample_x5_nj_spring_ko/dx5/client/dextuploadx5-ax-download.html",
        ieDownloadURL: location.origin + "/dext/dx5/client/dextuploadx5-ax-download.html",

        // HD 프로그램을 사용하는 경우, 제품이 설치되지 않았을 때, 제품을 다운로드할 수 있는 페이지로 이동시킵니다.
        // 다운로드 페이지 경로는 반드시 productPath 하위에 존재할 필요가 없으며, 주어진 환경에 따라 커스터마이징하여 사용하십시오.
        // 절대로 상대경로를 입력하지 마십시오.
        // 전제 경로 예제: "http://www.sample.com/dx5/client/dextuploadx5-hd-download.html"
        // 동일 도메인이라면: location.origin + "/dx5/client/dextuploadx5-hd-download.html"
        //hdDownloadURL: location.origin + "/sample_x5_nj_spring_ko/dx5/client/dextuploadx5-hd-download.html",
        hdDownloadURL: location.origin + "/dext/dx5/client/dextuploadx5-hd-download.html",

        // HD 프로그램을 자동으로 업데이트할 수 있는 경로입니다.
        // 주어진 환경에 따라 커스터마이징하여 사용하되, 절대로 상대경로를 입력하지 마십시오.
        // 서버 MIME 설정에 따라 다운로드가 실패할 수 있으므로, exe 파일이 다운로드할 수 있도록 서버 설정이 필요할 수 있습니다.
        // 절대로 상대경로를 입력하지 마십시오.
        // 전제 경로 예제: "http://www.sample.com/dx5/client/dextuploadx5-hd-installer.exe"
        // 동일 도메인이라면: location.origin + "/dx5/client/dextuploadx5-hd-installer.exe"
        //hd32UpdateURL: location.origin + "/sample_x5_nj_spring_ko/dx5/client/dextuploadx5-hd-installer.exe",
        hd32UpdateURL: location.origin + "/dext/dx5/client/dextuploadx5-hd-installer.exe",
        // 64비트용 설치 프로그램을 가리키는 업데이트 경로입니다.
        //hd64UpdateURL: location.origin + "/sample_x5_nj_spring_ko/dx5/client/dextuploadx5-hd-installer-x64.exe"
        hd64UpdateURL: location.origin + "/dext/dx5/client/dextuploadx5-hd-installer-x64.exe"
    };

    //--**	Glovals.env 에 따라 key 변경 처리
    var wooo = win.dextuploadx5Configuration;
    if (_GLOVALS_ENV === "local") {
        wooo.authkey = wooo.authkey_l;
    } else if (_GLOVALS_ENV === "staging") {
        wooo.authkey = wooo.authkey_s;
    } else {
        wooo.authkey = wooo.authkey_r;
    }

})(window);

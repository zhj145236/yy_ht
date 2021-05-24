export function TMap() {


  return new Promise(function (resolve, reject) {
    window.init = function () {
      resolve(qq)//注意这里
    };
    let script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "http://map.qq.com/api/js?v=2.exp&callback=init&key=GE7BZ-JGELW-5BAR4-R5PR6-F3NT6-JFBFF";
    script.onerror = reject;
    document.head.appendChild(script);
  })
}

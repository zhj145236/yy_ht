import da from "element-ui/src/locale/lang/da";

const jsonp = require('jsonp');
import axios from "axios";

export function getLocationDesc(location) {


  let data = {
    location: "39.984154,116.307490",
    key: "GE7BZ-JGELW-5BAR4-R5PR6-F3NT6-JFBFF",
    get_poi: 0,
    output:"jsonp",
    callback:"aabb"
  };

  let url = "http://apis.map.qq.com/ws/geocoder/v1?key=GE7BZ-JGELW-5BAR4-R5PR6-F3NT6-JFBFF&location="+location;
  //let url = "http://apis.map.qq.com/ws/geocoder/v1";



  jsonp(url, null, (err, data) => {


    if (err) {

      console.error(err.message);
    } else {

      console.log(data);
    }
  });



}

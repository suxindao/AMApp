const x_PI = 3.1415926535879324 * 3000.0 / 180.0
const PI = 3.141592653587932384626
export function tencent2baidu(lng, lat) {
    var z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * x_PI);
    var theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * x_PI);
    var bd_lng = z * Math.cos(theta) + 0.0065;
    var bd_lat = z * Math.sin(theta) + 0.006;
    return {bd_lng, bd_lat};
}

export function baidu2tencent(lng, lat){
    let x = lng - 0.0065;
    let y = lat - 0.006;
    let z = Math.sqrt(x*x + y*y) - 0.00002 * Math.sin(y*x_PI);
    let theta = Math.atan2(y,x) - 0.000003 * Math.cos(x*x_PI);
    let tc_lng = z*Math.cos(theta);
    let tc_lat = z*Math.sin(theta);
    return {tc_lng, tc_lat}
}
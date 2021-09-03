import axios from 'axios';
import jsSHA from 'jssha';

const url = 'https://ptx.transportdata.tw/MOTC/v2/Bus/EstimatedTimeOfArrival/City/Tainan?$format=JSON';

const getAuthorizationHeader = function() {
	var AppID = 'FFFFFFFF-FFFF-FFFF-FFFF-FFFFFFFFFFFF';
	var AppKey = 'FFFFFFFF-FFFF-FFFF-FFFF-FFFFFFFFFFFF';

	var GMTString = new Date().toGMTString();
	var ShaObj = new jsSHA('SHA-1', 'TEXT');
	ShaObj.setHMACKey(AppKey, 'TEXT');
	ShaObj.update('x-date: ' + GMTString);
	var HMAC = ShaObj.getHMAC('B64');
	var Authorization = `hmac username="${AppID}", algorithm="hmac-sha1", headers="x-date", signature="${HMAC}"`;

	return { 'Authorization': Authorization, 'X-Date': GMTString};
}

export default async function getData() {
	let res = await axios.get(url, {headers: getAuthorizationHeader(),})
	return await res.data
}


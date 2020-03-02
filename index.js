const got = require('got');
const moment = require('moment');
const fs = require('fs');

url = 'http://api.mcsrvstat.us/2/2b2t.org';
out = {};

function main() {
	getData();
	interval = setInterval(getData, 5 * 60 * 1000);
	setTimeout(end, 24 * 60 * 60 * 1000, interval);
}

async function getData(tryNo) {
	if(!tryNo) tryNo = 1;
	if(tryNo == 4) out[moment().format('hh:mm:ss A')] = { players: 0, queue: 0 };
	try {
		res = await got(url);
		body = JSON.parse(res.body);
		console.log(body.players);
		out[moment().format('hh:mm:ss A')] = { players: body.players.online, queue: body.players.online - 260 };
	} catch (e) {
		console.error('ERROR: ' + e);
		getData(tryNo++);
	}
}

function end(interval) {
	clearInterval(interval);
	// console.log(out);
	out = JSON.stringify(out);
	fs.writeFileSync('out1.json', out);
}

main();

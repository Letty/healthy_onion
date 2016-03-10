var fs = require('fs');

fs.readFile('dis_july14.csv', 'utf-8', function (err, d) {

	var flags = ['Authority', 'BadExit', 'Exit', 'Fast', 'Guard', 'HSDir', 'Listed', 'Measured',
		'Named', 'Running', 'Stable', 'Unnamed', 'V2Dir', 'Valid'];
	var data = {};
	flags.forEach(function (f) {
		data[f] = {
			min: 1e10,
			max: -1e10,
			max_relays: -1e10,
			neg_relays: -1e10,
			pos_relays: -1e10,
			data: []
		};
	});
	var lines = d.split('\n');
	var actFlag = '';
	var o = {
		date: '',
		flag: '',
		count: 0,
		neg_relays: 0,
		pos_relays: 0,
		data: []
	};

	var neg_rel = 0,
		pos_rel = 0,
		x0 = 0;

	/*
	 Structure:
	 Date, flag, votes, required votes, max votes,relay count
	 */
	for (var i = 0; i < lines.length; i++) {

		var l = lines[i].split(',');
		var flag = l[1],
			req_votes = parseInt(l[3]),
			votes = parseInt(l[2]),
			max_votes = parseInt(l[4]),
			value = parseInt(l[l.length - 1]);

		//var class_ = 'n';
		var class_ = '';
		var diff = votes - req_votes;

		if (actFlag !== flag || i == lines.length - 1) {
			if (i !== 0) {
				if (o.count > data[actFlag].max_relays) {
					data[actFlag].max_relays = o.count;
				}

				if (data[actFlag].neg_relays < o.neg_relays) data[actFlag].neg_relays = o.neg_relays;
				if (data[actFlag].pos_relays < o.pos_relays) data[actFlag].pos_relays = o.pos_relays;

				data[actFlag].data.push(o);
			}
			o = {
				date: '',
				flag: '',
				count: 0,
				neg_relays: 0,
				pos_relays: 0,
				data: []
			};

			neg_rel = 0;
			pos_rel = 0;
			x0 = 0;

			actFlag = flag;
			o.flag = actFlag;
			o.date = l[0];

		}

		var x1_ = x0;
		if (diff < 0) {
			neg_rel += value;
			x1_ = x1_ + value;
		} else if (diff > 0) {
			pos_rel += value;
			x1_ += value;
		} else {
			pos_rel += value;
			x0 = 0;
			x1_ = x0 + value;
		}

		class_ = getClass(votes, req_votes, max_votes);

		o.count = o.count + value;
		o.data.push([value, class_, x0, x1_]);

		x0 = x1_;

		if (o.neg_relays < neg_rel) o.neg_relays = neg_rel;
		if (o.pos_relays < pos_rel) o.pos_relays = pos_rel;

		if (value < data[actFlag].min) {
			data[actFlag].min = value;
		}
		if (value > data[actFlag].max) {
			data[actFlag].max = value;
		}

		if (value < data[actFlag].min) {
			data[actFlag].min = value;
		}
		if (value > data[actFlag].max) {
			data[actFlag].max = value;
		}
	}

	fs.writeFile('dis_july14_.js', JSON.stringify(data), function (err) {
		if (err) console.log('error');
		console.log('done');
	})

	function getClass(vote, req_v, max_v) {
		if(vote === 0) return 'v0';
		if(vote === max_v) return 'max';
		if(vote === req_v) return 'req';
		var diff = 0;
		if(vote < req_v){
			diff = req_v - vote;
			return 'r-'+diff;
		}else{
			diff = max_v - vote;
			return 'm-'+diff;
		}

	}
});
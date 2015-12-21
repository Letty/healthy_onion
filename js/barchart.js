/**
 * Created by Letty on 26/11/15.
 */


$(document).ready(function () {
	var flags = ['Authority', 'BadExit', 'Exit', 'Fast', 'Guard', 'HSDir',
		'Running', 'Stable', 'V2Dir', 'Valid', 'Listed', 'Measured'];

	var margin = {top: 40, right: 20, bottom: 10, left: 90},
		width = $("#bar")[0].clientWidth - margin.left - margin.right,
		height = 500 - margin.top - margin.bottom;

	var min = -1e10, max = -1e10;

	var isPlaying = false;
	var interval;
	var end = dis_july.Authority.data.length;

	var y = d3.scale.ordinal()
		.rangeRoundBands([0, height], .3)
		.domain(flags.map(function (d) {
			return d;
		}));

	var x = d3.scale.linear()
		.rangeRound([0, width]);

	var scale = d3.scale.log().range([0, width]);

	var index = 0;

	calcMinMaxX();
	//console.log(dis_july.BadExit.data);

	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left");

	var svg = d3.select("#bar").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.attr("id", "d3-plot")
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	svg.append("g")
		.attr("class", "y axis")
		.call(yAxis);

	svg.selectAll(".flags")
		.data(flags)
		.enter().append("g")
		.attr("class", "flag_")
		.attr("transform", function (d) {
			return "translate(0," + y(d) + ")";
		})
		.append("rect")
		.attr("height", y.rangeBand())
		.attr("x", "1")
		.attr("width", width);

	var flag_group = svg.selectAll(".flag")
		.data(flags)
		.enter().append("g")
		.attr("class", function (d) {
			return "flag " + d;
		})
		.attr("transform", function (d) {
			return "translate(0," + y(d) + ")";
		})
		.on('click', function (d) {
			// TODO Adding detail view with more detailed graph and information about a flag
		});

	flag_group.selectAll(".subbar")
		.data(function (d) {
			return dis_july[d].data[index].data;
		})
		.enter().append("rect")
		.attr("height", y.rangeBand())
		.attr("x", function (d, i, j) {
			return getX1(d, flags[j]);
		})
		.attr("width", function (d, i, j) {
			return getWidth(d, flags[j]);
		})
		.attr('class', function (d) {
			return 'subbar ' + d[1];
		})
		.on('mouseover', function (d) {
			//TODO tooltip somewhere
		});

	var xtxt = svg.append("g")
		.attr("class", "x axis description")
		.append('text');
	xtxt.append('tspan')
		.attr('x', x(-200))
		.attr('y', -15)
		.text('received less votes')
		.style("text-anchor", "end");
	xtxt.append('tspan')
		.attr('x', x(-200))
		.attr('y', 0)
		.text('than required')
		.style("text-anchor", "end");

	var xtxt2 = svg.append("g")
		.attr("class", "x axis description")
		.append('text');
	xtxt2.append('tspan')
		.attr('x', x(200))
		.attr('y', -15)
		.text('received all or more')
		.style("text-anchor", "begin");
	xtxt2.append('tspan')
		.attr('x', x(200))
		.attr('y', 0)
		.text('required votes')
		.style("text-anchor", "begin");

	svg.append("g")
		.attr("class", "y axis")
		.append("line")
		.attr("x1", x(0))
		.attr("x2", x(0))
		.attr("y2", height);

	// TODO: das hier muss in die styles
	d3.selectAll(".axis path")
		.style("fill", "none")
		.style("stroke", "none")
		.style("shape-rendering", "crispEdges");

	d3.selectAll(".axis line")
		.style("fill", "none")
		.style("stroke", "#000")
		.style("shape-rendering", "crispEdges");

	d3.select('.date').text(formatDate(dis_july['Authority'].data[index].date));
	d3.select('#play').on('click', play);

	function calcMinMaxX() {
		flags.forEach(function (d) {
			if (dis_july[d].neg_relays > min && dis_july[d].neg_relays !== 0) min = dis_july[d].neg_relays;
			if (dis_july[d].pos_relays > max && dis_july[d].pos_relays !== 0) max = dis_july[d].pos_relays;
		});

		min = -min;

		scale.domain([0.1, max]);
		x.domain([min, max]).nice();
	}

	function play() {
		if (isPlaying) {
			isPlaying = false;
			d3.select('#play').text('PLAY ANIMATION');
			clearInterval(interval);
		} else {
			isPlaying = true;
			d3.select('#play').text('STOP ANIMATION');
			interval = setInterval(function () {
				index++;
				if (index == end - 1) {
					clearInterval(interval);
					index = 0;
				} else {
					redraw();
				}
			}, 700);
		}
	}

	function redraw() {
		flags.forEach(function (f) {
			var data = dis_july[f].data[index].data;
			var a = d3.selectAll('g.flag.' + f)
				.data(function () {
					return dis_july[f].data[index].data;
				});

			data.forEach(function (d) {
				var b = a.selectAll('.' + d[1]);

				if (b[0].length == 0) {
					b = a.append('rect')
						.attr('class', 'subbar ' + d[1])
						.attr("height", y.rangeBand())
						.attr("x", function () {
							return getX1(d, f);
						})
						.attr("width", function () {
							return getWidth(d, f);
						});
				}

				b.transition()
					.attr("x", function () {
						return getX1(d, f);
					})
					.attr("width", function () {
						return getWidth(d, f);
					});
			});
			a.exit().remove();
		});

		d3.select('.date').text(formatDate(dis_july['Authority'].data[index].date));

	}

	function formatDate(t) {
		var month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
			'September', 'October', 'November', 'December'];
		var d = t.split(' ');
		var d_ = d[0].split('-');
		return day(parseInt(d_[2])) + ' ' + month[parseInt(d_[1]) - 1] + ' ' + d_[0];
	}

	function day(d) {
		var suf = d;
		switch (d) {
			case 1:
				suf += 'st';
				break;
			case 2:
				suf += 'nd';
				break;
			case 3:
				suf += 'rd';
				break;
			case 31:
				suf += 'st';
				break;
			default:
				suf += 'th';
				break;
		}
		return suf;
	}

	function getWidth(data, k) {
		if (data[0] == 0) {
			return 0;
		} else {
			var r = x(data[3]) - x(data[2]);
			if ((data[1] === 'v0' || data[1] === 'r-4' || data[1] === 'r-3' || data[1] === 'r-2' || data[1] === 'r-1') && data[0] !== 0) {
				r = ((x(data[3] - dis_july[k].data[index].neg_relays)) - x(data[2] - dis_july[k].data[index].neg_relays));
			}
			return r;
		}
	}

	function getX1(data, k) {
		var r = data[2];
		if ((data[1] === 'v0' || data[1] === 'r-4' || data[1] === 'r-3' || data[1] === 'r-2' || data[1] === 'r-1') && data[0] !== 0) {
			r = data[2] - dis_july[k].data[index].neg_relays;
		}
		return x(r);
	}
});


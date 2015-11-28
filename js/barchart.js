/**
 * Created by Letty on 26/11/15.
 */


$(document).ready(function () {
	var flags = ['Authority', 'BadExit', 'Exit', 'Fast', 'Guard', 'HSDir',
		'Running', 'Stable', 'V2Dir', 'Valid'];

	var margin = {top: 40, right: 20, bottom: 10, left: 80},
		width = 800 - margin.left - margin.right,
		height = 500 - margin.top - margin.bottom;


	var min = -1e10, max = -1e10;

	var y = d3.scale.ordinal()
		.rangeRoundBands([0, height], .3)
		.domain(flags.map(function (d) {
			return d;
		}));

	//console.log('rangeband: '+y.rangeBand());

	var x = d3.scale.linear()
		.rangeRound([0, width]);

	var scale = d3.scale.log().range([0, width]);

	calcMinMaxX();

	//bar_data['Guard'].data[0].data.forEach(function (d) {
	//	console.log('d: '+d[0]+' scale: '+scale(d[0]));
	//});

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

	var vakken = svg.selectAll(".question")
		.data(flags)
		.enter().append("g")
		.attr("class", "bar")
		.attr("transform", function (d) {
			return "translate(0," + y(d) + ")";
		})
		.on('click', function (d) {
			// TODO Adding detail view with more detailed graph and information about a flag
			//console.log(d);
			//console.log('hello?');
		});

	var bars = vakken.selectAll("rect")
		.data(function (d) {
			return bar_data[d].data[0].data;
		})
		.enter().append("g").attr("class", "subbar");


	bars.append("rect")
		.attr("height", y.rangeBand())
		.attr("x", function (d, i, j) {
			var r = d[2];
			if ((d[1] === 'n-4' || d[1] === 'n-3' || d[1] === 'n-2' || d[1] === 'n-1') && d[0] !== 0) {
				r = d[2] - bar_data[flags[j]].data[0].neg_relays;
			}
			return x(r);
		})
		.attr("width", function (d, i) {
			var w_ = d[3] - d[2];
			if (w_ == 0) {
				return 0;
			} else {
				return (x(d[3]) - x(d[2]));
			}
		})
		.attr('class', function (d) {
			return d[1];
		})
		.on('mouseover', function (d) {
			//TODO tooltip somewhere
		});

	vakken.insert("rect", ":first-child")
		.attr("height", y.rangeBand())
		.attr("x", "1")
		.attr("width", width)
		.attr("fill-opacity", "0.5")
		.style("fill", "#F5F5F5");

	var xtxt = svg.append("g")
		.attr("class", "x axis description")
		.append('text');
		xtxt.append('tspan')
		.attr('x', x(-200))
		.attr('y', -15)
		.text('recived less votes')
		.style("text-anchor", "end");
		xtxt.append('tspan')
		.attr('x', x(-200))
		.attr('y', 0)
		.text('then required')
		.style("text-anchor", "end");

	var xtxt2 = svg.append("g")
		.attr("class", "x axis description")
		.append('text');
		xtxt2.append('tspan')
		.attr('x', x(200))
		.attr('y', -15)
		.text('recived all or more')
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

	function calcMinMaxX() {
		flags.forEach(function (d) {
			if (bar_data[d].neg_relays > min && bar_data[d].neg_relays !== 0) min = bar_data[d].neg_relays;
			if (bar_data[d].pos_relays > max && bar_data[d].pos_relays !== 0) max = bar_data[d].pos_relays;
		});

		min = -min;

		scale.domain([0.1, max]);
		x.domain([min, max]);
	}

});
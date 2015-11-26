/**
 * Created by Letty on 26/11/15.
 */


$(document).ready(function () {
	var classes = ['n-7', 'n-6', 'n-5', 'n-4', 'n-3', 'n-2', 'n-1', 'inner'];
	var classes_ = ['n-4', 'n-3', 'n-2', 'n-1', 'n', 'n+1', 'n+2', 'n+3'];
	var flags = ['Authority', 'BadExit', 'Exit', 'Fast', 'Guard', 'HSDir',
		'Running', 'Stable', 'V2Dir', 'Valid'];

	var margin = {top: 50, right: 20, bottom: 10, left: 80},
		width = 800 - margin.left - margin.right,
		height = 500 - margin.top - margin.bottom;


	var min = 1e10, max = -1e10;

	var y = d3.scale.ordinal()
		.rangeRoundBands([0, height], .3)
		.domain(flags.map(function(d) { return d; }));

	var x = d3.scale.linear()
		.rangeRound([0, width]);

	calcMinMaxX();

	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("top");

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
		.attr("transform", function(d) { return "translate(0," + y(d) + ")"; });

	var bars = vakken.selectAll("rect")
		.data(function(d) { return aster[d].data[0].data; })
		.enter().append("g").attr("class", "subbar");

	bars.append("rect")
		.attr("height", y.rangeBand())
		.attr("x", function(d) { return x(d); })
		.attr("width", function(d) { return  x(d); });

	vakken.insert("rect",":first-child")
		.attr("height", y.rangeBand())
		.attr("x", "1")
		.attr("width", width)
		.attr("fill-opacity", "0.5")
		.style("fill", "#F5F5F5");

	svg.append("g")
		.attr("class", "y axis")
		.append("line")
		.attr("x1", x(max/2))
		.attr("x2", x(max/2))
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
			if(aster[d].max_relays < min) min = aster[d].max_relays;
			if(aster[d].max_relays > max) max = aster[d].max_relays;
		});

		x.domain([0, max]);
	}

});
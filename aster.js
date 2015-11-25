/**
 * Created by Letty on 19/11/15.
 */

window.onload = function () {
	var classes = ['n-7', 'n-6', 'n-5', 'n-4', 'n-3', 'n-2', 'n-1', 'inner'];
	var width = 500,
		height = 500,
		radius = Math.min(width, height) / 2,
		innerRadius = 0.3 * radius;

	var index = 0;
	var lastIndex = index;
	var isPlaying = false;
	var interval;
	var flag = 'Fast';

	var pie = d3.layout.pie()
		.sort(null)
		.value(function () {
			return 1;
		});

	var currentData = aster[flag].data;
	var dat = currentData[0];

	var ra = d3.scale.linear()
		.range([0, 200])
		.domain([aster[flag].min, aster[flag].max]);

	var arc = d3.svg.arc()
		.innerRadius(innerRadius)
		.outerRadius(function (d) {
			return ra(d.data) + innerRadius;
		});

	var svg = d3.select("#aster").append("svg")
		.attr("width", width + 50)
		.attr("height", height + 50)
		.append("g")
		.attr("transform", "translate(" + (width / 2 + 50) + "," + (height / 2 + 50) + ")");

	var path = svg.selectAll(".solidArc")
		.data(pie(currentData[0].data))
		.enter().append("path")
		.attr("class", function (d, i) {
			return "solidArc " + classes[i];
		})
		.attr("d", arc)
		.on('mouseover', function (d) {
			txt.text(d.data);
		})
		.on('mouseout', function () {
			txt.text(currentData[lastIndex].count);
		});

	var txt = svg.append("svg:text")
		.attr("class", "aster-score")
		.attr("dy", ".35em")
		.attr("text-anchor", "middle") // text-align: right
		.text(dat.count);


	d3.select('#play').on('click', play);
	d3.select('#authority').on('click', function () {
		changeDataset('Authority')
	});
	d3.select('#badexit').on('click', function () {
		changeDataset('BadExit')
	});

	d3.select('#exit').on('click', function () {
		changeDataset('Exit')
	});
	d3.select('#fast').on('click', function () {
		changeDataset('Fast')
	});
	d3.select('#guard').on('click', function () {
		changeDataset('Guard')
	});
	d3.select('#hsdir').on('click', function () {
		changeDataset('HSDir')
	});
	d3.select('#running').on('click', function () {
		changeDataset('Running')
	});
	d3.select('#stable').on('click', function () {
		changeDataset('Stable')
	});
	d3.select('#v2dir').on('click', function () {
		changeDataset('V2Dir')
	});
	d3.select('#valid').on('click', function () {
		changeDataset('Valid')
	});

	function changeDataset(_flag) {
		currentData = aster[_flag].data;
		ra.domain([aster[_flag].min, aster[_flag].max]);
		redraw(0);
		index = 0;
		isPlaying = false;
		d3.select('#play').text('PLAY ANIMATION');
	}

	function play() {
		if(isPlaying){
			isPlaying = false;
			d3.select('#play').text('PLAY ANIMATION');
			clearInterval(interval);
		}else{
			isPlaying = true;
			d3.select('#play').text('STOP ANIMATION');
			interval = setInterval(function () {
				redraw(index++);
			}, 700);
		}
	}

	function redraw(ind) {
		if (ind == currentData.length - 1) {
			clearInterval(interval);
			lastIndex = index - 1;
			index = 0;
		}
		var dat = currentData[ind];
		var a = d3.selectAll('.solidArc')
			.data(pie(dat.data));
		a.transition()
			.attr("d", arc);
		txt.text(dat.count);
		for(var i = 0; i < dat.data.length; i++){
			var $rel = d3.select('#relay_'+i);
			if($rel) $rel.text(dat.data[i]);
		}
	}
};
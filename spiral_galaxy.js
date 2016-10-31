
count = 0;

var svg = d3.select("body").append("svg")
  .attr("width", window.innerWidth)
  .attr("height", window.innerHeight)
  // setting viewBox implies preserveAspectRatio: xMidYMid meet?
  .attr('viewBox', '-320 -220 640 480')
// resize once at begining
resize()

var orbits = svg.append('g')
  .attr("class", "orbits")
  .attr("transform", "scale(320)");

// Model definitions - for orbits
var outerRadius = 1
var orbitSteps = 30
var totalAngularSkew = 150
var majorMinorAxisRatio = 1.6

// Elliptical Orbits
var g = orbits.selectAll("g")
  .data(d3.range(outerRadius, 0, -outerRadius / orbitSteps))
  .enter().append("g")

g.append("ellipse")
  .attr({
    cx: 0, cy: 0,
    rx: function (r) { return r },
    ry: function (r) { return r / majorMinorAxisRatio },
    transform: function (r) {
      console.log('append: r', r)
      var rot = (r / outerRadius - 1) * totalAngularSkew
      var scale = r
      return 'rotate(' + rot + ')scale(' + scale + ')';

    }
  })
  .style({
    fill: 'none',
    'stroke-width': .01,
    opacity: .7,
    // stroke: d3.scale.category20c(),
    stroke: function (r) {
      if (r > .45 && r < .55) return 'yellow'
      // return d3.rgb(200, 200, 200)
      return 'white'
    }
  })

g.datum(function (d, i) {
  // console.log('datum: d,i', d, i)
  return { d: d, angle: 0 };
});

// svg.on("mousemove", function () {
//   mouse = d3.mouse(this);
// });

d3.timer(function () {
  count++;
  g.attr("transform", function (d, i) {
    var z = d.d / 10
    // d.angle += 1;
    // d.angle -= (1 - (z)) / 1;
    // console.log('time: d', d)
    return 'rotate(' + d.angle + ')';
  });
});

var numDots = 10
svg.selectAll('.dot')
  .data(d3.range(numDots))
  .enter().append("circle")
  .attr("class", "dot")
  .attr("r", 1)
  .attr("cx", (d) => 300 * d / numDots)
  // .attr("cy", (d) => 0 * (d - 2))
  .style("fill", 'yellow')


// FullScreen
window.addEventListener('resize', resize);
function resize() {
  var sz = {
    width: window.innerWidth,
    height: window.innerHeight
  }
  // console.log('screen:', sz)
  // update the global svg element
  svg.attr(sz);
}

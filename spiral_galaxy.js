
var md = new MobileDetect(window.navigator.userAgent);

var svg = d3.select("body").append("svg")
  .attr("width", window.innerWidth)
  .attr("height", window.innerHeight)
  // setting viewBox implies preserveAspectRatio: xMidYMid meet?
  // .attr('viewBox', '-320 -200 640 400')
  .attr('viewBox', '-330 -210 660 420') // a little padding

var orbits = svg.append('g')
  .attr("class", "orbits")
  .style('opacity', .5)
  .attr("transform", "scale(320)");

// Model definitions - for elliptical orbits
var outerRadius = 1
var orbitSteps = 20
var totalAngularSkew = 150
var majorMinorAxisRatio = 1.6

// Model definitions - for stars
var numStarOrbits = 500
var starsPerOrbit = 20
if (md.mobile()) {
  numStarOrbits = 200
  starsPerOrbit = 10
}

// Elliptical Orbits
orbits.selectAll('ellipse')
  .data(d3.range(outerRadius, 0, -outerRadius / orbitSteps))
  .enter()
  .append("ellipse")
  .datum(function (r) {
    // r radius: goes from 1..0 in orbitSteps
    // console.log('datum: r', r)
    return {
      r: r,
      angle: (r / outerRadius - 1) * totalAngularSkew,
      scale: r
    };
  })
  .attr({
    cx: 0, cy: 0,
    rx: 1,
    ry: 1 / majorMinorAxisRatio,
    transform: function (d) {
      return 'rotate(' + d.angle + ')scale(' + d.scale + ')';
    }
  })
  .style({
    fill: 'none',
    'stroke-width': (d) => .002 / d.scale, //un-scale
    // stroke: d3.scale.category20c(),
    stroke: function (d) {
      if (d.r > .75 && d.r < .85) return 'yellow'
      return 'white'
    }
  })


var stars = svg.append('g')
  .attr("class", "stars")
  .style('opacity', 1)
  .attr("transform", "scale(320)");

var eachStar = stars.selectAll('.star')
  .data(d3.range(numStarOrbits))
  .enter()
  .append("g")
  .datum(function () {
    r = Math.random() // select orbit
    r = r * r * r // skew to smaller orbits
    return {
      angle: Math.random() * 360,
      orbit: {
        r: r,
        angle: (r / outerRadius - 1) * totalAngularSkew,
        scale: r
      }
    };
  })
  .attr({
    class: 'star',
    transform: function (d) {
      return 'rotate(' + d.orbit.angle + ')scale(' + d.orbit.scale + ',' + d.orbit.scale / majorMinorAxisRatio + ')rotate(' + d.angle + ')';
    }
  });

// star colors
var OBAFGKM = [
  ['O', 155, 176, 255, '#9bb0ff'],
  ['B', 170, 191, 255, '#aabfff'],
  ['A', 202, 215, 255, '#cad7ff'],
  ['F', 248, 247, 255, '#f8f7ff'],
  ['G', 255, 244, 234, '#fff4ea'],
  ['K', 255, 210, 161, '#ffd2a1'],
  ['M', 255, 204, 111, '#ffcc6f']
]
for (var perOrbit = 0; perOrbit < starsPerOrbit; perOrbit++) {
  var theta = Math.random() * 360;
  var wobble = 1 - 0.05 + Math.random() * 0.10 // 1+/-0.05*r()
  eachStar
    .append("circle")
    .attr({
      cx: wobble * Math.cos(theta),
      cy: wobble * Math.sin(theta),
      r: function (d) {
        return .002 / d.orbit.scale // un-scale
      }
    })
    .style("fill", function () {
      return OBAFGKM[Math.floor(Math.random() * OBAFGKM.length)][4]
    })
}

d3.timer(function () {
  eachStar.attr({
    transform: function (d) {
      // d.angle -= 0.3
      // d.angle -= (1 - (d.orbit.scale))
      // from s=1->.3 to  s=0->1
      d.angle -= (1 - (.7 * d.orbit.scale))
      return 'rotate(' + d.orbit.angle + ')scale(' + d.orbit.scale + ',' + d.orbit.scale / majorMinorAxisRatio + ')rotate(' + d.angle + ')';
    }

  })
  // procession of the elipses
  // orbits.selectAll('ellipse')
  //   .attr("transform", function (d) {
  //     // d.angle += 1; // constant rotation
  //     d.angle -= (1 - (d.r)); // process inner orbits more (outer (r==1) is fixed)
  //     console.log('time: d', d)
  //     return 'rotate(' + d.angle + ')scale(' + d.scale + ')';
  //   });
});

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

// Button curried handler
function toggler(what) {
  return function (event) {
    var current = what.style('opacity')
    var tr = { 1: .5, .5: 0, 0: 1 }
    var next = tr[current];
    what.style('opacity', next)
  }
}
d3.select('#orbits')
  .on('click', toggler(orbits))
d3.select('#stars')
  .on('click', toggler(stars))

d3.select('.legend span').text('' + (numStarOrbits * starsPerOrbit) + ' stars')
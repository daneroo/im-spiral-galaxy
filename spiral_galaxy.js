
var svg = d3.select("body").append("svg")
  .attr("width", window.innerWidth)
  .attr("height", window.innerHeight)
  // setting viewBox implies preserveAspectRatio: xMidYMid meet?
  // .attr('viewBox', '-320 -200 640 400')
  .attr('viewBox', '-330 -210 660 420') // a little padding

var orbits = svg.append('g')
  .attr("class", "orbits")
  .attr("transform", "scale(320)");

// Model definitions - for orbits
var outerRadius = 1
var orbitSteps = 20
var totalAngularSkew = 180
var majorMinorAxisRatio = 1.6

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
    'stroke-width': .01,
    opacity: .05,
    // stroke: d3.scale.category20c(),
    stroke: function (d) {
      if (d.r > .45 && d.r < .55) return 'yellow'
      return 'white'
    }
  })


var stars = svg.append('g')
  .attr("class", "stars")
  .attr("transform", "scale(320)");

var numStars = 5000
var eachStar = stars.selectAll('.star')
  .data(d3.range(numStars))
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
  })

eachStar
  .append("circle")
  .attr({
    cx: 1,
    cy: 0,
    r: function (d) {
      return .002 / d.orbit.scale
    }
  })
  .style("fill", function () {
    var OBAFGKM = [
      ['O', 155, 176, 255, '#9bb0ff'],
      ['B', 170, 191, 255, '#aabfff'],
      ['A', 202, 215, 255, '#cad7ff'],
      ['F', 248, 247, 255, '#f8f7ff'],
      ['G', 255, 244, 234, '#fff4ea'],
      ['K', 255, 210, 161, '#ffd2a1'],
      ['M', 255, 204, 111, '#ffcc6f']
    ]
    return OBAFGKM[Math.floor(Math.random()*OBAFGKM.length)][4]
  })

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

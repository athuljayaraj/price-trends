// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"scripts/resize.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateResize = updateResize;

/**
 *
 */
function updateResize() {
  var svgSizes = window.getComputedStyle(d3.select('#vizualization-svg1').node());
  var vizDivSizes = window.getComputedStyle(d3.select('#vizualization-svg1').node());
  glob.sizes.vizSvgSizes.width = parseFloat(svgSizes.width.slice(0, -2));
  glob.sizes.vizSvgSizes.height = parseFloat(svgSizes.height.slice(0, -2));
  glob.sizes.vizSvgSizes.innerWidth = glob.sizes.vizSvgSizes.width - glob.sizes.vizSvgSizes.margin.left - glob.sizes.vizSvgSizes.margin.right;
  glob.sizes.vizSvgSizes.innerHeight = glob.sizes.vizSvgSizes.height - glob.sizes.vizSvgSizes.margin.top - glob.sizes.vizSvgSizes.margin.bottom;
  glob.sizes.vizDivSizes.width = parseFloat(vizDivSizes.width.slice(0, -2));
  glob.sizes.vizDivSizes.height = parseFloat(vizDivSizes.height.slice(0, -2));
}
},{}],"scripts/preprocessing/seasonalTrends.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.main = main;

/**
 * @param dataNorm
 * @param seasonalTrends
 */
function main(dataNorm, seasonalTrends) {
  /* We would like something like this:
                [
                    {
                        name: 'product',
                        values: [
                            {
                                date: '2018-01-01',
                                value: 1
                            },
                            ...
                        ]
                    }
                ]
                */
  var dicoData = {};
  dataNorm.forEach(function (d) {
    if (!dicoData[d.product]) {
      dicoData[d.product] = [];
    }

    dicoData[d.product].push({
      date: Date.parse(d.date),
      value: parseFloat(d.value)
    });
  });
  var data = [];

  var _loop = function _loop(key) {
    dicoData[key].sort(function (a, b) {
      return a.date - b.date;
    }); // convert back dates in strings

    var tmpSeparator = {};
    dicoData[key].forEach(function (d) {
      var tmpDate = new Date(d.date);
      var newValue = {
        date: new Date(1995, tmpDate.getMonth(), 1),
        value: d.value,
        originalDate: tmpDate,
        originalYear: tmpDate.getFullYear()
      };

      if (!tmpSeparator[newValue.originalYear]) {
        tmpSeparator[newValue.originalYear] = [];
      }

      tmpSeparator[newValue.originalYear].push(newValue);
    }); // map it to a list of list

    var tmpList = [];

    for (var _key in tmpSeparator) {
      tmpList.push(tmpSeparator[_key]);
    }

    data.push({
      name: key,
      values: tmpList,
      minX: new Date(1995, 0, 1),
      maxX: new Date(1995, 11, 1),
      minY: d3.min(dicoData[key], function (x) {
        return x.value;
      }),
      maxY: d3.max(dicoData[key], function (x) {
        return x.value;
      })
    });
  };

  for (var key in dicoData) {
    _loop(key);
  }

  glob.data.seasonalTrends = {
    mainData: data,
    selectedProd: seasonalTrends,
    current_selection: seasonalTrends[0]
  };
}
},{}],"scripts/preprocessing/inflation.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.main = main;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

/**
 * @param dataNorm
 * @param inflationProducts, list of products to highlight
 * @param inflationProducts
 * @param inflation
 */
function main(dataNorm, inflationProducts, inflation) {
  // Create main object
  var products = _toConsumableArray(new Set(Array.from(dataNorm.map(function (x) {
    return x.product;
  }))));

  var productGrowthRate = products.map(function (product) {
    var category = inflationProducts.includes(product) ? 1 : 0;
    var data = dataNorm.filter(function (x) {
      return x.product === product;
    });
    var rateOfChange = [];

    for (var i = 1; i < data.length; i++) {
      rateOfChange.push({
        product: product,
        dateStr: data[i].date,
        date: new Date(data[i].date),
        value: (data[i].value - data[i - 1].value) / data[i - 1].value * 100,
        category: category
      });
    }

    return {
      product: product,
      category: category,
      data: rateOfChange
    };
  });
  glob.data.inflation = {
    minX: d3.min(productGrowthRate, function (x) {
      return d3.min(x.data, function (d) {
        return d.date;
      });
    }),
    maxX: d3.max(productGrowthRate, function (x) {
      return d3.max(x.data, function (d) {
        return d.date;
      });
    }),
    minY: d3.min(productGrowthRate, function (x) {
      return d3.min(x.data, function (d) {
        return d.value;
      });
    }),
    maxY: d3.max(productGrowthRate, function (x) {
      return d3.max(x.data, function (d) {
        return d.value;
      });
    })
  };
  productGrowthRate.push({
    product: 'Inflation',
    category: 2,
    data: inflation.map(function (d, i) {
      if (i > 0) {
        return {
          product: 'Inflation',
          date: new Date(d.date),
          value: (d['consumer price index'] - inflation[i - 1]['consumer price index']) / inflation[i - 1]['consumer price index'] * 100,
          category: 2
        };
      }
    }).filter(function (x) {
      return x !== undefined;
    })
  });
  glob.data.inflation.data = productGrowthRate;
}
},{}],"scripts/graphics/seasonalTrends.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.main = main;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

/**
 * @param data
 */
function main() {
  if (glob.data.seasonalTrends.mainData === undefined) {
    return;
  }

  var controls = d3.select('#controls1');
  controls.append('p').text('Products').style('display', 'inline-block');
  controls.append('select').attr('id', 'selectProduct').on('change', function () {
    glob.data.seasonalTrends.current_selection = d3.select('#selectProduct').property('value');
    reBuild();
  }).selectAll('option').data(glob.data.seasonalTrends.selectedProd).enter().append('option').text(function (d) {
    return d;
  }).attr('value', function (d) {
    return d;
  });
  glob.data.seasonalTrends.current_selection = d3.select('#selectProduct').property('value');
  build();
}
/**
 *
 */


function reBuild() {
  d3.select('#vizualization-svg1').selectAll('*').remove();
  build();
}
/**
 *
 */


function build() {
  var data = glob.data.seasonalTrends.mainData.filter(function (d) {
    return d.name === glob.data.seasonalTrends.current_selection;
  })[0];
  var svg = d3.select('#vizualization-svg1'); // Create scales

  var xScale = d3.scaleTime().domain([data.minX, data.maxX]).range([0, glob.sizes.vizSvgSizes.innerWidth]);
  var yScale = d3.scaleLinear().domain([data.minY, data.maxY]).range([glob.sizes.vizSvgSizes.innerHeight, 0]); // Create axes

  var xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat('%b'));
  var yAxis = d3.axisLeft(yScale).tickFormat(d3.format('.2f')); // Adding seasons rects

  var seasons = [{
    name: 'Winter',
    start: new Date(1995, 0, 1),
    end: new Date(1995, 2, 20)
  }, {
    name: 'Spring',
    start: new Date(1995, 2, 20),
    end: new Date(1995, 5, 21)
  }, {
    name: 'Summer',
    start: new Date(1995, 5, 21),
    end: new Date(1995, 8, 22)
  }, {
    name: 'Fall',
    start: new Date(1995, 8, 22),
    end: new Date(1995, 11, 1)
  }];
  var seasonsScale = d3.scaleOrdinal().domain(_toConsumableArray(new Set(Array.from(seasons.map(function (d) {
    return d.name;
  }))))).range(['blue', 'lightgreen', 'green', 'orange']);
  svg.append('g').attr('id', 'seasons-container').attr('transform', "translate(".concat(glob.sizes.vizSvgSizes.margin.left, ", ").concat(glob.sizes.vizSvgSizes.margin.top, ")")).selectAll('.seasons').data(seasons).enter().append('rect').attr('class', 'season').attr('x', function (season) {
    return xScale(season.start);
  }).attr('y', 0).attr('width', function (season) {
    return xScale(season.end) - xScale(season.start);
  }).attr('height', glob.sizes.vizSvgSizes.innerHeight).attr('fill', function (season) {
    return seasonsScale(season.name);
  }).attr('stroke', '#f0f0f0').attr('stroke-width', '1').attr('opacity', 0.5).attr('id', function (season) {
    return season.name;
  }).on('mouseenter', function (season) {
    d3.select(this).attr('opacity', 0.75);
    var svgInfos = d3.select('#vizualization-svg1').node().getBoundingClientRect();
    var divInfos = d3.select('#vizualization-div1').node().getBoundingClientRect();
    var margingContainerGraphic = 10;
    var middleX = svgInfos.left + glob.sizes.vizSvgSizes.margin.left + margingContainerGraphic + xScale(season.start) + (xScale(season.end) - xScale(season.start)) / 2;
    var middleYMarginTooltip = 10;
    var middleY = svgInfos.top + glob.sizes.vizSvgSizes.margin.top - middleYMarginTooltip;
    var divTooltip = d3.select('#vizualization-div1').append('div').attr('id', 'tooltip').style('position', 'absolute').style('z-index', '10').style('background', 'white').style('padding', '10px').style('top', middleY + 'px').style('background', 'transparent').style('text-align', 'center');
    divTooltip.append('p').text(season.name).style('background', 'transparent');
    divTooltip.append('img').attr('src', 'images/' + season.name + '.png').style('width', '25px').style('background', 'transparent');
    d3.select('#tooltip').style('left', function () {
      var offset = d3.select(this).node().getBoundingClientRect().width / 2;
      return middleX - offset + 'px';
    }).style('top', function () {
      var offset = d3.select(this).node().getBoundingClientRect().height;
      return middleY - offset + 'px';
    });
  }).on('mouseleave', function (season) {
    d3.select(this).attr('opacity', 0.5);
    d3.select('#tooltip').remove();
  }); // Create groups and plot axis

  svg.append('g').attr('class', 'x axis').attr('transform', "translate(".concat(glob.sizes.vizSvgSizes.margin.left, ", ").concat(glob.sizes.vizSvgSizes.innerHeight + glob.sizes.vizSvgSizes.margin.top, ")")).call(xAxis);
  svg.append('g').attr('class', 'y axis').attr('transform', "translate(".concat(glob.sizes.vizSvgSizes.margin.left, ", ").concat(glob.sizes.vizSvgSizes.margin.top, ")")).call(yAxis); // Create line plots

  var lineGroup = svg.append('g').attr('transform', "translate(".concat(glob.sizes.vizSvgSizes.margin.left, ", ").concat(glob.sizes.vizSvgSizes.margin.top, ")"));
  data.values.forEach(function (dataYear) {
    lineGroup.append('path').attr('class', 'curve').datum(dataYear).attr('d', d3.line().x(function (e) {
      return xScale(e.date);
    }).y(function (e) {
      return yScale(e.value);
    })).attr('stroke', 'black').attr('stroke-width', '2').attr('fill', 'none').on('mouseenter', function (d) {
      d3.select(this).attr('stroke', 'red').attr('stroke-width', '4');
      d3.select('body').append('div').attr('id', 'tooltip').style('position', 'absolute').style('z-index', '10').style('background', 'white').style('padding', '10px').style('border-radius', '5px').style('box-shadow', '1px 1px 5px black').style('left', d3.event.pageX + glob.sizes.tooltip.offsetY + 'px').style('top', d3.event.pageY + glob.sizes.tooltip.offsetY + 'px').html("<strong>".concat(d.map(function (a) {
        return a.originalYear;
      })[0], "</strong>"));
    }).on('mouseleave', function (d) {
      d3.select(this).attr('stroke', 'black').attr('stroke-width', '2');
      d3.select('#tooltip').remove();
    });
  });
}
},{}],"scripts/preprocessing/smokers.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.main = main;

/**
 * @param dataNorm
 * @param categories
 */
function main(dataNorm) {
  var cigaretteKey = 'Cigarettes (200)';
  var out = dataNorm.filter(function (data) {
    return data.product === cigaretteKey;
  }).map(function (data) {
    return [data.date, data.value];
  });
  glob.data.smokers = out;
}
},{}],"scripts/graphics/smokers.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.main = main;

/**
 *
 * @param {*} data
 */
function main(data) {
  // const svg = d3.select('#vizualization-svg')
  // var dataset1 = [
  //   [1, 1], [12, 20], [24, 36],
  //   [32, 50], [40, 70], [50, 100],
  //   [55, 106], [65, 123], [73, 130],
  //   [78, 134], [83, 136], [89, 138],
  //   [100, 140]
  // ]
  console.log(data);
  var svg = d3.select('#vizualization-svg2');
  var margin = 200; // var width = svg.attr('width') - margin
  // var height = svg.attr('height') - margin

  var width = margin;
  var height = margin;
  var xScale = d3.scaleTime().domain([data.minX, data.maxX]).range([0, glob.sizes.vizSvgSizes.innerWidth]);
  var yScale = d3.scaleLinear().domain([data.minY, data.maxY]).range([glob.sizes.vizSvgSizes.innerHeight, 0]); // Title

  svg.append('text').attr('x', width / 2 + 100).attr('y', 100).attr('text-anchor', 'middle').style('font-family', 'Helvetica').style('font-size', 20).text('Smokers spend'); // X label

  svg.append('text').attr('x', width / 2 + 100).attr('y', height - 15 + 150).attr('text-anchor', 'middle').style('font-family', 'Helvetica').style('font-size', 12).text('Time'); // Y label

  svg.append('text').attr('text-anchor', 'middle').attr('transform', 'translate(60,' + height + ')rotate(-90)').style('font-family', 'Helvetica').style('font-size', 12).text('Price');
  svg.append('g').attr('transform', 'translate(0,' + height + ')').call(d3.axisBottom(xScale));
  svg.append('g').call(d3.axisLeft(yScale));
  svg.append('g').selectAll('dot').data(data).enter().append('circle').attr('cx', function (d) {
    return xScale(d[0]);
  }).attr('cy', function (d) {
    return yScale(d[1]);
  }).attr('r', 2).attr('transform', 'translate(' + 100 + ',' + 100 + ')').style('fill', '#CC0000');
  var line = d3.line().x(function (d) {
    return xScale(d[0]);
  }).y(function (d) {
    return yScale(d[1]);
  }).curve(d3.curveMonotoneX);
  svg.append('path').datum(data).attr('class', 'line').attr('transform', 'translate(' + 100 + ',' + 100 + ')').attr('d', line).style('fill', 'none').style('stroke', '#CC0000').style('stroke-width', '2');
  $('#slider-range').slider({
    range: true,
    min: 0,
    max: 500,
    values: [75, 300],
    slide: function slide(event, ui) {
      $('#amount').val('$' + ui.values[0] + ' - $' + ui.values[1]);
    }
  });
  $('#amount').val('$' + $('#slider-range').slider('values', 0) + ' - $' + $('#slider-range').slider('values', 1));
}
},{}],"scripts/graphics/inflation.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.main = main;

/**
 *
 */
function main() {
  var data = glob.data.inflation; // main svg

  var svg = d3.select('#vizualization-svgInfl'); // Create scales

  var xScale = d3.scaleTime().domain([data.minX, data.maxX]).range([0, glob.sizes.vizSvgSizes.innerWidth]);
  var yScale = d3.scaleLinear().domain([data.minY, data.maxY]).range([glob.sizes.vizSvgSizes.innerHeight, 0]);
  var colorScale = d3.scaleOrdinal().domain([0, 1, 2]).range(['black', 'green', 'red']); // Creates groups

  svg.append('g').call(d3.axisBottom(xScale)).attr('transform', "translate(".concat(glob.sizes.vizSvgSizes.margin.left, ",").concat(glob.sizes.vizSvgSizes.height - glob.sizes.vizSvgSizes.margin.bottom, ")"));
  svg.append('g').call(d3.axisLeft(yScale)).attr('transform', "translate(".concat(glob.sizes.vizSvgSizes.margin.left, ",").concat(glob.sizes.vizSvgSizes.margin.top, ")")); // add legend

  var sizes = glob.sizes.vizSvgSizes;
  var gpeLegend = svg.append('g').attr('transform', function (d, i) {
    return "translate(".concat((sizes.width - sizes.margin.left - sizes.margin.right) / 2 + sizes.margin.left, ",").concat(sizes.margin.top, ")");
  });
  var gpe = gpeLegend.selectAll('.legendElem').data([{
    text: 'Inflation',
    category: 2
  }, {
    text: 'Products with significant deviations from inflation',
    category: 1
  }, {
    text: 'Other products',
    category: 0
  }]).enter().append('g').attr('transform', function (d, i) {
    return "translate(0,".concat(20 * (i + 1), ")");
  });
  gpe.append('rect').attr('width', '50px').attr('height', '2px').attr('transform', 'translate(0,-7)').attr('fill', function (d) {
    return colorScale(d.category);
  });
  gpe.append('text').attr('transform', 'translate(60,0)').attr('font-size', '14px').text(function (d) {
    return d.text;
  });
  var widthLegend = gpeLegend.node().getBoundingClientRect().width;
  gpeLegend.attr('transform', "translate(".concat((sizes.width - sizes.margin.left - sizes.margin.right - widthLegend) / 2 + sizes.margin.left, ",").concat(sizes.margin.top, ")")); // plot curves

  var opacityFunc = function opacityFunc(category) {
    return category === 0 ? 0.5 : 1;
  }; // to move to front on hover : https://stackoverflow.com/questions/14167863/how-can-i-bring-a-circle-to-the-front-with-d3


  d3.selection.prototype.moveToFront = function () {
    return this.each(function () {
      this.parentNode.appendChild(this);
    });
  };

  svg.append('g').attr('id', 'curvesInfl').attr('transform', "translate(".concat(glob.sizes.vizSvgSizes.margin.left, ", ").concat(glob.sizes.vizSvgSizes.margin.top, ")")).selectAll('path').data(data.data).enter().append('path').datum(function (d) {
    return d.data.filter(function (x) {
      return x.date > data.minX;
    });
  }).attr('d', d3.line().x(function (e) {
    return xScale(e.date);
  }).y(function (e) {
    return yScale(e.value);
  })).attr('stroke', function (d) {
    return colorScale(d.map(function (x) {
      return x.category;
    })[0]);
  }).attr('stroke-width', '2').attr('fill', 'none').attr('opacity', function (d) {
    return opacityFunc(d.map(function (x) {
      return x.category;
    })[0]);
  }).on('mouseenter', function (d) {
    d3.select(this).raise();
    d3.select(this).attr('opacity', 1).attr('stroke-width', '4').attr('stroke', 'orange');
    d3.select('body').append('div').attr('id', 'tooltip').style('position', 'absolute').style('z-index', '10').style('background', 'white').style('padding', '10px').style('border-radius', '5px').style('box-shadow', '1px 1px 5px black').style('left', d3.event.pageX + glob.sizes.tooltip.offsetY + 'px').style('top', d3.event.pageY + glob.sizes.tooltip.offsetY + 'px').html("<strong>".concat(d.map(function (x) {
      return x.product;
    })[0], "</strong>"));
  }).on('mouseleave', function (d) {
    d3.select(this).attr('opacity', opacityFunc(d.map(function (x) {
      return x.category;
    })[0])).attr('stroke-width', '2').attr('stroke', colorScale(d.map(function (x) {
      return x.category;
    })[0]));
    d3.select('#tooltip').remove();
    d3.select('#vizualization-svgInfl').select('#curvesInfl').selectAll('path').filter(function (d) {
      return d.map(function (x) {
        return x.category === 2;
      })[0];
    }).attr('stroke-width', '2').raise();
  });
}
},{}],"scripts/preprocessing/categories.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.main = main;

/**
 * @param dataNorm
 * @param categories
 */
function main(dataNorm, categories) {
  var out = {
    same_same: [],
    same_diff: [],
    diff_same: []
  };
  Array.from(['same_same', 'same_diff', 'diff_same']).forEach(function (category) {
    out[category] = categories[category].map(function (group, i) {
      var groupD = {
        name: group.name,
        data: group.data.map(function (product) {
          return dataNorm.filter(function (x) {
            return x.product === product;
          }).map(function (x) {
            return {
              product: x.product,
              date: new Date(x.date),
              value: parseFloat(x.value)
            };
          });
        })
      };
      groupD.minX = d3.min(groupD.data, function (x) {
        return d3.min(x, function (d) {
          return d.date;
        });
      });
      groupD.maxX = d3.max(groupD.data, function (x) {
        return d3.max(x, function (d) {
          return d.date;
        });
      });
      groupD.minY = d3.min(groupD.data, function (x) {
        return d3.min(x, function (d) {
          return d.value;
        });
      });
      groupD.maxY = d3.max(groupD.data, function (x) {
        return d3.max(x, function (d) {
          return d.value;
        });
      });
      return groupD;
    });
  });
  glob.data.categories = out;
}
},{}],"scripts/graphics/categories.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.main = main;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

/**
 *
 */
function main() {
  var dataGlob = glob.data.categories;
  Array.from(['same_same', 'same_diff', 'diff_same']).forEach(function (category) {
    var data = dataGlob[category];
    var controls = d3.select('#controls' + category.charAt(0).toUpperCase() + category.slice(1)); // controls

    controls.append('p').text('Group').style('display', 'inline-block');
    controls.append('select').attr('id', 'selectGpe' + category).on('change', function () {
      glob.data.categories[category].current_gpe = d3.select(this).property('value'); // Rebuild

      reBuild(category);
    }).selectAll('option').data(_toConsumableArray(new Set(Array.from(data.map(function (x) {
      return x.name;
    }))))).enter().append('option').text(function (d) {
      return d;
    }).attr('value', function (d) {
      return d;
    });
    glob.data.categories[category].current_gpe = d3.select('#selectGpe' + category).property('value');
    build(category);
  });
}
/**
 * @param category
 */


function reBuild(category) {
  var svg = d3.select('#cat' + category.charAt(0).toUpperCase() + category.slice(1));
  svg.selectAll('*').remove();
  console.log(glob.data.categories[category].current_gpe);
  build(category);
}
/**
 * @param category
 */


function build(category) {
  var data = glob.data.categories[category].filter(function (x) {
    return x.name === glob.data.categories[category].current_gpe;
  })[0];
  var svg = d3.select('#cat' + category.charAt(0).toUpperCase() + category.slice(1)); // Create scales

  var xScale = d3.scaleTime().domain([data.minX, data.maxX]).range([0, glob.sizes.vizSvgSizes.innerWidth]);
  var yScale = d3.scaleLinear().domain([data.minY, data.maxY]).range([glob.sizes.vizSvgSizes.innerHeight, 0]); // Create axes

  var xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat('%Y'));
  var yAxis = d3.axisLeft(yScale).tickFormat(d3.format('.2f')); // Draw axes

  svg.append('g').attr('class', 'x axis').attr('transform', "translate(".concat(glob.sizes.vizSvgSizes.margin.left, ", ").concat(glob.sizes.vizSvgSizes.innerHeight + glob.sizes.vizSvgSizes.margin.top, ")")).call(xAxis);
  svg.append('g').attr('class', 'y axis').attr('transform', "translate(".concat(glob.sizes.vizSvgSizes.margin.left, ", ").concat(glob.sizes.vizSvgSizes.margin.top, ")")).call(yAxis); // Adding y label

  svg.append('text').text('Price ($)').attr('x', glob.sizes.vizSvgSizes.margin.left / 2).attr('y', glob.sizes.vizSvgSizes.margin.top / 2); // Draw curves

  svg.append('g').attr('id', 'curvesCat').attr('transform', "translate(".concat(glob.sizes.vizSvgSizes.margin.left, ", ").concat(glob.sizes.vizSvgSizes.margin.top, ")")).selectAll('path').data(data.data).enter().append('path').datum(function (d) {
    return d;
  }).attr('d', d3.line().x(function (e) {
    return xScale(e.date);
  }).y(function (e) {
    return yScale(e.value);
  })).attr('stroke', 'black').attr('stroke-width', '2').attr('fill', 'none').on('mouseenter', function (d) {
    d3.select(this).attr('opacity', 1).attr('stroke-width', '4').attr('stroke', 'orange');
    d3.select('body').append('div').attr('id', 'tooltip').style('position', 'absolute').style('z-index', '10').style('background', 'white').style('padding', '10px').style('border-radius', '5px').style('box-shadow', '1px 1px 5px black').style('left', d3.event.pageX + glob.sizes.tooltip.offsetY + 'px').style('top', d3.event.pageY + glob.sizes.tooltip.offsetY + 'px').html("<strong>".concat(d.map(function (x) {
      return x.product;
    })[0], "</strong>"));
  }).on('mouseleave', function (d) {
    d3.select(this).attr('stroke-width', '2').attr('stroke', 'black');
    d3.select('#tooltip').remove();
  });
}
},{}],"index.js":[function(require,module,exports) {
"use strict";

var resize = _interopRequireWildcard(require("./scripts/resize.js"));

var preprocessSeason = _interopRequireWildcard(require("./scripts/preprocessing/seasonalTrends.js"));

var preprocessInfl = _interopRequireWildcard(require("./scripts/preprocessing/inflation.js"));

var seasons = _interopRequireWildcard(require("./scripts/graphics/seasonalTrends.js"));

var preprocessSmokers = _interopRequireWildcard(require("./scripts/preprocessing/smokers"));

var smokers = _interopRequireWildcard(require("./scripts/graphics/smokers"));

var inflation = _interopRequireWildcard(require("./scripts/graphics/inflation.js"));

var preprocessCat = _interopRequireWildcard(require("./scripts/preprocessing/categories.js"));

var categories = _interopRequireWildcard(require("./scripts/graphics/categories.js"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

window.glob = {
  sizes: {
    vizDivSizes: {
      width: 0,
      height: 0
    },
    vizSvgSizes: {
      width: 0,
      height: 0,
      margin: {
        top: 40,
        right: 80,
        bottom: 40,
        left: 80
      },
      innerWidth: 0,
      innerHeight: 0
    },
    tooltip: {
      offsetX: 15,
      offsetY: 20
    }
  },
  data: {}
};

(function (d3) {
  // TODO: programmatically add the sections texts
  // scroller.centerSections()
  resize.updateResize(); // scroller.svgCenter()

  d3.csv('data_norm.csv').then(function (dataNorm) {
    d3.json('seasonalTrends.json').then(function (seasonalTrends) {
      d3.json('inflationProducts.json').then(function (inflationProducts) {
        d3.csv('inflation.csv').then(function (inflation) {
          d3.json('categories_groups.json').then(function (categories) {
            preprocessSeason.main(dataNorm, seasonalTrends);
            preprocessInfl.main(dataNorm, inflationProducts, inflation);
            preprocessCat.main(dataNorm, categories);
            preprocessSmokers.main(dataNorm);
            build(glob.data);
          });
        });
      });
    });
  });
  window.addEventListener('resize', function () {
    d3.selectAll('.visualization-svg').selectAll('*').remove();
    d3.selectAll('.controls').selectAll('*').remove();
    resize.updateResize();
    build();
  });

  function build(data) {
    seasons.main(glob.data);
    smokers.main(glob.data.smokers);
    inflation.main();
    categories.main();
  }
})(d3);
},{"./scripts/resize.js":"scripts/resize.js","./scripts/preprocessing/seasonalTrends.js":"scripts/preprocessing/seasonalTrends.js","./scripts/preprocessing/inflation.js":"scripts/preprocessing/inflation.js","./scripts/graphics/seasonalTrends.js":"scripts/graphics/seasonalTrends.js","./scripts/preprocessing/smokers":"scripts/preprocessing/smokers.js","./scripts/graphics/smokers":"scripts/graphics/smokers.js","./scripts/graphics/inflation.js":"scripts/graphics/inflation.js","./scripts/preprocessing/categories.js":"scripts/preprocessing/categories.js","./scripts/graphics/categories.js":"scripts/graphics/categories.js"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "53464" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/src.e31bb0bc.js.map
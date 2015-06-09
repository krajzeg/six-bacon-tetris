(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _tetromino = require('./tetromino');

var _tetromino2 = _interopRequireDefault(_tetromino);

var PLAYFIELD_WIDTH = 10,
    PLAYFIELD_HEIGHT = 20;
var BLOCK_COLORS = {
	'empty': '#aaa',
	'solid': '#555',
	'active': '#a00'
};
var INITIAL_PLAYFIELD_STATE = _.range(0, 10).map(function (x) {
	return _.range(0, 20).map(function (y) {
		return 'empty';
	});
});

var ticks = Bacon.repeatedly(1000, 'tick!');

var landscapePlayfield = Bacon.once(INITIAL_PLAYFIELD_STATE);
var tetromino = ticks.scan(_tetromino2['default'].create('s', { x: 4, y: 0 }, 0), function (t, _) {
	return t.movedBy(0, 1);
});

Bacon.repeatedly(1000, []);

var playfield = Bacon.combineWith(combinePlayfields, landscapePlayfield, tetromino.map(function (block) {
	return block.blockmap();
}));
playfield.onValue(playfieldRenderer());

function combinePlayfields() {
	for (var _len = arguments.length, playfields = Array(_len), _key = 0; _key < _len; _key++) {
		playfields[_key] = arguments[_key];
	}

	var width = playfields[0].length,
	    height = playfields[0][0].length;
	return _.range(0, width).map(function (x) {
		return _.range(0, height).map(function (y) {
			return _(playfields).map(function (p) {
				return p[x][y];
			}).find(function (b) {
				return b != 'empty';
			}) || 'empty';
		});
	});
}

function playfieldRenderer() {
	var canvas = document.getElementById('playfield'),
	    ctx2d = canvas.getContext('2d'),
	    blockWidth = canvas.width / PLAYFIELD_WIDTH,
	    blockHeight = canvas.height / PLAYFIELD_HEIGHT;

	return function (playfield) {
		console.log('Drawing!');
		ctx2d.clearRect(0, 0, canvas.width, canvas.height);
		playfield.map(function (column, x) {
			return column.map(function (block, y) {
				ctx2d.fillStyle = BLOCK_COLORS[block];
				ctx2d.fillRect(x * blockWidth, y * blockHeight, blockWidth - 1, blockHeight - 1);
			});
		});
	};
}

},{"./tetromino":2}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var INITIAL_PLAYFIELD_STATE = _.range(0, 10).map(function (x) {
	return _.range(0, 20).map(function (y) {
		return 'empty';
	});
});

var TETROMINO_SHAPES = {
	's': [' ##', '## ']
};

var Tetromino = (function () {
	function Tetromino(shape, position, rotation) {
		_classCallCheck(this, Tetromino);

		this.shape = shape;
		this.position = position;
		this.rotation = rotation;
	}

	_createClass(Tetromino, [{
		key: 'blockmap',
		value: function blockmap() {
			var _this = this;

			return _.range(0, 10).map(function (x) {
				return _.range(0, 20).map(function (y) {
					return _this.occupies(x, y) ? 'active' : 'empty';
				});
			});
		}
	}, {
		key: 'movedBy',
		value: function movedBy(dx, dy) {
			var _position = this.position;
			var x = _position.x;
			var y = _position.y;

			return new Tetromino(this.shape, { x: x + dx, y: y + dy }, this.rotation);
		}
	}, {
		key: 'rotated',
		value: function rotated(by) {
			return new Tetromino(this.shape, this.position, (this.rotation + 4 + by) % 4);
		}
	}, {
		key: 'occupies',
		value: function occupies(x, y) {
			// transform coordinates into "shape space"
			var shapeX = x - this.position.x;
			var shapeY = y - this.position.y;

			// check the character at those coordinates in the shape
			var shapeChar = (this.shape[shapeY] || '').charAt(shapeX);
			// occupied?
			return shapeChar && shapeChar != ' ';
		}
	}], [{
		key: 'create',
		value: function create(tetrominoType, position, rotation) {
			return new Tetromino(TETROMINO_SHAPES[tetrominoType], position, rotation);
		}
	}]);

	return Tetromino;
})();

exports['default'] = Tetromino;
module.exports = exports['default'];

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkOi9wcm9kL3Byb2ovbWluaS9mcnAtdGV0cmlzL3NyYy90ZXRyaXMuanMiLCJkOi9wcm9kL3Byb2ovbWluaS9mcnAtdGV0cmlzL3NyYy90ZXRyb21pbm8uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O3lCQ1VzQixhQUFhOzs7O0FBVm5DLElBQU0sZUFBZSxHQUFHLEVBQUU7SUFBRSxnQkFBZ0IsR0FBRyxFQUFFLENBQUM7QUFDbEQsSUFBTSxZQUFZLEdBQUc7QUFDcEIsUUFBTyxFQUFFLE1BQU07QUFDZixRQUFPLEVBQUUsTUFBTTtBQUNmLFNBQVEsRUFBRSxNQUFNO0NBQ2hCLENBQUM7QUFDRixJQUFNLHVCQUF1QixHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFBLENBQUM7UUFDbkQsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQUEsQ0FBQztTQUFJLE9BQU87RUFBQSxDQUFDO0NBQUEsQ0FDaEMsQ0FBQzs7QUFJRixJQUFJLEtBQUssR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQzs7QUFFNUMsSUFBSSxrQkFBa0IsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLHVCQUF1QixDQUFDLENBQUM7QUFDN0QsSUFBSSxTQUFTLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FDekIsdUJBQVUsTUFBTSxDQUFDLEdBQUcsRUFBRSxFQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBQyxFQUFFLENBQUMsQ0FBQyxFQUN0QyxVQUFDLENBQUMsRUFBQyxDQUFDO1FBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0NBQUEs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QUM7OztBQUVoRSxPQUFJLFNBQVMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFBLENBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDOztBQUUxRCxVQUFPLFNBQVMsSUFBSyxTQUFTLElBQUksR0FBRyxBQUFDLENBQUM7R0FDdkM7OztTQTNCWSxnQkFBQyxhQUFhLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRTtBQUNoRCxVQUFPLElBQUksU0FBUyxDQUFDLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxFQUFFLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztHQUMxRTs7O1FBVG1CLFNBQVM7OztxQkFBVCxTQUFTIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImNvbnN0IFBMQVlGSUVMRF9XSURUSCA9IDEwLCBQTEFZRklFTERfSEVJR0hUID0gMjA7XHJcbmNvbnN0IEJMT0NLX0NPTE9SUyA9IHtcclxuXHQnZW1wdHknOiAnI2FhYScsXHJcblx0J3NvbGlkJzogJyM1NTUnLFxyXG5cdCdhY3RpdmUnOiAnI2EwMCdcclxufTtcclxuY29uc3QgSU5JVElBTF9QTEFZRklFTERfU1RBVEUgPSBfLnJhbmdlKDAsIDEwKS5tYXAoeCA9PlxyXG5cdF8ucmFuZ2UoMCwgMjApLm1hcCh5ID0+ICdlbXB0eScpXHJcbik7XHJcblxyXG5pbXBvcnQgVGV0cm9taW5vIGZyb20gJy4vdGV0cm9taW5vJztcclxuXHJcbnZhciB0aWNrcyA9IEJhY29uLnJlcGVhdGVkbHkoMTAwMCwgXCJ0aWNrIVwiKTtcclxuXHJcbnZhciBsYW5kc2NhcGVQbGF5ZmllbGQgPSBCYWNvbi5vbmNlKElOSVRJQUxfUExBWUZJRUxEX1NUQVRFKTtcclxudmFyIHRldHJvbWlubyA9IHRpY2tzLnNjYW4oXHJcblx0VGV0cm9taW5vLmNyZWF0ZSgncycsIHt4OiA0LCB5OiAwfSwgMCksIFxyXG5cdCh0LF8pID0+IHQubW92ZWRCeSgwLCAxKVxyXG4pO1xyXG5cclxuQmFjb24ucmVwZWF0ZWRseSgxMDAwLCBbXSk7XHJcblxyXG52YXIgcGxheWZpZWxkID0gQmFjb24uY29tYmluZVdpdGgoXHJcblx0Y29tYmluZVBsYXlmaWVsZHMsIFxyXG5cdGxhbmRzY2FwZVBsYXlmaWVsZCxcclxuXHR0ZXRyb21pbm8ubWFwKGJsb2NrID0+IGJsb2NrLmJsb2NrbWFwKCkpXHJcbik7XHJcbnBsYXlmaWVsZC5vblZhbHVlKHBsYXlmaWVsZFJlbmRlcmVyKCkpO1xyXG5cclxuXHJcbmZ1bmN0aW9uIGNvbWJpbmVQbGF5ZmllbGRzKC4uLnBsYXlmaWVsZHMpIHtcclxuXHRsZXQgd2lkdGggPSBwbGF5ZmllbGRzWzBdLmxlbmd0aCwgaGVpZ2h0ID0gcGxheWZpZWxkc1swXVswXS5sZW5ndGg7XHJcblx0cmV0dXJuIF8ucmFuZ2UoMCwgd2lkdGgpLm1hcCh4ID0+XHJcblx0XHRfLnJhbmdlKDAsIGhlaWdodCkubWFwKHkgPT4gKFxyXG5cdFx0XHRfKHBsYXlmaWVsZHMpLm1hcChwID0+IHBbeF1beV0pLmZpbmQoYiA9PiAoYiAhPSAnZW1wdHknKSkgfHwgJ2VtcHR5J1xyXG5cdFx0KSkpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBwbGF5ZmllbGRSZW5kZXJlcigpIHtcclxuXHRsZXQgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BsYXlmaWVsZCcpLFxyXG5cdCAgICBjdHgyZCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpLFxyXG5cdCAgICBibG9ja1dpZHRoID0gY2FudmFzLndpZHRoIC8gUExBWUZJRUxEX1dJRFRILCBibG9ja0hlaWdodCA9IGNhbnZhcy5oZWlnaHQgLyBQTEFZRklFTERfSEVJR0hUO1xyXG5cclxuXHRyZXR1cm4gKHBsYXlmaWVsZCkgPT4ge1xyXG5cdFx0Y29uc29sZS5sb2coXCJEcmF3aW5nIVwiKTtcdFxyXG5cdFx0Y3R4MmQuY2xlYXJSZWN0KDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XHJcblx0XHRwbGF5ZmllbGQubWFwKChjb2x1bW4sIHgpID0+XHJcblx0XHRcdGNvbHVtbi5tYXAoKGJsb2NrLCB5KSA9PiB7XHJcblx0XHRcdFx0Y3R4MmQuZmlsbFN0eWxlID0gQkxPQ0tfQ09MT1JTW2Jsb2NrXTtcclxuXHRcdFx0XHRjdHgyZC5maWxsUmVjdCh4ICogYmxvY2tXaWR0aCwgeSAqIGJsb2NrSGVpZ2h0LCBibG9ja1dpZHRoIC0gMSwgYmxvY2tIZWlnaHQgLSAxKTtcclxuXHRcdFx0fSkpO1xyXG5cdH07XHJcbn1cclxuIiwiXHJcbmNvbnN0IElOSVRJQUxfUExBWUZJRUxEX1NUQVRFID0gXy5yYW5nZSgwLCAxMCkubWFwKHggPT5cclxuXHRfLnJhbmdlKDAsIDIwKS5tYXAoeSA9PiAnZW1wdHknKVxyXG4pO1xyXG5cclxuY29uc3QgVEVUUk9NSU5PX1NIQVBFUyA9IHtcclxuXHQncyc6IFtcIiAjI1wiLFxyXG5cdCAgICAgIFwiIyMgXCJdXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRldHJvbWlubyB7XHJcblx0Y29uc3RydWN0b3Ioc2hhcGUsIHBvc2l0aW9uLCByb3RhdGlvbikge1xyXG5cdFx0dGhpcy5zaGFwZSA9IHNoYXBlO1xyXG5cdFx0dGhpcy5wb3NpdGlvbiA9IHBvc2l0aW9uO1xyXG5cdFx0dGhpcy5yb3RhdGlvbiA9IHJvdGF0aW9uO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIGNyZWF0ZSh0ZXRyb21pbm9UeXBlLCBwb3NpdGlvbiwgcm90YXRpb24pIHtcclxuXHRcdHJldHVybiBuZXcgVGV0cm9taW5vKFRFVFJPTUlOT19TSEFQRVNbdGV0cm9taW5vVHlwZV0sIHBvc2l0aW9uLCByb3RhdGlvbik7XHJcblx0fVxyXG5cclxuXHRibG9ja21hcCgpIHtcclxuXHRcdHJldHVybiBfLnJhbmdlKDAsIDEwKS5tYXAoeCA9PlxyXG5cdFx0XHRfLnJhbmdlKDAsIDIwKS5tYXAoeSA9PiAgXHJcblx0XHRcdFx0dGhpcy5vY2N1cGllcyh4LCB5KSA/ICdhY3RpdmUnIDogJ2VtcHR5J1xyXG5cdFx0XHQpKTtcclxuXHR9XHJcblxyXG5cdG1vdmVkQnkoZHgsIGR5KSB7XHJcblx0XHRsZXQge3gsIHl9ID0gdGhpcy5wb3NpdGlvbjtcclxuXHRcdHJldHVybiBuZXcgVGV0cm9taW5vKHRoaXMuc2hhcGUsIHt4OiB4ICsgZHgsIHk6IHkgKyBkeX0sIHRoaXMucm90YXRpb24pO1xyXG5cdH1cclxuXHJcblx0cm90YXRlZChieSkge1xyXG5cdFx0cmV0dXJuIG5ldyBUZXRyb21pbm8odGhpcy5zaGFwZSwgdGhpcy5wb3NpdGlvbiwgKHRoaXMucm90YXRpb24gKyA0ICsgYnkpICUgNClcclxuXHR9XHJcblxyXG5cdG9jY3VwaWVzKHgsIHkpIHtcclxuXHRcdC8vIHRyYW5zZm9ybSBjb29yZGluYXRlcyBpbnRvIFwic2hhcGUgc3BhY2VcIlxyXG5cdFx0bGV0IFtzaGFwZVgsIHNoYXBlWV0gPSBbeCAtIHRoaXMucG9zaXRpb24ueCwgeSAtIHRoaXMucG9zaXRpb24ueV07XHJcblx0XHQvLyBjaGVjayB0aGUgY2hhcmFjdGVyIGF0IHRob3NlIGNvb3JkaW5hdGVzIGluIHRoZSBzaGFwZVxyXG5cdFx0bGV0IHNoYXBlQ2hhciA9ICh0aGlzLnNoYXBlW3NoYXBlWV0gfHwgXCJcIikuY2hhckF0KHNoYXBlWCk7XHJcblx0XHQvLyBvY2N1cGllZD9cclxuXHRcdHJldHVybiBzaGFwZUNoYXIgJiYgKHNoYXBlQ2hhciAhPSAnICcpO1xyXG5cdH1cclxufVxyXG4iXX0=

const PLAYFIELD_WIDTH = 10, PLAYFIELD_HEIGHT = 20;
const BLOCK_COLORS = {
	'empty': '#aaa',
	'solid': '#555',
	'active': '#a00'
};
const INITIAL_PLAYFIELD_STATE = _.range(0, 10).map(x =>
	_.range(0, 20).map(y => 'empty')
);

import Tetromino from './tetromino';

var ticks = Bacon.repeatedly(1000, "tick!");

var landscapePlayfield = Bacon.once(INITIAL_PLAYFIELD_STATE);
var tetromino = ticks.scan(
	Tetromino.create('s', {x: 4, y: 0}, 0), 
	(t,_) => t.movedBy(0, 1)
);

Bacon.repeatedly(1000, []);

var playfield = Bacon.combineWith(
	combinePlayfields, 
	landscapePlayfield,
	tetromino.map(block => block.blockmap())
);
playfield.onValue(playfieldRenderer());


function combinePlayfields(...playfields) {
	let width = playfields[0].length, height = playfields[0][0].length;
	return _.range(0, width).map(x =>
		_.range(0, height).map(y => (
			_(playfields).map(p => p[x][y]).find(b => (b != 'empty')) || 'empty'
		)));
}

function playfieldRenderer() {
	let canvas = document.getElementById('playfield'),
	    ctx2d = canvas.getContext('2d'),
	    blockWidth = canvas.width / PLAYFIELD_WIDTH, blockHeight = canvas.height / PLAYFIELD_HEIGHT;

	return (playfield) => {
		console.log("Drawing!");	
		ctx2d.clearRect(0, 0, canvas.width, canvas.height);
		playfield.map((column, x) =>
			column.map((block, y) => {
				ctx2d.fillStyle = BLOCK_COLORS[block];
				ctx2d.fillRect(x * blockWidth, y * blockHeight, blockWidth - 1, blockHeight - 1);
			}));
	};
}

const PLAYFIELD_WIDTH = 10, PLAYFIELD_HEIGHT = 20;
const BLOCK_COLORS = {
	'empty': '#aaa',
	'solid': '#555',
	'active': '#a00'
};

import BlockMap from './blockmap';
import Tetromino from './tetromino';

var ticks = Bacon.repeatedly(1000, "tick!");

var landscape = Bacon.once(BlockMap.empty());
var tetromino = ticks.scan(
	Tetromino.create('s', {x: 4, y: 0}, 0), 
	(t,_) => t.movedBy(0, 1)
);

Bacon.repeatedly(1000, []);

var playfield = Bacon.combineWith(
	BlockMap.combine, 
	landscape,
	tetromino.map(t => t.blockmap())
);
playfield.onValue(playfieldRenderer());


function playfieldRenderer() {
	let canvas = document.getElementById('playfield'),
	    ctx2d = canvas.getContext('2d'),
	    blockWidth = canvas.width / PLAYFIELD_WIDTH, blockHeight = canvas.height / PLAYFIELD_HEIGHT;

	return (blocks) => {
		console.log("Drawing!");	
		ctx2d.clearRect(0, 0, canvas.width, canvas.height);

		blocks.map((block, x, y) => {
			ctx2d.fillStyle = BLOCK_COLORS[block];
			ctx2d.fillRect(x * blockWidth, y * blockHeight, blockWidth - 1, blockHeight - 1);			
		});
	};
}

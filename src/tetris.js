const PLAYFIELD_WIDTH = 10, PLAYFIELD_HEIGHT = 20;
const BLOCK_COLORS = {
	'empty': '#aaa',
	'solid': '#555',
	'active': '#a00'
};

import BlockMap from './blockmap';
import Tetromino from './tetromino';

let timeToFall = Bacon.repeatedly(1000, "tick!"),
	leftPressed = keypressStream(37), rightPressed = keypressStream(39), downPressed = keypressStream(40), spacePressed = keypressStream(32);

let landscape = Bacon.once(BlockMap.empty());


let tetrominoActions = Bacon.mergeAll(
	// out of user control - falling over time
	timeToFall.map(() => Tetromino.moveBy(0, 1)),

	// user controls of the tetromino
	leftPressed.map(() => Tetromino.moveBy(-1, 0)),
	rightPressed.map(() => Tetromino.moveBy(1, 0)),
	downPressed.map(() => Tetromino.moveBy(0, 1))
);

let tetromino = tetrominoActions.scan(
	Tetromino.create('s', {x: 4, y: 0}, 0), 
	(t, action) => {
		return action(t);
	}
);

let display = Bacon.combineWith( BlockMap.combine, landscape, tetromino.map(t => t.blockmap()) );
display.onValue(playfieldRenderer());

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

function keypressStream(keyCode) {
	return $(window).asEventStream('keydown')
		.map((evt) => evt.which)
		.filter((code) => code == keyCode);
}
const PLAYFIELD_WIDTH = 10, PLAYFIELD_HEIGHT = 20;
const BLOCK_COLORS = {
	'empty': '#aaa',
	'solid': '#555',
	'active': '#a00'
};

import BlockMap from './blockmap';
import Tetromino from './tetromino';

let ticks = Bacon.repeatedly(1000, "tick!"),
	keyLeft = keypressStream(37), keyRight = keypressStream(39), keyDown = keypressStream(40), keyRotate = keypressStream(32);

let landscape = Bacon.once(BlockMap.empty());


let tetrominoMoves = Bacon.mergeAll(
	ticks.map(() => [0, 1]),
	keyLeft.map(() => [-1, 0]),
	keyRight.map(() => [1, 0]),
	keyDown.map(() => [0, 1])
);
let tetromino = tetrominoMoves.scan(
	Tetromino.create('s', {x: 4, y: 0}, 0), 
	(t, delta) => {
		let [dx, dy] = delta;
		return t.movedBy(dx, dy)
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
import BlockMap from './blockmap';

const INITIAL_PLAYFIELD_STATE = _.range(0, 10).map(x =>
	_.range(0, 20).map(y => 'empty')
);

const TETROMINO_SHAPES = {
	's': [" ##",
	      "## "]
}

export default class Tetromino {
	constructor(shape, position, rotation) {
		this.shape = shape;
		this.position = position;
		this.rotation = rotation;
	}

	static create(tetrominoType, position, rotation) {
		return new Tetromino(TETROMINO_SHAPES[tetrominoType], position, rotation);
	}

	static moveBy(dx, dy) {
		return (t) => {
			let {x, y} = t.position;
			return new Tetromino(t.shape, {x: x+dx, y: y+dy}, t.rotation)
		};
	}

	blockmap() {
		return BlockMap.fromFn((x, y) => this.occupies(x, y) ? 'active' : 'empty');
	}

	rotated(by) {
		return new Tetromino(this.shape, this.position, (this.rotation + 4 + by) % 4)
	}

	// is the tetromino out of playfield bounds?
	outOfBounds() {		
		return _(this.occupiedBlocks()).any( (block) => {
			let {x, y} = block;
			return x < 0 || x >= BlockMap.WIDTH || y >= BlockMap.HEIGHT
		});
	}

	// are the coordinates x,y occupied by this block?
	occupies(x, y) {
		// transform coordinates into "shape space"
		let [shapeX, shapeY] = [x - this.position.x, y - this.position.y];
		// check the character at those coordinates in the shape
		let shapeChar = (this.shape[shapeY] || "").charAt(shapeX);
		// occupied?
		return shapeChar == '#';
	}

	// returns a list of playfield coordinates occupied by this block, e.g. [{x: 5, y: 7}, {x: 6, y: 7} ...]
	occupiedBlocks() {
		let shape = this.shape;
		var coords = [];
		shape.map((row, shapeY) => {
			_.map(row, (character, shapeX) => {
				if (character == "#") {
					let [x,y] = [this.position.x + shapeX, this.position.y + shapeY];
					coords.push({x: x, y: y});
				}
			})
		});

		return coords;
	}
}

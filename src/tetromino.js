
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

	blockmap() {
		return _.range(0, 10).map(x =>
			_.range(0, 20).map(y =>  
				this.occupies(x, y) ? 'active' : 'empty'
			));
	}

	movedBy(dx, dy) {
		let {x, y} = this.position;
		return new Tetromino(this.shape, {x: x + dx, y: y + dy}, this.rotation);
	}

	rotated(by) {
		return new Tetromino(this.shape, this.position, (this.rotation + 4 + by) % 4)
	}

	occupies(x, y) {
		// transform coordinates into "shape space"
		let [shapeX, shapeY] = [x - this.position.x, y - this.position.y];
		// check the character at those coordinates in the shape
		let shapeChar = (this.shape[shapeY] || "").charAt(shapeX);
		// occupied?
		return shapeChar && (shapeChar != ' ');
	}
}

import BlockMap from './blockmap';

const INITIAL_PLAYFIELD_STATE = _.range(0, 10).map(x =>
	_.range(0, 20).map(y => 'empty')
);

const TETROMINO_SHAPES = {
	's': [" ##",
	      "## "]
}

export default class Tetromino {
	constructor(shape, position, rotation, locked) {
		this.shape = shape;
		this.position = position;
		this.rotation = rotation;
		this.locked = locked;
	}

	static create(tetrominoType, position, rotation) {
		return new Tetromino(TETROMINO_SHAPES[tetrominoType], position, rotation, false);
	}

	static moveBy(dx, dy) {
		return (t) => {
			// can't move locked tetrominoes
			if (t.locked) return t;

			// try to move
			let {x, y} = t.position;
			let moved = t.update({
				position: {x: x+dx, y: y+dy}
			});
			
			// check for collisions
			let collision = moved.outOfBounds();
			if (collision) {
				// we've collided with something - was it the ground?
				if (dy > 0) {
					// yup, let's lock the tetromino in place
					return t.update({locked: true});
				} else {
					// nope - just prevent the move
					return t;
				}
 			} else {
				// the move to the new position was successful
				return moved;
			}
		};
	}

	update(properties) {
		let updated = new Tetromino(this.shape, this.position, this.rotation, this.locked);
		for (let prop in properties)
			updated[prop] = properties[prop];
		return updated;
	}

	blockmap() {
		return BlockMap.fromFn((x, y) => this.occupies(x, y) ? 'active' : 'empty');
	}

	// is the tetromino out of playfield bounds?
	outOfBounds() {		
		return _(this.occupiedBlocks()).any( (block) => {
			let {x, y} = block;
			return x < 0 || x >= BlockMap.WIDTH || y >= BlockMap.HEIGHT
		});
	}

	// are the coordinates x,y occupied by this tetromino?
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

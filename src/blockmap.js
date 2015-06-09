export default class BlockMap {
	constructor(fn) {
		this.items = _.range(0, BlockMap.WIDTH).map(x =>
			_.range(0, BlockMap.HEIGHT).map(y => fn(x, y))
		);
	}

	static empty() {
		return BlockMap.fromFn(() => 'empty');
	}

	static fromFn(fn) {
		return new BlockMap(fn);
	}

	at(x, y) {
		return this.items[x][y];
	}

	map(fn) {
		return this.items.map((column, x) =>
			column.map((block, y) => fn(block, x, y))
		);
	}

	static combine(...maps) {
		return BlockMap.fromFn((x, y) => 
			_(maps).map(p => p.at(x, y)).find(b => (b != 'empty')) || 'empty'
		);
	}
}

BlockMap.WIDTH = 10;
BlockMap.HEIGHT = 20;

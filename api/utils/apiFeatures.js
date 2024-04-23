class APIFeatures {
	constructor(query, queryObj) {
		this.query = query;
		// this.queryObj = queryObj;
		this.queryObj = this._removeFalsyValues(queryObj);
	}

	_removeFalsyValues(obj) {
		const cleanObject = {};

		for (const [key, value] of Object.entries(obj)) {
			if (value && typeof value === 'object' && !Array.isArray(value)) {
				const cleanedNestedObject = this._removeFalsyValues(value);
				if (Object.keys(cleanedNestedObject).length > 0) {
					cleanObject[key] = cleanedNestedObject;
				}
			} else if (Boolean(value)) {
				cleanObject[key] = value;
			}
		}

		return cleanObject;
	}

	search() {
		const { searchKey, searchValue } = this.queryObj;
		if (!searchKey || !searchValue) return this;

		this.query = this.query.find({
			[searchKey]: { $regex: searchValue, $options: 'i' },
		});

		return this;
	}

	filter() {
		const queryObjCopy = { ...this.queryObj };
		const excludedFields = [
			'searchKey',
			'searchValue',
			'page',
			'sort',
			'limit',
			'fields',
		];
		excludedFields.forEach(field => delete queryObjCopy[field]);

		let queryObjCopyStr = JSON.stringify(queryObjCopy);
		queryObjCopyStr = queryObjCopyStr.replace(
			/\b(gte|gt|lte|lt)\b/g,
			match => `$${match}`
		);
		this.query = this.query.find(JSON.parse(queryObjCopyStr));

		return this;
	}

	sort() {
		if (this.queryObj.sort) {
			const sortBy = this.queryObj.sort.split(',').join(' ');
			this.query = this.query.sort(sortBy);
		} else {
			this.query = this.query.sort('-createdAt');
		}

		return this;
	}

	limitFields() {
		if (this.queryObj.fields) {
			const fields = this.queryObj.fields.split(',').join(' ');
			this.query = this.query.select(fields);
		} else {
			this.query = this.query.select('-__v');
		}

		return this;
	}

	paginate() {
		const page = +this.queryObj.page || 1;
		const limit = +this.queryObj.limit || 10;
		const skip = (page - 1) * limit;

		this.query = this.query.skip(skip).limit(limit);

		return this;
	}
}

module.exports = APIFeatures;

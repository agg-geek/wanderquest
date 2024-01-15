class APIFeatures {
	constructor(query, queryObj) {
		this.query = query;
		this.queryObj = queryObj;
	}

	filter() {
		const queryObjCopy = { ...this.queryObj };
		const excludedFields = ['page', 'sort', 'limit', 'fields'];
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

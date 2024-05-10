class ApiFeatures {
  constructor(mongooseQuery, queryString) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  }

  filter() {
    const queryStringOjb = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields', 'keyword'];
    excludedFields.forEach((field) => delete queryStringOjb[field]);

    let queryStr = JSON.stringify(queryStringOjb);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);

    this.mongooseQuery.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      // sort=price,ratingsAverage
      const sortBy = this.queryString.sort.split(',').join(' '); // sort('price ratingsAverage')
      this.mongooseQuery.sort(sortBy);
    } else {
      this.mongooseQuery.sort('-createdAt'); // default sorting
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      // fields=title,price
      const fields = this.queryString.fields.split(',').join(' '); // fields('title price')
      this.mongooseQuery.select(fields);
    } else {
      this.mongooseQuery.select('-__v');
    }
    return this;
  }

  search() {
    if (this.queryString.keyword) {
      // search by title or description
      const query = {};
      query.$or = [
        { title: { $regex: this.queryString.keyword, $options: 'i' } }, // i for case-insensitive
        { description: { $regex: this.queryString.keyword, $options: 'i' } },
      ];

      this.mongooseQuery.find(query);
    }
    return this;
  }

  paginate(countDocuments) {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 15;
    const skip = (page - 1) * limit;
    const endIndex = page * limit;

    // Pagination Results
    const pagination = {};
    pagination.currentPage = page;
    pagination.limit = limit;
    // pagination.total = await this.mongooseQuery.model.modelName.countDocuments();
    // pagination.totalPages = Math.ceil(pagination.total / limit);
    pagination.numOfPages = Math.ceil(countDocuments / limit);

    // next page
    if (endIndex < countDocuments) {
      pagination.next = page + 1;
    }
    if (skip > 0) {
      pagination.prev = page - 1;
    }

    this.mongooseQuery.skip(skip).limit(limit);
    this.paginationResult = pagination;
    return this;
  }

  populate(populateOptions) {
    this.mongooseQuery.populate(populateOptions);
    return this;
  }

  async execute() {
    return await this.mongooseQuery;
  }
}

module.exports = ApiFeatures;

const asyncHadler = require('express-async-handler');
const ApiError = require('../utils/apiError');
const ApiFeatures = require('../utils/apiFeatures');

exports.getOne = (Model, popOptions) =>
  asyncHadler(async (req, res, next) => {
    const { id } = req.params;
    let query = Model.findById(id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;
    if (!doc) {
      return next(new ApiError(404, `No document found with this id ${id}`));
    }
    res.status(200).json({ data: doc });
  });

exports.getAll = (Model) =>
  asyncHadler(async (req, res) => {
    let filter = {};
    if (req.filterObj) filter = req.filterObj;
    // build query
    const countDocuments = await Model.countDocuments();
    const apiFeatures = new ApiFeatures(Model.find(filter), req.query)
      .paginate(countDocuments)
      .filter()
      .search()
      .limitFields()
      .sort();

    // execute query
    const { mongooseQuery, paginationResult } = apiFeatures;
    const docs = await mongooseQuery;

    res.status(200).json({
      results: docs.length,
      paginationResult,
      data: docs,
    });
  });

exports.createOne = (Model) =>
  asyncHadler(async (req, res) => {
    const doc = await Model.create(req.body);
    res.status(201).json({ data: doc });
  });

exports.updateOne = (Model) =>
  asyncHadler(async (req, res, next) => {
    const { id } = req.params;
    const doc = await Model.findByIdAndUpdate(id, req.body, {
      new: true,
      // runValidators: true,  // run validators on update
    });
    if (!doc) {
      return next(new ApiError(404, `No document found with this id ${id}`));
    }
    res.status(200).json({ data: doc });
  });

exports.deleteOne = (Model) =>
  asyncHadler(async (req, res, next) => {
    const { id } = req.params;
    const doc = await Model.findByIdAndDelete(id);
    if (!doc) {
      return next(new ApiError(404, `No document found with this id ${id}`));
    }
    res.status(204).json({ data: null });
  });

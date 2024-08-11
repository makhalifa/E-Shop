const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');
const ApiFeatures = require('../utils/apiFeatures');

exports.getOne = (Model, popOptions) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    let query = Model.findById(id); // mongoose query
    if (popOptions) query = query.populate(popOptions); // populate query
    const doc = await query;  // execute query
    if (!doc) {
      return next(new ApiError(404, `No document found with this id ${id}`));
    }
    res.status(200).json({ data: doc });
  });

exports.getAll = (Model) =>
  asyncHandler(async (req, res) => {
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
  asyncHandler(async (req, res) => {
    const doc = await Model.create(req.body);
    res.status(201).json({ data: doc });
  });

exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
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

exports.updateSingleField = (Model, field) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const doc = await Model.findOneAndUpdate(
      { _id: id },
      { [field]: req.body[field] },
      { new: true }
    );
    if (!doc) {
      return next(new ApiError(404, `No document found with this id ${id}`));
    }
    res.status(200).json({ data: doc });
  });

exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const doc = await Model.findByIdAndDelete(id);
    if (!doc) {
      return next(new ApiError(404, `No document found with this id ${id}`));
    }
    res.status(204).json({ data: null });
  });

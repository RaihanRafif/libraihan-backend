
exports.create = async (req, res, next) => {
    try {
      

        res.status(201).json({
            message: "Book created successfully.",
            data: createdBook,
        });
    } catch (err) {
        next(err);
    }
};
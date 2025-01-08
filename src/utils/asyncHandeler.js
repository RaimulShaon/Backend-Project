const asyncHandler = (fn) => async (req, res, next) => {            //api resopse er jonno bebohar korar karone ekti molot akare deyar jonno toiri
    try {
        await fn(req, res, next);
    } catch (err) {
        res.status(err.code || 500).json({
            success: false,
            message: err.message
        });
    }
}

export { asyncHandler };

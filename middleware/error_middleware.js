const errorHandler = () => (err, req, res, next) => {
    // Set the status code
    let statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
    let message = err.message;

    if (err.errors || err.name === "SequelizeValidationError") {
        const errorList = err.errors.map((e) => {
            let obj = {};
            obj[e.path] = e.message;
            return obj;
        });
        message = errorList;
        statusCode = 400;
    }

    res.status(statusCode);
    res.json({
        message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
}

module.exports = { errorHandler, notFound };
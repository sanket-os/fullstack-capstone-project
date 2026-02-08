const errorHandler = (err, req, res, next) => {
    console.error(err); // optional
    res.status(res.statusCode || 500).json({  
        success: false,
        message: err.message,
    });
};

module.exports = errorHandler;
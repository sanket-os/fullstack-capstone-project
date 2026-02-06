const errorHandler = (err, req, res, next) => {
    console.error(err); // optional
    res.status(res.statusCode || 500).json({   // >>>>>>>>>>>> GPT RES => 500 not 404 
        success: false,
        message: err.message,
    });
};

module.exports = errorHandler;
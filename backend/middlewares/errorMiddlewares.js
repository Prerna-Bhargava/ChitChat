const notFound = (req,res,next)=>{
    const error = new Error(`Not Found - ${req.originalUrl} `);
    res.status(404)
    next(error);
}
const OtherErrorHandler = (err,req,res,next)=>{
    res.json({
        message:err.message,
    })
    const error = new Error(`Not Found - ${req.originalUrl} `);
    res.status(404)
    next(error);
}

module.exports = {notFound,OtherErrorHandler}
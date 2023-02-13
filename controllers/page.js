exports.renderMain=(req,res,next) => {
    res.render('main',{title: 'Testing'});
}
exports.renderJoin=(req,res,next) => {
    res.render('join',{title: 'Join'});
}
exports.getInvalidPage = (req,res) => {
    //res.status(404).sendFile(path.join(__dirname , 'views' , '404.html'));
    res.status(404).render("404" , {
        pageTitle : 'Invalid URL' ,
        path:'/invalid'});
};

exports.getErrorPage = ( req , res ) => {
    res.status(500).render("500" , {
        pageTitle : 'Error Occured' ,
        path:'/error'});
}
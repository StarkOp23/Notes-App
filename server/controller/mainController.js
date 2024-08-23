//! Get Homepage
exports.homepage = async (req, res) => {
    const locals = {
        title: "Notes",
        description: 'Notes Application'
    }
    res.render('home', {
        locals,
        layout:'../views/layouts/front-page'
    });
}

//! Get About
exports.about = async (req, res) => {
    const locals = {
        title: "About-Notes",
        description: 'Notes Application'
    }
    res.render('about', locals);
}
const Rooster = require('../models/Rooster');

const index = (req, res) => {
    res.render('admin/index', {title:'Tableau de bord', path: '/admin', admin: true});
}

const getRoosters = (req, res) => {
    const currentPage = 1; 
    if(req.params.page) currentPage = +req.params.page
    const itemsPerPage = 3;
    const startIndex = (currentPage - 1) * itemsPerPage;
    Rooster.count(count => {
        var pages = [];
        var startPage = 0, endPage = 0;
        let maxPage = Math.ceil(count.count / itemsPerPage);
        if(currentPage === 1 && currentPage+2 <= maxPage) {
            startPage = currentPage;
            endPage = currentPage + 2;
        }else if(currentPage === 1 && maxPage === 1) {
            startPage = currentPage;
            endPage = currentPage;
        } else if(currentPage >= 2 && (currentPage+2 <= maxPage || currentPage+2 > maxPage)) {
            startPage = currentPage - 1;  
            endPage = currentPage + 1;
        } 
        for(let i = startPage; i <= endPage; i++) {
            if(i <= maxPage) {
                pages.push(i);
            } 
        }
        Rooster.findAndPaginate( startIndex, itemsPerPage,(roosters) => {
            res.render('roosters/index', {title: 'Admininstration', path: '/admin',roosters, pages, currentPage, admin: true});
        });
    });  
}

const getRooster = (req, res) => {
    Rooster.findById(req.params.id,(user) => {
        res.render('roosters/rooster', { rooster , admin: true});
    }); 
}

const addRooster = (req, res) => {
    res.render('roosters/form', {title:'Administration', path: '/admin', admin: true, page: 'add'})
}

const saveRooster = (req, res) => {
    var file = 'no-image.png';
    if(req.file != undefined) {
        file = req.file.filename;
    }
    Rooster.create(req.body, file, success => {
        res.redirect('/admin/roosters');
    })
}

const editRooster = (req, res) => {
    Rooster.findById(req.params.id,(rooster) => {
        res.render('roosters/form', {title: 'Administration', rooster, admin: true, page: 'edit'});
    });
}

const updateRooster = (req, res) => {
    var file = 'no-image.png';
    if(req.file != undefined) {
        file = req.file.filename;
    }
    Rooster.update(req.params.id, req.body, file, success => {
        res.redirect('/admin/roosters');
    });
}

const deleteRooster = (req, res) => {
    Rooster.remove(req.params.id, success => {
        res.redirect('/admin/roosters');
    });
}

module.exports = {
    index,
    getRoosters,
    getRooster,
    addRooster,
    saveRooster,
    editRooster,
    updateRooster,
    deleteRooster
}
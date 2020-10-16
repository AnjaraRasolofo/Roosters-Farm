const User = require('../models/User');

const getUsers = (req, res) => {
    const currentPage = +req.params.page;
    const itemsPerPage = 3;
    const startIndex = (currentPage - 1) * itemsPerPage;
    User.count(count => {
        var pages = [];
        var startPage = 0, endPage = 0;
        let maxPage = Math.ceil(count.count / itemsPerPage);
        if(currentPage === 1 && currentPage+2 <= maxPage) {
            startPage = currentPage;
            endPage = currentPage + 2;
        } else if(currentPage >= 2 && (currentPage+2 <= maxPage || currentPage+2 > maxPage)) {
            startPage = currentPage - 1;  
            endPage = currentPage + 1;
        } 
        for(let i = startPage; i <= endPage; i++) {
            if(i <= maxPage) {
                pages.push(i);
            } 
        }
        User.findAndPaginate( startIndex, itemsPerPage,(users) => {
            res.render('admin/users', {title: 'admin', users, pages, currentPage, admin: true});
        });
    });   
}

const getUser = (req, res) => {
    User.findById(req.params.id,(user) => {
        res.render('admin/user', { user, admin: true});
    }); 
}

const addUser = (req, res) => {
    User.create(req.body, success => {
        res.redirect('admin/users');
    })
}

const editUser = (req, res) => {
    User.update(req.body, success => {
        res.redirect('admin/users');
    });
}

const deleteUser = (req, res) => {
    User.delete(req.params.id, success => {
        res.redirect('admin/users');
    });
}

module.exports = {
    getUsers,
    getUser,
    addUser,
    editUser,
    deleteUser
}
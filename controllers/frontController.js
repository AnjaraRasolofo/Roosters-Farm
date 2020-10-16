const User = require('../models/User');
const Rooster = require('../models/Rooster');
const Cart = require('../models/Cart');
const bcrypt = require('bcrypt');

const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const PASSWORD_REGEX = /^(?=.*\d).{4,20}$/;
var basket = [];

const index = (req, res) => {
    let sess = req.session;
    let user = sess.username ? sess.username : '';
    let buy = 0;
    if(sess.cart) {
        buy = sess.cart.length;
    }
    const currentPage = 1;
    if(req.params.page) currentPage = +req.params.page;
    const itemsPerPage = 3;
    const startIndex = (currentPage - 1) * itemsPerPage;
    Rooster.count(count => {
        var pages = [];
        var startPage = 0, endPage = 0;
        let maxPage = Math.ceil(count / itemsPerPage);
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
        Rooster.findAndPaginate( startIndex, itemsPerPage,(roosters) => {
            res.render('index', {title: 'Accueil - 301 Rooster Farm', path: '/',roosters, pages, currentPage, admin: false, user, buy});
        });
    });  
}

const login = (req, res) => {
    res.render('users/login', {title: 'Login', error: false, path: '/login', admin: false, buy:0})
}

const loginCheck = (req, res) => {
    var {email,password} = req.body;
    let session = req.session;
    if(email === '' || password === '') {
        res.render('users/login', {title:'Login', path: '/login',error: true, message: 'Veuillez remplir les champs!', admin: false});
    }

    User.findByEmail(email, (userFound) => {
        if(userFound) {
            bcrypt.compare(password , userFound.password, function(err, result) {
                if(result) {
                    session.userId = userFound.id;
                    session.username = userFound.username;
                    res.redirect('/');
                } else {
                    res.render('users/login', {title: 'Login', path: '/login', error: true, message: 'Login ou Mot de passe incorrect', admin: false});
                } 
            });
        }
        else {
            res.render('users/login', {title: 'Login', error: true, message: 'Utilisateur introuvable', admin: false, path: 'login'});
        }
    });
}

const logout = (req, res) => {
    req.session.destroy((err) => {
        if(err) {
            return console.log(err);
        }
        res.redirect('/');
    });
}

const register = (req, res) => {
    res.render('users/register', {title: 'Register', error: false, path: '/register',admin:false, buy:0});
}

const saveUser = (req, res) => {
    var { email, username, password, confirm} = req.body;

    if(email === '' || username === '' || password === '') {
        res.render('users/register', {title: "S'inscrire", admin: false, path: '/register', error: true, message: 'Veuillez remplir les champs!'});
    }

    if(username.length >= 13 || username.length <= 4) {
        res.render('users/register', {title: "S'incrire", admin: false, path: '/register',error: true, message: 'Le nom devrait être compris entre 4 - 12 caractères'});
    }

    if(!EMAIL_REGEX.test(email)) {
        res.render('users/register', {title: "S'inscrire",admin: false, path: '/register', error: true, message: 'Adresse email invalide!'});
    }

    if(!PASSWORD_REGEX.test(password)) {
        res.render('users/register', {title: "S'inscrire",admin: false, path: '/register', error: true, message: 'Le mot de passe devrait être compris entre 4 - 20 caractères et doit contenir un chiffre'});
    }

    if(password !== confirm) {
        res.render('users/register', {title: "S'inscrire",admin: false, path: '/register', error: true, message: 'Veuiller Reconfirmer votre mot de passe!'});
    }

    User.findByEmail(email, (result) => {
        if(result) {
            res.render('users/register', {title: "S'inscrire",admin: false, path: '/register', message: 'L\'email existe déjà, Veuillez choisir une autre adresse'});
        }
        else {
            var newUser = req.body;
            bcrypt.hash(newUser.password, 10, (err, hash) => {
                newUser.password = hash;
                User.create(newUser, () => {
                    res.redirect('/login');
                });
            });
        }
    });
}

const getRooster = (req, res) => {
    Rooster.findById(req.params.id,(user) => {
        res.render('/rooster', { rooster , admin: true});
    });
}

const cart = (req, res) => {
    let sess = req.session;
    let buy = 0;
    let items = [];
    if(sess.cart) {
        buy = sess.cart.length;
        items = sess.cart;
        totalPrice = sess.totalPrice;
        livraison = 0;
        res.render('cart', { title: 'Panier' , path: '/cart' ,admin: false, buy, items, totalPrice, livraison});
    } 
    else {
        res.render('cart', { title: 'Panier' , path: '/cart' ,admin: false, buy: 0, error: true,message: "Veuillez vous connecter pour faire un achat"});
    }
    
}

const buy = (req, res) => {
    let sess = req.session;
    if(sess.userId) {
        sess.cart = [];
        if(!sess.totalPrice) {
            sess.totalPrice = 0
        }
        Rooster.findById(req.body.roosterId, item => {
            let rooster = {id: item.id, name: item.name,image: item.image, price: item.price};
            let totalPrice = sess.totalPrice;
            totalPrice = totalPrice + item.price;
            basket.push(rooster);
            sess.cart = basket;
            sess.totalPrice = totalPrice;
            res.redirect('/');
        });
    }
    else {
        res.redirect("/login");
    }
    
}

module.exports = {
    index,
    login,
    loginCheck,
    logout,
    register,
    saveUser,
    getRooster,
    cart,
    buy
}
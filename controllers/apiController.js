const User = require('../models/User');
const Rooster = require('../models/Rooster');
const Cart = require('../models/Cart');
const bcrypt = require('bcrypt');
const jwtUtils = require('../jwt.utils');

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
            if(roosters) {
                res.status(201).json(roosters);
            }
            else {
                res.status(404).json({'error':"Aucun enregistrement à afficher"});
            }
        });
    });  
}

const login = (req, res) => {
    var {email,password} = req.body;
    let session = req.session;
    if(email === '' || password === '') {
        return res.status(400).json({'error':'missing parameters'})
    }

    User.findByEmail(email, (userFound) => {
        if(userFound) {
            bcrypt.compare(password , userFound.password, function(err, result) {
                if(result) {
                    session.userId = userFound.id;
                    session.username = userFound.username;
                    res.status(200).json({
                        'userId': userFound.id,
                        'token' : jwtUtils.generateTokenForUser(userFound) 
                    });
                } else {
                    return res.status(403).json({'error':'Login ou mot de passe incorrect'})
                } 
            });
        }
        else {
            res.status(404).json({'error':'Utitlisateur introuvable'})
        }
    });
}

const logout = (req, res) => {
    req.session.destroy((err) => {
        if(err) {
            return console.log(err);
        }
        res.status(200).json({'message':'Déconnexion reussie!'});
    });
}

const register = (req, res) => {
    var { email, username, password, confirm} = req.body;

    if(email === '' || username === '' || password === '') {
        return res.status(400).json({'error':'Veuillez remplir les champs!'});
    }

    if(username.length >= 13 || username.length <= 4) {
        return res.status(400).json({'error':'Le nom devrait être compris entre 4 - 12 caractères'});
    }

    if(!EMAIL_REGEX.test(email)) {
        return res.status(400).json({'error':'Adresse email invalide!'});
    }

    if(!PASSWORD_REGEX.test(password)) {
        return res.status(400).json({'error':'Le mot de passe devrait être compris entre 4 - 20 caractères et doit contenir un chiffre'})
    }

    if(password !== confirm) {
        return res.status(400).json({'error':'Veuiller Reconfirmer votre mot de passe!'})
    }

    User.findByEmail(email, (result) => {
        if(result) {
            res.status(400).json({'error':'L\'email existe déjà, Veuillez choisir une autre adresse'});
        }
        else {
            var newUser = req.body;
            bcrypt.hash(newUser.password, 10, (err, hash) => {
                newUser.password = hash;
                User.create(newUser, () => {
                    res.status(201).json({'message':'Nouvel utilisateur crée'});
                });
            });
        }
    });
}

const getRooster = (req, res) => {
    Rooster.findById(req.params.id,(rooster) => {
        if(rooster) {
            res.status(201).json(rooster);
        }
        else {
            res.status(404).json({'error':"L'animal n'existe pas"});
        }
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
        if(items) {
            res.status(200).json({items, buy, totalPrice, livraison});
        }
        else {
            res.status(400).json({'error':"Aucun achat dans le panier"});
        }
    } 
    else {
        res.status(400).json({'error':"Aucun achat dans le panier"});
    }
    
}

const buy = (req, res) => {
    let sess = req.session;
    console.log(sess);
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
            res.status(201).json({'message':'Achat effectué'});
        });
    }
    else {
        res.status(400).json({'error':"Veuillez vous connecter pour faire un achat"});
    }
    
}

module.exports = {
    index,
    login,
    logout,
    register,
    getRooster,
    cart,
    buy
}
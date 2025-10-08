const { response } = require('express');
const bcrypt = require('bcryptjs');
const User  = require('../models/User');
const { generarJWT } = require('../helpers/jwt')

const crearUsuario = async( req, res = response ) => {

    const { email, password } = req.body;

    try {
        
        let user = await User.findOne({ email })
        
        if( user ) {
            return res.status(400).json({
                ok: false,
                msg: 'Un usuario ya existe con ese correo'
            });
        }

        user = new User( req.body );
        
        //Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync( password, salt );

        await user.save();
        const token = await generarJWT( user.id, user.name );

        res.status(201).json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        });

    } catch (error) {
        console.log( error );
        res.status(500).json({
            ok: false,
            msg: 'Error'
        });
    }


}

const loginUsuario = async( req, res = response ) => {

    const { email, password } = req.body;

    try {

        const user = await User.findOne({ email })
        
        if( !user ) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no existe'
            });
        }

        const validPassword = bcrypt.compareSync( password, user.password );

        if( !validPassword ){
            return res.status(400).json({
                ok: false,
                msg: 'Password incorrecto'
            });
        }

        const token = await generarJWT( user.id, user.name );

        res.json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        });

        
    } catch (error) {
        console.log( error );
        res.status(500).json({
            ok: false,
            msg: 'Error'
        })
    }
    
}

const revalidarToken = async( req, res = response ) => {

    const { uid, name } = req;

    const token = await generarJWT( uid, name );;

    res.json({
        ok: true,
        name,
        uid,
        token
    });

}

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
};
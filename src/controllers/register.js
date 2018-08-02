import { Router } from 'express';
import * as userService from '../services/userService';
import Boom from 'boom';
import { userValidator } from '../validators/userValidator';

const router = Router();

//using async await funciton to register user 
//===========================================

router.post('/', userValidator, async (req, res, next) => {
    try{
        const response = await userService.createUser( req.body );
        res.json(response);
    }catch(err){
        next(err);
    }
});

export default router;


//similar action using promises only
// =================================

// router.post('/', userValidator, (req, res, next) => {
//     userService
//       .createUser(req.body)
//       .then(data => res.status(HttpStatus.CREATED).json({ data }))
//       .catch(err => next(err));
//   });


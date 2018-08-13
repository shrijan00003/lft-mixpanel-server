import Boom from 'boom';
import User from '../models/user';
import * as jwtUtils from '../utils/jwtUtils';
import { getObject } from '../utils/getObject';
import bookshelf from '../db';
import { updateClientProfile } from './clientServices';
/**
 * Get all users.
 *
 * @return {Promise}
 */
export function getAllUsers() {
  return User.fetchAll();
}

/**
 * Get a user.
 *
 * @param  {Number|String}  id
 * @return {Promise}
 */
export function getUser(id) {
  return new User({ id }).fetch().then(user => {
    if (!user) {
      throw new Boom.notFound('User not found');
    }

    return user;
  });
}

/**
 * Get a user and check if it already exist
 *
 * @param  {Object}  userData
 * @return {Promise}
 */
export function checkUsers(userData) {
  const countUser = User.query(q => {
    q.where('user_name', userData.user_name).orWhere('user_email', userData.user_email);
  }).count();

  return countUser;
}

/**
 * Create new user.
 *
 * @param  {Object}  user
 * @return {Promise}
 */
export async function createUser(user) {
  const _user = await new User({
    firstName: user.first_name,
    lastName: user.last_name,
    userName: user.user_name,
    userEmail: user.user_email,
    phone: user.phone,
    password: await jwtUtils.getHash(user.password),
  })
    .save()
    .then(user => user.refresh());

  return _user;
}

/**
 * Update a user.
 *
 * @param  {Number|String}  id
 * @param  {Object}         user
 * @return {Promise}
 */
export function updateUser(id, user) {
  return new User({ id })
    .save({
      name: user.name,
      email: user.email,
      password: user.password,
      refresh_token: user.refresh_token,
      deleted_at: user.deleted_at,
    })
    .then(user => user.refresh());
}

/**
 * Delete a user.
 *
 * @param  {Number|String}  id
 * @return {Promise}
 */
// export function deleteUser(id) {
//   return new User({ id }).fetch().then(user => user.destroy());
// }

export function deleteUser(id) {
  return new User({ id })
    .save({
      deletedAt: new Date(),
    })
    .then(user => user.refresh())
    .then(user => {
      if (!user) {
        throw {
          status: 404,
          statusMessage: 'The user you entered did not matched our records.',
        };
      }
      console.log(user);

      return user;
    });
}

/**
 *
 * @param {*} userIndetity
 */
export function fetchUser(userIndetity) {
  if (userIndetity) {
    return User.query(q => {
      q.where('user_email', userIndetity).orWhere('user_name', userIndetity);
    })
      .fetch()
      .then(user => {
        if (!user) {
          throw {
            status: 404,
            statusMessage: 'The user you entered did not matched our records.',
          };
        }

        return user;
      });
  }
}

/**
 * @param { string } userIndetity
 */
export function fetchUserLoginDetails(userIndetity, checkFromDate) {
  if (userIndetity) {
    return User.query(qb => {
      qb.count('*')
        .from('users')
        .join('user_login_details', {
          'users.id': 'user_login_details.user_id',
        })
        .where({ user_email: userIndetity })
        .orWhere({ user_name: userIndetity })
        .andWhere('user_login_details.created_at', '>', checkFromDate)
        .andWhere('user_login_details.status', 0);
    })
      .fetch()
      .then(user => {
        return user;
      });
  }
}

/**
 *
 * @param {*} idParam
 * @param {*} refreshTokenParam
 */
export function updateUserRefreshToken(idParam, refreshTokenParam = null) {
  if (idParam) {
    return User.forge({ id: idParam })
      .save({
        refresh_token: refreshTokenParam,
      })
      .then(user => user.refresh)
      .catch(err => {
        throw { status: 503, message: 'Cannot Update Refresh Token', err };
      });
  }
}

/**
 *
 * @param {*} userId
 * @param {*} refreshToken
 */
export function getByIdAndToken(userId, refreshToken) {
  if (userId && refreshToken) {
    return User.forge({ id: userId, refresh_token: refreshToken })
      .fetch()
      .then(user => {
        if (!user) {
          throw {
            status: 404,
            message: 'User Not Found With this Access Token and Refresh Token',
          };
        }

        return user;
      });
  }
}

/**
 *
 * @param {*} userId
 */
/* 
 "userProfile": {
        "userFullName": "Shrijan Tripathi",
        "userPhone": "1234567890",
        "userEmail": "shrijan00003@gmail.com",
        "userImage": null,
        "isclient": true,
        "domainName": "www.abc.com",
        "companyName": "hello world",
        "plan": "free",
        "description": null
    }
 */
export function updateProfile(userId, body) {
  return bookshelf.transaction(async t => {
    await updateUserProfile(userId, body, { transaction: t });
    await updateClientProfile(userId, body, { transcation: t });
  });
}
const updateUserProfile = (userId, data, t) => {
  return User.forge({ id: userId })
    .save(
      {
        first_name: data.firstName,
        last_name: data.lastName,
        user_name: data.userName,
        phone: data.phone,
        user_email: data.userEmail,
        image_url: data.imageUrl,
      },
      t
    )
    .then(user => user.refresh())
    .then(user => user)
    .catch(err => console.log(err));
};

/**
 * @param {*} userId
 */
export function getUserProfile(userId) {
  if (userId) {
    return User.forge({ id: userId, deletedAt: null })
      .fetch({
        withRelated: ['clientDetails'],
      })
      .then(async userData => {
        if (!userData) {
          throw {
            status: 404,
            message: 'USER NOT FOUND',
          };
        }

        // this will return userobject from json
        const userObject = await getObject(userData);

        const clientDetails = userObject.clientDetails ? userObject.clientDetails[0] : null;

        const data = {
          userFullName: `${userObject.firstName} ${userObject.lastName}`,
          userPhone: userObject.phone,
          userEmail: userObject.userEmail,
          userImage: userObject.imageUrl,
          isclient: clientDetails ? true : false,
          domainName: clientDetails ? clientDetails.domainName : null,
          companyName: clientDetails ? clientDetails.companyName : null,
          plan: clientDetails ? clientDetails.plan : null,
          description: clientDetails ? clientDetails.description : null,
        };

        return data;
      })
      .catch(err => {
        console.log(err);
        throw {
          status: 400,
          message: 'ERROR OCCURED DURING FETCHING DATA',
        };
      });
  }

  return userId;
} // end of getUserClient

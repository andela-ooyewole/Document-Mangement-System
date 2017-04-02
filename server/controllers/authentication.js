import jwt from 'jsonwebtoken';
import model from '../models/';

const Users = model.user;
const secret = process.env.SECRET || 'demosecret';

export default {
  login(req, res) {
    return Users
      .findOne({ where: { email: req.body.email } })
      .then((user) => {
        if ((user === null) && (req.body.email)) {
          return res.status(404).send({
            message: 'Authentication Failed. User not found.',
          });
        }
        if (!req.body.email) {
          return res.status(400).send({
            message: 'No email entered',
          });
        }
        // check if password matches
        if (!user.verifyPassword(req.body.password)) {
          return res.status(401).send({
            message: 'Authentication failed. Wrong password.'
          });
        }
        const token = jwt.sign({
          data: user
        }, secret, {
          expiresIn: '24h' // expires in 24 hours
        });
        return res.status(200).send({
          message: 'Authentication successfull.',
          token
        });
      })
      .catch(error => res.status(400).send({
        error,
        message: 'Error authenticating user.'
      }));
  },
  logout(req, res) {
    return res.status(200).send({
      message: 'Loggout successfull.'
    });
  }
};

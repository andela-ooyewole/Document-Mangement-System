/* eslint-disable */
import jwt from 'jsonwebtoken';
import model from '../models/';
import helper from './helper/';
/* eslint-enable */

const user = model.user;
const document = model.document;
const role = model.role;
const secret = process.env.SECRET || 'demosecret';

export default {
  create(req, res) {
    return user
      .findOne({
        where: {
          email: req.body.email
        }
      })
      .then((foundUser) => {
        if (foundUser) {
          return res.status(409).send({ message: 'User Already Exists' });
        }
        user.roleId = req.body.roleId || 2;
        user
          .create(req.body)
          .then((newUser) => {
            const token = jwt.sign({
              data: newUser
            }, secret, {
              expiresIn: '24h' // expires in 24 hours
            });
            return res.status(201).send({
              newUser, message: 'User created successfully', token });
          })
          .catch(error => res.status(400).send({
            error, message: `Error creating ${req.body.name}` }));
      });
  },
  list(req, res) {
    return user
      .findAll({ offset: req.query.offset || 0, limit: req.query.limit || 20 })
      .then((foundUser) => {
        if (!foundUser) {
          return res.status(404).send({ message: 'No User Found' });
        }
        return res
          .status(200)
          .send({ status: true, foundUser });
      })
      .catch(error => res.status(400).send({
        error, message: 'Error retrieving users' }));
  },
  retrieve(req, res) {
    return user
      .findById(req.params.id, {
        include: [
          {
            model: document,
            as: 'documents'
          }
        ]
      })
      .then((foundUser) => {
        if (!foundUser) {
          return res.status(404).send({ message: 'User Not Found' });
        }
        return res
          .status(200)
          .send({ foundUser });
      })
      .catch(error => res.status(400).send({
        error, message: 'Error occurred while retrieving user' }));
  },
  update(req, res) {
    role.findById(req.decoded.data.roleId)
    .then(() => {
      if (helper.isAdmin(req, res)
        || helper.isOwner(req, res)) {
        return user
          .find({ where: {
            id: req.params.id } })
            .then((foundUser) => {
              if (!foundUser) {
                return res.status(404).send({ message: 'User Not Found' });
              }
              return foundUser
              .update(req.body)
                .then(updatedUser => res
                  .status(200).send({ updatedUser,
                    message: 'User updated successfully',

                  }));
            }).catch(error => res.status(400).send({
              error, message: 'Error updating user' }));
      }
      return (res.status(403)
         .send({ message: 'Unauthorized Access' }));
    });
  },
  destroy(req, res) {
    role.findById(req.decoded.data.roleId)
    .then(() => {
      if (helper.isAdmin(req, res) || helper.isOwner(req, res)) {
        return user
          .find({
            where: {
              id: req.params.id
            }
          })
          .then((foundUser) => {
            if (!foundUser) {
              return res.status(404).send({ message: 'User Not Found' });
            }
            return foundUser
              .destroy()
              .then(() => res.status(200).send({
                message: `${foundUser.name} deleted successfully` }));
          })
          .catch(error => res.status(400).send({
            error, message: 'Error deleting user' }));
      }
      return (res.status(403)
         .send({ message: 'Unauthorized Access' }));
    });
  },
  findUserDocuments(req, res) {
    return user
      .findById(req.params.id, {
        include: [
          {
            model: document,
            as: 'documents'
          }
        ] })
      .then((foundUser) => {
        if (!foundUser) {
          return res.status(404).send({ message: 'User Not Found' });
        }
        return res.status(200).send({ doc: foundUser.documents, status: true });
      })
      .catch(error => res.status(400).send({
        error, message: 'Error occurred while retrieving user document' }));
  },
  getExistingUser(req, res) {
    return user
      .find({
        where: {
          $or: [
            { email: req.params.identifier
            }, {
              username: req.params.identifier
            }
          ]
        }
      })
      .then((foundUser) => {
        if (!foundUser) {
          return res.status(404).send({ message: 'User Not Found' });
        }
        return res
          .status(200)
          .send({ foundUser });
      })
      .catch(error => res.status(400).send({
        error, message: 'Error occurred while retrieving user' }));
  }
};

/* eslint-disable */
import model from '../models/';
/* eslint-enable */

const role = model.role;
const user = model.user;

export default {
  create(req, res) {
    return role
      .create({
        title: req.body.title,
      })
      .then(createdRole => res.status(201).send({
        createdRole,
        message: 'Role created succesfully'
      }))
      .catch(error => res.status(400).send({
        error,
        message: 'Error creating new role'
      }));
  },
  list(req, res) {
    return role
      .findAll()
      .then((foundRoles) => {
        if (!foundRoles) {
          return res.status(404).send({
            message: 'Roles Not Found',
          });
        }
        return res.status(200).send({ foundRoles });
      })
      .catch(error => res.status(400).send({
        error,
        message: 'Error retrieving all roles'
      }));
  },
  retrieve(req, res) {
    return role
      .findById(req.params.id, {
        include: [{
          model: user,
          as: 'users',
        }],
      })
      .then((foundRole) => {
        if (!foundRole) {
          return res.status(404).send({
            message: 'Role Not Found',
          });
        }
        return res.status(200).send({ foundRole });
      })
      .catch(error => res.status(400).send({
        error,
        message: 'Error occured while retrieving role'
      }));
  },
  update(req, res) {
    return role
      .findById(req.params.id)
      .then((foundRole) => {
        if (!foundRole) {
          return res.status(404).send({
            message: 'Role Not Found',
          });
        }
        return foundRole
          .update({
            title: req.body.title || foundRole.title,
          })
          .then(() => res.status(200).send({
            foundRole,
            message: 'Role updated successfully.'
          }))
          .catch(error => res.status(400).send({
            error,
            message: 'Role did not update successfully.'
          }));
      })
      .catch(error => res.status(400).send({
        error,
        message: 'Error updating role'
      }));
  },
  destroy(req, res) {
    return role
      .findById(req.params.id)
      .then((foundRole) => {
        if (!foundRole) {
          return res.status(404).send({
            message: 'Role Not Found',
          });
        }
        return foundRole
          .destroy()
          .then(() => res.status(200).send({
            message: 'Role deleted successfully.'
          }));
      })
      .catch(error => res.status(400).send({
        error,
        message: 'Error deleting Role.'
      }));
  },
};

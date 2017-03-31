/* eslint-disable */
import model from '../models/';
import helper from './helper/';
/* eslint-enable */

const document = model.document;
const Roles = model.role;

export default {
  create(req, res) {
    return document
      .create({
        title: req.body.title,
        content: req.body.content,
        access: req.body.access,
        userId: req.body.userId
      })
      .then(newDocument => res.status(201).send({
        newDocument,
        message: 'Document created successfully.'
      }))
      .catch(error => res.status(400).send({
        error,
        message: 'An error occured while creating document'
      }));
  },
  list(req, res) {
    return document
      .findAll({
        offset: req.query.offset || 0,
        limit: req.query.limit || 20,
      })
      .then(foundDocument => res.status(200).send(foundDocument))
      .catch(error => res.status(400).send({
        error,
        message: 'Error retrieving documents'
      }));
  },
  retrieve(req, res) {
    return document
      .findById(req.params.id)
      .then((foundDocument) => {
        if (!foundDocument) {
          return res.status(404).send({
            message: 'Document Not Found',
          });
        }
        return res.status(200).send(foundDocument);
      })
      .catch(error => res.status(400).send({
        error,
        message: 'Error occurred while retrieving documents'
      }));
  },
  findAllUserDocument(req, res) {
    return document
    .findAll({
      where: {
        $or: [
          { access: 'public' },
          {
            role: String(req.decoded.data.roleId)
          },
          {
            userId: req.params.id
          }
        ]
      }
    })
    .then((foundDocument) => {
      if (!foundDocument) {
        return res.status(404).send({
          message: 'Document Not Found',
        });
      }
      return res.status(200).send(foundDocument);
    })
    .catch(error => res.status(400).send({
      error,
      message: 'Error occurred while retrieving documents'
    }));
  },
  update(req, res) {
    Roles.findById(req.decoded.data.roleId)
    .then(() => document
        .find({ where: {
          id: req.params.id } })
          .then((foundDocument) => {
            if (!foundDocument) {
              return res.status(404).send({
                message: 'Document Not Found',
              });
            }
            if (helper.isAdmin(req, res)
            || helper.isOwner(req, res, foundDocument)) {
              return foundDocument
              .update(req.body)
              .then(updatedDoc => res.status(200).send({
                updatedDoc,
                message: 'Document updated successfully'
              }));
            }
            return (res.status(403)
               .send({ message: 'Unauthorized Access' }));
          })
          .catch(error => res.status(400).send({
            error,
            message: 'Error updating document'
          })));
  },
  destroy(req, res) {
    return document
      .find({
        where: {
          id: req.params.id
        },
      })
      .then((foundDocument) => {
        if (!foundDocument) {
          return res.status(404).send({
            message: 'Document Not Found',
          });
        }
        return foundDocument
          .destroy()
          .then(() => res.status(200).send({
            message: `${foundDocument.title}, was successfully deleted`
          }));
      })
      .catch(error => res.status(400).send({
        error,
        message: 'Error deleting document'
      }));
  },
};

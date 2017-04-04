/* eslint-disable */
import model from '../models/';
/* eslint-enable */

const user = model.user;
const document = model.document;

export default {
  userSearch(req, res) {
    return user
      .findAll({
        where: {
          $or: [
            { email: {
              $iLike: `%${req.query.q}%`
            },
              username: {
                $iLike: `%${req.query.q}%`
              } }
          ]
        }
      })
      .then((foundUser) => {
        if (foundUser.length <= 0) {
          return res.status(404)
            .send({
              message: 'Users Not Found',
            });
        }
        return res.status(200)
          .send(foundUser);
      })
    .catch(error => res.status(400).send({
      error,
      message: 'Error occurred while retrieving Users'
    }));
  },

  documentSearch(req, res) {
    return document
      .findAll({
        where: {
          $or: [{ title: { $iLike: `%${req.query.q}%` } },
            { docContent: { $iLike: `%${req.query.q}%` } }]
        }
      })
      .then((foundDocument) => {
        if (foundDocument.length <= 0) {
          return res.status(404)
            .send({
              message: 'Documents Not Found',
            });
        }
        return res.status(200)
          .send(foundDocument);
      })
      .catch(error => res.status(400)
        .send({
          error,
          message: 'Error occurred while retrieving documents'
        }));
  }

};

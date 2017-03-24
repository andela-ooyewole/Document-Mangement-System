import model from '../models/';

const user = model.user;

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
          return res
            .status(409)
            .send({ message: 'User Already Exists' });
        }
        user.roleId = req.body.roleId || 2;
        user
          .create(req.body)
          .then(newUser => res
              .status(201)
              .send({ newUser, message: 'User created successfully' }))
          .catch(error => res.status(400).send({
            error, message: `Error creating ${req.body.name}`
          }));
      })
      .catch(error => res.status(400).send({
        error, message: 'Error creating new user'
      }));
  }
};

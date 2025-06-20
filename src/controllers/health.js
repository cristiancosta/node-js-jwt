const getHealthCheck = (req, res) => res.send({ message: 'ok' });

module.exports = {
  getHealthCheck,
};

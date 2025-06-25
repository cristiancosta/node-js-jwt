const healthController = (database) => {
  const getHealthInfo = async (req, res) => {
    const result = {
      status: 'healthy',
      dependencies: {
        database: 'connected'
      }
    };
    try {
      await database.authenticate();
    } catch (error) {
      result.dependencies = {
        database: 'not-connected',
        reason: JSON.stringify(error)
      };
    }
    res.send(result);
  };

  return {
    getHealthInfo
  };
};

module.exports = healthController;

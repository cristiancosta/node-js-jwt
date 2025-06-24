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
      console.error('getHealthInfo#error', error);
      result.dependencies = { database: 'not-connected' };
    }
    res.send(result);
  };

  return {
    getHealthInfo
  };
};

module.exports = healthController;

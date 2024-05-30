const roleCheckMiddleware = (role) => {
    return (req, res, next) => {
        if (req.userRole !== role) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        next();
    };
  };

module.exports = { roleCheckMiddleware };
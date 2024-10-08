const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
  
    if (!token) {
        return res.status(401).json({ error: 'Acceso no autorizado. Debe proporcionar un token.' });
    }
  
    // Verifica si el token comienza con "Bearer"
    if (!token.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Formato de token inválido. Debe comenzar con "Bearer".' });
    }
  
    // Extrae el token sin la parte "Bearer"
    const tokenWithoutBearer = token.slice(7);
  
    jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET || 'defaultSecretKey', (err, decoded) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ error: 'Token ha expirado.' });
            } else {
                return res.status(403).json({ error: 'Token incorrecto o vencido.' });
            }
        } else {
            req.user = decoded;
            next();
        }
    });
  };

  module.exports = { authenticateToken };
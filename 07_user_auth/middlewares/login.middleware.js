import jsonwebtoken from 'jsonwebtoken'
import ENVConfig from '../env.config.js'

export default function verifyToken (req, res, next) {
  const token = req.headers.authorization.split(' ')[1]
  if (!token) {
    return res.status(403).json({ message: 'No token provided' })
  }
  // verifica si el token es válido
  jsonwebtoken.verify(token, ENVConfig.JWT_SECRET, (error, decoded) => {
    if (error) {
      return res.status(401).json({ message: 'Unauthorized' })
    }
    req.userId = decoded.id
    next()
  })
}

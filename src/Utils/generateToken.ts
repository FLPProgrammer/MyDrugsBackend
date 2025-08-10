import jwt from 'jsonwebtoken';

export function generateToken(payload: object) {
  return jwt.sign(payload, 'secretMyDrugs', { expiresIn: '1h' });
}

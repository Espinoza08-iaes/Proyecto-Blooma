import crypto from 'crypto';
import util from 'util';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('❌ Error de Seguridad: Falta JWT_SECRET. Defínela en backend/.env o en las variables de entorno antes de arrancar.');
}

const pbkdf2Async = util.promisify(crypto.pbkdf2);
const PBKDF2_ITERATIONS = 210000;
const KEY_LENGTH = 64;
const DIGEST = 'sha512';
const DUMMY_SALT = '00'.repeat(16);
const DUMMY_HASH = '00'.repeat(64);

export function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

// Password utility (Async OWASP PBKDF2 con 210,000 iteraciones)
export async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const derived = await pbkdf2Async(password, salt, PBKDF2_ITERATIONS, KEY_LENGTH, DIGEST);
  return { hash: derived.toString('hex'), salt };
}

export async function verifyPassword(password, hash, salt) {
  // Siempre derivar el hash (incluso ante usuarios inexistentes) para mitigar oráculos de tiempo
  const targetSalt = salt || DUMMY_SALT;
  const targetHash = hash || DUMMY_HASH;
  const derived = await pbkdf2Async(password, targetSalt, PBKDF2_ITERATIONS, KEY_LENGTH, DIGEST);
  const derivedHex = derived.toString('hex');
  
  const isMatch = safeEqual(derivedHex, targetHash);
  return Boolean(hash && salt && isMatch);
}

// Custom lightweight JWT helper
export function generateToken(payload) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const exp = Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 30); // 30 days
  const tokenPayload = Buffer.from(JSON.stringify({ ...payload, exp })).toString('base64url');
  
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${header}.${tokenPayload}`)
    .digest('base64url');
    
  return `${header}.${tokenPayload}.${signature}`;
}

export function verifyToken(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  
  const [header, payload, signature] = parts;
  const expectedSignature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${header}.${payload}`)
    .digest('base64url');
    
  if (!safeEqual(signature, expectedSignature)) return null;
  
  try {
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
      return null; // Expired
    }
    return decoded;
  } catch (error) {
    return null;
  }
}

// Authentication middleware
export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Acceso no autorizado. Token no proporcionado.' });
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ error: 'Acceso no autorizado. Token inválido o expirado.' });
  }

  req.userId = decoded.userId;
  next();
}

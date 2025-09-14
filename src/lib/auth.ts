import { NextRequest } from 'next/server';
import { verifyHashedData, hashData } from './utils';

// Admin credentials (in production, use environment variables)
const ADMIN_CREDENTIALS = {
  username: process.env.ADMIN_USER || 'admin',
  password: process.env.ADMIN_PASS || 'danverse2024!',
};

// IP allowlist for admin access
const ADMIN_IP_ALLOWLIST = process.env.ADMIN_IP_ALLOWLIST?.split(',') || ['127.0.0.1', '::1'];

// Basic Auth header parsing
export function parseBasicAuth(authHeader: string): { username: string; password: string } | null {
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return null;
  }

  try {
    const base64Credentials = authHeader.slice(6);
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');
    
    if (!username || !password) {
      return null;
    }

    return { username, password };
  } catch (error) {
    return null;
  }
}

// Verify admin credentials
export function verifyAdminCredentials(username: string, password: string): boolean {
  return username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password;
}

// Check if IP is in allowlist
export function isIPAllowed(ip: string): boolean {
  if (ADMIN_IP_ALLOWLIST.includes('*')) {
    return true; // Allow all IPs (development only)
  }
  
  return ADMIN_IP_ALLOWLIST.includes(ip);
}

// Get client IP from request
export function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  
  if (cfConnectingIP) return cfConnectingIP;
  if (realIP) return realIP;
  if (forwarded) return forwarded.split(',')[0].trim();
  
  return 'unknown';
}

// Middleware for admin authentication
export function requireAdminAuth(request: NextRequest): { 
  authenticated: boolean; 
  response?: Response; 
  user?: { username: string } 
} {
  // Check IP allowlist
  const clientIP = getClientIP(request);
  if (!isIPAllowed(clientIP)) {
    return {
      authenticated: false,
      response: new Response('Access denied: IP not allowed', {
        status: 403,
        headers: {
          'Content-Type': 'text/plain',
        },
      }),
    };
  }

  // Check Basic Auth
  const authHeader = request.headers.get('authorization');
  if (!authHeader) {
    return {
      authenticated: false,
      response: new Response('Authentication required', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Admin Panel"',
          'Content-Type': 'text/plain',
        },
      }),
    };
  }

  const credentials = parseBasicAuth(authHeader);
  if (!credentials || !verifyAdminCredentials(credentials.username, credentials.password)) {
    return {
      authenticated: false,
      response: new Response('Invalid credentials', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Admin Panel"',
          'Content-Type': 'text/plain',
        },
      }),
    };
  }

  return {
    authenticated: true,
    user: { username: credentials.username },
  };
}

// Generate admin session token (for future use)
export function generateAdminToken(username: string): string {
  const payload = {
    username,
    timestamp: Date.now(),
    role: 'admin',
  };
  
  // In production, use JWT or similar
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

// Verify admin session token
export function verifyAdminToken(token: string): { valid: boolean; user?: { username: string } } {
  try {
    const payload = JSON.parse(Buffer.from(token, 'base64').toString('ascii'));
    
    // Check if token is not too old (24 hours)
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours
    if (Date.now() - payload.timestamp > maxAge) {
      return { valid: false };
    }
    
    return {
      valid: true,
      user: { username: payload.username },
    };
  } catch (error) {
    return { valid: false };
  }
}


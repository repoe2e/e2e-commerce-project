// Authentication handler for E2E-Commerce API
import { corsHeaders, handleCORS, hashPassword, verifyPassword, generateJWT, verifyJWT } from './utils.js';

export async function handleAuth(request, env) {
  const url = new URL(request.url);
  const path = url.pathname;

  try {
    // Register new user
    if (path === '/auth/register' && request.method === 'POST') {
      return await registerUser(request, env);
    }

    // Login user
    if (path === '/auth/login' && request.method === 'POST') {
      return await loginUser(request, env);
    }

    // Logout user
    if (path === '/auth/logout' && request.method === 'POST') {
      return await logoutUser(request, env);
    }

    // Get current user
    if (path === '/auth/me' && request.method === 'GET') {
      return await getCurrentUser(request, env);
    }

    // 404 for unknown auth routes
    return new Response(JSON.stringify({ 
      error: 'Not Found',
      message: 'Auth route not found'
    }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Auth error:', error);
    return new Response(JSON.stringify({ 
      error: 'Authentication Error',
      message: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

// Register new user
async function registerUser(request, env) {
  try {
    const body = await request.json();
    const { name, email, password, profile = 'client' } = body;

    // Validation
    if (!name || !email || !password) {
      return new Response(JSON.stringify({ 
        error: 'Validation Error',
        message: 'Name, email and password are required'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify({ 
        error: 'Validation Error',
        message: 'Invalid email format'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Validate password strength
    if (password.length < 10) {
      return new Response(JSON.stringify({ 
        error: 'Validation Error',
        message: 'Password must be at least 10 characters'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Check if user already exists
    const existingUser = await env.DB.prepare(
      'SELECT id FROM users WHERE email = ?'
    ).bind(email).first();

    if (existingUser) {
      return new Response(JSON.stringify({ 
        error: 'User Exists',
        message: 'User with this email already exists'
      }), {
        status: 409,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const result = await env.DB.prepare(
      'INSERT INTO users (name, email, password, profile, created_at) VALUES (?, ?, ?, ?, ?)'
    ).bind(name, email, hashedPassword, profile, new Date().toISOString()).run();

    const userId = result.meta.last_row_id;

    // Generate JWT token
    const token = await generateJWT({ 
      id: userId, 
      email, 
      name, 
      profile 
    }, env.JWT_SECRET);

    return new Response(JSON.stringify({
      success: true,
      message: 'User created successfully',
      user: {
        id: userId,
        name,
        email,
        profile
      },
      token
    }), {
      status: 201,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Register error:', error);
    return new Response(JSON.stringify({ 
      error: 'Registration Failed',
      message: 'Failed to create user'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

// Login user
async function loginUser(request, env) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validation
    if (!email || !password) {
      return new Response(JSON.stringify({ 
        error: 'Validation Error',
        message: 'Email and password are required'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Find user
    const user = await env.DB.prepare(
      'SELECT id, name, email, password, profile FROM users WHERE email = ?'
    ).bind(email).first();

    if (!user) {
      return new Response(JSON.stringify({ 
        error: 'Authentication Failed',
        message: 'Invalid email or password'
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword) {
      return new Response(JSON.stringify({ 
        error: 'Authentication Failed',
        message: 'Invalid email or password'
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Generate JWT token
    const token = await generateJWT({ 
      id: user.id, 
      email: user.email, 
      name: user.name, 
      profile: user.profile 
    }, env.JWT_SECRET);

    return new Response(JSON.stringify({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        profile: user.profile
      },
      token
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Login error:', error);
    return new Response(JSON.stringify({ 
      error: 'Login Failed',
      message: 'Failed to authenticate user'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

// Logout user
async function logoutUser(request, env) {
  try {
    // In a real implementation, you might want to blacklist the token
    // For now, we'll just return success
    return new Response(JSON.stringify({
      success: true,
      message: 'Logout successful'
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Logout error:', error);
    return new Response(JSON.stringify({ 
      error: 'Logout Failed',
      message: 'Failed to logout user'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

// Get current user
async function getCurrentUser(request, env) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ 
        error: 'Unauthorized',
        message: 'No valid token provided'
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const token = authHeader.substring(7);
    const decoded = await verifyJWT(token, env.JWT_SECRET);

    if (!decoded) {
      return new Response(JSON.stringify({ 
        error: 'Unauthorized',
        message: 'Invalid token'
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      success: true,
      user: {
        id: decoded.id,
        name: decoded.name,
        email: decoded.email,
        profile: decoded.profile
      }
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Get user error:', error);
    return new Response(JSON.stringify({ 
      error: 'Authentication Failed',
      message: 'Failed to get user data'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

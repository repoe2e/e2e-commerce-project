// User management handler for E2E-Commerce API
import { corsHeaders, handleCORS, verifyJWT } from './utils.js';

export async function handleUsers(request, env) {
  const url = new URL(request.url);
  const path = url.pathname;

  try {
    // Get user profile
    if (path === '/users/profile' && request.method === 'GET') {
      return await getUserProfile(request, env);
    }

    // Update user profile
    if (path === '/users/profile' && request.method === 'PUT') {
      return await updateUserProfile(request, env);
    }

    // Change password
    if (path === '/users/password' && request.method === 'PUT') {
      return await changePassword(request, env);
    }

    // Delete user account
    if (path === '/users/account' && request.method === 'DELETE') {
      return await deleteUserAccount(request, env);
    }

    // 404 for unknown user routes
    return new Response(JSON.stringify({ 
      error: 'Not Found',
      message: 'User route not found'
    }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Users error:', error);
    return new Response(JSON.stringify({ 
      error: 'User Management Error',
      message: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

// Get user profile
async function getUserProfile(request, env) {
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

    // Get user from database
    const user = await env.DB.prepare(
      'SELECT id, name, email, profile, created_at FROM users WHERE id = ?'
    ).bind(decoded.id).first();

    if (!user) {
      return new Response(JSON.stringify({ 
        error: 'User Not Found',
        message: 'User not found'
      }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        profile: user.profile,
        created_at: user.created_at
      }
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    return new Response(JSON.stringify({ 
      error: 'Profile Error',
      message: 'Failed to get user profile'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

// Update user profile
async function updateUserProfile(request, env) {
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

    const body = await request.json();
    const { name, email } = body;

    // Validation
    if (!name || !email) {
      return new Response(JSON.stringify({ 
        error: 'Validation Error',
        message: 'Name and email are required'
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

    // Check if email is already taken by another user
    const existingUser = await env.DB.prepare(
      'SELECT id FROM users WHERE email = ? AND id != ?'
    ).bind(email, decoded.id).first();

    if (existingUser) {
      return new Response(JSON.stringify({ 
        error: 'Email Taken',
        message: 'Email is already taken by another user'
      }), {
        status: 409,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Update user
    await env.DB.prepare(
      'UPDATE users SET name = ?, email = ?, updated_at = ? WHERE id = ?'
    ).bind(name, email, new Date().toISOString(), decoded.id).run();

    return new Response(JSON.stringify({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: decoded.id,
        name,
        email,
        profile: decoded.profile
      }
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    return new Response(JSON.stringify({ 
      error: 'Update Failed',
      message: 'Failed to update user profile'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

// Change password
async function changePassword(request, env) {
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

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    // Validation
    if (!currentPassword || !newPassword) {
      return new Response(JSON.stringify({ 
        error: 'Validation Error',
        message: 'Current password and new password are required'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Validate new password strength
    if (newPassword.length < 10) {
      return new Response(JSON.stringify({ 
        error: 'Validation Error',
        message: 'New password must be at least 10 characters'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Get current password hash
    const user = await env.DB.prepare(
      'SELECT password FROM users WHERE id = ?'
    ).bind(decoded.id).first();

    if (!user) {
      return new Response(JSON.stringify({ 
        error: 'User Not Found',
        message: 'User not found'
      }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Verify current password
    const { verifyPassword } = await import('./utils.js');
    const isValidPassword = await verifyPassword(currentPassword, user.password);
    if (!isValidPassword) {
      return new Response(JSON.stringify({ 
        error: 'Invalid Password',
        message: 'Current password is incorrect'
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Hash new password
    const { hashPassword } = await import('./utils.js');
    const hashedNewPassword = await hashPassword(newPassword);

    // Update password
    await env.DB.prepare(
      'UPDATE users SET password = ?, updated_at = ? WHERE id = ?'
    ).bind(hashedNewPassword, new Date().toISOString(), decoded.id).run();

    return new Response(JSON.stringify({
      success: true,
      message: 'Password changed successfully'
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Change password error:', error);
    return new Response(JSON.stringify({ 
      error: 'Password Change Failed',
      message: 'Failed to change password'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

// Delete user account
async function deleteUserAccount(request, env) {
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

    // Delete user account
    await env.DB.prepare(
      'DELETE FROM users WHERE id = ?'
    ).bind(decoded.id).run();

    return new Response(JSON.stringify({
      success: true,
      message: 'Account deleted successfully'
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Delete account error:', error);
    return new Response(JSON.stringify({ 
      error: 'Delete Failed',
      message: 'Failed to delete user account'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

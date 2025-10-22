// Cloudflare Worker - E2E-Commerce API
// Main entry point for authentication and user management

import { handleAuth } from './auth.js';
import { handleUsers } from './users.js';
import { corsHeaders, handleCORS } from './utils.js';

export default {
  async fetch(request, env, ctx) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return handleCORS();
    }

    const url = new URL(request.url);
    const path = url.pathname;

    try {
      // Health check
      if (path === '/health') {
        return new Response(JSON.stringify({ 
          status: 'ok', 
          timestamp: new Date().toISOString(),
          service: 'E2E-Commerce API'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Authentication routes
      if (path.startsWith('/auth/')) {
        return await handleAuth(request, env);
      }

      // User management routes
      if (path.startsWith('/users/')) {
        return await handleUsers(request, env);
      }

      // 404 for unknown routes
      return new Response(JSON.stringify({ 
        error: 'Not Found',
        message: 'Route not found'
      }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });

    } catch (error) {
      console.error('Worker error:', error);
      return new Response(JSON.stringify({ 
        error: 'Internal Server Error',
        message: error.message
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
};

// Cloudflare Pages Functions - Middleware
export function onRequest(context) {
  // Redirect to index.html for SPA routing
  const url = new URL(context.request.url);
  
  // If it's a file request (has extension), serve as is
  if (url.pathname.includes('.')) {
    return context.next();
  }
  
  // For all other requests, serve index.html
  return context.rewrite('/index.html');
}

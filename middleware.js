export const config = {
  matcher: '/',
};

export default async function middleware(request) {
  const userAgent = request.headers.get('user-agent') || '';
  const accept = request.headers.get('accept') || '';

  // curl, wget, and other CLI tools don't send Accept: text/html
  const isCLI = !accept.includes('text/html') ||
                userAgent.toLowerCase().includes('curl') ||
                userAgent.toLowerCase().includes('wget');

  if (isCLI) {
    // Fetch and serve install script directly
    const scriptUrl = new URL('/install.sh', request.url);
    const script = await fetch(scriptUrl);
    const content = await script.text();

    return new Response(content, {
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }

  // Otherwise serve the normal page (let it pass through)
  return;
}

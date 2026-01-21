export async function onRequestPost(context) {
  const { username, password } = await context.request.json();
  
  // In production, you should hash passwords! This is a simplified version
  const { results } = await context.env.DB.prepare(
    "SELECT * FROM users WHERE username = ? AND password = ?"
  ).bind(username, password).all();
  
  if (results.length === 0) {
    return new Response(JSON.stringify({ error: "Invalid credentials" }), { 
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  const user = results[0];
  
  // Update last login
  await context.env.DB.prepare(
    "UPDATE users SET last_login = ? WHERE id = ?"
  ).bind(Math.floor(Date.now() / 1000), user.id).run();
  
  // In production, use proper JWT tokens
  return new Response(JSON.stringify({ 
    success: true, 
    user: {
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
      email: user.email
    }
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

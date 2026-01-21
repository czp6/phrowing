export async function onRequestPost(context) {
  const { username, password, name, email, role } = await context.request.json();
  
  // Check if user already exists
  const { results: existing } = await context.env.DB.prepare(
    "SELECT id FROM users WHERE username = ?"
  ).bind(username).all();
  
  if (existing.length > 0) {
    return new Response(JSON.stringify({ error: "Username already exists" }), { 
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  // In production, hash the password!
  const result = await context.env.DB.prepare(
    "INSERT INTO users (username, password, name, email, role) VALUES (?, ?, ?, ?, ?)"
  ).bind(username, password, name, email, role || 'athlete').run();
  
  return new Response(JSON.stringify({ 
    success: true, 
    userId: result.meta.last_row_id 
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

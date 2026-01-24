export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const userId = url.searchParams.get('id');
  
  if (!userId) {
    return new Response(JSON.stringify({ error: "User ID required" }), { 
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  const user = await context.env.DB.prepare(
    "SELECT id, username, name, email, role, phone, birth_date, height, weight FROM users WHERE id = ?"
  ).bind(userId).first();
  
  if (!user) {
    return new Response(JSON.stringify({ error: "User not found" }), { 
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  return new Response(JSON.stringify(user), {
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function onRequestPut(context) {
  const data = await context.request.json();
  const url = new URL(context.request.url);
  const userId = url.searchParams.get('id');
  
  if (!userId) {
    return new Response(JSON.stringify({ error: "User ID required" }), { 
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  // Check if user exists
  const existingUser = await context.env.DB.prepare(
    "SELECT id FROM users WHERE id = ?"
  ).bind(userId).first();
  
  if (!existingUser) {
    return new Response(JSON.stringify({ error: "User not found" }), { 
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  // Update user profile
  await context.env.DB.prepare(
    `UPDATE users SET
     name = ?, email = ?, phone = ?, birth_date = ?, height = ?, weight = ?
     WHERE id = ?`
  ).bind(
    data.name,
    data.email || null,
    data.phone || null,
    data.birth_date || null,
    data.height || null,
    data.weight || null,
    userId
  ).run();
  
  // Fetch updated user data
  const updatedUser = await context.env.DB.prepare(
    "SELECT id, username, name, email, role, phone, birth_date, height, weight FROM users WHERE id = ?"
  ).bind(userId).first();
  
  return new Response(JSON.stringify({ 
    success: true, 
    user: updatedUser 
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

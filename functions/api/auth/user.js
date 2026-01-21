export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const userId = url.searchParams.get('id');
  
  if (!userId) {
    return new Response(JSON.stringify({ error: "User ID required" }), { 
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  const result = await context.env.DB.prepare(
    "SELECT id, username, name, email, role FROM users WHERE id = ?"
  ).bind(userId).first();
  
  if (!result) {
    return new Response(JSON.stringify({ error: "User not found" }), { 
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  return new Response(JSON.stringify(result), {
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const userId = url.searchParams.get('userId');
  
  if (!userId) {
    return new Response(JSON.stringify({ error: "User ID required" }), { 
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  const { results } = await context.env.DB.prepare(
    "SELECT * FROM strength_records WHERE user_id = ? ORDER BY date DESC LIMIT 100"
  ).bind(userId).all();
  
  return new Response(JSON.stringify(results), {
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function onRequestPost(context) {
  const data = await context.request.json();
  
  const result = await context.env.DB.prepare(
    "INSERT INTO strength_records (user_id, date, exercise_name, sets, reps, weight, notes) VALUES (?, ?, ?, ?, ?, ?, ?)"
  ).bind(
    data.user_id,
    data.date,
    data.exercise_name,
    data.sets,
    data.reps,
    data.weight,
    data.notes || null
  ).run();
  
  return new Response(JSON.stringify({ 
    success: true, 
    recordId: result.meta.last_row_id 
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

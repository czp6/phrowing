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
    "SELECT * FROM training_sessions WHERE user_id = ? ORDER BY date DESC LIMIT 100"
  ).bind(userId).all();
  
  return new Response(JSON.stringify(results), {
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function onRequestPost(context) {
  const data = await context.request.json();
  
  const result = await context.env.DB.prepare(
    `INSERT INTO training_sessions 
    (user_id, date, type, duration, distance, split_time, avg_power, 
     avg_heart_rate, max_heart_rate, stroke_rate, notes, coach_feedback, rating)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    data.user_id,
    data.date,
    data.type,
    data.duration,
    data.distance || null,
    data.split_time || null,
    data.avg_power || null,
    data.avg_heart_rate || null,
    data.max_heart_rate || null,
    data.stroke_rate || null,
    data.notes || null,
    data.coach_feedback || null,
    data.rating || null
  ).run();
  
  return new Response(JSON.stringify({ 
    success: true, 
    sessionId: result.meta.last_row_id 
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function onRequestPut(context) {
  const data = await context.request.json();
  
  await context.env.DB.prepare(
    `UPDATE training_sessions SET
     coach_feedback = ?, rating = ?, notes = ?
     WHERE id = ?`
  ).bind(
    data.coach_feedback || null,
    data.rating || null,
    data.notes || null,
    data.id
  ).run();
  
  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

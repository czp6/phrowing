export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const category = url.searchParams.get('category') || 'daily_distance';
  
  let query = '';
  let orderBy = '';
  
  // Calculate leaderboard from training sessions
  switch(category) {
    case 'daily_distance':
      query = `
        SELECT 
          ts.user_id,
          u.name as user_name,
          SUM(ts.distance) as value
        FROM training_sessions ts
        JOIN users u ON ts.user_id = u.id
        WHERE ts.date = date('now')
        GROUP BY ts.user_id
        ORDER BY value DESC
        LIMIT 10
      `;
      break;
    case 'monthly_distance':
      query = `
        SELECT 
          ts.user_id,
          u.name as user_name,
          SUM(ts.distance) as value
        FROM training_sessions ts
        JOIN users u ON ts.user_id = u.id
        WHERE ts.date >= date('now', 'start of month')
        GROUP BY ts.user_id
        ORDER BY value DESC
        LIMIT 10
      `;
      break;
    case '500m':
      query = `
        SELECT 
          ts.user_id,
          u.name as user_name,
          MIN(ts.split_time) as value
        FROM training_sessions ts
        JOIN users u ON ts.user_id = u.id
        WHERE ts.type = 'ergometer' AND ts.distance = 500
        GROUP BY ts.user_id
        ORDER BY value ASC
        LIMIT 10
      `;
      break;
    case '2km':
      query = `
        SELECT 
          ts.user_id,
          u.name as user_name,
          MIN(ts.split_time) as value
        FROM training_sessions ts
        JOIN users u ON ts.user_id = u.id
        WHERE ts.type = 'ergometer' AND ts.distance = 2000
        GROUP BY ts.user_id
        ORDER BY value ASC
        LIMIT 10
      `;
      break;
    case '5km':
      query = `
        SELECT 
          ts.user_id,
          u.name as user_name,
          MIN(ts.split_time) as value
        FROM training_sessions ts
        JOIN users u ON ts.user_id = u.id
        WHERE ts.type = 'ergometer' AND ts.distance = 5000
        GROUP BY ts.user_id
        ORDER BY value ASC
        LIMIT 10
      `;
      break;
    default:
      query = `
        SELECT 
          ts.user_id,
          u.name as user_name,
          SUM(ts.distance) as value
        FROM training_sessions ts
        JOIN users u ON ts.user_id = u.id
        WHERE ts.date = date('now')
        GROUP BY ts.user_id
        ORDER BY value DESC
        LIMIT 10
      `;
  }
  
  const { results } = await context.env.DB.prepare(query).all();
  
  return new Response(JSON.stringify(results || []), {
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function onRequestPost(context) {
  const data = await context.request.json();
  
  await context.env.DB.prepare(
    "INSERT INTO leaderboard (user_id, category, value, date) VALUES (?, ?, ?, ?)"
  ).bind(
    data.user_id,
    data.category,
    data.value,
    data.date || new Date().toISOString().split('T')[0]
  ).run();
  
  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

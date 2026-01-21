export async function onRequestGet(context) {
  const { results } = await context.env.DB.prepare(
    "SELECT * FROM training_sessions ORDER BY date DESC LIMIT 500"
  ).all();
  
  return new Response(JSON.stringify(results), {
    headers: { 'Content-Type': 'application/json' }
  });
}

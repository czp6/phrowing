export async function onRequestPost(context) {
  // 1. Get the message the user typed
  const { message } = await context.request.json();

  // 2. Insert it into the database
  // context.env.DB comes from your wrangler.toml file
  await context.env.DB.prepare(
    "INSERT INTO messages (content, timestamp) VALUES (?, ?)"
  ).bind(message, Date.now()).run();

  // 3. Return success
  return new Response(JSON.stringify({ success: true }));
}

export async function onRequestGet(context) {
  // 1. Get all messages from the database (newest first)
  const { results } = await context.env.DB.prepare(
    "SELECT * FROM messages ORDER BY timestamp DESC"
  ).all();

  // 2. Send them back to the browser
  return new Response(JSON.stringify(results));
}

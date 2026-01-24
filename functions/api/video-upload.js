export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const formData = await request.formData();
    const file = formData.get('video');
    const userId = formData.get('userId');
    const sessionId = formData.get('sessionId');

    if (!file || !userId) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing file or userId' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const filename = `training-${userId}-${sessionId || 'new'}-${timestamp}.${fileExtension}`;

    // Upload to R2
    await env.R2.put(filename, file);

    // Generate public URL (you'll need to configure R2 with a custom domain or use presigned URLs)
    const videoUrl = `${filename}`;

    // If sessionId provided, update the training session
    if (sessionId) {
      await env.DB.prepare(`
        UPDATE training_sessions 
        SET video_url = ? 
        WHERE id = ? AND user_id = ?
      `).bind(videoUrl, sessionId, userId).run();
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        videoUrl: videoUrl,
        filename: filename
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Video upload error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to upload video' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
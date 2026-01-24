// Get coach's students or athlete's coaches
export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const coachId = url.searchParams.get('coachId');
  const studentId = url.searchParams.get('studentId');
  
  if (coachId) {
    // Get all students for a coach
    const { results } = await context.env.DB.prepare(`
      SELECT b.id as binding_id, b.status, b.notes, b.created_at,
             u.id, u.username, u.name, u.email, u.phone, u.role
      FROM coach_student_bindings b
      JOIN users u ON b.student_id = u.id
      WHERE b.coach_id = ? AND b.status = 'active'
      ORDER BY b.created_at DESC
    `).bind(coachId).all();
    
    return new Response(JSON.stringify(results), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  if (studentId) {
    // Get all coaches for a student
    const { results } = await context.env.DB.prepare(`
      SELECT b.id as binding_id, b.status, b.notes, b.created_at,
             u.id, u.username, u.name, u.email, u.phone, u.role
      FROM coach_student_bindings b
      JOIN users u ON b.coach_id = u.id
      WHERE b.student_id = ? AND b.status = 'active'
      ORDER BY b.created_at DESC
    `).bind(studentId).all();
    
    return new Response(JSON.stringify(results), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  return new Response(JSON.stringify({ error: "Either coachId or studentId required" }), {
    status: 400,
    headers: { 'Content-Type': 'application/json' }
  });
}

// Create new binding (coach adds student)
export async function onRequestPost(context) {
  const data = await context.request.json();
  
  // Validate that both users exist and have correct roles
  const coach = await context.env.DB.prepare(
    "SELECT * FROM users WHERE id = ? AND role = 'coach'"
  ).bind(data.coach_id).first();
  
  if (!coach) {
    return new Response(JSON.stringify({ error: "Invalid coach ID" }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  const student = await context.env.DB.prepare(
    "SELECT * FROM users WHERE id = ? AND role = 'athlete'"
  ).bind(data.student_id).first();
  
  if (!student) {
    return new Response(JSON.stringify({ error: "Invalid student ID" }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  // Check if binding already exists
  const existing = await context.env.DB.prepare(
    "SELECT * FROM coach_student_bindings WHERE coach_id = ? AND student_id = ?"
  ).bind(data.coach_id, data.student_id).first();
  
  if (existing) {
    // Reactivate if exists but inactive
    if (existing.status === 'inactive') {
      await context.env.DB.prepare(
        "UPDATE coach_student_bindings SET status = 'active', updated_at = strftime('%s', 'now') WHERE id = ?"
      ).bind(existing.id).run();
      
      return new Response(JSON.stringify({ 
        success: true, 
        bindingId: existing.id,
        message: "Binding reactivated" 
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify({ error: "Binding already exists" }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  // Create new binding
  const result = await context.env.DB.prepare(
    "INSERT INTO coach_student_bindings (coach_id, student_id, notes) VALUES (?, ?, ?)"
  ).bind(data.coach_id, data.student_id, data.notes || null).run();
  
  return new Response(JSON.stringify({ 
    success: true, 
    bindingId: result.meta.last_row_id 
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

// Update binding status or notes
export async function onRequestPut(context) {
  const data = await context.request.json();
  
  // Verify binding exists
  const binding = await context.env.DB.prepare(
    "SELECT * FROM coach_student_bindings WHERE id = ?"
  ).bind(data.id).first();
  
  if (!binding) {
    return new Response(JSON.stringify({ error: "Binding not found" }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  // Update binding
  await context.env.DB.prepare(
    `UPDATE coach_student_bindings SET 
     status = COALESCE(?, status),
     notes = COALESCE(?, notes),
     updated_at = strftime('%s', 'now')
     WHERE id = ?`
  ).bind(data.status || null, data.notes || null, data.id).run();
  
  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

// Delete binding
export async function onRequestDelete(context) {
  const url = new URL(context.request.url);
  const bindingId = url.searchParams.get('id');
  
  if (!bindingId) {
    return new Response(JSON.stringify({ error: "Binding ID required" }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  await context.env.DB.prepare(
    "DELETE FROM coach_student_bindings WHERE id = ?"
  ).bind(bindingId).run();
  
  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
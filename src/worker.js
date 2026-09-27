const CATEGORIES = ['Wrist Watches','Cufflinks','Jersey Scarves','Sneakers','Jewellery'];

function json(data, status=200){
  return new Response(JSON.stringify(data), {status, headers:{'Content-Type':'application/json'}});
}
function err(msg, status=400){ return json({error: msg}, status); }
function uid(){ return crypto.randomUUID(); }
function bufToHex(buf){ return [...new Uint8Array(buf)].map(b=>b.toString(16).padStart(2,'0')).join(''); }

async function hashPassword(password, salt){
  const enc = new TextEncoder().encode(salt + ':' + password);
  const digest = await crypto.subtle.digest('SHA-256', enc);
  return bufToHex(digest);
}

async function getUser(request, env){
  const auth = request.headers.get('Authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if(!token) return null;
  const row = await env.DB.prepare('SELECT username FROM sessions WHERE token = ?').bind(token).first();
  if(!row) return null;
  return env.DB.prepare('SELECT username, name, role FROM workers WHERE username = ?').bind(row.username).first();
}

async function handleApi(request, env){
  const url = new URL(request.url);
  const path = url.pathname.replace(/^\/api\/?/, '');
  const method = request.method;

  try{
    if(path === 'setup' && method === 'POST'){
      const count = await env.DB.prepare('SELECT COUNT(*) as c FROM workers').first();
      if(count.c > 0) return err('Setup already completed.', 403);
      const { name, username, password } = await request.json();
      if(!name || !username || !password) return err('Missing fields.');
      const salt = uid();
      const hash = await hashPassword(password, salt);
      await env.DB.prepare('INSERT INTO workers (username, salt, hash, name, role) VALUES (?,?,?,?,?)')
        .bind(username.toLowerCase(), salt, hash, name, 'owner').run();
      return json({ ok: true });
    }

    if(path === 'has-workers' && method === 'GET'){
      const count = await env.DB.prepare('SELECT COUNT(*) as c FROM workers').first();
      return json({ exists: count.c > 0 });
    }

    if(path === 'login' && method === 'POST'){
      const { username, password } = await request.json();
      const w = await env.DB.prepare('SELECT * FROM workers WHERE username = ?').bind((username||'').toLowerCase()).first();
      if(!w) return err('Incorrect username or password.', 401);
      const hash = await hashPassword(password, w.salt);
      if(hash !== w.hash) return err('Incorrect username or password.', 401);
      const token = uid();
      await env.DB.prepare('INSERT INTO sessions (token, username, created_at) VALUES (?,?,?)')
        .bind(token, w.username, new Date().toISOString()).run();
      return json({ token, name: w.name, role: w.role, username: w.username });
    }

    if(path === 'logout' && method === 'POST'){
      const auth = request.headers.get('Authorization') || '';
      const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
      if(token) await env.DB.prepare('DELETE FROM sessions WHERE token = ?').bind(token).run();
      return json({ ok: true });
    }

    const user = await getUser(request, env);
    if(!user) return err('Not authenticated.', 401);

    if(path === 'me' && method === 'GET') return json(user);

    if(path === 'workers' && method === 'GET'){
      if(user.role !== 'owner') return err('Owners only.', 403);
      const { results } = await env.DB.prepare('SELECT username, name, role FROM workers ORDER BY name').all();
      return json(results);
    }

    if(path === 'workers/reset-password' && method === 'POST'){
      if(user.role !== 'owner') return err('Owners only.', 403);
      const { username, password } = await request.json();
      if(!username || !password) return err('Missing fields.');
      const target = await env.DB.prepare('SELECT username FROM workers WHERE username = ?').bind(username.toLowerCase()).first();
      if(!target) return err('Worker not found.', 404);
      const salt = uid();
      const hash = await hashPassword(password, salt);
      await env.DB.prepare('UPDATE workers SET salt = ?, hash = ? WHERE username = ?').bind(salt, hash, username.toLowerCase()).run();
      return json({ ok: true });
    }

    if(path === 'workers' && method === 'POST'){
      if(user.role !== 'owner') return err('Owners only.', 403);
      const { name, username, password } = await request.json();
      if(!name || !username || !password) return err('Missing fields.');
      const uname = username.toLowerCase();
      const exists = await env.DB.prepare('SELECT username FROM workers WHERE username = ?').bind(uname).first();
      if(exists) return err('That username is taken.');
      const salt = uid();
      const hash = await hashPassword(password, salt);
      await env.DB.prepare('INSERT INTO workers (username, salt, hash, name, role) VALUES (?,?,?,?,?)')
        .bind(uname, salt, hash, name, 'worker').run();
      return json({ ok: true });
    }

    // Filtered Sales Route
    if(path === 'sales' && method === 'GET'){
      const from = url.searchParams.get('from');
      const to = url.searchParams.get('to');
      const category = url.searchParams.get('category');

      let query = 'SELECT * FROM sales WHERE 1=1';
      const params = [];

      if(user.role !== 'owner'){
        query += ' AND worker_username = ?';
        params.push(user.username);
      }

      if(from){
        query += ' AND timestamp >= ?';
        params.push(from + 'T00:00:00.000Z');
      }
      if(to){
        query += ' AND timestamp <= ?';
        params.push(to + 'T23:59:59.999Z');
      }
      if(category){
        query += ' AND category = ?';
        params.push(category);
      }

      query += ' ORDER BY timestamp DESC';
      
      let stmt = env.DB.prepare(query);
      if(params.length > 0) stmt = stmt.bind(...params);
      
      const { results } = await stmt.all();
      return json(results || []);
    }

    if(path === 'sales' && method === 'POST'){
      const { category, item, price, qty } = await request.json();
      if(!CATEGORIES.includes(category)) return err('Invalid category.');
      if(!item || typeof price !== 'number' || price < 0) return err('Missing or invalid fields.');
      const q = qty && qty > 0 ? qty : 1;
      const id = uid();
      await env.DB.prepare('INSERT INTO sales (id, worker_username, worker_name, category, item, price, qty, total, timestamp) VALUES (?,?,?,?,?,?,?,?,?)')
        .bind(id, user.username, user.name, category, item, price, q, price*q, new Date().toISOString()).run();
      return json({ ok: true, id });
    }

    // Filtered Stock Intake Route
    if(path === 'stock' && method === 'GET'){
      const from = url.searchParams.get('from');
      const to = url.searchParams.get('to');
      const category = url.searchParams.get('category');
      const vendor = url.searchParams.get('vendor');

      let query = 'SELECT * FROM stock WHERE 1=1';
      const params = [];

      if(from){
        query += ' AND timestamp >= ?';
        params.push(from + 'T00:00:00.000Z');
      }
      if(to){
        query += ' AND timestamp <= ?';
        params.push(to + 'T23:59:59.999Z');
      }
      if(category){
        query += ' AND category = ?';
        params.push(category);
      }
      if(vendor){
        query += ' AND vendor LIKE ?';
        params.push(`%${vendor}%`);
      }

      query += ' ORDER BY timestamp DESC';

      let stmt = env.DB.prepare(query);
      if(params.length > 0) stmt = stmt.bind(...params);

      const { results } = await stmt.all();
      return json(results || []);
    }

    if(path === 'stock' && method === 'POST'){
      const { category, item, vendor, qty, cost_price } = await request.json();
      if(!CATEGORIES.includes(category)) return err('Invalid category.');
      if(!item || !qty || qty <= 0) return err('Missing or invalid fields.');
      const id = uid();
      await env.DB.prepare('INSERT INTO stock (id, category, item, vendor, qty, cost_price, added_by, timestamp) VALUES (?,?,?,?,?,?,?,?)')
        .bind(id, category, item, vendor||null, qty, cost_price||null, user.name, new Date().toISOString()).run();
      return json({ ok: true, id });
    }

    return err('Not found.', 404);
  }catch(e){
    return err('Server error: ' + e.message, 500);
  }
}

export default {
  async fetch(request, env, ctx){
    const url = new URL(request.url);
    if(url.pathname.startsWith('/api/')){
      return handleApi(request, env);
    }
    return env.ASSETS.fetch(request);
  }
};

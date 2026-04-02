import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-e5956044/health", (c) => {
  return c.json({ status: "ok" });
});

app.get("/make-server-e5956044/universes", async (c) => {
  try {
    const token = c.req.header('Authorization')?.split(' ')[1];
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) return c.json({ error: 'Unauthorized' }, 401);
    
    const val = await kv.get(`user:${user.id}:universes`);
    return c.json({ data: val || [] });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

app.post("/make-server-e5956044/universes", async (c) => {
  try {
    const token = c.req.header('Authorization')?.split(' ')[1];
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) return c.json({ error: 'Unauthorized' }, 401);
    
    const body = await c.req.json();
    await kv.set(`user:${user.id}:universes`, body.universes);
    return c.json({ success: true });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// Initialize Storage Bucket
app.post("/make-server-e5956044/init-storage", async (c) => {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    );
    const bucketName = 'make-e5956044-architect';
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    if (!bucketExists) {
      await supabase.storage.createBucket(bucketName, { public: false });
    }
    return c.json({ success: true });
  } catch (error: any) {
    console.error(error);
    return c.json({ error: error.message }, 500);
  }
});

// Proxy Upload
app.post("/make-server-e5956044/upload", async (c) => {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    );
    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    const path = formData.get('path') as string;
    
    if (!file || !path) {
      return c.json({ error: 'File and path are required' }, 400);
    }
    
    const arrayBuffer = await file.arrayBuffer();
    const { data, error } = await supabase.storage
      .from('make-e5956044-architect')
      .upload(path, arrayBuffer, {
        contentType: file.type,
        upsert: true
      });
      
    if (error) throw error;
    
    const { data: { signedUrl } } = await supabase.storage
      .from('make-e5956044-architect')
      .createSignedUrl(path, 60 * 60 * 24 * 365 * 10); // 10 years
      
    return c.json({ url: signedUrl, path });
  } catch (error: any) {
    console.error(error);
    return c.json({ error: error.message }, 500);
  }
});

// Signup
app.post("/make-server-e5956044/signup", async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, name } = body;
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name: name || 'Architect' },
      email_confirm: false // Require email confirmation
    });
    if (error) return c.json({ error: error.message }, 400);
    return c.json({ data });
  } catch (error: any) {
    console.error(error);
    return c.json({ error: error.message }, 500);
  }
});

Deno.serve(app.fetch);
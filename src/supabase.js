import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Chưa cấu hình .env thì sb = null, ứng dụng sẽ báo hướng dẫn thay vì lỗi trắng trang
export const sb = url && anonKey ? createClient(url, anonKey) : null;

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://wasvgkxcbkfhrxauwtsj.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indhc3Zna3hjYmtmaHJ4YXV3dHNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUwMzQ5NjcsImV4cCI6MjA4MDYxMDk2N30.XP-FSuZVvNbbE_VtOz6vHtdj1yImPHYT5fEbtUdQkGA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

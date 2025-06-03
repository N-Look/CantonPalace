import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
const supabaseUrl = 'https://lqajpfjaygbmhtamcbsy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxYWpwZmpheWdibWh0YW1jYnN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5MzU5MzIsImV4cCI6MjA2MzUxMTkzMn0.-GMQcBo0HkjSFV0cHFL1wXFVeHX6qAIxSaN-0npddZ0';

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase; 
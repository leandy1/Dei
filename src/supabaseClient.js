import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://jtgvconuapmpszgcpyqc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0Z3Zjb251YXBtcHN6Z2NweXFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5MTY2NDMsImV4cCI6MjA5NTQ5MjY0M30.cHuq1MPTRgA-uqXkJGJolf9Tn2OTfWZcMv_hlRqUmIw';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

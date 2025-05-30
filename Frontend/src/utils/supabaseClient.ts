// src/supabaseClient.ts

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ybtjpecwrzovvuumrlmv.supabase.co';  // Replace with your Supabase URL
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlidGpwZWN3cnpvdnZ1dW1ybG12Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxNDMzNTksImV4cCI6MjA2MzcxOTM1OX0.Zb_G64j2Ftv-GnjV59PxrVhvVQ6bNld2BNOQAGhtMOY';            // Replace with your Supabase anon key

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

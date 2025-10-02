import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PatientData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  language: string;
}

interface DoctorData extends PatientData {
  address: string;
  specialty: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, data } = await req.json();
    
    console.log(`Syncing ${type} data to Google Sheets:`, data);

    const apiKey = Deno.env.get('GOOGLE_SHEETS_API_KEY');
    
    if (!apiKey) {
      console.error('Google Sheets API key not configured');
      return new Response(
        JSON.stringify({ error: 'Google Sheets API key not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // TODO: Implement Google Sheets API integration
    // For now, just log the data
    // You'll need to:
    // 1. Create a Google Sheets spreadsheet
    // 2. Get the spreadsheet ID
    // 3. Use the Google Sheets API to append data
    // Example endpoint: https://sheets.googleapis.com/v4/spreadsheets/{spreadsheetId}/values/{range}:append
    
    console.log('Data would be synced to Google Sheets here');
    console.log('Type:', type);
    console.log('Data:', JSON.stringify(data, null, 2));

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Data logged (Google Sheets integration pending)' 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Error in sync-to-sheets function:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    
    return new Response(
      JSON.stringify({ 
        error: errorMessage
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

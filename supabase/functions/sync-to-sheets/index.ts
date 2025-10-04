const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SPREADSHEET_ID = '1sPUBovCVRM54rVXfcEs5UV0A5k0HwtXyZwux9N-0hqE';

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

    // Determine sheet name and prepare row data
    const sheetName = type === 'patient' ? 'Patients' : 'Doctors';
    let values: string[][];
    
    if (type === 'patient') {
      const patientData = data as PatientData;
      values = [[
        patientData.firstName,
        patientData.lastName,
        patientData.email,
        patientData.phone,
        patientData.language
      ]];
    } else {
      const doctorData = data as DoctorData;
      values = [[
        doctorData.firstName,
        doctorData.lastName,
        doctorData.email,
        doctorData.phone,
        doctorData.address,
        doctorData.specialty,
        doctorData.language
      ]];
    }

    // Append data to Google Sheets
    const sheetsUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${sheetName}!A:Z:append?valueInputOption=RAW&key=${apiKey}`;
    
    console.log(`Syncing ${type} data to Google Sheets tab: ${sheetName}`);
    
    const sheetsResponse = await fetch(sheetsUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ values }),
    });

    if (!sheetsResponse.ok) {
      const errorText = await sheetsResponse.text();
      console.error('Google Sheets API error:', errorText);
      throw new Error(`Google Sheets API error: ${errorText}`);
    }

    const sheetsResult = await sheetsResponse.json();
    console.log('Successfully synced to Google Sheets:', sheetsResult);

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

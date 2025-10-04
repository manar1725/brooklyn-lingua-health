import { encodeBase64 } from "https://deno.land/std@0.224.0/encoding/base64.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SPREADSHEET_ID = '1sPUBovCVRM54rVXfcEs5UV0A5k0HwtXyZwux9N-0hqE';

// Create JWT for Google OAuth2
async function createJWT(serviceAccount: any): Promise<string> {
  const header = {
    alg: "RS256",
    typ: "JWT",
  };

  const now = Math.floor(Date.now() / 1000);
  const claim = {
    iss: serviceAccount.client_email,
    scope: "https://www.googleapis.com/auth/spreadsheets",
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now,
  };

  const encodedHeader = encodeBase64(JSON.stringify(header)).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  const encodedClaim = encodeBase64(JSON.stringify(claim)).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");

  const signatureInput = `${encodedHeader}.${encodedClaim}`;
  
  // Import the private key
  const privateKey = serviceAccount.private_key;
  const pemHeader = "-----BEGIN PRIVATE KEY-----";
  const pemFooter = "-----END PRIVATE KEY-----";
  const pemContents = privateKey.substring(
    pemHeader.length,
    privateKey.length - pemFooter.length
  ).replace(/\s/g, "");
  
  const binaryKey = Uint8Array.from(atob(pemContents), c => c.charCodeAt(0));
  
  const cryptoKey = await crypto.subtle.importKey(
    "pkcs8",
    binaryKey,
    {
      name: "RSASSA-PKCS1-v1_5",
      hash: "SHA-256",
    },
    false,
    ["sign"]
  );

  const encoder = new TextEncoder();
  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    cryptoKey,
    encoder.encode(signatureInput)
  );

  const encodedSignature = encodeBase64(signature).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  
  return `${signatureInput}.${encodedSignature}`;
}

// Get access token using JWT
async function getAccessToken(serviceAccount: any): Promise<string> {
  const jwt = await createJWT(serviceAccount);
  
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to get access token: ${errorText}`);
  }

  const data = await response.json();
  return data.access_token;
}

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

    const serviceAccountJson = Deno.env.get('GOOGLE_SHEETS_API_KEY');
    
    if (!serviceAccountJson) {
      console.error('Google Sheets service account not configured');
      return new Response(
        JSON.stringify({ error: 'Google Sheets service account not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Parse service account JSON
    let serviceAccount;
    try {
      serviceAccount = JSON.parse(serviceAccountJson);
    } catch (e) {
      console.error('Failed to parse service account JSON:', e);
      return new Response(
        JSON.stringify({ error: 'Invalid service account JSON' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get access token
    const accessToken = await getAccessToken(serviceAccount);

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

    // Append data to Google Sheets using OAuth2
    const sheetsUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${sheetName}!A:Z:append?valueInputOption=RAW`;
    
    console.log(`Syncing ${type} data to Google Sheets tab: ${sheetName}`);
    
    const sheetsResponse = await fetch(sheetsUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
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

// import { google } from 'googleapis';
// import { NextResponse } from 'next/server';

// const oauth2Client = new google.auth.OAuth2(
//   process.env.GOOGLE_CLIENT_ID,
//   process.env.GOOGLE_CLIENT_SECRET,
//   process.env.NODE_ENV === 'development' 
//     ? 'http://localhost:3000/api/auth/callback'
//     : 'https://healthrive-dashboard.vercel.app/api/auth/callback'
// );

// export async function GET(request: Request) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const authCode = searchParams.get('code');
    
//     if (!authCode) {
//       return NextResponse.json(
//         { 
//           success: false, 
//           message: 'Authorization code is required. Use the authUrl from test endpoint first.' 
//         },
//         { status: 400 }
//       );
//     }

//     // Exchange authorization code for tokens
//     const { tokens } = await oauth2Client.getToken(authCode);
//     oauth2Client.setCredentials(tokens);

//     const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

//     // Fetch events from Google Calendar
//     const response = await calendar.events.list({
//       calendarId: 'primary', // Use 'primary' for the user's main calendar
//       timeMin: (new Date()).toISOString(), // Events from now onwards
//       maxResults: 10, // Limit results for testing
//       singleEvents: true,
//       orderBy: 'startTime',
//     });

//     const events = response.data.items || [];

//     return NextResponse.json({
//       success: true,
//       message: `Found ${events.length} events`,
//       events: events.map(event => ({
//         id: event.id,
//         summary: event.summary,
//         description: event.description,
//         start: event.start,
//         end: event.end,
//         location: event.location,
//         status: event.status,
//         htmlLink: event.htmlLink,
//       })),
//       nextPageToken: response.data.nextPageToken,
//     });

//   } catch (error: any) {
//     console.error('Error fetching Google Calendar events:', error);
    
//     return NextResponse.json(
//       { 
//         success: false, 
//         message: 'Failed to fetch calendar events',
//         error: error.message 
//       },
//       { status: 500 }
//     );
//   }
// }

import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // For service account, we use JWT auth instead of OAuth
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/calendar'],
    });

    const calendar = google.calendar({ version: 'v3', auth });

    // Test: List calendars to verify connection
    const calendars = await calendar.calendarList.list();
    
    return NextResponse.json({
      success: true,
      message: 'Service account connected successfully',
      calendars: calendars.data.items?.map(cal => ({
        id: cal.id,
        summary: cal.summary,
        primary: cal.primary,
      })),
    });

  } catch (error: unknown) {
    console.error('Service account test error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Service account test failed',
      error: error,
      solution: 'Set up a service account in Google Cloud Console'
    });
  }
}
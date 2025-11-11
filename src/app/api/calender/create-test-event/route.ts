import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/calendar'],
    });

    const calendar = google.calendar({ version: 'v3', auth });

    // Create a test event in the service account's primary calendar
    const event = {
      summary: 'Test 22 Event from Healthrive',
      description: 'This is a test event created via Service Account',
      start: {
        dateTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
        timeZone: 'UTC',
      },
      end: {
        dateTime: new Date(Date.now() + 25 * 60 * 60 * 1000).toISOString(), // Tomorrow + 1 hour
        timeZone: 'UTC',
      },
    };

    const response = await calendar.events.insert({
      calendarId: 'primary', // Service account's own calendar
      requestBody: event,
    });

    return NextResponse.json({
      success: true,
      message: 'Test event created successfully',
      event: {
        id: response.data.id,
        summary: response.data.summary,
        htmlLink: response.data.htmlLink,
        start: response.data.start,
        end: response.data.end,
      },
    });

  } catch (error: unknown) {
    console.error('Error creating test event:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to create test event',
      error: error,
    });
  }
}
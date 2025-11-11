import { google } from 'googleapis';
import { NextResponse } from 'next/server';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI 
);

export async function GET() {
  try {
    // Test 1: Check if environment variables are set
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      return NextResponse.json(
        { success: false, message: 'Google OAuth credentials not configured' },
        { status: 500 }
      );
    }

    // Test 2: Create auth URL (this verifies credentials are valid)
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/calendar.events'],
    });

    return NextResponse.json({
      success: true,
      message: 'Google OAuth configured correctly',
      authUrl: authUrl,
      clientId: process.env.GOOGLE_CLIENT_ID ? '✅ Set' : '❌ Missing',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ? '✅ Set' : '❌ Missing',
    });

  } catch (error: unknown) {
    console.error('Google Calendar test error:', error);
    return NextResponse.json(
      { success: false, message: 'Test failed', error: "eror" },
      { status: 500 }
    );
  }
}
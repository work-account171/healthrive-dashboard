import dbConnect from "@/app/lib/db";
import Patient from "@/app/models/Patient";
import { NextResponse } from "next/server";



export async function POST(req: Request) {
  await dbConnect();
  
  try {
    const body = await req.json();
    const { patients } = body;

    // Basic request validation
    if (!patients || !Array.isArray(patients) || patients.length === 0) {
      return NextResponse.json(
        { success: false, message: "Patients array is required and cannot be empty" },
        { status: 400 }
      );
    }

    console.log(`📦 Received ${patients.length} patients for bulk insert`);

    // Transform data to match Patient schema exactly
    const patientsForDb = patients.map(patient => ({
      clientId: String(patient.clientId || ''),
      name: String(patient.name || ''),
      firstName: String(patient.firstName || ''),
      lastName: String(patient.lastName || ''),
      email: String(patient.email || ''),
      description: String(patient.description || ''),
      phNumber: String(patient.phNumber || ''),
      priority: (patient.priority === "emergency" ? "emergency" : "safe") as "safe" | "emergency",
      attachments: [] // Empty array instead of undefined or invalid attachment objects
    }));

    console.log('🔄 Transformed first patient:', JSON.stringify(patientsForDb[0], null, 2));

    // Insert all patients at once
    const result = await Patient.insertMany(patientsForDb, { 
      ordered: false
    });

    console.log(`🎉 Successfully inserted ${result.length} patients`);

    return NextResponse.json(
      { 
        success: true, 
        message: `Successfully added ${result.length} patients`,
        data: result,
        count: result.length 
      },
      { status: 201 }
    );

  } 
catch (error: unknown) {
  console.error('❌ Error in bulk-add-patients:', error);
  
  // Define Mongoose error interfaces
  interface MongooseValidationError extends Error {
    errors: {
      [key: string]: {
        message: string;
        kind: string;
        path: string;
        value: string;
      };
    };
  }

  interface MongooseDuplicateError extends Error {
    code: number;
    keyValue: Record<string, unknown>;
  }

  // Type-safe error handling for ValidationError
  if (error instanceof Error && error.name === 'ValidationError') {
    const validationError = error as MongooseValidationError;
    console.error('🔍 Validation Error Details:');
    Object.keys(validationError.errors).forEach((field: string) => {
      console.error(`   ${field}:`, validationError.errors[field].message);
    });
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Data validation failed',
        error: error.message,
        validationErrors: Object.keys(validationError.errors).map(field => ({
          field,
          message: validationError.errors[field].message
        }))
      },
      { status: 400 }
    );
  }

  // Handle duplicate key errors with type safety
  if (error instanceof Error && (error as MongooseDuplicateError).code === 11000) {
    return NextResponse.json(
      { 
        success: false, 
        message: 'Some patients already exist (duplicate clientId or email)',
        error: error.message 
      },
      { status: 400 }
    );
  }

  // Generic error handling
  const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
  
  return NextResponse.json(
    { 
      success: false, 
      message: 'Internal server error',
      error: errorMessage 
    },
    { status: 500 }
  );
}
}
    // // Handle duplicate key errors
    // if (error.code === 11000) {
    //   return NextResponse.json(
    //     { 
    //       success: false, 
    //       message: 'Some patients already exist (duplicate clientId or email)',
//           error: error.message 
//         },
//         { status: 400 }
//       );
//     }

//     return NextResponse.json(
//       { 
//         success: false, 
//         message: 'Internal server error',
//         error: error.message 
//       },
//       { status: 500 }
//     );
//   }
// }
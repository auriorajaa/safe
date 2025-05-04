"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { getDbConnection } from "@/lib/db";

export async function createDetectionSession(
  detectionType: "CREDIT_CARD" | "TRANSACTION",
  isFraud: boolean
) {
  console.log("createDetectionSession called with:", {
    detectionType,
    isFraud,
  });

  try {
    // Get user data from Clerk Authentication
    const { userId } = await auth();
    console.log("Auth result - userId:", userId);

    if (!userId) {
      console.error("Authentication failed: No userId found");
      return {
        success: false,
        message: "User not authenticated",
      };
    }

    // Get the current user
    const user = await currentUser();

    if (!user || !user.emailAddresses?.[0]?.emailAddress) {
      console.error("Failed to retrieve user email");
      return {
        success: false,
        message: "User email not available",
      };
    }

    const userEmail = user.emailAddresses[0].emailAddress;
    console.log("User email from auth:", userEmail);

    console.log("Getting database connection");
    const sql = await getDbConnection();
    console.log("Database connection obtained");

    // Find the user by email instead of customer_id
    console.log("Searching for user with email:", userEmail);
    const userResult = await sql`
      SELECT id FROM users 
      WHERE email = ${userEmail}`;

    console.log("User lookup result:", userResult);

    if (userResult.length === 0) {
      // User not found in our database
      console.error("User not found in database with email:", userEmail);
      return {
        success: false,
        message: "User not found in database",
      };
    }

    const dbUserId = userResult[0].id;
    console.log("Found user with database ID:", dbUserId);

    // Create a detection session with the database UUID
    console.log("Creating detection session for user:", dbUserId);
    const sessionResult = await sql`
      INSERT INTO detection_sessions 
        (user_id, detection_type, is_fraud)
      VALUES 
        (${dbUserId}, ${detectionType}, ${isFraud})
      RETURNING id`;

    console.log("Session creation SQL result:", sessionResult);

    const sessionId = sessionResult[0]?.id;
    console.log("Created session with ID:", sessionId);

    return {
      success: true,
      sessionId,
    };
  } catch (error) {
    console.error("Error creating detection session:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Error creating detection session",
    };
  }
}

export async function saveCreditCardDetection(
  sessionId: string,
  data: {
    distance_from_home: number;
    distance_from_last_transaction: number;
    ratio_to_median_purchase_price: number;
    repeat_retailer: boolean;
    used_chip: boolean;
    used_pin_number: boolean;
    online_order: boolean;
  }
) {
  console.log("saveCreditCardDetection called with sessionId:", sessionId);
  console.log("Detection data:", data);

  try {
    console.log("Getting database connection");
    const sql = await getDbConnection();
    console.log("Database connection obtained");

    console.log("Inserting credit card detection data");
    const insertResult = await sql`
      INSERT INTO credit_card_detections 
        (session_id, distance_from_home, distance_from_last_transaction, 
         ratio_to_median_purchase_price, repeat_retailer, used_chip, 
         used_pin_number, online_order)
      VALUES 
        (${sessionId}, 
         ${data.distance_from_home}, 
         ${data.distance_from_last_transaction}, 
         ${data.ratio_to_median_purchase_price}, 
         ${data.repeat_retailer}, 
         ${data.used_chip}, 
         ${data.used_pin_number}, 
         ${data.online_order})
      RETURNING id`;

    console.log("Credit card detection insert result:", insertResult);

    return {
      success: true,
      detectionId: insertResult[0]?.id,
    };
  } catch (error) {
    console.error("Error saving credit card detection:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Error saving credit card detection",
    };
  }
}

export async function saveDetectionResult(sessionId: string, resultData: any) {
  console.log("saveDetectionResult called with sessionId:", sessionId);
  console.log("Result data size:", JSON.stringify(resultData).length, "bytes");

  try {
    console.log("Getting database connection");
    const sql = await getDbConnection();
    console.log("Database connection obtained");

    console.log("Inserting detection result data");
    const insertResult = await sql`
      INSERT INTO detection_results 
        (session_id, result_data)
      VALUES 
        (${sessionId}, ${resultData})
      RETURNING id`;

    console.log("Detection result insert result:", insertResult);

    return {
      success: true,
      resultId: insertResult[0]?.id,
    };
  } catch (error) {
    console.error("Error saving detection result:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Error saving detection result",
    };
  }
}
// app/actions/detections-actions.ts
export async function saveTransactionDetection(
  sessionId: string,
  data: {
    type: string;
    amount: number;
    oldbalanceOrg: number;
    newbalanceOrig: number;
    oldbalanceDest: number;
    newbalanceDest: number;
  }
) {
  try {
    const sql = await getDbConnection();
    const insertResult = await sql`
      INSERT INTO transaction_detections 
        (session_id, type, amount, old_balance_orig, new_balance_orig, old_balance_dest, new_balance_dest)
      VALUES 
        (${sessionId}, ${data.type}, ${data.amount}, ${data.oldbalanceOrg}, ${data.newbalanceOrig}, ${data.oldbalanceDest}, ${data.newbalanceDest})
      RETURNING id`;
    return {
      success: true,
      detectionId: insertResult[0]?.id,
    };
  } catch (error) {
    console.error("Error saving transaction detection:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Error saving transaction detection",
    };
  }
}

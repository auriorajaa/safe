// app/actions/dashboard/dashboard-actions.ts
"use server";

import { getDbConnection } from "@/lib/db";
import { DetectionSummary, DetectionRecord } from "@/lib/types";

export async function getUserDetectionSummary(
  userEmail: string
): Promise<DetectionSummary> {
  const sql = await getDbConnection();

  // Get the user ID from email
  const userIdResult = await sql`
    SELECT id FROM users WHERE email = ${userEmail}
  `;

  if (userIdResult.length === 0) {
    return {
      totalDetections: 0,
      fraudCases: 0,
      legitimateCases: 0,
    };
  }

  const userId = userIdResult[0].id;

  // Get detection summary counts
  const summaryResult = await sql`
    SELECT 
      COUNT(*) as total_detections,
      SUM(CASE WHEN is_fraud = true THEN 1 ELSE 0 END) as fraud_cases,
      SUM(CASE WHEN is_fraud = false THEN 1 ELSE 0 END) as legitimate_cases
    FROM detection_sessions
    WHERE user_id = ${userId}
  `;

  return {
    totalDetections: Number(summaryResult[0]?.total_detections || 0),
    fraudCases: Number(summaryResult[0]?.fraud_cases || 0),
    legitimateCases: Number(summaryResult[0]?.legitimate_cases || 0),
  };
}

export async function getUserDetectionHistory(
  userEmail: string
): Promise<DetectionRecord[]> {
  const sql = await getDbConnection();

  // Get the user ID from email
  const userIdResult = await sql`
    SELECT id FROM users WHERE email = ${userEmail}
  `;

  if (userIdResult.length === 0) {
    return [];
  }

  const userId = userIdResult[0].id;

  // Get all detection sessions for this user
  const sessionsResult = await sql`
    SELECT 
      ds.id, 
      ds.detection_type, 
      ds.is_fraud, 
      ds.detection_timestamp
    FROM detection_sessions ds
    WHERE ds.user_id = ${userId}
    ORDER BY ds.detection_timestamp DESC
  `;

  const detectionRecords: DetectionRecord[] = [];

  // For each session, get the associated details
  for (const session of sessionsResult) {
    if (session.detection_type === "CREDIT_CARD") {
      const ccDetails = await sql`
        SELECT 
          distance_from_home, 
          distance_from_last_transaction, 
          ratio_to_median_purchase_price, 
          repeat_retailer, 
          used_chip, 
          used_pin_number, 
          online_order
        FROM credit_card_detections
        WHERE session_id = ${session.id}
      `;

      if (ccDetails.length > 0) {
        detectionRecords.push({
          id: session.id,
          detectionType: session.detection_type,
          isFraud: session.is_fraud,
          timestamp: new Date(session.detection_timestamp).toISOString(),
          details: {
            distanceFromHome: ccDetails[0].distance_from_home,
            distanceFromLastTransaction:
              ccDetails[0].distance_from_last_transaction,
            ratioToMedianPurchasePrice:
              ccDetails[0].ratio_to_median_purchase_price,
            repeatRetailer: ccDetails[0].repeat_retailer,
            usedChip: ccDetails[0].used_chip,
            usedPinNumber: ccDetails[0].used_pin_number,
            onlineOrder: ccDetails[0].online_order,
          },
        });
      }
    } else {
      // Transaction type detections
      const txDetails = await sql`
        SELECT 
          type, 
          amount, 
          old_balance_orig, 
          new_balance_orig, 
          old_balance_dest, 
          new_balance_dest
        FROM transaction_detections
        WHERE session_id = ${session.id}
      `;

      if (txDetails.length > 0) {
        detectionRecords.push({
          id: session.id,
          detectionType: session.detection_type,
          isFraud: session.is_fraud,
          timestamp: new Date(session.detection_timestamp).toISOString(),
          details: {
            type: txDetails[0].type,
            amount: txDetails[0].amount,
            oldBalanceOrig: txDetails[0].old_balance_orig,
            newBalanceOrig: txDetails[0].new_balance_orig,
            oldBalanceDest: txDetails[0].old_balance_dest,
            newBalanceDest: txDetails[0].new_balance_dest,
          },
        });
      }
    }
  }

  return detectionRecords;
}

export async function getDetectionById(
  id: string
): Promise<DetectionRecord | null> {
  const sql = await getDbConnection();

  // Get the detection session
  const sessionResult = await sql`
    SELECT 
      ds.id, 
      ds.detection_type, 
      ds.is_fraud, 
      ds.detection_timestamp
    FROM detection_sessions ds
    WHERE ds.id = ${id}
  `;

  if (sessionResult.length === 0) {
    return null;
  }

  const session = sessionResult[0];

  if (session.detection_type === "CREDIT_CARD") {
    const ccDetails = await sql`
      SELECT 
        distance_from_home, 
        distance_from_last_transaction, 
        ratio_to_median_purchase_price, 
        repeat_retailer, 
        used_chip, 
        used_pin_number, 
        online_order
      FROM credit_card_detections
      WHERE session_id = ${session.id}
    `;

    if (ccDetails.length > 0) {
      return {
        id: session.id,
        detectionType: session.detection_type,
        isFraud: session.is_fraud,
        timestamp: new Date(session.detection_timestamp).toISOString(),
        details: {
          distanceFromHome: ccDetails[0].distance_from_home,
          distanceFromLastTransaction:
            ccDetails[0].distance_from_last_transaction,
          ratioToMedianPurchasePrice:
            ccDetails[0].ratio_to_median_purchase_price,
          repeatRetailer: ccDetails[0].repeat_retailer,
          usedChip: ccDetails[0].used_chip,
          usedPinNumber: ccDetails[0].used_pin_number,
          onlineOrder: ccDetails[0].online_order,
        },
      };
    }
  } else {
    // Transaction type detections
    const txDetails = await sql`
      SELECT 
        type, 
        amount, 
        old_balance_orig, 
        new_balance_orig, 
        old_balance_dest, 
        new_balance_dest
      FROM transaction_detections
      WHERE session_id = ${session.id}
    `;

    if (txDetails.length > 0) {
      return {
        id: session.id,
        detectionType: session.detection_type,
        isFraud: session.is_fraud,
        timestamp: new Date(session.detection_timestamp).toISOString(),
        details: {
          type: txDetails[0].type,
          amount: txDetails[0].amount,
          oldBalanceOrig: txDetails[0].old_balance_orig,
          newBalanceOrig: txDetails[0].new_balance_orig,
          oldBalanceDest: txDetails[0].old_balance_dest,
          newBalanceDest: txDetails[0].new_balance_dest,
        },
      };
    }
  }

  // If we get here, we couldn't find the details
  return null;
}

export async function deleteDetection(id: string): Promise<boolean> {
  const sql = await getDbConnection();

  try {
    // Start transaction
    await sql`BEGIN`;

    // First, identify the detection type
    const detectionResult = await sql`
      SELECT detection_type FROM detection_sessions WHERE id = ${id}
    `;

    if (detectionResult.length === 0) {
      throw new Error("Detection not found");
    }

    const detectionType = detectionResult[0].detection_type;

    // Delete from type-specific table
    if (detectionType === "CREDIT_CARD") {
      await sql`DELETE FROM credit_card_detections WHERE session_id = ${id}`;
    } else {
      await sql`DELETE FROM transaction_detections WHERE session_id = ${id}`;
    }

    // Delete any stored results
    await sql`DELETE FROM detection_results WHERE session_id = ${id}`;

    // Finally delete the session itself
    await sql`DELETE FROM detection_sessions WHERE id = ${id}`;

    // Commit transaction
    await sql`COMMIT`;

    return true;
  } catch (error) {
    // Rollback on error
    await sql`ROLLBACK`;
    console.error("Error deleting detection:", error);
    throw error;
  }
}

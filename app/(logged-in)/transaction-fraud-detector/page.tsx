// app/fraud-detector/transaction/page.tsx
"use client";

import { useState } from "react";
import { Banknote, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import TransactionForm from "@/components/fraud-detector/transaction-form";
import {
  createDetectionSession,
  saveTransactionDetection,
  saveDetectionResult,
} from "@/app/actions/detections-actions";
import TransactionDetectionResults from "@/components/fraud-detector/transaction-detection-results";

type TransactionType =
  | "CASH_IN"
  | "CASH_OUT"
  | "DEBIT"
  | "PAYMENT"
  | "TRANSFER";

export default function TransactionFraudDetection() {
  const [result, setResult] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const saveToDatabase = async (formData: any, apiResult: any) => {
    try {
      const isFraud = apiResult.fraud_assessment.fraud_detected;
      const sessionResult = await createDetectionSession(
        "TRANSACTION",
        isFraud
      );

      if (!sessionResult.success) {
        throw new Error(`Session creation failed: ${sessionResult.message}`);
      }

      const sessionId = sessionResult.sessionId;
      const transactionData = {
        type: formData.type,
        amount: formData.amount,
        oldbalanceOrg: formData.oldbalanceOrg,
        newbalanceOrig: formData.newbalanceOrig,
        oldbalanceDest: formData.oldbalanceDest,
        newbalanceDest: formData.newbalanceDest,
      };

      const saveResult = await saveTransactionDetection(
        sessionId,
        transactionData
      );

      if (!saveResult.success) {
        throw new Error(`Detection save failed: ${saveResult.message}`);
      }

      const resultSaveResponse = await saveDetectionResult(
        sessionId,
        apiResult
      );

      if (!resultSaveResponse.success) {
        throw new Error(`Result save failed: ${resultSaveResponse.message}`);
      }

      toast.success(
        "Detection result saved successfully! View it in the history table on the home page.",
        {
          duration: 5000,
        }
      );
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to save detection result",
        {
          duration: 5000,
        }
      );
    }
  };

  const handleSubmit = async (formData: {
    step: number;
    type: TransactionType;
    amount: number;
    oldbalanceOrg: number;
    newbalanceOrig: number;
    oldbalanceDest: number;
    newbalanceDest: number;
    isFlaggedFraud: number;
  }) => {
    setLoading(true);
    setError(null);

    const apiPayload = {
      step: formData.step,
      type: formData.type,
      amount: formData.amount,
      oldbalanceOrg: formData.oldbalanceOrg,
      newbalanceOrig: formData.newbalanceOrig,
      oldbalanceDest: formData.oldbalanceDest,
      newbalanceDest: formData.newbalanceDest,
      isFlaggedFraud: formData.isFlaggedFraud,
    };

    try {
      const response = await fetch("http://13.210.48.213:5000/api/v1/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apiPayload),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);

      // Show confirmation toast with preference for "No"
      toast.custom(
        (t) => (
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full border border-gray-200">
            <div className="mb-5">
              <h3 className="text-lg font-semibold text-gray-900">
                Save detection result?
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed mt-2">
                You can skip saving if you don't need to keep this result for
                later.
                <span className="block text-xs text-gray-400 mt-2">
                  (Unsaved results will not appear in your history.)
                </span>
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  toast.dismiss(t);
                  toast.info("Result skipped. Not saved to database.", {
                    duration: 3000,
                  });
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors border border-gray-300"
                autoFocus
              >
                Skip saving
              </button>
              <button
                onClick={() => {
                  toast.dismiss(t);
                  saveToDatabase(formData, data);
                }}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Yes, save it
              </button>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-400 flex items-center justify-between">
              <div>
                Auto-skipping in{" "}
                <span className="font-semibold text-gray-500">10s</span>
              </div>
              <span className="text-gray-400">(Default: Skip saving)</span>
            </div>
          </div>
        ),
        {
          duration: 10000,
          onAutoClose: () => {
            toast.info("Result skipped. Not saved to database (timed out)", {
              duration: 3000,
            });
          },
          position: "bottom-right",
        }
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <Banknote className="text-blue-600 mr-2" size={32} />
          <h1 className="text-3xl font-bold text-gray-900">
            Transaction Fraud Detection
          </h1>
        </div>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Analyze transaction details with our AI-powered system to detect
          potential fraud. Enter the details below to assess the risk.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <ShieldAlert className="mr-2 text-blue-600" size={20} />
              Transaction Details
            </CardTitle>
            <CardDescription>
              Enter the details of the transaction to analyze
            </CardDescription>
          </CardHeader>
          <TransactionForm onSubmit={handleSubmit} loading={loading} />
        </Card>

        <div className="lg:col-span-2">
          <TransactionDetectionResults
            result={result}
            loading={loading}
            error={error}
          />
        </div>
      </div>
    </div>
  );
}

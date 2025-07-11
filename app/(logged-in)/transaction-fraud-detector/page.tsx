// app/fraud-detector/transaction/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Banknote, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import TransactionForm from "@/components/fraud-detector/transaction-form";
import {
  createDetectionSession,
  saveTransactionDetection,
  saveDetectionResult,
} from "@/app/actions/detections-actions";
import TransactionDetectionResults from "@/components/fraud-detector/transaction-detection-results";
import { Skeleton } from "@/components/ui/skeleton";

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

  // Add page loading state
  const [pageLoading, setPageLoading] = useState<boolean>(true);

  // Simulate page loading on component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 800); // Adjust timing as needed

    return () => clearTimeout(timer);
  }, []);

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
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_TRANSACTION_FRAUD_DETECTION!,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(apiPayload),
        }
      );

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

  // Skeleton loading for page
  if (pageLoading) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <div className="text-center mb-8">
          <Skeleton className="h-10 w-72 mx-auto mb-4" />
          <Skeleton className="h-6 w-full max-w-3xl mx-auto" />
          <Skeleton className="h-6 w-full max-w-2xl mx-auto mt-2" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Form Skeleton */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <Skeleton className="h-6 w-64" />
              <Skeleton className="h-4 w-full mt-2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-3 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-3 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-6 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-6 w-full" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end pt-6">
              <Skeleton className="h-10 w-40" />
            </CardFooter>
          </Card>

          {/* Results Area Skeleton */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-64" />
                <Skeleton className="h-4 w-full mt-2" />
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Skeleton className="h-16 w-16 rounded-full mb-4" />
                  <Skeleton className="h-6 w-64 mb-2" />
                  <Skeleton className="h-4 w-80" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-8 px-4 max-w-7xl"
    >
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <div className="flex items-center justify-center mb-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <Banknote className="text-blue-600 mr-2" size={32} />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-900">
            Transaction Fraud Detection
          </h1>
        </div>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Analyze transaction details with our AI-powered system to detect
          potential fraud. Enter the details below to assess the risk.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
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
        </motion.div>

        {/* Results Area */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <TransactionDetectionResults
            result={result}
            loading={loading}
            error={error}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}

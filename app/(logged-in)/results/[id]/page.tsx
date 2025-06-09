// app/(logged-in)/results/[id]/page.tsx
"use client";

import {
  getDetectionById,
  deleteDetection,
} from "@/app/actions/dashboard/dashboard-actions";
import { notFound, useRouter } from "next/navigation";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// Components
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  CreditCard,
  DollarSign,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  Repeat,
  ShieldCheck,
  Landmark,
  ArrowLeftRight,
  CircleDollarSign,
  ArrowRightLeft,
  ChevronRight,
  Trash2,
  Clock,
  ShieldAlert,
  Lock,
  AlertTriangle,
  Loader2,
  MapPin,
  History,
  ShoppingBag,
  List,
} from "lucide-react";
import Link from "next/link";
import React from "react";

// Helper function to calculate risk score based on detection data
function calculateRiskScore(
  detectionType: string,
  details: any,
  isFraud: boolean
): number {
  if (detectionType === "CREDIT_CARD") {
    // Calculate credit card risk score
    let score = 0;

    // Distance factors
    score += Math.min(details.distanceFromHome / 5, 30);
    score += Math.min(details.distanceFromLastTransaction / 8, 20);

    // Price ratio
    score += Math.min(details.ratioToMedianPurchasePrice * 10, 20);

    // Security factors
    if (!details.usedChip) score += 10;
    if (!details.usedPinNumber) score += 10;
    if (details.onlineOrder) score += 5;
    if (!details.repeatRetailer) score += 5;

    // Ensure the score aligns with the fraud determination
    if (isFraud && score < 70) score = Math.max(70, score);
    if (!isFraud && score > 40) score = Math.min(40, score);

    return Math.min(100, Math.round(score));
  } else {
    // Calculate transaction risk score
    let score = 0;

    // Amount factor
    const amountFactor = Math.min(details.amount / 1000, 30);
    score += amountFactor;

    // Balance changes
    const origBalanceDiff = details.oldBalanceOrig - details.newBalanceOrig;
    const destBalanceDiff = details.newBalanceDest - details.oldBalanceDest;

    if (origBalanceDiff !== details.amount) score += 15;
    if (destBalanceDiff !== details.amount) score += 15;

    // Transaction type
    if (details.type === "TRANSFER") score += 10;
    if (details.type === "CASH_OUT") score += 15;

    // Balance related flags
    if (details.newBalanceOrig === 0) score += 15;
    if (details.oldBalanceOrig < details.amount) score += 10;

    // Ensure the score aligns with the fraud determination
    if (isFraud && score < 70) score = Math.max(70, score);
    if (!isFraud && score > 40) score = Math.min(40, score);

    return Math.min(100, Math.round(score));
  }
}

// Component for credit card details display
function CreditCardDetails({ details }: { details: any }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium mb-3 flex items-center">
          <MapPin className="h-4 w-4 mr-2 text-blue-600" />
          Location Information
        </h3>
        <div className="space-y-2">
          <div>
            <p className="text-xs text-gray-500">Distance from home</p>
            <p className="font-medium">{details.distanceFromHome} miles</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">
              Distance from last transaction
            </p>
            <p className="font-medium">
              {details.distanceFromLastTransaction} miles
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium mb-3 flex items-center">
          <ShoppingBag className="h-4 w-4 mr-2 text-blue-600" />
          Purchase Information
        </h3>
        <div className="space-y-2">
          <div>
            <p className="text-xs text-gray-500">
              Price ratio (compared to median)
            </p>
            <p className="font-medium">
              {details.ratioToMedianPurchasePrice.toFixed(2)}x
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Retailer status</p>
            <p className="font-medium">
              {details.repeatRetailer ? "Known retailer" : "New retailer"}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg md:col-span-2">
        <h3 className="text-sm font-medium mb-3 flex items-center">
          <ShieldCheck className="h-4 w-4 mr-2 text-blue-600" />
          Security Verification
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${
                details.usedChip ? "bg-green-500" : "bg-red-500"
              }`}
            ></div>
            <span className="text-sm">Chip Used</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${
                details.usedPinNumber ? "bg-green-500" : "bg-red-500"
              }`}
            ></div>
            <span className="text-sm">PIN Verification</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${
                details.onlineOrder ? "bg-yellow-500" : "bg-green-500"
              }`}
            ></div>
            <span className="text-sm">
              {details.onlineOrder ? "Online Order" : "In-person purchase"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Component for transaction details display
function TransactionDetails({ details }: { details: any }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium mb-3 flex items-center">
          <CircleDollarSign className="h-4 w-4 mr-2 text-blue-600" />
          Transaction Information
        </h3>
        <div className="space-y-2">
          <div>
            <p className="text-xs text-gray-500">Type</p>
            <p className="font-medium">{details.type}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Amount</p>
            <p className="font-medium">
              $
              {Number(details.amount).toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium mb-3 flex items-center">
          <ArrowLeftRight className="h-4 w-4 mr-2 text-blue-600" />
          Origin Account
        </h3>
        <div className="space-y-2">
          <div>
            <p className="text-xs text-gray-500">Previous balance</p>
            <p className="font-medium">
              $
              {Number(details.oldBalanceOrig).toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">New balance</p>
            <p className="font-medium">
              $
              {Number(details.newBalanceOrig).toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg md:col-span-2">
        <h3 className="text-sm font-medium mb-3 flex items-center">
          <ArrowRightLeft className="h-4 w-4 mr-2 text-blue-600" />
          Destination Account
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-gray-500">Previous balance</p>
            <p className="font-medium">
              $
              {Number(details.oldBalanceDest).toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">New balance</p>
            <p className="font-medium">
              $
              {Number(details.newBalanceDest).toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Component for credit card risk analysis
function CreditCardRiskAnalysis({
  details,
  isFraud,
}: {
  details: any;
  isFraud: boolean;
}) {
  const locationRisk =
    details.distanceFromHome > 50 || details.distanceFromLastTransaction > 50
      ? "high"
      : "low";
  const verificationRisk =
    !details.usedChip || !details.usedPinNumber ? "high" : "low";
  const purchaseRisk =
    details.ratioToMedianPurchasePrice > 2 || !details.repeatRetailer
      ? "high"
      : "low";

  const locationValue = locationRisk === "high" ? 85 : 25;
  const verificationValue = verificationRisk === "high" ? 85 : 25;
  const purchaseValue = purchaseRisk === "high" ? 85 : 25;

  return (
    <div className="space-y-6">
      {/* Location Risk Card */}
      <div className="bg-white rounded-xl border shadow-sm p-4 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <div className="bg-blue-50 p-2 rounded-lg mr-3">
              <MapPin className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-800">
                Location Risk
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Based on transaction location patterns
              </p>
            </div>
          </div>
          <Badge
            className={`px-2 py-0.5 text-xs font-medium ${
              locationRisk === "high"
                ? "bg-red-100 text-red-800 border border-red-200"
                : "bg-green-100 text-green-800 border border-green-200"
            }`}
          >
            {locationRisk === "high" ? "High Risk" : "Low Risk"}
          </Badge>
        </div>

        <div className="relative w-full h-2 bg-gray-100 rounded-full overflow-hidden mt-2">
          <div
            className={`absolute top-0 left-0 h-full rounded-full ${
              locationRisk === "high"
                ? "bg-gradient-to-r from-red-400 to-red-600"
                : "bg-gradient-to-r from-green-400 to-green-600"
            }`}
            style={{ width: `${locationValue}%` }}
          />
        </div>

        <div className="mt-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
          <p className="text-sm text-gray-700 leading-snug">
            {locationRisk === "high" ? (
              <>
                Transaction was made{" "}
                <span className="font-medium text-red-700">
                  {details.distanceFromHome} miles
                </span>{" "}
                from home and{" "}
                <span className="font-medium text-red-700">
                  {details.distanceFromLastTransaction} miles
                </span>{" "}
                from last transaction location.
              </>
            ) : (
              <>
                Transaction location is within normal geographical patterns for
                this card user.
              </>
            )}
          </p>
        </div>
      </div>

      {/* Verification Risk Card */}
      <div className="bg-white rounded-xl border shadow-sm p-4 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <div className="bg-purple-50 p-2 rounded-lg mr-3">
              <Lock className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-800">
                Verification Risk
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Based on security measures used
              </p>
            </div>
          </div>
          <Badge
            className={`px-2 py-0.5 text-xs font-medium ${
              verificationRisk === "high"
                ? "bg-red-100 text-red-800 border border-red-200"
                : "bg-green-100 text-green-800 border border-green-200"
            }`}
          >
            {verificationRisk === "high" ? "High Risk" : "Low Risk"}
          </Badge>
        </div>

        <div className="relative w-full h-2 bg-gray-100 rounded-full overflow-hidden mt-2">
          <div
            className={`absolute top-0 left-0 h-full rounded-full ${
              verificationRisk === "high"
                ? "bg-gradient-to-r from-red-400 to-red-600"
                : "bg-gradient-to-r from-green-400 to-green-600"
            }`}
            style={{ width: `${verificationValue}%` }}
          />
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <div
            className={`p-2 rounded-lg ${
              details.usedChip
                ? "bg-green-50 border border-green-100"
                : "bg-red-50 border border-red-100"
            }`}
          >
            <span
              className={`text-sm ${
                details.usedChip ? "text-green-700" : "text-red-700"
              }`}
            >
              Chip Used
            </span>
          </div>
          <div
            className={`p-2 rounded-lg ${
              details.usedPinNumber
                ? "bg-green-50 border border-green-100"
                : "bg-red-50 border border-red-100"
            }`}
          >
            <span
              className={`text-sm ${
                details.usedPinNumber ? "text-green-700" : "text-red-700"
              }`}
            >
              PIN Verified
            </span>
          </div>
        </div>
      </div>

      {/* Purchase Risk Card */}
      <div className="bg-white rounded-xl border shadow-sm p-4 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <div className="bg-amber-50 p-2 rounded-lg mr-3">
              <ShoppingBag className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-800">
                Purchase Risk
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Based on spending patterns
              </p>
            </div>
          </div>
          <Badge
            className={`px-2 py-0.5 text-xs font-medium ${
              purchaseRisk === "high"
                ? "bg-red-100 text-red-800 border border-red-200"
                : "bg-green-100 text-green-800 border border-green-200"
            }`}
          >
            {purchaseRisk === "high" ? "High Risk" : "Low Risk"}
          </Badge>
        </div>

        <div className="relative w-full h-2 bg-gray-100 rounded-full overflow-hidden mt-2">
          <div
            className={`absolute top-0 left-0 h-full rounded-full ${
              purchaseRisk === "high"
                ? "bg-gradient-to-r from-red-400 to-red-600"
                : "bg-gradient-to-r from-green-400 to-green-600"
            }`}
            style={{ width: `${purchaseValue}%` }}
          />
        </div>

        <div className="mt-3 grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
            <div className="text-xs text-gray-500 mb-1">Price Ratio</div>
            <div className="text-sm font-semibold text-gray-800">
              {details.ratioToMedianPurchasePrice.toFixed(2)}x median
            </div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
            <div className="text-xs text-gray-500 mb-1">Retailer</div>
            <div className="text-sm font-semibold text-gray-800">
              {details.repeatRetailer ? "Known retailer" : "New retailer"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Component for transaction risk analysis
function TransactionRiskAnalysis({
  details,
  isFraud,
}: {
  details: any;
  isFraud: boolean;
}) {
  const amountRisk = Number(details.amount) > 10000 ? "high" : "low";
  const balanceRisk =
    Number(details.oldBalanceOrig) - Number(details.newBalanceOrig) !==
      Number(details.amount) ||
    Number(details.newBalanceDest) - Number(details.oldBalanceDest) !==
      Number(details.amount)
      ? "high"
      : "low";
  const typeRisk =
    details.type === "CASH_OUT" || details.type === "TRANSFER" ? "high" : "low";

  const risks = [
    {
      label: "Amount Risk",
      icon: CircleDollarSign,
      risk: amountRisk,
      value: amountRisk === "high" ? 85 : 25,
      descHigh: "Transaction amount is unusually large.",
      descLow: "Transaction amount is within normal range.",
    },
    {
      label: "Balance Flow Risk",
      icon: ArrowLeftRight,
      risk: balanceRisk,
      value: balanceRisk === "high" ? 85 : 25,
      descHigh: "Balance changes don't match transaction amount.",
      descLow: "Balance changes are consistent with transaction.",
    },
    {
      label: "Type Risk",
      icon: Landmark,
      risk: typeRisk,
      value: typeRisk === "high" ? 85 : 25,
      descHigh: `${details.type} transactions have higher fraud risk.`,
      descLow: "This transaction type has lower fraud risk.",
    },
  ];

  return (
    <div className="space-y-6">
      {risks.map(({ label, icon: Icon, risk, value, descHigh, descLow }) => (
        <div
          key={label}
          className="bg-white rounded-xl border shadow-sm p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <div className="bg-gray-50 p-2 rounded-lg mr-3">
                <Icon className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-800">
                  {label}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {`Based on ${label.toLowerCase()}`}
                </p>
              </div>
            </div>
            <Badge
              className={`px-2 py-0.5 text-xs font-medium ${
                risk === "high"
                  ? "bg-red-100 text-red-800 border border-red-200"
                  : "bg-green-100 text-green-800 border border-green-200"
              }`}
            >
              {risk === "high" ? "High Risk" : "Low Risk"}
            </Badge>
          </div>

          <div className="relative w-full h-2 bg-gray-100 rounded-full overflow-hidden mt-2">
            <div
              className={`absolute top-0 left-0 h-full rounded-full ${
                risk === "high"
                  ? "bg-gradient-to-r from-red-400 to-red-600"
                  : "bg-gradient-to-r from-green-400 to-green-600"
              }`}
              style={{ width: `${value}%` }}
            />
          </div>

          <p className="mt-3 text-sm text-gray-700 leading-snug">
            {risk === "high" ? descHigh : descLow}
          </p>
        </div>
      ))}
    </div>
  );
}

// Security Assessment component
function SecurityAssessment({
  detectionType,
  isFraud,
}: {
  detectionType: string;
  isFraud: boolean;
}) {
  const headerBg = isFraud ? "bg-red-50" : "bg-blue-50";
  const headerBorder = isFraud ? "border-red-100" : "border-blue-100";
  const headerText = isFraud ? "text-red-700" : "text-blue-700";
  const iconColor = isFraud ? "text-red-700" : "text-blue-700";

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className={`${headerBg} p-4 rounded-lg border ${headerBorder}`}>
        <h3
          className={`flex items-center text-sm font-medium mb-2 ${headerText}`}
        >
          <AlertCircle className={`h-5 w-5 mr-2 ${iconColor}`} />
          {isFraud ? "Fraud Alert" : "Security Notice"}
        </h3>
        <p className={`text-sm leading-relaxed ${headerText}`}>
          {isFraud
            ? detectionType === "CREDIT_CARD"
              ? "This credit card transaction has been flagged as fraudulent. Please take immediate action to secure your account."
              : "This transaction has been flagged as fraudulent. Please review your account activity and secure your account."
            : "This transaction was reviewed and determined to be legitimate. No immediate action is required."}
        </p>
      </div>

      {/* Recommended Actions */}
      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-gray-800">
          Recommended Actions
        </h4>
        <ul className="space-y-2">
          {isFraud && (
            <>
              <li className="flex items-start">
                <div className="bg-red-100 p-2 rounded mr-3">
                  <Lock className="h-4 w-4 text-red-700" />
                </div>
                <span className="text-sm pt-1 text-gray-700">
                  {detectionType === "CREDIT_CARD"
                    ? "Contact your card issuer to freeze your credit card."
                    : "Contact your bank to secure your account."}
                </span>
              </li>

              <li className="flex items-start">
                <div className="bg-red-100 p-2 rounded mr-3">
                  <ShieldAlert className="h-4 w-4 text-red-700" />
                </div>
                <span className="text-sm pt-1 text-gray-700">
                  Change your online banking password and enable two-factor
                  authentication.
                </span>
              </li>
            </>
          )}

          <li className="flex items-start">
            <div
              className={`${
                isFraud ? "bg-red-100" : "bg-blue-100"
              } p-2 rounded mr-3`}
            >
              <History
                className={`h-4 w-4 ${
                  isFraud ? "text-red-700" : "text-blue-700"
                }`}
              />
            </div>
            <span className="text-sm pt-1 text-gray-700">
              Review recent account activity for other suspicious transactions.
            </span>
          </li>

          <li className="flex items-start">
            <div
              className={`${
                isFraud ? "bg-red-100" : "bg-blue-100"
              } p-2 rounded mr-3`}
            >
              <AlertTriangle
                className={`h-4 w-4 ${
                  isFraud ? "text-red-700" : "text-blue-700"
                }`}
              />
            </div>
            <span className="text-sm pt-1 text-gray-700">
              {detectionType === "CREDIT_CARD"
                ? "Monitor your credit report for unauthorized accounts."
                : "Check other linked accounts for suspicious activity."}
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default function DetectionResultPageWrapper({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params); // Gunakan React.use() untuk mengambil nilai dari Promise
  return <DetectionResultPage id={id} />;
}

function DetectionResultPage({ id }: { id: string }) {
  const router = useRouter();
  const [detectionData, setDetectionData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null); // State untuk error

  // Fetch detection data
  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        setError(null);

        const data = await getDetectionById(id);
        if (!data) throw new Error("Detection record not found");

        setDetectionData(data);
      } catch (err) {
        console.error("Error fetching detection:", err);
        if (err instanceof Error) {
          if (err.message.includes("404")) {
            notFound(); // Gunakan notFound() dari next/navigation untuk handle 404
          } else {
            setError(err.message || "Failed to load detection details");
            toast.error("Failed to load detection details");
          }
        } else {
          setError("An unexpected error occurred");
          toast.error("An unexpected error occurred");
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [id]);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteDetection(id);
      toast.success("Detection record deleted successfully");
      router.push("/dashboard");
    } catch (error) {
      console.error("Error deleting detection:", error);
      toast.error("Failed to delete detection record");
      setIsDeleting(false);
    }
  };

  if (isLoading || !detectionData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-sm text-gray-500">Loading detection details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container max-w-7xl mx-auto px-4 py-6">
        <Card className="bg-red-50 border-red-200">
          <CardContent className="text-center p-8">
            <AlertCircle className="text-red-500 h-12 w-12 mx-auto mb-4" />
            <h2 className="text-xl font-medium mb-2 text-red-600">
              Error Loading Detection
            </h2>
            <p className="text-gray-600">{error}</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              <Repeat className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { detectionType, isFraud, timestamp, details } = detectionData;
  const formattedDate = format(new Date(timestamp), "PPP");
  const formattedTime = format(new Date(timestamp), "p");
  const formattedDateTime = format(new Date(timestamp), "PPpp");

  const isCreditCard = detectionType === "CREDIT_CARD";

  // Calculate risk score
  const riskScore = calculateRiskScore(detectionType, details, isFraud);

  return (
    <div className="container max-w-7xl mx-auto px-4 py-6">
      {/* Header Section with Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
          <div className="flex items-center">
            <ChevronRight className="text-gray-400 h-4 w-4" />
            <span className="text-sm text-gray-500 ml-1">
              Detection Details
            </span>
          </div>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 className="mr-1 h-4 w-4" />
              Delete Record
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this detection record? This
                action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700"
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Summary Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2 border-t-4 border-t-blue-500 shadow-white">
          <CardHeader className="pb-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
              <div>
                <CardTitle className="text-lg md:text-xl flex items-center">
                  {isCreditCard ? (
                    <CreditCard className="mr-2 h-5 w-5 text-blue-600" />
                  ) : (
                    <DollarSign className="mr-2 h-5 w-5 text-blue-600" />
                  )}
                  {isCreditCard
                    ? "Credit Card Detection"
                    : "Transaction Detection"}
                </CardTitle>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-1">
                  <p className="text-xs text-gray-500">
                    ID: <span className="font-mono">{id}</span>
                  </p>
                  <div className="hidden sm:block text-gray-300">•</div>
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="mr-1 h-3.5 w-3.5" />
                    {formattedDateTime}
                  </div>
                </div>
              </div>
              <Badge
                className={`text-sm px-3 py-1 ${
                  isFraud
                    ? "bg-red-100 text-red-700 border-red-200"
                    : "bg-green-100 text-green-700 border-green-200"
                }`}
              >
                {isFraud ? (
                  <AlertCircle className="mr-1 h-3.5 w-3.5" />
                ) : (
                  <CheckCircle className="mr-1 h-3.5 w-3.5" />
                )}
                {isFraud ? "Fraud Detected" : "Legitimate Transaction"}
              </Badge>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg mt-2">
              <h3 className="text-sm font-medium mb-1">Detection Summary</h3>
              <p className="text-sm text-gray-600">
                {isCreditCard
                  ? isFraud
                    ? `Credit card transaction flagged as fraudulent due to unusual activity patterns. Transaction occurred ${
                        details.distanceFromHome
                      } miles from home and ${
                        details.usedChip ? "" : "did not use chip security"
                      }${
                        !details.usedChip && !details.usedPinNumber
                          ? " or "
                          : ""
                      }${
                        details.usedPinNumber
                          ? ""
                          : "did not use PIN verification"
                      }.`
                    : `Credit card transaction verified as legitimate despite some unusual patterns. Used proper verification methods and consistent with user's typical transaction behavior.`
                  : isFraud
                  ? `${details.type} transaction flagged as fraudulent based on unusual balance changes and transaction flow that doesn't align with expected patterns.`
                  : `${details.type} transaction verified as legitimate with expected balance changes and consistent with normal account activity.`}
              </p>
            </div>
          </CardHeader>
        </Card>

        {/* Risk Score Card */}
        <Card className="shadow-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-md flex items-center">
              <ShieldAlert className="mr-1 h-4 w-4" />
              Risk Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center h-full py-4">
              <div className="relative w-32 h-32 mb-3">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle
                    className="text-gray-200"
                    strokeWidth="10"
                    stroke="currentColor"
                    fill="transparent"
                    r="40"
                    cx="50"
                    cy="50"
                  />
                  <circle
                    className={`${
                      riskScore > 70
                        ? "text-red-500"
                        : riskScore > 40
                        ? "text-yellow-500"
                        : "text-green-500"
                    }`}
                    strokeWidth="10"
                    strokeDasharray={`${(2 * Math.PI * 40 * riskScore) / 100} ${
                      (2 * Math.PI * 40 * (100 - riskScore)) / 100
                    }`}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="40"
                    cx="50"
                    cy="50"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-3xl font-bold">{riskScore}</span>
                  <span className="text-xs text-gray-500">Risk Score</span>
                </div>
              </div>

              <div className="text-center">
                <Badge
                  className={`mb-2 ${
                    riskScore > 70
                      ? "bg-red-100 text-red-800 border-red-200"
                      : riskScore > 40
                      ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                      : "bg-green-100 text-green-800 border-green-200"
                  }`}
                >
                  {riskScore > 70
                    ? "High Risk"
                    : riskScore > 40
                    ? "Medium Risk"
                    : "Low Risk"}
                </Badge>
                <p className="text-xs text-gray-500 max-w-xs mx-auto">
                  {riskScore > 70
                    ? "Immediate attention required. Multiple risk factors identified."
                    : riskScore > 40
                    ? "Some abnormal patterns detected. Additional verification recommended."
                    : "Low risk level. Transaction patterns appear normal."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Tabs Section */}
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid grid-cols-3 gap-2 mb-2 !h-12">
          <TabsTrigger
            value="details"
            className="flex flex-col items-center justify-center text-xs sm:text-base"
          >
            <List className="w-5 h-5 sm:hidden" />
            <span className="hidden sm:inline">Transaction Details</span>
          </TabsTrigger>

          <TabsTrigger
            value="analysis"
            className="flex flex-col items-center justify-center text-xs sm:text-base"
          >
            <AlertTriangle className="w-5 h-5 sm:hidden" />
            <span className="hidden sm:inline">Risk Analysis</span>
          </TabsTrigger>

          <TabsTrigger
            value="security"
            className="flex flex-col items-center justify-center text-xs sm:text-base"
          >
            <ShieldCheck className="w-5 h-5 sm:hidden" />
            <span className="hidden sm:inline">Security Assessment</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="details"
          className="p-4 bg-white rounded-lg border shadow-white"
        >
          <h2 className="text-lg font-semibold mb-4">
            Transaction Information
          </h2>
          {isCreditCard ? (
            <CreditCardDetails details={details} />
          ) : (
            <TransactionDetails details={details} />
          )}
        </TabsContent>

        <TabsContent
          value="analysis"
          className="p-4 bg-white rounded-lg border shadow-white"
        >
          <h2 className="text-lg font-semibold mb-4">Risk Factor Analysis</h2>
          {isCreditCard ? (
            <CreditCardRiskAnalysis details={details} isFraud={isFraud} />
          ) : (
            <TransactionRiskAnalysis details={details} isFraud={isFraud} />
          )}
        </TabsContent>

        <TabsContent
          value="security"
          className="p-4 bg-white rounded-lg border shadow-white"
        >
          <h2 className="text-lg font-semibold mb-4">Security Assessment</h2>
          <SecurityAssessment detectionType={detectionType} isFraud={isFraud} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

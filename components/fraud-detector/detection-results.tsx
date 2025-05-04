"use client";

import {
  CheckCircle,
  AlertTriangle,
  ShieldAlert,
  Info,
  Shield,
  Search,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface ApiResponse {
  status: string;
  transaction_details: any;
  transaction_analysis: {
    prediction_label: string;
    confidence_percentage: string;
    confidence_score: number;
    risk_level: string;
    risk_description: string;
    probability_assessment: string;
    analysis_timestamp: string;
    model_version: string;
  };
  protective_factors: {
    factor: string;
    description: string;
    strength: string;
  }[];
  risk_factors: {
    factor: string;
    description: string;
    severity: string;
    recommendation: string;
  }[];
  fraud_pattern_analysis?: {
    known_patterns: {
      pattern_name: string;
      description: string;
      match_level: string;
    }[];
    unusual_elements: string[];
  };
  action_recommendations?: string[];
  transaction_velocity_recommendations?: string[];
  historical_context_analysis?: {
    [key: string]: {
      description: string;
      findings: string;
      interpretation: string;
    };
  };
}

interface DetectionResultsProps {
  result: ApiResponse | null;
  loading: boolean;
  error: string | null;
}

export default function DetectionResults({
  result,
  loading,
  error,
}: DetectionResultsProps) {
  // Helper function to get result card background color based on prediction
  const getResultColorClass = () => {
    if (!result?.transaction_analysis?.prediction_label) return "bg-white";

    if (
      result.transaction_analysis.prediction_label === "Fraudulent Transaction"
    ) {
      return "bg-red-50 border-red-200";
    } else if (result.transaction_analysis.risk_level === "Minimal") {
      return "bg-green-50 border-green-200";
    } else {
      return "bg-yellow-50 border-yellow-200";
    }
  };

  // Helper function to get confidence bar color
  const getConfidenceColorClass = () => {
    if (!result?.transaction_analysis?.prediction_label) return "bg-gray-200";

    if (
      result.transaction_analysis.prediction_label === "Fraudulent Transaction"
    ) {
      return "bg-red-500";
    } else {
      return "bg-green-500";
    }
  };

  // Helper function to render factor badges
  const renderFactorBadge = (strength: string) => {
    switch (strength.toLowerCase()) {
      case "strong":
        return (
          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
            Strong
          </span>
        );
      case "moderate":
        return (
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
            Moderate
          </span>
        );
      case "medium":
        return (
          <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium">
            Medium
          </span>
        );
      case "weak":
        return (
          <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full font-medium">
            Weak
          </span>
        );
      case "high":
        return (
          <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium">
            High
          </span>
        );
      default:
        return (
          <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full font-medium">
            {strength}
          </span>
        );
    }
  };

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600 mb-4"></div>
        <h3 className="text-xl font-medium text-gray-900">
          Analyzing Transaction
        </h3>
        <p className="text-gray-600">
          Please wait while our AI analyzes this transaction...
        </p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <ShieldAlert className="h-16 w-16 text-blue-600 mb-4" />
        <h3 className="text-xl font-medium text-gray-900 mb-2">
          No Transaction Analyzed Yet
        </h3>
        <p className="text-gray-600 max-w-md">
          Complete the form on the left with transaction details to analyze
          potential fraud risk.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Result Card */}
      <Card className={`overflow-hidden border-2 ${getResultColorClass()}`}>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center">
            {result.transaction_analysis?.prediction_label ===
            "Fraudulent Transaction" ? (
              <AlertTriangle className="mr-2 text-red-500" size={24} />
            ) : (
              <CheckCircle className="mr-2 text-green-500" size={24} />
            )}
            Transaction Analysis Result
          </CardTitle>
          <CardDescription>
            Analysis timestamp:{" "}
            {result.transaction_analysis?.analysis_timestamp
              ? new Date(
                  result.transaction_analysis.analysis_timestamp
                ).toLocaleString()
              : "N/A"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold mb-1">
                {result.transaction_analysis?.prediction_label ===
                "Fraudulent Transaction" ? (
                  <span className="text-red-600">Fraudulent Transaction</span>
                ) : (
                  <span className="text-green-600">Legitimate Transaction</span>
                )}
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Risk Level:</strong>{" "}
                {result.transaction_analysis?.risk_level || "N/A"} -{" "}
                {result.transaction_analysis?.risk_description || "N/A"}
              </p>

              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Confidence:</span>
                  <span className="font-medium">
                    {result.transaction_analysis?.confidence_percentage || "0%"}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full ${getConfidenceColorClass()}`}
                    style={{
                      width: `${
                        result.transaction_analysis?.prediction_label ===
                        "Fraudulent Transaction"
                          ? parseFloat(
                              result.transaction_analysis?.confidence_percentage
                            ) || 0
                          : 100 -
                            parseFloat(
                              result.transaction_analysis
                                ?.confidence_percentage || "0"
                            )
                      }%`,
                    }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {result.transaction_analysis?.prediction_label ===
                  "Fraudulent Transaction"
                    ? "Higher percentage indicates higher confidence that this transaction is fraudulent."
                    : "Lower percentage (closer to 0%) indicates higher confidence that this transaction is legitimate."}
                </p>
              </div>

              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start">
                  <Info
                    className="text-blue-600 mt-0.5 mr-2 flex-shrink-0"
                    size={16}
                  />
                  <p className="text-sm text-blue-800">
                    <strong>Understanding Confidence:</strong> Our system
                    reports confidence differently based on the prediction. For
                    legitimate transactions, a confidence of 0.00% means high
                    certainty that the transaction is legitimate. For fraudulent
                    transactions, a confidence approaching 100.00% indicates
                    high certainty of fraud.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Analysis Tabs */}
      <Tabs defaultValue="protective" className="w-full">
        <TabsList className="grid grid-cols-4 gap-2 mb-2 bg-muted !h-12 border-none">
          <TabsTrigger
            value="protective"
            title="Protective Factors"
            className="flex flex-col items-center text-xs sm:text-base"
          >
            <Shield className="w-5 h-5 sm:hidden" />
            <span className="hidden sm:inline">Protective Factors</span>
          </TabsTrigger>
          <TabsTrigger
            value="risk"
            title="Risk Factors"
            className="flex flex-col items-center text-xs sm:text-base"
          >
            <AlertTriangle className="w-5 h-5 sm:hidden" />
            <span className="hidden sm:inline">Risk Factors</span>
          </TabsTrigger>
          <TabsTrigger
            value="patterns"
            title="Fraud Patterns"
            className="flex flex-col items-center text-xs sm:text-base"
          >
            <Search className="w-5 h-5 sm:hidden" />
            <span className="hidden sm:inline">Fraud Patterns</span>
          </TabsTrigger>
          <TabsTrigger
            value="recommendations"
            title="Recommendations"
            className="flex flex-col items-center text-xs sm:text-base"
          >
            <CheckCircle className="w-5 h-5 sm:hidden" />
            <span className="hidden sm:inline">Recommendations</span>
          </TabsTrigger>
        </TabsList>

        {/* Protective Factors Tab */}
        <TabsContent value="protective">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 text-green-500" size={20} />
                Protective Factors
              </CardTitle>
              <CardDescription>
                Elements that reduce the likelihood of this transaction being
                fraudulent
              </CardDescription>
            </CardHeader>
            <CardContent>
              {result.protective_factors?.length ? (
                <ul className="space-y-4">
                  {result.protective_factors.map((factor, index) => (
                    <li
                      key={index}
                      className="bg-white p-3 rounded-md border border-gray-100 shadow-sm"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-medium text-gray-900">
                          {factor.factor}
                        </h4>
                        {renderFactorBadge(factor.strength)}
                      </div>
                      <p className="text-sm text-gray-600">
                        {factor.description}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">
                  No protective factors identified.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Risk Factors Tab */}
        <TabsContent value="risk">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="mr-2 text-yellow-500" size={20} />
                Risk Factors
              </CardTitle>
              <CardDescription>
                Elements that increase the likelihood of this transaction being
                fraudulent
              </CardDescription>
            </CardHeader>
            <CardContent>
              {result.risk_factors?.length ? (
                <ul className="space-y-4">
                  {result.risk_factors.map((factor, index) => (
                    <li
                      key={index}
                      className="bg-white p-3 rounded-md border border-gray-100 shadow-sm"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-medium text-gray-900">
                          {factor.factor}
                        </h4>
                        {renderFactorBadge(factor.severity)}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {factor.description}
                      </p>
                      <div className="bg-blue-50 p-2 rounded text-xs text-blue-800">
                        <strong>Recommendation:</strong> {factor.recommendation}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">
                  No risk factors identified.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Additional tabs omitted for brevity but would follow the same pattern */}
        {/* Fraud Patterns Tab */}
        <TabsContent value="patterns">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="mr-2 text-orange-500" size={20} />
                Fraud Pattern Analysis
              </CardTitle>
              <CardDescription>
                Analysis of known fraud patterns in this transaction
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Known Patterns
                  </h4>
                  {result.fraud_pattern_analysis?.known_patterns?.length ? (
                    <ul className="space-y-3">
                      {result.fraud_pattern_analysis.known_patterns.map(
                        (pattern, index) => (
                          <li
                            key={index}
                            className="bg-white p-3 rounded-md border border-gray-100 shadow-sm"
                          >
                            <div className="flex justify-between items-start mb-1">
                              <h5 className="font-medium text-gray-800">
                                {pattern.pattern_name}
                              </h5>
                              {renderFactorBadge(pattern.match_level)}
                            </div>
                            <p className="text-sm text-gray-600">
                              {pattern.description}
                            </p>
                          </li>
                        )
                      )}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">
                      No known fraud patterns detected.
                    </p>
                  )}
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Unusual Elements
                  </h4>
                  {result.fraud_pattern_analysis?.unusual_elements?.length ? (
                    <ul className="list-disc list-inside space-y-1">
                      {result.fraud_pattern_analysis.unusual_elements.map(
                        (element, index) => (
                          <li key={index} className="text-sm text-gray-600">
                            {element}
                          </li>
                        )
                      )}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">
                      No unusual elements detected.
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recommendations Tab */}
        <TabsContent value="recommendations">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 text-blue-600" size={20} />
                Recommendations
              </CardTitle>
              <CardDescription>
                Suggested actions based on transaction analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Action Recommendations
                  </h4>
                  {result.action_recommendations?.length ? (
                    <ul className="list-disc list-inside space-y-1">
                      {result.action_recommendations.map((action, index) => (
                        <li key={index} className="text-sm text-gray-600">
                          {action}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">
                      No action recommendations available.
                    </p>
                  )}
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Velocity Check Recommendations
                  </h4>
                  {result.transaction_velocity_recommendations?.length ? (
                    <ul className="list-disc list-inside space-y-1">
                      {result.transaction_velocity_recommendations.map(
                        (rec, index) => (
                          <li key={index} className="text-sm text-gray-600">
                            {rec}
                          </li>
                        )
                      )}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">
                      No velocity check recommendations available.
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

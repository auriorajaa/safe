"use client";

import {
  CheckCircle,
  AlertTriangle,
  ShieldAlert,
  Info,
  Shield,
  Search,
  Bell,
  Clipboard,
  FileText,
  User,
  Package,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface ApiResponse {
  status: string;
  fraud_assessment: {
    analysis_timestamp: string;
    confidence_level: number;
    decision_boundary: number;
    fraud_detected: boolean;
    fraud_probability_percentage: number;
    risk_level: string;
  };
  transaction_summary: {
    amount: number;
    balance_after: number;
    balance_before: number;
    destination_balance_after: number;
    destination_balance_before: number;
    transaction_id: string;
    transaction_step: number;
    transaction_type: string;
  };
  detailed_analysis: {
    decision_explanation: string;
    impact_assessment: {
      customer_experience_impact: {
        if_allowed_incorrectly: string;
        if_blocked_incorrectly: string;
        optimal_approach: string;
      };
      financial_impact: {
        amount_at_risk: number;
        percentage_of_balance: number;
        potential_loss: string;
      };
      operational_considerations: {
        investigation_priority: string;
        resource_allocation: string;
        response_timeframe: string;
      };
    };
    risk_factors: {
      description: string;
      factor: string;
      impact: string;
      recommendation: string;
      severity: string;
    }[];
    transaction_patterns: {
      amount_pattern_analysis: {
        amount_category: string;
        amount_roundness: string;
        amount_significance: string;
      };
      balance_pattern_analysis: {
        balance_change_pattern: string;
        balance_ratio: number;
        consistency_analysis: string;
        destination_balance_pattern: string;
      };
    };
  };
  action_plan: {
    detailed_recommendations: {
      action: string;
      description: string;
      implementation: string;
      priority: string;
      rationale: string;
    }[];
    next_steps: {
      expected_outcome: string;
      responsible_party: string;
      step: string;
      timeline: string;
    }[];
    primary_recommendation: {
      action: string;
      description: string;
      implementation: string;
      justification: string;
    };
  };
}

interface DetectionResultsProps {
  result: ApiResponse | null;
  loading: boolean;
  error: string | null;
}

export default function TransactionDetectionResults({
  result,
  loading,
  error,
}: DetectionResultsProps) {
  const getResultColorClass = () => {
    if (!result?.fraud_assessment?.fraud_detected) return "bg-white";

    if (result.fraud_assessment.fraud_detected) {
      return "bg-red-50 border-red-200";
    } else if (result.fraud_assessment.risk_level === "Very Low") {
      return "bg-green-50 border-green-200";
    } else {
      return "bg-yellow-50 border-yellow-200";
    }
  };

  const getConfidenceColorClass = () => {
    if (!result?.fraud_assessment?.fraud_detected) return "bg-gray-200";

    return result.fraud_assessment.fraud_detected
      ? "bg-red-500"
      : "bg-green-500";
  };

  const renderSeverityBadge = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "critical":
        return (
          <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium">
            Critical
          </span>
        );
      case "high":
        return (
          <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full font-medium">
            High
          </span>
        );
      case "medium":
        return (
          <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium">
            Medium
          </span>
        );
      case "low":
        return (
          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
            Low
          </span>
        );
      default:
        return (
          <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full font-medium">
            {severity}
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
            {result.fraud_assessment.fraud_detected ? (
              <AlertTriangle className="mr-2 text-red-500" size={24} />
            ) : (
              <CheckCircle className="mr-2 text-green-500" size={24} />
            )}
            Transaction Risk Assessment
          </CardTitle>
          <CardDescription>
            Analysis timestamp:{" "}
            {new Date(
              result.fraud_assessment.analysis_timestamp
            ).toLocaleString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold mb-1">
                {result.fraud_assessment.fraud_detected ? (
                  <span className="text-red-600">High Fraud Risk</span>
                ) : (
                  <span className="text-green-600">Low Fraud Risk</span>
                )}
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Risk Level:</strong>{" "}
                {result.fraud_assessment.risk_level || "N/A"}
              </p>

              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Fraud Probability:</span>
                  <span className="font-medium">
                    {result.fraud_assessment.fraud_probability_percentage ||
                      "0"}
                    %
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full ${getConfidenceColorClass()}`}
                    style={{
                      width: `${result.fraud_assessment.fraud_probability_percentage}%`,
                    }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Higher percentage indicates greater likelihood of fraud.
                </p>
              </div>

              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start">
                  <Info
                    className="text-blue-600 mt-0.5 mr-2 flex-shrink-0"
                    size={16}
                  />
                  <p className="text-sm text-blue-800">
                    <strong>Decision Summary:</strong>{" "}
                    {result.detailed_analysis.decision_explanation}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Analysis Tabs */}
      <Tabs defaultValue="recommendations" className="w-full">
        <TabsList className="grid grid-cols-4 gap-2 mb-2 !h-12">
          <TabsTrigger
            value="recommendations"
            className="flex flex-col items-center text-xs sm:text-base"
          >
            <Shield className="w-5 h-5 sm:hidden" />
            <span className="hidden sm:inline">Recommendations</span>
          </TabsTrigger>
          <TabsTrigger
            value="risk-analysis"
            className="flex flex-col items-center text-xs sm:text-base"
          >
            <AlertTriangle className="w-5 h-5 sm:hidden" />
            <span className="hidden sm:inline">Analysis</span>
          </TabsTrigger>
          <TabsTrigger
            value="transaction-patterns"
            className="flex flex-col items-center text-xs sm:text-base"
          >
            <Search className="w-5 h-5 sm:hidden" />
            <span className="hidden sm:inline">Patterns</span>
          </TabsTrigger>
          <TabsTrigger
            value="impact-assessment"
            className="flex flex-col items-center text-xs sm:text-base"
          >
            <User className="w-5 h-5 sm:hidden" />
            <span className="hidden sm:inline">Impact</span>
          </TabsTrigger>
        </TabsList>

        {/* Action Recommendations Tab */}
        <TabsContent value="recommendations">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 text-blue-500" size={20} />
                Action Recommendations
              </CardTitle>
              <CardDescription>
                Immediate steps to address potential fraud scenario
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-yellow-50 p-4 rounded-lg mb-4">
                  <h4 className="font-medium text-yellow-800 mb-2 flex items-center">
                    <Bell className="mr-2" size={16} />
                    Primary Recommendation
                  </h4>
                  <p className="text-sm text-yellow-700">
                    <strong>Action:</strong>{" "}
                    {result.action_plan.primary_recommendation.action}
                  </p>
                  <p className="text-sm text-gray-600">
                    {result.action_plan.primary_recommendation.description}
                  </p>
                </div>

                <h4 className="font-medium text-gray-900 mb-2">
                  Detailed Recommendations
                </h4>
                {result.action_plan.detailed_recommendations.map(
                  (rec, index) => (
                    <div
                      key={index}
                      className="bg-white p-3 rounded-md border border-gray-200 mb-3"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <h5 className="font-medium text-gray-800">
                          {rec.action}
                        </h5>
                        {renderSeverityBadge(rec.priority)}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        {rec.description}
                      </p>
                      <div className="text-xs text-gray-500 mt-2">
                        <strong>Implementation:</strong> {rec.implementation}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        <strong>Rationale:</strong> {rec.rationale}
                      </div>
                    </div>
                  )
                )}

                <h4 className="font-medium text-gray-900 mb-2 mt-6">
                  Next Steps Timeline
                </h4>
                {result.action_plan.next_steps.map((step, index) => (
                  <div
                    key={index}
                    className="bg-white p-4 rounded-md border border-gray-200 mb-4 transition-all hover:shadow-md"
                  >
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                      <div className="flex-1">
                        <h5 className="font-semibold text-gray-800 mb-1">
                          {step.step}
                        </h5>
                        <div className="flex items-center text-sm text-gray-500 my-2">
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            ></path>
                          </svg>
                          {step.timeline}
                        </div>
                      </div>
                      <div className="flex items-center text-xs text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
                        {step.responsible_party}
                      </div>
                    </div>
                    <div className="mt-2 pt-2 border-t border-gray-100">
                      <div className="flex items-center text-sm text-gray-700">
                        <span className="font-medium">Expected outcome:</span>
                        <span className="ml-1">{step.expected_outcome}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Risk Analysis Tab */}
        <TabsContent value="risk-analysis">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="mr-2 text-yellow-500" size={20} />
                Risk Factor Analysis
              </CardTitle>
              <CardDescription>
                Critical elements contributing to risk assessment
              </CardDescription>
            </CardHeader>
            <CardContent>
              {result.detailed_analysis.risk_factors.length ? (
                <ul className="space-y-4">
                  {result.detailed_analysis.risk_factors.map(
                    (factor, index) => (
                      <li
                        key={index}
                        className="bg-white p-3 rounded-md border border-gray-200"
                      >
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-medium text-gray-900">
                            {factor.factor}
                          </h4>
                          {renderSeverityBadge(factor.severity)}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {factor.description}
                        </p>
                        <div className="bg-blue-50 p-2 rounded text-xs text-blue-800">
                          <strong>Impact:</strong> {factor.impact}
                        </div>
                        <div className="bg-blue-50 p-2 rounded text-xs text-blue-800 mt-1">
                          <strong>Recommendation:</strong>{" "}
                          {factor.recommendation}
                        </div>
                      </li>
                    )
                  )}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">
                  No significant risk factors identified
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Transaction Patterns Tab */}
        <TabsContent value="transaction-patterns">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="mr-2 text-orange-500" size={20} />
                Transaction Patterns
              </CardTitle>
              <CardDescription>
                Analysis of transaction behavioral patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Amount Pattern Analysis
                  </h4>
                  <ul className="list-disc list-inside space-y-1 pl-4">
                    <li className="text-sm text-gray-600">
                      Category:{" "}
                      {
                        result.detailed_analysis.transaction_patterns
                          .amount_pattern_analysis.amount_category
                      }
                    </li>
                    <li className="text-sm text-gray-600">
                      Roundness:{" "}
                      {
                        result.detailed_analysis.transaction_patterns
                          .amount_pattern_analysis.amount_roundness
                      }
                    </li>
                    <li className="text-sm text-gray-600">
                      Significance:{" "}
                      {
                        result.detailed_analysis.transaction_patterns
                          .amount_pattern_analysis.amount_significance
                      }
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Balance Pattern Analysis
                  </h4>
                  <ul className="list-disc list-inside space-y-1 pl-4">
                    <li className="text-sm text-gray-600">
                      Change Pattern:{" "}
                      {
                        result.detailed_analysis.transaction_patterns
                          .balance_pattern_analysis.balance_change_pattern
                      }
                    </li>
                    <li className="text-sm text-gray-600">
                      Balance Ratio:{" "}
                      {
                        result.detailed_analysis.transaction_patterns
                          .balance_pattern_analysis.balance_ratio
                      }
                    </li>
                    <li className="text-sm text-gray-600">
                      Consistency:{" "}
                      {
                        result.detailed_analysis.transaction_patterns
                          .balance_pattern_analysis.consistency_analysis
                      }
                    </li>
                    <li className="text-sm text-gray-600">
                      Destination Pattern:{" "}
                      {
                        result.detailed_analysis.transaction_patterns
                          .balance_pattern_analysis.destination_balance_pattern
                      }
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Impact Assessment Tab */}
        <TabsContent value="impact-assessment">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 text-blue-600" size={20} />
                Impact Assessment
              </CardTitle>
              <CardDescription>
                Analysis of potential consequences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">
                    Customer Experience Impact
                  </h4>
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600">
                      <strong>If allowed incorrectly:</strong>{" "}
                      {
                        result.detailed_analysis.impact_assessment
                          .customer_experience_impact.if_allowed_incorrectly
                      }
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>If blocked incorrectly:</strong>{" "}
                      {
                        result.detailed_analysis.impact_assessment
                          .customer_experience_impact.if_blocked_incorrectly
                      }
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Optimal approach:</strong>{" "}
                      {
                        result.detailed_analysis.impact_assessment
                          .customer_experience_impact.optimal_approach
                      }
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 mb-2">
                    Financial Impact
                  </h4>
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600">
                      <strong>Amount at risk:</strong> $
                      {
                        result.detailed_analysis.impact_assessment
                          .financial_impact.amount_at_risk
                      }
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Percentage of balance:</strong>{" "}
                      {
                        result.detailed_analysis.impact_assessment
                          .financial_impact.percentage_of_balance
                      }
                      %
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Potential loss:</strong>{" "}
                      {
                        result.detailed_analysis.impact_assessment
                          .financial_impact.potential_loss
                      }
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 mb-2">
                    Operational Considerations
                  </h4>
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600">
                      <strong>Investigation priority:</strong>{" "}
                      {
                        result.detailed_analysis.impact_assessment
                          .operational_considerations.investigation_priority
                      }
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Resource allocation:</strong>{" "}
                      {
                        result.detailed_analysis.impact_assessment
                          .operational_considerations.resource_allocation
                      }
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Response timeframe:</strong>{" "}
                      {
                        result.detailed_analysis.impact_assessment
                          .operational_considerations.response_timeframe
                      }
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

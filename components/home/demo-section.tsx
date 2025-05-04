"use client";

import { JSX, SVGProps, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertTriangle,
  CheckCircle2,
  CreditCard,
  DollarSign,
  LineChart,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MotionDiv, MotionH2, MotionSection } from "../common/motion-wrapper";
import { containerVariants, itemVariants } from "@/lib/constants";

export default function DemoSection() {
  const [selectedTab, setSelectedTab] = useState("general-fraud");

  const generalFraudSample = {
    type: "PAYMENT",
    amount: 1000.0,
    oldbalanceOrg: 10000.0,
    newbalanceOrig: 9000.0,
    oldbalanceDest: 5000.0,
    newbalanceDest: 6000.0,
  };

  const creditCardFraudSample = {
    distance_from_home: 65,
    distance_from_last_transaction: 91,
    ratio_to_median_purchase_price: 10,
    repeat_retailer: true,
    used_chip: false,
    used_pin_number: false,
    online_order: true,
  };

  const newsHeadlineSample =
    "Wall Street: Dow Jones Cut, Boeing Stock Plunges 2.4 Percent";

  return (
    <MotionSection
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="py-12 md:py-16 lg:py-20 bg-gradient-to-b from-white to-blue-50"
    >
      <MotionDiv
        variants={itemVariants}
        className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl"
      >
        <MotionDiv variants={itemVariants} className="text-center mb-10">
          <Badge
            variant="outline"
            className="px-4 py-2 rounded-full border-blue-300 bg-blue-50 backdrop-blur-sm mb-4 animate-pulse md:max-w-max md:mx-auto"
          >
            <ShieldCheck className="h-4 w-4 mr-2 text-blue-600" />
            <p className="text-sm font-medium text-blue-700">
              See SAFE in Action
            </p>
          </Badge>
          <MotionH2
            variants={itemVariants}
            className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-6"
          >
            Intelligent Security Solutions
          </MotionH2>
          <p className="text-sm md:text-base text-gray-600 max-w-3xl mx-auto">
            Explore how our AI-powered tools detect fraud and analyze market
            sentiment to protect your business.
          </p>
        </MotionDiv>

        <Tabs
          defaultValue="general-fraud"
          value={selectedTab}
          onValueChange={setSelectedTab}
          className="max-w-5xl w-full mx-auto"
        >
          <TabsList className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-8 bg-transparent w-full h-full overflow-x-auto">
            <TabsTrigger
              value="general-fraud"
              className="py-3 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-300 text-sm md:text-base"
            >
              <DollarSign className="h-4 w-4 md:h-5 md:w-5 mr-2" />
              General Transaction Fraud
            </TabsTrigger>
            <TabsTrigger
              value="credit-card-fraud"
              className="py-3 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-300 text-sm md:text-base"
            >
              <CreditCard className="h-4 w-4 md:h-5 md:w-5 mr-2" />
              Credit Card Fraud
            </TabsTrigger>
            <TabsTrigger
              value="sentiment-analysis"
              className="py-3 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-300 text-sm md:text-base"
            >
              <LineChart className="h-4 w-4 md:h-5 md:w-5 mr-2" />
              News Sentiment Analysis
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general-fraud" className="animate-fadeIn mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border border-blue-100 shadow-lg shadow-blue-50 transition-all duration-500 hover:shadow-blue-100 hover:scale-[1.01] group max-w-full">
                <CardHeader className="border-b border-blue-50 p-4 md:p-6">
                  <CardTitle className="flex items-center text-lg md:text-xl">
                    <DollarSign className="h-4 w-4 md:h-5 md:w-5 mr-2 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
                    Transaction Input
                  </CardTitle>
                  <p className="text-xs md:text-sm text-gray-600">
                    Enter transaction details to detect potential fraud
                  </p>
                </CardHeader>
                <CardContent className="space-y-4 p-4 md:p-6">
                  <div className="bg-blue-50 p-4 md:p-6 rounded-xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-100/20 to-transparent opacity-70"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                      {Object.entries(generalFraudSample).map(
                        ([key, value], index) => (
                          <div
                            key={key}
                            className="bg-white rounded-lg p-3 md:p-4 shadow-sm border border-blue-100 transform transition-all duration-300 hover:shadow-md hover:border-blue-200"
                            style={{ transitionDelay: `${index * 50}ms` }}
                          >
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger className="w-full">
                                  <div className="text-left">
                                    <p className="text-xs md:text-sm text-gray-500 capitalize">
                                      {key
                                        .replace(/([A-Z])/g, " $1")
                                        .replace(/^./, (str) =>
                                          str.toUpperCase()
                                        )}
                                    </p>
                                    <p className="text-sm md:text-base font-medium text-gray-900">
                                      {typeof value === "number"
                                        ? value.toLocaleString("en-US", {
                                            style: "currency",
                                            currency: "USD",
                                            minimumFractionDigits: 2,
                                          })
                                        : value.toString()}
                                    </p>
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent className="bg-blue-600 text-white whitespace-pre-line">
                                  <div className="text-xs max-w-xs">
                                    {getGeneralFraudFieldDescription(key)}
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-blue-100 shadow-lg shadow-blue-50 transition-all duration-500 hover:shadow-blue-100 hover:scale-[1.01] group max-w-full">
                <CardHeader className="border-b border-blue-50 p-4 md:p-6">
                  <CardTitle className="flex items-center text-lg md:text-xl">
                    <ShieldCheck className="h-4 w-4 md:h-5 md:w-5 mr-2 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
                    Analysis Result
                  </CardTitle>
                  <p className="text-xs md:text-sm text-gray-600">
                    AI-powered fraud risk assessment with recommendations
                  </p>
                </CardHeader>
                <CardContent className="p-4 md:p-6">
                  <div className="bg-blue-50 p-4 md:p-6 rounded-xl space-y-4 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-100/20 to-transparent opacity-70"></div>
                    <div className="flex items-center justify-between relative z-10">
                      <div>
                        <p className="text-xs md:text-sm text-gray-500">
                          Fraud Risk Level
                        </p>
                        <div className="flex items-center">
                          <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5 text-green-500 mr-2" />
                          <p className="text-lg md:text-xl font-bold text-green-600">
                            Low
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="bg-white border border-green-200 rounded-full p-1 shadow-inner">
                          <div className="h-12 w-12 md:h-14 md:w-14 rounded-full bg-green-100 flex items-center justify-center relative">
                            <svg className="absolute inset-0 w-full h-full">
                              <circle
                                cx="50%"
                                cy="50%"
                                r="45%"
                                fill="none"
                                stroke="#dcfce7"
                                strokeWidth="4"
                              />
                            </svg>
                            <p className="text-base md:text-lg font-bold text-green-700 z-10">
                              0%
                            </p>
                          </div>
                        </div>
                        <div className="ml-2 text-center">
                          <p className="text-xs text-gray-500">Fraud</p>
                          <p className="text-xs text-gray-500">Probability</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-3 md:p-4 shadow-sm border border-blue-100 transform transition-all duration-300 hover:shadow-md hover:border-blue-200">
                      <p className="text-xs md:text-sm text-gray-500 mb-2">
                        Recommendation
                      </p>
                      <div className="flex items-center">
                        {/* <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5 text-green-500 mr-2" /> */}
                        <p className="text-sm md:text-base text-gray-800">
                          <span className="font-medium">Auto-approve:</span>{" "}
                          Transaction can be automatically approved
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white rounded-lg p-3 md:p-4 shadow-sm border border-blue-100 transform transition-all duration-300 hover:shadow-md hover:border-blue-200">
                        <p className="text-xs md:text-sm text-gray-500 mb-2">
                          Processing Time
                        </p>
                        <div className="flex items-center">
                          <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-blue-500 mr-2 animate-pulse"></div>
                          <p className="text-sm md:text-base font-medium text-gray-900">
                            127.03 ms
                          </p>
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-3 md:p-4 shadow-sm border border-blue-100 transform transition-all duration-300 hover:shadow-md hover:border-blue-200">
                        <p className="text-xs md:text-sm text-gray-500 mb-2">
                          Decision Threshold
                        </p>
                        <div className="flex items-center">
                          <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-blue-500 mr-2"></div>
                          <p className="text-sm md:text-base font-medium text-gray-900">
                            0.84
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 rounded-lg p-3 md:p-4 shadow-sm border border-green-100">
                      <div className="flex items-start">
                        {/* <InfoIcon className="h-4 w-4 mr-2 mt-0.5 text-green-600" /> */}
                        <p className="text-xs md:text-sm text-green-800">
                          Our AI analyzes over 6 Million transaction features to
                          accurately determine fraud risk. This example shows a
                          typical safe transaction pattern.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent
            value="credit-card-fraud"
            className="animate-fadeIn mt-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border border-blue-100 shadow-lg shadow-blue-50 transition-all duration-500 hover:shadow-blue-100 hover:scale-[1.01] group max-w-full">
                <CardHeader className="border-b border-blue-50 p-4 md:p-6">
                  <CardTitle className="flex items-center text-lg md:text-xl">
                    <CreditCard className="h-4 w-4 md:h-5 md:w-5 mr-2 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
                    Credit Card Transaction
                  </CardTitle>
                  <p className="text-xs md:text-sm text-gray-600">
                    Analyze credit card transaction for potential fraud
                  </p>
                </CardHeader>
                <CardContent className="space-y-4 p-4 md:p-6">
                  <div className="bg-blue-50 p-4 md:p-6 rounded-xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-100/20 to-transparent opacity-70"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                      {Object.entries(creditCardFraudSample).map(
                        ([key, value], index) => (
                          <div
                            key={key}
                            className="bg-white rounded-lg p-3 md:p-4 shadow-sm border border-blue-100 transform transition-all duration-300 hover:shadow-md hover:border-blue-200"
                            style={{ transitionDelay: `${index * 50}ms` }}
                          >
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger className="w-full">
                                  <div className="text-left">
                                    <p className="text-xs md:text-sm text-gray-500 capitalize">
                                      {key.split("_").join(" ")}
                                    </p>
                                    <p className="text-sm md:text-base font-medium text-gray-900">
                                      {typeof value === "boolean" ? (
                                        <span
                                          className={`inline-flex items-center ${
                                            value
                                              ? "text-green-600"
                                              : "text-red-600"
                                          }`}
                                        >
                                          {value ? "Yes" : "No"}
                                          {value ? (
                                            <CheckCircle2 className="h-4 w-4 ml-1" />
                                          ) : (
                                            <AlertTriangle className="h-4 w-4 ml-1" />
                                          )}
                                        </span>
                                      ) : typeof value === "number" ? (
                                        key.includes("ratio") ? (
                                          `${value}x`
                                        ) : (
                                          `${value} km`
                                        )
                                      ) : (
                                        String(value)
                                      )}
                                    </p>
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent className="bg-blue-600 text-white whitespace-pre-line">
                                  <div className="text-xs max-w-xs">
                                    {getCreditCardFieldDescription(key)}
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-blue-100 shadow-lg shadow-blue-50 transition-all duration-500 hover:shadow-blue-100 hover:scale-[1.01] group max-w-full">
                <CardHeader className="border-b border-blue-50 p-4 md:p-6">
                  <CardTitle className="flex items-center text-lg md:text-xl">
                    <ShieldAlert className="h-4 w-4 md:h-5 md:w-5 mr-2 text-red-600 group-hover:scale-110 transition-transform duration-300" />
                    Risk Assessment
                  </CardTitle>
                  <p className="text-xs md:text-sm text-gray-600">
                    Detailed fraud analysis with risk factors
                  </p>
                </CardHeader>
                <CardContent className="p-4 md:p-6">
                  <div className="bg-blue-50 p-4 md:p-6 rounded-xl space-y-4 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-100/20 to-transparent opacity-70"></div>
                    <div className="flex items-center justify-between relative z-10">
                      <div>
                        <p className="text-xs md:text-sm text-gray-500">
                          Risk Level
                        </p>
                        <div className="flex items-center">
                          <AlertTriangle className="h-4 w-4 md:h-5 md:w-5 text-red-500 mr-2" />
                          <p className="text-lg md:text-xl font-bold text-red-600">
                            High
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="bg-white border border-red-200 rounded-full p-1 shadow-inner">
                          <div className="h-12 w-12 md:h-14 md:w-14 rounded-full bg-red-100 flex items-center justify-center relative">
                            <svg className="absolute inset-0 w-full h-full">
                              <circle
                                cx="50%"
                                cy="50%"
                                r="45%"
                                fill="none"
                                stroke="#fee2e2"
                                strokeWidth="4"
                              />
                              <circle
                                cx="50%"
                                cy="50%"
                                r="45%"
                                fill="none"
                                stroke="#ef4444"
                                strokeWidth="4"
                                strokeDasharray="188.5"
                                strokeDashoffset="0"
                                className="animate-circleFill"
                              />
                            </svg>
                            <p className="text-base md:text-lg font-bold text-red-700 z-10">
                              100%
                            </p>
                          </div>
                        </div>
                        <div className="ml-2 text-center">
                          <p className="text-xs text-gray-500">Fraud</p>
                          <p className="text-xs text-gray-500">Probability</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-3 md:p-4 shadow-sm border border-blue-100 transform transition-all duration-300 hover:shadow-md hover:border-blue-200">
                      <p className="text-xs md:text-sm text-gray-500 mb-2">
                        Recommendation
                      </p>
                      <div className="flex items-start">
                        {/* <AlertTriangle className="h-4 w-4 md:h-5 md:w-5 text-red-500 mr-2 mt-0.5" /> */}
                        <p className="text-sm md:text-base text-gray-800">
                          <span className="font-medium">
                            Manual review required:
                          </span>{" "}
                          This transaction is highly suspicious. Consider
                          contacting the cardholder for confirmation.
                        </p>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-3 md:p-4 shadow-sm border border-red-100 transform transition-all duration-300 hover:border-red-200">
                      <p className="text-xs md:text-sm text-gray-500 mb-2 flex items-center">
                        <AlertTriangle className="h-4 w-4 text-red-500 mr-1" />
                        Risk Factors
                      </p>
                      <ul className="space-y-2 mt-2">
                        {[
                          "Transaction performed far from home location",
                          "Unusual distance from last transaction",
                          "Transaction value significantly higher than usual (10x)",
                          "Chip card not used (less secure)",
                          "PIN not used (less secure)",
                          "Online transaction (higher risk)",
                        ].map((item, index) => (
                          <li
                            key={index}
                            className="flex items-start transform transition-all duration-300 hover:translate-x-1"
                          >
                            <div className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0 mr-2">
                              <AlertTriangle className="h-4 w-4 text-red-500" />
                            </div>
                            <p className="text-sm md:text-base text-gray-800">
                              {item}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-white rounded-lg p-3 md:p-4 shadow-sm border border-green-100 transform transition-all duration-300 hover:border-green-200">
                      <p className="text-xs md:text-sm text-gray-500 mb-2 flex items-center">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-1" />
                        Protective Factors
                      </p>
                      <div className="flex items-center mt-2 transform transition-all duration-300 hover:translate-x-1">
                        <div className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0 mr-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        </div>
                        <p className="text-sm md:text-base text-gray-800">
                          Transaction at frequently visited retailer
                        </p>
                      </div>
                    </div>

                    <div className="bg-amber-50 rounded-lg p-3 md:p-4 shadow-sm border border-amber-100">
                      <div className="flex items-start">
                        {/* <InfoIcon className="h-4 w-4 mr-2 mt-0.5 text-amber-600" /> */}
                        <p className="text-xs md:text-sm text-amber-800">
                          Our system uses machine learning to detect unusual
                          behavior patterns in credit card transactions. When
                          multiple risk factors are present, we recommend
                          additional verification steps.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent
            value="sentiment-analysis"
            className="animate-fadeIn mt-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border border-blue-100 shadow-lg shadow-blue-50 transition-all duration-500 hover:shadow-blue-100 hover:scale-[1.01] group max-w-full">
                <CardHeader className="border-b border-blue-50 p-4 md:p-6">
                  <CardTitle className="flex items-center text-lg md:text-xl">
                    <LineChart className="h-4 w-4 md:h-5 md:w-5 mr-2 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
                    Financial News Headline
                  </CardTitle>
                  <p className="text-xs md:text-sm text-gray-600">
                    Analyze market sentiment from financial news headlines
                  </p>
                </CardHeader>
                <CardContent className="p-4 md:p-6 space-y-4">
                  <div className="bg-blue-50 p-4 md:p-6 rounded-xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-100/20 to-transparent opacity-70"></div>
                    <div className="relative z-10">
                      <div className="bg-white rounded-lg p-3 md:p-4 shadow-sm border border-blue-100 transform transition-all duration-300 hover:shadow-md hover:border-blue-200">
                        <div className="flex justify-between items-center mb-2">
                          <p className="text-xs md:text-sm text-gray-500">
                            Sample Headline
                          </p>
                          <Badge
                            variant="outline"
                            className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                          >
                            Auto-captured
                          </Badge>
                        </div>
                        <p className="text-sm md:text-base font-medium text-gray-900">
                          {newsHeadlineSample}
                        </p>
                      </div>
                      <div className="mt-4 flex items-center text-xs md:text-sm text-gray-500">
                        <InfoIcon className="h-4 w-4 mr-1 text-blue-500" />
                        <p>
                          Headlines are automatically collected from major
                          financial news sources
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-indigo-50 rounded-lg p-3 md:p-4 shadow-sm border border-indigo-100">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-2 h-6 bg-indigo-600 rounded-full"></div>
                      <p className="font-medium text-sm md:text-base text-indigo-900">
                        How it works
                      </p>
                    </div>
                    <ol className="text-xs md:text-sm text-gray-700 ml-4 list-decimal space-y-1">
                      <li>
                        Our system continuously monitors major financial news
                        sources
                      </li>
                      <li>
                        Headlines are automatically captured and processed in
                        real-time
                      </li>
                      <li>
                        Natural language processing analyzes sentiment and
                        potential market impact
                      </li>
                      <li>
                        Results are delivered instantly with actionable insights
                      </li>
                    </ol>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-blue-100 shadow-lg shadow-blue-50 transition-all duration-500 hover:shadow-blue-100 hover:scale-[1.01] group max-w-full">
                <CardHeader className="border-b border-blue-50 p-4 md:p-6">
                  <CardTitle className="flex items-center text-lg md:text-xl">
                    <LineChart className="h-4 w-4 md:h-5 md:w-5 mr-2 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
                    Sentiment Analysis
                  </CardTitle>
                  <p className="text-xs md:text-sm text-gray-600">
                    AI-powered sentiment analysis with market impact assessment
                  </p>
                </CardHeader>
                <CardContent className="p-4 md:p-6">
                  <div className="bg-blue-50 p-4 md:p-6 rounded-xl space-y-4 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-100/30 to-transparent opacity-70"></div>
                    <div className="flex items-center justify-between relative z-10">
                      <div>
                        <p className="text-xs md:text-sm text-gray-500">
                          Primary Sentiment
                        </p>
                        <div className="flex items-center">
                          <div className="h-4 w-4 bg-red-400 rounded-full mr-2"></div>
                          <p className="text-lg md:text-xl font-bold text-red-500 capitalize">
                            Negative
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="bg-white border border-gray-200 rounded-full p-1 shadow-inner">
                          <div className="h-12 w-12 md:h-14 md:w-14 rounded-full bg-gray-100 flex items-center justify-center relative">
                            <svg className="absolute inset-0 w-full h-full">
                              <circle
                                cx="50%"
                                cy="50%"
                                r="45%"
                                fill="none"
                                stroke="#e5e7eb"
                                strokeWidth="4"
                              />
                              <circle
                                cx="50%"
                                cy="50%"
                                r="45%"
                                fill="none"
                                stroke="#ff0000"
                                strokeWidth="4"
                                strokeDasharray="188.5"
                                strokeDashoffset="56.55"
                                transform="rotate(-90 50% 50%)"
                                className="animate-dashOffset"
                              />
                            </svg>
                            <p className="text-base md:text-lg font-bold text-gray-700 z-10">
                              52%
                            </p>
                          </div>
                        </div>
                        <div className="ml-2 text-center">
                          <p className="text-xs text-gray-500">Confidence</p>
                          <p className="text-xs text-gray-500">Level</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-3 md:p-4 shadow-sm border border-blue-100 transform transition-all duration-300 hover:shadow-md hover:border-blue-200">
                      <p className="text-xs md:text-sm text-gray-500 mb-2">
                        Sentiment Distribution
                      </p>
                      <div className="bg-gray-50 rounded-lg p-2">
                        <div className="flex h-6 md:h-8 rounded-md overflow-hidden">
                          <div
                            className="bg-red-500 h-full transition-all duration-1000 flex items-center justify-center text-xs font-medium text-white"
                            style={{ width: "52%" }}
                          >
                            52%
                          </div>
                          <div
                            className="bg-gray-400 h-full transition-all duration-1000 flex items-center justify-center text-xs font-medium text-white"
                            style={{ width: "33%" }}
                          >
                            33%
                          </div>
                          <div
                            className="bg-green-500 h-full transition-all duration-1000 flex items-center justify-center text-xs font-medium text-white"
                            style={{ width: "15%" }}
                          >
                            15%
                          </div>
                        </div>
                        <div className="flex justify-between mt-1 px-1 text-xs text-gray-500">
                          <span>Negative</span>
                          <span>Neutral</span>
                          <span>Positive</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-3 md:p-4 shadow-sm border border-blue-100 transform transition-all duration-300 hover:shadow-md hover:border-blue-200">
                      <p className="text-xs md:text-sm text-gray-500 mb-2">
                        Risk Assessment
                      </p>
                      <div className="flex items-center mb-2">
                        <div className="h-4 w-4 bg-red-500 rounded-full mr-2"></div>
                        <p className="text-sm md:text-base text-gray-800 font-medium">
                          Low Risk (0.93 score)
                        </p>
                      </div>
                      <div className="bg-red-50 rounded-lg p-2 md:p-3 text-xs md:text-sm text-gray-600 border border-red-100">
                        This content presents minimal financial risk. The
                        sentiment is relatively clear and unlikely to cause
                        significant market reactions.
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-3 md:p-4 shadow-sm border border-blue-100 transform transition-all duration-300 hover:shadow-md hover:border-blue-200">
                      <p className="text-xs md:text-sm text-gray-500 mb-2">
                        Market Impact
                      </p>
                      <div className="flex items-center mb-2">
                        <div className="h-4 w-4 bg-gray-500 rounded-full mr-2"></div>
                        <p className="text-sm md:text-base text-gray-800 font-medium">
                          Minimal Impact (2.1 score)
                        </p>
                      </div>
                      <div className="relative">
                        <div className="w-full h-2 bg-gray-200 rounded-full mb-2">
                          <div
                            className="h-full bg-gray-500 rounded-full transition-all duration-1000"
                            style={{ width: "21%" }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Low</span>
                          <span>Medium</span>
                          <span>High</span>
                        </div>
                      </div>
                      <p className="text-xs md:text-sm text-gray-600 mt-2 bg-blue-50 p-2 md:p-3 rounded-lg border border-blue-100">
                        Likely to have negligible effect on market sentiment or
                        asset prices. Minimal price movement expected across
                        related assets.
                      </p>
                    </div>

                    <div className="bg-white rounded-lg p-3 md:p-4 shadow-sm border border-blue-100 transform transition-all duration-300 hover:shadow-md hover:border-blue-200">
                      <p className="text-xs md:text-sm text-gray-500 mb-2 flex items-center">
                        {/* <CheckCircle2 className="h-4 w-4 text-blue-500 mr-1" /> */}
                        Recommended Actions
                      </p>
                      <ul className="space-y-2">
                        {[
                          "Continue monitoring for sentiment changes",
                          "Include in routine analysis but no immediate action required",
                          "Consider as supplementary information for existing strategies",
                          "Review stop-loss levels on related positions",
                          "Monitor for additional confirming signals before taking action",
                          "Schedule regular monitoring of related financial indicators",
                          "Review this analysis alongside technical indicators and market fundamentals",
                          "Assess portfolio alignment with the identified sentiment direction",
                        ].map((item, index) => (
                          <li
                            key={index}
                            className="flex items-start transform transition-all duration-300 hover:translate-x-1 group"
                          >
                            <div className="flex-shrink-0 h-5 w-5 md:h-6 md:w-6 flex items-center justify-center mr-2">
                              <CheckCircle2 className="h-4 w-4 text-blue-500" />
                            </div>
                            <p className="text-sm md:text-base text-gray-800">
                              {item}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </MotionDiv>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes circleFill {
          0% {
            stroke-dashoffset: 188.5;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }

        @keyframes dashOffset {
          0% {
            stroke-dashoffset: 188.5;
          }
          100% {
            stroke-dashoffset: 56.55;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }

        .animate-circleFill {
          animation: circleFill 1.5s ease-out forwards;
        }

        .animate-dashOffset {
          animation: dashOffset 1.5s ease-out forwards;
        }
      `}</style>
    </MotionSection>
  );
}

function InfoIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  );
}

function getGeneralFraudFieldDescription(key: string) {
  const descriptions: Record<string, string> = {
    type: "Type of transaction (e.g., PAYMENT, TRANSFER, WITHDRAWAL)",
    amount: "Transaction amount in the local currency",
    oldbalanceOrg: "Original account balance before the transaction",
    newbalanceOrig: "New account balance after the transaction",
    oldbalanceDest: "Recipient account balance before the transaction",
    newbalanceDest: "Recipient account balance after the transaction",
  };
  return descriptions[key] || "Transaction detail";
}

function getCreditCardFieldDescription(key: string) {
  const descriptions: Record<string, string> = {
    distance_from_home:
      "Distance of transaction location from cardholder's home address in kilometers",
    distance_from_last_transaction:
      "Distance from the location of the previous transaction in kilometers",
    ratio_to_median_purchase_price:
      "How many times larger this purchase is compared to the user's median transaction",
    repeat_retailer:
      "Whether the transaction occurred at a frequently visited retailer",
    used_chip:
      "Whether the transaction used the more secure chip technology rather than magnetic stripe",
    used_pin_number:
      "Whether a PIN was used for the transaction (more secure than signature)",
    online_order:
      "Whether the transaction was made online (typically higher risk)",
  };
  return descriptions[key] || "Transaction detail";
}

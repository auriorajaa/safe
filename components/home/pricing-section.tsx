"use client";

import { containerVariants, faqs, itemVariants, PriceType, pricingPlans } from "@/lib/constants";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  CheckIcon,
  XIcon,
  ShieldCheck,
  HelpCircle,
  CreditCard,
  BarChart,
  MessageSquare,
  Users,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import CTA from "../common/cta";
import { MotionDiv, MotionSection } from "../common/motion-wrapper";

type PlanFeature = {
  name: string;
  basic: boolean;
  pro: boolean;
  description?: string;
};

const featureComparison: PlanFeature[] = [
  {
    name: "Credit card fraud detection",
    basic: true,
    pro: true,
    description:
      "Detect potentially fraudulent credit card transactions using our AI models",
  },
  {
    name: "Transaction fraud detection",
    basic: true,
    pro: true,
    description: "Identify suspicious patterns in financial transactions",
  },
  {
    name: "Sentiment analysis",
    basic: false,
    pro: true,
    description: "Analyze sentiment from financial news and market data",
  },
  {
    name: "AI chatbot assistant",
    basic: false,
    pro: true,
    description: "Get insights and answers from our financial AI assistant",
  },
  {
    name: "Email support",
    basic: true,
    pro: true,
  },
  {
    name: "24/7 priority support",
    basic: false,
    pro: true,
    description: "Get help whenever you need it with dedicated support",
  },
  {
    name: "Basic analytics dashboard",
    basic: true,
    pro: true,
  },
  {
    name: "Advanced analytics",
    basic: false,
    pro: true,
    description: "Deeper insights and trend analysis for your financial data",
  },
  {
    name: "Monthly reports",
    basic: true,
    pro: true,
  },
  // {
  //   name: "Real-time alerts",
  //   basic: false,
  //   pro: true,
  //   description: "Immediate notifications for critical events",
  // },
  // {
  //   name: "API access",
  //   basic: false,
  //   pro: true,
  //   description: "Integrate our tools directly into your systems",
  // },
];

const PricingCard = ({
  name,
  price,
  description,
  items,
  id,
  paymentLink,
  popular,
}: PriceType) => {
  return (
    <div className="relative w-full max-w-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div
        className={cn(
          "relative flex flex-col h-full p-6 space-y-5 border rounded-xl bg-white shadow",
          popular ? "border-blue-600 border-2" : "border-gray-200"
        )}
      >
        {/* Badge for popular plan */}
        {popular && (
          <div className="absolute right-4 top-4 bg-blue-600 text-white px-3 py-1 text-sm font-semibold rounded-full">
            Most Popular
          </div>
        )}

        {/* Plan name and description */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck
              className={cn(
                "h-5 w-5",
                id === "basic" ? "text-gray-500" : "text-blue-600"
              )}
            />
            <p className="text-xl font-bold">{name}</p>
          </div>
          <p className="text-sm text-gray-600">{description}</p>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-1">
          <p className="text-3xl font-bold text-gray-900">${price}</p>
          <span className="text-sm text-gray-500">/month</span>
        </div>

        {/* Features list */}
        <ul className="space-y-2 flex-1">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <CheckIcon
                size={16}
                className="text-blue-600 flex-shrink-0 mt-1"
              />
              <span className="text-sm text-gray-700">{item}</span>
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        <Link
          href={paymentLink}
          className={cn(
            "w-full rounded-lg flex items-center justify-center gap-1 py-3 text-base font-medium transition-all duration-200 shadow-sm hover:shadow",
            id === "basic"
              ? "bg-white text-blue-600 border border-blue-600 hover:bg-blue-50"
              : "bg-blue-600 text-white hover:bg-blue-700"
          )}
        >
          Get Started <ArrowRight size={16} />
        </Link>

        {/* Money-back guarantee */}
        <p className="text-xs text-gray-500 text-center">
          30-day money-back guarantee
        </p>
      </div>
    </div>
  );
};

const FeatureRow = ({ feature }: { feature: PlanFeature }) => {
  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      <td className="px-4 py-3 text-left text-sm font-medium text-gray-700">
        <div>
          <p>{feature.name}</p>
          {feature.description && (
            <p className="text-xs text-gray-500 mt-1">{feature.description}</p>
          )}
        </div>
      </td>
      <td className="px-4 py-3 text-center">
        {feature.basic ? (
          <CheckIcon size={18} className="text-blue-600 mx-auto" />
        ) : (
          <XIcon size={18} className="text-gray-400 mx-auto" />
        )}
      </td>
      <td className="px-4 py-3 text-center bg-blue-50/30">
        {feature.pro ? (
          <CheckIcon size={18} className="text-blue-600 mx-auto" />
        ) : (
          <XIcon size={18} className="text-gray-400 mx-auto" />
        )}
      </td>
    </tr>
  );
};

const FAQ = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full py-3 text-left"
      >
        <h3 className="text-base font-medium text-gray-900 flex items-center gap-2">
          <HelpCircle size={16} className="text-blue-600" />
          {question}
        </h3>
        {isOpen ? (
          <ChevronUp size={16} className="text-blue-600" />
        ) : (
          <ChevronDown size={16} className="text-blue-600" />
        )}
      </button>
      {isOpen && (
        <div className="pb-3 text-sm text-gray-600">
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
};

export default function PricingSection() {
  const [viewComparison, setViewComparison] = useState(false);

  return (
    <MotionSection
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-white py-16"
      id="pricing"
    >
      <MotionDiv variants={itemVariants} className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium mb-3">
            Pricing
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-4">
            Simple, <span className="text-blue-600">Transparent Pricing</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose the plan that fits your needs. All plans include our core
            fraud detection technology.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="flex flex-col md:flex-row justify-center items-center md:items-stretch gap-8 mb-12">
          {pricingPlans.map((plan) => (
            <PricingCard key={plan.id} {...plan} />
          ))}
        </div>

        {/* Feature comparison section */}
        <div className="mb-16">
          <div className="text-center mb-6">
            <button
              onClick={() => setViewComparison(!viewComparison)}
              className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium text-base transition-colors"
            >
              {viewComparison ? (
                <>
                  Hide Feature Comparison <ChevronUp size={16} />
                </>
              ) : (
                <>
                  Compare Features <ChevronDown size={16} />
                </>
              )}
            </button>
          </div>

          {viewComparison && (
            <div className="overflow-x-auto mb-8">
              <div className="inline-block min-w-full rounded-lg overflow-hidden border border-gray-200">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/2">
                        Feature
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                        <div className="flex flex-col items-center">
                          <span>Basic</span>
                          <span className="text-blue-600 font-normal">
                            $10/month
                          </span>
                        </div>
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4 bg-blue-50/30">
                        <div className="flex flex-col items-center">
                          <span>Pro</span>
                          <span className="text-blue-600 font-normal">
                            $25/month
                          </span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {featureComparison.map((feature, idx) => (
                      <FeatureRow key={idx} feature={feature} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Key features section */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900">Key Features</h3>
            <p className="text-gray-600 mt-2">
              Our powerful tools help protect your financial transactions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
              <CreditCard className="h-8 w-8 text-blue-600 mb-3" />
              <h4 className="text-lg font-semibold mb-2">
                Credit Card Fraud Detection
              </h4>
              <p className="text-sm text-gray-600">
                Identify and prevent fraudulent credit card transactions with
                our advanced AI algorithms.
              </p>
            </div>

            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
              <ShieldCheck className="h-8 w-8 text-blue-600 mb-3" />
              <h4 className="text-lg font-semibold mb-2">
                Transaction Security
              </h4>
              <p className="text-sm text-gray-600">
                Detect suspicious patterns in financial transactions to protect
                your business.
              </p>
            </div>

            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
              <BarChart className="h-8 w-8 text-blue-600 mb-3" />
              <h4 className="text-lg font-semibold mb-2">Sentiment Analysis</h4>
              <p className="text-sm text-gray-600">
                Get insights from financial news with our advanced sentiment
                analysis tools.
              </p>
              <p className="text-xs text-blue-600 mt-2">Pro plan only</p>
            </div>

            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
              <MessageSquare className="h-8 w-8 text-blue-600 mb-3" />
              <h4 className="text-lg font-semibold mb-2">AI Chatbot</h4>
              <p className="text-sm text-gray-600">
                Get financial advice and insights from our AI-powered assistant.
              </p>
              <p className="text-xs text-blue-600 mt-2">Pro plan only</p>
            </div>
          </div>
        </div>

        {/* FAQ section */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900">
              Frequently Asked Questions
            </h3>
          </div>

          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            {faqs.map((faq, idx) => (
              <FAQ key={idx} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>

        {/* CTA */}
        <CTA />
      </MotionDiv>
    </MotionSection>
  );
}

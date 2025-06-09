import { isDev } from "./helpers";

export type PriceType = {
  name: string;
  price: number;
  description: string;
  items: string[];
  id: string;
  paymentLink: string;
  popular?: boolean;
  priceId: string;
};

export const pricingPlans: PriceType[] = [
  {
    name: "Basic",
    price: 10,
    description: "For individuals and small businesses",
    items: [
      "Credit card fraud detection",
      "Transaction fraud detection",
      "Email support",
      "Basic analytics dashboard",
      "Monthly reports",
    ],
    id: "basic",
    paymentLink: isDev
      ? "https://buy.stripe.com/test_dR629o7jPfxb8bS3cc"
      : "https://buy.stripe.com/test_dR629o7jPfxb8bS3cc",
    priceId: isDev
      ? "price_1RI02oQgkFzZQF2nvXMBG49i"
      : "price_1RI02oQgkFzZQF2nvXMBG49i",
  },
  {
    name: "Pro",
    price: 25,
    description: "For growing businesses with advanced needs",
    items: [
      "All Basic features",
      "Advanced fraud detection models",
      "Sentiment analysis from financial headline news",
      "AI chatbot assistant",
      "24/7 priority support",
    ],
    id: "pro",
    paymentLink: isDev
      ? "https://buy.stripe.com/test_7sI5lAeMh3Ot77O145"
      : "https://buy.stripe.com/test_7sI5lAeMh3Ot77O145",
    popular: true,
    priceId: isDev
      ? "price_1RI02oQgkFzZQF2n0OJZdLvD"
      : "price_1RI02oQgkFzZQF2n0OJZdLvD",
  },
];

export const faqs = [
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards, including Visa, Mastercard, American Express, and Discover. All payments are processed securely through Stripe.",
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer:
      "Yes, you can cancel your subscription at any time. Your service will remain active until the end of your current billing cycle.",
  },
  {
    question: "Is there a free trial available?",
    answer:
      "We currently don't offer a free trial, but we do provide a 30-day money-back guarantee if our service doesn't meet your expectations.",
  },
  {
    question: "How do I upgrade from Basic to Pro?",
    answer:
      "You can easily upgrade your plan from your account dashboard. The change will be applied immediately, with prorated billing adjustments.",
  },
  {
    question: "What kind of support do you provide?",
    answer:
      "Basic plans include email support with 24-hour response time. Pro plans enjoy 24/7 priority support with a 1-hour response time guarantee.",
  },
  {
    question: "Can I get a demo before purchasing?",
    answer:
      "Yes! We offer free 30-minute demo sessions for both plans. Contact our sales team to schedule your personalized demo.",
  },
];

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    transition: {
      type: "spring",
      damping: 15,
      stiffness: 50,
      duration: 0.9,
    },
  },
};

export const buttonVariants = {
  scale: 1.05,
  transition: {
    type: "spring",
    stiffness: 300,
    damping: 10,
  },
};

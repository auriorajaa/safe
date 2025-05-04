// components/dashboard/detection-summary.tsx
import { DetectionSummary } from "@/lib/types";
import { Shield, ShieldOff, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

interface DetectionSummaryProps {
  summary: DetectionSummary | null;
  layout?: "vertical" | "horizontal";
}

export default function DetectionSummaryComponent({
  summary,
  layout = "vertical",
}: DetectionSummaryProps) {
  if (!summary) {
    return <div className="text-center py-4 text-sm">No data available</div>;
  }

  // Animation variants for numbers
  const numberVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.8, opacity: 0 },
  };

  if (layout === "horizontal") {
    return (
      <>
        {/* Total Detections */}
        <motion.div
          className="bg-white border rounded-md p-4 flex items-center"
          whileHover={{ y: -2, boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)" }}
          transition={{ duration: 0.2 }}
        >
          <div className="bg-blue-50 rounded-full p-2 mr-3">
            <Shield className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <div className="text-md text-black font-semibold">
              Total Detections
            </div>
            <motion.div
              key={`total-${summary.totalDetections}`}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={numberVariants}
              transition={{ duration: 0.3 }}
              className="text-xl font-semibold"
            >
              {summary.totalDetections}
            </motion.div>
          </div>
        </motion.div>

        {/* Fraud Cases */}
        <motion.div
          className="bg-white border rounded-md p-4 flex items-center"
          whileHover={{ y: -2, boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)" }}
          transition={{ duration: 0.2 }}
        >
          <div className="bg-red-50 rounded-full p-2 mr-3">
            <ShieldOff className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <div className="text-md text-black font-semibold">Fraud Cases</div>
            <motion.div
              key={`fraud-${summary.fraudCases}`}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={numberVariants}
              transition={{ duration: 0.3 }}
              className="text-xl font-semibold"
            >
              {summary.fraudCases}
            </motion.div>
            <div className="text-xs text-gray-500">
              {summary.totalDetections > 0
                ? `${Math.round(
                    (summary.fraudCases / summary.totalDetections) * 100
                  )}%`
                : "0%"}
            </div>
          </div>
        </motion.div>

        {/* Legitimate Cases */}
        <motion.div
          className="bg-white border rounded-md p-4 flex items-center"
          whileHover={{ y: -2, boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)" }}
          transition={{ duration: 0.2 }}
        >
          <div className="bg-green-50 rounded-full p-2 mr-3">
            <ShieldCheck className="w-5 h-5 text-green-500" />
          </div>
          <div>
            <div className="text-md text-black font-semibold">
              Legitimate Cases
            </div>
            <motion.div
              key={`legitimate-${summary.legitimateCases}`}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={numberVariants}
              transition={{ duration: 0.3 }}
              className="text-xl font-semibold"
            >
              {summary.legitimateCases}
            </motion.div>
            <div className="text-xs text-gray-500">
              {summary.totalDetections > 0
                ? `${Math.round(
                    (summary.legitimateCases / summary.totalDetections) * 100
                  )}%`
                : "0%"}
            </div>
          </div>
        </motion.div>
      </>
    );
  }

  // Default vertical layout
  return (
    <div className="space-y-3">
      <motion.div
        className="bg-blue-50 p-3 rounded-md flex items-center justify-between"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <div>
          <div className="text-xs text-gray-500">Total Detections</div>
          <motion.div
            key={`total-v-${summary.totalDetections}`}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={numberVariants}
            transition={{ duration: 0.3 }}
            className="text-lg font-semibold"
          >
            {summary.totalDetections}
          </motion.div>
        </div>
        <Shield className="w-8 h-8 text-blue-600" />
      </motion.div>

      <motion.div
        className="bg-red-50 p-3 rounded-md flex items-center justify-between"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <div>
          <div className="text-xs text-gray-500">Fraud Cases</div>
          <motion.div
            key={`fraud-v-${summary.fraudCases}`}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={numberVariants}
            transition={{ duration: 0.3 }}
            className="text-lg font-semibold"
          >
            {summary.fraudCases}
          </motion.div>
          <div className="text-xs text-gray-500">
            {summary.totalDetections > 0
              ? `${Math.round(
                  (summary.fraudCases / summary.totalDetections) * 100
                )}%`
              : "0%"}
          </div>
        </div>
        <ShieldOff className="w-8 h-8 text-red-500" />
      </motion.div>

      <motion.div
        className="bg-green-50 p-3 rounded-md flex items-center justify-between"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <div>
          <div className="text-xs text-gray-500">Legitimate Cases</div>
          <motion.div
            key={`legitimate-v-${summary.legitimateCases}`}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={numberVariants}
            transition={{ duration: 0.3 }}
            className="text-lg font-semibold"
          >
            {summary.legitimateCases}
          </motion.div>
          <div className="text-xs text-gray-500">
            {summary.totalDetections > 0
              ? `${Math.round(
                  (summary.legitimateCases / summary.totalDetections) * 100
                )}%`
              : "0%"}
          </div>
        </div>
        <ShieldCheck className="w-8 h-8 text-green-500" />
      </motion.div>
    </div>
  );
}

// components/dashboard/dashboard.tsx
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DetectionSummary, DetectionRecord } from "@/lib/types";
import DetectionHistory from "./detection-history";
import { ShieldCheck, LayoutDashboard } from "lucide-react";
import {
  getUserDetectionSummary,
  getUserDetectionHistory,
} from "@/app/actions/dashboard/dashboard-actions";
import DetectionSummaryComponent from "./detection-summary";
import { AnimatePresence, motion } from "framer-motion";

interface DashboardProps {
  userEmail: string;
}

export default function Dashboard({ userEmail }: DashboardProps) {
  const [summary, setSummary] = useState<DetectionSummary | null>(null);
  const [detections, setDetections] = useState<DetectionRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        const summaryData = await getUserDetectionSummary(userEmail);
        const detectionData = await getUserDetectionHistory(userEmail);

        setSummary(summaryData);
        setDetections(detectionData);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, [userEmail]);

  // Handle record deletion and update summary accordingly
  const handleDeleteRecord = (id: string, isFraud: boolean) => {
    // Update the detections list
    setDetections((currentDetections) =>
      currentDetections.filter((detection) => detection.id !== id)
    );

    // Update the summary counters
    if (summary) {
      setSummary({
        totalDetections: summary.totalDetections - 1,
        fraudCases: isFraud ? summary.fraudCases - 1 : summary.fraudCases,
        legitimateCases: !isFraud
          ? summary.legitimateCases - 1
          : summary.legitimateCases,
      });
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white p-4 mb-3">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center gap-2 mb-1">
            <LayoutDashboard className="h-5 w-5 text-blue-600" />
            <h1 className="text-xl font-semibold">Dashboard</h1>
          </div>
          <p className="text-sm text-gray-500">
            Overview of your fraud detection activities
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 max-w-7xl pb-8">
        {/* Stats Cards Row */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`summary-${summary?.totalDetections ?? 0}`}
            initial={{ opacity: 0.8, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0.8, y: -5 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
          >
            {loading ? (
              <div className="md:col-span-3 h-20 flex justify-center items-center">
                <p className="text-gray-500 text-sm">Loading summary data...</p>
              </div>
            ) : (
              <DetectionSummaryComponent
                summary={summary}
                layout="horizontal"
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Detection History Section */}
        <Card className="border-gray-200 shadow-white rounded-md">
          <CardHeader className="">
            <CardTitle className="text-lg flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-blue-600" />
              Detection History
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-4">
            {loading ? (
              <div className="flex justify-center items-center h-24">
                <p className="text-gray-500 text-sm">
                  Loading detection history...
                </p>
              </div>
            ) : (
              <DetectionHistory
                detections={detections}
                onDeleteRecord={handleDeleteRecord}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

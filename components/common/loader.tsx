import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

export default function Loader() {
  useEffect(() => {
    // Disable scroll
    document.body.style.overflow = "hidden";
    return () => {
      // Re-enable scroll when component unmounts
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background px-4">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <Card className="p-6 rounded-2xl text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-14 h-14 mt-4 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
          <CardContent className="space-y-2">
            <h2 className="text-xl font-semibold">Please wait...</h2>
            <p className="text-muted-foreground text-sm">
              We’re preparing something great for you. This page is currently
              loading — it will be ready in just a moment.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

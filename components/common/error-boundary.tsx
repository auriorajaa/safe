"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex items-center justify-center min-h-screen px-4 bg-background">
            <motion.div
              className="w-full max-w-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="p-6 text-center shadow-xl rounded-2xl space-y-4">
                <div className="flex justify-center text-red-600">
                  <AlertTriangle size={48} />
                </div>
                <CardContent className="space-y-2">
                  <h2 className="text-2xl font-semibold">
                    Oops! Something went wrong.
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    We encountered an unexpected error. Please try refreshing
                    the page or come back later.
                  </p>
                  <Button onClick={this.handleReload} className="mt-4">
                    Refresh Page
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

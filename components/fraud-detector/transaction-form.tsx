// components/fraud-detector/transaction-form.tsx
"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Loader2, Clock } from "lucide-react";

type TransactionType =
  | "CASH_IN"
  | "CASH_OUT"
  | "DEBIT"
  | "PAYMENT"
  | "TRANSFER";

interface TransactionFormProps {
  onSubmit: (formData: {
    step: number;
    type: TransactionType;
    amount: number;
    oldbalanceOrg: number;
    newbalanceOrig: number;
    oldbalanceDest: number;
    newbalanceDest: number;
    isFlaggedFraud: number;
  }) => void;
  loading: boolean;
}

// Storage keys
const COOLDOWN_END_KEY = "transaction_cooldown_end";
const COOLDOWN_DURATION = 30; // seconds

export default function TransactionForm({
  onSubmit,
  loading,
}: TransactionFormProps) {
  const [formData, setFormData] = useState({
    step: "1",
    type: "TRANSFER" as TransactionType,
    amount: "",
    oldbalanceOrg: "",
    newbalanceOrig: "",
    oldbalanceDest: "",
    newbalanceDest: "",
    isFlaggedFraud: "0",
  });

  // Cooldown state
  const [isInCooldown, setIsInCooldown] = useState<boolean>(false);
  const [cooldownSeconds, setCooldownSeconds] = useState<number>(0);

  // Initialize cooldown state from localStorage on component mount
  useEffect(() => {
    const checkStoredCooldown = () => {
      const storedCooldownEnd = localStorage.getItem(COOLDOWN_END_KEY);

      if (storedCooldownEnd) {
        const cooldownEndTime = parseInt(storedCooldownEnd);
        const currentTime = Date.now();

        if (cooldownEndTime > currentTime) {
          // Cooldown is still active
          const remainingSeconds = Math.ceil(
            (cooldownEndTime - currentTime) / 1000
          );
          setIsInCooldown(true);
          setCooldownSeconds(remainingSeconds);
        } else {
          // Cooldown has expired, clear it
          localStorage.removeItem(COOLDOWN_END_KEY);
        }
      }
    };

    checkStoredCooldown();
  }, []);

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Set cooldown with persistent storage
    const cooldownEndTime = Date.now() + COOLDOWN_DURATION * 1000;
    localStorage.setItem(COOLDOWN_END_KEY, cooldownEndTime.toString());

    setIsInCooldown(true);
    setCooldownSeconds(COOLDOWN_DURATION);

    const parsedData = {
      step: parseInt(formData.step) || 1,
      type: formData.type,
      amount: parseFloat(formData.amount) || 0,
      oldbalanceOrg: parseFloat(formData.oldbalanceOrg) || 0,
      newbalanceOrig: parseFloat(formData.newbalanceOrig) || 0,
      oldbalanceDest: parseFloat(formData.oldbalanceDest) || 0,
      newbalanceDest: parseFloat(formData.newbalanceDest) || 0,
      isFlaggedFraud: parseInt(formData.isFlaggedFraud) || 0,
    };
    onSubmit(parsedData);
  };

  // Cooldown timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isInCooldown && cooldownSeconds > 0) {
      timer = setInterval(() => {
        setCooldownSeconds((prev) => {
          const newValue = prev - 1;
          if (newValue <= 0) {
            setIsInCooldown(false);
            localStorage.removeItem(COOLDOWN_END_KEY);
            clearInterval(timer);
            return 0;
          }
          return newValue;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isInCooldown, cooldownSeconds]);

  // Determine if form should be disabled
  const isFormDisabled = loading || isInCooldown;

  return (
    <form onSubmit={handleFormSubmit}>
      <CardContent
        className={isFormDisabled ? "opacity-60 pointer-events-none" : ""}
      >
        <div className="space-y-4">
          <div className="space-y-2 hidden">
            <Label htmlFor="step">Step</Label>
            <Input
              id="step"
              type="text"
              value={formData.step}
              onChange={(e) => handleChange("step", e.target.value)}
              placeholder="e.g., 1"
              disabled={isFormDisabled}
            />
            <p className="text-xs text-gray-500">
              The time step of the transaction (e.g., hour of the day).
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Transaction Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => handleChange("type", value)}
              disabled={isFormDisabled}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CASH_IN">Cash In</SelectItem>
                <SelectItem value="CASH_OUT">Cash Out</SelectItem>
                <SelectItem value="DEBIT">Debit</SelectItem>
                <SelectItem value="PAYMENT">Payment</SelectItem>
                <SelectItem value="TRANSFER">Transfer</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">
              The type of transaction being performed.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="text"
              value={formData.amount}
              onChange={(e) => handleChange("amount", e.target.value)}
              placeholder="e.g., 100.50"
              disabled={isFormDisabled}
            />
            <p className="text-xs text-gray-500">
              The amount of money involved in the transaction.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="oldbalanceOrg">Origin Initial Balance</Label>
            <Input
              id="oldbalanceOrg"
              type="text"
              value={formData.oldbalanceOrg}
              onChange={(e) => handleChange("oldbalanceOrg", e.target.value)}
              placeholder="e.g., 500.00"
              disabled={isFormDisabled}
            />
            <p className="text-xs text-gray-500">
              The balance in the origin account before the transaction.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="newbalanceOrig">Origin Final Balance</Label>
            <Input
              id="newbalanceOrig"
              type="text"
              value={formData.newbalanceOrig}
              onChange={(e) => handleChange("newbalanceOrig", e.target.value)}
              placeholder="e.g., 399.50"
              disabled={isFormDisabled}
            />
            <p className="text-xs text-gray-500">
              The balance in the origin account after the transaction.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="oldbalanceDest">Destination Initial Balance</Label>
            <Input
              id="oldbalanceDest"
              type="text"
              value={formData.oldbalanceDest}
              onChange={(e) => handleChange("oldbalanceDest", e.target.value)}
              placeholder="e.g., 200.00"
              disabled={isFormDisabled}
            />
            <p className="text-xs text-gray-500">
              The balance in the destination account before the transaction.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="newbalanceDest">Destination Final Balance</Label>
            <Input
              id="newbalanceDest"
              type="text"
              value={formData.newbalanceDest}
              onChange={(e) => handleChange("newbalanceDest", e.target.value)}
              placeholder="e.g., 300.50"
              disabled={isFormDisabled}
            />
            <p className="text-xs text-gray-500">
              The balance in the destination account after the transaction.
            </p>
          </div>

          <div className="space-y-2 hidden">
            <Label htmlFor="isFlaggedFraud">Flagged as Fraud</Label>
            <Input
              id="isFlaggedFraud"
              type="text"
              value={formData.isFlaggedFraud}
              onChange={(e) => handleChange("isFlaggedFraud", e.target.value)}
              placeholder="0 or 1"
              disabled={isFormDisabled}
            />
            <p className="text-xs text-gray-500">
              Indicates if the transaction is initially flagged as fraud (0 =
              No, 1 = Yes).
            </p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col items-end pt-6 px-0 me-5">
        {isInCooldown && (
          <div className="flex items-center text-amber-600 text-sm mb-3">
            <Clock className="h-4 w-4 mr-2" />
            <span>
              You can analyze another transaction in {cooldownSeconds} seconds
            </span>
          </div>
        )}
        <Button
          type="submit"
          disabled={isFormDisabled}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : isInCooldown ? (
            <>
              <Clock className="mr-2 h-4 w-4" />
              Awaiting Confirmation
            </>
          ) : (
            "Detect Fraud"
          )}
        </Button>
      </CardFooter>
    </form>
  );
}

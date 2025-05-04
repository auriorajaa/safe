"use client";

import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import {
  MapPin,
  RefreshCw,
  Tag,
  Store,
  CircuitBoard,
  KeyRound,
  Globe,
  Loader2,
  Clock,
} from "lucide-react";

interface CreditCardFormProps {
  onSubmit: (formData: {
    distance_from_home: number;
    distance_from_last_transaction: number;
    ratio_to_median_purchase_price: number;
    repeat_retailer: boolean;
    used_chip: boolean;
    used_pin_number: boolean;
    online_order: boolean;
  }) => void;
  loading: boolean;
}

// Storage keys
const COOLDOWN_END_KEY = "credit_card_cooldown_end";
const COOLDOWN_DURATION = 30; // seconds

export default function CreditCardForm({
  onSubmit,
  loading,
}: CreditCardFormProps) {
  // Form state
  const [distanceFromHome, setDistanceFromHome] = useState<number>(5);
  const [distanceFromLastTx, setDistanceFromLastTx] = useState<number>(5);
  const [ratioPurchase, setRatioPurchase] = useState<number>(1);
  const [repeatRetailer, setRepeatRetailer] = useState<boolean>(true);
  const [usedChip, setUsedChip] = useState<boolean>(true);
  const [usedPin, setUsedPin] = useState<boolean>(false);
  const [onlineOrder, setOnlineOrder] = useState<boolean>(false);

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

  // Handle form submission with persistent cooldown
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Set cooldown
    const cooldownEndTime = Date.now() + COOLDOWN_DURATION * 1000;
    localStorage.setItem(COOLDOWN_END_KEY, cooldownEndTime.toString());

    setIsInCooldown(true);
    setCooldownSeconds(COOLDOWN_DURATION);

    onSubmit({
      distance_from_home: distanceFromHome,
      distance_from_last_transaction: distanceFromLastTx,
      ratio_to_median_purchase_price: ratioPurchase,
      repeat_retailer: repeatRetailer,
      used_chip: usedChip,
      used_pin_number: usedPin,
      online_order: onlineOrder,
    });
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
    <form onSubmit={handleSubmit}>
      <CardContent
        className={isFormDisabled ? "opacity-60 pointer-events-none" : ""}
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="distanceFromHome" className="text-sm">
                Distance from Home: {distanceFromHome} km
              </Label>
              <MapPin className="h-4 w-4 text-blue-600" />
            </div>
            <Slider
              id="distanceFromHome"
              value={[distanceFromHome]}
              min={0}
              max={100}
              step={1}
              onValueChange={(value) => setDistanceFromHome(value[0])}
              className="mb-6"
              disabled={isFormDisabled}
            />
            <div className="text-xs text-gray-500">
              Distance between transaction location and cardholder's registered
              address
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="distanceFromLastTx" className="text-sm">
                Distance from Last Transaction: {distanceFromLastTx} km
              </Label>
              <RefreshCw className="h-4 w-4 text-blue-600" />
            </div>
            <Slider
              id="distanceFromLastTx"
              value={[distanceFromLastTx]}
              min={0}
              max={100}
              step={1}
              onValueChange={(value) => setDistanceFromLastTx(value[0])}
              className="mb-6"
              disabled={isFormDisabled}
            />
            <div className="text-xs text-gray-500">
              Distance between this transaction and the previous transaction
              location
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="ratioPurchase" className="text-sm">
                Ratio to Median Purchase: {ratioPurchase.toFixed(1)}x
              </Label>
              <Tag className="h-4 w-4 text-blue-600" />
            </div>
            <Slider
              id="ratioPurchase"
              value={[ratioPurchase]}
              min={0.1}
              max={10}
              step={0.1}
              onValueChange={(value) => setRatioPurchase(value[0])}
              className="mb-6"
              disabled={isFormDisabled}
            />
            <div className="text-xs text-gray-500">
              How much this transaction amount deviates from the cardholder's
              typical spending
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label
                  htmlFor="repeatRetailer"
                  className="text-sm flex items-center"
                >
                  <Store className="h-4 w-4 text-blue-600 mr-2" />
                  Repeat Retailer
                </Label>
                <div className="text-xs text-gray-500">
                  Has the cardholder previously transacted with this merchant?
                </div>
              </div>
              <Switch
                id="repeatRetailer"
                checked={repeatRetailer}
                onCheckedChange={setRepeatRetailer}
                disabled={isFormDisabled}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="usedChip" className="text-sm flex items-center">
                  <CircuitBoard className="h-4 w-4 text-blue-600 mr-2" />
                  Used Chip
                </Label>
                <div className="text-xs text-gray-500">
                  Did the transaction utilize EMV chip technology?
                </div>
              </div>
              <Switch
                id="usedChip"
                checked={usedChip}
                onCheckedChange={setUsedChip}
                disabled={isFormDisabled}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="usedPin" className="text-sm flex items-center">
                  <KeyRound className="h-4 w-4 text-blue-600 mr-2" />
                  Used PIN Number
                </Label>
                <div className="text-xs text-gray-500">
                  Did the transaction require PIN verification?
                </div>
              </div>
              <Switch
                id="usedPin"
                checked={usedPin}
                onCheckedChange={setUsedPin}
                disabled={isFormDisabled}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label
                  htmlFor="onlineOrder"
                  className="text-sm flex items-center"
                >
                  <Globe className="h-4 w-4 text-blue-600 mr-2" />
                  Online Order
                </Label>
                <div className="text-xs text-gray-500">
                  Was the transaction conducted online (card-not-present)?
                </div>
              </div>
              <Switch
                id="onlineOrder"
                checked={onlineOrder}
                onCheckedChange={setOnlineOrder}
                disabled={isFormDisabled}
              />
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col items-end pt-6 px-0 me-4">
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
          className="bg-blue-600 hover:bg-blue-700"
          disabled={isFormDisabled}
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
            "Analyze Transaction"
          )}
        </Button>
      </CardFooter>
    </form>
  );
}

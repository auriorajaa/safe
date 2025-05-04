// lib/types.ts
export interface DetectionSummary {
  totalDetections: number;
  fraudCases: number;
  legitimateCases: number;
}

export interface DetectionRecord {
  id: string;
  detectionType: 'CREDIT_CARD' | 'TRANSACTION';
  isFraud: boolean;
  timestamp: string;
  details: CreditCardDetails | TransactionDetails;
}

export interface CreditCardDetails {
  distanceFromHome: number;
  distanceFromLastTransaction: number;
  ratioToMedianPurchasePrice: number;
  repeatRetailer: boolean;
  usedChip: boolean;
  usedPinNumber: boolean;
  onlineOrder: boolean;
}

export interface TransactionDetails {
  type: string;
  amount: number;
  oldBalanceOrig: number;
  newBalanceOrig: number;
  oldBalanceDest: number;
  newBalanceDest: number;
}
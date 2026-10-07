export interface CarProfile {
  id: string;
  brand: string;
  model: string;
  modelArabic: string;
  year: number;
  engine: string;
  transmission: 'manual' | 'automatic';
  fuelSystem: 'carburetor' | 'mpfi' | 'gdi';
  mileageKm?: number;
}

export interface ManualSourceReference {
  manualName: string;
  section: string;
  page?: number | string;
  chapter?: string;
  quote?: string;
}

export interface SecondarySourceReference {
  type: 'TSB' | 'OBD_DATABASE' | 'OEM_SPEC' | 'FIELD_GUIDE' | 'HAYNES_CHILTON';
  title: string;
  code?: string;
  description: string;
}

export interface DiagnosticCheckItem {
  id: string;
  component: string;
  action: string;
  normalValue: string;
  faultIndicator: string;
  checked?: boolean;
  status?: 'pending' | 'ok' | 'fault';
}

export interface DiagnosticResponse {
  vehicleSummary: {
    model: string;
    year: number;
    engine: string;
    transmission: string;
  };
  detectedSystem: string;
  detectedIntent: 'diagnosis' | 'specification' | 'maintenance' | 'repair';
  primaryDiagnosis: string;
  severityLevel: 'low' | 'medium' | 'high' | 'critical';
  probableCauses: {
    cause: string;
    probability: 'high' | 'medium' | 'low';
    explanation: string;
  }[];
  diagnosticChecks: DiagnosticCheckItem[];
  repairSteps?: string[];
  safetyWarnings: string[];
  exactSpecs: {
    parameter: string;
    value: string;
    unit?: string;
    note?: string;
  }[];
  manualReferences: ManualSourceReference[];
  secondarySources: SecondarySourceReference[];
  mechanicTips: string[];
  preventiveAdvice?: string;
  modEvaluation?: ModEvaluation;
}

export interface ModEvaluation {
  status: 'compatible' | 'conditional' | 'harmful';
  statusText: string;
  verdict: string;
  pros: string[];
  consAndRisks: string[];
  bestRecommendation: string;
  marketOptionsAndPrices: {
    brandOrType: string;
    estimatedPriceRange: string;
    notes: string;
  }[];
}

export interface CarSpecificationCategory {
  title: string;
  icon: string;
  items: {
    label: string;
    value: string;
    tolerance?: string;
    sourcePage?: string;
    warning?: string;
  }[];
}

export interface OBDCodeInfo {
  code: string;
  titleAr: string;
  titleEn: string;
  system: string;
  severity: 'low' | 'medium' | 'high';
  commonSymptoms: string[];
  possibleCauses: string[];
  manualTestSteps: string[];
  relevantSensors: string[];
}

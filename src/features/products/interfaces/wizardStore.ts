import { WizardStep } from "./step";

export interface WizardStore {
    steps: WizardStep[];
    activeStep: number;
    setActiveStep: (step: number) => void;
    nextStep: () => void;
    prevStep: () => void;
    setSteps: (steps: WizardStep[]) => void;
    progressWidth: string;
    setProgressWidth: (width: string) => void;
}
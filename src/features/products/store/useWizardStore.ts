import { create } from "zustand";
import { WizardStore } from "../interfaces/wizardStore";

export const useWizardStore = create<WizardStore>()((set, get) => (
    {
        steps: [],
        activeStep: 0,
        stepClicked: null,
        setStepClicked: (index) => {
            set({
                stepClicked: index,
            });
        },
        setActiveStep: (step) => {
            set({
                activeStep: step,
            });
        },
        nextStep: () => {
            const { steps, activeStep } = get();
            if (activeStep < steps.length - 1) {
                set({
                    activeStep: activeStep + 1,
                });
            }
        },
        prevStep: () => {
            const { activeStep } = get();
            if (activeStep > 0) {
                set({
                    activeStep: activeStep - 1,
                });
            }
        },
        setSteps: (steps) => {
            set({
                steps: steps,
            });
        },
        progressWidth: "0%",
        setProgressWidth: (width) => {
            set({
                progressWidth: width,
            });
        },
    }
))
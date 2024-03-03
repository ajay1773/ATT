import React, { useState } from "react";
import Stepper, { StepperProps } from "~/components/ui/stepper";

// Define the type for form values
type FormValues = {
  [key: string]: any; // Modify this to match your form fields
};

export type StepProps = {
  onNext: (values: FormValues) => void;
  onPrev: () => void;
  onChange: (name: string, value: any) => void;
  formValues: FormValues;
  updateMultiStepFormValues: (values: FormValues) => void;
};

export type WithMultiStepFormPropsType = {
  steps: React.ComponentType<StepProps>[];
  stepperLabels: StepperProps["steps"];
};

const withMultiStepForm = ({
  steps,
  stepperLabels,
}: WithMultiStepFormPropsType) => {
  return () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [formValues, setFormValues] = useState<FormValues>({});

    const handleNext = (values: FormValues) => {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
        setFormValues({ ...formValues, ...values });
      }
    };

    const handlePrev = () => {
      if (currentStep > 0) {
        setCurrentStep(currentStep - 1);
      }
    };

    const handleChange = (name: string, value: any) => {
      setFormValues({ ...formValues, [name]: value });
    };

    const updateMultiStepFormValues = (values: FormValues) => {
      setFormValues({ ...formValues, ...values });
    };

    const CurrentStepComponent = steps[
      currentStep
    ] as React.ComponentType<StepProps>;

    return (
      <div className="flex h-full w-full flex-col justify-between">
        <Stepper steps={stepperLabels} currentStep={currentStep + 1} />
        <CurrentStepComponent
          onNext={(values: FormValues) => handleNext(values)}
          onPrev={handlePrev}
          onChange={handleChange}
          formValues={formValues}
          updateMultiStepFormValues={updateMultiStepFormValues}
        />
      </div>
    );
  };
};

export default withMultiStepForm;

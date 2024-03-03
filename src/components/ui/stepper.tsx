import classNames from "classnames";
import { map } from "lodash";
import { RiCheckFill } from "react-icons/ri";

export type StepperStepType = {
  title: string;
  description?: string;
};

export type StepperProps = {
  steps: StepperStepType[];
  currentStep: number;
};

export default function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <ul className="relative flex flex-col gap-2 md:flex-row">
      {steps.length &&
        map(steps, (step, index) => {
          const countLabel = index + 1;
          const isStepCompleted = countLabel < currentStep;

          const iconClassName = classNames(
            "flex size-8 flex-shrink-0 items-center text-sm justify-center rounded-full font-medium dark:bg-gray-700 dark:text-white",
            {
              "bg-blue-500 text-white": countLabel === currentStep,
              "bg-gray-100 text-gray-800": countLabel > currentStep,
              "bg-green-500 text-white": isStepCompleted,
            },
          );

          return (
            <li
              key={step.title}
              className="group flex flex-1 gap-x-2 md:block md:shrink md:basis-0"
            >
              <div className="flex min-h-7 min-w-7 flex-col items-center align-middle text-xs md:inline-flex md:w-full md:flex-row md:flex-wrap">
                <span className={iconClassName}>
                  {isStepCompleted ? (
                    <RiCheckFill className="text-lg" />
                  ) : (
                    countLabel
                  )}
                </span>
                <div className="mt-2 h-full w-px bg-gray-200 group-last:hidden dark:bg-gray-700 md:ms-2 md:mt-0 md:h-px md:w-full md:flex-1"></div>
              </div>
              <div className="grow pb-5 md:mt-3 md:grow-0">
                <span className="font-lg text-md block font-semibold dark:text-white">
                  {step.title}
                </span>
                <p className="text-sm text-gray-500">{step.description}</p>
              </div>
            </li>
          );
        })}
    </ul>
  );
}

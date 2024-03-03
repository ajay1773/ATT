import withMultiStepForm from "~/hoc/withMultiStepForm";
import EmployeeDetailsForm from "../EmployeeDetailsForm";
import { StepperProps } from "~/components/ui/stepper";
import EmployeeRoleInfoForm from "../EmployeeRoleInfoForm";
import SetUpCredentialsForm from "../SetUpCredentialsForm";

const stepperLabels: StepperProps["steps"] = [
  {
    title: "Personal Details",
  },
  {
    title: "Associates,Role Info and Project",
  },
  {
    title: "Set Up Credentials",
  },
];

const OnBoardEmployeeMultiStepForm = withMultiStepForm({
  steps: [EmployeeDetailsForm, EmployeeRoleInfoForm, SetUpCredentialsForm],
  stepperLabels,
});

export default OnBoardEmployeeMultiStepForm;

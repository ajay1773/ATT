"use client";
import { EmployeesTable } from "~/components/custom/EmployeesTable";
import OnBoardEmployeeMultiStepForm from "~/components/custom/OnBoardEmployeeMultiStepForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

export default function Employees() {
  return (
    <main className="flex h-full w-full flex-col gap-8">
      <div className="flex w-full flex-col">
        <h2 className="mb-2 text-4xl font-bold">Employees</h2>
        <p className="text-md text-gray-600">
          Manage Your Team: Add and View Employee Profiles
        </p>
      </div>
      <div className="flex h-full w-full flex-col ">
        <Tabs defaultValue="add" className="h-full w-full">
          <TabsList className="h-12 px-2">
            <TabsTrigger value="add">Add Employees</TabsTrigger>
            <TabsTrigger value="view">View Employees</TabsTrigger>
          </TabsList>
          <TabsContent value="add" className="h-[calc(100%-56px)]">
            <div
              className={`flex h-full w-full rounded-md border-b bg-white p-6 shadow`}
            >
              <OnBoardEmployeeMultiStepForm />
            </div>
          </TabsContent>
          <TabsContent className="" value="view">
            <EmployeesTable />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}

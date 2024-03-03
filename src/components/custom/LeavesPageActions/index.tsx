"use client";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import ApplyLeaveForm from "../ApplyLeaveForm";
import { useState } from "react";

export default function LeavesPageActions() {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <div className="flex w-full items-center justify-between">
      <div>
        <h2 className="mb-2 text-4xl font-bold">Leaves</h2>
        <p className="text-md text-gray-600">
          Access Your Leave History and Apply for New Leaves
        </p>
      </div>
      <div className="flex gap-2">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger>
            <Button className="bg-blue-500 hover:bg-blue-600">
              Request Leave
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle className="mb-5 text-2xl font-medium">
              Apply for a leave
            </DialogTitle>
            <DialogDescription>
              <ApplyLeaveForm onFormSubmission={() => setOpen(false)} />
            </DialogDescription>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

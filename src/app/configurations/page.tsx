"use client";
import { Button } from "~/components/ui/button";
import { ChangeEvent, useRef, useState } from "react";
import { api } from "~/trpc/react";
import { LoadingSpinner } from "~/components/ui/spinner";
import { ColumnDef } from "@tanstack/react-table";
import { Holidays } from "@prisma/client";
import moment from "moment";
import { DataTable } from "~/components/ui/data-table";
import { TableSkeleton } from "~/components/custom/TableSkeleton";
import { Switch } from "~/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";

const columns: ColumnDef<Holidays>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => <span>{moment(row.getValue("date")).format("LL")}</span>,
  },
];

type Location = { latitude: number; longitude: number } | null;
type ErrorType = string | null;

const officeCoordinatesFormSchema = z.object({
  longitude: z.number({ required_error: "Longitude Required!" }),
  latitude: z.number({ required_error: "Latitude Required!" }),
});

type TOfficeCoordinatesFormSchema = z.infer<typeof officeCoordinatesFormSchema>;

export default function ConfigurationsPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [location, setLocation] = useState<Location>(null);
  const [error, setError] = useState<ErrorType>(null);

  const form = useForm<TOfficeCoordinatesFormSchema>({
    resolver: zodResolver(officeCoordinatesFormSchema),
    defaultValues: {
      longitude: undefined,
      latitude: undefined,
    },
  });

  const { data: holidaysInYear, isLoading } =
    api.holidays.getHolidaysForTimePeriod.useQuery<Holidays[]>(
      {
        startTime: moment().startOf("year").toDate(),
        endTime: moment().endOf("year").toDate(),
      },
      { refetchOnWindowFocus: false },
    );
  const mutation = api.holidays.uploadPublicHolidaysCSV.useMutation();

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] as File;
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = async () => {
      if (reader.result) {
        const base64String = reader.result.toString().split(",")[1] as string;
        mutation.mutateAsync({ byte64ArrayString: base64String });
      }
    };
    reader.onerror = (error) => {
      console.error("Error reading file:", error);
    };
  };

  const onHandleSubmit = (values: TOfficeCoordinatesFormSchema) => {
    console.log(values);
  };
  const handleSelectLocationAction = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
        },
        (error: GeolocationPositionError) => {
          setError("Error getting location. Please enable location services.");
        },
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <header className="flex w-full items-center justify-between">
        <div className="flex flex-col">
          <h2 className="mb-2 text-4xl font-bold">Configurations</h2>
          <p className="text-md text-gray-600">
            Configure Public Holidays and Other Settings
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger className="hover:bg-gray100 inline-flex h-10 items-center justify-center whitespace-nowrap rounded-md border border-blue-500 bg-gray-50 px-4 py-2 text-sm font-medium text-black ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2  disabled:pointer-events-none disabled:opacity-50">
              <span>Add Registered Location</span>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle className="mb-5 text-2xl font-medium">
                Add Registered Location Coordinates
              </DialogTitle>
              <DialogDescription>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onHandleSubmit)}>
                    <FormField
                      control={form.control}
                      name="longitude"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Longitude</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="12421.2132"
                              {...form.register("longitude")}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="latitude"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Latitude</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="12312.1212"
                              {...form.register("latitude")}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit">Submit</Button>
                  </form>
                </Form>
              </DialogDescription>
            </DialogContent>
          </Dialog>
          <Button
            disabled={mutation.isLoading}
            onClick={handleButtonClick}
            className="bg-blue-500 hover:bg-blue-600"
          >
            {mutation.isLoading && (
              <LoadingSpinner size={17} color="#fff" className="mr-2" />
            )}
            Upload Holidays CSV
          </Button>
          <input
            ref={fileInputRef}
            onClick={(event) => {
              event.currentTarget.value = "";
            }}
            type="file"
            accept=".csv"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </div>
      </header>
      <main className="flex h-full w-full gap-4">
        <div className="flex-[3]">
          <div className="flex h-full w-full flex-col gap-2">
            {!isLoading && <p className="text-lg">Public Holidays</p>}
            {isLoading ? (
              <TableSkeleton />
            ) : (
              <div className=" rounded-md border-b bg-white p-6 shadow">
                <DataTable
                  columns={columns}
                  data={holidaysInYear ? holidaysInYear : []}
                />
              </div>
            )}
          </div>
        </div>
        <div className="flex h-full flex-[2] flex-col gap-2">
          <p className="text-lg">Notifications Control Panel</p>
          <div className="flex h-full flex-col gap-3 rounded-md border-b bg-white p-4 shadow">
            <div className="flex flex-row items-center justify-between space-y-2 rounded-lg border p-3 shadow-sm">
              <div className="flex flex-col">
                <p className="mb-1 text-base">Pending Leave Requests</p>
                <p className="max-w-[80%] text-[0.8rem] text-muted-foreground">
                  Enable notifications for employees for their pending leave
                  requests.
                </p>
              </div>
              <Switch />
            </div>
            <div className="flex flex-row items-center justify-between space-y-2 rounded-lg border p-3 shadow-sm">
              <div className="flex flex-col">
                <p className="mb-1 text-base">Upcoming Leaves</p>
                <p className="max-w-[80%] text-[0.8rem] text-muted-foreground">
                  Enable reminders notifications for employees about upcoming
                  leave dates.
                </p>
              </div>
              <Switch />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

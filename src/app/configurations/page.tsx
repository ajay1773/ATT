"use client";
import { Button } from "~/components/ui/button";
import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { api } from "~/trpc/react";
import { LoadingSpinner } from "~/components/ui/spinner";
import { ColumnDef } from "@tanstack/react-table";
import { Holidays, GlobalSettings } from "@prisma/client";
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
import { Checkbox } from "~/components/ui/checkbox";
import { CheckedState } from "@radix-ui/react-checkbox";
import { useToast } from "~/components/ui/use-toast";

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

const timeFormatRegex = /^(0\d|1\d|2[0-3]):[0-5]\d\s(?:AM|PM)$/;

const officeCoordinatesFormSchema = z.object({
  longitude: z.coerce.number({
    required_error: "Longitude Required!",
    invalid_type_error: "Type of longitude should be number.",
  }),
  latitude: z.coerce.number({
    required_error: "Latitude Required!",
    invalid_type_error: "Type of latitude should be number.",
  }),
  shiftStartHour: z
    .string({
      required_error: "Shift Start Time Required!",
    })
    .regex(
      timeFormatRegex,
      'Invalid format of Shift Start Time. It Should be in format "HH:MM AM/PM"',
    ),
  shiftEndHour: z
    .string({
      required_error: "Shift End Time Required!",
    })
    .regex(
      timeFormatRegex,
      'Invalid format of Shift End Time. It Should be in format "HH:MM AM/PM"',
    ),
});

type TOfficeCoordinatesFormSchema = z.infer<typeof officeCoordinatesFormSchema>;

export default function ConfigurationsPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState<boolean>(false);

  const { toast } = useToast();

  const { data: holidaysInYear, isLoading } =
    api.holidays.getHolidaysForTimePeriod.useQuery<Holidays[]>(
      {
        startTime: moment().startOf("year").toDate(),
        endTime: moment().endOf("year").toDate(),
      },
      { refetchOnWindowFocus: false },
    );

  const {
    data: locationRecords,
    isLoading: isLocationsLoading,
    isError,
  } = api.user.getAllReportingLocation.useQuery<GlobalSettings[]>(undefined, {
    refetchOnWindowFocus: false,
  });
  const mutation = api.holidays.uploadPublicHolidaysCSV.useMutation();
  const updateLocationRecordsMutation =
    api.user.updateReportingLocation.useMutation();
  const createLocationRecordsMutation =
    api.user.createReportingLocation.useMutation();

  const currentLocationCoordinatesRecord = locationRecords
    ? locationRecords[0]
    : undefined;

  const form = useForm<TOfficeCoordinatesFormSchema>({
    resolver: zodResolver(officeCoordinatesFormSchema),
    defaultValues: {
      longitude: currentLocationCoordinatesRecord?.longitude,
      latitude: currentLocationCoordinatesRecord?.latitude,
      shiftStartHour: currentLocationCoordinatesRecord?.shiftStartHour,
      shiftEndHour: currentLocationCoordinatesRecord?.shiftEndHour,
    },
  });

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

  const onHandleSubmit = async ({
    latitude,
    longitude,
    shiftEndHour,
    shiftStartHour,
  }: TOfficeCoordinatesFormSchema) => {
    console.log(latitude, longitude, shiftEndHour, shiftStartHour);
    if (currentLocationCoordinatesRecord) {
      await updateLocationRecordsMutation.mutateAsync({
        latitude,
        longitude,
        shiftEndTime: shiftEndHour,
        shiftStartTime: shiftStartHour,
        id: currentLocationCoordinatesRecord.id,
      });
      toast({
        className: "bg-green-500",
        title: "Updated location record successfully.",
      });
      setOpen(false);
    } else {
      await createLocationRecordsMutation.mutateAsync({
        latitude,
        longitude,
        shiftEndTime: shiftEndHour,
        shiftStartTime: shiftStartHour,
      });
      toast({
        className: "bg-green-500",
        title: "Added location record successfully.",
      });
      setOpen(false);
    }
  };
  const handleSelectLocationAction = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          const { latitude, longitude } = position.coords;
          form.setValue("longitude", longitude);
          form.setValue("latitude", latitude);
        },
        (error: GeolocationPositionError) => {
          toast({
            title: "Error getting location. Please enable location services.",
            className: "bg-red-500",
          });
        },
      );
    } else {
      toast({
        title: "Geolocation is not supported by this browser.",
        className: "bg-red-500",
      });
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
          <Button
            disabled={mutation.isLoading}
            onClick={handleButtonClick}
            className="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-md border border-blue-500 bg-gray-50 px-4 py-2 text-sm font-medium text-black ring-offset-background transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2  disabled:pointer-events-none disabled:opacity-50"
          >
            {mutation.isLoading && (
              <LoadingSpinner size={17} color="#fff" className="mr-2" />
            )}
            Upload Holidays CSV
          </Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-md border bg-blue-500 px-4 py-2 text-sm font-medium text-white ring-offset-background transition-colors hover:bg-blue-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2  disabled:pointer-events-none disabled:opacity-50">
              {isLocationsLoading ? (
                <LoadingSpinner />
              ) : (
                <span>
                  {(updateLocationRecordsMutation.isLoading ||
                    createLocationRecordsMutation.isLoading) && (
                    <LoadingSpinner size={12} />
                  )}
                  Configure Global Settings
                </span>
              )}
            </DialogTrigger>
            <DialogContent>
              <DialogTitle className=" text-2xl font-medium">
                Add Registered Location Coordinates
              </DialogTitle>
              <DialogDescription>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onHandleSubmit)}>
                    <div className="flex flex-col">
                      <h2 className="mb-2 text-lg text-black">
                        Add/Update Office Location Coordinates
                      </h2>
                      <div className="mb-2 flex w-full gap-3">
                        <FormField
                          control={form.control}
                          name="longitude"
                          render={() => (
                            <FormItem className="w-1/2">
                              <FormLabel>Longitude</FormLabel>
                              <FormControl>
                                <Input
                                  className="text-black"
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
                          render={() => (
                            <FormItem className="w-1/2">
                              <FormLabel>Latitude</FormLabel>
                              <FormControl>
                                <Input
                                  className="text-black"
                                  placeholder="12312.1212"
                                  {...form.register("latitude")}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="mb-6 flex items-center justify-start gap-2">
                        <Checkbox
                          id="autofill"
                          onCheckedChange={(checked: CheckedState) => {
                            if (checked) {
                              handleSelectLocationAction();
                            }
                          }}
                        />
                        <label htmlFor="autofill" className="text-black">
                          Autofill Current Location Coordinates.
                        </label>
                      </div>
                    </div>
                    <div className="mb-4 flex flex-col">
                      <h2 className="mb-2 text-lg text-black">
                        Add/Update Office Start And End Timings
                      </h2>
                      <div className="mb-2 flex w-full gap-3">
                        <FormField
                          control={form.control}
                          name="shiftStartHour"
                          render={() => (
                            <FormItem className="w-1/2">
                              <FormLabel>Start Time</FormLabel>
                              <FormControl>
                                <Input
                                  className="text-black"
                                  placeholder="10:00 AM"
                                  {...form.register("shiftStartHour")}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="shiftEndHour"
                          render={() => (
                            <FormItem className="w-1/2">
                              <FormLabel>End Time</FormLabel>
                              <FormControl>
                                <Input
                                  className="text-black"
                                  placeholder="07:00 PM"
                                  {...form.register("shiftEndHour")}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    <Button
                      type="submit"
                      variant={
                        updateLocationRecordsMutation.isLoading ||
                        createLocationRecordsMutation.isLoading
                          ? "outline"
                          : "default"
                      }
                      disabled={
                        updateLocationRecordsMutation.isLoading ||
                        createLocationRecordsMutation.isLoading
                      }
                    >
                      {(updateLocationRecordsMutation.isLoading ||
                        createLocationRecordsMutation.isLoading) && (
                        <LoadingSpinner size={12} className="mr-2" />
                      )}
                      Submit
                    </Button>
                  </form>
                </Form>
              </DialogDescription>
            </DialogContent>
          </Dialog>
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

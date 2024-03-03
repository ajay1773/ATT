"use client";
import { Button } from "./button";
import classNames from "classnames";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Checkbox } from "./checkbox";
import { Label } from "./label";
import { filter, find, map } from "lodash";
import { LoadingSpinner } from "./spinner";
import { useState } from "react";

type MultiSelectOption<T> = {
  name: string;
  value: T;
  label: string;
};

export type MultiSelectProps<T> = {
  options: MultiSelectOption<T>[];
  values: string[];
  loading?: boolean;
  disabled?: boolean;
  onChange: (values: string[]) => void;
};

function MultiSelectSelectedValue({
  selectedValues,
}: {
  selectedValues: string[];
}) {
  const firstValue = selectedValues[0];
  const label =
    selectedValues.length === 1
      ? firstValue
      : `${firstValue} + ${selectedValues.length - 1}`;
  return (
    <span
      className={selectedValues.length === 0 ? "text-gray-500" : "text-black"}
    >
      {selectedValues.length === 0 ? "Select Values" : label}
    </span>
  );
}

export function MultiSelect<T extends any>({
  options,
  values,
  onChange,
  loading,
  disabled,
}: MultiSelectProps<T>) {
  const [selectedOptions, setSelectedOptions] = useState<
    MultiSelectOption<T>[]
  >([]);

  const listClasses = classNames("list-none  transition-[height] bg-white ");

  const updateSelectedOptions = (name: string, value: boolean | string) => {
    if (value) {
      const newOption = find(
        options,
        (opt: MultiSelectOption<T>) => opt.name === name,
      );
      const updatedOptions = [
        ...selectedOptions,
        newOption as MultiSelectOption<T>,
      ];
      setSelectedOptions(updatedOptions);
      onChange([...map(updatedOptions, (obj) => obj.name)]);
    } else {
      const filteredOptions = filter(
        selectedOptions,
        (opt: MultiSelectOption<T>) => opt.name !== name,
      );
      setSelectedOptions(filteredOptions);
      onChange([...map(filteredOptions, (obj) => obj.name)]);
    }
  };

  return (
    <div className="relative flex flex-col">
      <Popover>
        <PopoverTrigger asChild>
          <Button disabled={disabled} type="button" variant={"outline"}>
            {loading ? (
              <LoadingSpinner size={15} />
            ) : (
              <MultiSelectSelectedValue
                selectedValues={selectedOptions.map((val) => val.label)}
              />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className=" w-[var(--radix-popover-trigger-width)] p-2 ">
          <ul className={listClasses}>
            {map(options, ({ name, label }) => (
              <li
                className="flex cursor-pointer items-center gap-2 rounded bg-white p-2 hover:bg-gray-100"
                key={name}
              >
                <Checkbox
                  name={name}
                  id={name}
                  checked={values.includes(name)}
                  onCheckedChange={(val) => updateSelectedOptions(name, val)}
                />
                <Label htmlFor={name} className="w-full cursor-pointer">
                  {label}
                </Label>
              </li>
            ))}
          </ul>
        </PopoverContent>
      </Popover>
    </div>
  );
}

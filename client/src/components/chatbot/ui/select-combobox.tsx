"use client";

import { Check, ChevronDown } from "lucide-react";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { FacetedFilterOptions } from "@/types/faceted-filter-options";

interface SelectComboboxProps {
  title: string;
  options: FacetedFilterOptions[];
  selectedValues?: Set<string>;
  onFilterChange: (selectedValues: string[]) => void;
}

export function SelectCombobox({
  title,
  options,
  selectedValues = new Set(),
  onFilterChange,
}: SelectComboboxProps) {
  const [localSelectedValues, setLocalSelectedValues] = React.useState(
    new Set(selectedValues)
  );

  const handleSelect = (value: string) => {
    const updatedValues = new Set(localSelectedValues);
    if (updatedValues.has(value)) {
      updatedValues.delete(value);
    } else {
      updatedValues.add(value);
    }
    setLocalSelectedValues(updatedValues);
    onFilterChange(Array.from(updatedValues));
  };

  const clearFilters = () => {
    setLocalSelectedValues(new Set());
    onFilterChange([]);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary" size="sm" className="h-8 w-fit rounded-xl">
          {title}
          <ChevronDown />
          {localSelectedValues.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {localSelectedValues.size}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {localSelectedValues.size > 2 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {localSelectedValues.size} selected
                  </Badge>
                ) : (
                  options
                    .filter((option) => localSelectedValues.has(option.value))
                    .map((option) => (
                      <Badge
                        variant="secondary"
                        key={option.value}
                        className="rounded-sm bg-inherit px-1 font-normal"
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  onSelect={() => handleSelect(option.value)}
                >
                  <div
                    className={cn(
                      "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                      localSelectedValues.has(option.value)
                        ? "bg-primary text-white dark:text-primary-foreground"
                        : "opacity-50 [&_svg]:invisible"
                    )}
                  >
                    <Check />
                  </div>
                  {option.icon && (
                    <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                  )}
                  <span>{option.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
            {localSelectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={clearFilters}
                    className="justify-center text-center"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

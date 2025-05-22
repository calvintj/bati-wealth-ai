import { useVirtualizer } from "@tanstack/react-virtual";
import React, {
  ComponentProps,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { useGetCustomersInfinite } from "@/hooks/chatbot/api/customer-api-infinite";
import { cn } from "@/lib/utils";

interface CustomerSelectProps
  extends Omit<
      ComponentProps<typeof SelectTrigger>,
      "value" | "defaultValue" | "onValueChange"
    >,
    Pick<
      ComponentProps<typeof Select>,
      "onValueChange" | "value" | "defaultValue"
    > {}

export default function CustomerSelect({
  className,
  value,
  defaultValue,
  onValueChange,
  ...props
}: CustomerSelectProps) {
  const [open, setOpen] = useState(false);

  const {
    data,
    isLoading,
    hasNextPage,
    isFetchingPreviousPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useGetCustomersInfinite({ limit: 10, page: 1 });

  const parentRef = useRef<HTMLDivElement | null>(null);

  const customers = useMemo(
    () => data?.pages?.flatMap((page) => page.data) ?? [],
    [data]
  );

  const selectVirtualizer = useVirtualizer({
    count: customers?.length ?? 0 + (hasNextPage ? 1 : 0) + 1,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
    overscan: 5,
  });

  useEffect(() => {
    const [lastItem] = [...selectVirtualizer.getVirtualItems()].reverse();

    if (!lastItem) {
      return;
    }

    if (
      lastItem.index >= customers.length - 1 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [
    open,
    hasNextPage,
    fetchNextPage,
    customers.length,
    isFetchingNextPage,
    selectVirtualizer.getVirtualItems(),
  ]);

  return (
    <Select
      open={open}
      onOpenChange={setOpen}
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
    >
      <SelectTrigger
        {...props}
        className={cn("rounded-xl", className)}
      >
        <SelectValue placeholder="Customer ID">
          {value && JSON.parse(value)?.customerId}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Customer ID</SelectLabel>
          {isFetchingPreviousPage && <Spinner />}
          <div
            ref={parentRef}
            style={{
              height: selectVirtualizer.getTotalSize(),
              position: "relative",
            }}
          >
            {isLoading ? (
              <Spinner />
            ) : (
              selectVirtualizer.getVirtualItems().map((item) => {
                const customer = customers[item.index];
                return (
                  <SelectItem key={item.index} value={JSON.stringify(customer)}>
                    {customer.customerId}
                  </SelectItem>
                );
              })
            )}
          </div>
          {isFetchingNextPage && <Spinner />}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

"use client";
import MdToJsx from "markdown-to-jsx";
import { useTheme } from "next-themes";
import React, { memo, PropsWithChildren } from "react";

function CustomSpan({
  children,
  ...props
}: PropsWithChildren<
  React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLSpanElement>,
    HTMLSpanElement
  >
>) {
  const { theme } = useTheme();

  const COLOR_MAPPING = {
    "#5772f9": {
      dark: "#3e58d1",
      light: "#5772f9",
    },
    red: {
      dark: "#CC3333",
      light: "red",
    },
  };

  console.log(props.style?.color);

  if (props.style?.color) {
    for (const [key, color] of Object.entries(COLOR_MAPPING)) {
      if (props.style.color === key) {
        props.style.color = color[(theme as "dark" | "light") ?? "light"];
      }
    }
  }

  return <span {...props}>{children}</span>;
}

const NonMemoizedMarkdown = ({ children }: { children: string }) => {
  return (
    <>
      <MdToJsx
        className="w-full"
        options={{
          overrides: {
            p: {
              props: {
                className: "'mb-4",
              },
            },
            table: {
              props: {
                className: "mb-4",
              },
            },
            td: {
              props: {
                className: "border px-3 py-2",
              },
            },
            th: {
              props: {
                className: "border px-3 py-2",
              },
            },
            li: {
              props: {
                className: "list-disc",
              },
            },
            span: {
              component: CustomSpan,
            },
          },
        }}
      >
        {children}
      </MdToJsx>
    </>
  );
};

export const Markdown = memo(
  NonMemoizedMarkdown,
  (prevProps, nextProps) => prevProps.children === nextProps.children
);

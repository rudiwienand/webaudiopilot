import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "./ui/utils";

interface CustomSliderProps extends React.ComponentProps<typeof SliderPrimitive.Root> {
  accentColor: string;
}

export function CustomSlider({
  className,
  accentColor,
  ...props
}: CustomSliderProps) {
  return (
    <SliderPrimitive.Root
      className={cn(
        "relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track
        className="relative grow overflow-hidden rounded-full data-[orientation=horizontal]:h-4 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-3"
        style={{
          background: `linear-gradient(to top, ${accentColor}40 0%, rgba(71, 85, 105, 0.3) 100%)`
        }}
      >
        <SliderPrimitive.Range
          className="absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full rounded-full"
          style={{
            backgroundColor: accentColor,
            boxShadow: `0 0 10px ${accentColor}60`
          }}
        />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb
        className="block size-5 shrink-0 rounded-full border-2 shadow-lg transition-transform hover:scale-110 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
        style={{
          backgroundColor: accentColor,
          borderColor: 'white',
          boxShadow: `0 0 15px ${accentColor}80`
        }}
      />
    </SliderPrimitive.Root>
  );
}

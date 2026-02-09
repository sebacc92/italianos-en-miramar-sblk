import { component$, Slot, type PropsOf } from "@builder.io/qwik";

export const Label = component$<PropsOf<"label">>(
  ({ class: className, ...props }) => {
    return (
      <label
        class={[
          "text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
          className,
        ]}
        {...props}
      >
        <Slot />
      </label>
    );
  },
);

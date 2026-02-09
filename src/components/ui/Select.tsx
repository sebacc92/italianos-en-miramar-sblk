import { component$, type PropsOf } from "@builder.io/qwik";

interface SelectProps extends PropsOf<"select"> {
  options: { label: string; value: string }[];
  placeholder?: string;
}

export const Select = component$<SelectProps>(
  ({ options, placeholder = "Seleccionar...", class: className, ...props }) => {
    return (
      <div class="relative">
        <select
          class={[
            "flex h-10 w-full appearance-none items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
            className,
          ]}
          {...props}
        >
          <option value="" disabled selected>
            {placeholder}
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg
            class="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    );
  },
);

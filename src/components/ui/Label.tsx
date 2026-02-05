import { component$, Slot, type PropsOf } from '@builder.io/qwik';

export const Label = component$<PropsOf<'label'>>(({ class: className, ...props }) => {
    return (
        <label
            class={[
                "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                className
            ]}
            {...props}
        >
            <Slot />
        </label>
    );
});

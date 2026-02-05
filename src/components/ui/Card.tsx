import { component$, Slot, type PropsOf } from '@builder.io/qwik';

export const Card = component$<PropsOf<'div'>>(({ class: className, ...props }) => {
    return (
        <div
            class={["rounded-xl border border-gray-200 bg-white text-gray-950 shadow-sm", className]}
            {...props}
        >
            <Slot />
        </div>
    );
});

export const CardHeader = component$<PropsOf<'div'>>(({ class: className, ...props }) => {
    return (
        <div class={["flex flex-col space-y-1.5 p-6", className]} {...props}>
            <Slot />
        </div>
    );
});

export const CardTitle = component$<PropsOf<'h3'>>(({ class: className, ...props }) => {
    return (
        <h3 class={["font-semibold leading-none tracking-tight", className]} {...props}>
            <Slot />
        </h3>
    );
});

export const CardDescription = component$<PropsOf<'p'>>(({ class: className, ...props }) => {
    return (
        <p class={["text-sm text-gray-500", className]} {...props}>
            <Slot />
        </p>
    );
});

export const CardContent = component$<PropsOf<'div'>>(({ class: className, ...props }) => {
    return (
        <div class={["p-6 pt-0", className]} {...props}>
            <Slot />
        </div>
    );
});

export const CardFooter = component$<PropsOf<'div'>>(({ class: className, ...props }) => {
    return (
        <div class={["flex items-center p-6 pt-0", className]} {...props}>
            <Slot />
        </div>
    );
});

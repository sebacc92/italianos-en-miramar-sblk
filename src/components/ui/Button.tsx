import { component$, Slot, type PropsOf } from '@builder.io/qwik';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

interface ButtonProps extends PropsOf<'button'> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    fullWidth?: boolean;
}

export const Button = component$<ButtonProps>(({
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    class: className,
    ...props
}) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';

    const variants = {
        primary: 'bg-green-700 text-white hover:bg-green-800 focus-visible:ring-green-700',
        secondary: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600',
        outline: 'border border-gray-300 bg-transparent hover:bg-gray-100 text-gray-700 focus-visible:ring-gray-500',
        ghost: 'hover:bg-gray-100 text-gray-700 hover:text-gray-900',
    };

    const sizes = {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4 py-2 text-sm',
        lg: 'h-12 px-6 text-base',
        icon: 'h-10 w-10',
    };

    const widthClass = fullWidth ? 'w-full' : '';

    return (
        <button
            class={[
                baseStyles,
                variants[variant],
                sizes[size],
                widthClass,
                className
            ]}
            {...props}
        >
            <Slot />
        </button>
    );
});

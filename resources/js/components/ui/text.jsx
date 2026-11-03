import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils.js';

const textVariants = cva('transition-colors', {
  variants: {
    variant: {
      h1: 'font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-navy',
      h2: 'font-display text-xl sm:text-2xl font-bold tracking-tight text-navy',
      h3: 'font-display text-lg sm:text-xl font-semibold tracking-tight text-navy',
      h4: 'font-display text-base font-semibold tracking-tight text-navy',
      lead: 'text-base text-slate-600 leading-relaxed',
      body: 'text-sm text-slate-700 leading-normal',
      small: 'text-xs text-slate-500 leading-normal',
      muted: 'text-xs text-slate-400 leading-normal',
      caption: 'text-[11px] text-slate-500 font-medium',
      eyebrow: 'text-[10px] font-bold tracking-widest uppercase text-[#ac8848]',
      code: 'font-mono text-xs text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded',
      metric: 'font-display text-3xl font-bold tracking-tight text-navy',
    },
    color: {
      default: '',
      navy: 'text-navy',
      gold: 'text-[#c4a266]',
      amber: 'text-[#ac8848]',
      slate: 'text-slate-700',
      muted: 'text-slate-500',
      success: 'text-[#398872]',
      warning: 'text-[#ac8848]',
      destructive: 'text-[#b36a74]',
      white: 'text-white',
    },
    weight: {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
      extrabold: 'font-extrabold',
    },
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    },
  },
  defaultVariants: {
    variant: 'body',
  },
});

const defaultElementMap = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  lead: 'p',
  body: 'p',
  small: 'small',
  muted: 'span',
  caption: 'span',
  eyebrow: 'div',
  code: 'code',
  metric: 'div',
};

const Text = React.forwardRef(
  ({ className, variant = 'body', color, weight, align, as, children, ...props }, ref) => {
    const Component = as || defaultElementMap[variant] || 'p';
    return (
      <Component
        ref={ref}
        className={cn(textVariants({ variant, color, weight, align }), className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);
Text.displayName = 'Text';

const Heading = React.forwardRef(({ level = 1, ...props }, ref) => {
  const variant = `h${level}`;
  return <Text ref={ref} variant={variant} as={variant} {...props} />;
});
Heading.displayName = 'Heading';

const Eyebrow = React.forwardRef(({ className, ...props }, ref) => (
  <Text ref={ref} variant="eyebrow" className={cn('mb-1', className)} {...props} />
));
Eyebrow.displayName = 'Eyebrow';

export { Text, Heading, Eyebrow, textVariants };


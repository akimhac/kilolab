import React from "react";

/**
 * SHIM anti-crash iOS Safari.
 * Objectif: empêcher framer-motion (bug WebKit / MotionValue.add) de charger.
 * Résultat: animations désactivées, UI stable.
 */

type AnyProps = Record<string, any>;

// Proxy: motion.div, motion.section, etc => rend juste un élément HTML normal.
export const motion: any = new Proxy(
  {},
  {
    get: (_target, tag: string) => {
      return React.forwardRef<any, AnyProps>(function MotionShim(props, ref) {
        const { children, ...rest } = props || {};
        return React.createElement(tag, { ...rest, ref }, children);
      });
    },
  }
);

// Alias parfois utilisé (m.div)
export const m = motion;

// AnimatePresence => ne fait rien, rend juste les enfants
export function AnimatePresence(props: { children?: React.ReactNode }) {
  return <>{props.children}</>;
}

// MotionConfig => ne fait rien
export function MotionConfig(props: { children?: React.ReactNode }) {
  return <>{props.children}</>;
}

// Hooks "safe"
export function useReducedMotion() {
  return true;
}

// Exports optionnels souvent présents selon usage
export const LayoutGroup = ({ children }: { children?: React.ReactNode }) => <>{children}</>;
export const Reorder: any = {
  Group: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
  Item: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
};

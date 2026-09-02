'use client';

import React, { forwardRef, useEffect, useId, useState } from 'react';
import { useDialogStack } from '../../hooks/use-dialog-stack';
import { motion, AnimatePresence, type Variants } from 'motion/react';
import { createPortal } from 'react-dom';
import { cva } from 'class-variance-authority';
import { cn } from '../../util/common';

type HeaderPadding = 'none' | 'sm' | 'md' | 'lg';
type HeaderBorder = 'none' | 'default';
type CloseButtonPosition = 'none' | 'fixed';

interface HeaderStyles {
  padding?: HeaderPadding;
  border?: HeaderBorder;
  closeButtonPosition: CloseButtonPosition;
}

type CustomAnimation = 'scale' | 'slide' | 'fade' | 'slide-up';

export interface MotionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string | React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  animation?: CustomAnimation;
  showCloseButton?: boolean;
  closeOnBackdropClick?: boolean;
  className?: string;
  showBackdrop?: boolean;
  isScrollableContent?: boolean;
  zIndex?: number;
  customAnimation?: Variants;
  headerClassName?: HeaderStyles;
  onExitComplete?: () => void;
}

const sizeClasses = {
  sm: 'komc:max-w-md',
  md: 'komc:max-w-lg',
  lg: 'komc:max-w-2xl',
  xl: 'komc:max-w-4xl',
  '2xl': 'komc:max-w-6xl',
  full: 'komc:max-w-full komc:mx-4',
};

const animationVariants: Record<CustomAnimation, Variants> = {
  scale: {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 20,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 25,
        stiffness: 300,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 20,
      transition: {
        duration: 0.2,
      },
    },
  },
  slide: {
    hidden: {
      opacity: 0,
      x: 300,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring',
        damping: 25,
        stiffness: 300,
      },
    },
    exit: {
      opacity: 0,
      x: 300,
      transition: {
        duration: 0.3,
      },
    },
  },
  fade: {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.2,
      },
    },
  },
  'slide-up': {
    hidden: {
      opacity: 0,
      y: 100,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 25,
        stiffness: 300,
      },
    },
    exit: {
      opacity: 0,
      y: 100,
      transition: {
        duration: 0.3,
      },
    },
  },
};

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const dialogHeader = cva('komc:flex komc:items-center komc:justify-between', {
  variants: {
    padding: {
      none: undefined,
      sm: 'komc:p-2',
      md: 'komc:p-4',
      lg: 'komc:p-6',
    },
    border: {
      none: '',
      default: 'komc:border-b komc:border-gray-200',
    },
    closeButtonPosition: {
      none: undefined,
      fixed:
        'komc:[&>button]:absolute komc:[&>button]:right-6 komc:[&>button]:top-10',
    },
  },
  defaultVariants: {
    padding: 'lg',
    border: 'default',
    closeButtonPosition: 'none',
  },
});

const MotionDialog = forwardRef<HTMLDivElement, MotionDialogProps>(
  (
    {
      isOpen,
      onClose,
      children,
      title,
      footer,
      size = 'md',
      animation = 'scale',
      showCloseButton = true,
      closeOnBackdropClick = true,
      className = '',
      showBackdrop = true,
      isScrollableContent = false,
      zIndex = 10000,
      customAnimation,
      headerClassName,
      onExitComplete,
    },
    ref,
  ) => {
    const contentId = useId();
    const [mounted, setMounted] = useState(false);

    useDialogStack(isOpen, onClose);

    useEffect(() => {
      setMounted(true);
    }, []);

    const handleBackdropClick = () => {
      if (closeOnBackdropClick) {
        onClose();
      }
    };

    const variants = customAnimation || animationVariants[animation];

    if (!mounted) {
      return null;
    }

    return createPortal(
      <AnimatePresence mode="wait" onExitComplete={onExitComplete}>
        {isOpen && (
          <motion.div
            data-komc
            data-komc-dialog=""
            className="komc:fixed komc:inset-0 komc:flex komc:items-center komc:justify-center komc:p-4"
            style={{ zIndex }}
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {showBackdrop && (
              <motion.div
                className="komc:absolute komc:bg-black/50"
                style={{
                  zIndex: -1,
                  top: '50%',
                  left: '50%',
                  width: '100vw',
                  height: '100vh',
                  transform: 'translate(-50%, -50%)',
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleBackdropClick}
              />
            )}
            <motion.div
              ref={ref}
              id={contentId}
              className={cn(
                'komc:relative komc:bg-white komc:rounded-lg komc:shadow-xl komc:pointer-events-auto',
                size === 'full'
                  ? 'komc:w-full komc:h-full'
                  : cn(sizeClasses[size], 'komc:w-full'),
                className,
              )}
              variants={variants}
              initial="hidden"
              animate="visible"
              exit="exit"
              layout
            >
              {(title || showCloseButton) && (
                <motion.div
                  className={dialogHeader({
                    padding: headerClassName?.padding,
                    border: headerClassName?.border,
                    closeButtonPosition: headerClassName?.closeButtonPosition,
                  })}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {title &&
                    (typeof title === 'string' ? (
                      <h2 className="komc:text-lg komc:font-semibold komc:text-gray-900">
                        {title}
                      </h2>
                    ) : (
                      title
                    ))}
                  {showCloseButton && (
                    <motion.button
                      onClick={onClose}
                      className="komc:p-1 komc:rounded-full komc:hover:bg-gray-100 komc:transition-colors"
                      aria-label="Close dialog"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <svg
                        className="komc:w-5 komc:h-5 komc:text-neutral-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </motion.button>
                  )}
                </motion.div>
              )}

              <motion.div
                className={cn(
                  'komc:@container/dialog-content',
                  'komc:p-6',
                  isScrollableContent &&
                    'komc:overflow-y-auto komc:h-(--dialog-content-height)',
                )}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {children}
              </motion.div>

              {footer && (
                <motion.div
                  className="komc:flex komc:items-center komc:justify-between komc:p-6 komc:border-t komc:border-gray-200"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {footer}
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body,
    );
  },
);

export default MotionDialog;

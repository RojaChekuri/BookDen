import {
  offset,
  safePolygon,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useRole,
} from '@floating-ui/react';
import { Tooltip, Utility } from '@visa/nova-react';
import React, { useState } from 'react';
import { FloatingTooltipProps } from '../types/libraryTypes';


const FloatingTooltip: React.FC<FloatingTooltipProps> = ({
  children,
  content,
  placement = 'top',
  offsetDistance = 6,
  id,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const { x, y, strategy, refs, context } = useFloating({
    middleware: [offset(offsetDistance)],
    open: isOpen,
    onOpenChange: setIsOpen,
    placement,
  });

  const dismiss = useDismiss(context);
  const focus = useFocus(context);
  const hover = useHover(context, { handleClose: safePolygon(), move: false });
  const role = useRole(context, { role: 'tooltip' });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    dismiss,
    focus,
    hover,
    role,
  ]);

  const tooltipId = id ? `${id}-tooltip` : undefined;

  return (
    <Utility vFlex vJustifyContent="center" vMargin={12} className="floating-tooltip-wrapper">
      {/* Trigger element */}
      <span
        ref={refs.setReference}
        {...getReferenceProps({
          'aria-describedby': isOpen && tooltipId ? tooltipId : undefined,
        })}
      >
        {children}
      </span>

      {/* Tooltip */}
      {isOpen && (
        <Tooltip
          ref={refs.setFloating}
          id={tooltipId}
          className="floating-tooltip-popup"
          style={{
            left: x ?? 0,
            top: y ?? 0,
            position: strategy,
          }}
          {...getFloatingProps()}
        >
          {content}
        </Tooltip>
      )}
    </Utility>
  );
};

export default FloatingTooltip;
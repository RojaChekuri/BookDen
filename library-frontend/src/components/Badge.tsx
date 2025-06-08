import React, { ReactNode } from 'react';
import { Badge } from '@visa/nova-react';

interface ReusableBadgeProps {
  label: string;
  badgeType: React.ComponentProps<typeof Badge>['badgeType']; // badgeType prop type from Badge
  icon?: ReactNode; // icon passed as ReactNode from parent
}

export const BadgeInfo: React.FC<ReusableBadgeProps> = ({ label, badgeType, icon }) => {
  return (
    <Badge badgeType={badgeType} aria-label={label}>
      {icon} 
      <span style={{ fontSize: '1rem', lineHeight: 1.2 }}>{label}</span>
    </Badge>
  );
};
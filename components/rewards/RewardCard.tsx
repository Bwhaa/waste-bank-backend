import React from 'react';
import { RewardItem } from '@/types/rewards';
import { RewardCardGrid } from './RewardCardGrid';
import { RewardCardList } from './RewardCardList';

interface Props {
  item: RewardItem;
  layout?: 'grid' | 'list';
  onRedeem?: (id: number) => void;
}

export const RewardCard: React.FC<Props> = ({ layout = 'list', ...props }) => {
  if (layout === 'grid') {
    return <RewardCardGrid item={props.item} />;
  }
  return <RewardCardList {...props} />;
};
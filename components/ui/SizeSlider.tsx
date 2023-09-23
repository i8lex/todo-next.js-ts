// value
// onChange

import ZoomIn from '@/public/IconsSet/zoom-in.svg';
import ZoomOut from '@/public/IconsSet/zoom-out.svg';

import type { FC } from 'react';

export type SizeSliderProps = {
  value: number;
  onChange: (newVal: number) => void;
};

export const SizeSlider: FC<SizeSliderProps> = ({ value, onChange }) => {
  return (
    <div className="flex flex-row space-x-4">
      <ZoomOut className="h-6 w-6" />
      <input
        type="range"
        min={0.5}
        max={3}
        step={0.1}
        className="w-full"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <ZoomIn className="h-6 w-6" />
    </div>
  );
};

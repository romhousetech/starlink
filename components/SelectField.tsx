'use client';

import dynamic from 'next/dynamic';

const DynamicSelect = dynamic(() => import('react-select'), { ssr: false });

type SelectOption = { label: string; value: string };

interface SelectFieldProps {
  options: SelectOption[];
  value: SelectOption | null;
  onChange: (selected: SelectOption | null) => void;
  placeholder?: string;
}

export default function SelectField({
  options,
  value,
  onChange,
  placeholder,
}: SelectFieldProps) {
  return (
    <DynamicSelect
      options={options}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
}

import type { Key, ReactNode } from 'react';
import {
  Button,
  Label,
  ListBox,
  ListBoxItem,
  Popover,
  Select,
  SelectValue,
  Text,
} from 'react-aria-components';
import { CaretDownIcon, CheckIcon } from '@phosphor-icons/react';

interface ProfileSelectOption {
  id: string;
  label: string;
}

interface ProfileSelectProps {
  label: ReactNode;
  ariaLabel: string;
  selectedKey: string | null;
  placeholder?: string;
  description?: string;
  isDisabled?: boolean;
  options: ProfileSelectOption[];
  onSelectionChange: (key: string) => void;
}

export const ProfileSelect = ({
  label,
  ariaLabel,
  selectedKey,
  placeholder = 'Seleccionar...',
  description,
  isDisabled = false,
  options,
  onSelectionChange,
}: ProfileSelectProps) => {
  const handleSelectionChange = (key: Key | null) => {
    if (key === null) return;
    onSelectionChange(String(key));
  };

  return (
    <Select
      aria-label={ariaLabel}
      selectedKey={selectedKey}
      placeholder={placeholder}
      isDisabled={isDisabled}
      onSelectionChange={handleSelectionChange}
      className="space-y-1.5"
    >
      <Label className="ml-1 flex items-center gap-1 text-[10px] font-bold uppercase text-app-secondary">
        {label}
      </Label>

      <Button className="group flex w-full cursor-pointer items-center justify-between gap-3 rounded-2xl border border-app-strong bg-app-surface-solid px-4 py-3 text-left text-sm font-medium text-app-primary outline-none transition-all hover:bg-app-surface-soft focus-visible:border-bluvi-purple/60 focus-visible:ring-2 focus-visible:ring-bluvi-purple/25 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 data-[pressed]:bg-app-surface-strong">
        <SelectValue className="truncate text-app-primary data-[placeholder]:text-app-muted" />
        <CaretDownIcon
          className="h-4 w-4 shrink-0 text-app-muted transition-transform group-data-[pressed]:rotate-180"
          weight="bold"
          aria-hidden="true"
        />
      </Button>

      {description && (
        <Text slot="description" className="sr-only">
          {description}
        </Text>
      )}

      <Popover
        placement="top start"
        style={{ width: 'var(--trigger-width)' }}
        className="z-[80] rounded-2xl border border-app-soft bg-app-surface-solid p-1.5 shadow-2xl outline-none"
      >
        <ListBox className="max-h-64 overflow-y-auto outline-none">
          {options.map((option) => (
            <ListBoxItem
              key={option.id}
              id={option.id}
              textValue={option.label}
              className="flex cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-app-secondary outline-none transition-colors data-[focused]:bg-[#E8E3FF] data-[focused]:text-[#4D55A6] data-[hovered]:bg-[#E8E3FF] data-[hovered]:text-[#4D55A6] data-[selected]:bg-bluvi-purple data-[selected]:text-white"
            >
              {({ isSelected }) => (
                <>
                  <span className="truncate">{option.label}</span>
                  {isSelected && <CheckIcon className="h-4 w-4 shrink-0" weight="bold" aria-hidden="true" />}
                </>
              )}
            </ListBoxItem>
          ))}
        </ListBox>
      </Popover>
    </Select>
  );
};

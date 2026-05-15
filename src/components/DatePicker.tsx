import {
    DatePicker as AriaDatePicker,
    type DatePickerProps as AriaDatePickerProps,
    type DateValue,
    Button,
    Calendar,
    CalendarCell,
    CalendarGrid,
    DateInput,
    DateSegment,
    Dialog,
    Group,
    Heading,
    Label,
    Popover,
    Text
} from 'react-aria-components';
import { CalendarBlankIcon,
    CaretLeftIcon,
    CaretRightIcon
} from '@phosphor-icons/react';
import { useMemo, useState } from 'react';
import { getLocalTimeZone, today } from '@internationalized/date';

export interface DatePickerProps<T extends DateValue> extends AriaDatePickerProps<T> {
    label?: string;
    description?: string;
    errorMessage?: string;
}

export function DatePicker<T extends DateValue>({ label, description, errorMessage, ...props }: DatePickerProps<T>) {
    const [focusedValue, setFocusedValue] = useState<DateValue | null>(null);
    const fallbackFocusValue = useMemo(() => {
        if (props.value) return props.value;
        if (props.placeholderValue) return props.placeholderValue;
        return today(getLocalTimeZone());
    }, [props.placeholderValue, props.value]);

    const jumpOneYear = (direction: 'prev' | 'next') => {
        const base = focusedValue ?? props.value ?? fallbackFocusValue;
        const years = direction === 'prev' ? -1 : 1;
        setFocusedValue(base.add({ years }));
    };

    return (
        <AriaDatePicker {...props} className="group flex flex-col gap-2 w-full max-w-sm font-sans">
        {label && <Label className="text-[#2d3a7d] font-bold text-lg ml-2">{label}</Label>}
        
        <Group className="flex items-center bg-white/40 backdrop-blur-md border border-white/60 shadow-sm rounded-2xl p-2 transition-all focus-within:ring-2 focus-within:ring-[#3f4a9b]/20">
            <DateInput className="flex-1 px-4 py-2 text-[#2d3a7d] text-lg outline-none bg-transparent flex gap-1">
            {(segment) => (
                <DateSegment 
                segment={segment} 
                className="focus:bg-[#3f4a9b] focus:text-white rounded px-0.5 outline-none transition-colors" 
                />
            )}
            </DateInput>

            <Button className="p-2 rounded-xl bg-[#3f4a9b]/10 text-[#3f4a9b] hover:bg-[#3f4a9b]/20 transition-colors outline-none cursor-pointer">
            <CalendarBlankIcon size={20} weight="bold" />
            </Button>
        </Group>

        {description && <Text slot="description" className="text-sm text-[#5b6bb1] ml-2 opacity-80">{description}</Text>}
        {errorMessage && <Text slot="errorMessage" className="text-red-500 text-xs ml-2 mt-1">{errorMessage}</Text>}

        <Popover className="w-[min(92vw,22rem)] sm:w-auto p-3 sm:p-4 rounded-[2rem] bg-white/95 backdrop-blur-xl border border-white/40 shadow-2xl animate-in fade-in zoom-in duration-200">
            <Dialog>
            <Calendar
                className="w-full text-[#2d3a7d]"
                focusedValue={focusedValue ?? undefined}
                onFocusChange={setFocusedValue}
            >
                <header className="flex items-center justify-between pb-3 sm:pb-4">
                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        onClick={() => jumpOneYear('prev')}
                        className="px-2 py-1 rounded-full hover:bg-gray-100 transition-colors text-xs sm:text-sm font-semibold"
                        aria-label="Ir al ano anterior"
                    >
                        {'<<'}
                    </button>
                    <Button slot="previous" className="p-2 rounded-full hover:bg-gray-100 transition-colors" aria-label="Ir al mes anterior">
                        <CaretLeftIcon size={20} weight="bold" />
                    </Button>
                </div>
                <Heading className="font-bold" />
                <div className="flex items-center gap-1">
                    <Button slot="next" className="p-2 rounded-full hover:bg-gray-100 transition-colors" aria-label="Ir al mes siguiente">
                        <CaretRightIcon size={20} weight="bold" />
                    </Button>
                    <button
                        type="button"
                        onClick={() => jumpOneYear('next')}
                        className="px-2 py-1 rounded-full hover:bg-gray-100 transition-colors text-xs sm:text-sm font-semibold"
                        aria-label="Ir al ano siguiente"
                    >
                        {'>>'}
                    </button>
                </div>
                </header>
                <CalendarGrid className="w-full border-separate border-spacing-0.5 sm:border-spacing-1 text-center">
                {(date) => (
                    <CalendarCell 
                    date={date} 
                    className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl cursor-pointer hover:bg-[#3f4a9b]/10 aria-selected:bg-[#3f4a9b] aria-selected:text-white data-[outside-month]:text-[#2d3a7d]/35 data-[outside-month]:hover:bg-transparent data-[outside-month]:hover:text-[#2d3a7d]/45 outline-none transition-all" 
                    />
                )}
                </CalendarGrid>
            </Calendar>
            </Dialog>
        </Popover>
        </AriaDatePicker>
    );
}

export type { DateValue };

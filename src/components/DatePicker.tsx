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
import { CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

export interface DatePickerProps<T extends DateValue> extends AriaDatePickerProps<T> {
    label?: string;
    description?: string;
    errorMessage?: string;
}

export function DatePicker<T extends DateValue>({ label, description, errorMessage, ...props }: DatePickerProps<T>) {
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
            <CalendarIcon size={20} />
            </Button>
        </Group>

        {description && <Text slot="description" className="text-sm text-[#5b6bb1] ml-2 opacity-80">{description}</Text>}
        {errorMessage && <Text slot="errorMessage" className="text-red-500 text-xs ml-2 mt-1">{errorMessage}</Text>}

        <Popover className="p-4 rounded-[2rem] bg-white/95 backdrop-blur-xl border border-white/40 shadow-2xl animate-in fade-in zoom-in duration-200">
            <Dialog>
            <Calendar className="text-[#2d3a7d]">
                <header className="flex items-center justify-between pb-4">
                <Button slot="previous" className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <ChevronLeft size={20}/>
                </Button>
                <Heading className="font-bold" />
                <Button slot="next" className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <ChevronRight size={20}/>
                </Button>
                </header>
                <CalendarGrid className="border-separate border-spacing-1 text-center">
                {(date) => (
                    <CalendarCell 
                    date={date} 
                    className="w-10 h-10 flex items-center justify-center rounded-xl cursor-pointer hover:bg-[#3f4a9b]/10 aria-selected:bg-[#3f4a9b] aria-selected:text-white outline-none transition-all" 
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
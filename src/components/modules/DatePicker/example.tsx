import React from "react";
import { Popover, PopoverTrigger, PopoverContent } from "../../atoms/popover";
import { Button } from "../../atoms/button";
import DatePicker from ".";

function DatePickerExample() {
  return (
    <Popover>
      <PopoverTrigger>
        <Button>Open DatePicker</Button>
      </PopoverTrigger>
      <PopoverContent className="w-82">
        <DatePicker onChange={(date) => console.log({ date })} />
      </PopoverContent>
    </Popover>
  );
}

export default DatePickerExample;

import React from "react";
import { Popover, PopoverTrigger, PopoverContent } from ".";

function PopoverExample() {
  return (
    <Popover>
      <PopoverTrigger>On Click</PopoverTrigger>
      <PopoverContent>Content</PopoverContent>
    </Popover>
  );
}

export default PopoverExample;

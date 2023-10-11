import React from "react";
import { Button } from "./components/atoms/button";
import DatePicker from "./components/modules/DatePicker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./components/atoms/popover";

function App() {
  return (
    <div className="container min-h-screen flex justify-center items-center">
      <Popover>
        <PopoverTrigger>Open DatePicker</PopoverTrigger>
        <PopoverContent className="w-82">
          <DatePicker />
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default App;

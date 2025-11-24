import 'react-datepicker/dist/react-datepicker.css';

import ReactDatePicker, { ReactDatePickerProps } from 'react-datepicker';
import styled from 'styled-components';

export type DatePickerProps = ReactDatePickerProps;

export function DatePicker(props: DatePickerProps) {
  return (
    <DatePickerRoot>
      <ReactDatePicker
        {...props}
        calendarClassName="date-picker-calender"
        className="date-picker-input"
      ></ReactDatePicker>
    </DatePickerRoot>
  );
}

const DatePickerRoot = styled.div`
  .date-picker-calender {
    .react-datepicker__triangle {
      left: 40% !important;
      transform: translate(-50%, 0) !important;
    }
  }

  .date-picker-input {
    /* make the date input itself equal the requested centered width */
    width: 60dvw;
    margin: 0 auto; /* center inside container */
    height: 3.125rem; /* ~50px */
    display: flex;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    border-radius: 0.5rem; /* 8px */
    border-width: 1px;
    padding: 0.85rem 0.75rem; /* relative padding */
    box-sizing: border-box;

    &:focus-within {
      outline: -webkit-focus-ring-color auto 1px;
    }
  }
`;

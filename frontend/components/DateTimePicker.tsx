import RNDateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { TouchableOpacity, Text } from 'react-native';

const CustomDateTimePicker = ({value = new Date(), onChange = (date: Date) => {}}) => {
  const [showPicker, setShowPicker] = useState(false);

  const handlePickerOpen = () => {
    setShowPicker(true);
  };

  const handleDateChange = (event: any, date: any) => {
    if (date !== undefined) {
        onChange(date);
    }
    setShowPicker(false);
  };

  return (
    <>
      <TouchableOpacity onPress={handlePickerOpen}>
        <Text>Open Date Picker</Text>
      </TouchableOpacity>

      {showPicker && (
        <RNDateTimePicker
            mode="date"
            onChange={handleDateChange}
            value={value}
            // adicionar restrição para menores de alguma idade?
        />
      )}
    </>
  );
};

export default CustomDateTimePicker;
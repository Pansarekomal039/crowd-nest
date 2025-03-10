import React, { useState } from 'react';
import { View, TouchableOpacity, Modal, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from './style';
import { StyledTextInput, StyledInputLabel, LeftIcon, RightIcon, StyledButton, ButtonText } from './style';

const { brand, darkLight, primary } = Colors;

const PickerInput = ({
  label,
  icon,
  items,
  selectedValue,
  onValueChange,
  placeholder,
  mode = 'picker',
  style,
  error,
  iconColor = brand,
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [time, setTime] = useState(new Date());

  const formatTime = (date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const handleTimeChange = (event, selected) => {
    setShowPicker(false);
    if (selected) {
      setTime(selected);
      onValueChange(formatTime(selected));
    }
  };

  return (
    <View style={style}>
      <StyledInputLabel>{label}</StyledInputLabel>
      <TouchableOpacity 
        onPress={() => setShowPicker(true)}
        accessibilityLabel={`Select ${label}`}
        accessibilityRole="button"
      >
        <View pointerEvents="none">
          <StyledTextInput
            editable={false}
            placeholder={placeholder}
            value={
              mode === 'time'
                ? selectedValue
                : items.find(item => item.value === selectedValue)?.label || ''
            }
            style={{ borderColor: error ? '#ff0000' : brand }}
          />
          {icon && (
            <LeftIcon>
              <MaterialIcons name={icon} size={24} color={iconColor} />
            </LeftIcon>
          )}
          <RightIcon>
            <MaterialIcons 
              name={error ? 'error' : 'keyboard-arrow-down'} 
              size={24} 
              color={error ? '#ff0000' : darkLight} 
            />
          </RightIcon>
        </View>
      </TouchableOpacity>

      <Modal
        visible={showPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPicker(false)}
      >
        <View style={{ 
          flex: 1, 
          justifyContent: 'flex-end', 
          backgroundColor: 'rgba(0,0,0,0.5)' 
        }}>
          <View style={{ 
            backgroundColor: 'white', 
            padding: 20,
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15
          }}>
            {mode === 'picker' ? (
              <>
                <Picker
                  selectedValue={selectedValue}
                  onValueChange={(itemValue) => {
                    onValueChange(itemValue);
                    setShowPicker(false);
                  }}
                >
                  {items.map((item) => (
                    <Picker.Item
                      key={item.value}
                      label={item.label}
                      value={item.value}
                    />
                  ))}
                </Picker>
                <StyledButton onPress={() => setShowPicker(false)}>
                  <ButtonText>Done</ButtonText>
                </StyledButton>
              </>
            ) : (
              <>
                <DateTimePicker
                  value={time}
                  mode="time"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleTimeChange}
                  minuteInterval={15}
                />
                {Platform.OS === 'ios' && (
                  <StyledButton onPress={() => setShowPicker(false)}>
                    <ButtonText>Done</ButtonText>
                  </StyledButton>
                )}
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default PickerInput;
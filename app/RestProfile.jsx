import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Formik } from 'formik';
import { Octicons } from "@expo/vector-icons";
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import RNPickerSelect from 'react-native-picker-select';
import {
    StyledContainer,
    InnerContainer,
    StyledFormArea,
    LeftIcon,
    StyledInputLabel,
    StyledTextInput,
    Colors,
    StyledButton,
    ButtonText,
    Line,
    PageTitle,
} from '../components/style';
import { View, TouchableOpacity, ActivityIndicator, Alert, StyleSheet,Text } from 'react-native';
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';
import PropTypes from 'prop-types';
import * as yup from 'yup';

// RestProfile.propTypes = {
//     navigation: PropTypes.object.isRequired,
// };
const { brand, darkLight, primary } = Colors;

const formatTime = (date) => {
    if (!date || !(date instanceof Date) || isNaN(date)) return '';  // Check for invalid Date
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });
};

const restProfileSchema = yup.object().shape({
    fullName: yup.string().required('Restaurent name is required'),
    cuisine: yup.string().required('Cuisine type is required'),
    closeTime: yup.date()
  .required('Closing time is required')
  .test(
    'is-after-open',
    'Closing time must be after opening time',
    function (value) {
      return value > this.parent.openTime;
    }
  ),
    closeTime: yup.date().required('Closing time is required')
    .when('openTime', (openTime,schema)=>{
        return schema.test({
            test: closeTime => closeTime > openTime,
        message: 'Closing time must be after opening time'      
      });
    }),
    street: yup.string().required('Street name is required'),
    city: yup.string().required('City is required'),
    states: yup.string().required('State is required'),
    pinCode: yup.string().required('pinCode is required')
    .required('Postal code is required')
    .matches(/^[0-9]{5}(?:-[0-9]{4})?$/, 'Invalid postal code'),
    no_of_guest: yup.number().required('Capacity  is required')
    .min(1, 'Must be at least 1')
    .integer('must be a whole number'),
    specialRequest: yup.string()
});

const RestProfile = ({ navigation }) => {
    const [isPickerVisible, setPickerVisibility] = useState(false);
    const [currentPickerType, setCurrentPickerType] = useState('open');

    const [address, setAddress] = useState({
        street: '',
        city: '',
        states: '',
        pinCode: '',
    });

    const handleAddressChange = (field, value) => {
        setAddress(prevState => ({
            ...prevState,
            [field]: value,
        }));
    };

    const cuisineOptions = [
        { label: 'Gujrati', value: 'Gujrati' },
        { label: 'Maharashtrian ', value: 'Maharashtrian ' },
        { label: 'Punjabi', value: 'Pinjabi' },
        { label: 'South Indian', value: 'South Indian' },
        { label: 'East Indian', value: 'East Indian' },
        { label: 'Thai', value: 'thai' },
        { label: 'Rajsthani', value: 'Rajsthani' },
    ];

    return (
        <KeyboardAvoidingWrapper>
            <StyledContainer>
                <StatusBar style="dark" />
                <InnerContainer>
                    <PageTitle>Restaurant Reservation</PageTitle>
                    <Line />

                    <Formik
                        initialValues={{
                            date: new Date(),
                            time: new Date(),
                            openTime: new Date(),  
                            closeTime: new Date(), 
                            no_of_guest: '',
                            specialRequest: '',
                            fullName: '',
                            street: address.street,
                            city: address.city,
                            states: address.states,
                            pinCode: address.pinCode,
                            cuisine: '',
                        }}
                        validationSchema={restProfileSchema}
                        onSubmit={(values, { setSubmitting }) => {
                            const formattedValues = {
                                ...values,
                                date: values.date.toDateString(),
                                time: formatTime(values.time),
                                openTime: formatTime(values.openTime),
                                closeTime: formatTime(values.closeTime)
                            };
                        
                            if (!values.fullName || !values.no_of_guest || !values.specialRequest) {
                                Alert.alert('Error', 'Please fill all fields');
                                setSubmitting(false);
                            } else {
                                const newRestaurant = {
                                    id: Date.now().toString(),
                                    name: values.fullName,
                                    cuisine: values.cuisine,
                                    capacity: values.no_of_guest,
                                    timing: `${formatTime(values.openTime)} - ${formatTime(values.closeTime)}`,
                                    address: `${values.street}, ${values.city}, ${values.states} ${values.pinCode}`
                                  };
                                Alert.alert(
                                    "Reservation Confirmed", 
                                    `Hi ${values.fullName}, Your reservation for ${values.no_of_guest} guests is confirmed!`,
                                    [
                                        { 
                                            text: "OK", 
                                            onPress: () => navigation.navigate('RestList',{newRestaurant: {
                                                id: Date.now().toString(),
                                                name: values.fullName,
                                                cuisine: values.cuisine,
                                                capacity: values.no_of_guest,
                                                timing: `${formatTime(values.openTime)} - ${formatTime(values.closeTime)}`,
                                                address: `${values.street}, ${values.city}, ${values.states} ${values.pinCode}`
                                              }
                                            })
                                        }
                                    ]
                                );
                                setSubmitting(false);
                            }
                        }}
                                 >
                        {({ handleChange, handleBlur, handleSubmit, values, setFieldValue, isSubmitting, errors, touched}) => (
                            <StyledFormArea>
                                <MyTextInput
                                    label="Restaurant Name"
                                    icon="person"
                                    error={touched.fullName && errors.fullName}
                                    placeholder="Durga Cafe"
                                    placeholderTextColor={darkLight}
                                    onChangeText={handleChange('fullName')}
                                    onBlur={handleBlur('fullName')}
                                    value={values.fullName}
                                />

                                <StyledInputLabel>Cuisine</StyledInputLabel>
                                <RNPickerSelect
                                    placeholder={{
                                        label: 'Select Cuisine...',
                                        value: null,
                                    }}
                                    onValueChange={handleChange('cuisine')}
                                    onBlur={handleBlur('cuisine')}
                                    value={values.cuisine}
                                    items={cuisineOptions}
                                    style={{
                                        inputAndroid: {
                                            fontSize: 18,
                                            paddingVertical: 12,
                                            paddingHorizontal: 10,
                                            borderWidth: 1,
                                            height: 60,
                                            borderColor: darkLight,
                                            borderRadius: 4,
                                            color: darkLight,
                                            paddingRight: 30,
                                            backgroundColor: '#e0e0e0',
                                        },
                                    }}
                                />
                                {/* After RNPickerSelect */}
                                {errors.cuisine && touched.cuisine && (
                                 <Text style={styles.errorText}>{errors.cuisine}</Text>
                                 )}

                                <MyTextInput
                                    label="Open Time"
                                    icon="clock"
                                    error={touched.openTime && errors.openTime}
                                    placeholder="HH:MM AM"
                                    placeholderTextColor={darkLight}
                                    value={formatTime(values.openTime)}  
                                    // onChangeText={handleChange('openTime')}
                                    onBlur={handleBlur('openTime')}
                                    onPress={() => {
                                        setCurrentPickerType('open');
                                        setPickerVisibility(true);
                                    }}
                                />

                                <MyTextInput
                                    label="Close Time"
                                    icon="clock"
                                    error={touched.closeTime && errors.closeTime}
                                    placeholder="HH:MM PM"
                                    placeholderTextColor={darkLight}
                                    value={formatTime(values.closeTime)} 
                                    // onChangeText={handleChange('closeTime')}
                                    onBlur={handleBlur('closeTime')}
                                    onPress={() => {
                                        setCurrentPickerType('close');
                                        setPickerVisibility(true);
                                    }}
                                />

                                <MyTextInput
                                    label="Street Address"
                                    icon="location"
                                    error={touched.street && errors.street}
                                    placeholder="Street"
                                    placeholderTextColor={darkLight}
                                    onChangeText={(value) => {
                                        handleChange('street')(value);
                                        handleAddressChange('street', value);
                                    }}
                                    onBlur={handleBlur('street')}
                                    value={values.street}
                                />

                                <MyTextInput
                                    label="City"
                                    icon="location"
                                    error={touched.city && errors.city}
                                    placeholder="City"
                                    placeholderTextColor={darkLight}
                                    onChangeText={(value) => {
                                        handleChange('city')(value);
                                        handleAddressChange('city', value);
                                    }}
                                    onBlur={handleBlur('city')}
                                    value={values.city}
                                />

                                <MyTextInput
                                    label="State"
                                    icon="location"
                                    error={touched.states && errors.states}
                                    placeholder="State"
                                    placeholderTextColor={darkLight}
                                    onChangeText={(value) => {
                                        handleChange('states')(value);
                                        handleAddressChange('states', value);
                                    }}
                                    onBlur={handleBlur('states')}
                                    value={values.states}
                                />

                                <MyTextInput
                                    label="Postal Code"
                                    icon="location"
                                    error={touched.pinCode && errors.pinCode}
                                    placeholder="12345"
                                    placeholderTextColor={darkLight}
                                    onChangeText={(value) => {
                                        handleChange('pinCode')(value);
                                        handleAddressChange('pinCode', value);
                                    }}
                                    onBlur={handleBlur('pinCode')}
                                    value={values.pinCode}
                                    keyboardType="numeric"
                                />

                                <MyTextInput
                                    label="Capacity of Guests"
                                    icon="people"
                                    error={touched.no_of_guest && errors.no_of_guest}
                                    placeholder="50"
                                    placeholderTextColor={darkLight}
                                    onChangeText={handleChange('no_of_guest')}
                                    onBlur={handleBlur('no_of_guest')}
                                    value={values.no_of_guest}
                                    keyboardType="numeric"
                                />

                                <MyTextInput
                                    label="Special Feature"
                                    icon="pencil"
                                    placeholder="special feature"
                                    placeholderTextColor={darkLight}
                                    onChangeText={handleChange('specialRequest')}
                                    onBlur={handleBlur('specialRequest')}
                                    value={values.specialRequest}
                                    multiline
                                />

                                {!isSubmitting ? (
                                    <StyledButton onPress={handleSubmit}>
                                        <ButtonText>Reserve</ButtonText>
                                    </StyledButton>
                                ) : (
                                    <StyledButton disabled={true}>
                                        <ActivityIndicator size="large" color={primary} />
                                    </StyledButton>
                                )}

                                <DateTimePickerModal
                                    isVisible={isPickerVisible}
                                    mode="time"
                                    onConfirm={(selectedTime) => {
                                        if (currentPickerType === 'open') {
                                            setFieldValue('openTime', selectedTime);
                                        } else {
                                            setFieldValue('closeTime', selectedTime);
                                        }
                                        setPickerVisibility(false);
                                    }}
                                    onCancel={() => setPickerVisibility(false)}
                                    date={currentPickerType === 'open' ? values.openTime : values.closeTime}
                                    headerTextIOS={`Select ${currentPickerType === 'open' ? 'Opening' : 'Closing'} Time`}
                                />
                            </StyledFormArea>
                        )}
                    </Formik>
                </InnerContainer>
            </StyledContainer>
        </KeyboardAvoidingWrapper>
    );
};
RestProfile.propTypes = {
    navigation: PropTypes.object,
};

import { ErrorMessage } from 'formik';

const MyTextInput = ({ label, icon,error, onPress, ...props }) => (
    <View>
        <LeftIcon>
            <Octicons name={icon} size={30} color={brand} />
        </LeftIcon>
        <StyledInputLabel>{label}</StyledInputLabel>
        <TouchableOpacity onPress={onPress}>
            <StyledTextInput
                {...props}
                editable={!!props.onChangeText} 
                style={[props.style,
                     !props.onChangeText && { color: darkLight }]}
            />
        </TouchableOpacity>
        {/* <ErrorMessage>
            {msg => <Text style = {{ color: 'red', fontSize: 12 }}>{msg}</Text>}
        </ErrorMessage> */}
        {error && <Text style={styles.errorText}>
            {error}
        </Text> }
    </View>
);

export default RestProfile;

MyTextInput.propTypes = {
    label: PropTypes.string,
    icon: PropTypes.string,
    onPress: PropTypes.func,
    onChangeText: PropTypes.func,
    style: PropTypes.object,
  };

  const styles = StyleSheet.create({
    errorText: {
      color: 'red',
      fontSize: 12,
      marginTop: 4,
      marginLeft: 10,
    },
    pickerError: {
      borderColor: 'red',
      borderWidth: 1,
      borderRadius: 4,
    }
  });

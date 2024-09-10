import { View, Text, ScrollView, TouchableOpacity, Image, Alert, Platform } from 'react-native';
import React, { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';
import { createTravelEntry } from '../../lib/appwrite'; // Adjust the import path as necessary
import { useGlobalContext } from '../../context/GlobalProvider';
import { router } from 'expo-router';
import { icons } from '../../constants';

const CreateEntry = () => {
  const { user } = useGlobalContext();
  const [newEntry, setNewEntry] = useState({ title: '', content: '', location: '', images: [], date: new Date().toISOString() });
  const [selectedImages, setSelectedImages] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: true // Allow multiple image selection
    });

    if (!result.canceled) {
      const newImages = result.assets.map(asset => asset.uri);
      setSelectedImages(prevImages => [...prevImages, ...newImages]);
      setNewEntry({ ...newEntry, images: [...newImages] });
    }
  };

  const handleDateChange = (event, date) => {
    if (event.type === 'set') {
      const newDate = date || new Date();
      setSelectedDate(newDate);
      setNewEntry({ ...newEntry, date: newDate.toISOString() });
      setShowDatePicker(false);
    } else {
      setShowDatePicker(false);
    }
  };

  const openDatePicker = () => {
    if (Platform.OS === 'ios') {
      setShowDatePicker(true);
    } else {
      import('@react-native-community/datetimepicker').then(
        ({ DateTimePickerAndroid }) => {
          DateTimePickerAndroid.open({
            mode: 'date',
            value: selectedDate,
            onChange: (event, date) => handleDateChange(event, date),
          });
        }
      );
    }
  };

  const handleCreateEntry = async () => {
    try {
      if (newEntry.title && newEntry.content && newEntry.location) {
        await createTravelEntry(newEntry.title, newEntry.content, newEntry.location, newEntry.images, newEntry.date);
        setNewEntry({ title: '', content: '', location: '', images: [], date: new Date().toISOString() });
        setSelectedImages([]); // Clear selected images after submission
        router.back(); // Go back to the Home screen after creating the entry
      } else {
        Alert.alert('Error', 'Please fill in all fields.');
      }
    } catch (error) {
      console.error('Error creating travel entry:', error);
      Alert.alert('Error', 'Failed to create travel entry.');
    }
  };


  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 16 }} className="bg-primary">
      <View className="px-4 py-6 rounded-lg shadow-md">
        <Text className="text-2xl font-psemibold text-gray-200 mb-4">Create New Travel Entry</Text>
        <FormField
          title="Title"
          value={newEntry.title}
          placeholder="Enter title"
          handleChangeText={(text) => setNewEntry({ ...newEntry, title: text })}
          otherStyles="mt-4"
        />
        <FormField
          title="Content"
          value={newEntry.content}
          placeholder="Enter content"
          handleChangeText={(text) => setNewEntry({ ...newEntry, content: text })}
          otherStyles="mt-4"
        />
        <FormField
          title="Location"
          value={newEntry.location}
          placeholder="Enter location"
          handleChangeText={(text) => setNewEntry({ ...newEntry, location: text })}
          otherStyles="mt-4"
        />

        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">Date</Text>
          <TouchableOpacity onPress={openDatePicker} className="w-full h-16 px-4 bg-black-100 rounded-2xl justify-center border-2 border-black-200">
            <Text className="text-white font-psemibold text-base">{selectedDate.toDateString()}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDateChange}
            />
          )}
        </View>

        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">Images</Text>
          <TouchableOpacity onPress={handleImagePick}>
            {selectedImages.length > 0 ? (
              <ScrollView horizontal contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {selectedImages.map((uri, index) => (
                  <Image
                    key={index}
                    source={{ uri }}
                    className="w-32 h-32 rounded-2xl mr-2"
                    resizeMode='cover'
                  />
                ))}
              </ScrollView>
            ) : (
              <View className="w-full h-16 px-4 bg-black-100 rounded-2xl justify-center items-center border-2 border-black-100 flex-row space-x-2">
                <Image 
                  source={icons.upload}
                  resizeMode='contain'
                  className="h-5 w-5"
                />
                <Text className="text-sm text-gray-100 font-pmedium">Choose files</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <CustomButton
          title="Create Entry"
          handlePress={handleCreateEntry}
          containerStyles="mt-6"
        />
      </View>
    </ScrollView>
  );
};

export default CreateEntry;

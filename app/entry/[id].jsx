import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as ImagePicker from 'expo-image-picker';
import { getTravelEntry, updateTravelEntry, deleteTravelEntry } from "../../lib/appwrite";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import { icons } from "../../constants";

const EntryDetails = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [entry, setEntry] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        const data = await getTravelEntry(id);
        setEntry(data);
        setSelectedImages(data.images || []);
      } catch (error) {
        console.error("Error fetching entry:", error);
        Alert.alert("Error", "Failed to fetch entry.");
      }
    };

    fetchEntry();
  }, [id]);

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: true
    });

    if (!result.canceled) {
      const newImages = result.assets.map(asset => asset.uri);
      setSelectedImages(prevImages => [...prevImages, ...newImages]);
      setEntry(prevEntry => ({ ...prevEntry, images: [...prevEntry.images, ...newImages] }));
    }
  };

  const handleImageDelete = (index) => {
    const updatedImages = selectedImages.filter((_, i) => i !== index);
    setSelectedImages(updatedImages);
    setEntry(prevEntry => ({ ...prevEntry, images: updatedImages }));
  };

  const handleUpdate = async () => {
    try {
      await updateTravelEntry(id, entry.title, entry.content, entry.location, entry.images);
      Alert.alert("Success", "Entry updated successfully.");
      router.back();
    } catch (error) {
      console.error("Error updating entry:", error);
      Alert.alert("Error", "Failed to update entry.");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTravelEntry(id);
      Alert.alert("Success", "Entry deleted successfully.");
      router.back();
    } catch (error) {
      console.error("Error deleting entry:", error);
      Alert.alert("Error", "Failed to delete entry.");
    }
  };

  if (!entry) {
    return (
      <View className="flex-1 justify-center items-center bg-primary">
        <ActivityIndicator size="large" color="#ffffff" />
        <Text className="text-white mt-4">Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 16 }} className="bg-primary">
      <View className="px-4 py-6 rounded-lg shadow-md">
        <Text className="text-2xl font-semibold text-gray-200 mb-4">Edit Travel Entry</Text>
        <FormField
          title="Title"
          value={entry.title}
          placeholder="Enter title"
          handleChangeText={(text) => setEntry({ ...entry, title: text })}
          otherStyles="mt-4"
        />
        <FormField
          title="Content"
          value={entry.content}
          placeholder="Enter content"
          handleChangeText={(text) => setEntry({ ...entry, content: text })}
          otherStyles="mt-4"
        />
        <FormField
          title="Location"
          value={entry.location}
          placeholder="Enter location"
          handleChangeText={(text) => setEntry({ ...entry, location: text })}
          otherStyles="mt-4"
        />

        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-medium">Images</Text>
          {selectedImages.length > 0 ? (
            <ScrollView horizontal contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {selectedImages.map((uri, index) => (
                <View key={index} className="relative mr-2">
                  <Image
                    source={{ uri }}
                    className="w-32 h-32 rounded-2xl"
                    resizeMode='cover'
                  />
                  <TouchableOpacity
                    onPress={() => handleImageDelete(index)}
                    className="absolute top-0 right-0 bg-red-500 rounded-full p-1"
                  >
                    <Text className="text-white">X</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          ) : (
            <Text className="text-sm text-gray-100 font-medium">No images selected</Text>
          )}
        </View>

        <CustomButton
          title="Pick Images"
          handlePress={handleImagePick}
          containerStyles="mt-6"
        />

        <CustomButton
          title="Update Entry"
          handlePress={handleUpdate}
          containerStyles="mt-6"
        />
        <CustomButton
          title="Delete Entry"
          handlePress={handleDelete}
          containerStyles="mt-6"
          buttonStyles="bg-red-500"
        />
      </View>
    </ScrollView>
  );
};

export default EntryDetails;

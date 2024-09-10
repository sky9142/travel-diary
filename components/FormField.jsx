import { Image, Text, TextInput, View, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { icons } from "../constants";

const FormField = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-base text-gray-100 font-pmedium">{title}</Text>
      <View className={`w-full ${title === "Content" ? 'min-h-40' : 'h-16'} px-4 bg-black-100 border-2 border-black-200 rounded-2xl focus:border-secondary items-center flex-row`}>
        <TextInput
          className="flex-1 text-white font-psemibold text-base"
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#7b7b8b"
          onChangeText={handleChangeText}
          secureTextEntry={title === "Password" && !showPassword}
          multiline={title === "Content"}
          numberOfLines={title === "Content" ? 20 : 1} // Adjust the number of lines for the Content field
          textAlignVertical={title === "Content" ? 'top' : 'center'} // Align text to the top for multi-line input
        />

        {title === "Password" && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image
              source={!showPassword ? icons.eye : icons.eyeHide}
              className="w-6 h-6"
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;

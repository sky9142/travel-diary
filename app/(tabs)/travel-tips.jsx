import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, Text, View, Image, Alert } from "react-native";
import { useGlobalContext } from "../../context/GlobalProvider";
import { images } from "../../constants";
import { getTravelTips } from "../../lib/appwrite";
import EmptyState from "../../components/EmptyState";

const TravelTips = () => {
  const { user } = useGlobalContext();
  const [tips, setTips] = useState([]);

  useEffect(() => {
    const fetchTravelTips = async () => {
      try {
        const tips = await getTravelTips();
        setTips(tips);
      } catch (error) {
        console.error("Error fetching travel tips:", error);
        Alert.alert("Error", "Failed to fetch travel tips.");
      }
    };

    fetchTravelTips();
  }, []);

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView contentContainerStyle={{ paddingBottom: 16 }}>
        <View className="my-6 px-4 space-y-6">
          <View className="justify-between items-start flex-row">
            <View>
              <Text className="font-pmedium text-sm text-gray-100">Travel Tips</Text>
              <Text className="text-2xl font-psemibold text-white">For Your Next Journey</Text>
            </View>
          </View>

          {tips.length > 0 ? (
            tips.map((tip, index) => (
              <View key={index} className="px-4 py-2 bg-white rounded-lg shadow-md mb-2">
                <Text className="text-lg font-semibold">{tip.title}</Text>
                <Text className="mt-2">{tip.content}</Text>
              </View>
            ))
          ) : (
            <EmptyState
              title="No Tips Found"
              subtitle="Check back later for more travel tips!"
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TravelTips;

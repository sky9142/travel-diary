import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  View,
  Image,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import EmptyState from "../../components/EmptyState";
import CustomButton from "../../components/CustomButton";
import { getUserTravelEntries } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";
import { useRouter } from "expo-router";
import moment from "moment";

const Home = () => {
  const { user } = useGlobalContext();
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTravelEntries = async () => {
    try {
      const entries = await getUserTravelEntries();

      // Sort entries by created_at date in descending order
      const sortedEntries = entries.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      setPosts(sortedEntries);
    } catch (error) {
      console.error("Error fetching travel entries:", error);
      Alert.alert("Error", "Failed to fetch travel entries.");
    }
  };

  useEffect(() => {
    fetchTravelEntries();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTravelEntries();
    setRefreshing(false);
  };

  const handleEntryPress = (id) => {
    router.push(`/entry/${id}`);
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 16 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View className="my-6 px-4 space-y-6">
          <View className="justify-between items-start flex-row">
            <View>
              <Text className="font-pmedium text-sm text-gray-100">Welcome Back,</Text>
              <Text className="text-2xl font-psemibold text-white">{user?.username}</Text>
            </View>
            <View className="mt-1.5">
              <Image source={images.logo} className="w-[150px] -top-8" resizeMode="contain" />
            </View>
          </View>

          <CustomButton
            title="Create New Entry"
            handlePress={() => router.push('/create-entry')}
            containerStyles="mb-4"
          />

          {posts.length > 0 ? (
            posts.map((item) => (
              <TouchableOpacity key={item.$id} onPress={() => handleEntryPress(item.$id)}>
                <View className="px-4 py-2 bg-white rounded-lg shadow-md mb-2">
                  <Text className="text-sm text-gray-500">{moment(item.created_at).format("MMMM D, YYYY")}</Text>
                  <Text className="text-lg font-semibold">{item.title}</Text>
                  <Text className="text-gray-600">{item.location}</Text>
                  <Text className="mt-2">{item.content}</Text>
                  <View className="mt-2 flex-row flex-wrap">
                    {item.images.map((imageUrl, index) => (
                      <Image
                        key={index}
                        source={{ uri: imageUrl }}
                        style={{ width: 100, height: 100, marginVertical: 4, marginRight: 4 }}
                      />
                    ))}
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <EmptyState
              title="No Trips Found"
              subtitle="Don't worry, We are looking forward to your trips!"
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;

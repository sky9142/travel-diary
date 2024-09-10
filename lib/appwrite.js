import {
  Account,
  Client,
  ID,
  Avatars,
  Databases,
  Query,
  Storage,
} from "react-native-appwrite";

export const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.daddycoders.travel_diary",
  projectId: "669a3bc20008a25accc9",
  storageId: "669a490f00051fa5997e",
  databaseId: "669a3e54001a4306fea8",
  userCollectionId: "669a3e8c0029c962162a",
  travelentriesCollectionId: "669a40c60001336e9343",
  travelTipsId: "669a40d5001d42fdeeb2",
};

const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint) // Your Appwrite Endpoint
  .setProject(appwriteConfig.projectId) // Your project ID
  .setPlatform(appwriteConfig.platform); // Your application ID or bundle ID.

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

export const createUser = async (email, password, username) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(username);

    await signIn(email, password);

    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email,
        username,
        avatar: avatarUrl,
      }
    );

    return newUser;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export const signIn = async (email, password) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);

    return session;
  } catch (error) {
    throw new Error(error);
  }
};

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
  }
};

export const signOut = async () => {
  try {
    const session = await account.deleteSession("current");

    return session;
  } catch (error) {
    throw new Error(error);
  }
};

// Travel Entries Management

export const createTravelEntry = async (title, content, location, images, date) => {
  try {
    const currentUser = await getCurrentUser();

    const newTravelEntry = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.travelentriesCollectionId,
      ID.unique(),
      {
        title,
        content,
        location,
        images,
        traveler: currentUser.$id,
        created_at: date // Add the date field here
      }
    );

    return newTravelEntry;
  } catch (error) {
    console.error('Error creating travel entry:', error);
    throw new Error(error);
  }
};

export const getUserTravelEntries = async () => {
  try {
    const currentUser = await getCurrentUser();

    const travelEntries = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.travelentriesCollectionId,
      [Query.equal('traveler', currentUser.$id)]
    );

    return travelEntries.documents;
  } catch (error) {
    console.error('Error fetching travel entries:', error);
    throw new Error(error);
  }
};

export const getTravelEntry = async (entryId) => {
  try {
    const entry = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.travelentriesCollectionId,
      entryId
    );
    return entry;
  } catch (error) {
    console.error('Error fetching travel entry:', error);
    throw new Error(error);
  }
};

export const updateTravelEntry = async (entryId, title, content, location, images) => {
  try {
    const updatedEntry = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.travelentriesCollectionId,
      entryId,
      { title, content, location, images }
    );
    return updatedEntry;
  } catch (error) {
    console.error('Error updating travel entry:', error);
    throw new Error(error);
  }
};

export const deleteTravelEntry = async (entryId) => {
  try {
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.travelentriesCollectionId,
      entryId
    );
  } catch (error) {
    console.error('Error deleting travel entry:', error);
    throw new Error(error);
  }
};

export const getTravelTips = async () => {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.travelTipsId
    );
    return response.documents;
  } catch (error) {
    console.error("Error fetching travel tips:", error);
    throw error;
  }
};

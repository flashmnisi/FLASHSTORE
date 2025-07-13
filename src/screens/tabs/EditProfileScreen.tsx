import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {RootState, AppDispatch} from '../../redux/store';
import {updateProfile} from '../../redux/slices/AuthSlice';
import {useNavigation} from '@react-navigation/native';

const EditProfileScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const {user, loading} = useSelector((state: RootState) => state.auth);

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  const handleUpdate = async () => {
    if (!name || !email) {
      Alert.alert('All fields except password are required');
      return;
    }

    try {
      await dispatch(updateProfile({name, email})).unwrap();
      Alert.alert('Success', 'Profile updated successfully');
      navigation.goBack();
    } catch (err: any) {
      Alert.alert('Update Failed', err || 'Something went wrong');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white p-4">
      <Text className="text-xl font-bold mb-4 text-center">Edit Profile</Text>

      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Name"
        className="border p-3 rounded-lg mb-3 m-2"
      />
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        keyboardType="email-address"
        className="border p-3 rounded-lg mb-3 m-2"
      />

      <View className="flex-row gap-4 justify-between m-2">
        <TouchableOpacity
          onPress={navigation.goBack}
          disabled={loading}
          className="bg-red-700 p-4 flex-1 rounded-lg mt-2">
          <Text className="text-white text-center font-bold">Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleUpdate}
          disabled={loading}
          className="bg-blue-600 p-4 flex-1 rounded-lg mt-2">
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white text-center font-bold">
              Update Profile
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default EditProfileScreen;

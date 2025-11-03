// import React from "react";
// import { View } from "react-native";
// import { Text } from "react-native-paper";

// export default function Profile(){
//   return (
//     <View style={{ flex:1, alignItems:"center", justifyContent:"center" }}>
//       <Text>Profile (coming soon)</Text>
//     </View>
//   );
// }


import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, ScrollView, Alert } from "react-native";

export default function UserScreen() {
  const [user, setUser] = useState({
    Password: "",
    Email: "",
    MobileNumber: "",
    DateOfBirth: "",
    DoctorsEmail: ""
  });
  const [loading, setLoading] = useState(true);

  const username = "Maria"; // replace or make dynamic
  const backendURL = "http://192.168.56.1:3000/ms-api/user"; // replace YOUR_PC_IP with your PC's IP

  // Fetch user data
  useEffect(() => {
    fetch(`${backendURL}?username=${username}`)
      .then(res => res.json())
      .then(data => {
        setUser(data);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        Alert.alert("Error", "Failed to fetch user data");
        setLoading(false);
      });
  }, []);

  if (loading) return <Text>Loading...</Text>;

  const handleUpdate = () => {
    fetch(`${backendURL}?username=${username}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user)
    })
      .then(res => res.json())
      .then(data => {
        if (data.ok) {
          Alert.alert("Success", "User updated successfully");
        } else {
          Alert.alert("Error", data.error || "Update failed");
        }
      })
      .catch(err => {
        console.log(err);
        Alert.alert("Error", "Failed to update user");
      });
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text>Username: {username}</Text>

      <Text>Password:</Text>
    
      <TextInput
  secureTextEntry={true}
  value={user.Password}
  onChangeText={text => setUser({ ...user, Password: text })}
  style={{ borderWidth: 1, padding: 5, marginBottom: 10 }}
/>


      <Text>Email:</Text>
      <TextInput
        value={user.Email}
        onChangeText={text => setUser({ ...user, Email: text })}
        style={{ borderWidth: 1, padding: 5, marginBottom: 10 }}
      />

      <Text>Mobile Number:</Text>
      <TextInput
        value={user.MobileNumber}
        onChangeText={text => setUser({ ...user, MobileNumber: text })}
        style={{ borderWidth: 1, padding: 5, marginBottom: 10 }}
      />

      <Text>Date of Birth:</Text>
      <TextInput
        value={user.DateOfBirth}
        onChangeText={text => setUser({ ...user, DateOfBirth: text })}
        style={{ borderWidth: 1, padding: 5, marginBottom: 10 }}
      />

      <Text>Doctor's Email:</Text>
      <TextInput
        value={user.DoctorsEmail}
        onChangeText={text => setUser({ ...user, DoctorsEmail: text })}
        style={{ borderWidth: 1, padding: 5, marginBottom: 10 }}
      />

      <Button title="Update User" onPress={handleUpdate} />
    </ScrollView>
  );
}



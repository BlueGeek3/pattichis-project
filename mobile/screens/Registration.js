import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// --- CONFIGURATION ---
// !!! IMPORTANT: REPLACE 'YOUR_ACTUAL_IP_ADDRESS' with your actual local IP (e.g., 192.168.1.5)
const API_URL = 'http://192.168.x.x:8080/registration.php'; 

// ---------------------

const Registration = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigation = useNavigation();

  // Basic client-side validation for form input
  const validateInput = () => {
    if (username.length < 3) {
      setMessage('Username must be at least 3 characters long.');
      return false;
    }
    if (password.length < 6) {
      setMessage('Password must be at least 6 characters long.');
      return false;
    }
    setMessage('');
    return true;
  };

  const handleRegistration = async () => {
    if (!validateInput()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Converts the JavaScript object into a JSON string for the PHP API
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      // PHP returns JSON, so we parse the response body
      const data = await response.json();

      if (data.success) {
        // Successful registration, clear inputs and navigate to Login
        setMessage(data.message);
        setUsername('');
        setPassword('');
        
        // Use a timeout to display success message before navigating
        setTimeout(() => {
          navigation.navigate('Login');
        }, 2000); 

      } else {
        // Registration failed (e.g., username already exists)
        // The message comes directly from the PHP script
        setMessage(`Registration Failed: ${data.message}`);
      }
    } catch (error) {
      // Network error (e.g., server is offline, wrong IP, or firewall issue)
      console.error("Registration Error:", error);
      setMessage('Network Error: Could not connect to the server. Check your API_URL and server status.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Your Account</Text>

      {/* Message Display for success/error/validation */}
      <Text style={[styles.message, { color: message.includes('successful') ? 'green' : 'red' }]}>
        {message}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password (min 6 characters)"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
      />

      <TouchableOpacity style={styles.button} onPress={handleRegistration} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>REGISTER</Text>
        )}
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.linkText}>Already have an account? Login here.</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF', // Standard iOS blue
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  message: {
    textAlign: 'center',
    marginBottom: 15,
    fontSize: 14,
    fontWeight: '500',
  },
  linkText: {
    textAlign: 'center',
    color: '#007AFF',
    marginTop: 10,
    fontSize: 15,
  }
});

export default Registration;

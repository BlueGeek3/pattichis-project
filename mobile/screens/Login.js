import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// ----------------------------------------------------------------------
// 1. API Configuration
// IMPORTANT: REPLACE 'YOUR_ACTUAL_IP_ADDRESS' below with the IP from ipconfig/System Settings.
// ----------------------------------------------------------------------
const API_URL = 'http://10.78.140.187:8080/login.php'; 


export default function Login() {
    const navigation = useNavigation();

    // State for user input
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // State for UI feedback
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    /**
     * Handles the login process by sending credentials to the PHP API.
     */
    const handleLogin = async () => {
        if (!username || !password) {
            setMessage('Please enter both username and password.');
            return;
        }

        setIsLoading(true);
        setMessage('');

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // Send username and password as JSON payload
                body: JSON.stringify({ username, password }),
            });

            // Check if the network request itself failed (e.g., 404, 500)
            if (!response.ok) {
                // Read the response text for better debugging
                const errorText = await response.text();
                throw new Error(`Server responded with status ${response.status}: ${errorText}`);
            }

            const data = await response.json();

            if (data.success) {
                // Login successful
                setMessage('Login successful! Redirecting...');
                
                // Navigate to the Main Menu Scene
                navigation.navigate('Tabs');
                
                // Clear state after successful navigation
                setUsername('');
                setPassword('');
            } else {
                // Login failed (e.g., bad credentials) - show message from API
                setMessage(`Login Failed: ${data.message}`);
            }

        } catch (error) {
            console.error('Login Error:', error);
            setMessage(`Network Error: Could not connect to the server. Check your API_URL and server status.`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Welcome Back!</Text>

            {/* Username Input Group */}
            <Text style={styles.label}>Username</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter your username"
                placeholderTextColor="#9ca3af"
                value={username}
                onChangeText={setUsername}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            {/* Password Input Group */}
            <Text style={styles.label}>Password</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor="#9ca3af"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
            />

            {/* Message Display (Feedback) */}
            {message ? (
                <Text style={[styles.message, { color: message.includes('successful') ? '#10b981' : '#ef4444' }]}>
                    {message}
                </Text>
            ) : null}

            {/* Login Button */}
            <TouchableOpacity 
                style={styles.loginButton} 
                onPress={handleLogin}
                disabled={isLoading}
            >
                {isLoading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.loginButtonText}>LOG IN</Text>
                )}
            </TouchableOpacity>

            {/* Footer Links (Forgot Password & Register) */}
            <View style={styles.footerLinks}>
                <TouchableOpacity onPress={() => { /* Placeholder for future implementation */ }}>
                    <Text style={styles.linkText}>Forgot Password?</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Registration')}>
                    <Text style={styles.linkText}>New User? Register</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 30,
        paddingTop: Platform.OS === 'android' ? 50 : 0, // Add padding for Android status bar
        backgroundColor: '#f9fafb',
        alignItems: 'center',
    },
    header: {
        fontSize: 28,
        fontWeight: '700',
        color: '#1f2937',
        marginBottom: 30,
        marginTop: 50,
    },
    label: {
        alignSelf: 'flex-start',
        fontSize: 16,
        color: '#4b5563',
        marginBottom: 8,
        fontWeight: '600',
    },
    input: {
        width: '100%',
        height: 50,
        backgroundColor: '#ffffff',
        borderColor: '#d1d5db',
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 15,
        fontSize: 16,
        color: '#1f2937',
        marginBottom: 20,
    },
    message: {
        marginTop: 15,
        marginBottom: 15,
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
    },
    loginButton: {
        width: '100%',
        paddingVertical: 14,
        backgroundColor: '#1d4ed8', // A deep blue color
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        // Shadow for iOS
        shadowColor: '#1d4ed8',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        // Shadow for Android
        elevation: 8,
    },
    loginButtonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: '700',
    },
    footerLinks: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 25,
    },
    linkText: {
        color: '#6b7280',
        fontSize: 14,
        fontWeight: '500',
        textDecorationLine: 'underline',
    },
});

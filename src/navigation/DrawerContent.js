import React, { useContext } from "react";
import { View, StyleSheet, Alert } from "react-native";
import {
  useTheme,
  Avatar,
  Title,
  Caption,
  Drawer,
} from "react-native-paper";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { AntDesign, Feather,Octicons } from "@expo/vector-icons";
import { UserContext } from "../server/context/UserContext";

export function DrawerContent(props) {

  const { user, signOut } = useContext(UserContext);
  const avatarSize = 100

  const handleLogPress = (user) => {
    if (user) {

      Alert.alert(
        //title
        'Sign Out Confirmation',
        //body
        'Are you sure want to sign out?',
        [
          {
            text: 'Yes',
            onPress: () => {
              signOut();
              props.navigation.navigate("Home", {screen: "Home"});
            }
          },
          {
            text: 'Cancel',
            onPress: () => true, style: 'cancel'
          },
        ],
        {cancelable: false},
        //clicking out side of alert will not cancel
      );
      
    } else {
      props.navigation.navigate("AuthScreen");
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView
        {...props}
        scrollEnabled={false}
        contentContainerStyle={{ flex: 1 }}
        
      >
        <View
          style={{
            flex: 1,
            paddingTop: 50,
          }}
        >
          <View style={styles.userInfoSection}>
            <View
              style={{
                flex: 1,
                flexDirection: "colum",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Avatar.Image
                source={{
                  uri:
                    "https://firebasestorage.googleapis.com/v0/b/kh-tour-app.appspot.com/o/app_dyn_resource%2Fprofile-avatar.png?alt=media&token=50464b63-c0d3-4b47-ae65-18a814dc52c1",
                }}
                size={avatarSize}
              />
              <View
                style={{ borderColor: "red", position: "absolute", top: 50 }}
              >
                <Title style={styles.title}>Hi Anonymous</Title>
                <Caption style={styles.caption}>@Anonymous</Caption>
              </View>
            </View>
          </View>

          <Drawer.Section style={styles.drawerSection}>
            <DrawerItem
              icon={({ color, size }) => (
                <Icon name="home-outline" color="#246b6b" size={size} />
              )}
              label="Home"
              labelStyle={styles.drawerLabel}
              onPress={() => {
                props.navigation.navigate("Home");
              }}
            />

            <DrawerItem
              icon={({ color, size }) => (
                <Icon name="bookmark-outline" color="#246b6b" size={size} />
              )}
              labelStyle={styles.drawerLabel}
              label="Bookmarks"
              onPress={() => {
                props.navigation.navigate("BookmarkScreen");
              }}
            />
            <DrawerItem
              icon={({ color, size }) => (
                <Icon name="settings-outline" color="#246b6b" size={size} />
              )}
              labelStyle={styles.drawerLabel}
              label="Settings"
              onPress={() => {
                props.navigation.navigate("SettingsScreen");
              }}
            />
            <DrawerItem
              icon={({ color, size }) => (
                <Icon name="account-check-outline" color="#246b6b" size={size} />
              )}
              labelStyle={styles.drawerLabel}
              label="Support"
              onPress={() => {
                props.navigation.navigate("SupportScreen");
              }}
            />
            {user && 
            <DrawerItem
              icon={({ color, size }) => (
                <Octicons name="settings" color="#246b6b" size={size} />
              )}
              labelStyle={styles.drawerLabel}
              label="Manage"
              onPress={() => {
                props.navigation.navigate("Admin");
              }}
            />
          }
          </Drawer.Section>

          
          {/* <Drawer.Section title="Preferences">
            <TouchableRipple
              onPress={() => {
                toggleTheme();
              }}
            >
              <View style={styles.preference}>
                <Text>Dark Theme</Text>
                <View pointerEvents="none">
                  <Switch value={paperTheme.dark} />
                </View>
              </View>
            </TouchableRipple>
          </Drawer.Section> */}
        </View>
      </DrawerContentScrollView>
      <Drawer.Section style={styles.bottomDrawerSection}
        contentO
      >
        <DrawerItem
          icon={({ color, size }) => (
            <AntDesign
              name={user ? "logout" : "login"}
              size={size}
              color="#246b6b"
            />
          )}
          labelStyle={styles.drawerLabel}
          label={user ? "Sign Out" : "Sign In"}
          onPress={() => {
            handleLogPress(user);
          }}
        />
        <DrawerItem
          icon={({ color, size }) => (
            <Feather name="slack" size={size} color="#246b6b" />
          )}
          labelStyle={styles.drawerLabel}
          label="About Us"
          onPress={() => {
            props.navigation.navigate("AboutUsScreen");
          }}
        />
      </Drawer.Section>
    </View>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    paddingTop: 100,
    color: "#246b6b"
  },
  userInfoSection: {
    paddingLeft: 50,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  row: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    color: "#246b6b"
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
    color: "#246b6b"
  },
  paragraph: {
    fontWeight: "bold",
    marginRight: 3,
    color: "#246b6b"
  },
  drawerSection: {
    marginTop: 150,
    
  },
  bottomDrawerSection: {
    marginBottom: 15,
    borderTopColor: "#f4f4f4",
    borderTopWidth: 1,
    color: "#246b6b"
  },
  preference: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  drawerLabel: { color: "#246b6b"},
});

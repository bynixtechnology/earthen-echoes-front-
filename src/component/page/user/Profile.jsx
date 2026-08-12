import React, { useState, useEffect } from "react";
import ProfileSidebar from "./profile/ProfileSidebar";
import ProfileHeader from "./profile/ProfileHeader";
import ProfileInfo from "./profile/ProfileInfo";
import AddressTab from "./profile/AddressTab";
import PasswordTab from "./profile/PasswordTab";

import { useDispatch, useSelector } from "react-redux";
import {
  getUserProfile,
  updateUserProfile,
} from "../../../redux/thunks/userAuthThunk";
import {
  selectUser,
  selectUserAuthLoading,
} from "../../../redux/slices/userAuthSlice";

import { C } from "../../../constants/theme"; // Adjusted import path to match project structure

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const loading = useSelector(selectUserAuthLoading);

  const [activeTab, setActiveTab] = useState("profile");
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    dispatch(getUserProfile())
      .unwrap()
      .then((data) => {
        setProfileData(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [dispatch]);

  // Fallback to Redux store if local profileData state is pending
  const currentUser = profileData || user;

  const handleProfileUpdate = async (payload) => {
    try {
      const updated = await dispatch(updateUserProfile(payload)).unwrap();
      setProfileData(updated);
    } catch (err) {
      console.log(err);
    }
  };

  const renderTab = () => {
    switch (activeTab) {
      case "profile":
        return (
          <ProfileInfo
            user={currentUser}
            loading={loading}
            onUpdate={handleProfileUpdate}
          />
        );

      case "address":
        return (
          <AddressTab
            user={currentUser}
            loading={loading}
            onUpdate={handleProfileUpdate}
          />
        );

      case "password":
        return (
          <PasswordTab
            user={currentUser}
            loading={loading}
          />
        );

      default:
        return (
          <ProfileInfo
            user={currentUser}
            loading={loading}
            onUpdate={handleProfileUpdate}
          />
        );
    }
  };

  return (
    <div
      className="min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300"
      style={{
        backgroundColor: C.ivory,
        color: C.dark,
      }}
      data-page="profile-page"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <ProfileHeader
            user={currentUser}
            loading={loading}
            onUpdate={handleProfileUpdate}
            onEditClick={() => setActiveTab("profile")}
          />
        </div>

        {/* Body Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div
              className="rounded-3xl border p-3 sm:p-4 shadow-xs sticky top-6 transition-all"
              style={{
                backgroundColor: C.cream,
                borderColor: `${C.dark}15`,
              }}
            >
              <ProfileSidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            </div>
          </div>

          {/* Dynamic Content Area */}
          <div className="lg:col-span-3">
            <div
              className="rounded-3xl border shadow-xs transition-all duration-200 overflow-hidden"
              style={{
                backgroundColor: C.cream,
                borderColor: `${C.dark}15`,
              }}
            >
              {renderTab()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
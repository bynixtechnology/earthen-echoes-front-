import React, {
  useState,
  useEffect,
} from "react";

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


const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector(
    selectUser
  );

  const loading = useSelector(
    selectUserAuthLoading
  );
  const [activeTab, setActiveTab] = useState("profile");
  const [profileData, setProfileData] =
    useState(null);

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

  const handleProfileUpdate = async (
    payload
  ) => {

    try {

      const updated =
        await dispatch(
          updateUserProfile(payload)
        ).unwrap();

        

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
            user={profileData}
            loading={loading}
            onUpdate={handleProfileUpdate}
          />
        );



      case "address":
        return (
          <AddressTab
            user={profileData}
            loading={loading}
            onUpdate={handleProfileUpdate}
          />
        );
      case "password":
        return (
          <PasswordTab
            user={profileData}
            loading={loading}
          />
        );


      default:
        return (
          <ProfileInfo
            user={profileData}
            loading={loading}
            onUpdate={handleProfileUpdate}
          />
        );
    }
  };



  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300" data-page="profile-page">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <ProfileHeader
            user={profileData}
            loading={loading}
            onUpdate={handleProfileUpdate}
          />
        </div>

        {/* Body Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-[var(--card)] text-[var(--card-foreground)] rounded-[var(--radius)] border border-[var(--border)] p-4 shadow-sm sticky top-6">
              <ProfileSidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            </div>
          </div>

          {/* Dynamic Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-[var(--card)] text-[var(--card-foreground)] rounded-[var(--radius)] border border-[var(--border)] p-6 sm:p-8 shadow-sm transition-all duration-200">
              {renderTab()}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Profile;
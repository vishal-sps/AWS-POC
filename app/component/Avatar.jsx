import { View } from '@aws-amplify/ui-react';
import './Avatar.css'; // Your CSS file for avatar styling

const Avatar = ({ userName }) => {
  // This function generates initials from the user's name
  const getInitials = (name) => {
    const nameArray = name.split(' ');
    const initials =
      nameArray.length > 1
        ? nameArray[0].charAt(0) + nameArray[nameArray.length - 1].charAt(0)
        : nameArray[0].charAt(0);
    return initials.toUpperCase();
  };

  return (
    <View className="avatar">
      <div className="avatar-circle">
        <span className="avatar-text">{getInitials(userName)}</span>
      </div>
      <span className="avatar-name">{userName}</span>
    </View>
  );
};

export default Avatar;

import React, { useState } from 'react';
import PersonalInfo, { PersonalInformation } from './PersonalInfo';
import { X } from 'lucide-react';

interface ProfilePageProps {
  onClose: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ onClose }) => {
  const [personalInfo, setPersonalInfo] = useState<PersonalInformation>({
    name: '',
    email: '',
    phone: '',
    address: '',
    occupation: ''
  });

  const handleSavePersonalInfo = (info: PersonalInformation) => {
    setPersonalInfo(info);
    // In a real app, you would save this to a backend
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 rounded-2xl shadow-2xl p-8 max-w-4xl w-full mx-auto max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-8">
          <PersonalInfo
            onSave={handleSavePersonalInfo}
            initialInfo={personalInfo}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
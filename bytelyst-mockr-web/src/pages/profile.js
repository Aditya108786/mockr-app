// pages/profile.js
import React, { useRef, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/authcontext';
import { useRouter } from 'next/router';
import ProtectedRoute from 'impt/components/Protectedroute';

export default function Profile() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef(null);
  const avatarInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [resumeUrl, setResumeUrl] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file || !user) return;

    const filePath = `${user.id}/${file.name}`;
    setUploading(true);

    const { error: uploadError } = await supabase.storage
      .from('resume')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    setUploading(false);
    if (uploadError) {
      alert('Upload failed: ' + uploadError.message);
      return;
    }

    const { data: publicURL } = supabase.storage
      .from('resume')
      .getPublicUrl(filePath);

    const url = publicURL?.publicUrl;
    setResumeUrl(url);

    await supabase
      .from('users')
      .update({ resume_url: url })
      .eq('id', user.id);
  };

  const handleAvatarChange = async (event) => {
    const file = event.target.files[0];
    if (!file || !user) return;

    const filePath = `${user.id}/avatar-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from('resume') // ✅ fixed: use the correct bucket
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) {
      alert('Avatar upload failed: ' + uploadError.message);
      return;
    }

    const { data: publicURL } = supabase.storage
      .from('resume') // ✅ fixed: use the correct bucket
      .getPublicUrl(filePath);

    const url = publicURL?.publicUrl;
    setAvatarUrl(url);

    await supabase
      .from('users')
      .update({ profile_url: url }) // ✅ saves avatar URL to DB
      .eq('id', user.id);
  };

  useEffect(() => {
    const fetchUserUrls = async () => {
      if (!user?.id) return;

      const { data, error } = await supabase
        .from('users')
        .select('resume_url, profile_url')
        .eq('id', user.id)
        .single();

      if (!error && data) {
        setResumeUrl(data.resume_url);
        setAvatarUrl(data.profile_url);
      }
    };

    fetchUserUrls();
  }, [user]);

  return (
    <ProtectedRoute>
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">
      <div className="bg-white shadow-md rounded-2xl p-8 w-full max-w-3xl flex flex-col items-center">
        
        {/* Avatar Upload */}
        <div className="mb-6 flex flex-col items-center relative">
          <input
            type="file"
            accept="image/*"
            ref={avatarInputRef}
            onChange={handleAvatarChange}
            hidden
          />
          <div
            onClick={() => avatarInputRef.current.click()}
            className="w-24 h-24 rounded-full bg-gray-200 cursor-pointer overflow-hidden shadow-md border-2 border-gray-300"
            title="Click to upload profile photo"
          >
            <img
              src={avatarUrl || "/avatar-placeholder.png"}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <h1 className="text-4xl font-bold text-center text-blue-600 mb-8">Profile</h1>

        {/* Email */}
        <div className="mb-8 w-full">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Registered Email</h2>
          <p className="text-lg text-gray-600 bg-gray-100 p-3 rounded-md">
            {user?.email || "user@example.com"}
          </p>
        </div>

        {/* Upload Resume */}
        <div className="mb-8 w-full">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Upload Resume (PDF)</h2>
          <input
            type="file"
            accept=".pdf"
            ref={fileInputRef}
            onChange={handleFileChange}
            hidden
          />
          <button
            onClick={() => fileInputRef.current.click()}
            className="px-6 py-3 bg-blue-500 text-white text-lg font-medium rounded-lg hover:bg-blue-600 transition w-full"
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Upload Resume'}
          </button>
        </div>

        {/* Resume Link */}
        {resumeUrl && (
          <div className="mb-8 w-full text-center">
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              View Uploaded Resume
            </a>
          </div>
        )}

        {/* Logout */}
        <div className="w-full">
          <button
            onClick={handleLogout}
            className="px-6 py-3 bg-red-500 text-white text-lg font-medium rounded-lg hover:bg-red-600 transition w-full"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
}

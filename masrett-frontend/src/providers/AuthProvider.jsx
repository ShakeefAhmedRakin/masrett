import { createContext, useEffect, useState } from "react";
import auth from "../firebase/firebase.config";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import PropTypes from "prop-types";

export const AuthContext = createContext(null);

const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signInUser = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  // UPDATE PROFILE PICTURE AND USERNAME
  const addUsernamePhoto = (username, photoURL) => {
    setLoading(true);
    return updateProfile(auth.currentUser, {
      displayName: username,
      photoURL: photoURL,
    });
  };

  const signInWithGoogle = () => {
    return signInWithPopup(auth, googleProvider);
  };

  const logOut = () => {
    setLoading(true);
    return signOut(auth);
  };

  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Check if the user already has displayName and photoURL
        const hasDisplayName = !!currentUser.displayName;
        const hasPhotoURL = !!currentUser.photoURL;

        // If no displayName, set it to the part before '@' in the email
        if (!hasDisplayName) {
          const emailParts = currentUser.email.split("@");
          const username = emailParts[0];
          await updateProfile(currentUser, {
            displayName: username,
          });
        }

        // If no photoURL, set the fixed one
        if (!hasPhotoURL) {
          await updateProfile(currentUser, {
            photoURL:
              "https://www.alchinlong.com/wp-content/uploads/2015/09/sample-profile-320x320.png",
          });
        }

        setUser(currentUser);
        setLoading(false);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      unSubscribe();
    };
  }, []);

  const authInfo = {
    user,
    loading,
    createUser,
    signInUser,
    logOut,
    signInWithGoogle,
    addUsernamePhoto,
  };
  return (
    <>
      <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
    </>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export default AuthProvider;

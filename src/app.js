// src/app.js

import { Auth, getUser } from './auth';
import { getFragmentData, getUserFragments } from './api';
import {
  getUserFragments,
  postFragment,
  getFragmentInfo

} from './api';

async function init() {
  // Get our UI elements
  const userSection = document.querySelector('#user');
  const loginBtn = document.querySelector('#login');
  const logoutBtn = document.querySelector('#logout');
  const postSection = document.querySelector('#post-section');
  const postBtn = document.querySelector('#post-btn');
  const getSection = document.querySelector('#get-section');
  const fragmentType = document.querySelector('#fragmentType');
  const fileInput = document.querySelector('#file-input');
  const getInfoBtn = document.querySelector('#get-fragment-btn');
  const getFragmentsBtn = document.querySelector('#get-fragments-btn');
  const fragmentId = document.querySelector('#fragment-id');
  const fragmentInput = document.querySelector('#inputfragment');


  // Wire up event handlers to deal with login and logout.
  loginBtn.onclick = () => {
    // Sign-in via the Amazon Cognito Hosted UI (requires redirects), see:
    // https://docs.amplify.aws/lib/auth/advanced/q/platform/js/#identity-pool-federation
    Auth.federatedSignIn();
    
  };
  logoutBtn.onclick = () => {
    // Sign-out of the Amazon Cognito Hosted UI (requires redirects), see:
    // https://docs.amplify.aws/lib/auth/emailpassword/q/platform/js/#sign-out
    Auth.signOut();
  };

  // See if we're signed in (i.e., we'll have a `user` object)
  const user = await getUser();
  
  if (!user) {
    // Disable the Logout button
    logoutBtn.disabled = true;

    return;
  }

  // Log the user info for debugging purposes
  console.log({ user });

  // Update the UI to welcome the user
  userSection.hidden = false;

  // Show the user's username
  userSection.querySelector('.username').innerText = user.username;

  // Disable the Login button
  loginBtn.disabled = true;
  postSection.hidden = false;
  getSection.hidden = false;

  getUserFragments(user);

  getFragmentsBtn.addEventListener('click', () => {
    getUserFragments(user, true);
  });

  postBtn.onclick = () => {
    if (fragmentType.value === '') {
      alert('Please select a type');
      return;
    }
  
    if (fileInput.files.length != 0) {
      const file = fileInput.files[0];
      const name = file.name;
      var ext = name.substr(name.lastIndexOf('.') + 1, name.length);
  
  
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileData = e.target.result;
        postFragment(user, fileData, fragmentType.value);
      };
      reader.readAsText(file);
  
      return;
    }
  
    if (fragmentInput === '') alert('Please enter a fragment');
    else postFragment(user, fragmentInput, fragmentType);
  };

  getInfoBtn.addEventListener('click', () => {
    if (fragmentId.value === '' || fragmentId.value === null) alert("Fragment ID can't be blank.");
    else getFragmentInfo(user, fragmentId.value);
  });



}

// Wait for the DOM to be ready, then start the app
addEventListener('DOMContentLoaded', init);
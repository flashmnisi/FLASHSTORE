# FlashStore 🛒

FlashStore is a full-stack e-commerce mobile app built with **React Native**, **TypeScript**, **Node.js**, **Express**, **MongoDB**, and **Zod**. It offers a seamless shopping experience with features like product browsing, search, filtering, secure payments, and user management.

## 🚀 Features
- **User Authentication**: Sign up, log in, and reset passwords via OTP sent through email.
- **Product Browsing**: Explore products by categories, trends, and super deals. Sort by price and filter by category.
- **Search & Navigation**: Intuitive search screen and address management for smooth user experience.
- **Payments**: Secure checkout with Stripe or cash on delivery.
- **Profile Management**: Update addresses, view orders, and log out or delete accounts.
- **Responsive UI**: Built with React Native for cross-platform compatibility (iOS & Android).

## 🛠️ Tech Stack
- **Frontend**: React Native, JavaScript, TypeScript, Redux (for state management)
- **Backend**: Node.js, Express, MongoDB, Zod (for schema validation), REST API
- **Integrations**: Stripe for payments, Nodemailer for OTP emails

## 📸 Screenshots

<p align="center">
  <img src="https://github.com/flashmnisi/FLASHSTORE/blob/ebcda7f04a45571672dc71ea36228311d08acb18/Home.png?raw=true" width="200"/>
  <img src="https://github.com/flashmnisi/FLASHSTORE/blob/2a8bd2fb1953eca418d428d01a687168e517b2d4/cart.png" width="200"/>
   <img src="https://github.com/flashmnisi/FLASHSTORE/blob/2a8bd2fb1953eca418d428d01a687168e517b2d4/details.png" width="200"/>
  <img src="https://github.com/flashmnisi/FLASHSTORE/blob/2a8bd2fb1953eca418d428d01a687168e517b2d4/signup.png" width="200"/>
  <img src="https://github.com/flashmnisi/FLASHSTORE/blob/2a8bd2fb1953eca418d428d01a687168e517b2d4/search.png" width="200"/>
    <img src="https://github.com/flashmnisi/FLASHSTORE/blob/c8bd577617d49cef438200618f2cbc4950f84cc1/login.png" width="200"/>
    <img src="https://github.com/flashmnisi/FLASHSTORE/blob/c8bd577617d49cef438200618f2cbc4950f84cc1/categoryDetails.png" width="200"/>
  <img src="https://github.com/flashmnisi/FLASHSTORE/blob/c8bd577617d49cef438200618f2cbc4950f84cc1/paymentSelection.png" width="200"/>
  <img src="https://github.com/flashmnisi/FLASHSTORE/blob/9e7dda0ddd221ad82b0c872eddc4a7ae61f41323/CardPayment.png" width="200"/>
    <img src="https://github.com/flashmnisi/FLASHSTORE/blob/9e7dda0ddd221ad82b0c872eddc4a7ae61f41323/CashPayment.png" width="200"/>
   <img src="https://github.com/flashmnisi/FLASHSTORE/blob/9e7dda0ddd221ad82b0c872eddc4a7ae61f41323/DeliveryOption.png" width="200"/>    <img src="https://github.com/flashmnisi/FLASHSTORE/blob/9e7dda0ddd221ad82b0c872eddc4a7ae61f41323/CashPayment.png" width="200"/>
</p>

# Getting Started

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

# Backend Setup:bash

cd backend
npm install
cp .env.example .env
Add MongoDB URI, Stripe key, and email config to .env
npm run dev

# Environment Variables:
Copy backend/.env.example to backend/.env and fill in:env.

- STRIPE_SECRET_KEY=your_stripe_test_key.
- MONGODB_URI=your_mongodb_connection_string.
- EMAIL_SERVICE=your_email_service.
- EMAIL_USER=your_email_user.
- EMAIL_PASS=your_email_password.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

# Future ImprovementsAdd 
push notifications for order updates
Implement AI-based product recommendations
Optimize product list rendering with lazy loading

# Contributing
Contributions are welcome! Please open an issue or submit a pull request.
# Contact
Connect with me on LinkedIn https://www.linkedin.com/in/flash-mnisi-013096112/ or email (flashmnisi@gmail.com) for opportunities or feedback!
# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.

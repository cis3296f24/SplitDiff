# SplitDiff

**SplitDiff** is an iOS app designed to simplify dining out with friends. With features for planning, budget management, and payment breakdowns, SplitDiff eliminates the stress of deciding on a place, managing costs, and splitting bills. Users can access various options on their phone to view data, choose restaurants, or scan receipts, keeping the focus on fun rather than logistics.

## Key Features

- **Restaurant Selection**: Browse and select restaurants for easy planning.
- **Budget Insights**: Manage and track your budget to avoid overspending.
- **Payment Resolution**: Easily calculate and finalize who pays what.
- **Receipt Scanning**: Scan receipts directly to streamline cost-splitting.

## Get started

### Prerequisites

- **Node.js**: Download and install the latest version of [Node.js](https://nodejs.org).
- **Expo CLI**: Install the Expo CLI globally using npm or yarn.
   ```bash
   npm install -g expo-cli
   ```
- **Expo Go**: Download the Expo Go app on your mobile device (iOS or Android).

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/cis3296f24/SplitDiff.git
   cd SplitDiff
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Create Credential**:

   ```
   Create firebase.js in the root of the project and paste in firebase info (ask Andriy for this)
   ```

4. **Start the Development Server**:
   ```bash
   npx expo start
   ```
5. **Run the App**:
   - Scan the QR code displayed in the terminal or Expo DevTools with the **Expo Go** app.
   - The app will load on your device
   
In the output, you'll find options to open the app in a

- [Development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## How to Contribute

We welcome contributions to **SplitDiff** to improve functionality and user experience. Here’s how you can get started:

1. **Fork the Repository**: Start by forking the project on GitHub to create your own copy of the project.

2. **Create a Branch**: Create a branch to make changes specific to your feature or bug fix.
   ```bash
   git checkout -b feature/YourFeatureName
   ```

3. **Implement and Test**:
   - Make your changes, following best coding practices.
   - Add tests to validate your new feature or bug fix.
   - Run all existing tests to ensure your changes don’t introduce bugs.

4. **Commit Your Changes**: Write clear and descriptive commit messages for each change.
   ```bash
   git commit -m "Add brief description of your changes"
   ```

5. **Push Your Branch**: Push your branch to your GitHub fork.
   ```bash
   git push origin feature/YourFeatureName
   ```

6. **Submit a Pull Request**:
   - Go to the original **SplitDiff** repository on GitHub.
   - Click on the **Pull Requests** tab and submit a new pull request.
   - Provide a detailed description of your changes, linking any relevant issues.
   - 
Thank you for contributing to **SplitDiff**! Your help is essential for making this app even better.


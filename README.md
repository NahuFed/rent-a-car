
# Car Rental - 🚗

This project is a web application designed to streamline car rental and management operations for a car rental company based in Australia. The system enables users to rent cars efficiently while providing administrators with tools to manage inventory and rental requests.

## 🚀 Overview
The system provides a seamless experience for both users and administrators, featuring the following capabilities:

- **For Users**:
  - Sign up, log in, recover password, and log out.
  - Browse a catalog of available cars with detailed descriptions and images.
  - Submit rental requests with required document uploads.
  - Access a historical list of previous rental requests.

- **For Administrators**:
  - Add, edit, delete, and manage car listings, including uploading car images.
  - Review, approve, or reject rental requests based on user-provided documents.
  - View the complete history of users' rental requests.

- **Payment Integration**:
  - Use of the Stellar Network for secure cryptocurrency payments in USDC.
  - Real-time conversion check to ensure users have sufficient funds before completing transactions.

---

## 📦 Tech Stack
This PoC leverages modern web development technologies and tools:
- **Frontend**: React with TypeScript and Tailwind UI.
- **Backend**: NestJS with TypeScript.
- **Database**: MySQL.
- **Infrastructure**:
  - **AWS S3**: For storing car images and user-uploaded documents.
  - **AWS Cognito**: For secure authentication and authorization.
  - **LocalStack**: To emulate AWS services during development.

---

## 🔧 Installation and Setup
Follow these steps to set up the project locally:

### Prerequisites
Ensure you have the following installed on your system:
- Node.js >= 18
- MySQL database
- Stellar wallet account for cryptocurrency transactions.

### Steps
1. Clone the repository to your local machine:
   ```bash
   git clone https://github.com/nahufed/rent-a-car.git
   cd rent-a-car
   ```
2. Install the required dependencies:
   ```bash
   npm install
   ```
3. Configure the environment variables by creating a `.env` file in the project root and adding the following:
   - MySQL database credentials (`DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME`).
   - AWS credentials for S3 (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`).
   - Stellar wallet keys (`STELLAR_PUBLIC_KEY`, `STELLAR_SECRET_KEY`).
4. Start the application:
   ```bash
   npm run start
   ```

---

## 📑 System Architecture
The application has a modular design to separate responsibilities between users, administrators, rentals, and car management. The system architecture includes:

- **Frontend**: A responsive web interface built with React.
- **Backend**: A RESTful API built with NestJS for handling requests and managing data.
- **Database**: MySQL for data storage, including users, cars, and rental requests.
- **File Storage**: AWS S3 for managing user-uploaded documents and car images.

[View a detailed system diagram here](https://drive.google.com/file/d/1gezI8NrUO-1QIOqCYx2NFanwinXwWuJe/view?usp=sharing).

---

## 🛠 Work in Progress
This PoC is under active development, with the following features planned:
- Responsive design using **Figma** for an optimized user experience.
- Improved user flows for payment processing and document uploads.
- Expansion of admin tools to manage roles and permissions dynamically.

---

## ✨ Contributing
We welcome contributions to improve the project! Follow these steps to contribute:
1. **Fork** this repository to your GitHub account.
2. **Create a new branch** for your feature or bugfix:
   ```bash
   git checkout -b my-feature
   ```
3. **Commit your changes** with a descriptive message:
   ```bash
   git commit -m "Add feature X"
   ```
4. **Push your changes** to your fork:
   ```bash
   git push origin my-feature
   ```
5. Submit a **pull request** to the main repository.

---

## 📝 License
This project is protected under a custom license. For more information about usage or permissions, please contact the development team.

---

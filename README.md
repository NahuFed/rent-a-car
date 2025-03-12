
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

# Installation and Configuration of External Services for Rent a Car

This project requires several external services to function in a development environment. Here you will find the steps to install and run them using Docker.

## **1. Prerequisites**
Before starting, make sure you have installed:

- [Docker Desktop](https://www.docker.com/get-started/) (Windows/macOS) or Docker Engine (Linux).
- Docker Compose (included in Docker Desktop or install manually on Linux with:
  ```sh
  sudo apt update
  sudo apt install docker.io docker-compose
  ```
- Verify the installation by running:
  ```sh
  docker --version
  docker-compose --version
  ```

## **2. Clone the Repository and Configure Docker Compose**

Clone the backend repository where the `docker-compose.yml` file is located:
```sh
git clone <REPOSITORY_URL>
cd <REPOSITORY_NAME>
```

## **3. Download and Run the Services**

To ensure you are using the latest versions of the containers, first download the required images:
```sh
docker-compose pull
```

Then, start the services in the background:
```sh
docker-compose up -d
```
This will start the following services:
- Cognito Local on port `9229`
- MinIO on ports `9000` and `9001`
- Redis on port `6379`

## **4. Verify that the Services Are Running**
Run:
```sh
docker ps
```
You should see the `cognito-local`, `minio`, and `redis` containers running.

To stop the services:
```sh
docker-compose down
```

## **5. Access the Services**
- **MinIO Web UI:** [http://localhost:9001](http://localhost:9001) (user: `minioadmin`, password: `minioadmin`)
- **Cognito Local:** [http://localhost:9229](http://localhost:9229)
- **Redis:** Does not have a graphical interface, but you can connect from the backend application.

---
Now you can continue with the backend configuration and test the integration with these services. 🚀

## **6. Setting up MySQL Database**
To run the backend, you need to create a MySQL database named `rent_a_car`. The backend will handle table creation using TypeORM.

### **6.1 Install MySQL and Add to PATH (Windows Users)**
If you do not have MySQL installed, download and install it from [MySQL Official Site](https://dev.mysql.com/downloads/installer/).

After installation, add MySQL to the system PATH:
1. Open **Environment Variables** in Windows.
2. Under **System Variables**, find `Path` and edit it.
3. Add the MySQL `bin` folder path (e.g., `C:\Program Files\MySQL\MySQL Server 8.0\bin`).
4. Click **OK** and restart the terminal.
5. Verify by running:
   ```sh
   mysql --version
   ```

### **6.2 Creating the Database**
Once MySQL is installed and accessible via the command line, open a terminal and run:
```sh
mysql -u root -p
```
Enter your MySQL root password, then create the database:
```sql
CREATE DATABASE rent_a_car;
```
Exit MySQL with:
```sql
EXIT;
```

### **6.3 Configure Backend to Use MySQL**
Ensure your backend `.env` file has the correct database configuration:
```ini
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=rent_a_car
```
Now, restart the backend and it will automatically create the necessary tables using TypeORM.

---
# Configuration Guide for .env.development:

## 1. Local Cognito Configuration
Variables:

- **`AWS_COGNITO_USER_POOL_ID`**: ID of the user pool in Cognito.  
- **`AWS_COGNITO_CLIENT_ID`**: Application client ID.  
- **`AWS_COGNITO_ENDPOINT`**: URL of the local Cognito service.  
- **`AWS_COGNITO_AUTHORITY`**: Authentication authority (`AWS_COGNITO_ENDPOINT` + `AWS_COGNITO_USER_POOL_ID`).  
- **`AWS_REGION`**: Configured region (even if local, Cognito may require one).  

## 2. MinIO Configuration (Local S3)
Variables:

- **`S3_BUCKET_NAME`**: Name of the storage bucket.  
- **`S3_BUCKET_REGION`**: Bucket region (can be a generic one like `us-east-1`).  
- **`S3_BUCKET_ACCESS_KEY_ID`**: Access key for MinIO.  
- **`S3_SECRET_KEY`**: Secret key for MinIO.  

## 3. Bull + Redis Configuration
*(No specific variables provided for this section yet.)*

## 4. Email Sending Configuration (Nodemailer)
Variables:

- **`EMAIL_USER`**: Authenticated user for sending emails.  
- **`EMAIL_PASS`**: Password or access token.  
---
## Creating a Bucket in MinIO

MinIO does not automatically create buckets based on the `S3_BUCKET_NAME` variable. You need to create the bucket manually after starting the MinIO service. Follow these steps:

### Prerequisites
- Ensure the MinIO service is running (e.g., via `docker-compose up -d` if using Docker Compose).
- Verify MinIO is accessible at `http://localhost:9001` (web console) or port `9000` (API).

### Steps to Create a Bucket

#### Option 1: Using the MinIO Web Console
1. **Access the MinIO Console**:
   - Open your browser and go to `http://localhost:9001`.
   - Log in with the credentials:
     - **Username**: `admin` (or your configured `MINIO_ROOT_USER`)
     - **Password**: `admin123` (or your configured `MINIO_ROOT_PASSWORD`)

2. **Create a Bucket**:
   - Click on the **"Buckets"** section in the left sidebar.
   - Click the **"Create Bucket"** button.
   - Enter a bucket name (e.g., `my-bucket`) in the **Bucket Name** field. This will be your `S3_BUCKET_NAME`.
   - Leave other settings as default unless specific configurations (e.g., versioning) are needed.
   - Click **"Create Bucket"**.

3. **Verify the Bucket**:
   - The new bucket (e.g., `my-bucket`) should now appear in the list of buckets.
   - You can use this name in your application as the `S3_BUCKET_NAME`.

#### Option 2: Using the MinIO Client (CLI)
1. **Install the MinIO Client (`mc`)**:
   - Download and set up `mc` if not already installed:
     ```bash
     curl https://dl.min.io/client/mc/release/linux-amd64/mc --create-dirs -o $HOME/minio-binaries/mc
     chmod +x $HOME/minio-binaries/mc
     export PATH=$PATH:$HOME/minio-binaries/
     ```

2. **Configure MinIO Alias**:
   - Set up an alias for your local MinIO instance:
     ```bash
     mc alias set local http://localhost:9000 admin admin123
     ```

3. **Create the Bucket**:
   - Run the following command to create the bucket:
     ```bash
     mc mb local/my-bucket
     ```
   - Replace `my-bucket` with your desired `S3_BUCKET_NAME`.

4. **Verify the Bucket**:
   - Check that the bucket was created:
     ```bash
     mc ls local
     ```

### Notes
- The `S3_BUCKET_REGION` (e.g., `us-east-1`) is a convention for compatibility with AWS S3 APIs but does not affect MinIO’s local functionality.
- Ensure your application uses the correct `S3_BUCKET_ACCESS_KEY_ID` (e.g., `admin`) and `S3_SECRET_KEY` (e.g., `admin123`) to interact with MinIO.
- 
---
## Setting Up a Gmail App Password for Nodemailer

To use Gmail with Nodemailer, you need an **App Password** if two-factor authentication (2FA) is enabled on your Gmail account. This password will be set as the `EMAIL_PASS` environment variable. Follow these steps to generate and configure it:

### Steps to Generate an App Password

1. **Enable 2-Step Verification (2FA)**:
   - Go to your Google Account settings: `https://myaccount.google.com/security`.
   - Under "Signing in to Google," click **2-Step Verification**.
   - Follow the prompts to enable 2FA (e.g., using your phone number or an authenticator app).

2. **Access App Passwords**:
   - Once 2FA is enabled, return to `https://myaccount.google.com/security`.
   - Under "Signing in to Google," click **App Passwords** (you may need to sign in again).

3. **Generate the App Password**:
   - In the "Select app" dropdown, choose **Mail**.
   - In the "Select device" dropdown, select **Other (Custom name)** and type `Nodemailer` (or any name you prefer).
   - Click **Generate**.
   - Google will display a 16-character App Password (e.g., `abcd efgh ijkl mnop`). Copy this password (ignore the spaces).

4. **Set the Environment Variable**:
   - Open your `.env` file (or wherever you store environment variables) and add:
     ```
     EMAIL_USER=your.email@gmail.com
     EMAIL_PASS=abcdefghijklmnop
     ```
   - Replace `your.email@gmail.com` with your Gmail address and `abcdefghijklmnop` with the App Password you copied (without spaces).

### Notes
- Ensure your application loads the `.env` file (e.g., using `dotenv` in Node.js).
- The `EMAIL_PASS` must match the App Password exactly for Nodemailer to authenticate successfully.
- If 2FA is not enabled, Gmail may block access unless "Less secure app access" is turned on (not recommended and often unavailable).

### Verification
- Test your Nodemailer setup to confirm the email sends correctly using the new `EMAIL_PASS`.

For more details, see Google’s [App Passwords help page](https://support.google.com/accounts/answer/185833).
# Videotube

Videotube is a web application designed to allow users to explore, upload, and manage video content, similar to popular video-sharing platforms. This project showcases advanced usage of MongoDB, particularly the Aggregation Pipeline, to efficiently retrieve and manipulate user channel profiles and video data.

## Features

- **User Authentication:** Secure login and registration using JWT and bcrypt.
- **Video Uploads:** Users can upload videos with descriptions and tags.
- **Channel Profiles:** Dynamic user channel profiles generated using MongoDB Aggregation Pipeline.
- **Video Search and Filtering:** Efficient search functionality using MongoDB queries.
- **Responsive Design:** Tailored for both desktop and mobile experiences.

## Technologies Used

- **Backend:** Node.js, Express.js, MongoDB
- **Frontend:** EJS, Tailwind CSS
- **Database:** MongoDB with Mongoose
- **Authentication:** JSON Web Token (JWT), bcrypt
- **File Upload:** Multer
- **Data Handling:** MongoDB Aggregation Pipeline

## Aggregation Pipeline

This project extensively uses MongoDB's Aggregation Pipeline to:
- Join data from different collections using `$lookup`.
- Add and manipulate fields with `$addFields`.
- Filter and project data using `$match` and `$project`.

## Getting Started

### Prerequisites

- Node.js
- MongoDB

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/patoliyaHenish/Videotube.git
   ```
2. Navigate to the project directory:
   ```bash
   cd Videotube
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up environment variables:
   - Create a `.env` file in the root directory.
   - Add your MongoDB URI, JWT secret, and other necessary configurations.

5. Start the server:
   ```bash
   npm start
   ```

6. Access the application:
   Open your browser and go to `http://localhost:3000`.

## Contributing

Contributions are welcome! Please fork this repository and submit a pull request with your changes.

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

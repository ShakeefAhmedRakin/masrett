const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.iixzvov.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const usersCollection = client.db("MASRETT").collection("users");
    const tutorialsCollection = client.db("MASRETT").collection("tutorials");
    const MCQExerciseCollection = client
      .db("MASRETT")
      .collection("mcqexercise");

    //  USER APIS
    app.post("/register", async (req, res) => {
      const { username, role, email } = req.body;

      // Check if all fields are provided
      if (!username || !role || !email) {
        return res.status(400).send("Missing required fields");
      }

      try {
        // Check if the user already exists
        const existingUser = await usersCollection.findOne({ email });

        if (existingUser) {
          return res.status(400).send("User with this email already exists");
        }

        // Insert new user into the collection
        const newUser = { username, role, email, viewedTutorialIDs: [] };
        await usersCollection.insertOne(newUser);

        res.status(201).send("User registered successfully");
      } catch (err) {
        console.error(err);
        res.status(500).send("Error registering user");
      }
    });

    app.get("/role", async (req, res) => {
      const { email } = req.query;

      if (!email) {
        return res.status(400).send("Email is required");
      }

      try {
        // Find user by email
        const user = await usersCollection.findOne({ email });

        if (!user) {
          return res.status(404).send("User not found");
        }

        // Send the role back as a response
        res.status(200).json({ role: user.role });
      } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching user role");
      }
    });

    app.put("/update-highest-score", async (req, res) => {
      const { email, score } = req.body;

      if (!email || score === undefined) {
        return res.status(400).send("Email and score are required");
      }

      try {
        // Find user by email
        const user = await usersCollection.findOne({ email });

        if (!user) {
          return res.status(404).send("User not found");
        }

        // Check if the highestMCQScore exists and update accordingly
        if (
          user.highestMCQScore === undefined ||
          user.highestMCQScore < score
        ) {
          await usersCollection.updateOne(
            { email },
            { $set: { highestMCQScore: score } } // Set the highest score
          );
          return res.status(200).send("Highest score updated successfully");
        } else {
          return res
            .status(200)
            .send("Highest score not updated; incoming score is not higher");
        }
      } catch (err) {
        console.error(err);
        res.status(500).send("Error updating highest score");
      }
    });

    app.get("/users/:email", async (req, res) => {
      const { email } = req.params; // Extract the email from the URL parameters

      try {
        // Fetch the user from the database using the email
        const user = await usersCollection.findOne({ email });

        if (!user) {
          return res.status(404).send("User not found"); // Handle case where user does not exist
        }

        // Remove sensitive information if needed
        const { password, ...userInfo } = user; // Assuming 'password' is a sensitive field

        res.status(200).json(userInfo); // Return user information as JSON
      } catch (err) {
        console.error("Error fetching user information:", err);
        res.status(500).send("Internal Server Error");
      }
    });

    // TUTORIAL APIS
    app.post("/tutorials", async (req, res) => {
      const { image, title } = req.body;

      if (!image || !title) {
        return res.status(400).json({ error: "Image and title are required" });
      }

      try {
        // Get the count of tutorials to assign a unique ID
        const count = await tutorialsCollection.countDocuments();
        const uniqueId = count + 1; // Generate a unique ID

        // Create the tutorial object
        const tutorial = {
          id: uniqueId, // Unique ID
          image,
          title,
        };

        // Insert the tutorial into the "tutorials" collection
        const result = await tutorialsCollection.insertOne(tutorial);

        res.status(201).json({
          message: "Tutorial added successfully",
          tutorialId: result.insertedId,
        });
      } catch (error) {
        console.error("Error adding tutorial:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    app.get("/tutorials", async (req, res) => {
      try {
        // Fetch all tutorials from the "tutorials" collection
        const tutorials = await tutorialsCollection.find({}).toArray();

        // Check if tutorials exist
        if (tutorials.length === 0) {
          return res.status(404).json({ message: "No tutorials found." });
        }

        // Respond with the list of tutorials
        res.status(200).json(tutorials);
      } catch (error) {
        console.error("Error fetching tutorials:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    app.post("/add-viewed-tutorial", async (req, res) => {
      const { email, tutorialId } = req.body;

      // Check if both fields are provided
      if (!email || !tutorialId) {
        return res.status(400).send("Missing required fields");
      }

      try {
        // Find the user by email
        const user = await usersCollection.findOne({ email });

        // Check if the user exists
        if (!user) {
          return res.status(404).send("User not found");
        }

        // Check if the tutorial ID is already in the viewedTutorialIDs array
        if (user.viewedTutorialIDs.includes(tutorialId)) {
          return res.status(400).send("Tutorial ID already viewed");
        }

        // Append the tutorial ID to the viewedTutorialIDs array
        await usersCollection.updateOne(
          { email },
          { $push: { viewedTutorialIDs: tutorialId } }
        );

        res.status(200).send("Tutorial ID added to viewed tutorials");
      } catch (err) {
        console.error(err);
        res.status(500).send("Error updating viewed tutorial IDs");
      }
    });

    app.get("/viewed", async (req, res) => {
      const { email } = req.query; // Get user email from the query parameters

      try {
        const user = await usersCollection.findOne(
          { email },
          { projection: { viewedTutorialIDs: 1 } }
        ); // Project only necessary fields

        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        const totalTutorials = await tutorialsCollection.countDocuments(); // Assuming you have a Tutorial model
        const viewedTutorials = user.viewedTutorialIDs.length; // Assuming `viewedTutorialIDs` is an array of tutorial IDs

        res.json({
          viewed: viewedTutorials,
          total: totalTutorials,
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
      }
    });

    // EXERCISE APIS
    app.post("/add-mcq-exercise", async (req, res) => {
      const { imageUrl, options } = req.body;

      if (!imageUrl || !options || options.length < 4) {
        return res.status(400).json({
          message: "Please provide an image URL and at least four options.",
        });
      }

      // The first index of options is the correct answer
      const correctAnswer = options[0];

      try {
        const newExercise = {
          imageUrl,
          options,
          correctAnswer,
        };

        // Insert the exercise into your MongoDB collection (assuming `mcqExercises` is your collection)
        const result = await MCQExerciseCollection.insertOne(newExercise);

        res.status(201).json({
          message: "MCQ exercise added successfully",
          exerciseId: result.insertedId,
        });
      } catch (error) {
        res
          .status(500)
          .json({ message: "Error adding MCQ exercise", error: error.message });
      }
    });

    app.get("/get-mcq-exercises", async (req, res) => {
      try {
        // Fetch all exercises from the collection
        const exercises = await MCQExerciseCollection.find().toArray();

        // Respond with the list of exercises
        res.status(200).json({
          message: "MCQ exercises fetched successfully",
          exercises,
        });
      } catch (error) {
        res.status(500).json({
          message: "Error fetching MCQ exercises",
          error: error.message,
        });
      }
    });

    app.get("/highest-score", async (req, res) => {
      const { email } = req.query; // Get user email from the query parameters

      try {
        const user = await usersCollection.findOne(
          { email },
          { projection: { highestMCQScore: 1 } }
        ); // Project only necessary fields

        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        const highestScore = user.highestMCQScore; // Assuming `highestMCQScore` is a field in your User model

        res.json({
          email: user.email,
          highestScore,
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
      }
    });

    app.get("/top-scores", async (req, res) => {
      try {
        // Find users and sort by highestMCQScore in descending order, limiting to 10
        const topUsers = await usersCollection
          .find({}, { projection: { username: 1, highestMCQScore: 1 } }) // Project only necessary fields
          .sort({ highestMCQScore: -1 })
          .limit(10)
          .toArray(); // Convert the cursor to an array

        // If no users found
        if (topUsers.length === 0) {
          return res.status(404).json({ message: "No users found" });
        }

        res.json(topUsers);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
      }
    });

    // API FOR SANDBOX AI MODEL UNDER HERE

    // ==========================================================================

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(port, () => {
  console.log("Server listening on port", port);
});

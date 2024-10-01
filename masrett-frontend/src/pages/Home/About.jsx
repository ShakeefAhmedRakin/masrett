const About = () => {
  return (
    <div className="about-section p-8 container mx-auto">
      <h1 className="text-4xl font-bold mb-6">About MASRETT</h1>
      <p className="text-lg mb-6">
        At MASRETT (Malaysian Sign Language Real-Time Tutorial), we are
        dedicated to bridging the communication gap for the deaf and
        hard-of-hearing community in Malaysia. Our mission is to make learning
        Malaysian Sign Language (MSL) accessible, interactive, and engaging for
        everyone.
      </p>

      <h2 className="text-3xl font-semibold mb-4">Why MASRETT?</h2>
      <p className="text-lg mb-6">
        We understand that learning sign language can be challenging, especially
        without real-time feedback. That's why MASRETT combines cutting-edge
        technology with educational tools to create an immersive experience for
        users. Through our platform, learners can practice MSL using their
        webcam, receive instant feedback, and track their progress with a
        variety of interactive tutorials, quizzes, and sandbox modes.
      </p>

      <h2 className="text-3xl font-semibold mb-4">Our Features</h2>
      <ul className="list-disc list-inside mb-6 text-lg">
        <li>
          <strong>Interactive Learning:</strong> Practice sign language in
          real-time using your webcam, with tutorials guiding you step-by-step
          through each sign.
        </li>
        <li>
          <strong>MSL Quizzes:</strong> Test your knowledge with our
          multiple-choice quizzes and track your highest scores. Compete with
          others in the leaderboard!
        </li>
        <li>
          <strong>Progress Tracking:</strong> Monitor how many tutorials you've
          completed and improve your skills at your own pace.
        </li>
        <li>
          <strong>Leaderboard:</strong> See where you rank among the top MSL
          learners and challenge yourself to reach new heights.
        </li>
      </ul>

      <h2 className="text-3xl font-semibold mb-4">Our Vision</h2>
      <p className="text-lg">
        MASRETT strives to be the go-to platform for anyone looking to learn or
        improve their Malaysian Sign Language skills. By offering an accessible
        and user-friendly learning environment, we hope to empower individuals
        and create a more inclusive society where communication is a right, not
        a barrier.
      </p>

      <p className="text-lg mt-6">
        Join us in making a difference, one sign at a time.
      </p>
    </div>
  );
};

export default About;

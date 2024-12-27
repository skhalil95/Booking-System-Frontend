<template>
  <div class="about-us-container flex flex-col items-center justify-start overflow-y-auto bg-gray-100">
    <!-- Main Content -->
    <div class="about-us-content w-full max-w-4xl bg-white rounded-lg shadow-lg p-6">
      <!-- Welcome Section -->
      <section class="text-center mb-8">
        <p class="text-lg text-gray-700 leading-relaxed">
          Welcome to our slot booking platform! Our mission is to simplify your scheduling process with a reliable and user-friendly platform.
        </p>
      </section>

      <!-- Developer Section -->
      <section class="mb-8">
        <h2 class="text-2xl font-semibold text-gray-800 mb-4">Meet the Developer</h2>
        <div class="flex items-center p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-sm">
          <div>
            <h3 class="text-xl font-medium text-gray-800 mb-2">Sara Khalil</h3>
            <p class="text-gray-600 text-sm leading-relaxed">
              Sara Khalil is a dedicated full-stack developer with expertise in designing seamless and efficient solutions for modern applications. She is passionate about creating intuitive, scalable, and high-performance systems that meet user needs.
            </p>
          </div>
        </div>
      </section>

      <!-- Contact Section -->
      <section>
        <h2 class="text-2xl font-semibold text-gray-800 mb-4">Contact Us</h2>
        <p class="text-lg text-gray-700 leading-relaxed">
          Have questions or feedback? Reach out at 
          <a href="mailto:sarahmkhalil95@gmail.com" class="text-blue-500 hover:underline">sarahmkhalil95@gmail.com</a>.
        </p>
        <p class="text-lg text-gray-700 mt-2 leading-relaxed">
          Follow us on social platforms for updates and announcements.
        </p>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: "AboutUs",
};
</script>

<style scoped>
.about-us-container {
  height: 80vh;
  flex: 1; /* Occupy remaining space in flex layout */
  overflow-y: auto; /* Enable scrolling for overflow content */
}

.about-us-content {
  max-width: 768px; /* Restrict maximum width */
  padding: 1.5rem; /* Internal spacing */
  margin: 0 auto; /* Center horizontally */
  background-color: #ffffff; /* White background */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Add subtle shadow */
  border-radius: 12px; /* Rounded corners */
}


@media (max-width: 480px) {
  .about-us-content {
    padding: 0.75rem;
    border-radius: 8px;
  }
}
</style>

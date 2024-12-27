<template>
  <!-- QDialog component for booking confirmation/details -->
  <q-dialog v-model="dialogVisible" persistent transition-show="scale" transition-hide="scale">
    <!-- Dialog content container -->
    <q-card class="q-pa-md rounded-lg shadow-lg dialog-card">
      <!-- Header Section -->
      <q-card-section class="dialog-header">
        <div class="text-h6 text-white">
          <!-- Display title based on success state -->
          {{ isSuccess ? "Booking Confirmed!" : "Booking Details" }}
        </div>
      </q-card-section>

      <!-- Body Section -->
      <q-card-section class="dialog-body">
        <!-- Content displayed when booking is not yet confirmed -->
        <div v-if="isLoading" class="row items-center justify-center">
          <q-spinner color="primary" size="6em" :thickness="2" />
        </div>
        <div v-else-if="!isSuccess">
          <div class="q-mb-md">
            <!-- Selected booking time display -->
            <div class="q-mb-sm text-grey-8 row items-center">
              <div class="q-mr-sm">Selected Time:</div>
              <div class="text-blue-600">{{ formattedBookingTime() }}</div>
            </div>
            <p class="text-body-2 text-grey-7">
              Please fill in your details to confirm the booking.
            </p>
          </div>

          <!-- Name Input Field -->
          <q-input v-model="name" label="Name" outlined dense class="q-mb-md" placeholder="Enter your name"
            :rules="[nameRule]" />

          <!-- Civil ID Input Field -->
          <q-input v-model="civilId" label="Civil ID" outlined dense type="text" maxlength="12" :rules="[civilIdRule]"
            class="q-mb-md" placeholder="Enter your Civil ID (12 digits)" @input="restrictCivilIdTo12Digits"
            @keypress="validateKeyPress" />
        </div>
        <!-- Content displayed after booking confirmation -->
        <div v-else class="text-center">
          <p class="text-h6">Thank You, {{ name }}</p>
          <p>Your booking has been successfully confirmed.</p>
          <!-- QR Code display -->
          <div class="row justify-center items-center q-mb-md">
            <img :src="qrCodeUrl" alt="QR Code" class="qr-code" />
          </div>
          <!-- Reserved time slot display -->
          <div class="row justify-center items-center">
            <div class="q-mr-sm row items-center">Reserved Slot:</div>
            <div class="text-blue-600">{{ formattedBookingTime() }}</div>
          </div>
          <!-- Download Ticket Button -->
          <q-btn outline no-caps class="q-mt-md btn-download" icon="download" label="Download Ticket"
            @click="downloadTicket" />
        </div>
      </q-card-section>

      <!-- Separator between body and footer -->
      <q-separator class="grey-4" size="xs" />

      <!-- Footer Section -->
      <q-card-actions align="right">
        <!-- Cancel and Confirm buttons when booking is not yet confirmed -->
        <q-btn v-if="!isSuccess" no-caps flat label="Cancel" @click="closeHandler" class="btn-cancel" />
        <q-btn v-if="!isSuccess" no-caps label="Book" :disable="isDisableConfirmBtn" @click="book()"
          class="btn-confirm" />
        <!-- Close button after booking confirmation -->
        <q-btn v-else no-caps label="Close" @click="close" class="btn-close" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "BookingDialog",
  props: {
    isOpen: {
      type: Boolean, // Determines if the dialog is visible
      required: true,
    },
    bookingTime: {
      type: String, // The selected booking time
      default: "",
    },
    closeHandler: {
      type: Function, // Function to close the dialog
      required: true,
    },
    reserveHandler: {
      type: Function, // Function to handle booking reservation
      required: true,
    },
  },
  data() {
    return {
      name: "", // User's name
      civilId: "", // User's civil ID
      startTime: "", // Booking start time
      isSuccess: false, // Booking success state
      qrCodeUrl: "", // URL for the QR code
      bookingId: "", // Booking ID for the confirmed booking
      isLoading: false, // Loading flag for veiwing spinner
    };
  },
  computed: {
    // Bind dialog visibility to the `isOpen` prop
    dialogVisible: {
      get() {
        return this.isOpen;
      },
    },
    // Validation rule for Civil ID
    civilIdRule() {
      return (val) => this.validateCivilId(val) || "Civil ID must be exactly 12 digits.";
    },
    // Validation rule for Name
    nameRule() {
      return (val) => this.validateName(val) || "Name cannot be empty.";
    },
    // Disable confirm button if inputs are invalid
    isDisableConfirmBtn() {
      return !(this.validateName(this.name) && this.validateCivilId(this.civilId)) || this.isLoading;
    },
  },
  methods: {
    ...mapActions("booking", ["downloadBookingPDF"]), // Vuex action to download booking PDF

    // Validate that the name is not empty
    validateName(val) {
      return val && val.trim().length > 0;
    },
    // Validate that Civil ID is exactly 12 digits
    validateCivilId(val) {
      return /^[0-9]{12}$/.test(val);
    },
    // Restrict Civil ID input to numeric characters and a maximum of 12 digits
    restrictCivilIdTo12Digits() {
      this.civilId = this.civilId.replace(/[^0-9]/g, "").slice(0, 12);
    },
    // Prevent non-numeric characters in Civil ID input
    validateKeyPress(event) {
      const charCode = event.keyCode || event.which;
      if (charCode < 48 || charCode > 57) {
        event.preventDefault();
      }
    },
    // Format the booking time for display
    formattedBookingTime() {
      if (!this.bookingTime) return "";

      const [date, time] = this.bookingTime.split(" ");
      const [year, month, day] = date.split("-");
      let [hour, minute] = time.split(":").map(Number);

      const endHour = (hour + 1) % 24;
      const startPeriod = hour >= 12 ? "pm" : "am";
      const formattedStartHour = ((hour % 12) || 12).toString().padStart(2, "0");

      const endPeriod = endHour >= 12 ? "pm" : "am";
      const formattedEndHour = ((endHour % 12) || 12).toString().padStart(2, "0");

      const formattedDate = `${day}-${month}-${year}`;

      return `${formattedDate}, ${formattedStartHour}:${minute.toString().padStart(2, "0")} ${startPeriod} - ${formattedEndHour}:${minute.toString().padStart(2, "0")} ${endPeriod}`;
    },
    // Handle booking confirmation
    async book() {
      this.isLoading = true;
      const bookingObject = {
        name: this.name,
        civil_id: this.civilId,
        start_time: this.bookingTime,
      };

      try {
        const response = await this.reserveHandler(bookingObject);
        this.qrCodeUrl = `${import.meta.env.VITE_API_BASE_QR_URL}${response.booking.qr_code}`;
        this.bookingId = response.booking.id;
        this.isLoading = false;
        this.isSuccess = true;
      } catch (error) {
        console.error("Booking failed", error);
      }
    },
    // Close the dialog and reset data
    close() {
      this.name = "";
      this.civilId = "";
      this.startTime = "";
      this.isSuccess = false;
      this.qrCodeUrl = "";
      this.closeHandler();
    },
    // Download the ticket as a PDF
    async downloadTicket() {
      if (!this.bookingId) {
        console.error("Booking ID is required to download the PDF.");
        return;
      }
      try {
        await this.downloadBookingPDF(this.bookingId);
        this.$q.notify({ type: "positive", message: "PDF downloaded successfully!" });
      } catch (error) {
        console.error("Error downloading PDF:", error);
        this.$q.notify({ type: "negative", message: "Failed to download PDF." });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.dialog-card {
  max-width: 500px;
  width: 100%;
  @apply shadow-lg rounded-lg;
}

.dialog-header {
  @apply bg-blue-800 text-white rounded-t-lg;
}

.btn-cancel {
  @apply text-blue-800 hover:bg-blue-100;
}

.btn-confirm {
  @apply bg-blue-800 text-white hover:bg-blue-100 hover:text-blue-800;
}

.btn-close {
  @apply bg-blue-800 text-white hover:bg-blue-100 hover:text-blue-800;
}

.qr-code {
  @apply max-w-xs w-full;
}

.btn-download {
  @apply text-blue-800 hover:bg-blue-100;
}
</style>

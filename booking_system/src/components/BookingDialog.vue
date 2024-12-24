<template>
  <q-dialog v-model="dialogVisible" persistent transition-show="scale" transition-hide="scale">
    <q-card class="q-pa-md rounded-lg shadow-lg dialog-card">
      <!-- Header -->
      <q-card-section class="dialog-header">
        <div class="text-h6 text-white">Booking Details</div>
      </q-card-section>

      <!-- Body -->
      <q-card-section class="dialog-body">
        <div class="q-mb-md">
          <div class="q-mb-sm text-grey-8 row items-center">
            <div class="q-mr-sm">Selected Time:</div>
            <div class="green">{{ formattedBookingTime() }}</div>
          </div>
          <p class="text-body-2 text-grey-7">
            Please fill in your details to confirm the booking.
          </p>
        </div>

        <!-- Name Input -->
        <q-input v-model="name" label="Name" outlined dense class="q-mb-md" placeholder="Enter your name"
          :rules="[nameRule]" color="teal" />

        <!-- Civil ID Input -->
        <!-- Updated Civil ID Input -->
        <q-input v-model="civilId" label="Civil ID" outlined dense type="text" maxlength="12" :rules="[civilIdRule]"
          class="q-mb-md" placeholder="Enter your Civil ID (12 digits)" @input="validateCivilId"
          @keypress="validateKeyPress" color="teal" />
      </q-card-section>
        <q-separator class="grey-4" size="xs"/>
      <!-- Footer -->
      <q-card-actions align="right">
        <q-btn no-caps flat label="Cancel" color="teal" @click="closeHandler" class="btn-cancel" />
        <q-btn no-caps label="Confirm" color="teal" @click="reserveHandler(bookingTime)" class="btn-confirm" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: "BookingDialog",
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
    bookingTime: {
      type: String,
      default: "",
    },
    closeHandler: {
      type: Function,
      required: true
    },
    reserveHandler: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      name: "",
      civilId: "",
    };
  },
  computed: {
    dialogVisible: {
      get() {
        return this.isOpen;
      },
    },
    civilIdRule() {
      return val => /^[0-9]{12}$/.test(val) || "Civil ID must be exactly 12 digits.";
    },
    nameRule() {
      return val => (val && val.trim().length > 0) || "Name cannot be empty.";
    },
  },
  methods: {
    validateCivilId() {
      // Ensure Civil ID only contains digits and is not longer than 12
      this.civilId = this.civilId.replace(/[^0-9]/g, "").slice(0, 12);
    },
    validateKeyPress(event) {
      // Allow only numeric keys (48-57 for 0-9)
      const charCode = event.keyCode || event.which;
      if (charCode < 48 || charCode > 57) {
        event.preventDefault(); // Prevent non-numeric input
      }
    },
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

      // Format date to DD-MM-YYYY
      const formattedDate = `${day}-${month}-${year}`;

      return `${formattedDate}, ${formattedStartHour}:${minute.toString().padStart(2, "0")} ${startPeriod} - ${formattedEndHour}:${minute.toString().padStart(2, "0")} ${endPeriod}`;
    }

  },
};
</script>


<style scoped>
.dialog-card {
  max-width: 500px;
  width: 100%;
}

.dialog-header {
  background-color: #00796b;
  /* Teal */
  color: white;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

.btn-cancel {
  color: #d32f2f;
  /* Red */
}

.btn-cancel:hover {
  background-color: rgba(211, 47, 47, 0.1);
}

.btn-confirm {
  color: #388e3c;
  /* Green */
}

.btn-confirm:hover {
  background-color: rgba(56, 142, 60, 0.1);
}

.text-primary {
  color: #15803D;
  /* Teal for time */
}
</style>

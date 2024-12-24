<template>
  <div>
    <q-dialog 
      v-model="dialogVisible" 
      persistent 
      transition-show="scale" 
      transition-hide="scale"
    >
      <q-card class="bg-teal text-white" style="width: 300px">
        <!-- Dialog Header -->
        <q-card-section>
          <div class="text-h6">Confirm Booking</div>
        </q-card-section>

        <!-- Dialog Body -->
        <q-card-section class="q-pt-none">
          <div>
            Selected Time: <strong>{{ bookingTime }}</strong>
          </div>
          <div class="text-sm text-gray-200 mt-2">
            Do you want to confirm this booking?
          </div>
        </q-card-section>

        <!-- Dialog Actions -->
        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="Cancel" color="negative" @click="closeDialog" />
          <q-btn flat label="Confirm" color="positive" @click="confirmBooking" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
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
  },
  emits: ["update:isOpen", "confirm"],
  computed: {
    dialogVisible: {
      get() {
        return this.isOpen;
      },
      set(value) {
        this.$emit("update:isOpen", value);
      },
    },
  },
  methods: {
    closeDialog() {
      this.$emit("update:isOpen", false); // Close dialog
    },
    confirmBooking() {
      this.$emit("confirm", this.bookingTime); // Emit confirmation with booking time
      this.closeDialog();
    },
  },
};
</script>


 

<style scoped>
/* Additional styles (if any) */
</style>

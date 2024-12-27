<template>
  <!-- BookingDialog component to handle booking details -->
  <BookingDialog :is-open="isDialogOpen" :booking-time="selectedBookingTime" :reserve-handler="reserveHandler"
    :close-handler="closeHandler" />
  <!-- Main calendar container -->
  <div class="calendar-container mx-auto p-4 shadow-lg bg-white rounded-lg">
    <!-- Header for the calendar with navigation buttons -->
    <div class="calendar-header flex justify-between items-center mb-4">
      <h3 class="text-blue-900 text-xl font-bold">Weekly Calendar</h3>
      <div>
        <!-- Button to navigate to the previous week -->
        <button class="bg-blue-800 text-white px-2 py-1 rounded hover:bg-blue-900" @click="onPrev">
          <span class="material-icons">arrow_back</span>
        </button>
        <!-- Button to navigate to the current day -->
        <button class="bg-blue-800 text-white px-4 py-2 ml-2 rounded hover:bg-blue-900" @click="onToday">
          Today
        </button>
        <!-- Button to navigate to the next week -->
        <button class="bg-blue-800 text-white px-2 py-1 rounded ml-2 hover:bg-blue-900" @click="onNext">
          <span class="material-icons">arrow_forward</span>
        </button>
      </div>
    </div>

    <!-- Body of the calendar displaying events -->
    <div class="calendar-body">
      <q-calendar-day ref="calendar" v-model="selectedDate" view="week" :interval-minutes="bookingDuration"
        :disabled-before="disabledDaysBefore" focusable hoverable :interval-count="7" :disabled-days="disabledDays()"
        :interval-start="bookingStartingWindow" :interval-height="bookingDuration" time-clicks-clamped
        :selected-dates="selectedDates" animated bordered @click-time="onSlotClick"
        class="rounded border border-gray-200 shadow-sm">
        <!-- Custom rendering for the events within each day -->
        <template #day-body="{ scope: { timestamp, timeStartPos, timeDurationHeight } }">
          <template v-for="event in getEventsByDate(timestamp.date)" :key="event.id">
            <!-- Display each event with appropriate styles and titles -->
            <div v-if="event.time !== undefined" class="my-event" :class="badgeClasses(event)"
              :style="badgeStyles(event, timeStartPos, timeDurationHeight)">
              <span class="title q-calendar__ellipsis">
                {{ event.title === 'DISABLE' ? '' : 'BOOKED' }}
              </span>
            </div>
          </template>
        </template>

        <!-- Additional header information for each column -->
        <template #column-header-before="{ scope }">
          <div class="fit row justify-center">
            <span>{{ getMonth(scope.timestamp.date) }}</span>
          </div>
        </template>

        <!-- Indicator for the current time -->
        <template #day-container="{ scope: { days } }">
          <template v-if="hasDateInWeek(days)">
            <div class="day-view-current-time-indicator" :style="styleTimeIndicator"></div>
            <div class="day-view-current-time-line" :style="styleTimeIndicator"></div>
          </template>
        </template>
      </q-calendar-day>
    </div>
  </div>
</template>

<script>
import {
  QCalendarDay,
  today,
  copyTimestamp,
  getDateTime,
  parseTimestamp,
  addToDate,
  parseDate,
  parseTime,
} from "@quasar/quasar-ui-qcalendar/src/index.js";

import BookingDialog from "./BookingDialog.vue";
import { defineComponent } from "vue";
import { mapGetters, mapActions } from "vuex";

export default defineComponent({
  name: "CalendarView",
  components: {
    QCalendarDay,
    BookingDialog,
  },
  computed: {
    // Vuex getter to fetch all bookings from the store
    ...mapGetters("booking", ["allBookings"]),
    // Process bookings and add custom events such as disabled slots
    events() {
      let incomingBookings = this.allBookings.bookings?.map((booking) => {
        const startTime = new Date(booking.start_time);
        const endTime = new Date(booking.end_time);
        const duration = (endTime - startTime) / (1000 * 60);

        return {
          id: booking.id,
          title: "BOOKED",
          date: booking.start_time.split(" ")[0],
          time: booking.start_time.split(" ")[1].slice(0, 5),
          duration,
          bgcolor: "teal",
        };
      });
      incomingBookings = incomingBookings?.concat(this.addDisableSlots());
      return incomingBookings;
    },
    // Determine the earliest date available for booking
    disabledDaysBefore() {
      let ts = parseTimestamp(today());
      ts = addToDate(ts, { day: -1 });
      return ts.date;
    },
    // Style for the current time indicator
    styleTimeIndicator() {
      return {
        top: this.timeStartPos + "px",
      };
    },
    // Map events by date for optimized retrieval
    eventsMap() {
      const map = {};
      this.events?.forEach((event) => {
        if (!map[event.date]) {
          map[event.date] = [];
        }
        map[event.date].push(event);
        if (event.days) {
          let timestamp = parseTimestamp(event.date);
          let days = event.days;
          do {
            timestamp = addToDate(timestamp, { day: 1 });
            if (!map[timestamp.date]) {
              map[timestamp.date] = [];
            }
            map[timestamp.date].push(event);
          } while (--days > 0);
        }
      });
      return map;
    },
  },
  data() {
    return {
      selectedDate: today(), // Current selected date
      selectedDates: [], // Dates currently selected
      isDialogOpen: false, // Tracks if the booking dialog is open
      selectedBookingTime: "", // Time slot selected for booking
      currentDate: null, // Current date
      currentTime: null, // Current time
      timeStartPos: 0, // Position of the current time indicator
      intervalId: null, // Interval ID for periodic updates
      bookingDuration: 60, // Duration of each booking slot in minutes
      bookingStartingWindow: 9, // Starting time for bookings (9 AM)
      bookingEndingWindow: 16, // Ending time for bookings (4 PM)
    };
  },
  methods: {
    ...mapActions("booking", ["fetchBookings", "createBooking"]),
    // Get the month name for a given timestamp
    getMonth(timestamp) {
      const date = new Date(timestamp);
      const formatter = new Intl.DateTimeFormat("en-US", { month: "long" });
      return formatter.format(date);
    },
    // Handler to create a new booking
    async reserveHandler(bookingObject) {
      try {
        return await this.createBooking(bookingObject);
      } catch (error) {
        console.error("Error creating booking:", error.message);
        this.isDialogOpen = false;
      }
    },
    // Determine days to disable for bookings
    disabledDays() {
      const currentTime = new Date().getHours() * 60 + new Date().getMinutes();
      const fourPm = this.bookingEndingWindow * 60;
      return currentTime >= fourPm ? [today()] : [];
    },
    // Add disabled slots to the calendar
    addDisableSlots() {
      let disabledSlots = [];
      const disableStartTime = `0${this.bookingStartingWindow}:00`;
      const todayDate = new Date();
      const currentTime = todayDate.toTimeString().slice(0, 5);
      let timestamp = parseTimestamp(this.getCurrentDay(todayDate.getDate()));
      let startTime = parseTime(disableStartTime);

      while (startTime < parseTime(currentTime)) {
        const intervalStart = startTime;
        const intervalEnd = startTime + this.bookingDuration;

        const now = parseTime(currentTime);
        if (now >= intervalStart && now < intervalEnd) {
          startTime += this.bookingDuration;
          continue;
        }

        disabledSlots.push({
          id: this.allBookings.bookings.length + disabledSlots.length + 1,
          title: "DISABLE",
          date: timestamp.date,
          time: this.formatTime(intervalStart),
          duration: this.bookingDuration,
        });

        startTime += this.bookingDuration;
      }
      return disabledSlots;
    },
    // Format time in HH:mm format
    formatTime(minutes) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
    },
    // Get the current day as a formatted string
    getCurrentDay(day) {
      const newDay = new Date(new Date());
      newDay.setDate(day);
      const tm = parseDate(newDay);
      return tm.date;
    },
    // Determine CSS classes for event badges
    badgeClasses(event) {
      if (event.title === "DISABLE") return "disabled-slot full-width";
      return {
        "text-white bg-blue-500 disabled-slot": true,
        "full-width": "full",
        "rounded-border": true,
      };
    },
    // Apply styles to event badges
    badgeStyles(event, timeStartPos = undefined, timeDurationHeight = undefined) {
      const s = {};
      if (timeStartPos && timeDurationHeight) {
        s.top = timeStartPos(event.time) + "px";
        s.height = timeDurationHeight(event.duration) + "px";
      }
      s["align-items"] = "flex-start";
      return s;
    },
    // Retrieve events by date
    getEventsByDate(dt) {
      const events = this.eventsMap[dt] || [];
      if (events.length === 1) {
        events[0].side = "full";
      }
      return events;
    },
    // Check if a date is in the current week
    hasDateInWeek(days) {
      return this.currentDate
        ? days.find((day) => day.date === this.currentDate)
        : false;
    },
    // Adjust the position of the current time indicator
    adjustCurrentTime() {
      const now = parseDate(new Date());
      this.currentDate = now.date;
      this.currentTime = now.time;
      this.timeStartPos = this.$refs.calendar.timeStartPos(
        this.currentTime,
        false
      );
    },
    // Handle clicking on a slot
    onSlotClick({ scope }) {
      if (!scope || !scope.timestamp) return;

      const now = new Date();
      const nowDate = now.toISOString().split("T")[0];
      const nowTime = now.toTimeString().split(" ")[0];

      const slotDate = scope.timestamp.date;
      const slotTime = scope.timestamp.time;

      const [nowHours, nowMinutes, nowSeconds] = nowTime.split(":").map(Number);
      const [slotHours, slotMinutes, slotSeconds] = slotTime.split(":").map(Number);

      const nowTotalSeconds =
        nowHours * 3600 + nowMinutes * 60 + nowSeconds;
      const slotTotalSeconds =
        slotHours * 3600 + slotMinutes * 60 + slotSeconds;

      if (
        slotDate < nowDate ||
        (slotDate === nowDate && slotTotalSeconds < nowTotalSeconds)
      )
        return;

      const ts = copyTimestamp(scope.timestamp);
      const t = getDateTime(ts);
      this.selectedBookingTime = t;

      this.isDialogOpen = true;
    },
    // Close the booking dialog
    closeHandler() {
      this.isDialogOpen = false;
    },
    // Navigate to the current day
    onToday() {
      this.$refs.calendar.moveToToday();
    },
    // Navigate to the previous week
    onPrev() {
      this.$refs.calendar.prev();
    },
    // Navigate to the next week
    onNext() {
      this.$refs.calendar.next();
    },
  },
  // Fetch bookings and adjust current time on mount
  mounted() {
    this.fetchBookings();
    this.adjustCurrentTime();
    this.intervalId = setInterval(() => {
      const currentHour = new Date().getHours();
      if (
        currentHour >= this.bookingStartingWindow &&
        currentHour < this.bookingEndingWindow
      ) {
        this.adjustCurrentTime();
      } else {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
    }, 60000);
  },
  // Clear interval on unmount
  beforeUnmount() {
    clearInterval(this.intervalId);
  },
});
</script>

<style scoped>
/* Calendar container styles */
.calendar-container {
  width: 97%;
}

/* Calendar header styles */
.calendar-header h3 {
  margin-bottom: 0;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.calendar-header div {
  display: flex;
  gap: 0.5rem;
}

.material-icons {
  font-size: 20px;
}

.q-calendar-day__interval {
  color: #555;
}

.day-view-current-time-indicator {
  position: absolute;
  left: -5px;
  height: 10px;
  width: 10px;
  margin-top: -4px;
  background-color: rgba(0, 0, 255, 0.5);
  border-radius: 50%;
}

.day-view-current-time-line {
  position: absolute;
  left: 5px;
  border-top: 2px solid rgba(0, 0, 255, 0.5);
  width: calc(100% - 5px);
}

.my-event {
  position: absolute;
  font-size: 12px;
  justify-content: center;
  margin: 0 1px;
  text-overflow: ellipsis;
  overflow: hidden;
  cursor: pointer;
}

.title {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.rounded-border {
  border-radius: 3px;
}

.disabled-slot {
  cursor: not-allowed;
  /* Indicate non-clickable */
}
</style>

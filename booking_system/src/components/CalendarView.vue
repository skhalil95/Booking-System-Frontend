<template>
  <BookingDialog :is-open="isDialogOpen" :booking-time="selectedBookingTime" :reserve-handler="reserveHandler"
    :close-handler="closeHandler" />
  <div class="calendar-container mx-auto p-4 shadow-lg bg-white rounded-lg">
    <div class="calendar-header flex justify-between items-center mb-4">
      <h3 class="text-green-700 text-xl font-bold">
        <h3 class="text-green-700 text-xl font-bold">Weekly Calendar</h3>
      </h3>
      <div>
        <!-- Arrow buttons for navigation -->
        <button class="bg-green-700 text-white px-2 py-1 rounded hover:bg-green-800" @click="onPrev">
          <span class="material-icons">arrow_back</span>
        </button>
        <button class="bg-green-700 text-white px-4 py-2 ml-2 rounded hover:bg-green-800" @click="onToday">
          Today
        </button>
        <button class="bg-green-700 text-white px-2 py-1 rounded ml-2 hover:bg-green-800" @click="onNext">
          <span class="material-icons">arrow_forward</span>
        </button>
      </div>
    </div>

    <div class="calendar-body">
      <q-calendar-day ref="calendar" v-model="selectedDate" view="week" :interval-minutes="60"
        :disabled-before="disabledDaysBefore" focusable hoverable :interval-count="24":disabled-days="disabledDays()" :interval-start="9"
        :interval-height="60" time-clicks-clamped :selected-dates="selectedDates" animated bordered
        @click-time="onSlotClick" class="rounded border border-gray-200 shadow-sm">
        <template #day-body="{ scope: { timestamp, timeStartPos, timeDurationHeight } }">
          <template v-for="event in getEventsByDate(timestamp.date)" :key="event.id">
            <div v-if="event.time !== undefined" class="my-event" :class="badgeClasses(event)"
              :style="badgeStyles(event, timeStartPos, timeDurationHeight)">
              <span class="title q-calendar__ellipsis">
                {{ event.title === 'DISABLE' ? '' : 'BOOKED' }}
              </span>
            </div>
          </template>
        </template>

        <template #column-header-before="{ scope }">
          <div class="fit row justify-center">
            <span>{{  getMonth(scope.timestamp.date) }}</span>
          </div>
        </template>

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
import "@quasar/quasar-ui-qcalendar/src/QCalendarVariables.sass";
import "@quasar/quasar-ui-qcalendar/src/QCalendarTransitions.sass";
import "@quasar/quasar-ui-qcalendar/src/QCalendarDay.sass";

import { defineComponent } from "vue";
import BookingDialog from "./BookingDialog.vue";
import { mapGetters, mapActions } from 'vuex';

export default defineComponent({
  name: "CalendarView",
  components: {
    QCalendarDay,
    BookingDialog
  },
  computed: {
    ...mapGetters('booking', ['allBookings']),
    events() {
      let incomingBookings = this.allBookings.bookings?.map(booking => {
        // Calculate duration in minutes
        const startTime = new Date(booking.start_time);
        const endTime = new Date(booking.end_time);
        const duration = (endTime - startTime) / (1000 * 60); // Convert ms to minutes

        return {
          id: booking.id,
          title: 'BOOKED',
          date: booking.start_time.split(" ")[0], // Extract date (YYYY-MM-DD)
          time: booking.start_time.split(" ")[1].slice(0, 5), // Extract time (HH:mm)
          duration: duration, // Duration in minutes
          bgcolor: 'teal',
        };
      });
      incomingBookings = incomingBookings?.concat(this.addDisableSlots())
      return incomingBookings;
    },
    disabledDaysBefore() {
      let ts = parseTimestamp(today())
      ts = addToDate(ts, { day: -1 })
      return ts.date
    },
    styleTimeIndicator() {
      return {
        top: this.timeStartPos + 'px'
      }
    },
    eventsMap() {
      const map = {}
      this.events?.forEach(event => {
        if (!map[event.date]) {
          map[event.date] = []
        }
        map[event.date].push(event)
        if (event.days) {
          let timestamp = parseTimestamp(event.date)
          let days = event.days
          do {
            timestamp = addToDate(timestamp, { day: 1 })
            if (!map[timestamp.date]) {
              map[timestamp.date] = []
            }
            map[timestamp.date].push(event)
          } while (--days > 0)
        }
      })
      return map
    }

  },
  data() {
    return {
      selectedDate: today(),
      selectedDates: [],
      isDialogOpen: false,
      selectedBookingTime: "",
      currentDate: null,
      currentTime: null,
      timeStartPos: 0,
      intervalId: null,
    }
  },
  methods: {
    ...mapActions('booking', ['fetchBookings', 'createBooking']),
    getMonth(timestamp) {

      const date = new Date(timestamp);

      // Use Intl.DateTimeFormat to get the full month name
      const formatter = new Intl.DateTimeFormat("en-US", { month: "long" });
      return formatter.format(date); // "December"
      // return timestamp;
    },
    async reserveHandler(bookingObject) {
      try {
        return await this.createBooking(bookingObject);
      } catch (error) {
        console.error('Error creating booking:', error.message);
        this.isDialogOpen = false;
      }
    },
    disabledDays() {
      const currentTime = new Date().getHours() * 60 + new Date().getMinutes(); // Current time in minutes
      const fourPm = 16 * 60; // 4 PM in minutes

      // Disable today if current time is past 4 PM
      return currentTime >= fourPm ? [today()] : [];
    },
    addDisableSlots() {
      let disabledSlots = [];
      const disableStartTime = "09:00"; // Starting time for disable intervals
      const todayDate = new Date(); // Today's date
      const currentTime = todayDate.toTimeString().slice(0, 5); // Current time in HH:mm format

      // Parse starting date and time
      let timestamp = parseTimestamp(this.getCurrentDay(todayDate.getDate())); // From the start of today
      let startTime = parseTime(disableStartTime);

      while (startTime < parseTime(currentTime)) {
        const intervalStart = startTime;
        const intervalEnd = startTime + 60; // Each interval is 1 hour (60 minutes)

        // Check if the current time lies within this interval
        const now = parseTime(currentTime);
        if (now >= intervalStart && now < intervalEnd) {
          // Skip this interval
          startTime += 60; // Move to the next interval
          continue;
        }

        // Create and add disable event
        disabledSlots.push({
          id: this.allBookings.bookings.length + disabledSlots.length + 1,
          title: "DISABLE",
          date: timestamp.date,
          time: this.formatTime(intervalStart), // Format time as HH:mm
          duration: 60, // Duration in minutes
        });

        // Increment time by 1 hour (60 minutes)
        startTime += 60;
      }
      return disabledSlots;
    },
    formatTime(minutes) {
      // Convert minutes to HH:mm format
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
    },
    getCurrentDay(day) {
      const newDay = new Date(new Date())
      newDay.setDate(day)
      const tm = parseDate(newDay)
      return tm.date
    },
    badgeClasses(event) {
      if (event.title === 'DISABLE')
        return 'disabled-slot full-width'
      return {
        'text-white bg-teal disabled-slot': true,
        'full-width': 'full',
        'rounded-border': true,
      }
    },

    badgeStyles(event, timeStartPos = undefined, timeDurationHeight = undefined) {
      const s = {}
      if (timeStartPos && timeDurationHeight) {
        s.top = timeStartPos(event.time) + 'px'
        s.height = timeDurationHeight(event.duration) + 'px'
      }
      s['align-items'] = 'flex-start'
      return s
    },

    getEventsByDate(dt) {
      // get all events for the specified date
      const events = this.eventsMap[dt] || []

      if (events.length === 1) {
        events[0].side = 'full'
      }
      return events
    },

    hasDateInWeek(days) {
      return this.currentDate
        ? days.find(day => day.date === this.currentDate)
        : false
    },
    adjustCurrentTime() {
      const now = parseDate(new Date())
      this.currentDate = now.date
      this.currentTime = now.time
      this.timeStartPos = this.$refs.calendar.timeStartPos(this.currentTime, false)
    },
    onSlotClick({ scope }) {
      if (!scope || !scope.timestamp) {
        return; // Exit if scope or timestamp is invalid
      }

      const now = new Date();
      const nowDate = now.toISOString().split('T')[0]; // Current date as 'YYYY-MM-DD'
      const nowTime = now.toTimeString().split(' ')[0]; // Current time as 'HH:mm:ss'

      const slotDate = scope.timestamp.date; // Expected 'YYYY-MM-DD'
      const slotTime = scope.timestamp.time; // Expected 'HH:mm:ss'

      // Convert time to minutes since midnight for comparison
      const [nowHours, nowMinutes, nowSeconds] = nowTime.split(':').map(Number);
      const [slotHours, slotMinutes, slotSeconds] = slotTime.split(':').map(Number);

      const nowTotalSeconds = nowHours * 3600 + nowMinutes * 60 + nowSeconds;
      const slotTotalSeconds = slotHours * 3600 + slotMinutes * 60 + slotSeconds;

      // Prevent booking past slots
      if (
        slotDate < nowDate ||
        (slotDate === nowDate && slotTotalSeconds < nowTotalSeconds)
      ) 
        return;

      // Copy and set the selected booking time
      const ts = copyTimestamp(scope.timestamp); // Assumes this creates a deep copy
      const t = getDateTime(ts); // Convert timestamp to desired format
      this.selectedBookingTime = t;

      // Open booking dialog
      this.isDialogOpen = true;
    }
    ,
    closeHandler() {
      this.isDialogOpen = false;
    },
    onToday() {
      this.$refs.calendar.moveToToday();
    },
    onPrev() {
      this.$refs.calendar.prev();
    },
    onNext() {
      this.$refs.calendar.next();
    },
  },
  mounted() {
    this.fetchBookings();
    this.adjustCurrentTime();
    // now, adjust the time every minute
    this.intervalId = setInterval(() => {
      const currentHour = new Date().getHours();
      if (currentHour >= 9 && currentHour < 16) {
        // Within working hours, adjust the current time
        this.adjustCurrentTime();
      } else {
        // Outside working hours, stop polling
        clearInterval(this.intervalId);
        this.intervalId = null; // Reset interval ID
      }
    }, 60000); // Poll every minute
  },
  beforeUnmount() {
    clearInterval(this.intervalId);
  }
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

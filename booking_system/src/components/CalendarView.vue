<template>
   <BookingDialog
      :is-open="isDialogOpen"
      :booking-time="selectedBookingTime"
      :reserve-handler="reserveHandler"
      :close-handler="closeHandler"
    />
  <div class="calendar-container mx-auto p-4 shadow-lg bg-white rounded-lg">
    <div class="calendar-header flex justify-between items-center mb-4">
      <h3 class="text-green-700 text-xl font-bold">Weekly Calendar</h3>
      <div>
        <!-- Arrow buttons for navigation -->
        <button
          class="bg-green-700 text-white px-2 py-1 rounded hover:bg-green-800"
          @click="onPrev"
        >
          <span class="material-icons">arrow_back</span>
        </button>
        <button
          class="bg-green-700 text-white px-4 py-2 ml-2 rounded hover:bg-green-800"
          @click="onToday"
        >
          Today
        </button>
        <button
          class="bg-green-700 text-white px-2 py-1 rounded ml-2 hover:bg-green-800"
          @click="onNext"
        >
          <span class="material-icons">arrow_forward</span>
        </button>
      </div>
    </div>

    <div class="calendar-body">
      <q-calendar-day
        ref="calendar"
        v-model="selectedDate"
        view="week"
        :interval-minutes="60"
        :weekdays="[0,1,2,3,4]"
        :disabled-before="disabledBefore"
        :interval-count="12"
        :interval-start="9"
        :interval-height="60"
        time-clicks-clamped
        :selected-dates="selectedDates"
        animated
        bordered
        @click-time="onToggleTime"
        @change="onChange"
        @moved="onMoved"
        @click-date="onClickDate"
        @click-interval="onClickInterval"
        @click-head-intervals="onClickHeadIntervals"
        @click-head-day="onClickHeadDay"
        class="rounded border border-gray-200 shadow-sm"
      >
      <template #day-container="{ scope: { days }}">
            <template v-if="hasDate(days)">
              <div
                class="day-view-current-time-indicator"
                :style="style"
              ></div>
              <div
                class="day-view-current-time-line"
                :style="style"
              ></div>
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
  parseDate
} from "@quasar/quasar-ui-qcalendar/src/index.js";
import "@quasar/quasar-ui-qcalendar/src/QCalendarVariables.sass";
import "@quasar/quasar-ui-qcalendar/src/QCalendarTransitions.sass";
import "@quasar/quasar-ui-qcalendar/src/QCalendarDay.sass";

import { defineComponent } from "vue";
import BookingDialog from "./BookingDialog.vue";

export default defineComponent({
  name: "CalendarView",
  components: {
    QCalendarDay,
    BookingDialog
  },
  computed: {
    disabledBefore () {
      let ts = parseTimestamp(today())
      ts = addToDate(ts, { day: -1 })
      return ts.date
    },
    style() {
      return {
        top: this.timeStartPos + 'px'
      }
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
      intervalId: null
    };
  },
  methods: {
    hasDate (days) {
      return this.currentDate
        ? days.find(day => day.date === this.currentDate)
        : false
    },
    adjustCurrentTime () {
      const now = parseDate(new Date())
      this.currentDate = now.date
      this.currentTime = now.time
      this.timeStartPos = this.$refs.calendar.timeStartPos(this.currentTime, false)
    },
    onToggleTime({ scope }) {
      if (scope === undefined) {
        return;
      }

      const ts = copyTimestamp(scope.timestamp);
      const t = getDateTime(ts);
      this.selectedBookingTime = t;
      this.isDialogOpen = true;

      if (this.selectedDates.includes(t)) {
        for (let i = 0; i < this.selectedDates.length; ++i) {
          if (t === this.selectedDates[i]) {
            this.selectedDates.splice(i, 1);
            break;
          }
        }
      } else {
        if (scope.outside !== true) {
          this.selectedDates.push(t);
        }
      }
    },
    reserveHandler(bookingTime) {
      console.log("Booking Confirmed:", bookingTime);
      this.isDialogOpen = false;
    },
    closeHandler() {
      console.log("Booking Canceled");
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
    onMoved(data) {
      console.log("onMoved", data);
    },
    onChange(data) {
      console.log("onChange", data);
    },
    onClickDate(data) {
      console.log("onClickDate", data);
    },
    onClickInterval(data) {
      console.log("onClickInterval", data);
    },
    onClickHeadIntervals(data) {
      console.log("onClickHeadIntervals", data);
    },
    onClickHeadDay(data) {
      console.log("onClickHeadDay", data);
    },
  },
  mounted() {
    this.adjustCurrentTime();
      // now, adjust the time every minute
      this.intervalId = setInterval(() => {
        this.adjustCurrentTime()
      }, 60000)
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
  gap: 0.5rem; /* Adds spacing between buttons */
}

.calendar-header button {
  transition: background-color 0.3s ease;
  display: inline-flex;
  justify-content: center;
  align-items: center;
}

/* Material Icons */
.material-icons {
  font-size: 20px;
}

/* Calendar body */
.q-calendar {
  background-color: #f9f9f9;
}

.q-calendar-day__head {
  background-color: #e5f4e3;
  color: #1b4332;
}

.q-calendar-day__interval {
  color: #555;
}

/* Selected time styles */
.q-calendar-day__interval--selected {
  background-color: #d1e7dd !important;
  color: #155724 !important;
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

.q-dark .day-view-current-time-indicator,
.body--dark .day-view-current-time-indicator,
.q-calendar--dark .day-view-current-time-indicator {
  background-color: rgba(255, 255, 0, 0.85);
}

.q-dark .day-view-current-time-line,
.body--dark .day-view-current-time-line,
.q-calendar--dark .day-view-current-time-line {
  border-top: 2px solid rgba(255, 255, 0, 0.85);
}

</style>

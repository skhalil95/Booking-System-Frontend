<template>
  <BookingDialog :is-open="isDialogOpen" :booking-time="selectedBookingTime" :reserve-handler="reserveHandler"
    :close-handler="closeHandler" />
  <div class="calendar-container mx-auto p-4 shadow-lg bg-white rounded-lg">
    <div class="calendar-header flex justify-between items-center mb-4">
      <h3 class="text-green-700 text-xl font-bold">Weekly Calendar</h3>
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
        :weekdays="[0, 1, 2, 3, 4]" :disabled-before="disabledBefore" :interval-count="24" :interval-start="9"
        :interval-height="60" time-clicks-clamped :selected-dates="selectedDates" animated bordered
        @click-time="onToggleTime" @change="onChange" @moved="onMoved" @click-date="onClickDate"
        @click-interval="onClickInterval" @click-head-intervals="onClickHeadIntervals" @click-head-day="onClickHeadDay"
        class="rounded border border-gray-200 shadow-sm">
        <template #day-body="{ scope: { timestamp, timeStartPos, timeDurationHeight } }">
          <template v-for="event in getEvents(timestamp.date)" :key="event.id">
            <div v-if="event.time !== undefined" class="my-event" :class="badgeClasses(event, 'body')"
              :style="badgeStyles(event, 'body', timeStartPos, timeDurationHeight)">
              <span class="title q-calendar__ellipsis">
                {{ event.title === 'DISABLE' ? '' : 'BOOKED' }}
              </span>
            </div>
          </template>
        </template>


        <template #day-container="{ scope: { days } }">
          <template v-if="hasDate(days)">
            <div class="day-view-current-time-indicator" :style="style"></div>
            <div class="day-view-current-time-line" :style="style"></div>
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
  parsed,
  parseTime,
  isBetweenDates
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
    disabledBefore() {
      let ts = parseTimestamp(today())
      ts = addToDate(ts, { day: -1 })
      return ts.date
    },
    style() {
      return {
        top: this.timeStartPos + 'px'
      }
    },
    eventsMap() {
      const map = {}
      // this.events.forEach(event => (map[ event.date ] = map[ event.date ] || []).push(event))
      this.events.forEach(event => {
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
      events: [
        {
          id: 1,
          title: '1st of the Month',
          details: 'Everything is funny as long as it is happening to someone else',
          date: this.getCurrentDay(24),
          bgcolor: 'orange'
        },
        {
          id: 2,
          title: 'Sisters Birthday',
          details: 'Buy a nice present',
          date: this.getCurrentDay(4),
          bgcolor: 'green',
          icon: 'fas fa-birthday-cake'
        },
        {
          id: 3,
          title: 'Meeting',
          details: 'Time to pitch my idea to the company',
          date: this.getCurrentDay(10),
          time: '10:00',
          duration: 120,
          bgcolor: 'red',
          icon: 'fas fa-handshake'
        },
        {
          id: 4,
          title: 'Lunch',
          details: 'Company is paying!',
          date: this.getCurrentDay(10),
          time: '11:30',
          duration: 90,
          bgcolor: 'teal',
          icon: 'fas fa-hamburger'
        },
        {
          id: 5,
          title: 'Visit mom',
          details: 'Always a nice chat with mom',
          date: this.getCurrentDay(20),
          time: '17:00',
          duration: 90,
          bgcolor: 'grey',
          icon: 'fas fa-car'
        },
        {
          id: 6,
          title: 'BOOKED',
          details: 'Teaching Javascript 101',
          date: this.getCurrentDay(24),
          time: '08:00',
          duration: 60,
          bgcolor: 'teal',
          icon: 'fas fa-chalkboard-teacher'
        },
        {
          id: 7,
          title: 'BOOKED',
          details: 'Meet GF for dinner at Swanky Restaurant',
          date: this.getCurrentDay(22),
          time: '19:00',
          duration: 60,
          bgcolor: 'teal',
          icon: 'fas fa-utensils'
        },
        {
          id: 8,
          title: 'Fishing',
          details: 'Time for some weekend R&R',
          date: this.getCurrentDay(27),
          bgcolor: 'purple',
          icon: 'fas fa-fish',
          days: 2
        },
        {
          id: 9,
          title: 'Vacation',
          details: 'Trails and hikes, going camping! Don\'t forget to bring bear spray!',
          date: this.getCurrentDay(29),
          bgcolor: 'purple',
          icon: 'fas fa-plane',
          days: 5
        },
        { id: 10, title: 'DISABLE', date: this.getCurrentDay(24), time: '09:00', duration: 60 },
        { id: 12, title: 'DISABLE', date: this.getCurrentDay(24), time: '16:00', duration: 60 }
      ]
    };
  },
  methods: {

    addDisableEvents() {
      const disableStartTime = "09:00"; // Starting time for disable intervals
      const todayDate = new Date(); // Today's date
      const todayTimestamp = this.getCurrentDay(todayDate.getDate()); // Today's formatted date
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
        this.events.push({
          id: this.events.length + 1, // Unique ID for the event
          title: "DISABLE",
          date: timestamp.date,
          time: this.formatTime(intervalStart), // Format time as HH:mm
          duration: 60, // Duration in minutes
          bgcolor: "gray"
        });

        // Increment time by 1 hour (60 minutes)
        startTime += 60;
      }
    },
    formatTime(minutes) {
      // Convert minutes to HH:mm format
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
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
    badgeClasses(event, type) {
      if (event.title === 'DISABLE')
        return 'disabled-slot full-width'
      const isHeader = type === 'header'
      return {
        [`text-white bg-${event.bgcolor}`]: true,
        'full-width': !isHeader && (!event.side || event.side === 'full'),
        'left-side': !isHeader && event.side === 'left',
        'right-side': !isHeader && event.side === 'right',
        'rounded-border': true
      }
    },

    badgeStyles(event, type, timeStartPos = undefined, timeDurationHeight = undefined) {
      const s = {}
      if (timeStartPos && timeDurationHeight) {
        s.top = timeStartPos(event.time) + 'px'
        s.height = timeDurationHeight(event.duration) + 'px'
      }
      s['align-items'] = 'flex-start'
      return s
    },

    getEvents(dt) {
      // get all events for the specified date
      const events = this.eventsMap[dt] || []

      if (events.length === 1) {
        events[0].side = 'full'
      }
      else if (events.length === 2) {
        // this example does no more than 2 events per day
        // check if the two events overlap and if so, select
        // left or right side alignment to prevent overlap
        const startTime = addToDate(parsed(events[0].date), { minute: parseTime(events[0].time) })
        const endTime = addToDate(startTime, { minute: events[0].duration })
        const startTime2 = addToDate(parsed(events[1].date), { minute: parseTime(events[1].time) })
        const endTime2 = addToDate(startTime2, { minute: events[1].duration })
        if (isBetweenDates(startTime2, startTime, endTime, true) || isBetweenDates(endTime2, startTime, endTime, true)) {
          events[0].side = 'left'
          events[1].side = 'right'
        }
        else {
          events[0].side = 'full'
          events[1].side = 'full'
        }
      } console.log(events)

      return events
    },

    hasDate(days) {
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
    this.addDisableEvents();
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
  gap: 0.5rem;
  /* Adds spacing between buttons */
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

.text-white {
  color: white;
}

.bg-blue {
  background: blue;
}

.bg-green {
  background: green;
}

.bg-orange {
  background: orange;
}

.bg-red {
  background: red;
}

.bg-teal {
  background: teal;
}

.bg-grey {
  background: grey;
}

.bg-purple {
  background: purple;
}

.full-width {
  left: 0;
  width: calc(100% - 2px);
}

.left-side {
  left: 0;
  width: calc(50% - 3px);
}

.right-side {
  left: 50%;
  width: calc(50% - 3px);
}

.rounded-border {
  border-radius: 2px;
}

.disabled-slot {
  cursor: not-allowed;
  /* Indicate non-clickable */
}
</style>

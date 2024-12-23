<template>
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
        :interval-count="96"
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
      />
    </div>
  </div>
</template>

<script>
import {
  QCalendarDay,
  today,
  copyTimestamp,
  getDateTime,
} from "@quasar/quasar-ui-qcalendar/src/index.js";
import "@quasar/quasar-ui-qcalendar/src/QCalendarVariables.sass";
import "@quasar/quasar-ui-qcalendar/src/QCalendarTransitions.sass";
import "@quasar/quasar-ui-qcalendar/src/QCalendarDay.sass";

import { defineComponent } from "vue";

export default defineComponent({
  name: "CalendarView",
  components: {
    QCalendarDay,
  },
  data() {
    return {
      selectedDate: today(),
      selectedDates: [],
    };
  },
  methods: {
    onToggleTime({ scope }) {
      if (scope === undefined) {
        return;
      }

      const ts = copyTimestamp(scope.timestamp);
      const t = getDateTime(ts);

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
});
</script>

<style scoped>
/* Calendar container styles */
.calendar-container {
  width: 99%;
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
</style>

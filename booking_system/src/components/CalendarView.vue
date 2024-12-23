<template>
 <div class="row justify-center">
      <div style="display: flex; max-width: 800px; width: 100%; height: 200px;">
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
        />
      </div>
    </div>
</template>


<script>
import {
  QCalendarDay,
  today,
  copyTimestamp,
  getDateTime
} from '@quasar/quasar-ui-qcalendar/src/index.js'
import '@quasar/quasar-ui-qcalendar/src/QCalendarVariables.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarTransitions.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarDay.sass'

import { defineComponent } from 'vue'

export default defineComponent({
  name: 'WeekSelectedIntervals',
  components: {
    QCalendarDay
  },
  data () {
    return {
      selectedDate: today(),
      selectedDates: []
    }
  },
  methods: {
    onToggleTime ({ scope }) {
      console.log('click-time (scope)', scope)
      if (scope === undefined) {
        return
      }

      // make a copy of the timestamp
      const ts = copyTimestamp(scope.timestamp)

      // get date with time
      const t = getDateTime(ts)

      // toggle to/from array
      if (this.selectedDates.includes(t)) {
        // remove the date
        for (let i = 0; i < this.selectedDates.length; ++i) {
          if (t === this.selectedDates[ i ]) {
            this.selectedDates.splice(i, 1)
            break
          }
        }
      }
      else {
        // add the date if not outside
        if (scope.outside !== true) {
          this.selectedDates.push(t)
        }
      }
    },

    onToday () {
      this.$refs.calendar.moveToToday()
    },
    onPrev () {
      this.$refs.calendar.prev()
    },
    onNext () {
      this.$refs.calendar.next()
    },
    onMoved (data) {
      console.log('onMoved', data)
    },
    onChange (data) {
      console.log('onChange', data)
    },
    onClickDate (data) {
      console.log('onClickDate', data)
    },
    // onClickTime (data) {
    //   console.log('onClickTime', data)
    // },
    onClickInterval (data) {
      console.log('onClickInterval', data)
    },
    onClickHeadIntervals (data) {
      console.log('onClickHeadIntervals', data)
    },
    onClickHeadDay (data) {
      console.log('onClickHeadDay', data)
    }
  }
})
</script>

<style scoped>
.item {
  margin-top: 2rem;
  display: flex;
  position: relative;
}

.details {
  flex: 1;
  margin-left: 1rem;
}

i {
  display: flex;
  place-items: center;
  place-content: center;
  width: 32px;
  height: 32px;

  color: var(--color-text);
}

h3 {
  font-size: 1.2rem;
  font-weight: 500;
  margin-bottom: 0.4rem;
  color: var(--color-heading);
}

@media (min-width: 1024px) {
  .item {
    margin-top: 0;
    padding: 0.4rem 0 1rem calc(var(--section-gap) / 2);
  }

  i {
    top: calc(50% - 25px);
    left: -26px;
    position: absolute;
    border: 1px solid var(--color-border);
    background: var(--color-background);
    border-radius: 8px;
    width: 50px;
    height: 50px;
  }

  .item:before {
    content: ' ';
    border-left: 1px solid var(--color-border);
    position: absolute;
    left: 0;
    bottom: calc(50% + 25px);
    height: calc(50% - 25px);
  }

  .item:after {
    content: ' ';
    border-left: 1px solid var(--color-border);
    position: absolute;
    left: 0;
    top: calc(50% + 25px);
    height: calc(50% - 25px);
  }

  .item:first-of-type:before {
    display: none;
  }

  .item:last-of-type:after {
    display: none;
  }
}
</style>

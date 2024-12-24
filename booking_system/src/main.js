import { createApp } from 'vue';
import App from './App.vue';
import './assets/main.css';


import { Quasar } from 'quasar';
import 'quasar/dist/quasar.css';

import { QCalendar } from '@quasar/quasar-ui-qcalendar';
import { QDialog, QBtn, QCard, QCardSection, QCardActions } from 'quasar';
import '@quasar/quasar-ui-qcalendar/dist/index.css';



const app = createApp(App);

app.use(Quasar, {
  components: {
    QCalendar,
    QDialog,
    QBtn,
    QCard,
    QCardSection,
    QCardActions,
  },
});

app.mount('#app');

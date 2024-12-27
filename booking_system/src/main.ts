import { createApp } from 'vue';
import App from './App.vue';
import './assets/main.css';
import router from '@/router';


import { Quasar } from 'quasar';

import store from './store';
import 'quasar/dist/quasar.css';

import { QCalendar } from '@quasar/quasar-ui-qcalendar';
import { QDialog, QBtn, QCard, QCardSection, QCardActions, QInput, QSeparator, QIcon } from 'quasar';
import '@quasar/quasar-ui-qcalendar/dist/index.css';
import './output.css'



const app = createApp(App);

app.use(store)
app.use(router);

app.use(Quasar, {
  components: {
    QCalendar,
    QDialog,
    QBtn,
    QCard,
    QCardSection,
    QCardActions,
    QInput,
    QSeparator,
    QIcon
  },
});

app.mount('#app');

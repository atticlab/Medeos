<template>
  <v-app id="keep">
    <navigation></navigation>
    <v-content>
      <v-container>
          <h1 class="display-2">Medical <span class="font-weight-light">Records</span></h1>
          <v-divider class="mb-4"></v-divider>
 
        <v-card v-for="r in records" color="white">
          <v-card-title primary-title>
            <div>
              <h3 class="headline mb-0">Record from {{r.created_at}}</h3>
              <div>Doctor: <b>{{r.doctor}}</b></div>
              <div>{{r.data}}</div>
            </div>
          </v-card-title>        
        </v-card>

      </v-container>
    </v-content>
  </v-app>
</template>

<script>
  import Navigation from './Navigation.vue'
  import Config from '../config'
  import Moment from 'moment';

  export default {
  	 components: {
      'navigation': Navigation,
    },
    data: () => ({
        records: [],
    }),
    mounted : function() {
      var data = [];
      var records = this.$eosio.returnRecords();

      for (var i = 0; i < records.records.length; i++) {
        var r = records.records[i]
        if (this.$route.query.ids.indexOf(r.index) == -1) {
          continue
        }

        var pk = this.$eosio.getPrivateForSeed(Config.patientSeed, r.index)
        var decrypted = this.$eosio.decrypt(r.data, pk);

        data.push({
          created_at: Moment(r.created_at / 1000).format('MMMM Do YYYY, h:mm:ss a'),
          doctor: r.doctor,
          data: decrypted,
        })
      }

      this.records = data
    }
  }
</script>
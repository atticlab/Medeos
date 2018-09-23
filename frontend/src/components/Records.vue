<template>
  <v-app id="keep">
    <navigation></navigation>
    <v-content>
      <v-container>

          <h1 style="position: relative" class="display-2">John Doe
          <router-link to="/add">
            <v-btn color="pink" fab dark small>
              <v-icon>add</v-icon>
            </v-btn>
          </router-link>
            </h1>
        <v-divider class="mb-3"></v-divider>
          <v-alert :value="success" type="success" class="mb-4">Patient's record added.</v-alert>
          <div v-if="loading">    <v-progress-circular
      :width="3"
      color="green"
      indeterminate
    ></v-progress-circular></div>
        <v-data-table v-else
          v-model="selected"
          :headers="headers"
          :items="records"
          :pagination.sync="pagination"
          select-all
          item-key="rid"
          class="elevation-1"
        >
          <template slot="headers" slot-scope="props">
            <tr>
              <th>
                <v-checkbox
                  :input-value="props.all"
                  :indeterminate="props.indeterminate"
                  primary
                  hide-details
                  @click.native="toggleAll"
                ></v-checkbox>
              </th>
              <th
                v-for="header in props.headers"
                :key="header.text"
                :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']"
                @click="changeSort(header.value)"
              >
                <v-icon small>arrow_upward</v-icon>
                {{ header.text }}
              </th>
            </tr>
          </template>
          <template slot="items" slot-scope="props">
            <tr :active="props.selected" @click="props.selected = !props.selected">
              <td>
                <v-checkbox
                  :input-value="props.selected"
                  primary
                  hide-details
                ></v-checkbox>
              </td>
              <td>{{ moment(props.item.created_at / 1000).format('MMMM Do YYYY, h:mm:ss a') }}</td>
              <td class="text-center">{{ props.item.doctor }}</td>
              <td class="text-center">Cardiologist</td>
              <td class="text-center">St. Sophia Hospital, NY</td>
            </tr>
          </template>
        </v-data-table>
        <v-btn @click="dialog = true" v-if="selected.length > 0" fab dark large fixed right bottom color="purple">
          <v-icon>compare_arrows</v-icon>
        </v-btn>
      </v-container>
    </v-content>

    <div class="text-xs-center">
      <v-dialog
        v-model="dialog"
        width="500"
      >
        <v-card>
          <v-card-title
            class="headline grey lighten-2"
            primary-title
          >
            Data request from doctor
          </v-card-title>

          <v-card-text>
            Doctor requests data acces to following records:
            <ul>
              <li v-for="item in selected">
                Record from <i>{{ moment(item.created_at / 1000).format('MMMM Do YYYY, h:mm:ss a') }} {{ item.rid }}</i>
              </li>
            </ul>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
              <v-btn
                color="primary"
                flat
                @click="showData"
              >
                I accept
              </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </v-app>
</template>

<script>
  import Navigation from './Navigation.vue'
  import Moment from 'moment';

  export default {
    components: {
      'navigation': Navigation,
    },
    data: () => ({
      pagination: {
        sortBy: 'date'
      },
      moment: Moment,
      loading: true,
      selected: [],
      headers: [
        {
          text: 'Date',
          align: 'left',
          value: 'created_at'
        },
        { text: 'Doctor', value: 'doctor' },
        { text: 'Speciality', value: 'speciality' },
        { text: 'Hospital', value: 'hospital' },
      ],
      dialog: false,
      records: [],
      success: false,
    }),

    methods: {
      toggleAll () {
        if (this.selected.length) this.selected = []
        else this.selected = this.records.slice()
      },
      changeSort (column) {
        if (this.pagination.sortBy === column) {
          this.pagination.descending = !this.pagination.descending
        } else {
          this.pagination.sortBy = column
          this.pagination.descending = false
        }
      },
      showData: function() {
        var ids = [];
        for (var i = 0; i < this.selected.length; i++) {
          ids.push(this.selected[i].index)
        }

        this.$router.push({ path: 'record', query: { ids: ids }});
      }
    },

    mounted : function() {
      this.success = this.$route.query.success;

      this.$eosio.getRecords()
        .then(r => {
          this.loading = false;
          this.records = r.records
        })
        .catch(e => {
          this.loading = false;
          console.log("err", e)
        })
      //  = [
      //   {
      //     value: false,
      //     date: '2018-05-01',
      //     name: 'Alexander',
      //     speciality: 'Cardiologist',
      //     hospital: 'St. Sophia Hospital, NY'
      //   }
      // ]
    }
  }
</script>
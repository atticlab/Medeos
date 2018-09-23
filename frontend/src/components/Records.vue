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
        <v-data-table
          v-model="selected"
          :headers="headers"
          :items="records"
          :pagination.sync="pagination"
          select-all
          item-key="name"
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
              <td>{{ props.item.date }}</td>
              <td class="text-center">{{ props.item.name }}</td>
              <td class="text-center">{{ props.item.speciality }}</td>
              <td class="text-center">{{ props.item.hospital }}</td>
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
              <li>1</li>
              <li>2</li>
              <li>4</li>
            </ul>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <router-link to="/record">
              <v-btn
                color="primary"
                flat
                @click="dialog = false"
              >
                I accept
              </v-btn>
            </router-link>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </v-app>
</template>

<script>
  import Navigation from './Navigation.vue'

  export default {
    components: {
      'navigation': Navigation,
    },
    data: () => ({
      pagination: {
        sortBy: 'date'
      },
      selected: [],
      headers: [
        {
          text: 'Date',
          align: 'left',
          value: 'date'
        },
        { text: 'Doctor', value: 'name' },
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
      }
    },

    mounted : function() {
      this.success = this.$route.query.success;
      this.records = [
        {
          value: false,
          date: '2018-05-01',
          name: 'Alexander',
          speciality: 'Cardiologist',
          hospital: 'St. Sophia Hospital, NY'
        }
      ]
    }
  }
</script>
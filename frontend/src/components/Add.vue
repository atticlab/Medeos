<template>
  <v-app id="keep">
    <navigation></navigation>
    <v-content>
      <v-container>
          <h1 class="display-2">Add <span class="font-weight-light">Record</span></h1>
          <v-divider class="mb-4"></v-divider>
          
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-text-field
              label="Examination date"
              :value="getDate"
            ></v-text-field>
            <v-text-field
              label="Patient"
              value="John Doe"
            ></v-text-field>

            <v-textarea
              v-model="complaints"
              :rules="complaintsRules"
              label="Complaints"
            ></v-textarea>

    		    <v-text-field
    		      v-model="prediagnosis"
    		      label="Preliminary diagnosis"
    		    ></v-text-field>

            <v-textarea
              v-model="examination"
              :rules="examinationRules"
              label="Objective Examination"
            ></v-textarea>

            <v-text-field
              v-model="diagnosis"
              label="Diagnosis"
              :rules="diagnosesRules"
            ></v-text-field>

            <v-textarea
              v-model="prescriptions"
              label="Prescriptions"
              :rules="prescriptionsRules"
            ></v-textarea>

    		    <v-btn
    		      :disabled="!valid"
    		      @click="submit"
    		    >
    		      submit
    		    </v-btn>
    		    <v-btn @click="clear">clear</v-btn>
    		  </v-form>

      </v-container>
    </v-content>
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
      valid: true,
      prediagnosis: '',
      complaints: '',
      complaintsRules: [
        v => !!v || 'Please add some information',
      ],
      diagnosis: '',
      diagnosesRules: [
        v => !!v || 'Please add some information',
      ],
      examination: '',
      examinationRules: [
        v => !!v || 'Please add some information',
      ],
      prescriptions: '',
      prescriptionsRules: [
        v => !!v || 'Please add some information',
      ],
    }),
    methods: {
      submit () {
        if (this.$refs.form.validate()) {
          this.$eosio.addRecord({
            prediagnosis: this.prediagnosis,
            complaints: this.complaints,
            diagnosis: this.diagnosis,
            examination: this.examination,
            prescriptions: this.prescriptions,
          })
          .then(() => {
            this.$router.push({ path: 'records', query: { success: true }});
          })
          .catch(err => {
            console.log(err)
          })
        }
      },
      clear () {
        this.$refs.form.reset()
      }
    },
    computed: {
      getDate: function () {
        return Moment().format('MMMM Do YYYY, h:mm:ss a');
      }
    }
  }
</script>
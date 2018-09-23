<template>
  <v-app id="keep">
    <navigation></navigation>
    <v-content>
      <v-container>
          <h1 class="display-2">Doctor <span class="font-weight-light">Dashboard</span></h1>
          <v-divider></v-divider>
          <v-btn @click="dialog = true" fab dark large fixed right bottom color="purple">
            <v-icon>fullscreen</v-icon>
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
            Scan user code
          </v-card-title>

          <v-card-text>
            <img src="@/assets/qr.jpg" alt="Vuetify.js" class="mb-5" style="max-width:100%">
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <router-link to="/records">
            <v-btn
              color="primary"
              @click="dialog = false"
            >
              Done
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
      dialog: false
    })
  }
</script>
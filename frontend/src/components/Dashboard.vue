<template>
  <v-app id="keep">
    <navigation></navigation>
    <v-content>
      <v-container>
          <h1 class="display-2">Doctor <span class="font-weight-light">Dashboard</span></h1>
          <v-divider></v-divider>
            <router-link to="/records">
              <v-btn fab dark large fixed right bottom color="purple">
                <v-icon>fullscreen</v-icon>
              </v-btn>
          </router-link>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
  import Navigation from './Navigation.vue'

  export default {
    components: {
      'navigation': Navigation,
    },
  }
</script>